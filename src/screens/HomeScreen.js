import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, PermissionsAndroid, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';

const GOOGLE_API_KEY = 'AIzaSyDgeazKbpGJ-GQIDolhkfgDk2XfTbrBKcs';

const HomeScreen = () => {
  const mapRef = useRef(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.watchPosition(
            position => {
              const { coords } = position;
              setSpeed(Math.round(coords.speed * 3.6)); // m/s to km/h
              if (!origin) {
                setOrigin({
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                });
              }
            },
            error => console.log(error),
            {
              enableHighAccuracy: true,
              distanceFilter: 1,
              interval: 1000,
              fastestInterval: 500,
            },
          );
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();
  }, );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        showsUserLocation
        initialRegion={{
          latitude: 28.6139,
          longitude: 77.2090,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {origin && <Marker coordinate={origin} title="Origin" />}
        {destination && <Marker coordinate={destination} title="Destination" />}

        {origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_API_KEY}
            strokeWidth={4}
            strokeColor="blue"
            onReady={result => {
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
              });
            }}
          />
        )}
      </MapView>

      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          placeholder="From..."
          onPress={(data, details = null) => {
            const loc = details.geometry.location;
            setOrigin({ latitude: loc.lat, longitude: loc.lng });
          }}
          fetchDetails
          query={{ key: GOOGLE_API_KEY, language: 'en' }}
          styles={autoCompleteStyles}
          enablePoweredByContainer={false}
          textInputProps={{
            placeholderTextColor: '#000',
          }}
          predefinedPlaces={[]}
        />

        <GooglePlacesAutocomplete
          placeholder="To..."
          onPress={(data, details = null) => {
            const loc = details.geometry.location;
            setDestination({ latitude: loc.lat, longitude: loc.lng });
          }}
          fetchDetails
          query={{ key: GOOGLE_API_KEY, language: 'en' }}
          styles={autoCompleteStyles}
          enablePoweredByContainer={false}
          textInputProps={{
            placeholderTextColor: '#000',
          }}
          predefinedPlaces={[]}
        />
      </View>

      <View style={styles.speedContainer}>
        <Text style={styles.speedText}>{speed} km/h</Text>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 40,
    width: '90%',
    alignSelf: 'center',
    zIndex: 999,
  },
  speedContainer: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 10,
  },
  speedText: {
    color: '#fff',
    fontSize: 18,
  },
});

const autoCompleteStyles = {
  container: {
    flex: 0,
    marginBottom: 10,
  },
  textInput: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
};
