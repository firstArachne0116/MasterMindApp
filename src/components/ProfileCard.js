import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {theme} from '../constants';

const ProfileCard = ({title, score}) => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    backgroundColor: theme.colors.white,
    borderRadius: 7,
    marginTop: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    color: theme.colors.black1,
    lineHeight: 20,
    fontFamily: theme.fonts.redHatMedium,
  },
  score: {
    fontSize: 15,
    color: theme.colors.green,
    fontFamily: theme.fonts.redHatMedium,
  },
});
export default ProfileCard;
