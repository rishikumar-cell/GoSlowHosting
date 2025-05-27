import React, { useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import Sound from 'react-native-sound';

// Set category so it plays even in silent mode (iOS-safe)
Sound.setCategory('Playback');

const SpeedAlert = () => {
  useEffect(() => {
    const alertSound = new Sound('alert.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        Alert.alert('Error', 'Could not load the alert sound.');
        return;
      }

      alertSound.play((success) => {
        if (!success) {
          console.log('Playback failed');
          Alert.alert('Error', 'Alert sound playback failed.');
        }
      });
    });

    return () => {
      alertSound.release();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speed Alert Activated</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SpeedAlert;



