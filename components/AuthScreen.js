import React, { Component, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';

import Google from '../assets/google.svg';
import Facebook from '../assets/facebook.svg';

GoogleSignin.configure({
  webClientId:
    '505317017948-oecs27lu6t6u1pit7c6qghhuuh0tefo5.apps.googleusercontent.com',
});

export default class extends Component {
  hasGoneBack = false;
  constructor(props) {
    super(props);

    this.state = {
      initializing: true,
    };

    this.onAuthStateChanged = this.onAuthStateChanged.bind(this);
  }

  onAuthStateChanged(user) {
    console.log('User: ', user);
    if (user && !this.hasGoneBack) {
      this.props.navigation.goBack();
      this.hasGoneBack = true;
    }
    if (this.state.initializing) this.setState({ initializing: false });
  }

  async onGoogleButtonPress() {
    const { idToken } = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    return await auth().signInWithCredential(googleCredential);
  }

  componentDidMount() {
    this.unsubscribe = auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <View style={styles.auth}>
        <View style={styles.textView}>
          <Text style={[styles.text, styles.welcome]}>Welcome!</Text>
          <Text style={[styles.text, styles.description]}>
            {'Connect to\nsupport our cause'}
          </Text>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => {
              this.onGoogleButtonPress()
                .then(res => this.onAuthStateChanged(res.user))
                .catch(err => console.log('err', err));
            }}
          >
            <View style={styles.google}>
              <Google width={24} height={24} />
              <Text style={[styles.text, styles.googleText]}>
                Connect with Google
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
          // onPress={() => {
          //   onFacebookButtonPress()
          //     .then(res => onAuthStateChanged(res.user))
          //     .catch(err => console.log('err', err));
          // }}
          >
            <View style={styles.facebook}>
              <Facebook width={24} height={24} />
              <Text style={[styles.text, styles.facebookText]}>
                Connect with Facebook
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  auth: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2196f3',
  },
  textView: {
    marginTop: 32,
    marginLeft: 32,
  },
  text: {
    color: '#f5f5f5',
    fontFamily: 'poppins_regular',
  },
  welcome: {
    fontSize: 52,
  },
  description: {
    fontSize: 30,
    lineHeight: 35,
  },
  buttons: {
    marginTop: 24,
  },
  google: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
    borderWidth: 2,
    paddingVertical: 8,
    paddingLeft: 24,
    paddingRight: 16,
    borderColor: '#f5f5f5',
    borderRadius: 15,
  },
  googleText: {
    fontSize: 20,
  },
  facebook: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginLeft: 30,
    marginRight: 30,
    borderColor: '#f5f5f5',
    borderWidth: 2,
    borderRadius: 15,
    paddingVertical: 8,
    paddingLeft: 24,
    paddingRight: 16,
  },
  facebookText: {
    fontSize: 20,
  },
});
