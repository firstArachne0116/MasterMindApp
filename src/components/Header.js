import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {images, theme, scale} from '../constants';

const Header = (props) => {
  const {navigation, onMenubarHandle} = props;
  const headerImages = [
    {image: images.path},
    {image: images.add},
    {image: images.chart},
    {image: images.menu},
  ];
  return (
    <View style={styles.headerView}>
      <Image source={images.masterMind1} style={styles.mastermindLogo} />
      <View style={styles.devider} />
      {headerImages.map((item, index) => {
        return (
          <TouchableOpacity
            onPress={
              index === 0
                ? () => navigation.navigate('ProfileStatistics')
                : index === 1
                ? () => navigation.navigate('NewGame')
                : index === 2
                ? () => navigation.navigate('EditPassword')
                : () => onMenubarHandle()
            }
            key={index.toString()}>
            <Image source={item.image} style={styles.headerIcon} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mastermindLogo: {
    width: theme.SCREENWIDTH / 3,
    height: 70,
    resizeMode: 'contain',
  },
  devider: {
    backgroundColor: theme.colors.white,
    width: 1,
    height: scale(32),
    marginLeft: scale(20),
    marginRight: scale(10),
  },
  headerIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginHorizontal: scale(10),
  },
});

export default Header;
