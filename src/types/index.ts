export interface RTCPeerConnectionsMap {
  [key: string]: RTCPeerConnection;
}

export interface ChatMessage {
  message: string;
  from: string;
}

export interface StreamProps {
  streamId: string;
  isStreamer: boolean;
}

export interface CallProps {
  callId: string;
}