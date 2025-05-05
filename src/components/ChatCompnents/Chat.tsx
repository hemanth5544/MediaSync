import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage } from '../../types';
import { MessageSquare, Send, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface ChatProps {
  socket: Socket;
  streamId: string;
  messages: ChatMessage[];
  viewerCount: number;
}

export const Chat = ({ socket, streamId, messages, viewerCount }: ChatProps) => {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(true);
  const [tempUsername, setTempUsername] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [newMessageIndex, setNewMessageIndex] = useState(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('brodcast-message', () => {
      scrollToBottom();
    });
    return () => {
      socket.off('brodcast-message');
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setNewMessageIndex(messages.length - 1);
      setTimeout(() => setNewMessageIndex(-1), 800);
    }
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && username) {
      socket.emit('chat-message', { 
        to: streamId, 
        message: message.trim(), 
        from: username 
      });
      setMessage('');
    }
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUsername.trim()) {
      const finalUsername = tempUsername.trim();
      setUsername(finalUsername);
      socket.emit('set-username', { 
        username: finalUsername,
        streamId 
      });
      setIsUsernameModalOpen(false);
      toast.success(`Welcome to the stream, ${finalUsername}!`, {
        description: `${new Date().toLocaleTimeString()} - You joined the chat`,
        duration: 5000,
        style: {
          background: "rgba(33, 33, 33, 0.95)",
          color: "rgba(255, 255, 255, 0.9)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(4px)",
        },
        position: "top-right",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !username) {
      return;
    }
    setIsUsernameModalOpen(open);
  };

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  // Generate random color based on username
  const getUserColor = (name: string) => {
    const colors = [
      '#777777', '#999999', '#BBBBBB', '#CCCCCC', 
      '#AAAAAA', '#888888', '#DDDDDD', '#A0A0A0', 
      '#B9B9B9', '#C5C5C5', '#D3D3D3'
    ];
    
    // Simple hash function to get consistent colors for usernames
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const ChatMessageItem = ({ message, isOwnMessage, showAvatar, index }: { message: ChatMessage; isOwnMessage: boolean; showAvatar: boolean, index: number }) => {
    const displayName = isOwnMessage ? username : (message.from || `User-${message.from?.slice(0, 4)}`);
    const fallbackInitials = displayName.slice(0, 2).toUpperCase();
    const userColor = getUserColor(displayName);
    const isNew = index === newMessageIndex;
    
    return (
      <div 
        className={cn(
          "flex px-2 py-1.5 hover:bg-[rgba(255,255,255,0.05)] rounded transition-all duration-300 group",
          isNew && "animate-fadeIn"
        )}
        style={{
          transform: isNew ? 'translateX(0)' : undefined,
          animation: isNew ? 'slideIn 0.3s ease-out forwards' : undefined,
          opacity: isNew ? 0 : 1,
        }}
      >
        {showAvatar && (
          <Avatar className="w-7 h-7 mr-2 mt-0.5 flex-shrink-0 ring-1 ring-white/10">
            <AvatarFallback style={{ backgroundColor: userColor }} className="text-black text-xs font-bold">
              {fallbackInitials}
            </AvatarFallback>
          </Avatar>
        )}
        {!showAvatar && <div className="w-7 mr-2 flex-shrink-0" />}
        
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm" style={{ color: userColor }}>{displayName}</span>
            <span className="text-xs text-[rgba(255,255,255,0.4)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
            {isOwnMessage && (
              <span className="text-xs bg-[rgba(255,255,255,0.1)] px-1.5 py-0.5 rounded-full text-[rgba(255,255,255,0.7)] text-[10px] ml-1">YOU</span>
            )}
          </div>
          <p className="text-sm text-white break-words">{message.message}</p>
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    return messages.map((msg, index) => {
      const isOwnMessage = msg.from === username;
      const prevMessage = index > 0 ? messages[index - 1] : null;
      const showAvatar = !prevMessage || prevMessage.from !== msg.from;
      return (
        <ChatMessageItem
          key={index}
          message={msg}
          isOwnMessage={isOwnMessage}
          showAvatar={showAvatar}
          index={index}
        />
      );
    });
  };

  if (!username) {
    return (
      <Dialog open={isUsernameModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white border-[rgba(255,255,255,0.1)] rounded-xl shadow-lg animate-dialogIn">
          <DialogHeader>
            <DialogTitle className="text-white font-medium text-center text-xl">Enter Your Username</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUsernameSubmit}>
            <div className="py-6">
              <Input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="Your username"
                className="bg-[#252525] text-white border-[rgba(255,255,255,0.1)] rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-500/30 transition-all duration-300"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={!tempUsername.trim()}
                className="w-full bg-white text-black hover:bg-gray-200 disabled:bg-white/30 transition-all duration-300 rounded-lg"
              >
                Join Stream Chat
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed right-6 bottom-6 bg-white text-black p-3 rounded-full hover:bg-gray-200 border border-[rgba(255,255,255,0.1)] transition-all duration-300 shadow-lg z-20"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-md h-[90vh] md:h-[95vh] bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-lg transition-all animate-slideUp">
      {/* Header */}
      <div className="p-3 border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between bg-[rgba(33,33,33,0.95)] backdrop-blur-md rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
          <h3 className="text-base font-medium text-white">Live Chat</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded-full">
            <Users size={14} className="text-white/80" />
            <span className="text-sm font-medium text-white/90">{viewerCount}</span>
          </div>
          <button 
            onClick={toggleVisibility}
            className="text-[rgba(255,255,255,0.5)] hover:text-white transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18"></path>
              <path d="M6 6L18 18"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-[rgba(255,255,255,0.1)] scrollbar-track-transparent"
        style={{scrollBehavior: 'smooth'}}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-2 animate-fadeIn">
            <MessageSquare size={40} className="text-white/20" />
            <p className="text-white/50 text-sm">No messages yet. Be the first to chat!</p>
          </div>
        ) : (
          renderMessages()
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.1)] bg-[rgba(33,33,33,0.95)]">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message"
            className="flex-1 bg-[#252525] text-white border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300"
          />
          <Button
            type="submit"
            disabled={!message.trim()}
            className="bg-white text-black hover:bg-gray-200 disabled:bg-white/30 transition-all duration-300 flex items-center justify-center rounded-lg"
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};