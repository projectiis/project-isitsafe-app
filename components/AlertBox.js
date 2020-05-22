import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

import AlertBoxCallbackContext from './AlertBoxCallbackContext';

const { Value, timing, block, call } = Animated;

export default class extends Component {
  constructor(props) {
    super(props);
    this.scaleX = new Value(1);
    this.scaleY = new Value(1);

    this.state = {
      title: '',
      text: '',
    };
  }

  componentDidMount() {
    console.log('mounted');
  }

  componentDidUpdate() {
    console.log('updated');
  }

  show(title, text) {
    const config = {
      duration: 200,
      toValue: 1,
      easing: Easing.inOut(Easing.ease),
    };

    this.setState({ title, text });

    timing(this.scaleX, config).start();
    timing(this.scaleY, config).start();
  }

  hide(alertCallbackObj) {
    const config = {
      duration: 200,
      toValue: 0,
      easing: Easing.inOut(Easing.ease),
    };

    timing(this.scaleX, config).start();
    timing(this.scaleY, config).start(() => {
      alertCallbackObj.alertCallback(this.props.navigation);
    });
  }

  render() {
    const {
      navigation,
      route: {
        params: { title, text, shouldGoBack, ratingScreenNavigationObj },
      },
    } = this.props;

    return (
      <AlertBoxCallbackContext.Consumer>
        {alertCallbackObj => (
          <View style={styles.parent}>
            <Animated.View
              style={[
                styles.alert,
                { scaleX: this.scaleX, scaleY: this.scaleY },
              ]}
            >
              <View style={styles.alertTextView}>
                <Text style={styles.alertTitle}>{title}</Text>
                <Text style={styles.alertText}>{text}</Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={_ => this.hide(alertCallbackObj)}
                activeOpacity={0.4}
              >
                <Text style={styles.buttonText}>Ok</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </AlertBoxCallbackContext.Consumer>
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
  alert: {
    ...StyleSheet.absoluteFillObject,
    left: 90,
    right: 90,
    top: 300,
    bottom: 300,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    elevation: 5,
  },
  alertTextView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  alertTitle: {
    fontFamily: 'poppins_semibold',
    fontSize: 24,
    color: '#2196f3',
    textAlign: 'center',
  },
  alertText: {
    fontFamily: 'poppins_regular',
  },
  button: {
    backgroundColor: '#2196f3',
    borderRadius: 15,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 5,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'poppins_regular',
  },
});
