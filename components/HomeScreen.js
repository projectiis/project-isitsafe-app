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

const Home = ({ navigation, initialRegion, places }) => {
  let textInput,
    inputActive = false,
    map,
    carousel,
    markers = [];

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const onAuthStateChanged = user => {
    if (user) setUser(user);
    if (loading) setLoading(false);
  };

  const renderCarouselItem = ({
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
              navigation.navigate('RatingScreen', {
                placeId,
                placeType,
                uid: user.uid,
              });
            else
              navigation.navigate('AlertBox', {
                title: 'You are not signed in',
                text: 'You need to sing in order to rate this place',
              });
          }}
        >
          <Text style={styles.carouselItemButtonText}>Is It Safe?</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    return subscriber;
  }, []);

  return loading ? null : (
    <View style={styles.home}>
      <MapView
        style={styles.map}
        ref={ref => (map = ref)}
        onTouchStart={() => {
          if (inputActive) {
            if (textInput) textInput.blur();
            inputActive = false;
          }
        }}
        customMapStyle={mapStyle}
        initialRegion={initialRegion}
        onMapReady={() => {
          map.animateCamera({
            center: {
              latitude: places[0].coords.lat,
              longitude: places[0].coords.lng,
            },
          });
          markers[0].showCallout();
          carousel.snapToItem(0);
        }}
        toolbarEnabled={false}
      >
        {places.map((place, i) => {
          return (
            <Marker
              ref={ref => markers.push(ref)}
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
      {/* <View style={styles.overlay}>
        <Header navigation={navigation} />
        <SearchBar
          getReference={ref => {
            textInput = ref;
            inputActive = true;
          }}
        />
      </View> */}
      <View style={styles.overlay}>
        <Header navigation={navigation} />
        <Carousel
          ref={ref => (carousel = ref)}
          data={places}
          renderItem={renderCarouselItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={300}
          containerCustomStyle={styles.carousel}
          contentContainerCustomStyle={{
            alignItems: 'flex-end',
          }}
          enableMomentum={true}
          onSnapToItem={index => {
            map.animateCamera({
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
};

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
