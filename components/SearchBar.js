import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default ({ getReference }) => {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState('');

  return focused ? (
    <View style={styles.active}>
      <TextInput
        ref={ref => getReference(ref)}
        style={styles.textInputActive}
        placeholder='Type here'
        onChangeText={setText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <View style={styles.buttonView}>
        <View style={styles.hairLine} />
        <TouchableOpacity>
          <Text style={styles.button}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <View style={styles.inactive}>
      <TextInput
        style={styles.textInputInactive}
        placeholder='Type here'
        onChangeText={setText}
        onFocus={() => setFocused(true)}
      />
    </View>
  );
};

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
