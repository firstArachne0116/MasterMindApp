import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Image, View} from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import {images, scale, theme} from '../../constants';
const PassModal = ({isModalVisible, handlePass, handleCancel}) => {
  return (
    <Modal
      isVisible={isModalVisible}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}>
      <View style={styles.container}>
        <Image source={images.monster_mind} style={styles.image} />
        <Text style={styles.info}>
          Are you sure you want to pass this move ?
        </Text>
        <LinearGradient
          colors={[theme.colors.sky, theme.colors.sky]}
          style={styles.gradient}>
          <TouchableOpacity onPress={() => handlePass()}>
            <Text style={styles.gradientText}>Yes, Pass</Text>
          </TouchableOpacity>
        </LinearGradient>

        <TouchableOpacity onPress={() => handleCancel()}>
          <Text style={styles.cancel}>No, Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: theme.SCREENWIDTH - 80,
    alignSelf: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    alignItems: 'center',
    padding: 30,
  },
  image: {
    position: 'absolute',
    resizeMode: 'contain',
    top: -70,
    height: scale(140),
  },
  info: {
    marginTop: scale(70),
    textAlign: 'center',
    fontSize: 20,
    fontFamily: theme.fonts.redHatBold,
    color: theme.colors.black1,
  },
  gradient: {
    paddingHorizontal: 30,
    borderRadius: 23,
    paddingVertical: 11,
    marginVertical: 20,
  },
  gradientText: {
    color: theme.colors.white,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: theme.fonts.redHatBold,
  },
  cancel: {
    color: theme.colors.sky,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: theme.fonts.redHatMedium,
  },
});
export default PassModal;
