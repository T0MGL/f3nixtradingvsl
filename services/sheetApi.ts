// services/sheetApi.ts

// URL de producción conectada a tu Google Sheet
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

export interface Lead {
    id: string;
    date: string;
    name: string;
    phone: string;
    email: string;
    experience: string;
    capital: string;
    time: string;
    goal: string;
    offer: string; // Nuevo campo: 'Standard $327' o 'Downsell $127'
    status: 'cold' | 'warm' | 'hot';
    contacted?: boolean;
    converted?: boolean;
    lost?: boolean; // Nuevo estado
}

// Helper para enviar datos al script
const postToSheet = async (payload: any) => {
    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            mode: 'no-cors' // 'no-cors' es necesario para scripts de Google simples, aunque hace la respuesta opaca.
        });
        return true;
    } catch (error) {
        console.error("Error connecting to sheet", error);
        return false;
    }
};

export const submitLead = async (data: Omit<Lead, 'id' | 'date' | 'status' | 'converted' | 'contacted' | 'lost'>) => {
    try {
        // --- LÓGICA DE CLASIFICACIÓN (Misma lógica previa) ---
        let calculatedStatus: 'cold' | 'warm' | 'hot' = 'cold';
        const { capital, experience, time } = data;
        const isHighCapital = capital === '$2,000 - $10,000' || capital === 'Más de $10,000';
        const isMediumCapital = capital === '$500 - $2,000';
        const hasExperience = experience === 'Intermedio' || experience === 'Avanzado';

        if (isHighCapital) calculatedStatus = 'hot';
        else if (isMediumCapital && hasExperience) calculatedStatus = 'hot';
        else if (isMediumCapital && experience === 'Novato') calculatedStatus = 'warm';
        else if (capital === 'Menos de $500' && experience === 'Avanzado') calculatedStatus = 'warm';
        else calculatedStatus = 'cold';

        if (time === 'Poco Tiempo' && !isHighCapital) calculatedStatus = 'cold';
        // --- FIN LÓGICA ---

        const payload = {
            action: 'create', // Le dice al script que cree una fila
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            status: calculatedStatus,
            contacted: false,
            converted: false,
            lost: false
        };

        return await postToSheet(payload);

    } catch (error) {
        console.error("Error submitting lead", error);
        return false;
    }
};

export const getLeads = async (): Promise<Lead[]> => {
    try {
        // AGREGADO: ?t=${new Date().getTime()}
        // Esto evita que el navegador use la memoria caché y fuerza una descarga real de los datos nuevos.
        const response = await fetch(`${SCRIPT_URL}?t=${new Date().getTime()}`);
        const data = await response.json();

        // Google Sheets devuelve strings ("TRUE", "FALSE") o booleanos dependiendo de la celda.
        // Normalizamos los datos para que el frontend no falle.
        return data.map((item: any) => ({
            ...item,
            // Aseguramos que status sea uno válido
            status: ['hot', 'warm', 'cold'].includes(item.status) ? item.status : 'cold',
            // Default offer si no existe
            offer: item.offer || 'Standard $327',
            // Convertimos valores de Sheets a Booleans reales
            contacted: item.contacted === true || item.contacted === "TRUE",
            converted: item.converted === true || item.converted === "TRUE",
            lost: item.lost === true || item.lost === "TRUE"
        })).reverse(); // Mostrar los más recientes primero
    } catch (error) {
        console.error("Error fetching leads", error);
        return [];
    }
};

// Actualizar estado de Venta (Requiere el valor actual para invertirlo)
export const toggleLeadConversion = async (id: string, currentValue: boolean): Promise<boolean> => {
    const payload = {
        action: 'update',
        id: id,
        field: 'converted',
        value: !currentValue // Enviamos el valor opuesto
    };
    return await postToSheet(payload);
};

// Actualizar estado de Contacto
export const toggleLeadContacted = async (id: string, currentValue: boolean, forceValue?: boolean): Promise<boolean> => {
    const newValue = forceValue !== undefined ? forceValue : !currentValue;
    const payload = {
        action: 'update',
        id: id,
        field: 'contacted',
        value: newValue
    };
    return await postToSheet(payload);
};

// Actualizar estado de Perdido (Lost)
export const toggleLeadLost = async (id: string, currentValue: boolean): Promise<boolean> => {
    const payload = {
        action: 'update',
        id: id,
        field: 'lost',
        value: !currentValue
    };
    return await postToSheet(payload);
};