import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { Location, Permissions, Notifications } from 'expo';
import MapView from 'react-native-maps';
import BackgroundGeolocation from "react-native-background-geolocation";
import { Places } from './seed';
import { localNotification, schedulingOptions } from './LocalNotification';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notification: null,
      location: null,
      errorMessage: null,
      region: {},
      markers: [
        { latlng: {latitude: 0, longitude: 0},
          title: "You are here"}
      ],
      closeBy: []
    }

    this._getNotificationAsync = this._getNotificationAsync.bind(this);
    this._getLocationAsync = this._getLocationAsync.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this._loadMarkers = this._loadMarkers.bind(this);
    this._handleButtonPress = this._handleButtonPress.bind(this);
    this.moveMapToLocation = this.moveMapToLocation.bind(this);

    this.watchId = null;
    this.getDistanceMatrix = this.getDistanceMatrix.bind(this);
    this.firePushNotification = this.firePushNotification.bind(this);

  };

  componentWillMount() {
    this._getNotificationAsync();
    this._getLocationAsync();
  }

  componentDidMount() {
    this.watchId = Location.watchPositionAsync({enableHighAccuracy: true, timeInterval: 1000}, (position) => {
      this.setState({region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922*1.5,
          longitudeDelta: 0.00421*1.5
      }})
      this.setState({ location: {
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      }})
      this.getDistanceMatrix();
  })}

  componentWillUnmount() {
    Location.clearWatch(this.watchId);
  }

  onRegionChange(region) {
    this.setState({ region })
  }

  _getNotificationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Enable notifications for this app!',
      })
    } else {
      this.setState({ notification: "You've allowed push notifications, yay!" });
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Enable GPS for this app!',
      })
    } else {
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
      this.setState({ location });
    }
  }
  
  // Get user's places of interest

  _loadMarkers = () => {  
    let latitude, longitude, title;
    let markers = [];
    Places.features.map(
      elem => {
        latitude = elem.geometry.coordinates[1];
        longitude = elem.geometry.coordinates[0];
        title = elem.properties.Title;
        markers.push({latlng: {latitude, longitude}, title})
      })
    this.setState({ markers })
  }

  _handleButtonPress = () => {  
    // Update to only load markers within region
      this._loadMarkers();
      Alert.alert(
        'You did it!',
        'Your places are ready to be discovered',
      );
  };

  moveMapToLocation = () => {
    this.setState({
      region: {
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
        latitude: this.state.location.coords.latitude,
        longitude: this.state.location.coords.longitude
      }
    })
    this.getDistanceMatrix();
    this.firePushNotification();
  }

  getDistanceMatrix = () => {
    let distance = require('react-native-google-matrix');
    let usersLoc = this.state.location.coords;
    let markers = this.state.markers;
    let closeBy = [];

    // Map over markers
    markers.map(elem => {
      distance.get(
        {
          origin: usersLoc.latitude+","+usersLoc.longitude,
          destination: elem.latlng.latitude+","+elem.latlng.longitude
        },
        function(err, data) {
          if (err) return console.log("hitting error 181", err);
          if (data.distanceValue < 600) {
            return closeBy.push(elem);
        }
      })
    })
      this.setState({ closeBy })
      if (this.state.closeBy.length) {
        this.firePushNotification();
      }
  }
  
  firePushNotification = () => {
    const localNotification = {
      title: 'Pingo!',
      body: 'You are near '+this.state.closeBy.map(elem=>elem.title).join(", "),
      ios: { 
        sound: true 
      },
      android:
      {
        sound: true,
        icon: 'https://d30y9cdsu7xlg0.cloudfront.net/png/62169-200.png',
        priority: 'high', 
        sticky: false,
        vibrate: true 
      }
    };
    Notifications.presentLocalNotificationAsync(localNotification);
  }

  render() {
    
    let text = 'Waiting...';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    if (this.state.location) {
      
    return (
      <View style={styles.container}>

        <MapView
          ref={(ref) => this._map=ref}
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
        >
          <MapView.Marker
            coordinate={{latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude}}
            title="Your location"
            pinColor="blue"
          />
            {this.state.markers.map((marker,i) => {
              return (
              <MapView.Marker
                coordinate={marker.latlng}
                title={marker.title}
                key={i}
              />
            )})}
        </MapView>
        {this.state.markers.length<2
          ?
          <Button style={styles.buttonContainer} title="Load My Google Places" onPress={() => this._handleButtonPress()} />
          : 
          <Button style={styles.buttonContainer} color="#841584" title="My Location" onPress={() => this.moveMapToLocation()} />
        }

      </View>
    );

  } else {
    return (
      <View style={styles.container}>
        <Text>Please enable GPS</Text>
      </View>
    )
  }
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
