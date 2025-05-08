import { useParams, useSearchParams } from 'react-router-dom';
import { StreamPlayer } from '../components/Players/StreamPlayer';
import { Chat } from '../components/ChatCompnents/Chat';
import { useWebRTCStream } from '../hooks/useWebRTCStream';

export const Stream = () => {
  const { streamId } = useParams<{ streamId: string }>();
  const [searchParams] = useSearchParams();
  const isStreamer = searchParams.get('streamer') === 'true';

  const { socket, localStream, remoteStream, messages, viewerCount, leaveStream } = useWebRTCStream(streamId!, isStreamer);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="relative bg-[#252525] rounded-xl overflow-hidden aspect-video border border-[rgba(255,255,255,0.1)] shadow-lg">
            {isStreamer || remoteStream ? (
              <StreamPlayer
                stream={isStreamer ? localStream : remoteStream}
                muted={isStreamer} // Mute for streamer, but allow viewers to hear
                isLocalStream={isStreamer}
                onLeaveCall={isStreamer ? leaveStream : undefined}
                className="w-full h-full"
                autoPlay={true}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <div className="text-center space-y-2">
                  <div className="animate-pulse text-zinc-400">
                    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p>Waiting for stream to begin...</p>
                </div>
              </div>
            )}
            
            {/* Stream Status Badge */}
            {isStreamer ? (
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="font-medium tracking-wide">LIVE</span>
              </div>
            ) : viewerCount > 0 && (
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="font-medium tracking-wide">{viewerCount} watching</span>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          {socket && (
            <Chat
              socket={socket}
              streamId={streamId!}
              messages={messages}
              viewerCount={viewerCount}
            />
          )}
        </div>
      </div>
    </div>
  );
};