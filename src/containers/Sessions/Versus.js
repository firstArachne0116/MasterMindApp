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
import LinearGradient from 'react-native-linear-gradient';
import {theme, images, scale} from '../../constants';
import {ScreenContainer} from '../../components';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Languages from '../../Helper/languages.json';

class Versus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      currentUser: auth().currentUser,
    };
  }

  getLanguage = (code) => {
    const language = Languages.find((lang) => lang.code === code);
    return language ? language : {};
  };

  declineInvitation = () => {
    const {navigation} = this.props;
    firestore()
      .collection('messages')
      .doc(this.props.route.params.id)
      .delete()
      .then(() => navigation.goBack());
  };

  acceptInvitation = async () => {
    const {navigation} = this.props;
    const {params} = this.props.route;
    const currentUser = (
      await firestore().collection('users').doc(auth().currentUser.uid).get()
    ).data();
    const inviter = params.players.find((pl) => pl.uid !== currentUser.uid);

    firestore()
      .collection('messages')
      .doc(params.id)
      .set({
        ...params,
        updated_at: new Date(),
        end_at: new Date(new Date().getTime() + 48 * 3600 * 1000),
        players: [
          {
            uid: currentUser.uid,
            full_name: currentUser.full_name,
            photoURL: currentUser.photoURL,
            status: 'Pending',
          },
          {
            uid: inviter.uid,
            full_name: inviter.full_name,
            photoURL: inviter.photoURL,
            status: 'Your move',
          },
        ],
      })
      .then(() => {
        navigation.navigate('ActiveSession', {
          roomId: params.id,
          uid: inviter.uid,
          name: inviter.full_name,
          photoURL: inviter.photoURL,
          language: params.language,
          type: params.type,
        });
      });
  };

  render() {
    const {params} = this.props.route;
    const {currentUser} = this.state;
    const inviter = params.players.find((pl) => pl.uid !== currentUser.uid);
    const you = params.players.find((pl) => pl.uid === currentUser.uid);
    const language = this.getLanguage(params.language);

    if (you) {
      return (
        <ScreenContainer>
          <ImageBackground source={images.versus} style={styles.bg_image}>
            <Image source={images.masterMind1} style={styles.masterMindLogo} />
            <TouchableOpacity
              style={styles.langButton}
              // onPress={() => this.navigateToHomeScreen('GlobalRankList')}
            >
              <Text style={{fontSize: 20}}>{language.flag}</Text>
              <Text style={styles.language}>{language.name}</Text>
            </TouchableOpacity>

            <View style={styles.profileContainer}>
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.profile}
                  source={{uri: currentUser.photoURL}}
                />
              </View>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                locations={[0.2, 0.8]}
                colors={['#2371FF', 'transparent']}
                style={styles.gradient}>
                <Text style={styles.name}>You</Text>
                <Text style={styles.scroeAvg}>{'Avg. Score: 120'}</Text>
              </LinearGradient>
            </View>

            <View style={[styles.profileContainer, styles.oppProfileView]}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                locations={[0.2, 0.8]}
                colors={['transparent', '#2371FF']}
                style={styles.gradient1}>
                <Text style={styles.name}>{inviter.full_name}</Text>
                <Text style={styles.scroeAvg}>{'Avg. Score: 220'}</Text>
              </LinearGradient>
              <View
                style={[
                  styles.avatarContainer,
                  {marginLeft: 0, marginRight: 24},
                ]}>
                <Image
                  style={[styles.profile]}
                  source={{uri: inviter.photoURL}}
                />
              </View>
            </View>

            <View style={styles.buttonView}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                colors={[theme.colors.sky, theme.colors.sky]}
                style={styles.button}>
                <TouchableOpacity
                  onPress={() => this.acceptInvitation()}
                  style={styles.button}>
                  <Text style={styles.buttonText}>{'Accept'}</Text>
                </TouchableOpacity>
              </LinearGradient>

              <TouchableOpacity
                onPress={() => this.declineInvitation()}
                style={[styles.button, styles.declineButton]}>
                <Text style={styles.buttonText}>{'Decline'}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </ScreenContainer>
      );
    } else {
      return <></>;
    }
  }
}

export default Versus;

const styles = StyleSheet.create({
  bg_image: {
    width: '100%',
    height: '100%',
  },
  masterMindLogo: {
    width: theme.SCREENWIDTH / 3,
    height: 70,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 30,
  },
  langButton: {
    backgroundColor: theme.colors.blue4,
    borderRadius: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.SCREENWIDTH / 1.8,
    marginTop: 17,
    paddingVertical: 6,
  },
  countyLogo: {
    width: 24,
    height: 24,
  },
  language: {
    color: theme.colors.white,
    fontFamily: theme.fonts.redHatMedium,
    fontSize: 14,
    marginLeft: 5,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  oppProfileView: {
    alignSelf: 'flex-end',
    marginTop: 50,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: theme.colors.white,
    backgroundColor: theme.colors.white,
    marginLeft: scale(24),
    zIndex: 10,
  },
  profile: {
    width: 92,
    height: 92,
    borderRadius: 50,
    borderColor: theme.colors.white,
  },
  gradient: {
    width: theme.SCREENWIDTH / 2,
    marginLeft: -30,
    height: 80,
    opacity: 0.8,
    justifyContent: 'center',
    paddingLeft: 40,
  },
  gradient1: {
    width: theme.SCREENWIDTH / 2,
    marginRight: -30,
    height: 80,
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 40,
  },
  name: {
    color: theme.colors.white,
    fontSize: 18,
    fontFamily: theme.fonts.extraBold,
  },
  scroeAvg: {
    color: theme.colors.white,
    fontSize: 13,
    fontFamily: theme.fonts.redHatNormal,
  },
  buttonView: {
    flexDirection: 'row',
    width: theme.SCREENWIDTH - 70,
    marginHorizontal: 35,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  button: {
    width: theme.SCREENWIDTH / 2.7,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 23,
  },
  declineButton: {
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  buttonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.redHatBold,
    fontSize: 16,
  },
});
