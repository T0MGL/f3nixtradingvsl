import React, { useState, useEffect } from 'react';
import { X, ChevronRight, CheckCircle, Lock, Smartphone, Brain, TrendingUp, User, ArrowLeft, Target, Clock, Wallet, Coins, Briefcase, Gem, MessageCircle, Info, AlertTriangle, ArrowDown } from 'lucide-react';
import { submitLead } from '../services/sheetApi';
import { trackEvent } from '../utils/metaPixel';

interface LeadFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Tarjeta de Selección
const SelectionCard = ({
    icon: Icon,
    title,
    subtitle,
    selected,
    onClick,
    specialIconStyle = false
}: {
    icon: any,
    title: string,
    subtitle?: string,
    selected: boolean,
    onClick: () => void,
    specialIconStyle?: boolean
}) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-300 group relative overflow-hidden ${selected
            ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] scale-[1.02]'
            : 'bg-zinc-900/50 border-white/5 hover:border-white/20 hover:bg-zinc-800'
            }`}
    >
        <div className="flex items-center gap-4 relative z-10">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${selected
                ? 'bg-amber-500 text-black'
                : specialIconStyle
                    ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/20 text-green-500 group-hover:border-green-400'
                    : 'bg-zinc-800 text-gray-400 group-hover:bg-zinc-700'
                }`}>
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <h4 className={`font-bold text-sm md:text-base ${selected ? 'text-amber-500' : 'text-white group-hover:text-white'}`}>
                    {title}
                </h4>
                {subtitle && (
                    <p className="text-[11px] md:text-xs text-gray-500 mt-1 leading-tight group-hover:text-gray-400">
                        {subtitle}
                    </p>
                )}
            </div>
            {selected && (
                <div className="bg-amber-500 rounded-full p-1 animate-scale-in">
                    <CheckCircle size={16} className="text-black" />
                </div>
            )}
        </div>
    </button>
);

// Componente de Nota del Mentor (Humanizado, estilo Mensaje Directo)
const MentorNote = ({ text, type = "info" }: { text: string, type?: "info" | "alert" }) => (
    <div className={`
        mb-5 flex gap-3 items-start p-3 rounded-lg border-l-2 animate-fade-in
        ${type === 'info' ? 'bg-blue-500/5 border-blue-500/40' : 'bg-amber-500/5 border-amber-500/40'}
    `}>
        <div className={`mt-0.5 shrink-0 ${type === 'info' ? 'text-blue-400' : 'text-amber-400'}`}>
            {type === 'info' ? <MessageCircle size={16} /> : <Lock size={16} />}
        </div>
        <div>
            <p className={`text-xs leading-relaxed font-medium ${type === 'info' ? 'text-blue-100/90' : 'text-amber-100/90'}`}>
                <span className="opacity-50 text-[10px] uppercase tracking-wider font-bold block mb-1">
                    {type === 'info' ? 'Nota del Instructor:' : 'Confidencial:'}
                </span>
                "{text}"
            </p>
        </div>
    </div>
);

export const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Downsell Logic with Exit Confirmation
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    const [showDownsell, setShowDownsell] = useState(false);
    const [offerType, setOfferType] = useState<'Standard $327' | 'Downsell $127'>('Standard $327');

    const TOTAL_STEPS = 5;

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        experience: '',
        capital: '',
        time: '',
        goal: ''
    });

    // Reset al abrir
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setIsSuccess(false);
            setIsAnalyzing(false);
            setShowExitConfirmation(false);
            setShowDownsell(false);
            setOfferType('Standard $327');
            setFormData({ name: '', phone: '', experience: '', capital: '', time: '', goal: '' });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setFormData({ ...formData, phone: value });
    };

    const handleSelection = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        setTimeout(() => {
            if (step < TOTAL_STEPS) {
                setStep(step + 1);
            }
        }, 250);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleNext = () => {
        if (step === TOTAL_STEPS - 1) {
            setIsAnalyzing(true);
            setTimeout(() => {
                setIsAnalyzing(false);
                setStep(step + 1);
            }, 2000);
        } else {
            if (step < TOTAL_STEPS) setStep(step + 1);
        }
    };

    // --- TWO-STEP EXIT FLOW: CONFIRMATION THEN DOWNSELL ---
    const handleCloseAttempt = () => {
        // Si ya compró, o está en el primer paso, cerramos normal
        if (step === 1 || isSuccess) {
            onClose();
            // Si ya mostró confirmación o downsell, cerramos
        } else if (showExitConfirmation || showDownsell) {
            onClose();
            // Ya aceptó el downsell y quiere cerrar
        } else if (offerType === 'Downsell $127') {
            onClose();
        } else {
            // PASO 1: Mostrar confirmación primero
            setShowExitConfirmation(true);
        }
    };

    // Usuario confirma que SÍ quiere salir → Mostrar downsell
    const confirmExit = () => {
        setShowExitConfirmation(false);
        setShowDownsell(true);
    };

    // Usuario dice que NO quiere salir (fue accidental) → Volver al formulario
    const cancelExit = () => {
        setShowExitConfirmation(false);
    };

    const acceptDownsell = () => {
        setOfferType('Downsell $127');
        setShowDownsell(false);
        // El usuario se queda en el mismo paso y continua llenando
    };

    const rejectDownsell = () => {
        onClose();
    };
    // --------------------------------------------

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const finalData = {
            ...formData,
            phone: `+${formData.phone}`,
            offer: offerType // Enviamos qué oferta aceptó
        };

        const success = await submitLead(finalData);

        setIsSubmitting(false);
        if (success) {
            setIsSuccess(true);

            // --- TRACKING PURCHASE (SIMULATED) ---
            // IMPORTANTE: Al enviar el valor, habilitamos la optimización de ROAS en Meta.
            // Esto ayuda al algoritmo a distinguir entre clientes de alto valor.

            const purchaseValue = offerType === 'Downsell $127' ? 127.00 : 327.00;

            trackEvent('Purchase', {
                value: purchaseValue,
                currency: 'USD',
                content_name: offerType, // Ej: 'Standard $327'
                content_type: 'product', // Requerido para Dynamic Ads
                num_items: 1,

                // Custom Properties (Datos extra útiles para crear audiencias personalizadas luego)
                lead_experience: formData.experience,
                lead_capital: formData.capital
            });
            // ---------------------
        }
    };

    const getHeaderInfo = () => {
        switch (step) {
            case 1: return { title: "Evaluación de Perfil", subtitle: "Vamos a ver si calificas para el equipo Fenix." };
            case 2: return { title: "Tiempo Disponible", subtitle: "El trading requiere enfoque, no horas silla." };
            case 3: return { title: "Recursos Disponibles", subtitle: "Para saber si asignarte a cuenta personal o fondeo." };
            case 4: return { title: "Tus Datos", subtitle: "Para agendar tu sesión estratégica." };
            case 5: return { title: "Tu Compromiso", subtitle: "Confirma tu objetivo." };
            default: return { title: "", subtitle: "" };
        }
    };

    const getTimeFeedback = () => {
        if (formData.experience === 'Novato') return "Al iniciar desde cero, tu ventaja es que no tienes 'malos hábitos'. Adaptaremos tu curva de aprendizaje a tu horario actual, sin saturarte.";
        if (formData.experience === 'Intermedio') return "Muchos traders intermedios pierden por 'sobre-operar'. Si tienes poco tiempo, úsalo a tu favor para enfocarte solo en calidad, no cantidad.";
        if (formData.experience === 'Avanzado') return "Para escalar a cuentas de fondeo grandes, solo necesitas estar presente en la apertura de Londres o New York. El resto del día es libre.";
        return "La consistencia vale más que la cantidad de horas. Adaptaremos el plan a tu rutina.";
    };

    const headerInfo = getHeaderInfo();

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity animate-fade-in"
                onClick={handleCloseAttempt}
            ></div>

            <div className="relative w-full max-w-lg flex flex-col max-h-[90vh]">

                {/* Barra de Progreso (Solo si no es éxito, no analizando, y NO mostrando downsell ni confirmación) */}
                {!isSuccess && !isAnalyzing && !showDownsell && !showExitConfirmation && (
                    <div className="mb-6 flex items-center gap-3 px-1">
                        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)] ${offerType === 'Downsell $127' ? 'bg-gradient-to-r from-red-600 to-orange-500' : 'bg-gradient-to-r from-amber-600 to-amber-400'}`}
                                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                            ></div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${offerType === 'Downsell $127' ? 'text-orange-500' : 'text-amber-500'}`}>Paso {step}/{TOTAL_STEPS}</span>
                    </div>
                )}

                {/* INDICADOR DE OFERTA APLICADA (Si aceptó el downsell) */}
                {offerType === 'Downsell $127' && !isSuccess && !isAnalyzing && !showDownsell && !showExitConfirmation && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center py-2 rounded-t-xl mx-4 mb-[-10px] relative z-0 animate-slide-up-fade">
                        OFERTA ESPECIAL $127 APLICADA
                    </div>
                )}

                <div className="bg-[#050505] border border-white/10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,1)] overflow-hidden flex flex-col relative min-h-[480px]">

                    {/* Fondo Decorativo */}
                    <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] pointer-events-none rounded-full ${showDownsell ? 'bg-red-600/10' : showExitConfirmation ? 'bg-orange-600/10' : 'bg-amber-500/5'}`} />

                    {/* Header del Modal */}
                    {!isAnalyzing && !isSuccess && !showDownsell && !showExitConfirmation && (
                        <div className="flex justify-between items-start p-6 pb-0 relative z-10">
                            <div>
                                {step > 1 && (
                                    <button type="button" onClick={handleBack} className="text-gray-600 hover:text-white transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider mb-2">
                                        <ArrowLeft size={12} /> Anterior
                                    </button>
                                )}
                                <h2 className="text-2xl font-bold text-white leading-none mb-1">{headerInfo.title}</h2>
                                <p className="text-gray-500 text-sm font-light">{headerInfo.subtitle}</p>
                            </div>
                            <button type="button" onClick={handleCloseAttempt} className="bg-white/5 hover:bg-white/10 p-2 rounded-full text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    )}

                    {/* Contenido Dinámico */}
                    <div className="p-6 md:p-8 pt-6 overflow-y-auto relative z-10 flex-1 flex flex-col justify-center">

                        {/* --- EXIT CONFIRMATION SCREEN (STEP 1) --- */}
                        {showExitConfirmation ? (
                            <div className="animate-scale-in text-center relative z-20">
                                <div className="flex flex-col items-center mb-8">
                                    <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20 mb-4">
                                        <AlertTriangle size={36} className="text-orange-500" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-3">
                                        ¿Seguro que quieres salir?
                                    </h3>
                                    <p className="text-gray-400 text-base leading-relaxed max-w-md mx-auto">
                                        Si fue un click accidental, podemos volver donde estabas.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={cancelExit}
                                        className="w-full gold-gradient-bg text-black font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] active:scale-98 transition-all text-base uppercase tracking-wide"
                                    >
                                        Volver al Formulario
                                    </button>
                                    <button
                                        onClick={confirmExit}
                                        className="w-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-medium py-3 rounded-xl transition-colors text-sm"
                                    >
                                        Sí, quiero salir
                                    </button>
                                </div>
                            </div>
                        ) : showDownsell ? (
                            <div className="animate-scale-in text-center relative z-20">

                                {/* Header Icon + Text */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.2)] mb-4 animate-pulse">
                                        <AlertTriangle size={36} className="text-red-500" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-black text-white italic tracking-tight leading-none mb-2">
                                        ¡ESPERA! NO TE VAYAS AÚN...
                                    </h3>
                                    <p className="text-gray-400 text-sm font-light leading-relaxed max-w-xs mx-auto">
                                        Entiendo que el precio puede ser una barrera. <br />
                                        <span className="text-white font-medium">Eliminemos esa excusa ahora mismo.</span>
                                    </p>
                                </div>

                                {/* Black Card */}
                                <div className="bg-[#111] border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden shadow-2xl">

                                    {/* Title inside card */}
                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mb-4 text-center">
                                        Oferta Única de Retención
                                    </div>

                                    {/* Pricing */}
                                    <div className="flex items-center justify-center gap-4 mb-6">
                                        <div className="relative">
                                            <span className="text-3xl text-gray-600 font-bold">$327</span>
                                            {/* Red strike line */}
                                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-red-600/80 -rotate-12 transform"></div>
                                        </div>
                                        <span className="text-6xl font-black text-white tracking-tighter">$127</span>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-white/5 mb-5"></div>

                                    {/* Checklist */}
                                    <ul className="space-y-3 text-left max-w-[260px] mx-auto">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-300 font-medium">Sistema Fenix Completo (Grabado)</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-300 font-medium">Blueprint de Fondeo</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                            <span className="text-sm text-amber-500 font-bold">Solo 2 Meses de Trading en Vivo</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Buttons */}
                                <div className="space-y-4">
                                    <button
                                        onClick={acceptDownsell}
                                        className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black py-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(220,38,38,0.5)] hover:scale-[1.02] active:scale-98 transition-all text-base md:text-lg uppercase tracking-wide flex items-center justify-center gap-2 group"
                                    >
                                        <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" strokeWidth={3} />
                                        Aceptar Oferta por $127
                                    </button>
                                    <button
                                        onClick={rejectDownsell}
                                        className="text-gray-600 text-[11px] font-medium hover:text-white transition-colors uppercase tracking-wide"
                                    >
                                        No gracias, prefiero perder la oportunidad.
                                    </button>
                                </div>
                            </div>
                        ) : isAnalyzing ? (
                            // --- LOADING SCREEN (FOMO) ---
                            <div className="text-center animate-pulse flex flex-col items-center">
                                <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-6"></div>
                                <h3 className="text-xl font-bold text-white mb-2">Analizando tus respuestas...</h3>
                                <p className="text-gray-400 text-sm">Buscando mentor disponible para tu perfil...</p>
                                <div className="mt-8 space-y-2 w-full max-w-xs mx-auto">
                                    <div className="flex justify-between text-xs text-gray-500"><span>Experiencia</span> <span className="text-green-500">✓ Válido</span></div>
                                    <div className="flex justify-between text-xs text-gray-500"><span>Capital</span> <span className="text-green-500">✓ Válido</span></div>
                                    <div className="flex justify-between text-xs text-gray-500"><span>Cupos</span> <span className="text-amber-500">Limitado</span></div>
                                </div>
                            </div>
                        ) : isSuccess ? (
                            // --- SUCCESS SCREEN ---
                            <div className="text-center py-4 animate-slide-up-fade">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                    <CheckCircle size={40} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">¡Aplicación Exitosa!</h3>

                                {/* CONFIRMACIÓN DE PRECIO */}
                                <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mb-4">
                                    Precio Congelado: <span className={offerType === 'Downsell $127' ? 'text-red-400 font-bold' : 'text-amber-400 font-bold'}>{offerType === 'Downsell $127' ? '$127 USD' : '$327 USD'}</span>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10 text-left">
                                    <p className="text-gray-300 text-sm mb-2">
                                        Hemos reservado tu perfil temporalmente.
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        Un asesor revisará tus datos: <span className="text-white font-mono block mt-1 bg-black/30 p-2 rounded">+{formData.phone}</span>
                                    </p>
                                </div>
                                <p className="text-amber-500 text-xs animate-pulse mb-6 font-bold uppercase tracking-widest">
                                    ⚠️ Mantente atento a tu WhatsApp
                                </p>
                                <button
                                    onClick={onClose}
                                    className="w-full gold-gradient-bg text-black font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                                >
                                    Entendido, estaré atento
                                </button>
                            </div>
                        ) : (
                            // --- NORMAL FORM ---
                            <form onSubmit={handleSubmit} className="w-full">

                                {/* STEP 1: EXPERIENCE */}
                                {step === 1 && (
                                    <div className="space-y-3 animate-slide-up-fade">
                                        <SelectionCard
                                            icon={Brain}
                                            title="Novato / Desde Cero"
                                            subtitle="No tengo cuenta de trading ni experiencia previa."
                                            selected={formData.experience === 'Novato'}
                                            onClick={() => handleSelection('experience', 'Novato')}
                                        />
                                        <SelectionCard
                                            icon={TrendingUp}
                                            title="Intermedio / En Pérdidas"
                                            subtitle="Sé operar pero no logro ser consistente."
                                            selected={formData.experience === 'Intermedio'}
                                            onClick={() => handleSelection('experience', 'Intermedio')}
                                        />
                                        <SelectionCard
                                            icon={Target}
                                            title="Avanzado / Busco Fondeo"
                                            subtitle="Busco escalar capital y mejorar psicotrading."
                                            selected={formData.experience === 'Avanzado'}
                                            onClick={() => handleSelection('experience', 'Avanzado')}
                                        />
                                    </div>
                                )}

                                {/* STEP 2: TIME */}
                                {step === 2 && (
                                    <div className="space-y-3 animate-slide-up-fade">
                                        <MentorNote
                                            text={getTimeFeedback()}
                                            type="info"
                                        />

                                        <SelectionCard
                                            icon={Clock}
                                            title="1 - 2 horas al día"
                                            subtitle="Puedo operar la sesión de Londres o NY."
                                            selected={formData.time === '1-2 Horas'}
                                            onClick={() => handleSelection('time', '1-2 Horas')}
                                        />
                                        <SelectionCard
                                            icon={Clock}
                                            title="Medio tiempo (3-4 horas)"
                                            subtitle="Tengo flexibilidad horaria."
                                            selected={formData.time === 'Medio Tiempo'}
                                            onClick={() => handleSelection('time', 'Medio Tiempo')}
                                        />
                                        <SelectionCard
                                            icon={Clock}
                                            title="Solo fines de semana"
                                            subtitle="Trabajo todo el día, solo puedo estudiar de noche/findes."
                                            selected={formData.time === 'Poco Tiempo'}
                                            onClick={() => handleSelection('time', 'Poco Tiempo')}
                                        />
                                    </div>
                                )}

                                {/* STEP 3: CAPITAL */}
                                {step === 3 && (
                                    <div className="space-y-3 animate-slide-up-fade">
                                        <MentorNote
                                            text="No necesitamos tu dinero. Esto es solo para definir si aplicas a Gestión de Capital Propio o al Plan de Fondeo Sintético."
                                            type="alert"
                                        />

                                        <div className="grid gap-3">
                                            <SelectionCard
                                                icon={Coins}
                                                title="Menos de $500 USD"
                                                subtitle="Me interesa el plan de Fondeo (Capital de Terceros)."
                                                selected={formData.capital === 'Menos de $500'}
                                                onClick={() => handleSelection('capital', 'Menos de $500')}
                                                specialIconStyle={true}
                                            />
                                            <SelectionCard
                                                icon={Wallet}
                                                title="$500 - $2,000 USD"
                                                subtitle="Capital propio listo para multiplicar."
                                                selected={formData.capital === '$500 - $2,000'}
                                                onClick={() => handleSelection('capital', '$500 - $2,000')}
                                                specialIconStyle={true}
                                            />
                                            <SelectionCard
                                                icon={Briefcase}
                                                title="$2,000 - $10,000 USD"
                                                subtitle="Busco vivir del trading profesionalmente."
                                                selected={formData.capital === '$2,000 - $10,000'}
                                                onClick={() => handleSelection('capital', '$2,000 - $10,000')}
                                                specialIconStyle={true}
                                            />
                                            <SelectionCard
                                                icon={Gem}
                                                title="Más de $10,000 USD"
                                                subtitle="Inversionista buscando diversificación agresiva."
                                                selected={formData.capital === 'Más de $10,000'}
                                                onClick={() => handleSelection('capital', 'Más de $10,000')}
                                                specialIconStyle={true}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* STEP 4: IDENTITY */}
                                {step === 4 && (
                                    <div className="space-y-6 animate-slide-up-fade">
                                        {formData.capital.includes('10,000') || formData.capital.includes('2,000') ? (
                                            <div className="text-center mb-2">
                                                <span className="inline-block bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
                                                    Perfil VIP Detectado
                                                </span>
                                            </div>
                                        ) : null}

                                        <div className="space-y-5">
                                            <div className="group">
                                                <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2 group-focus-within:text-amber-500 transition-colors">Nombre y Apellido</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-500 transition-colors" size={18} />
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        autoFocus
                                                        required
                                                        placeholder="Ej: Juan Pérez"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-amber-500 focus:outline-none focus:bg-zinc-900 focus:ring-1 focus:ring-amber-500/50 focus:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all placeholder:text-gray-700"
                                                    />
                                                </div>
                                            </div>

                                            <div className="group">
                                                <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2 group-focus-within:text-amber-500 transition-colors">WhatsApp (Incluye Código de País)</label>
                                                <div className="flex bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500/50 focus-within:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all">
                                                    <div className="bg-white/5 border-r border-white/10 px-4 flex items-center justify-center text-gray-400 font-mono text-lg select-none group-focus-within:text-amber-500 group-focus-within:bg-amber-500/10 transition-colors">
                                                        +
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        required
                                                        placeholder="595981123321"
                                                        value={formData.phone}
                                                        onChange={handlePhoneChange}
                                                        className="w-full bg-transparent border-none p-4 text-white focus:ring-0 focus:outline-none placeholder:text-gray-700 font-mono text-lg"
                                                    />
                                                </div>

                                                <div className="mt-3 flex items-start gap-2 text-[10px] text-gray-500 opacity-80">
                                                    <Lock size={12} className="text-amber-500/60 mt-0.5 shrink-0" />
                                                    <p>
                                                        Evaluaremos tu perfil. Si calificas, te contactaremos por esta vía. Verifica que esté correcto.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            disabled={!formData.name || formData.phone.length < 10}
                                            className="w-full mt-4 gold-gradient-bg text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg transform active:scale-[0.98]"
                                        >
                                            Verificar Disponibilidad <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}

                                {/* STEP 5: GOAL & SUBMIT (Updated Logic) */}
                                {step === 5 && (
                                    <div className="space-y-6 animate-slide-up-fade">

                                        <div>
                                            <label className="block text-gray-400 text-sm font-medium mb-3">
                                                ¿Cuál es tu objetivo principal en 90 días?
                                            </label>
                                            <textarea
                                                name="goal"
                                                required
                                                rows={3}
                                                placeholder="Ej: Renunciar a mi empleo, facturar $1k extra al mes, fondearme con 100k..."
                                                value={formData.goal}
                                                onChange={handleChange}
                                                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-gray-700 resize-none text-base"
                                            />
                                        </div>

                                        {/* NEW SCARCITY TEXT (Support Quality) */}
                                        <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
                                            <div className="mt-1">
                                                <Clock size={16} className="text-red-500" />
                                            </div>
                                            <p className="text-red-200/80 text-xs leading-relaxed">
                                                <strong>Cupos Limitados:</strong> Para garantizar un soporte 1 a 1 de calidad durante todo tu año, solo aceptamos <strong>5 nuevos alumnos por semana</strong>. Tu perfil entra en la lista prioritaria de esta semana.
                                            </p>
                                        </div>

                                        {/* NEW ORANGE BUTTON */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !formData.goal}
                                            className={`w-full text-black font-bold py-5 rounded-xl shadow-[0_10px_30px_-10px_rgba(249,115,22,0.4)] hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale text-lg btn-shimmer ${offerType === 'Downsell $127' ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white' : 'bg-gradient-to-r from-orange-500 to-amber-600'}`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                                    Confirmando Cupo...
                                                </>
                                            ) : (
                                                <>SOLICITAR ACCESO AHORA <ChevronRight size={20} strokeWidth={3} /></>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};