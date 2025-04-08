import { useState, FormEvent } from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage } from '../../types';

interface ChatProps {
  socket: Socket;
  streamId: string;
  messages: ChatMessage[];
  viewerCount: number;
  
}

export const Chat = ({ socket, streamId, messages, viewerCount }: ChatProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat-message', { to: streamId, message });
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md h-[80vh] bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between bg-[rgba(33,33,33,0.95)] backdrop-blur-md">
        <h3 className="text-lg font-semibold text-white">Live Chat</h3>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-sm text-[rgba(255,255,255,0.7)]">{viewerCount} viewers</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start gap-3">
            <img
              src={`https://robohash.org/${encodeURIComponent(msg.from)}?set=set1&size=80x80`}
              alt={`${msg.from}'s avatar`}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="bg-[#252525] rounded-lg p-3 border border-[rgba(255,255,255,0.1)] transition-all hover:border-[rgba(255,255,255,0.2)]">
                <p className="text-sm text-[rgba(255,255,255,0.9)] break-words">{msg.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.1)]">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[#252525] text-white border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent transition-all"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white px-4 py-2 rounded-lg hover:from-[#2563eb] hover:to-[#3b82f6] disabled:from-[#4b5563] disabled:to-[#6b7280] disabled:cursor-not-allowed transition-all shadow-md"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};