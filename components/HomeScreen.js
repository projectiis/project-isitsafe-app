import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Carousel from 'react-native-snap-carousel';
import auth from '@react-native-firebase/auth';

import SearchBar from './SearchBar';
import Header from './Header';
import AlertBox from './AlertBox';
import mapStyle from '../map.json';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      loading: true,
      shouldShowSearchBar: true,
      places: [],
      inputActive: false,
      markers: [],
    };

    this.onAuthStateChanged = this.onAuthStateChanged.bind(this);
    this.getPlacesFromQuery = this.getPlacesFromQuery.bind(this);
  }
  // let textInput,
  //   searchBar,
  //   inputActive = false,
  //   map,
  //   carousel,
  //   markers = [];

  onAuthStateChanged = user => {
    if (user) this.setState({ user });
    if (this.state.loading) this.setState({ loading: false });
  };

  renderCarouselItem = ({
    item: { name, address, placeId, placeType, phoneNumber, openingHours },
  }) => {
    return (
      <View style={styles.carouselItem}>
        <View style={styles.carouselItemTextView}>
          <Text
            style={{
              backgroundColor: '#cbc9c9',
              borderRadius: 5,
              paddingHorizontal: 5,
              paddingVertical: 2,
            }}
          >
            Sponsored
          </Text>
          <Text style={styles.carouselItemName}>{name}</Text>
          <Text style={styles.carouselItemAddress}>{address}</Text>
          {openingHours ? (
            openingHours.open_now ? (
              <Text style={styles.carouselItemSupplementaryText}>Open</Text>
            ) : (
              <Text style={styles.carouselItemSupplementaryText}>Closed</Text>
            )
          ) : null}
          <Text style={styles.carouselItemSupplementaryText}>
            {phoneNumber}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => {
            if (user)
              this.props.navigation.navigate('RatingScreen', {
                placeId,
                placeType,
                uid: user.uid,
              });
            else
              this.props.navigation.navigate('AlertBox', {
                title: 'Unauthorized',
                text: 'You must be signed in in order to rate this place',
              });
          }}
        >
          <Text style={styles.carouselItemButtonText}>Is It Safe?</Text>
        </TouchableOpacity>
      </View>
    );
  };

  getPlacesFromQuery = input => {
    fetch('http://localhost:5000')
      .then(res => {
        if (res.ok) return res.json();
      })
      .then(jsonResponse => {
        if (jsonResponse.status === 'ok') {
          this.setState({ places: jsonResponse.places });
          searchBar.hide(() => this.setState({ shouldShowSearchBar: false }));
        } else {
        }
      })
      .catch(err => console.log(err));
  };

  componentDidMount() {
    this.subscriber = auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  componentDidUpdate() {
    console.log('updated');
  }

  componentWillUnmount() {
    this.subscriber();
  }

  render() {
    const { markers, places, loading } = this.state;
    const { navigation, initialRegion } = this.props;

    return loading ? null : (
      <View style={styles.home}>
        <MapView
          style={styles.map}
          ref={ref => (this.map = ref)}
          // onTouchStart={() => {
          //   if (inputActive) {
          //     if (this.textInput) this.textInput.blur();
          //     this.setState({ inputActive: false });
          //   }
          //   this.searchBar.blur();
          // }}
          customMapStyle={mapStyle}
          initialRegion={initialRegion}
          onMapReady={() => {
            if (places.length > 0) {
              this.map.animateCamera({
                center: {
                  latitude: places[0].coords.lat,
                  longitude: places[0].coords.lng,
                },
              });
              markers[0].showCallout();
              this.carousel.snapToItem(0);
            }
          }}
          toolbarEnabled={false}
        >
          {places.length > 0 &&
            places.map((place, i) => {
              return (
                <Marker
                  ref={ref => this.setState({ markers: [...markers, ref] })}
                  key={place.placeId}
                  coordinate={{
                    latitude: place.coords.lat,
                    longitude: place.coords.lng,
                  }}
                  title={place.name}
                  onPress={() => carousel.snapToItem(i)}
                />
              );
            })}
        </MapView>
        <View style={styles.overlay}>
          <Header navigation={navigation} />
          <Carousel
            ref={ref => (this.carousel = ref)}
            data={places}
            renderItem={this.renderCarouselItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={300}
            containerCustomStyle={styles.carousel}
            contentContainerCustomStyle={{
              alignItems: 'flex-end',
            }}
            enableMomentum={true}
            onSnapToItem={index => {
              this.map.animateCamera({
                center: {
                  latitude: places[index].coords.lat,
                  longitude: places[index].coords.lng,
                },
              });
              markers[index].showCallout();
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  carousel: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 16,
  },
  carouselItem: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingTop: 8,
  },
  carouselItemTextView: {
    alignSelf: 'flex-start',
    marginLeft: 8,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  carouselItemName: {
    fontSize: 20,
    fontFamily: 'poppins_semibold',
  },
  carouselItemAddress: {
    fontFamily: 'poppins_regular',
  },
  carouselItemSupplementaryText: {
    color: '#cbc9c9',
    fontSize: 12,
  },
  carouselItemButtonText: {
    fontFamily: 'poppins_semibold',
    fontSize: 24,
    color: '#2196f3',
  },
});

const mapStateToProps = state => ({
  places: state.places,
});

export default connect(mapStateToProps)(Home);
