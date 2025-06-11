import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const mapRef = useRef(null);
  const watchId = useRef(null);
  const navigation = useNavigation();

  const [tracking, setTracking] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [alerted, setAlerted] = useState(false);

  const USER_ID = 'bike001';
  const BACKEND_URL = 'http://192.168.168.172:8000/update-location/';
  const ALERT_URL = `http://192.168.168.172:8000/check-alert/${USER_ID}/`;
  const START_RIDE_URL = 'http://192.168.168.172:8000/start-ride/';
  const STOP_RIDE_URL = 'http://192.168.168.172:8000/stop-ride/';

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Location permission is required');
        }
      }
    } catch (err) {
      console.warn('Permission error:', err);
    }
  };

  const startTracking = async () => {
    setTracking(true);
    setAlerted(false);

    try {
      await fetch(START_RIDE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bike_id: USER_ID }),
      });
    } catch (err) {
      console.log('Start ride error:', err);
    }

    watchId.current = Geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, speed: rawSpeed } = position.coords;
        const speedKmh = Math.round((rawSpeed || 0) * 3.6);

        setOrigin({ latitude, longitude });
        setSpeed(speedKmh);

        try {
          await fetch("http:192.168.168.172:8000/update-location/", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bike_id: "bike001",
              latitude,
              longitude,
              speed: speedKmh,
            }),
          });

          const alertRes = await fetch(ALERT_URL);
          const alertData = await alertRes.json();

          if (alertData.alert && !alerted) {
            setAlerted(true);
            navigation.navigate('SpeedAlert');
          }
        } catch (err) {
          console.log('Location update or alert fetch error:', err);
        }
      },
      (error) => console.log('Watch error:', error),
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 2000,
        fastestInterval: 1000,
        useSignificantChanges: false,
      }
    );
  };

  const stopTracking = async () => {
    setTracking(false);
    setAlerted(false);
    setSpeed(0);
    setOrigin(null);

    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
    }

    try {
      await fetch(STOP_RIDE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bike_id: USER_ID }),
      });
    } catch (err) {
      console.log('Stop ride error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        showsUserLocation
        followsUserLocation
        region={
          origin
            ? {
                latitude: origin.latitude,
                longitude: origin.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : {
                latitude: 28.6139,
                longitude: 77.2090,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
        }
      >
        {origin && <Marker coordinate={origin} title="Current Location" />}
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, tracking && styles.disabledButton]}
          onPress={startTracking}
          disabled={tracking}
        >
          <Text style={styles.buttonText}>ON</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !tracking && styles.disabledButton]}
          onPress={stopTracking}
          disabled={!tracking}
        >
          <Text style={styles.buttonText}>OFF</Text>
        </TouchableOpacity>
      </View>

      {tracking && (
        <View style={styles.speedCircle}>
          <Text style={styles.speedLabel}>Speed </Text>
          <Text style={styles.speedValue}>{speed}</Text>
          <Text style={styles.unit}>km/h</Text>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  buttonContainer: {
    position: 'absolute',
    top: 40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    zIndex: 999,
  },
  button: {
    backgroundColor: '#0A84FF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#AAB2BD',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  speedCircle: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedLabel: {
    color: '#fff',
    fontSize: 14,
  },
  speedValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  unit: {
    color: '#ccc',
    fontSize: 12,
  },
});


