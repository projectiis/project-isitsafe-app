import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

import Avatar from '../assets/philosopher.svg';

export default ({ navigation }) => {
  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = user => {
    console.log('User (Header): ', user);
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return user ? (
    <View style={styles.header}>
      <Image
        style={styles.img}
        source={{ uri: user.photoURL }}
        resizeMode='cover'
      />
    </View>
  ) : (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('AuthScreen')}>
        <Avatar width={35} height={35} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 25,
    marginRight: 25,
    backgroundColor: '#ffffff',
    borderRadius: 100,
    elevation: 5,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
});
