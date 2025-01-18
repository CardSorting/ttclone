import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

interface VideoControlsProps {
  videoRef: React.RefObject<any>;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  videoRef,
  onSwipeUp,
  onSwipeDown,
}) => {
  const panGesture = Gesture.Pan()
    .onEnd((e) => {
      if (e.translationY < -50) {
        onSwipeUp();
      } else if (e.translationY > 50) {
        onSwipeDown();
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={styles.container}>
        <View style={styles.controlsContainer}>
          {/* Placeholder for actual controls */}
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
  controlsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoControls;