import { useParams, useSearchParams } from 'react-router-dom';
import { StreamPlayer } from '../components/Players/StreamPlayer';
import { Chat } from '../components/ChatCompnents/Chat';
import { useWebRTCStream } from '../hooks/useWebRTCStream';

export const Stream = () => {
  const { streamId } = useParams<{ streamId: string }>();
  const [searchParams] = useSearchParams();
  const isStreamer = searchParams.get('streamer') === 'true';

  const { socket, localStream, remoteStream, messages, viewerCount } = useWebRTCStream(streamId!, isStreamer);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="relative bg-[#252525] rounded-xl overflow-hidden aspect-video border border-[rgba(255,255,255,0.1)] shadow-lg">
            {isStreamer || remoteStream ? (
              <StreamPlayer
                stream={isStreamer ? localStream : remoteStream}
                muted // Mute for both streamer and viewer to allow auto-play
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                Waiting for stream...
              </div>
            )}
            {isStreamer && (
              <div className="absolute top-2 left-2 bg-[rgba(33,33,33,0.95)] text-[rgba(255,255,255,0.9)] px-2 py-1 rounded-md text-sm backdrop-blur-md">
                Streaming
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