import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { serviceContainer } from '@/lib/ServiceContainer';
import { FeedService } from '@/services/FeedService';
import { FeedItem } from '@/types/feed';
import VideoControls from '@/components/VideoControls';
import FeedError from '@/components/FeedError';

const Feed = () => {
  const videoRef = useRef<VideoRef>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videos, setVideos] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const translateY = useSharedValue(0);

  const loadFeed = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const feedService = serviceContainer.getService<FeedService>('FeedService');
      const feed = await feedService.getFeed();
      setVideos(feed);
    } catch (err) {
      setError('Failed to load feed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.seek(0);
      }
    };
  }, []);

  const handleSwipe = useCallback((direction: 'up' | 'down') => {
    translateY.value = withSpring(direction === 'up' ? -100 : 100, {
      velocity: 0.5,
    }, () => {
      translateY.value = 0;
      setCurrentIndex(prev => {
        const newIndex = direction === 'up' 
          ? (prev + 1) % videos.length
          : (prev - 1 + videos.length) % videos.length;
        return newIndex;
      });
    });
  }, [videos.length]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return <FeedError message={error} onRetry={loadFeed} />;
  }

  if (videos.length === 0) {
    return (
      <FeedError 
        message="No videos available" 
        onRetry={loadFeed} 
      />
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: videos[currentIndex].uri }}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={false}
        />
        <VideoControls 
          videoRef={videoRef}
          onSwipeUp={() => handleSwipe('up')}
          onSwipeDown={() => handleSwipe('down')}
        />
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});

export default Feed;