import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';

// Enable playback in silent mode
Sound.setCategory('Playback');

const SpeedAlert = () => {
  useEffect(() => {
    // Load sound from android/app/src/main/res/raw/alert.mp3
    const alertSound = new Sound('alert', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log(' Failed to load sound:', error);
        return;
      }

      // Play sound
      alertSound.play((success) => {
        if (!success) {
          console.log(' Playback failed');
        }
      });
    });

    // Cleanup
    return () => {
      alertSound.release();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../android/app/src/main/assets/speed-alert.png')}
        style={styles.image}
      />
      <Text style={styles.title}>⚠ Speed Alert Activated</Text>
    </View>
  );
};

export default SpeedAlert;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D10000',
    marginTop: 20,
  },
});