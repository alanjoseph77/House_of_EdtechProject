import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, PanResponder, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Player'>;

const BAR_WIDTH = 300;
const SKIP_SECONDS = 10;
const HIDE_DELAY_MS = 3000;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function PlayerScreen({ route, navigation }: Props) {
  const { videoUrl, title } = route.params;
  const insets = useSafeAreaInsets();

  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = false;
    p.play();
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState(0);

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), HIDE_DELAY_MS);
  }, []);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => {
    scheduleHide();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [scheduleHide]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrubbing) setCurrentTime(player.currentTime);
      setDuration(player.duration || 0);
      setIsPlaying(player.playing);
      setIsBuffering(player.status === 'loading');
    }, 250);
    return () => clearInterval(interval);
  }, [player, scrubbing]);

  const togglePlay = useCallback(() => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
    showControls();
  }, [player, showControls]);

  const skip = useCallback(
    (delta: number) => {
      const next = Math.min(Math.max(player.currentTime + delta, 0), duration || player.currentTime + delta);
      player.currentTime = next;
      setCurrentTime(next);
      showControls();
    },
    [player, duration, showControls]
  );

  const seekToRatio = useCallback(
    (ratio: number) => {
      const clamped = Math.min(Math.max(ratio, 0), 1);
      return clamped * (duration || 0);
    },
    [duration]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          setScrubbing(true);
          const ratio = evt.nativeEvent.locationX / BAR_WIDTH;
          setScrubTime(seekToRatio(ratio));
        },
        onPanResponderMove: (evt) => {
          const ratio = evt.nativeEvent.locationX / BAR_WIDTH;
          setScrubTime(seekToRatio(ratio));
        },
        onPanResponderRelease: (evt) => {
          const ratio = evt.nativeEvent.locationX / BAR_WIDTH;
          const target = seekToRatio(ratio);
          player.currentTime = target;
          setCurrentTime(target);
          setScrubbing(false);
          showControls();
        },
      }),
    [player, seekToRatio, showControls]
  );

  const displayTime = scrubbing ? scrubTime : currentTime;
  const progressRatio = duration > 0 ? displayTime / duration : 0;

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Pressable style={StyleSheet.absoluteFill} onPress={() => (controlsVisible ? setControlsVisible(false) : showControls())}>
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          nativeControls={false}
          contentFit="contain"
        />
      </Pressable>

      {isBuffering && (
        <View style={styles.centerOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      )}

      {controlsVisible && (
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.iconButton}>
              <Ionicons name="chevron-back" size={26} color="#fff" />
            </Pressable>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.iconButton} />
          </View>

          <View style={styles.centerControls} pointerEvents="box-none">
            <Pressable onPress={() => skip(-SKIP_SECONDS)} hitSlop={16} style={styles.iconButton}>
              <Ionicons name="play-back" size={30} color="#fff" />
            </Pressable>
            <Pressable onPress={togglePlay} hitSlop={16} style={styles.playButton}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color="#fff" />
            </Pressable>
            <Pressable onPress={() => skip(SKIP_SECONDS)} hitSlop={16} style={styles.iconButton}>
              <Ionicons name="play-forward" size={30} color="#fff" />
            </Pressable>
          </View>

          <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
            <Text style={styles.time}>{formatTime(displayTime)}</Text>
            <View style={styles.barWrapper} {...panResponder.panHandlers}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${progressRatio * 100}%` }]} />
              </View>
              <View style={[styles.thumb, { left: progressRatio * BAR_WIDTH - 6 }]} />
            </View>
            <Text style={styles.time}>{formatTime(duration)}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centerOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  centerControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 36,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(229,9,20,0.9)',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  time: { color: '#fff', fontSize: 12, width: 40, textAlign: 'center' },
  barWrapper: { width: BAR_WIDTH, height: 24, justifyContent: 'center' },
  barTrack: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  barFill: { height: 4, borderRadius: 2, backgroundColor: '#E50914', position: 'absolute' },
  thumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E50914',
  },
});
