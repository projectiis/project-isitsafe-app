import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: false,
    };
  }

  componentDidMount() {
    const { type, placeId } = this.props;

    if (type === 'place') {
      this.unsubscribe = firestore()
        .collection('placeRatings')
        .doc(placeId)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot.exists) {
            this.setState({ rating: documentSnapshot.data() });
          }
        });
    } else {
      this.unsubscribe = firestore()
        .collection('placeRatings')
        .doc(placeId)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot.exists) {
            this.setState({
              rating: documentSnapshot.data(),
            });
          }
        });
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { type, rule } = this.props;
    return this.state.rating ? (
      <TouchableOpacity style={styles.ratingBar}>
        <View>
          <View
            style={styles.actualRating(
              type === 'place'
                ? this.state.rating.finalRating
                : this.state.rating.rules[rule],
            )}
          />
        </View>
      </TouchableOpacity>
    ) : (
      <Text style={styles.text}>This place has not been rated yet</Text>
    );
  }
}

const styles = StyleSheet.create({
  ratingBar: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    height: '5%',
    width: '80%',
    marginBottom: 8,
  },
  actualRating: rating => {
    let color;
    if (rating < 25) color = '#ff595e';
    else if (rating < 50) color = '#fff05a';
    else if (rating < 75) color = '#06d6a0';
    else color = '#2196f3';

    return {
      height: '100%',
      width: `${rating}%`,
      backgroundColor: color,
      borderRadius: 10,
    };
  },
  text: {
    fontFamily: 'poppins_regular',
  },
});
