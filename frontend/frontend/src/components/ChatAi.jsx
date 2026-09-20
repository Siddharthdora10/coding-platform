import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from "lucide-react";

function ChatAi({ problem }) {

    const [messages, setMessages] = useState([
        {
            role: "model",
            parts: [{ text: "Hi, How are you" }]
        },
        {
            role: "user",
            parts: [{ text: "I am Good" }]
        }
    ]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const onSubmit = async (data) => {

        // Create the new user message
        const newMessage = {
            role: "user",
            parts: [{ text: data.message }]
        };

        // Create updated messages immediately
        const updatedMessages = [
            ...messages,
            newMessage
        ];

        // Update UI
        setMessages(updatedMessages);

        // Clear input
        reset();

        try {

            const response = await axiosClient.post("/ai/chat", {
                message: updatedMessages,
                title: problem.title,
                description: problem.description,
                testcases: problem.visibleTestCases,
                startCode: problem.StartCode
            });

            setMessages(prev => [...prev, { role: "model", parts: [{ text: "" }] }]);

            const responseText = response.data.message || "";
            for (let index = 0; index < responseText.length; index += 3) {
                const text = responseText.slice(0, index + 3);
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { ...updated[updated.length - 1], parts: [{ text }] };
                    return updated;
                });
                await new Promise(resolve => setTimeout(resolve, 12));
            }

        } catch (error) {

            console.error("API Error:", error);

            setMessages(prev => [
                ...prev,
                {
                    role: "model",
                    parts: [
                        {
                            text: "Sorry, I encountered an error"
                        }
                    ]
                }
            ]);
        }
    };

    return (
        <div className="flex h-screen min-h-[500px] max-h-[80vh] flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0b100d]">

            <div className="flex-1 space-y-5 overflow-y-auto p-5">

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat ${
                            msg.role === "user"
                                ? "chat-end"
                                : "chat-start"
                        }`}
                    >
                        <div className={`chat-bubble max-w-[85%] ${msg.role === "user" ? "bg-[#c8ff3d] text-[#11120e]" : "border border-slate-700 bg-slate-800 text-slate-100"}`}>
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}

                <div ref={messagesEndRef} />

            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="sticky bottom-0 border-t border-slate-800 bg-[#111510] p-4"
            >

                    <div className="flex items-center gap-2">

                    <input
                        placeholder="Ask me anything"
                        className="input input-bordered flex-1 bg-slate-900"
                        {...register("message", {
                            required: true,
                            minLength: 2
                        })}
                    />

                    <button
                        type="submit"
                        className="btn border-0 bg-[#c8ff3d] text-[#11120e] hover:bg-[#dcff7a]"
                        disabled={errors.message}
                    >
                        <Send size={20} />
                    </button>

                </div>

            </form>

        </div>
    );
}

export default ChatAi;
