import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {images, theme, scale} from '../../constants';
import {
  ScreenContainer,
  Header,
  MenuModal,
  LoadingScreen,
} from '../../components';
import {GameCard} from '../../components';
import Languages from '../../Helper/language.json';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

class NewGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user_id: 0,
      menu_bar: false,
      f_name: 'User',
      newGameClick: false,
      isSignedGame: false,
      isLanguageChoose: false,
      isMenuOpen: false,
      isLoadingScreen:
        this.props.route.params && this.props.route.params.isLoading
          ? false
          : true,
    };
  }

  async componentDidMount() {
    const {navigation} = this.props;
    const user = await auth().currentUser;

    await setTimeout(() => {
      this.setState(
        {
          isLoadingScreen: false,
        },
        () => {
          if (!user) {
            navigation.navigate('Welcome');
          }
        },
      );
    }, 1600);
  }

  handleBuyNow = () => {
    this.setState({
      isLanguageChoose: true,
      isSignedGame: false,
      newGameClick: false,
    });
  };

  handleUnsigned = () => {
    const {navigation} = this.props;
    navigation.navigate('AccountSettings');
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

  handleSelect = (item) => {
    const user = auth().currentUser;
    const currentTime = moment();
    const endTime = moment().clone().add(1, 'hour');
    firestore()
      .collection('sessions')
      .doc(user.uid)
      .get()
      .then((snapshot) => {
        const session = snapshot.data();
        if (!session) {
          firestore().collection('sessions').doc(user.uid).set({
            created_at: currentTime._d,
            updated_at: currentTime._d,
            end_at: endTime._d,
            language: 'English',
            status: 'PENDING',
            time: '35 Hrs Left',
            code: item.code,
            photoURL: user.photoURL,
            name: user.displayName,
          });
        } else {
          firestore().collection('sessions').doc(user.uid).update({
            updated_at: currentTime._d,
            code: item.code,
            photoURL: user.photoURL,
          });
        }
        this.props.navigation.navigate('SessionPlayed');
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });
  };

  render() {
    const {navigation} = this.props;
    const {
      newGameClick,
      isSignedGame,
      isLanguageChoose,
      isLoadingScreen,
    } = this.state;

    if (isLoadingScreen) {
      return <LoadingScreen />;
    } else {
      return (
        <ScreenContainer>
          {isSignedGame ? (
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
                onPress={() => navigation.navigate('SessionInvitation')}
                style={{marginTop: 30}}>
                <Text style={styles.skip}>{'SKIP'}</Text>
              </TouchableOpacity>
            </ImageBackground>
          ) : (
            <ImageBackground
              source={images.newGameBack}
              style={styles.bg_image}>
              <View style={styles.container}>
                <Header {...this.props} onMenubarHandle={this.handleMenu} />
                {newGameClick ? (
                  <View style={styles.gameCardContainer}>
                    <GameCard
                      title={'Your scores will not be counted'}
                      availableText={'* Available for Free & Paid Users'}
                      buttonText={'Play Unsigned Game'}
                      onPress={this.handleUnsigned}
                    />
                    <Text style={styles.orText}>{'or'}</Text>
                    <GameCard
                      title={
                        'Your scores will be submitted to the global rank list'
                      }
                      availableText={'* Available only for Paid Users'}
                      buttonText={'Play Signed Game'}
                      onPress={() => this.setState({isSignedGame: true})}
                    />
                  </View>
                ) : isLanguageChoose ? (
                  <View style={{flex: 1}}>
                    <Text style={styles.chooseLang}>
                      {'Choose your Language'}
                    </Text>
                    <ScrollView
                      contentContainerStyle={{
                        padding: 20,
                      }}
                      style={styles.languageScroll}>
                      {Languages.map((item, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => this.handleSelect(item)}
                            key={index.toString()}
                            style={styles.langButton}>
                            <Text style={{fontSize: 20, marginRight: 20}}>
                              {item.flag}
                            </Text>
                            <Text style={styles.languageStyle}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                ) : (
                  <View style={styles.addView}>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => this.setState({newGameClick: true})}>
                      <Image source={images.add} style={styles.addImage} />
                    </TouchableOpacity>
                    <Text style={[styles.startGameText]}>
                      {'Start A new Game'}
                    </Text>
                  </View>
                )}
              </View>
            </ImageBackground>
          )}
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
}

export default NewGame;

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
  chooseLang: {
    color: theme.colors.white,
    fontFamily: theme.fonts.redHatBold,
    fontSize: 19,
    marginVertical: 22,
  },
  addView: {
    alignItems: 'center',
    marginTop: theme.SCREENHEIGHT / 4,
  },
  addButton: {
    backgroundColor: theme.colors.white,
    borderRadius: scale(50),
    height: scale(100),
    width: scale(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImage: {
    tintColor: theme.colors.sky,
    width: scale(45),
    height: scale(45),
  },
  startGameText: {
    fontFamily: theme.fonts.redHatBold,
    marginTop: 20,
    fontSize: scale(20),
    color: theme.colors.white,
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
  languageStyle: {
    fontSize: 15,
    fontFamily: theme.fonts.redHatBold,
    color: theme.colors.black1,
  },
  languageScroll: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
  },
  langButton: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
});
