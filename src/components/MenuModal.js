import React from 'react';
import {View, TouchableOpacity, StyleSheet, Image, Text} from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import {scale, theme, images} from '../constants';
import auth from '@react-native-firebase/auth';

const MenuModal = (props) => {
  const {isMenuOpen, onMenubarHandle, onButtonHandle, navigation} = props;
  function logout() {
    auth()
      .signOut()
      .then(() => navigation.navigate('Welcome'));
  }
  return (
    <Modal
      animationIn={'slideInRight'}
      animationOut={'slideOutRight'}
      style={styles.mainContainer}
      onBackdropPress={onMenubarHandle}
      isVisible={isMenuOpen}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => onButtonHandle('AccountSettings')}
          style={styles.textContainer}>
          <Image source={images.myAccount} style={styles.image} />
          <Text style={styles.title}>{'My Account'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onButtonHandle('Notification')}
          style={styles.textContainer}>
          <Image source={images.notifications} style={styles.image} />
          <Text style={styles.title}>{'Notifications'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onButtonHandle('PrivacySetting')}
          style={styles.textContainer}>
          <Image source={images.privacy} style={styles.image} />
          <Text style={styles.title}>{'Privacy Settings'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.textContainer}>
          <Image source={images.terms} style={styles.image} />
          <Text style={styles.title}>{'Terms of Service'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.textContainer}>
          <Image source={images.privacyPolicy} style={styles.image} />
          <Text style={styles.title}>{'Privacy Policy'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => logout()} style={styles.textContainer}>
          <Image source={images.myAccount} style={styles.image} />
          <Text style={styles.title}>{'Log Out'}</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={[theme.colors.sky, theme.colors.pink1, theme.colors.pink2]}
            style={[styles.textContainer, styles.gradient]}>
            <Image source={images.premium} style={styles.premiumImage} />
            <Text style={[styles.buttonText]}>{'Go Premium'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginHorizontal: 0,
    flex: 1,
  },
  container: {
    backgroundColor: '#fff',
    paddingVertical: 36,
    paddingHorizontal: 33,
    marginTop: scale(100),
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 24,
    height: 24,
    marginHorizontal: 9,
  },
  title: {
    fontSize: 15,
    fontFamily: theme.fonts.redHatMedium,
    color: theme.colors.grey3,
    marginLeft: 5,
    marginRight: 30,
  },
  gradient: {
    marginBottom: 0,
    borderRadius: 23,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  premiumImage: {
    width: 19,
    height: 19,
    marginRight: 10,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 15,
    fontFamily: theme.fonts.redHatMedium,
  },
});

export default MenuModal;
