import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Image, View} from 'react-native';
import {theme, images, scale} from '../constants';

const GameCard = (props) => {
  const {title, availableText, onPress, buttonText} = props;
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <Image source={images.trophy} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.instruction}>{title}</Text>
          <Text style={styles.availableText}>{availableText}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.playButton} onPress={onPress}>
        <Text style={styles.playButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  card: {
    backgroundColor: theme.colors.white,
    width: theme.SCREENWIDTH - 70,
    flexDirection: 'row',
    paddingVertical: scale(15),
    paddingHorizontal: scale(20),
    borderRadius: 11,
  },
  image: {
    width: scale(65),
    height: scale(65),
    resizeMode: 'contain',
  },
  textContainer: {
    marginLeft: 17,
    width: theme.SCREENWIDTH / 2,
  },
  instruction: {
    fontSize: 15,
    fontFamily: theme.fonts.redHatMedium,
    color: theme.colors.grey5,
  },
  availableText: {
    color: theme.colors.pink,
    fontFamily: theme.fonts.redHatMedium,
    fontSize: 13,
    marginTop: 15,
  },
  playButton: {
    marginTop: 19,
    alignSelf: 'center',
  },
  playButtonText: {
    color: theme.colors.white,
    fontSize: 19,
    fontFamily: theme.fonts.redHatBold,
  },
});
export default GameCard;
