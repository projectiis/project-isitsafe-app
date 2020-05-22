import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Avatar from '../assets/philosopher.svg';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      initializing: true,
      shouldShowBackButton: true,
      visible: true,
    };
    this.onAuthStateChanged = this.onAuthStateChanged.bind(this);
  }

  componentDidMount() {
    // register to listening to auth changes
    this.subscriber = auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  componentWillUnmount() {
    // unregister from listening to auth changes
    this.subscriber();
  }

  onAuthStateChanged = user => {
    console.log('User (Header): ', user);
    this.setState({ user });
    if (this.state.initializing) this.setState({ initializing: false });
  };

  render() {
    const { initializing, user, shouldShowBackButton } = this.state;

    if (initializing) return null;

    return user ? (
      <View style={styles.header}>
        {shouldShowBackButton ? (
          <TouchableOpacity>
            <Icon
              style={{
                backgroundColor: 'white',
                borderRadius: 100,
                padding: 5,
              }}
              name='arrow-back'
              color='#2196f3'
              size={32}
            />
          </TouchableOpacity>
        ) : null}
        <Image
          style={styles.img}
          source={{ uri: user.photoURL }}
          resizeMode='cover'
        />
      </View>
    ) : (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('AuthScreen')}
        >
          <View style={styles.img}>
            <Avatar width={35} height={35} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    // width: 50,
    // height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // alignSelf: 'flex-end',
    marginTop: 25,
    marginHorizontal: 25,
    borderRadius: 100,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 100,
    elevation: 5,
  },
});
