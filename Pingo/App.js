import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Location, Permissions } from 'expo';
import MapView from 'react-native-maps';
import BackgroundGeolocation from 'react-native-background-geolocation';
// import mapStyle from './MapStyle';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: null,
      errMsg: null,
    }

    this._getLocationAsync = this._getLocationAsync.bind(this);
  };

  // 1. get user's current location

  // 2. get user's places of interest
  // 2a. access Google Bookmarks xml
  // 2b. parseInt() xml for lat/lng data (only for locations within MapView)

  // 3. evaluate if user is within 10 min walking distance from places of interest
  // 3a. using Google Maps Distance Matrix API, if no places are within a 10 min walk, end
  // 3b. else, if more than one place is within a 10 min walk, batch list them in a push notifcation
  // 3c. else, if only one place is within a 10 min walk, send push notification

  // 4. end background process and repeat in 10-15 min

  // get user's location

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMsg: 'Unable to access your location',
      });
    };

    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});

    this.setState({ location });

  }

  // get Google Places data

  _getGooglePlacesData = () => {
    let auth = {headers: {"Authorization" : "Bearer "}};
    axios.get('https://api.google.com...latitude=${this.state.location.coords.latitude}&longitude=${this.state.location.coords.longitude}', auth)
    .then(place => {
      console.log(place);
      // Google place should
    })
  }

  // when user location is 10 min walk away from a Google Place (geofence), ping user
  // note: if more than one Google Place is a 10 min walk away, push them into same notifcation and order them closest to farthest

  render() {
    console.log("*****", this.state.location)
    let LONGITUDE = this.state.location
    let LATITUDE = this.state.location

    // let statusMsg = 'Waiting...';
    // if (this.state.errorMsg) {
    //   statusMsg = this.state.errorMsg;
    // } else if (this.state.location) {
    //   statusMsg;
    // }
    
    return (
      <View style={styles.container}>

        <MapView
          style={styles.map}
          region={{
            latitude: 40.705132,
            longitude: -74.009258,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          
          onRegionChange={this._handleMapRegionChange}
        />

        <Text>TESTING.</Text>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

// region={this.state.mapRegion}
// Google Maps Distance Matrix API Key: AIzaSyBr8DqWonuHgVOgQBwr2JCnfP3fWW4aVeo

// Google Maps Geocoding API Key: AIzaSyBPQZxYVs18P_5NeAHLXvVfQQ1D1LCB0gM

// Google Maps Static Maps API Key: AIzaSyAAIyNzilS70CMpZKbCvuI1cHHZFrO-X0E
//https://maps.googleapis.com/maps/api/staticmap?key=YOUR_API_KEY&center=40.707409939566155,-74.00906357724608&zoom=16&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0xebe3cd&style=element:labels.text.fill%7Ccolor:0x523735&style=element:labels.text.stroke%7Ccolor:0xf5f1e6&style=feature:administrative%7Celement:geometry.stroke%7Ccolor:0xc9b2a6&style=feature:administrative.land_parcel%7Celement:geometry.stroke%7Ccolor:0xdcd2be&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0xae9e90&style=feature:landscape.natural%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:poi%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x93817c&style=feature:poi.park%7Celement:geometry.fill%7Ccolor:0xa5b076&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x447530&style=feature:road%7Celement:geometry%7Ccolor:0xf5f1e6&style=feature:road.arterial%7Celement:geometry%7Ccolor:0xfdfcf8&style=feature:road.highway%7Celement:geometry%7Ccolor:0xf8c967&style=feature:road.highway%7Celement:geometry.stroke%7Ccolor:0xe9bc62&style=feature:road.highway.controlled_access%7Celement:geometry%7Ccolor:0xe98d58&style=feature:road.highway.controlled_access%7Celement:geometry.stroke%7Ccolor:0xdb8555&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x806b63&style=feature:transit.line%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:transit.line%7Celement:labels.text.fill%7Ccolor:0x8f7d77&style=feature:transit.line%7Celement:labels.text.stroke%7Ccolor:0xebe3cd&style=feature:transit.station%7Celement:geometry%7Ccolor:0xdfd2ae&style=feature:water%7Celement:geometry.fill%7Ccolor:0xb9d3c2&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x92998d&size=480x360

