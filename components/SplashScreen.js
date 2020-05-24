import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
// import Animated, { Easing } from 'react-native-reanimated';

import Virus from '../assets/virus.svg';

export default class extends Component {
  backgroundColorInterpolation;
  iconColorInterpolation;

  constructor(props) {
    super(props);

    this.color = new Animated.Value(0);
    this.scale = new Animated.Value(1);

    this.loadingFinished = this.loadingFinished.bind(this);
    this.breathing = this.breathing.bind(this);
  }

  breathing() {
    Animated.timing(this.scale, {
      toValue: 0.95,
      duration: 700,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        Animated.timing(this.scale, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }).start();
      }
    });
  }

  loadingFinished(callback) {
    const config = {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    };

    Animated.timing(this.color, config).start(callback);
  }

  componentDidMount() {
    this.breathing();
    setInterval(() => this.breathing(), 1400);
  }

  render() {
    this.backgroundColorInterpolation = this.color.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgb(33, 150, 243)', 'rgb(255, 255, 255)'],
    });

    this.iconColorInterpolation = this.color.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgb(255, 255, 255)', 'rgb(33, 150, 243)'],
    });

    return (
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: this.backgroundColorInterpolation,
        }}
      >
        <Animated.View style={{ scaleX: this.scale, scaleY: this.scale }}>
          <Virus color='#fff' width={255} height={255} />
        </Animated.View>
      </Animated.View>
    );
  }
}
