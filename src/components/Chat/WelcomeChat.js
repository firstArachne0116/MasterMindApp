import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {theme, images} from '../../constants';

const WelcomeChat = (props) => {
  return (
    <View style={styles.container}>
      <Image source={images.welcomeChat} />
      <Text style={styles.title}>{'Welcome To Chat'}</Text>
      <Text style={styles.subText}>
        {
          'Please be aware that sending inappropriate\nmessages of any kind will result in a\npermanent ban.'
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    transform: [{rotateX: '180deg'}],
  },
  title: {
    fontFamily: theme.fonts.extraBold,
    fontSize: 30,
    color: theme.colors.black1,
    marginTop: 11,
  },
  subText: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: theme.fonts.redHatNormal,
    color: theme.colors.grey3,
    marginTop: 15,
  },
});

export default WelcomeChat;
