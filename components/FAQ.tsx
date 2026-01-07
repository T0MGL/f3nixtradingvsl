import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/10 rounded-lg bg-zinc-900/50 mb-4 overflow-hidden">
            <button
                className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold text-lg text-white pr-4">{question}</span>
                {isOpen ? <ChevronUp className="text-amber-500" /> : <ChevronDown className="text-gray-500" />}
            </button>
            {isOpen && (
                <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 bg-black/20">
                    {answer}
                </div>
            )}
        </div>
    )
}

export const FAQ: React.FC = () => {
    const faqs = [
        {
            question: "Ya he comprado otros cursos y no tuve resultados, ¿por qué este es diferente?",
            answer: "La mayoría de cursos te enseñan 'teoría de libro' (Soportes, Resistencias, Líneas de tendencia) que los bancos utilizan para cazar tu Stop Loss. Fenix Pro te enseña la Lógica Institucional: cómo se mueve realmente el dinero. Además, no te dejamos solo con videos; me verás aplicar esto en vivo."
        },
        {
            question: "¿Necesito mucho capital para empezar?",
            answer: "No. De hecho, te enseñaremos cómo NO usar tu propio dinero. Con el módulo 'Blueprint de Fondeo', aprenderás a acceder a cuentas de $10,000 a $100,000 de empresas de fondeo externas una vez domines nuestra habilidad."
        },
        {
            question: "¿Cuánto tiempo necesito dedicarle al día?",
            answer: "El sistema Fenix está diseñado para la eficiencia, no para la esclavitud. Buscamos operar en las sesiones de mayor volatilidad (Londres o Nueva York) durante 60 a 90 minutos. No necesitas estar pegado al monitor todo el día."
        },
        {
            question: "Soy principiante total, ¿es esto muy avanzado para mí?",
            answer: "Al contrario, es una ventaja. No tienes los 'vicios' y malos hábitos que tienen los traders que llevan años perdiendo. Te enseñaremos la forma correcta desde el día 1, paso a paso."
        },
        {
            question: "¿Qué pasa si por horario laboral no puedo conectarme a las sesiones en vivo?",
            answer: "No hay problema. Entendemos que tienes vida y compromisos. Todas las sesiones de Trading Room se graban en alta definición y se suben a la plataforma el mismo día. Podrás verlas a tu ritmo, pausarlas y repasarlas cuando tengas tiempo disponible."
        },
        {
            question: "¿Es un pago único o una mensualidad?",
            answer: "Es un pago único. No hay mensualidades, ni cargos sorpresas, ni renovaciones automáticas. Con tu inscripción de hoy aseguras acceso completo por 1 año a todo el ecosistema Fenix (Mentoria, Comunidad, Clases y Herramientas)."
        },
        {
            question: "¿Cuándo recibo el acceso al curso después de pagar?",
            answer: "De inmediato. El sistema es automático. Unos minutos después de confirmar tu pago, recibirás un correo electrónico con tus credenciales de acceso para entrar a la plataforma de alumnos y comenzar tu formación hoy mismo."
        }
    ];

    return (
        <section className="py-20 bg-black px-4">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">Preguntas Frecuentes <span className="text-amber-500">Resueltas</span></h2>
                <div>
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    );
};