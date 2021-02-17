import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {theme, images, convertName} from '../../constants/index.js';
import database from '@react-native-firebase/database';

export const GameBoxPlayer = ({params, me, totalMe, totalYou}) => {
  const [turnId, setTurnId] = useState('');
  useEffect(() => {
    const onTurnId = database()
      .ref(`board/${params.roomId}/turnId`)
      .on('value', (snapshot) => {
        setTurnId(snapshot.val());
      });

    return () => {
      database().ref(`board/${params.roomId}/turnId`).off('value', onTurnId);
    };
  }, [params, me]);

  return (
    <View style={[styles.versusView, styles.shadow]}>
      <View
        style={
          me.uid === turnId
            ? styles.versusNameViewActive
            : styles.versusNameView
        }>
        <Image source={{uri: me.photoURL}} style={styles.userImg} />
        <View>
          <Text style={styles.userTitle}>{convertName(me.full_name)}</Text>
          <Text
            style={[styles.userTitle, {fontFamily: theme.fonts.redHatBold}]}>
            {totalMe}
          </Text>
        </View>
      </View>

      <View style={styles.vesusImageBack}>
        <Image source={images.rightCross} style={theme.wh20} />
      </View>
      <View
        style={
          params.uid === turnId
            ? styles.versusNameViewActive
            : styles.versusNameView
        }>
        <View>
          <Text style={styles.userTitle}>{convertName(params.name)}</Text>
          <Text style={styles.userTitle1}>{totalYou}</Text>
        </View>
        <Image source={{uri: params.photoURL}} style={styles.userImg1} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userTitle1: {
    color: theme.colors.black1,
    fontSize: 12,
    fontFamily: theme.fonts.redHatBold,
    textAlign: 'right',
  },
  versusView: {
    alignSelf: 'center',
    width: theme.SCREENWIDTH - 60,
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderRadius: 7,
  },
  versusNameViewActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.yellow1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  versusNameView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  userTitle: {
    color: theme.colors.black1,
    fontSize: 12,
    fontFamily: theme.fonts.redHatMedium,
    flexShrink: 1,
  },
  vesusImageBack: {
    backgroundColor: theme.colors.orange3,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
  },
  userImg: {
    height: 34,
    width: 34,
    borderRadius: 17,
    marginRight: 5,
    backgroundColor: theme.colors.white,
  },
  userImg1: {
    height: 34,
    width: 34,
    borderRadius: 17,
    marginRight: 0,
    marginLeft: 5,
    backgroundColor: theme.colors.white,
  },
  passView: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 23,
    marginBottom: 60,
  },
  letterView: {
    width: theme.SCREENWIDTH / 8.2,
    height: theme.SCREENWIDTH / 8.2,
    borderRadius: 5,
    marginHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterIndex: {
    position: 'absolute',
    top: 4,
    left: 4,
    fontSize: 9,
    color: theme.colors.brown,
    fontFamily: theme.fonts.redHatMedium,
  },
  letter: {
    color: theme.colors.brown,
    fontSize: 20,
    fontFamily: theme.fonts.redHatBold,
  },
});
