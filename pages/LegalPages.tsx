import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Lock } from 'lucide-react';

const LegalLayout: React.FC<{ title: string; icon: any; children: React.ReactNode }> = ({ title, icon: Icon, children }) => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-amber-500/30 selection:text-white">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                
                {/* Header */}
                <div className="mb-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-bold uppercase tracking-wider text-xs mb-8 transition-colors">
                        <ArrowLeft size={14} /> Volver al Inicio
                    </Link>
                    
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-amber-500">
                            <Icon size={32} />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white">{title}</h1>
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-amber-500/50 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="prose prose-invert prose-amber max-w-none text-gray-400 font-light leading-relaxed space-y-8">
                    {children}
                </div>

                {/* Footer of the page */}
                <div className="mt-20 pt-10 border-t border-white/10 text-center">
                    <p className="text-gray-600 text-sm">
                        &copy; {new Date().getFullYear()} Fenix Trading Academy. Operado por Ramiro Matias Rodriguez Lopez.
                    </p>
                </div>
            </div>
        </div>
    );
};

export const PrivacyPolicy: React.FC = () => {
    return (
        <LegalLayout title="Política de Privacidad" icon={Lock}>
            <p><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</p>

            <h3>1. Introducción</h3>
            <p>
                En <strong>Fenix Trading Academy</strong> (en adelante, "nosotros", "nuestro" o "la Academia"), valoramos su privacidad. 
                Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando visita nuestro sitio web.
                El responsable del tratamiento de los datos es <strong>Ramiro Matias Rodriguez Lopez</strong>.
            </p>

            <h3>2. Información que Recopilamos</h3>
            <p>Podemos recopilar información personal que usted nos proporciona voluntariamente cuando:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>Se registra para recibir información sobre nuestros cursos.</li>
                <li>Completa formularios de contacto o de "aplicación" en nuestro sitio web.</li>
                <li>Participa en nuestras comunidades (Discord, Telegram, WhatsApp).</li>
            </ul>
            <p>La información puede incluir: Nombre, dirección de correo electrónico, número de teléfono, nivel de experiencia en trading y objetivos financieros.</p>

            <h3>3. Uso de su Información</h3>
            <p>Usamos la información recopilada para:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>Proveer y administrar nuestros servicios educativos.</li>
                <li>Enviarle comunicaciones de marketing, boletines y ofertas promocionales (puede optar por no recibirlas en cualquier momento).</li>
                <li>Mejorar nuestro sitio web y la experiencia del usuario.</li>
                <li>Cumplir con obligaciones legales.</li>
            </ul>

            <h3>4. Tecnologías de Rastreo (Cookies y Píxeles)</h3>
            <p>
                Utilizamos cookies, píxeles de seguimiento (como el Meta Pixel y Google Tag) y tecnologías similares para personalizar el contenido y la publicidad, 
                proporcionar funciones de redes sociales y analizar nuestro tráfico. Al utilizar nuestro sitio, usted acepta el uso de estas tecnologías 
                para fines de marketing y remarketing.
            </p>

            <h3>5. Compartir su Información</h3>
            <p>
                No vendemos, intercambiamos ni alquilamos su información de identificación personal a terceros. Podemos compartir información genérica 
                agregada no vinculada a ninguna información de identificación personal con nuestros socios comerciales y anunciantes de confianza.
            </p>

            <h3>6. Seguridad de los Datos</h3>
            <p>
                Implementamos medidas de seguridad razonables para proteger la seguridad de su información personal. Sin embargo, tenga en cuenta que 
                ningún método de transmisión por Internet es 100% seguro.
            </p>

            <h3>7. Sus Derechos</h3>
            <p>
                Usted tiene derecho a acceder, rectificar o eliminar su información personal que tenemos en nuestro poder. Para ejercer estos derechos, 
                contáctenos a través de nuestros canales oficiales.
            </p>
        </LegalLayout>
    );
};

export const TermsConditions: React.FC = () => {
    return (
        <LegalLayout title="Términos y Condiciones" icon={FileText}>
            <p><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</p>

            <h3>1. Aceptación de los Términos</h3>
            <p>
                Al acceder y utilizar el sitio web y los servicios de <strong>Fenix Trading Academy</strong> (operado por Ramiro Matias Rodriguez Lopez), 
                usted acepta cumplir y estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
            </p>

            <h3>2. Naturaleza Educativa (Descargo de Responsabilidad de Riesgo)</h3>
            <div className="bg-red-900/10 border-l-4 border-red-500 p-4 rounded-r my-6">
                <p className="font-bold text-red-400 uppercase text-xs tracking-widest mb-2">Advertencia de Riesgo Importante</p>
                <p className="text-gray-300 text-sm">
                    <strong>Fenix Trading Academy no es un asesor financiero.</strong> Todo el contenido proporcionado es estrictamente para fines <strong>educativos e informativos</strong>. 
                    El trading de divisas (Forex), índices, criptomonedas y otros instrumentos financieros conlleva un alto nivel de riesgo y puede no ser adecuado para todos los inversores. 
                    Existe la posibilidad de que pierda parte o la totalidad de su inversión inicial. No debe invertir dinero que no pueda permitirse perder.
                </p>
            </div>
            <p>
                Los resultados pasados mostrados en nuestros materiales o por nuestros estudiantes no garantizan resultados futuros. Usted es el único responsable de sus decisiones de inversión.
            </p>

            <h3>3. Propiedad Intelectual</h3>
            <p>
                Todo el contenido, incluidos videos, textos, logotipos, gráficos y materiales del curso, es propiedad intelectual de Ramiro Matias Rodriguez Lopez y Fenix Trading Academy. 
                Está estrictamente prohibida la reproducción, distribución o venta no autorizada de nuestros materiales. El acceso a la academia es personal e intransferible.
            </p>

            <h3>4. Política de Reembolso (Garantía)</h3>
            <p>
                Ofrecemos una garantía de satisfacción de 30 días para nuestro programa principal. Si no está satisfecho con la calidad de la educación, 
                puede solicitar un reembolso completo dentro de los 30 días posteriores a la compra, siempre y cuando no haya consumido más del 50% del contenido grabado 
                (para evitar el fraude de propiedad intelectual).
            </p>

            <h3>5. Modificaciones del Servicio</h3>
            <p>
                Nos reservamos el derecho de modificar o discontinuar, temporal o permanentemente, el servicio (o cualquier parte del mismo) con o sin previo aviso.
            </p>

            <h3>6. Limitación de Responsabilidad</h3>
            <p>
                En ningún caso Ramiro Matias Rodriguez Lopez, Fenix Trading Academy, ni sus directores, empleados o afiliados serán responsables por daños directos, 
                indirectos, incidentales o consecuentes que resulten de su uso del servicio o de cualquier decisión financiera tomada basándose en la información proporcionada.
            </p>

            <h3>7. Ley Aplicable</h3>
            <p>
                Estos términos se regirán e interpretarán de acuerdo con las leyes vigentes en la República del Paraguay, sin tener en cuenta sus conflictos de disposiciones legales.
            </p>
        </LegalLayout>
    );
};