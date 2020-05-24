import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

import AlertBox from './AlertBox';
import Spinner from './Spinner';

import getPlaceRatingResponse from '../responses/getPlaceRatingResponse.json';

import AlertBoxCallbackContext from './AlertBoxCallbackContext';
import SpinnerCallbackContext from './SpinnerCallbackContext';

const ListItem = ({ name, defaultValue, maxValue, onValueChange }) => {
  const [value, setValue] = useState(Math.round(defaultValue / 25));
  console.log(maxValue, value);

  const twoOptions = (
    <View style={styles.listItem}>
      <Text>{name}</Text>
      <View style={styles.listItemOptionsView}>
        <TouchableOpacity
          style={
            defaultValue === 1
              ? styles.listItemOptionActive
              : styles.listItemOptionInactive
          }
          onPress={() => {
            onValueChange(1);
            setValue(1);
          }}
        >
          <Text>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            defaultValue === 0
              ? styles.listItemOptionActive
              : styles.listItemOptionInactive
          }
          onPress={() => {
            onValueChange(0);
            setValue(0);
          }}
        >
          <Text>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const fiveOptions = (
    <View style={styles.listItem}>
      <Text>{name}</Text>
      <View style={styles.listItemOptionsView}>
        <TouchableOpacity
          style={
            defaultValue === 0
              ? styles.listItemOptionActive
              : styles.listItemOptionInactive
          }
          onPress={() => {
            onValueChange(0);
            setValue(0);
          }}
        >
          <Text>0</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            defaultValue === 1
              ? styles.listItemOptionActive
              : styles.listItemOptionInactive
          }
          onPress={() => {
            onValueChange(1);
            setValue(1);
          }}
        >
          <Text>1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            defaultValue === 2
              ? styles.listItemOptionActive
              : styles.listItemOptionInactive
          }
          onPress={() => {
            onValueChange(2);
            setValue(2);
          }}
        >
          <Text>2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            defaultValue === 3
              ? styles.listItemOptionActive
              : styles.listItemOptionInactive
          }
          onPress={() => {
            onValueChange(3);
            setValue(3);
          }}
        >
          <Text>3</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            defaultValue === 4
              ? styles.listItemOptionActive
              : styles.listItemOptionInactive
          }
          onPress={() => {
            onValueChange(4);
            setValue(4);
          }}
        >
          <Text>4</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return maxValue === 1 ? twoOptions : fiveOptions;
};

export default ({
  navigation,
  route: {
    params: { placeId, placeType, uid },
  },
}) => {
  let tmpRules = [];

  for (let rule in getPlaceRatingResponse.placeRating.rules) {
    tmpRules.push({
      name: rule,
      defaultValue: Math.round(
        getPlaceRatingResponse.placeRating.rules[rule] /
          (100 / getPlaceRatingResponse.ratingSchema[rule]),
      ),
      maxValue: getPlaceRatingResponse.ratingSchema[rule],
    });
  }

  const [rules, setRules] = useState(tmpRules);
  const [loading, setLoading] = useState(false);
  const [ratingSchema, setRatingSchema] = useState(
    getPlaceRatingResponse.ratingSchema,
  );
  const [newRules, setNewRules] = useState(rules);

  // const getPlaceRating = () => {
  //   fetch(
  //     `https://europe-west3-isitsafe-276523.cloudfunctions.net/getPlaceRating?placeId=${placeId}&placeType=${placeType}`,
  //   )
  //     .then(res => {
  //       if (res.ok) return res.json();
  //     })
  //     .then(
  //       jsonResponse => {
  //         console.log('jsonResponse: ', jsonResponse);
  //         const placeRating = jsonResponse.placeRating;
  //         const ratingSchema = jsonResponse.ratingSchema;

  //         if (jsonResponse.status === 'ok') {
  //           let rules = [];

  //           for (let rule in placeRating.rules) {
  //             rules.push({
  //               name: rule,
  //               value: placeRating.rules[rule],
  //               maxValue: ratingSchema[rule],
  //             });
  //           }

  //           setRules(rules);
  //           setRatingSchema(jsonResponse.ratingSchema);
  //           setLoading(false);
  //         } else navigation.goBack();
  //       },
  //       err => console.log('Another error: ', err),
  //     )
  //     .catch(err => {
  //       console.log('Network error: ', err);
  //       navigation.goBack();
  //     });
  // };

  const submitRating = (alertCallbackObj, spinnerCallbackObj) => {
    navigation.navigate('Spinner');

    let rulesObj = {};
    for (rule of newRules) rulesObj[rule.name] = rule.defaultValue;
    fetch('https://europe-west3-isitsafe-276523.cloudfunctions.net/addRating', {
      method: 'POST',
      headers: {
        Authorization: uid,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ placeId, placeType, rules: rulesObj }),
    })
      .then(res => {
        if (res.ok) return res.json();
      })
      .then(jsonResponse => {
        if (jsonResponse.status === 'ok') {
          navigation.goBack();
          navigation.goBack();
        } else if (jsonResponse.status === 'unauthorized') {
          navigation.goBack();

          alertCallbackObj.alertCallback = navigation => {
            navigation.goBack();
            navigation.goBack();
          };

          console.log('unautorized');
          navigation.navigate('AlertBox', {
            title: 'Unauthorized',
            text: 'You must be signed in in order to rate this place',
          });
        } else if (
          jsonResponse.status.includes('error') ||
          jsonResponse.status === 'invalid_rating'
        ) {
          navigation.goBack();

          alertCallbackObj.alertCallback = navigation => {
            navigation.goBack();
            navigation.goBack();
          };

          console.log('invalid_rating');
          navigation.navigate('AlertBox', {
            title: 'Oops',
            text:
              'An error occurred while we were processing your score for this place',
          });
        } else if (jsonResponse.status === 'invalid_place_type') {
          navigation.goBack();

          alertCallbackObj.alertCallback = navigation => {
            navigation.goBack();
            navigation.goBack();
          };

          console.log('invalid_place_type');
          navigation.navigate('AlertBox', {
            title: 'Invalid place type',
            text:
              'We thought that you could rate this place, but unfortunately you cannot',
          });
        }
      })
      .catch(err => {
        navigation.goBack();

        alertCallbackObj.alertCallback = navigation => {
          navigation.goBack();
          navigation.goBack();
        };

        console.log('error on catch');
        navigation.navigate('AlertBox', {
          title: 'Oops',
          text:
            'An error occurred while we were processing your score for this place',
        });
      });
  };

  return (
    <AlertBoxCallbackContext.Consumer>
      {alertCallbackObj => (
        <SpinnerCallbackContext.Consumer>
          {spinnerCallbackObj => (
            <View style={styles.ratingScreen}>
              <Text style={styles.headerText}>
                {'Help us determine\nthe safety of this place'}
              </Text>
              <FlatList
                style={styles.flatList}
                data={rules}
                renderItem={({ item, index }) => (
                  <ListItem
                    {...item}
                    onValueChange={newValue => {
                      let tmpNewRules = Array.from(newRules);
                      tmpNewRules[index].defaultValue = newValue;

                      setNewRules(tmpNewRules);
                      console.log(newValue, tmpNewRules);
                    }}
                  />
                )}
                keyExtractor={(_, i) => i.toString()}
              />
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.4}
                onPress={() =>
                  submitRating(alertCallbackObj, spinnerCallbackObj)
                }
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </SpinnerCallbackContext.Consumer>
      )}
    </AlertBoxCallbackContext.Consumer>
  );
};

const styles = StyleSheet.create({
  ratingScreen: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    alignSelf: 'flex-start',
    color: '#2196f3',
    fontFamily: 'poppins_semibold',
    fontSize: 25,
    marginTop: 32,
    marginLeft: 16,
  },
  flatList: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    marginHorizontal: 32,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 5,
  },
  listItem: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  listItemOptionsView: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 16,
  },
  listItemOptionInactive: {
    borderColor: '#cbc9c9',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  listItemOptionActive: {
    backgroundColor: '#cbc9c9',
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  itemText: {
    fontFamily: 'poppins_regular',
    fontSize: 16,
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
    color: '#f5f5f5',
    fontFamily: 'poppins_regular',
    fontSize: 15,
  },
});
