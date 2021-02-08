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

class Versus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      you: null,
      currentUser: auth().currentUser,
    };
  }

  async componentDidMount() {
    const user = await auth().currentUser;
    await firestore()
      .collection('sessions')
      .doc(user.uid)
      .get()
      .then((querySnapshot) => {
        const you = querySnapshot.data();
        this.setState({you});
      });
  }

  render() {
    const {navigation} = this.props;
    const {params} = this.props.route;
    const {you, currentUser} = this.state;

    if (you) {
      return (
        <ScreenContainer>
          <ImageBackground source={images.versus} style={styles.bg_image}>
            <Image source={images.masterMind1} style={styles.masterMindLogo} />
            <TouchableOpacity
              style={styles.langButton}
              // onPress={() => this.navigateToHomeScreen('GlobalRankList')}
            >
              <Image source={images.uk} style={styles.countyLogo} />
              <Text
                style={styles.language}>{`${you.language}(${you.code})`}</Text>
            </TouchableOpacity>

            <View style={styles.profileContainer}>
              <Image
                style={styles.profile}
                source={{uri: currentUser.photoURL}}
              />
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
                <Text style={styles.name}>{params.name}</Text>
                <Text style={styles.scroeAvg}>{'Avg. Score: 220'}</Text>
              </LinearGradient>
              <Image
                style={[styles.profile, {marginLeft: 0, marginRight: 24}]}
                source={{uri: params.photoURL}}
              />
            </View>

            <View style={styles.buttonView}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                colors={[theme.colors.sky, theme.colors.sky]}
                style={styles.button}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ActiveSession', {
                      ...params,
                    })
                  }
                  style={styles.button}>
                  <Text style={styles.buttonText}>{'Accept'}</Text>
                </TouchableOpacity>
              </LinearGradient>

              <TouchableOpacity
                onPress={() => navigation.navigate('GlobalRankList')}
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
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: theme.colors.white,
    marginLeft: scale(24),
    zIndex: 10,
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
