import { useState, FormEvent, useRef, useEffect } from "react";
import { Socket } from "socket.io-client";
import { ChatMessage } from "../../types";
import {  Send } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "../../components/ui/sheet"; // Adjust path based on your setup
import { Button } from "../../components/ui/button"; // For the Send button
import { Input } from "../../components/ui/input"; // For the input field

interface ChatProps {
  socket: Socket;
  callId: string;
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
<SheetContent
  side="right"
  className="w-[400px] sm:w-[540px] bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] border-l border-[rgba(255,255,255,0.1)] p-0 flex flex-col rounded-xl"
>


<SheetHeader className="p-2 border-b border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white font-medium">Chat</SheetTitle>
            <SheetClose asChild>
          
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="flex items-start gap-3">
              
              {/* <img
                src={`https://robohash.org/${encodeURIComponent(msg.from)}?set=set1&size=80x80`}
                alt={`${msg.from}'s avatar`}
                className="w-10 h-10 rounded-full"
              /> */}
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

        <div className="p-2 border-t border-[rgba(255,255,255,0.1)]">
          <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
  ref={inputRef}
  type="text"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  placeholder="Type your message..."
  className="flex-1 bg-[#252525] text-white border-[rgba(255,255,255,0.1)] transition-all rounded-lg"
/>

<Button
  type="submit"
  disabled={!message.trim()}
  className="bg-white text-[#1a1a1a] hover:bg-[#f3f3f3] disabled:bg-[#e0e0e0] transition-all flex items-center justify-center rounded-lg"
>
  <Send size={18} />
</Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};