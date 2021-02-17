import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {scale, theme, images} from '../../constants/index.js';
import languages from '../../Helper/languages.json';

export const GameBoxHeader = ({navigation, params, turnId, me}) => (
  <View style={styles.content}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={images.goBack} />
      </TouchableOpacity>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        colors={[theme.colors.pink3, theme.colors.pink4]}
        style={styles.gradient}>
        {/* <Image source={images.uk} style={styles.countryFlag} /> */}
        <Text>
          {languages.find((lang) => lang.code === params.language).flag}
        </Text>
        <Text style={styles.turnText}>
          {turnId === me.uid ? 'Your turn to make a move' : "Opponent's turn"}
        </Text>
      </LinearGradient>
      <TouchableOpacity
        onPress={() => navigation.navigate('ChatConversion', {...params})}>
        <Image source={images.chatIcon} style={styles.chatIcon} />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  bg_image: {
    width: '100%',
    height: 110,
    paddingTop: scale(22),
  },
  content: {
    marginHorizontal: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gradient: {
    borderRadius: 6,
    width: theme.SCREENWIDTH / 1.6,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  countryFlag: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  turnText: {
    color: theme.colors.white,
    fontSize: 13,
    marginLeft: 10,
    fontFamily: theme.fonts.redHatMedium,
  },
  chatIcon: {
    width: 28,
    height: 26,
  },
});
