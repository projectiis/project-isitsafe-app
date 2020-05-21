import React, { Component, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

const {
  Value,
  Clock,
  and,
  eq,
  call,
  startClock,
  stopClock,
  block,
  clockRunning,
  cond,
  set,
  timing,
} = Animated;

const runTiming = (clock, value, dest) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    frameTime: new Value(0),
    time: new Value(0),
  };

  const config = {
    toValue: new Value(0),
    duration: 500,
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(
      clockRunning(clock),
      [set(config.toValue, dest)],
      [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock),
      ],
    ),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
};

export default class extends Component {
  constructor(props) {
    super(props);
    this.scaleX = new Value(0);
    this.scaleY = new Value(0);

    this.state = {
      shown: false,
    };
  }

  loadingStarted() {
    const config = {
      duration: 200,
      toValue: 1,
      easing: Easing.inOut(Easing.ease),
    };

    this.setState({ shown: true });

    timing(this.scaleX, config).start();
    timing(this.scaleY, config).start();
  }

  loadingFinished(callback) {
    const config = {
      duration: 200,
      toValue: 0,
      easing: Easing.inOut(Easing.ease),
    };

    timing(this.scaleX, config).start();
    timing(this.scaleY, config).start(() => {
      this.setState({ shown: false });
      callback();
    });
  }

  render() {
    return (
      <View style={styles.parent}>
        {this.state.shown ? (
          <Animated.View
            style={[
              styles.spinner,
              { scaleX: this.scaleX, scaleY: this.scaleY },
            ]}
          >
            <ActivityIndicator size='large' color='#2196f3' />
          </Animated.View>
        ) : null}
        {/* <View style={{ ...StyleSheet.absoluteFillObject }}>
          {this.props.children}
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  parent: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'transparent',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  spinner: {
    ...StyleSheet.absoluteFillObject,
    top: 300,
    right: 100,
    bottom: 300,
    left: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    elevation: 5,
  },
});
