import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { Location, Permissions, Notifications } from 'expo';
import MapView from 'react-native-maps';
import BgGeo from './BkgndGeolocation';
// import { mapStyle } from './MapStyle';
import { Places } from './seed';

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
      ]
    }

    this._getNotificationAsync = this._getNotificationAsync.bind(this);
    this._getLocationAsync = this._getLocationAsync.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this._loadMarkers = this._loadMarkers.bind(this);
    this._handleButtonPress = this._handleButtonPress.bind(this);
    this.moveMapToLocation = this.moveMapToLocation.bind(this);

    this.watchId = null;

  };

  // extras: push notification, google oauth sign-in, stacks from onboard to use / text disappears
  // background geolocation
  // list of vistied / to visit in a tab

  // 1. get user's current location

  // 2. get user's places of interest
  // 2a. access Google Bookmarks xml / json export
  // 2b. parseInt() xml for lat/lng data (only for locations within MapView)

  // map marker for array (array for rn-maps)
  // render markers for places only visible in viewport

  // if location changes, build geofence around user marker; after 3 min clear geofence and build another one around user

  // 3. evaluate if user is within 10 min walking distance from places of interest
  // 3a. using Google Maps Distance Matrix API, if no places are within a 10 min walk, end
  // 3b. else, if more than one place is within a 10 min walk, batch list them in a push notifcation
  // 3c. else, if only one place is within a 10 min walk, send push notification

  // 4. end background process and repeat in 10-15 min

  // get user's location

  componentWillMount() {
    this._getNotificationAsync();
    this._getLocationAsync();
  }

  async componentDidMount() {
    this.watchId = await Location.watchPositionAsync({enableHighAccuracy: true, timeInterval: 1000}, (position) => {
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

      this.setState({
        markers: [
          { latlng: {latitude: position.coords.latitude, longitude: position.coords.longitude},
          title: "You are here"}
        ]
      })
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
  
  // get user's places of interest

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
    // update to only load markers within region
      this._loadMarkers();
      Alert.alert(
        'You did it!',
        'Your places are ready to be discovered',
      );
  };

  moveMapToLocation = () => {
    console.log("moving map to location &&&138")
    // this._map.fitToElements(true);
    this.setState({
      region: {
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
        latitude: this.state.location.coords.latitude,
        longitude: this.state.location.coords.longitude
      }
    })
  }

  // when user location is 10 min walk away from a Google Place (geofence), ping user
  // note: if more than one Google Place is a 10 min walk away, push them into same notifcation and order them closest to farthest

  render() {
    console.log("MARKER*****154", this.state.markers[0])
    console.log("REGION^*^*^155", this.state.region)
    console.log("LOCATION^^^^156", this.state.location)
    
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
          >
          </MapView.Marker>
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
          <Button title="Load My Places via Google" onPress={() => this._handleButtonPress()} />
          : 
          <Button color="#841584" title="My Location" onPress={() => this.moveMapToLocation()} />
        }

        <Text>latitude: state {this.state.location.coords.latitude}, region {this.state.region.latitude}</Text>
        <Text>longitude: state {this.state.location.coords.longitude}, region {this.state.region.longitude}</Text>
        <Text>latitudeDelta: {this.state.region.latitudeDelta},</Text>
        <Text>longitudeDelta: {this.state.region.longitudeDelta},</Text>

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
  bottomButton: {
    color: "#841584",
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
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

// {
//   latitude: this.state.location.coords.latitude,
//   longitude: this.state.location.coords.longitude,
//   latitudeDelta: 0.0922,
//   longitudeDelta: 0.0421,
// }

// {...this.state.markers.map(marker => (
//   <MapView.Marker
//     coordinate={marker.latlng}
//     title={marker.title}
//     description={marker.description}
//   />
// ))}

              // {/* if within user's geofence
              // if (pet.latitude && pet.longitude) { */}