import { useState, FormEvent, useRef, useEffect } from "react";
import { Socket } from "socket.io-client";
import { ChatMessage } from "../../types";
import { X, Send } from "lucide-react";

interface ChatProps {
  socket: Socket;
  callId: String;
  messages: ChatMessage[];
  isOpen: boolean;
  onClose: () => void;
}

export const PersonalChat = ({ socket, messages, callId, isOpen, onClose }: ChatProps) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("personal-chat", { to: callId, message });
      setMessage("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-3 h-full bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] border-l border-[rgba(255,255,255,0.1)] shadow-lg z-10 flex flex-col rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.1)] rounded-t-lg">
        <h3 className="text-white font-medium">Chat</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4 rounded-b-lg">
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start gap-3">
            <img
              src={`https://robohash.org/${encodeURIComponent(
                msg.from
              )}?set=set1&size=80x80`}
              alt={`${msg.from}'s avatar`}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="bg-[#252525] rounded-lg p-3 border border-[rgba(255,255,255,0.1)] transition-all hover:border-[rgba(255,255,255,0.2)]">
                <p className="text-sm text-[rgba(255,255,255,0.9)] break-words">
                  {msg.message}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[rgba(255,255,255,0.1)] rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[#252525] text-white border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white px-4 py-2 rounded-lg hover:from-[#2563eb] hover:to-[#3b82f6] disabled:from-[#4b5563] disabled:to-[#6b7280] disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
