import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import Sound from 'react-native-sound';

// Ensure audio plays in all modes
Sound.setCategory('Playback');

const SpeedAlert = () => {
  useEffect(() => {
    // Correct sound loading for both platforms
    const alertSound = new Sound(
      Platform.OS === 'android' ? 'alert' : 'alert.mp3',
      Sound.MAIN_BUNDLE,
      (error) => {
        if (error) {
          console.log('Failed to load sound:', error);
          return;
        }

        alertSound.play((success) => {
          if (!success) {
            console.log('Playback failed');
          }
        });
      }
    );

    return () => {
      alertSound.release();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Platform-specific image handling */}
      <View style={styles.imageContainer}>
        {Platform.OS === 'android' ? (
          <Image
            source={{ uri: 'assets:/speed-alert.png' }}
            style={styles.image}
          />
        ) : (
          // Fallback for iOS (use local image or emoji)
          <Text style={styles.emoji}>🚨</Text>
        )}
      </View>
      
      <Text style={styles.title}>⚠ High-Speed Bike Nearby!</Text>
      <Text style={styles.subtitle}>Stay alert and drive safe.</Text>
    </View>
  );
};

export default SpeedAlert;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4F4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    height: 140,
    width: 140,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  emoji: {
    fontSize: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D10000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

