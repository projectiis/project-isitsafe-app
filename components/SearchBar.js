import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

const { Value, timing } = Animated;

export default class extends Component {
  textInput;

  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      text: '',
    };

    this.translateY = new Value(0);
    this.blur = this.blur.bind(this);
  }

  componentDidUpdate() {
    if (this.state.focused === true) this.textInput.focus();
  }

  blur() {
    if (this.textInput) this.textInput.blur();
  }

  render() {
    const { focused } = this.state;

    return this.state.focused ? (
      <View style={styles.active}>
        <TextInput
          ref={ref => (this.textInput = ref)}
          style={styles.textInputActive}
          placeholder='Type here'
          onChangeText={value => this.setState({ text: value })}
          onBlur={() => focused && this.setState({ focused: false })}
        />
        <View style={styles.buttonView}>
          <View style={styles.hairLine} />
          <TouchableOpacity
            onPress={() => {
              this.blur();
              this.props.onSearch(this.state.text);
            }}
          >
            <Text style={styles.button}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View style={styles.inactive}>
        <TouchableWithoutFeedback
          onPress={() => this.setState({ focused: true })}
        >
          <Text style={styles.textInputInactive}>Type here</Text>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inactive: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 5,
  },
  active: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 25,
    paddingLeft: 16,
    paddingRight: 24,
    backgroundColor: '#fff',
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
