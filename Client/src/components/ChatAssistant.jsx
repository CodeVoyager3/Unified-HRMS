import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Avatar } from "@heroui/avatar";

import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Namaste! 🙏 I am the UHRMS Assistant. How can I help you today?\n\nनमस्ते! मैं यू-एचआरएमएस सहायक हूँ। मैं आपकी क्या मदद कर सकता हूँ?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const location = useLocation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        try {
            const apiKey = import.meta.env.VITE_GROQ_API_KEY;
            if (!apiKey) {
                throw new Error("Missing API Key. Please restart the development server to load the new .env file.");
            }

            const systemPrompt = `
                Role: You are the UHRMS Assistant, a professional, intelligent, and highly capable virtual aide for the Municipal Corporation of Delhi (MCD). Your goal is to assist employees, zonal managers, and citizens in navigating and using the Unified Human Resource Management System (U-HRMS). You represent the digital transformation of Delhi's municipal governance.

                Persona & Tone: * Identity: A digital representative of MCD, often depicted as a friendly robot in professional Indian attire (Nehru jacket/Turban).
                Tone: Polite, authoritative, efficient, and supportive. Use a "Government of India" formal yet accessible style.
                Accessibility: Adhere to GIGW (Guidelines for Indian Government Websites) principles by being clear, concise, and helpful to users of all technical skill levels.
                Bilingual: You are fully bilingual in English and Hindi. Respond in the language used by the user or as per the website’s current toggle state.

                Core Knowledge Base: 
                1. Attendance: Explain the Smart Geofenced Attendance system. Users can only clock in within their designated municipal zones. 
                2. Payroll: Assist with queries regarding automated payroll, digital payslips, and tax deductions. 
                3. Service Books: Explain the Digital Service Book (e-SB), which tracks an employee's entire career history. 
                4. Admin (Commissioner/HOD): Guide administrators on onboarding Zonal Managers, generating EIDs, creating vacancies (with 15-day limits), and approving transfers/promotions. 
                5. Grievances: Guide employees on how to file and track grievances regarding pay, leaves, or transfers. 
                6. Public Information: Assist citizens in finding Public Notices, circulars, and vacancy notices.

                Interaction Guidelines: 
                * For Employees: If they ask "How do I mark attendance?", explain the mobile app's geofencing feature. If they ask about salary, guide them to the "Payroll & Slips" section in the Footer.
                For Managers: If they ask about vacancies, explain the process of adding specific requirements for their locality (e.g., Doctors for Shahdara).
                For Citizens: Guide them to the Public Notices page for tenders and recent notifications.

                Safety & Privacy: Never ask for or store passwords or sensitive Personal Identifiable Information (PII) like full Aadhaar numbers in the chat.
                Escalation: If a user is frustrated or has a complex legal/HR issue, provide the official helpdesk email (helpdesk-hrms@mcd.nic.in) or toll-free number (1800-11-XXXX).

                Response Format: Use bullet points for steps and bold text for navigation labels (e.g., "**Online Services**") to ensure high legibility. Keep responses concise.

                Current Context: The user is currently on the page: ${location.pathname}
            `;

            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
                    { role: "user", content: inputValue }
                ],
                model: "llama-3.3-70b-versatile",
            });

            const botResponse = completion.choices[0]?.message?.content || "I apologize, I am unable to connect to the server right now. Please try again later.";

            const botMessage = {
                id: Date.now() + 1,
                text: botResponse,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Groq API Error:", error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "⚠️ I am experiencing technical difficulties. Please check your internet connection or try again later.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl rounded-3xl w-[340px] sm:w-[400px] overflow-hidden flex flex-col border border-white/20 dark:border-gray-700/50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header with Gradient */}
                    <div className="bg-gradient-to-r from-[#6F42C1] via-[#8B5CF6] to-[#A855F7] p-4 flex justify-between items-center text-white relative overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                        <div className="flex items-center gap-3 relative z-10">
                            <div className="relative">
                                <Avatar
                                    src="/bot.png"
                                    alt="Bot Avatar"
                                    size="lg"
                                    isBordered
                                    color="secondary"
                                    className="ring-2 ring-white/30"
                                    showFallback={false}
                                    imgProps={{ className: "object-cover scale-250 -translate-y-2" }}
                                />
                                {/* Online Indicator */}
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-base flex items-center gap-1.5">
                                    UHRMS Assistant
                                    <Sparkles size={14} className="text-yellow-300" />
                                </h3>
                                <p className="text-[11px] opacity-90 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    Online • Official MCD Support
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="hover:bg-white/20 p-2 rounded-xl transition-all duration-200 hover:rotate-90 relative z-10"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="h-[340px] overflow-y-auto p-4 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div className={`flex flex-col gap-1 max-w-[85%]`}>
                                    <div
                                        className={`p-3.5 text-sm leading-relaxed whitespace-pre-wrap ${msg.sender === 'user'
                                            ? 'bg-gradient-to-br from-[#6F42C1] to-[#8B5CF6] text-white rounded-2xl rounded-br-md shadow-lg shadow-purple-500/20'
                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-md shadow-sm'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                    <span className={`text-[10px] text-gray-400 dark:text-gray-500 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                        {formatTime(msg.timestamp)}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start animate-in fade-in duration-200">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-md border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <div className="flex gap-1.5 items-center">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex gap-2 items-center bg-gray-100 dark:bg-gray-800 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your query... / अपना प्रश्न लिखें..."
                                className="flex-1 bg-transparent text-gray-800 dark:text-gray-100 px-3 py-2.5 text-sm focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className="p-2.5 bg-gradient-to-r from-[#6F42C1] to-[#8B5CF6] text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-200 active:scale-95"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
                            Powered by MCD IT Cell • GIGW Compliant
                        </p>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={toggleChat}
                className={`transition-all duration-300 hover:scale-105 active:scale-95 group relative flex items-center justify-center ${isOpen
                    ? 'w-14 h-14 bg-gradient-to-br from-[#6F42C1] to-[#8B5CF6] text-white rounded-full shadow-lg shadow-purple-500/30'
                    : 'w-20 h-20 bg-transparent'
                    }`}
                aria-label={isOpen ? "Close Chat" : "Open Chat Assistant"}
            >
                {isOpen ? (
                    <X size={24} className="transition-transform duration-300" />
                ) : (
                    <div className="relative group-hover:scale-105 transition-transform duration-300">
                        <Avatar
                            src="/bot.png"
                            alt="Bot"
                            className="w-20 h-20"
                            showFallback={false}
                            imgProps={{ className: "object-cover scale-220 -translate-y-2" }}
                        />
                        {/* Pulse Ring */}
                        <div className="absolute -inset-1 bg-purple-500/20 rounded-full animate-ping opacity-75" />
                    </div>
                )}

            </button>
        </div>
    );
};

export default ChatAssistant;
