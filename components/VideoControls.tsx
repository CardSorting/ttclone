import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

interface IconProps {
  name: 'heart' | 'comment' | 'share' | 'volumeOn' | 'volumeOff';
  size?: number;
  color?: string;
  style?: object;
}

interface VideoControlsProps {
  videoRef: React.RefObject<any>;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  onLike: () => void;
}

const HEART_SIZE = 80;
const SIDE_CONTROLS_WIDTH = 60;

const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#FFFFFF', style = {} }) => {
  const icons: Record<IconProps['name'], string> = {
    heart: '❤️',
    comment: '💬',
    share: '↗️',
    volumeOn: '🔊',
    volumeOff: '🔇',
  };

  return (
    <Text style={[{ fontSize: size, color }, style]}>
      {icons[name]}
    </Text>
  );
};

const VideoControls: React.FC<VideoControlsProps> = ({
  videoRef,
  onSwipeUp,
  onSwipeDown,
  onLike,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const heartScale = useSharedValue(0);
  const lastTap = useRef(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      runOnJS(onLike)();
      runOnJS(setIsLiked)(true);
      heartScale.value = 1;
      require('react-native-haptic-feedback').trigger('impactLight');
      setTimeout(() => {
        heartScale.value = 0;
      }, 1000);
    }
    lastTap.current = now;
  };

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(heartScale.value, { duration: 200 }) }],
    opacity: heartScale.value,
  }));

  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onEnd((e) => {
      if (Math.abs(e.velocityY) > 500) {
        if (e.translationY < -50) {
          runOnJS(onSwipeUp)();
        } else if (e.translationY > 50) {
          runOnJS(onSwipeDown)();
        }
      }
    });

  const tapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(handleDoubleTap)();
    });

  const composedGestures = Gesture.Simultaneous(panGesture, tapGesture);

  return (
    <GestureDetector gesture={composedGestures}>
      <Animated.View style={styles.container}>
        {/* Heart Animation */}
        <Animated.View style={[styles.heartContainer, heartStyle]}>
          <Icon name="heart" size={HEART_SIZE} color="#FF3B30" />
        </Animated.View>

        {/* Side Controls */}
        <View style={styles.sideControls}>
          <TouchableOpacity onPress={onLike} style={styles.sideControl}>
            <Icon name="heart" size={24} color={isLiked ? '#FF3B30' : '#FFFFFF'} />
            <Text style={styles.sideControlText}>{isLiked ? 'Liked' : 'Like'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideControl}>
            <Icon name="comment" size={24} />
            <Text style={styles.sideControlText}>Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sideControl}>
            <Icon name="share" size={24} />
            <Text style={styles.sideControlText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sideControl}
            onPress={() => setIsMuted(!isMuted)}
          >
            <Icon name={isMuted ? 'volumeOff' : 'volumeOn'} size={24} />
            <Text style={styles.sideControlText}>
              {isMuted ? 'Unmute' : 'Mute'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  heartContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -HEART_SIZE / 2,
    marginTop: -HEART_SIZE / 2,
  },
  sideControls: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    width: SIDE_CONTROLS_WIDTH,
  },
  sideControl: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sideControlText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
  },
  progressBar: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
});

export default VideoControls;