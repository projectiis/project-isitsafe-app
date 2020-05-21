import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

const { Value, timing, block, call } = Animated;

// export default ({
//   navigation,
//   route: {
//     params: { title, text },
//   },
// }) => {
//   return (
//     <View style={styles.parent}>
//       <View style={styles.alert}>
//         <View>
//           <Text style={styles.title}>{title}</Text>
//           <Text style={styles.text}>{text}</Text>
//         </View>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={navigation.goBack}
//           activeOpacity={0.4}
//         >
//           <Text style={styles.buttonText}>Ok</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

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

  hide(callback) {
    const config = {
      duration: 200,
      toValue: 0,
      easing: Easing.inOut(Easing.ease),
    };

    timing(this.scaleX, config).start();
    timing(this.scaleY, config).start(callback);
  }

  render() {
    // const { title, text } = this.state;
    const {
      navigation,
      route: {
        params: { title, text },
      },
    } = this.props;

    return (
      <View style={styles.parent}>
        <Animated.View
          style={[styles.alert, { scaleX: this.scaleX, scaleY: this.scaleY }]}
        >
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{text}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.hide(navigation.goBack)}
            activeOpacity={0.4}
          >
            <Text style={styles.buttonText}>Ok</Text>
          </TouchableOpacity>
        </Animated.View>
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
  alert: {
    ...StyleSheet.absoluteFillObject,
    left: 100,
    right: 100,
    top: 300,
    bottom: 300,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    elevation: 5,
  },
  button: {
    marginBottom: 20,
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
