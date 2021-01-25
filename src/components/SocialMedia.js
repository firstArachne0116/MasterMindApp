import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Linking,
  Image,
  StyleSheet,
} from 'react-native';
import {images, theme} from '../constants';

const SocialMedia = (props) => {
  const {textStyle} = props;
  return (
    <View>
      <Text style={[styles.socialTitle, textStyle]}>
        {'Share on social media'}
      </Text>
      <View style={styles.socialView}>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://www.facebook.com/')}>
          <Image source={images.fb} style={styles.media} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL('https://twitter.com/')}>
          <Image source={images.twitter} style={styles.media} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL('https://www.instagram.com/')}>
          <Image source={images.instagram} style={styles.media} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  socialTitle: {
    fontSize: 17,
    color: theme.colors.black1,
    fontFamily: theme.fonts.redHatBold,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 14,
  },
  socialView: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  media: {
    marginHorizontal: 10,
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
});
export default SocialMedia;
