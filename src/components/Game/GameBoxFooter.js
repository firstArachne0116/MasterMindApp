import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {isIphoneX} from 'react-native-iphone-x-helper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {theme} from '../../constants/index.js';

export const GameBoxFooter = ({handleSubmit, toggleModal}) => (
  <LinearGradient
    start={{x: 0, y: 0}}
    end={{x: 1, y: 1}}
    colors={[theme.colors.sky, theme.colors.pink1, theme.colors.pink2]}
    style={styles.footerContainer}>
    <View style={styles.footrIconView}>
      <TouchableOpacity style={styles.footerIcon} onPress={() => toggleModal()}>
        <MaterialCommunityIcons
          name="arrow-collapse-right"
          size={20}
          color="white"
        />
      </TouchableOpacity>
      <Text style={styles.footerText}>Pass</Text>
    </View>
    <View style={styles.footrIconView}>
      <TouchableOpacity style={styles.footerIcon}>
        <AntDesign name="arrowdown" size={20} color={theme.colors.white} />
      </TouchableOpacity>
      <Text style={styles.footerText}>Clear</Text>
    </View>
    <View style={styles.footrIconView}>
      <TouchableOpacity style={styles.footerIcon}>
        <AntDesign name="swap" size={20} color={theme.colors.white} />
      </TouchableOpacity>
      <Text style={styles.footerText}>Swap</Text>
    </View>

    <View style={styles.footrIconView}>
      <TouchableOpacity style={styles.footerIcon}>
        <Text style={theme.white}>90</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>Times left</Text>
    </View>

    <TouchableOpacity
      style={styles.submitButton}
      onPress={() => handleSubmit()}>
      <Text style={styles.submit}>Submit</Text>
      <FontAwesome
        name="send"
        size={18}
        style={theme.ml11}
        color={theme.colors.white}
      />
    </TouchableOpacity>
    <TouchableOpacity>
      <MaterialCommunityIcons
        name="dots-vertical"
        size={28}
        style={{}}
        color={theme.colors.white}
      />
    </TouchableOpacity>
  </LinearGradient>
);

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    height: 65,
    position: 'absolute',
    bottom: isIphoneX() ? 20 : 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    paddingTop: 11,
    paddingHorizontal: 13,
  },
  footrIconView: {width: '13%', alignItems: 'center'},
  footerIcon: {
    width: 33,
    height: 33,
    borderRadius: 16.5,
    borderColor: theme.colors.white,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: theme.colors.white,
    fontSize: 8,
    marginTop: 5,
    fontFamily: theme.fonts.redHatMedium,
  },
  submitButton: {
    width: '35%',
    borderWidth: 2,
    borderColor: theme.colors.white,
    borderRadius: 20,
    height: 33,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  submit: {
    color: theme.colors.white,
    textAlign: 'center',
    fontSize: 13,
    fontFamily: theme.fonts.redHatBold,
  },
});
