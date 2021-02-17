import React, {Component} from 'react';
import {StyleSheet, View, Text, ImageBackground} from 'react-native';
import {images, theme, scale} from '../../constants';
import {ScreenContainer, Header, MenuModal} from '../../components';
import {GameCard} from '../../components';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class SelectGameType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
      currentUser: auth().currentUser,
      userSigned: false,
    };
  }

  componentDidMount() {
    firestore()
      .collection('users')
      .doc(this.state.currentUser.uid)
      .onSnapshot((snapshot) => {
        if (snapshot && snapshot.data().signed) {
          this.setState({userSigned: true});
        }
      });
  }

  handleUnsigned = () => {
    const {navigation} = this.props;
    navigation.navigate('SelectLanguage', {type: 'unsigned'});
  };

  handleSigned = () => {
    const {navigation} = this.props;
    if (this.state.userSigned) {
      navigation.navigate('SelectLanguage', {type: 'signed'});
    } else {
      navigation.navigate('BuyNow');
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
    return (
      <ScreenContainer>
        <ImageBackground source={images.newGameBack} style={styles.bg_image}>
          <View style={styles.container}>
            <Header {...this.props} onMenubarHandle={this.handleMenu} />
            <View style={styles.gameCardContainer}>
              <GameCard
                title={'Your scores will not be counted'}
                availableText={'* Available for Free & Paid Users'}
                buttonText={'Play Unsigned Game'}
                onPress={this.handleUnsigned}
              />
              <Text style={styles.orText}>{'or'}</Text>
              <GameCard
                title={'Your scores will be submitted to the global rank list'}
                availableText={'* Available only for Paid Users'}
                buttonText={'Play Signed Game'}
                onPress={this.handleSigned}
              />
            </View>
          </View>
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

export default SelectGameType;

const styles = StyleSheet.create({
  bg_image: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    marginTop: scale(35),
    marginHorizontal: scale(18),
  },
  gameCardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orText: {
    color: theme.colors.white,
    fontSize: 19,
    fontFamily: theme.fonts.redHatBold,
    marginVertical: 30,
  },
});
