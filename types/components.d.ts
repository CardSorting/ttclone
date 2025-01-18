declare module '@/components/VideoControls' {
  import { ComponentType } from 'react';
  import { RefObject } from 'react';
  
  interface VideoControlsProps {
    videoRef: RefObject<any>;
    onSwipeUp: () => void;
    onSwipeDown: () => void;
  }

  const VideoControls: ComponentType<VideoControlsProps>;
  export default VideoControls;
}

declare module '@/components/FeedError' {
  import { ComponentType } from 'react';
  
  interface FeedErrorProps {
    message: string;
    onRetry: () => void;
  }

  const FeedError: ComponentType<FeedErrorProps>;
  export default FeedError;
}