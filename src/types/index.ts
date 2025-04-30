export interface RTCPeerConnectionsMap {
  [socketId: string]: RTCPeerConnection;
}

export interface ChatMessage {
from: string;
  message: string;
  username?: string;
  createdAt?: string;
}


export interface StreamProps {
  streamId: string;
  isStreamer: boolean;
}

export interface CallProps {
  callId: string;
}