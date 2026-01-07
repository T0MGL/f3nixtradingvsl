import React, { useEffect, useState, useMemo } from 'react';
import { getLeads, toggleLeadConversion, toggleLeadContacted, toggleLeadLost, Lead } from '../services/sheetApi';
import { Users, RefreshCw, ThermometerSun, ThermometerSnowflake, Flame, Clock, TrendingUp, DollarSign, Activity, HelpCircle, CheckCircle, CircleDollarSign, MessageCircle, Calendar, Filter, Phone, PhoneCall, ChevronLeft, ChevronRight, X, XCircle, Ban, Lock, KeyRound, ShieldAlert, Tag, Settings, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEFAULT_PIXEL_ID, initPixel } from '../utils/metaPixel';

const StatusBadge = ({ status, contacted, converted, lost }: { status: Lead['status'], contacted?: boolean, converted?: boolean, lost?: boolean }) => {
    // Prioridad 0: Lead Perdido
    if (lost) {
        return <span className="inline-flex items-center gap-1 bg-zinc-800 text-gray-500 px-2 py-1 rounded text-xs font-bold border border-white/10"><XCircle size={12} /> PERDIDO</span>;
    }
    // Prioridad 1: Venta Cerrada
    if (converted) {
        return <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-500 px-2 py-1 rounded text-xs font-bold border border-green-500/30"><CheckCircle size={12} /> CLIENTE</span>;
    }
    // Prioridad 2: Ya fue contactado (pero no convertido aun)
    if (contacted) {
        return <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-500 px-2 py-1 rounded text-xs font-bold border border-blue-500/30"><Phone size={12} /> CONTACTADO</span>;
    }

    // Prioridad 3: Estado por defecto (Temperatura)
    switch (status) {
        case 'hot':
            return <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-500 px-2 py-1 rounded text-xs font-bold border border-red-500/30"><Flame size={12} /> HOT</span>;
        case 'warm':
            return <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-500 px-2 py-1 rounded text-xs font-bold border border-amber-500/30"><ThermometerSun size={12} /> TIBIO</span>;
        default:
            return <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-500 px-2 py-1 rounded text-xs font-bold border border-blue-500/30"><ThermometerSnowflake size={12} /> FRIO</span>;
    }
}

// Metric Card Component with Tooltip
const KPICard = ({ title, value, subtext, icon: Icon, colorClass, tooltip }: {
    title: string,
    value: string,
    subtext?: string,
    icon: any,
    colorClass: string,
    tooltip: string
}) => (
    <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-xl relative group hover:border-white/10 transition-colors">
        <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
                <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
            </div>

            {/* Tooltip Icon & Popup */}
            <div className="relative group/tooltip">
                <HelpCircle size={16} className="text-gray-600 cursor-help hover:text-gray-400 transition-colors" />
                <div className="absolute right-0 bottom-full mb-2 w-56 p-3 bg-black border border-white/10 rounded-lg shadow-xl text-[10px] text-gray-300 leading-relaxed opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 pointer-events-none transform -translate-y-2 group-hover/tooltip:translate-y-0">
                    {tooltip}
                </div>
            </div>
        </div>

        <div>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">{title}</p>
            <h4 className="text-2xl md:text-3xl font-bold text-white mb-1">{value}</h4>
            {subtext && <p className={`text-xs font-medium ${colorClass.replace('bg-', 'text-')}`}>{subtext}</p>}
        </div>
    </div>
);

type TimeFilter = 'all' | 'today' | '7d' | '30d';
type ActionFilter = 'all' | 'contacted' | 'converted' | 'pending' | 'lost';
type ProductFilter = 'all' | 'curso' | 'bot';

const ITEMS_PER_PAGE = 50;
const PASSWORD = import.meta.env.VITE_CRM_PASSWORD; // Password from env

export const AdminDashboard: React.FC = () => {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState(false);

    // Data State
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
    const [actionFilter, setActionFilter] = useState<ActionFilter>('all');
    const [productFilter, setProductFilter] = useState<ProductFilter>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [newLeadsNotification, setNewLeadsNotification] = useState<string | null>(null);

    // Settings Modal State
    const [showSettings, setShowSettings] = useState(false);
    const [pixelIdInput, setPixelIdInput] = useState(DEFAULT_PIXEL_ID);
    const [pixelSaved, setPixelSaved] = useState(false);

    // Check session on mount
    useEffect(() => {
        const sessionAuth = sessionStorage.getItem('crm_authenticated');
        if (sessionAuth === 'true') {
            setIsAuthenticated(true);
        }

        // Load Pixel ID from localStorage if exists
        const storedPixel = localStorage.getItem('FENIX_PIXEL_ID');
        if (storedPixel) setPixelIdInput(storedPixel);
    }, []);

    // Load leads ONLY if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            loadLeads(false);
        }
    }, [isAuthenticated]);

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [timeFilter, actionFilter, productFilter]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === PASSWORD) {
            setIsAuthenticated(true);
            setAuthError(false);
            sessionStorage.setItem('crm_authenticated', 'true');
        } else {
            setAuthError(true);
            setPasswordInput('');
        }
    };

    const handleSavePixel = () => {
        localStorage.setItem('FENIX_PIXEL_ID', pixelIdInput);
        setPixelSaved(true);
        // Reinicializar el pixel con el nuevo ID
        if (typeof window !== 'undefined') {
            // Hack rápido para recargar el pixel sin recargar página (para testing)
            console.log("Saving Pixel ID:", pixelIdInput);
            alert("ID guardado localmente. Recarga la página para que el Pixel se inicialice con el nuevo ID.");
        }
        setTimeout(() => setPixelSaved(false), 3000);
    };

    const loadLeads = async (isManual = false) => {
        setLoading(true);
        const previousCount = leads.length;
        const data = await getLeads();
        setLeads(data);
        setLoading(false);

        if (isManual === true) {
            const diff = data.length - previousCount;
            if (diff > 0) {
                setNewLeadsNotification(`🎉 ¡Tienes ${diff} ${diff === 1 ? 'nuevo lead' : 'nuevos leads'}!`);
                setTimeout(() => setNewLeadsNotification(null), 5000);
            }
        }
    }

    const handleConversionToggle = async (id: string, currentStatus: boolean | undefined) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, converted: !currentStatus } : l));
        await toggleLeadConversion(id, !!currentStatus);
    };

    const handleContactedToggle = async (id: string, currentStatus: boolean | undefined) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, contacted: !currentStatus } : l));
        await toggleLeadContacted(id, !!currentStatus);
    };

    const handleLostToggle = async (id: string, currentStatus: boolean | undefined) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, lost: !currentStatus } : l));
        await toggleLeadLost(id, !!currentStatus);
    }

    const toggleActionFilter = (filter: ActionFilter) => {
        if (actionFilter === filter) {
            setActionFilter('all');
        } else {
            setActionFilter(filter);
        }
    };

    const filteredLeads = useMemo(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        return leads.filter(lead => {
            const leadDate = new Date(lead.date).getTime();
            let matchesTime = true;
            let matchesAction = true;
            let matchesProduct = true;

            if (timeFilter === 'today') {
                matchesTime = leadDate >= todayStart;
            } else if (timeFilter === '7d') {
                const sevenDaysAgo = todayStart - (7 * 24 * 60 * 60 * 1000);
                matchesTime = leadDate >= sevenDaysAgo;
            } else if (timeFilter === '30d') {
                const thirtyDaysAgo = todayStart - (30 * 24 * 60 * 60 * 1000);
                matchesTime = leadDate >= thirtyDaysAgo;
            }

            if (actionFilter === 'contacted') {
                matchesAction = (lead.contacted === true) && (!lead.converted) && (!lead.lost);
            } else if (actionFilter === 'converted') {
                matchesAction = lead.converted === true;
            } else if (actionFilter === 'lost') {
                matchesAction = lead.lost === true;
            } else if (actionFilter === 'pending') {
                matchesAction = (!lead.contacted) && (!lead.converted) && (!lead.lost);
            }

            // Product Filter
            if (productFilter === 'curso') {
                matchesProduct = lead.offer === 'Standard $327' || lead.offer === 'Downsell $127';
            } else if (productFilter === 'bot') {
                matchesProduct = lead.offer?.includes('AI Bot') || lead.offer?.includes('Bot') || lead.offer === 'AI Bot $997';
            }

            return matchesTime && matchesAction && matchesProduct;
        });
    }, [leads, timeFilter, actionFilter, productFilter]);

    const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
    const paginatedLeads = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredLeads.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredLeads, currentPage]);

    const stats = useMemo(() => {
        const activeLeads = filteredLeads.filter(l => !l.lost);
        const total = filteredLeads.length;
        const STANDARD_PRICE = 327;
        const DOWNSELL_PRICE = 127;

        const hotCount = activeLeads.filter(l => l.status === 'hot').length;
        const warmCount = activeLeads.filter(l => l.status === 'warm').length;
        const coldCount = activeLeads.filter(l => l.status === 'cold').length;

        const convertedCount = filteredLeads.filter(l => l.converted).length;
        const conversionRate = total > 0 ? (convertedCount / total) * 100 : 0;

        // Calcular revenue basado en la oferta real tomada
        const realRevenue = filteredLeads.filter(l => l.converted).reduce((acc, lead) => {
            let price = STANDARD_PRICE;
            if (lead.offer === 'Downsell $127') {
                price = DOWNSELL_PRICE;
            } else if (lead.offer?.includes('AI Bot') || lead.offer === 'AI Bot $997') {
                price = 997;
            }
            return acc + price;
        }, 0);

        const pipelineLeft = activeLeads.filter(l => l.status === 'hot' && !l.converted).length * STANDARD_PRICE;

        return {
            total,
            hotCount,
            warmCount,
            coldCount,
            conversionRate,
            realRevenue,
            pipelineLeft
        };
    }, [filteredLeads]);


    const generateWhatsAppLink = (lead: Lead) => {
        const firstName = lead.name.split(' ')[0];
        let timePhrase = "";
        switch (lead.time) {
            case 'Poco Tiempo': timePhrase = "tienes una agenda apretada"; break;
            case 'Medio Tiempo': timePhrase = "tienes algo de flexibilidad horaria"; break;
            case '1-2 Horas': timePhrase = "cuentas con un par de horas al día"; break;
            default: timePhrase = "tienes disponibilidad ajustada";
        }
        let expPhrase = "";
        switch (lead.experience) {
            case 'Novato': expPhrase = "estás arrancando desde cero"; break;
            case 'Intermedio': expPhrase = "ya tienes base pero buscas consistencia"; break;
            case 'Avanzado': expPhrase = "ya tienes recorrido y buscas escalar"; break;
            default: expPhrase = "te interesa formarte profesionalmente";
        }

        let message = `Hola ${firstName}, soy del equipo de Fenix Trading Academy. 🏆\n\n`;
        message += `Vi tu aplicación. Noté que ${timePhrase} y que ${expPhrase}.`;

        if (lead.offer === 'Downsell $127') {
            message += `\n\nVi que aplicaste con la oferta especial de acceso. ¿Tienes alguna duda sobre los 2 meses de live trading?`;
        } else if (lead.status === 'hot') {
            message += `\n\nTu perfil de capital encaja perfecto con nuestra estrategia de aceleración. Tienes 5 minutos?`;
        } else if (lead.experience === 'Novato') {
            message += `\n\nMe gusta que quieras empezar desde cero para construir bases sólidas desde el inicio. Tendrías un minuto?`;
        } else {
            message += `\n\nMe gustaría hacerte unas preguntas breves para ver si aplicas al programa. Te queda bien ahora?`;
        }

        const encoded = encodeURIComponent(message);
        const phoneClean = lead.phone.replace(/\s/g, '');
        return `https://wa.me/${phoneClean}?text=${encoded}`;
    }

    const handleWhatsAppClick = async (lead: Lead) => {
        if (!lead.contacted) {
            setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, contacted: true } : l));
            await toggleLeadContacted(lead.id, !!lead.contacted, true);
        }
    };

    const FilterButton = ({ label, value }: { label: string, value: TimeFilter }) => (
        <button
            onClick={() => setTimeFilter(value)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${timeFilter === value
                ? 'bg-white text-black shadow-lg scale-105'
                : 'bg-zinc-900 text-gray-500 hover:text-white border border-white/5 hover:bg-zinc-800'
                }`}
        >
            {label}
        </button>
    );

    // --- RENDERIZADO CONDICIONAL: LOGIN SCREEN ---
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background FX */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-600/10 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>

                <div className="w-full max-w-sm bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex p-4 rounded-full bg-zinc-800/50 border border-white/5 mb-4 shadow-inner">
                            <Lock size={32} className="text-amber-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
                        <p className="text-gray-500 text-sm">Este panel es exclusivo para el equipo de ventas.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative group">
                            <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-500 transition-colors" />
                            <input
                                type="password"
                                placeholder="Contraseña de Acceso"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                                autoFocus
                            />
                        </div>

                        {authError && (
                            <div className="flex items-center gap-2 text-red-500 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-shake">
                                <ShieldAlert size={14} />
                                <span>Contraseña incorrecta. Intenta de nuevo.</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full gold-gradient-bg text-black font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg mt-2"
                        >
                            ENTRAR AL SISTEMA
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                            ← Volver a la página principal
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // --- DASHBOARD REAL (Solo se renderiza si isAuthenticated es true) ---
    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 p-4 md:p-8 font-sans flex flex-col relative">

            {/* --- CONFIG SETTINGS MODAL --- */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowSettings(false)}></div>
                    <div className="relative bg-zinc-900 border border-white/10 p-6 rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Settings size={18} className="text-gray-400" /> Configuración
                            </h3>
                            <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Meta Pixel ID (Facebook)</label>
                            <input
                                type="text"
                                value={pixelIdInput}
                                onChange={(e) => setPixelIdInput(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500 focus:outline-none text-sm font-mono"
                                placeholder="123456789012345"
                            />
                            <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                                Este ID se guardará en tu navegador (LocalStorage) para pruebas.
                                <span className="text-amber-500"> Para producción, asegúrate de actualizar el archivo <code>utils/metaPixel.ts</code> o desplegar con la variable de entorno.</span>
                            </p>
                        </div>

                        <button
                            onClick={handleSavePixel}
                            className="w-full bg-white text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                        >
                            {pixelSaved ? <CheckCircle size={16} className="text-green-600" /> : <Save size={16} />}
                            {pixelSaved ? "Guardado" : "Guardar Cambios"}
                        </button>
                    </div>
                </div>
            )}


            <div className="max-w-7xl mx-auto w-full flex-1">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black flex items-center gap-4">
                            <span className="bg-gradient-to-br from-amber-500/20 to-orange-900/40 p-3 rounded-2xl border border-amber-500/30 text-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
                                <Users size={28} strokeWidth={2} />
                            </span>
                            <div className="flex flex-col">
                                <span className="gold-gradient-text tracking-tight leading-tight filter drop-shadow-sm">Fenix Trading Academy</span>
                                <span className="text-zinc-500 text-xs font-medium tracking-widest uppercase mt-0.5">Panel de Control & CRM</span>
                            </div>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/" className="text-sm text-gray-400 hover:text-white mr-4">Ver Landing</Link>

                        {/* CONFIG BUTTON (Discreet) */}
                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-gray-500 hover:text-white hover:bg-zinc-800 transition-all"
                            title="Configuración"
                        >
                            <Settings size={16} />
                        </button>

                        {/* BOTÓN ACTUALIZAR: Diseño Luxury Premium (Gold Gradient) y Compacto */}
                        <button onClick={() => loadLeads(true)} className="gold-gradient-bg text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all active:scale-95 hover:brightness-110">
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={2.5} /> ACTUALIZAR
                        </button>
                    </div>
                </div>

                {/* --- FILTER BAR & STATUS COUNTS --- */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6">

                    <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
                        {/* Filtros de Tiempo */}
                        <div className="flex items-center gap-2 bg-zinc-950/50 p-1.5 rounded-full border border-white/5">
                            <div className="px-3 text-gray-600"><Calendar size={14} /></div>
                            <FilterButton label="Hoy" value="today" />
                            <FilterButton label="7 Días" value="7d" />
                            <FilterButton label="30 Días" value="30d" />
                            <FilterButton label="Siempre" value="all" />
                        </div>

                        {/* Filtro de Producto */}
                        <div className="flex items-center gap-2 bg-zinc-950/50 p-1.5 rounded-full border border-white/5">
                            <div className="px-3 text-gray-600"><Tag size={14} /></div>
                            <button
                                onClick={() => setProductFilter('all')}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${productFilter === 'all'
                                    ? 'bg-white text-black shadow-lg scale-105'
                                    : 'bg-zinc-900 text-gray-500 hover:text-white border border-white/5 hover:bg-zinc-800'
                                    }`}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setProductFilter('curso')}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${productFilter === 'curso'
                                    ? 'bg-amber-500 text-black shadow-lg scale-105'
                                    : 'bg-zinc-900 text-gray-500 hover:text-amber-500 border border-white/5 hover:bg-zinc-800'
                                    }`}
                            >
                                Curso
                            </button>
                            <button
                                onClick={() => setProductFilter('bot')}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${productFilter === 'bot'
                                    ? 'bg-blue-500 text-black shadow-lg scale-105'
                                    : 'bg-zinc-900 text-gray-500 hover:text-blue-500 border border-white/5 hover:bg-zinc-800'
                                    }`}
                            >
                                AI Bot
                            </button>
                        </div>
                    </div>

                    {/* Resumen de Pipeline (Counts) */}
                    <div className="flex gap-4 md:gap-8 bg-zinc-900/30 px-6 py-3 rounded-xl border border-white/5">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider mb-1 flex items-center gap-1"><Flame size={10} /> Hot</span>
                            <span className="text-xl font-bold text-white leading-none">{stats.hotCount}</span>
                        </div>
                        <div className="w-px bg-white/10 h-8"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider mb-1 flex items-center gap-1"><ThermometerSun size={10} /> Tibio</span>
                            <span className="text-xl font-bold text-white leading-none">{stats.warmCount}</span>
                        </div>
                        <div className="w-px bg-white/10 h-8"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider mb-1 flex items-center gap-1"><ThermometerSnowflake size={10} /> Frío</span>
                            <span className="text-xl font-bold text-white leading-none">{stats.coldCount}</span>
                        </div>
                    </div>
                </div>

                {/* --- KPI CARDS (Driven by Filtered Stats) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <KPICard
                        title="Tasa de Cierre"
                        value={`${stats.conversionRate.toFixed(1)}%`}
                        subtext="Leads Convertidos en Ventas"
                        icon={Activity}
                        colorClass="text-blue-500 bg-blue-500"
                        tooltip="El porcentaje definitivo de éxito. Mide cuántos de tus leads totales terminan pagando. Un número superior al 5% en tráfico frío es excelente."
                    />
                    <KPICard
                        title="Ingresos Reales"
                        value={`$${stats.realRevenue.toLocaleString()}`}
                        subtext="Cash Flow (Ventas Cerradas)"
                        icon={CheckCircle}
                        colorClass="text-green-500 bg-green-500"
                        tooltip="Dinero real generado hasta el momento basado en los leads que has marcado manualmente como 'Pagado' en la tabla. Considera si pagaron $327 o $127."
                    />
                    <KPICard
                        title="Pipeline Abierto"
                        value={`$${stats.pipelineLeft.toLocaleString()}`}
                        subtext="Potencial en Leads HOT"
                        icon={TrendingUp}
                        colorClass="text-amber-500 bg-amber-500"
                        tooltip="Dinero que estás dejando sobre la mesa. Es la suma del valor de oferta ($327) de todos los leads calificados como HOT que aún no han comprado."
                    />
                </div>

                {/* Table Legend - FILTERABLE */}
                <div className="flex justify-end mb-4 gap-4 text-xs text-gray-500 select-none flex-wrap">
                    <div
                        onClick={() => toggleActionFilter('contacted')}
                        className={`flex items-center gap-2 cursor-pointer hover:text-white transition-all ${actionFilter !== 'all' && actionFilter !== 'contacted' ? 'opacity-30' : 'opacity-100'}`}
                        title="Filtrar: Solo contactados"
                    >
                        <span className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500/50"></span> Contactado
                    </div>
                    <div
                        onClick={() => toggleActionFilter('converted')}
                        className={`flex items-center gap-2 cursor-pointer hover:text-white transition-all ${actionFilter !== 'all' && actionFilter !== 'converted' ? 'opacity-30' : 'opacity-100'}`}
                        title="Filtrar: Solo ventas cerradas"
                    >
                        <span className="w-3 h-3 rounded-full bg-green-900/40 border border-green-500/50"></span> Venta Cerrada
                    </div>
                    <div
                        onClick={() => toggleActionFilter('lost')}
                        className={`flex items-center gap-2 cursor-pointer hover:text-white transition-all ${actionFilter !== 'all' && actionFilter !== 'lost' ? 'opacity-30' : 'opacity-100'}`}
                        title="Filtrar: Leads Perdidos"
                    >
                        <span className="w-3 h-3 rounded-full bg-zinc-800 border border-white/20"></span> Perdido
                    </div>
                    <div
                        onClick={() => toggleActionFilter('pending')}
                        className={`flex items-center gap-2 cursor-pointer hover:text-white transition-all ${actionFilter !== 'all' && actionFilter !== 'pending' ? 'opacity-30' : 'opacity-100'}`}
                        title="Filtrar: Pendientes (Sin acción)"
                    >
                        <span className="w-3 h-3 rounded-full bg-zinc-900/40 border border-white/10"></span> Pendiente
                    </div>
                </div>

                {/* Table */}
                <div className="bg-zinc-900/30 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/40 text-gray-500 text-xs uppercase tracking-wider border-b border-white/5">
                                    <th className="p-4 font-semibold">Fecha</th>
                                    <th className="p-4 font-semibold">Nombre</th>
                                    <th className="p-4 font-semibold">Oferta</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold">Perfil</th>
                                    <th className="p-4 font-semibold">Objetivo</th>
                                    <th className="p-4 font-semibold text-right">CRM Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {paginatedLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-gray-500 italic">
                                            No hay leads que coincidan con los filtros actuales.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedLeads.map((lead) => {
                                        // Calcular clase de fila basada en estado
                                        let rowClass = 'hover:bg-white/5';
                                        if (lead.lost) rowClass = 'opacity-50 grayscale bg-zinc-950'; // Visualmente apagado
                                        else if (lead.converted) rowClass = 'bg-green-900/10 hover:bg-green-900/20';
                                        else if (lead.contacted) rowClass = 'bg-blue-900/5 hover:bg-blue-900/10';

                                        return (
                                            <tr
                                                key={lead.id}
                                                className={`transition-all group ${rowClass}`}
                                            >
                                                <td className="p-4 text-gray-400 text-sm whitespace-nowrap">
                                                    {/* Formato Paraguay dd/mm/yyyy */}
                                                    {new Date(lead.date).toLocaleDateString('es-PY', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                    <span className="text-gray-600 text-xs block">{new Date(lead.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className={`font-medium flex items-center gap-2 ${lead.converted ? 'text-green-400' : (lead.lost ? 'text-gray-500' : 'text-white')}`}>
                                                        {lead.name}
                                                        {lead.converted && <CheckCircle size={14} className="text-green-500" />}
                                                        {lead.contacted && !lead.converted && !lead.lost && <Phone size={14} className="text-blue-500" />}
                                                        {lead.lost && <XCircle size={14} className="text-gray-500" />}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{lead.phone}</div>
                                                </td>
                                                {/* OFFER COLUMN */}
                                                <td className="p-4">
                                                    {lead.offer === 'Downsell $127' ? (
                                                        <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-bold border border-red-500/20 whitespace-nowrap">
                                                            <Tag size={10} /> $127 (2m)
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-1 rounded text-xs font-bold border border-amber-500/20 whitespace-nowrap">
                                                            <Tag size={10} /> $327 (1y)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <StatusBadge status={lead.status} contacted={lead.contacted} converted={lead.converted} lost={lead.lost} />
                                                </td>
                                                <td className="p-4 text-sm">
                                                    <div className="text-gray-300">{lead.capital}</div>
                                                    <div className="text-gray-600 text-xs flex items-center gap-1 mt-1"><Clock size={10} /> {lead.time}</div>
                                                </td>
                                                <td className="p-4 text-sm text-gray-500 truncate max-w-[150px]" title={lead.goal}>
                                                    {lead.goal}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">

                                                        {/* Botón de Contacto (Marcar como contactado) */}
                                                        <button
                                                            onClick={() => handleContactedToggle(lead.id, lead.contacted)}
                                                            disabled={lead.lost || lead.converted} // Deshabilitar si perdido o convertido
                                                            className={`p-2 rounded-lg transition-all border ${lead.contacted
                                                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30'
                                                                : 'bg-zinc-800 text-gray-500 border-white/10 hover:border-blue-500/50 hover:text-blue-500 disabled:opacity-30 disabled:hover:border-white/10'
                                                                }`}
                                                            title={lead.contacted ? "Ya contactado" : "Marcar como contactado"}
                                                        >
                                                            <PhoneCall size={16} />
                                                        </button>

                                                        {/* Botón de Venta */}
                                                        <button
                                                            onClick={() => handleConversionToggle(lead.id, lead.converted)}
                                                            disabled={lead.lost}
                                                            className={`p-2 rounded-lg transition-all border ${lead.converted
                                                                ? 'bg-green-500 text-black border-green-500 hover:bg-green-400'
                                                                : 'bg-zinc-800 text-gray-400 border-white/10 hover:border-green-500/50 hover:text-green-500 disabled:opacity-30 disabled:hover:border-white/10'
                                                                }`}
                                                            title={lead.converted ? "Marcar como no pagado" : "Marcar venta cerrada"}
                                                        >
                                                            <CircleDollarSign size={16} />
                                                        </button>

                                                        {/* Botón de Perdido (Lost) */}
                                                        <button
                                                            onClick={() => handleLostToggle(lead.id, lead.lost)}
                                                            disabled={lead.converted} // No se puede marcar perdido si ya pagó (a menos que reembolse, pero simplificamos)
                                                            className={`p-2 rounded-lg transition-all border ${lead.lost
                                                                ? 'bg-zinc-700 text-gray-300 border-gray-500 hover:bg-zinc-600'
                                                                : 'bg-zinc-800 text-gray-400 border-white/10 hover:border-red-500/50 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-30'
                                                                }`}
                                                            title={lead.lost ? "Reactivar Lead" : "Marcar como Perdido"}
                                                        >
                                                            <X size={16} />
                                                        </button>

                                                        {/* Botón de WhatsApp */}
                                                        <a
                                                            href={generateWhatsAppLink(lead)}
                                                            onClick={(e) => {
                                                                if (lead.lost) e.preventDefault(); // No permitir click si está perdido
                                                                else handleWhatsAppClick(lead);
                                                            }}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className={`p-2 rounded-lg transition-all border flex items-center justify-center ${lead.lost
                                                                ? 'bg-zinc-800/50 text-gray-600 border-white/5 cursor-not-allowed opacity-50'
                                                                : 'bg-zinc-800 text-gray-400 border-white/10 hover:border-emerald-500/50 hover:text-emerald-500 hover:bg-emerald-500/10'
                                                                }`}
                                                            title="Contactar por WhatsApp"
                                                        >
                                                            <MessageCircle size={16} />
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINATION CONTROLS - MINIMALIST */}
                {filteredLeads.length > 0 && (
                    <div className="flex justify-end items-center mt-4 pt-2">
                        <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-medium uppercase tracking-widest select-none">
                            <span className="tabular-nums">
                                {((currentPage - 1) * ITEMS_PER_PAGE) + 1} – {Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)} <span className="text-zinc-700 mx-1">/</span> {filteredLeads.length}
                            </span>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1 hover:text-zinc-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={14} />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="p-1 hover:text-zinc-300 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* NOTIFICACIÓN TOAST DE NUEVOS LEADS */}
            {newLeadsNotification && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up-fade">
                    <div
                        className="bg-gradient-to-r from-amber-500 to-yellow-600 text-black px-6 py-3 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center gap-3 font-bold text-sm md:text-base cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setNewLeadsNotification(null)}
                    >
                        <span className="text-xl">🎉</span>
                        {newLeadsNotification}
                    </div>
                </div>
            )}

            <div className="text-center mt-12 pb-4">
                <a href="https://thebrightidea.ai" target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-zinc-400 text-[10px] transition-colors font-medium opacity-40 hover:opacity-100">
                    Desarrollado por Bright Idea
                </a>
            </div>
        </div>
    );
};