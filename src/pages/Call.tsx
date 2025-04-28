// src/pages/Call.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from '../components/Players/VideoPlayer';
import { ScreenSharePlayer } from '../components/Players/ScreenSharePlayer';
import { useWebRTCCall } from '../hooks/useWebRTCCall';
import { PersonalChat } from '../components/ChatCompnents/PersonalChat';
import { toast } from 'sonner';
import { MessageSquare,ScreenShare} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export const Call = () => {
  const { callId } = useParams<{ callId: string }>();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(true);
  const [tempUsername, setTempUsername] = useState('');

  const {
    localStream,
    remoteStreams,
    screenShareStream,
    remoteScreenStreams,
    socket,
    messages,
    startScreenShare,
    stopScreenShare,
  } = useWebRTCCall(callId!, () => {}, username); // Empty callback to prevent toast on call page entry

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleScreenShare = () => {
    if (screenShareStream) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
      setIsUsernameModalOpen(false);
      // Show toast after successful username submission
      toast.success(`Participant ${tempUsername.trim()} joined the call!`, {
        description: `${new Date().toLocaleTimeString()} - New participant connected`,
        duration: 5000,
        style: {
          background: 'rgba(33, 33, 33, 0.95)',
          color: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(4px)',
        },
        position: 'top-right',
      });
    }
  };

  // Prevent dialog from closing unless a valid username is submitted
  const handleOpenChange = (open: boolean) => {
    if (!open && !username) {
      return; // Do not allow closing if username is not set
    }
    setIsUsernameModalOpen(open);
  };

  const hasNewMessages = false; // Replace with actual logic

  // Render only the dialog until a username is entered
  if (!username) {
    return (
      <Dialog open={isUsernameModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-[#252525] text-white border-[rgba(255,255,255,0.1)]">
          <DialogHeader>
            <DialogTitle>Enter Your Username</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUsernameSubmit}>
            <div className="py-4">
              <Input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="Your username"
                className="bg-[#1a1a1a] text-white border-[rgba(255,255,255,0.1)]"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={!tempUsername.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Join Call
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Main content rendered only after username is set
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white p-6">
      {/* Video Streams Section */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Local Video Stream */}
          {localStream && (
            <div className="relative bg">
              <VideoPlayer stream={localStream} muted={true} className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 bg-[rgba(33,33,33,0.95)] text-[rgba(255,255,255,0.9)] px-2 py-1 rounded-md text-sm backdrop-blur-md">
                {username || 'You'}
              </div>
            </div>
          )}

          {/* Remote Video Streams */}
          {Object.entries(remoteStreams).map(([socketId, stream]) => (
            <div
              key={socketId}
              className="relative bg-[#252525] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)] shadow-lg"
            >
              <VideoPlayer stream={stream} className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 bg-[rgba(33,33,33,0.95)] text-[rgba(255,255,255,0.9)] px-2 py-1 rounded-md text-sm backdrop-blur-md">
                Participant
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Screen Share Section */}
      {(screenShareStream || Object.keys(remoteScreenStreams).length > 0) && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Screen Shares</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Local Screen Share */}
            {screenShareStream && (
              <div className="relative bg">
                <ScreenSharePlayer stream={screenShareStream} className="w-full h-full" />
              </div>
            )}

            {/* Remote Screen Shares */}
            {Object.entries(remoteScreenStreams).map(([socketId, stream]) => (
              <div
                key={`screen-${socketId}`}
                className="relative bg-[#252525] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)] shadow-lg"
              >
                <ScreenSharePlayer stream={stream} className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screen Share Button */}
      <button
      onClick={handleScreenShare}
      className={`fixed right-20 bottom-6 p-3 rounded-full transition-all shadow-lg z-20 border border-black ${
        screenShareStream
          ? 'bg-white text-red-600 hover:bg-red-600 hover:text-white'
          : 'bg-white text-black hover:bg-black hover:text-white'
      }`}
    >
      <ScreenShare size={24} />
    </button>


      {/* Chat Toggle Button */}
      {!isChatOpen && (
      <button
        onClick={toggleChat}
        className="fixed right-6 bottom-6 bg-white text-black p-3 rounded-full hover:bg-black hover:text-white border border-black transition-all shadow-lg z-20"
      >
        <div className="relative">
          <MessageSquare size={24} />
          {hasNewMessages && (
            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3"></span>
          )}
        </div>
      </button>
    )}


      {socket && username && (
        <PersonalChat
          socket={socket}
          callId={callId!}
          messages={messages}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          username={username}
        />
      )}
    </div>
  );
};