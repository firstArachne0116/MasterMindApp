/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {images, theme, scale} from '../../constants';
import {ScreenContainer, MenuModal} from '../../components';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class BuyNow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
      currentUser: auth().currentUser,
    };
  }

  handleBuyNow = () => {
    firestore().collection('users').doc(this.state.currentUser.uid).update({
      signed: true,
    });
    if (this.props.route.params && this.props.route.params.player) {
      this.props.navigation.navigate('SessionInvitation', {
        type: 'signed',
        player: this.props.route.params.player,
        language: this.props.route.params.player.language,
      });
    } else {
      this.props.navigation.navigate('SelectLanguage', {type: 'signed'});
    }
  };

  handleMenu = () => {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
    });
  };

  _handleModalButton = (route) => {
    const {navigation} = this.props;
    this.setState({
      isMenuOpen: false,
    });
    navigation.navigate(route);
  };

  render() {
    const {navigation} = this.props;

    return (
      <ScreenContainer>
        <ImageBackground
          source={images.welcomeBack}
          style={[styles.bg_image, styles.signedGame]}>
          <View style={styles.popupView}>
            <Image source={images.flower} style={styles.buyNowImage} />
            <Text style={styles.popupText}>
              {
                'Buy the premium version to  earn\nmore scores and get a chance to\nreach the top 100'
              }
            </Text>
            <TouchableOpacity
              style={styles.buyNowButton}
              onPress={this.handleBuyNow}>
              <Text style={styles.buyNowText}>{'BUY NOW'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{marginTop: 30}}>
            <Text style={styles.skip}>{'SKIP'}</Text>
          </TouchableOpacity>
        </ImageBackground>
        <MenuModal
          {...this.state}
          {...this.props}
          onMenubarHandle={this.handleMenu}
          onButtonHandle={this._handleModalButton}
        />
      </ScreenContainer>
    );
  }
}

export default BuyNow;

const styles = StyleSheet.create({
  bg_image: {
    width: '100%',
    height: '100%',
  },
  signedGame: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupView: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    width: theme.SCREENWIDTH - 70,
    height: theme.SCREENWIDTH - 70,
    alignItems: 'center',
    marginTop: scale(50),
  },
  buyNowImage: {
    position: 'absolute',
    width: scale(150),
    height: scale(180),
    resizeMode: 'contain',
    top: scale(-90),
  },
  popupText: {
    color: theme.colors.black1,
    textAlign: 'center',
    fontFamily: theme.fonts.redHatMedium,
    fontSize: 17,
    marginTop: theme.SCREENWIDTH / 3,
  },
  buyNowButton: {
    paddingVertical: scale(11),
    width: theme.SCREENWIDTH / 2,
    backgroundColor: theme.colors.sky,
    borderRadius: 30,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 2,
  },
  buyNowText: {
    textAlign: 'center',
    color: theme.colors.white,
    fontFamily: theme.fonts.redHatBold,
    fontSize: 17,
  },
  skip: {
    color: theme.colors.white,
    fontSize: 17,
    fontFamily: theme.fonts.redHatBold,
  },
});
