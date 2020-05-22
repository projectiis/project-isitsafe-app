import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, { Easing, call } from 'react-native-reanimated';

const { Value, timing } = Animated;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      text: '',
    };

    this.translateY = new Value(0);
  }

  hide(callback) {
    this.textInput.blur();
    const config = {
      duration: 200,
      toValue: 20,
      easing: Easing.inOut(Easing.ease),
    };

    timing(this.translateY, config).start(callback);
  }

  blur() {
    if (this.textInput) this.textInput.blur();
  }

  render() {
    const { focused } = this.state;
    const { getReference } = this.props;

    return this.state.focused ? (
      <View style={styles.active}>
        <TextInput
          ref={ref => {
            this.textInput = ref;
            // getReference(ref);
          }}
          style={styles.textInputActive}
          placeholder='Type here'
          onChangeText={value => this.setState({ text: value })}
          onFocus={() => focused || this.setState({ focused: true })}
          onBlur={() => focused && this.setState({ focused: false })}
        />
        <View style={styles.buttonView}>
          <View style={styles.hairLine} />
          <TouchableOpacity
            onPress={() => this.props.onSearch(this.state.text)}
          >
            <Text style={styles.button}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <Animated.View
        style={[
          styles.inactive,
          { transform: [{ translateY: this.translateY }] },
        ]}
      >
        <TextInput
          style={styles.textInputInactive}
          placeholder='Type here'
          onChangeText={value => this.setState({ text: value })}
          onFocus={() => focused || this.setState({ focused: true })}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  inactive: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 25,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    elevation: 5,
  },
  active: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 25,
    paddingLeft: 16,
    paddingRight: 24,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    elevation: 5,
  },
  textInputInactive: {
    fontFamily: 'poppins_semibold',
    color: '#2196f399',
  },
  textInputActive: {
    flex: 0.94,
    fontFamily: 'poppins_semibold',
    color: '#2196f399',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  hairLine: {
    width: StyleSheet.hairlineWidth,
    height: 30,
    backgroundColor: '#707070',
  },
  button: {
    color: '#2196f3',
    fontFamily: 'poppins_light',
    fontSize: 16,
    marginLeft: 16,
  },
});
