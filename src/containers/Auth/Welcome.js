import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {images, scale, theme} from '../../constants';
import {LoadingScreen, ScreenContainer} from '../../components';
import {RenderAlert} from '../../Helper/alert';
import {setUserData} from '../../redux/actions';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingScreen: false,
    };
  }

  componentDidMount() {
    this.init();
    this.props.navigation.addListener('focus', () => {
      this.init();
    });
  }

  init = () => {
    this.setState({isLoadingScreen: true});
    const user = auth().currentUser;

    if (user) {
      this.props.navigation.navigate('Home');
      return;
    }
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId:
        '651695572708-5p25rv7j7qeq64efe15e5l0ldv00sjk9.apps.googleusercontent.com',
      offlineAccess: true,
    });
    setTimeout(() => {
      this.setState({
        isLoadingScreen: false,
      });
    }, 1600);
  };

  handleFacebook = async () => {
    const {isCancelled} = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (isCancelled) {
      throw 'User cancelled the login process';
    } else {
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw 'Something went wrong obtaining access token';
      }
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );
      this.getInfoFromToken(data.accessToken, facebookCredential);
    }
  };

  getInfoFromToken = (token, loginToken) => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,first_name,last_name,email',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, user) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          const userData = {
            created_at: new Date(),
            updated_at: new Date(),
            register_type: 'facebook',
            full_name: `${user.first_name} ${user.last_name}`,
            user_name: user.name,
            email: user.email,
          };
          this.props.setUser({
            email: user.email,
            name: user.name,
            register_type: 'facebook',
          });
          this.setUsersData(userData, loginToken);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  setUsersData = async (userData, token) => {
    const {navigation} = this.props;
    auth()
      .signInWithCredential(token)
      .then(() => {
        const userRef = auth().currentUser;
        firestore()
          .collection('users')
          .doc(userRef.uid)
          .get()
          .then((snapshot) => {
            const user = snapshot.data();
            if (!user) {
              const uid = {uid: userRef.uid};
              const data = {
                uid: userRef.uid,
                photoURL: userRef.photoURL,
                created_at: userData.created_at,
                email: userData.email,
                full_name: userData.full_name,
                register_type: userData.register_type,
                updated_at: userData.updated_at,
                user_name: userData.user_name,
              };

              firestore().collection('users').doc(userRef.uid).set(data);
              firestore().collection('notifications').doc(userRef.uid).set(uid);
              firestore().collection('privacies').doc(userRef.uid).set(uid);
            }
            navigation.navigate('Home', {isLoading: false});
          })
          .catch((err) => {
            console.log('Error getting documents', err);
          });
      });
  };

  handleGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {user, idToken} = await GoogleSignin.signIn();
      const googleCredential = await auth.GoogleAuthProvider.credential(
        idToken,
      );
      this.props.setUser({
        email: user.email,
        name: user.name,
        register_type: 'google',
      });
      const userData = {
        created_at: new Date(),
        updated_at: new Date(),
        register_type: 'google',
        full_name: `${user.givenName} ${user.familyName}`,
        user_name: user.name,
        email: user.email,
      };
      this.setUsersData(userData, googleCredential);
    } catch (error) {
      RenderAlert(error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        RenderAlert('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        RenderAlert('Signin in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        RenderAlert('Play services not available');
      }
    }
  };

  render() {
    const {navigation} = this.props;
    const {isLoadingScreen} = this.state;

    if (isLoadingScreen) {
      return <LoadingScreen />;
    }
    return (
      <ScreenContainer>
        <ImageBackground source={images.welcomeBack} style={styles.bg_image}>
          <Text style={styles.title}>{'Welcome,'}</Text>
          <Text style={styles.subText}>
            {'Are you ready to meet great gamers from\naround the world?'}
          </Text>
          <Text style={styles.connectText}>
            {'Connect to find friends!!!!!'}
          </Text>
          <View style={styles.mediaView}>
            <TouchableOpacity
              onPress={this.handleFacebook}
              style={[styles.mediaButton]}>
              <View style={styles.mediaIconView}>
                <Image source={images.facebook} />
              </View>
              <Text style={[styles.mediaButtonText]}>{'FACEBOOK'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handleGoogle}
              style={[
                styles.mediaButton,
                {
                  backgroundColor: theme.colors.lightWhite,
                },
              ]}>
              <View
                style={[
                  styles.mediaIconView,
                  {backgroundColor: theme.colors.lightWhite},
                ]}>
                <Image source={images.google} />
              </View>
              <Text
                style={[
                  styles.mediaButtonText,
                  {color: theme.colors.grey, marginRight: scale(17)},
                ]}>
                {'GOOGLE'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.emailtoSignup}
            onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.emailtoSignupText}>
              {"I'll use email to sign up"}
            </Text>
          </TouchableOpacity>
          <View style={styles.bottomView}>
            <Text style={styles.alreadyLoginText}>
              {'Already have an account ?'}
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.login}>{'LOGIN'}</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  bg_image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontFamily: theme.fonts.extraBold,
    color: theme.colors.white,
    textAlign: 'center',
    marginTop: 85,
    fontSize: 45,
  },
  subText: {
    textAlign: 'center',
    marginTop: 10,
    fontFamily: theme.fonts.redHatNormal,
    color: theme.colors.white,
    fontSize: 15,
    lineHeight: 19,
  },
  connectText: {
    color: theme.colors.white,
    fontSize: 17,
    fontFamily: theme.fonts.redHatBold,
    textAlign: 'center',
    marginTop: 88,
  },
  mediaView: {
    flexDirection: 'row',
    marginHorizontal: scale(32),
    justifyContent: 'space-between',
    marginTop: scale(35),
  },
  mediaButton: {
    width: theme.SCREENWIDTH / 2.7,
    height: 42,
    borderRadius: 50,
    justifyContent: 'center',
    backgroundColor: theme.colors.blue,
  },
  mediaIconView: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.blue1,
    position: 'absolute',
    left: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaButtonText: {
    textAlign: 'right',
    marginRight: scale(10),
    fontFamily: theme.fonts.redHatMedium,
    fontSize: 15,
    color: theme.colors.white,
  },
  emailtoSignup: {
    alignSelf: 'center',
    marginTop: scale(35),
    borderWidth: 2,
    borderRadius: scale(20),
    borderColor: theme.colors.white,
    paddingVertical: scale(10),
    paddingHorizontal: scale(25),
  },
  emailtoSignupText: {
    fontSize: 16,
    fontFamily: theme.fonts.redHatNormal,
    color: theme.colors.white,
  },
  bottomView: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    justifyContent: 'space-between',
    marginHorizontal: 35,
    width: theme.SCREENWIDTH - 70,
  },
  alreadyLoginText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.redHatNormal,
  },
  login: {
    color: 'white',
    fontSize: 17,
    fontFamily: theme.fonts.redHatMedium,
  },
});

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (params) => dispatch(setUserData(params)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
