import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { getAudioUrl } from '../services/api';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [voice, setVoice] = useState('male');
  const [speed, setSpeed] = useState(1.0);

  const soundRef = useRef(null);

  const cleanup = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {
        // Ignore cleanup errors
      }
      soundRef.current = null;
    }
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
  }, []);

  const playChapter = useCallback(
    async (bookAbbrev, chapter) => {
      setIsLoading(true);
      await cleanup();

      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });

        const url = getAudioUrl(bookAbbrev, chapter, voice, speed);
        const { sound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded) {
              setPosition(status.positionMillis || 0);
              setDuration(status.durationMillis || 0);
              setIsPlaying(status.isPlaying);
              if (status.didJustFinish) {
                setIsPlaying(false);
              }
            }
          }
        );

        soundRef.current = sound;
        setCurrentBook(bookAbbrev);
        setCurrentChapter(chapter);
        setIsPlaying(true);
      } catch (error) {
        console.error('Audio playback error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [voice, speed, cleanup]
  );

  const togglePlayPause = useCallback(async () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  }, [isPlaying]);

  const seekTo = useCallback(async (positionMs) => {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(positionMs);
  }, []);

  const setPlaybackSpeed = useCallback(
    async (newSpeed) => {
      setSpeed(newSpeed);
      if (soundRef.current) {
        await soundRef.current.setRateAsync(newSpeed, true);
      }
    },
    []
  );

  const stop = useCallback(async () => {
    await cleanup();
    setCurrentBook(null);
    setCurrentChapter(null);
  }, [cleanup]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isLoading,
        currentBook,
        currentChapter,
        position,
        duration,
        voice,
        speed,
        setVoice,
        playChapter,
        togglePlayPause,
        seekTo,
        setPlaybackSpeed,
        stop,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
