import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/MaterialIcons';

class CarouselItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: '',
    };
  }

  render() {
    const { id, placeName, name, onAnswerChanged } = this.props;

    return (
      <View style={styles.carouselItem}>
        <View style={styles.carouselItemHeader}>
          <Text style={styles.placeName}>{placeName}</Text>
          <Text style={styles.ruleName}>{name}</Text>
        </View>
        <View style={styles.carouselItemFooter}>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onAnswerChanged(id)}
            >
              <Icon name={'done'} size={24} color={'#2196f3'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.unsureButton}
              onPress={() => onAnswerChanged(id)}
            >
              <Text style={styles.unsureText}>ΔΕΝ ΓΝΩΡΙΖΩ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onAnswerChanged(id)}
            >
              <Icon name={'clear'} size={24} color={'#2196f3'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      rules: [],
    };

    this.answerChanged = this.answerChanged.bind(this);
  }

  answerChanged(id) {
    if (id < 2) this.carousel.snapToItem(id + 1);
    else this.props.navigation.goBack();
  }

  componentDidMount() {
    fetch(`http://localhost:5000/getPlaceRulesSchema`)
      .then(res => res.json())
      .then(jsonResponse => {
        let rulesFromResponse = jsonResponse.rules;

        rulesFromResponse.sort((a, b) => a.id - b.id);

        this.setState({ rules: rulesFromResponse, loading: false });
      })
      .catch(_ =>
        console.log(
          `Network error while getting the place rules schema for placeType: ${
            this.props.placeType
          }`,
        ),
      );
  }

  render() {
    return this.state.loading ? null : (
      <View style={styles.parent}>
        <Carousel
          ref={ref => (this.carousel = ref)}
          data={this.state.rules}
          renderItem={({ item }) => (
            <CarouselItem
              {...item}
              placeName={this.props.route.params.placeName}
              onAnswerChanged={this.answerChanged}
            />
          )}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={300}
          itemHeight={200}
          containerCustomStyle={styles.carousel}
          scrollEnabled={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  parent: {
    ...StyleSheet.absoluteFillObject,
  },
  carousel: {
    position: 'absolute',
    top: 0.5 * Dimensions.get('window').height - 100,
  },
  carouselItem: {
    justifyContent: 'space-between',
    backgroundColor: '#2196f3',
    borderRadius: 10,
  },
  carouselItemHeader: {
    height: 100,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  carouselItemFooter: {
    height: 80,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  placeName: {
    fontFamily: 'poppins_regular',
    fontSize: 14,
  },
  ruleName: {
    marginLeft: 8,
    color: '#2196f3',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 100,
    elevation: 3,
  },
  unsureButton: {
    // marginRight: 16,
    // alignSelf: 'flex-end',
  },
  unsureText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'didact_gothic',
  },
});
