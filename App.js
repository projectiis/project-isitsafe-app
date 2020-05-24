import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { View, PermissionsAndroid, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';

// Screens
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import AuthScreen from './components/AuthScreen';
import RatingScreen from './components/RatingScreen';
import Spinner from './components/Spinner';
import AlertBox from './components/AlertBox';

import AlertBoxCallbackContext from './components/AlertBoxCallbackContext';
import SpinnerCallbackContext from './components/SpinnerCallbackContext';

import reducer from './redux/reducers';
import initialState from './redux/reducers/initialState.json';

import getPlaceDetailsResponse from './responses/getPlaceDetailsResponse.json';

console.disableYellowBox = true;

const Stack = createStackNavigator();

export default class extends Component {
  splash;
  store;

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      initialRegion: undefined,
    };

    this.getNearbyPlaces = this.getNearbyPlaces.bind(this);
  }

  getLocation = () => {
    return new Promise((resolve, reject) => {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
        .then(status => {
          if (status) {
            Geolocation.getCurrentPosition(geo_success => {
              console.log('Success', geo_success);

              resolve(geo_success.coords);
            });
          } else {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            )
              .then(status => {
                if (status) {
                  Geolocation.getCurrentPosition(geo_success => {
                    console.log('Success', geo_success);

                    resolve(geo_success.coords);
                  });
                }
              })
              .catch(err =>
                console.log('Error while requesting location permission', err),
              );
          }
        })
        .catch(err =>
          console.log('Error while requesting location permission', err),
        );
    });
  };

  getNearbyPlaces = coords => {
    fetch('http://localhost:5000/placeDetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        placeTypes: ['restaurant'],
      }),
    })
      .then(res => {
        if (res.ok) return res.json();
      })
      .then(jsonResponse => {
        if (jsonResponse.status === 'ok') {
          this.store = createStore(reducer, {
            ratings: [],
            places: jsonResponse.places,
          });

          this.store.subscribe(() =>
            console.log(JSON.stringify(store.getState(), null, 2)),
          );

          this.setState({
            initialRegion: {
              latitude: coords.latitude,
              longitude: coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            },
          });

          this.splash.loadingFinished(() => this.setState({ loading: false }));
        }
      })
      .catch(err => console.log('Network error: ', err));
  };

  componentDidMount() {
    this.getLocation()
      .then(this.getNearbyPlaces)
      .catch(err => console.log(err));
  }

  render() {
    const { loading, initialRegion } = this.state;

    return loading ? (
      <View style={{ ...StyleSheet.absoluteFillObject }}>
        <StatusBar
          animated={true}
          backgroundColor={'#2196f3'}
          barStyle={'dark-content'}
        />
        <SplashScreen ref={ref => (this.splash = ref)} />
      </View>
    ) : (
      <Provider store={this.store}>
        <StatusBar
          animated={true}
          backgroundColor={'#dfeaf3'}
          barStyle={'dark-content'}
        />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName='HomeScreen'
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name='HomeScreen'>
              {props => <HomeScreen {...props} initialRegion={initialRegion} />}
            </Stack.Screen>
            <Stack.Screen name='AuthScreen' component={AuthScreen} />
            <Stack.Screen
              name='RatingScreen'
              component={RatingScreen}
              options={{
                cardStyle: { backgroundColor: 'transparent' },
                cardOverlayEnabled: false,
              }}
            />
            <Stack.Screen
              name='AlertBox'
              component={AlertBox}
              options={{
                cardStyle: { backgroundColor: 'transparent' },
                cardOverlayEnabled: false,
              }}
            />
            <Stack.Screen
              name='Spinner'
              component={Spinner}
              options={{
                cardStyle: { backgroundColor: 'transparent' },
                cardOverlayEnabled: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
