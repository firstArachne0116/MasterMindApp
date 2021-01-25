import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {scale, theme} from '../constants';

const LanguageModal = (props) => {
  const {langData, handleLangModal, onPress} = props;

  return (
    <Modal
      style={styles.mainContainer}
      isVisible={props.isLangModal}
      backdropOpacity={0}
      animationIn={'slideInRight'}
      animationInTiming={1}
      animationOutTiming={1}
      animationOut={'slideOutRight'}
      onBackdropPress={handleLangModal}>
      <View style={styles.container}>
        <ScrollView>
          {langData.map((d, i) => {
            return (
              <TouchableOpacity
                onPress={() => onPress(d.flag)}
                key={i.toString()}
                style={styles.langView}>
                <Image source={d.flag} style={styles.flag} />
                <Text style={styles.language}>{d.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
    padding: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: Platform.OS === 'ios' ? (isIphoneX() ? 90 : 70) : 50,
    borderRadius: 5,
    marginRight: 35,
    width: scale(145),
    height: 200,
  },
  langView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  flag: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  language: {
    fontSize: 11,
    fontFamily: theme.fonts.redHatMedium,
    color: theme.colors.black1,
  },
});

export default LanguageModal;
