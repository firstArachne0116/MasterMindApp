import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme, scale, images, convertName} from '../../constants';

const ChatHeader = (props) => {
  const {navigation, onSettingHandle, user} = props;
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={[theme.colors.sky, theme.colors.pink1, theme.colors.pink2]}
      style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={images.goBack} />
      </TouchableOpacity>
      <View style={styles.profileBack}>
        <Image source={{uri: user.avatar}} style={styles.profile} />
      </View>
      <View>
        <Text style={styles.name}>{convertName(user.name)}</Text>
        <Text style={styles.score}>{'Avg. Score: 220'}</Text>
      </View>
      <View style={styles.iconView}>
        <TouchableOpacity style={styles.iconButton}>
          <Image source={images.chatIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onSettingHandle}>
          <Image source={images.setting} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: scale(75),
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(31),
    width: '100%',
  },
  profileBack: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2.5,
    borderColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginLeft: 25,
    marginRight: 8,
    backgroundColor: theme.colors.white,
  },
  profile: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  name: {
    fontSize: 14,
    fontFamily: theme.fonts.redHatBold,
    color: theme.colors.white,
  },
  score: {
    color: theme.colors.white,
    fontFamily: theme.fonts.redHatNormal,
    fontSize: 10,
    marginTop: 3,
  },
  iconView: {
    position: 'absolute',
    flexDirection: 'row',
    right: scale(31),
  },
  iconButton: {
    marginLeft: 16,
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
});

export default ChatHeader;
