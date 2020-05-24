import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import Carousel from 'react-native-snap-carousel';
import auth from '@react-native-firebase/auth';

import SearchBar from './SearchBar';
import Header from './Header';
import AlertBox from './AlertBox';
import RatingBar from './RatingBar';

import mapStyle from '../map.json';

class Home extends Component {
  map;
  markers = [];
  searchBar;
  carousel;
  header;

  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      loading: true,
      shouldShowSearchBar: true,
      places: [],
      inputActive: false,
      animatedCarousel: true,
    };

    this.onAuthStateChanged = this.onAuthStateChanged.bind(this);
    this.renderCarouselItem = this.renderCarouselItem.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onBackPressed = this.onBackPressed.bind(this);
  }

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
            Verified owner
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
        <RatingBar placeId={placeId} type={'place'} />
        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => {
            if (this.state.user) {
              this.setState({ blur: true });
              this.props.navigation.navigate('RatingScreen', {
                placeName: name,
                placeId,
                placeType,
                uid: this.state.user.uid,
              });
            } else
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

  componentDidMount() {
    this.unsubscribe = auth().onAuthStateChanged(this.onAuthStateChanged);
    if (this.props.places.length > 0) {
      this.setState({ shouldShowSearchBar: false, places: this.props.places });
    }
  }

  componentDidUpdate() {
    console.log('updated');
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onSearch(input) {
    fetch(
      `https://europe-west3-isitsafe-276523.cloudfunctions.net/getPlaceFromQuery?input=${encodeURIComponent(
        input,
      )}`,
    )
      .then(res => res.ok && res.json())
      .then(jsonResponse => {
        console.log(JSON.stringify(jsonResponse, null, 2));
        if (jsonResponse.status === 'ok') {
          this.setState({
            places: [...this.state.places, ...jsonResponse.places],
          });

          this.map.animateCamera({
            center: {
              latitude: jsonResponse.places[0].coords.lat,
              longitude: jsonResponse.places[0].coords.lng,
            },
          });

          this.setState({ shouldShowSearchBar: false });
          this.carousel.snapToItem(this.state.places.length - 1);

          this.header.showBackButton();
        }
      })
      .catch(_ => `Network error on getPlaceFromQuery?input=${input}`);
  }

  onBackPressed() {
    this.setState({ shouldShowSearchBar: true });
  }

  render() {
    const {
      loading,
      shouldShowSearchBar,
      animatedCarousel,
      places,
    } = this.state;
    const { navigation, initialRegion } = this.props;

    return loading ? null : (
      <View style={styles.home}>
        <MapView
          style={styles.map}
          ref={ref => (this.map = ref)}
          onTouchStart={() => this.searchBar && this.searchBar.blur()}
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
              this.markers[0].showCallout();
              this.carousel && this.carousel.snapToItem(0);
            }
          }}
          toolbarEnabled={false}
        >
          {places.length > 0 &&
            !shouldShowSearchBar &&
            places.map((place, i) => {
              console.log(this.markers.length);
              return (
                <Marker
                  ref={ref => {
                    let shouldPush = true;

                    this.markers.every(marker => {
                      if (marker.props.keyProp === place.placeId) {
                        shouldPush = false;
                        return false;
                      }

                      return true;
                    });

                    shouldPush && this.markers.push(ref);
                  }}
                  key={place.placeId}
                  keyProp={place.placeId}
                  coordinate={{
                    latitude: place.coords.lat,
                    longitude: place.coords.lng,
                  }}
                  title={place.name}
                  onPress={() => this.carousel && this.carousel.snapToItem(i)}
                />
              );
            })}
        </MapView>
        {shouldShowSearchBar ? (
          <View style={[styles.overlay]}>
            <Header navigation={navigation} />
            <SearchBar
              ref={ref => (this.searchBar = ref)}
              onSearch={this.onSearch}
            />
          </View>
        ) : (
          <View style={styles.overlay}>
            <Header
              ref={ref => (this.header = ref)}
              navigation={navigation}
              onBackPressed={this.onBackPressed}
            />
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
                this.markers[index].showCallout();
              }}
            />
          </View>
        )}
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
    flexDirection: 'column',
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
