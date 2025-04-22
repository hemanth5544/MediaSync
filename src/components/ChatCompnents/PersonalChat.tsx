import { useState, FormEvent, useRef, useEffect } from "react";
import { Socket } from "socket.io-client";
import { ChatMessage } from "../../types";
import { Send } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { cn } from "../../lib/utils";

interface ChatProps {
  socket: Socket;
  callId: string;
  messages: ChatMessage[];
  isOpen: boolean;
  onClose: () => void;
  username?: string;
}

export const PersonalChat = ({ socket, messages, callId, isOpen, onClose, username = "User" }: ChatProps) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle sending a message
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("personal-chat", { to: callId, message });
      setMessage("");
    }
  };

  // Render individual chat message
  const ChatMessageItem = ({ message, isOwnMessage, showAvatar }: { message: ChatMessage; isOwnMessage: boolean; showAvatar: boolean }) => {
    const displayName = isOwnMessage ? username : message.from;
    const fallbackInitials = displayName.slice(0, 2).toUpperCase();

    return (
      <div className={`flex mt-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
        <div
          className={cn("max-w-[75%] w-fit flex flex-col gap-1", {
            "items-end": isOwnMessage,
          })}
        >
          <div
            className={cn("flex items-center gap-2 text-xs px-3", {
              "justify-end flex-row-reverse": isOwnMessage,
            })}
          >
            {showAvatar && (
              <Avatar className="w-6 h-6">
                <AvatarFallback>{fallbackInitials}</AvatarFallback>
              </Avatar>
            )}
            <span className="font-medium text-white">{displayName}</span>
          </div>
          <div
            className={cn(
              "py-2 px-3 rounded-xl text-sm w-fit",
              isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
            )}
          >
            {message.message}
          </div>
        </div>
      </div>
    );
  };

  // Determine when to show avatars (hide for consecutive messages from the same user)
  const renderMessages = () => {
    return messages.map((msg, index) => {
      const isOwnMessage = msg.from === socket.id;
      const prevMessage = index > 0 ? messages[index - 1] : null;
      const showAvatar = !prevMessage || prevMessage.from !== msg.from;
      return (
        <ChatMessageItem
          key={index}
          message={msg}
          isOwnMessage={isOwnMessage}
          showAvatar={showAvatar}
        />
      );
    });
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
            <SheetClose asChild />
          </div>
        </SheetHeader>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {renderMessages()}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-[rgba(255,255,255,0.1)]">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-[#252525] text-white border-[rgba(255,255,255,0.1)] rounded-lg"
            />
            <Button
              type="submit"
              disabled={!message.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted transition-all flex items-center justify-center rounded-lg"
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};