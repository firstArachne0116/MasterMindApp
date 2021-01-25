import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import auth from '@react-native-firebase/auth';
import {ScreenContainer} from '../../components';
import {images, theme, scale} from '../../constants';
import {RenderAlert} from '../../Helper/alert';
import {setUserData} from '../../redux/actions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      emailValidate: false,
      passwordValidate: false,
      emailValidateText: false,
      passwordValidateText: false,
      showPassword: false,
    };
  }

  handleShowPassword = () => {
    this.setState({showPassword: !this.state.showPassword});
  };

  handleLogin = () => {
    const {navigation} = this.props;
    const {email, password} = this.state;
    let emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let passwordReg = /^(?=.*?[A-Z0-9])(?=.*?[a-z0-9]).{4,20}$/;
    let emailError;
    let passwordError;
    if (email === '' && password === '') {
      emailError = 'Please enter Email Address';
      passwordError = 'Please enter password';
    } else if (!email.match(emailReg) && !password.match(passwordReg)) {
      emailError = 'Please Enter Valid Email Address';
      emailError = 'Please Enter Valid Email Address';
    } else if (!email.match(emailReg)) {
      emailError = 'Please Enter Valid Email Address';
    } else if (email === '') {
      emailError = 'Please enter Email Address';
    } else if (password === '') {
      passwordError = 'Please enter password';
    } else if (!password.match(passwordReg)) {
      passwordError =
        'Password field must be alpha-numeric and at least 8 character';
    } else {
      this.setState({
        loading: true,
      });
      auth()
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          this.props.setUser({email, password, register_type: 'email'});
          this.setState({
            loading: false,
          });
          navigation.navigate('NewGame', {isLoading: false});
        })
        .catch((error) => {
          this.setState({loading: false});
          if (error.code === 'auth/user-not-found') {
            RenderAlert('User not found');
            this.setState({
              loading: false,
            });
          }
          if (error.code === 'auth/wrong-password') {
            RenderAlert('Wrong Password');
          }
        });
    }
    this.setState({
      passwordError,
      emailError,
    });
  };

  render() {
    const {navigation} = this.props;
    const {email, password, showPassword} = this.state;
    return (
      <ScreenContainer>
        <KeyboardAvoidingScrollView>
          <ImageBackground
            resizeMode={'stretch'}
            source={images.loginBack}
            style={styles.bg_image}>
            <TouchableOpacity
              style={styles.topContainer}
              onPress={() => navigation.goBack()}>
              <Image source={images.goBack} />
            </TouchableOpacity>
            <Text style={[styles.title, styles.topContainer]}>{'Login'}</Text>
            <Text style={[styles.subText, styles.topContainer]}>
              {'Enter your login details to access\nyour account'}
            </Text>
          </ImageBackground>
          <View style={{marginHorizontal: scale(30), flex: 1}}>
            <View style={styles.inputContainer}>
              <Image source={images.at1} style={styles.icon} />
              <TextInput
                placeholder="Enter Email Address or Username"
                placeholderTextColor={theme.colors.grey1}
                underlineColorAndroid="transparent"
                onChangeText={(txt) => this.setState({email: txt})}
                value={email}
                style={[styles.input]}
              />
            </View>
            {this.state.emailError !== '' && (
              <Text style={styles.error_input}>{this.state.emailError}</Text>
            )}

            <View style={styles.inputContainer}>
              <Image source={images.lock1} style={styles.icon} />
              <TextInput
                placeholder="Enter Password"
                placeholderTextColor={theme.colors.grey1}
                secureTextEntry={!showPassword}
                underlineColorAndroid="transparent"
                onChangeText={(txt) => this.setState({password: txt})}
                value={password}
                style={[styles.input]}
              />
              <TouchableOpacity onPress={this.handleShowPassword}>
                <Image source={images.eye} style={styles.icon} />
              </TouchableOpacity>
            </View>
            {this.state.passwordError !== '' && (
              <Text style={styles.error_input}>{this.state.passwordError}</Text>
            )}

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.handleLogin}>
              {this.state.loading ? (
                <ActivityIndicator size="large" color="#9cbfa7" />
              ) : (
                <Text style={styles.login}>{'Login'}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgetPassword')}>
              <Text style={styles.forgot}>{'Forgot Pasword ?'}</Text>
            </TouchableOpacity>

            <View style={styles.privacyView}>
              <TouchableOpacity onPress={() => alert('Privacy Policy')}>
                <Text style={styles.privacy}>{'Private Policy'}</Text>
              </TouchableOpacity>
              <View style={styles.devider} />
              <TouchableOpacity onPress={() => alert('Terms of Service')}>
                <Text style={styles.privacy}>{'Terms of Service'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomView}>
              <Text style={styles.dontAcc}>{"Don't have an account ?"}</Text>

              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.bottomSignup}>{'SIGN UP'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingScrollView>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  bg_image: {
    width: '100%',
    resizeMode: 'stretch',
    height: theme.SCREENHEIGHT / 2.45,
    paddingTop: scale(35),
  },
  topContainer: {
    marginLeft: scale(30),
  },
  title: {
    fontFamily: theme.fonts.extraBold,
    color: theme.colors.white,
    marginTop: 30,
    fontSize: scale(30),
  },
  subText: {
    color: theme.colors.white,
    fontSize: scale(13),
    fontFamily: theme.fonts.redHatNormal,
    marginTop: scale(20),
    lineHeight: scale(20),
  },
  button: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 45,
    height: 50,
    marginTop: 80,
    left: '10%',
    borderColor: '#ffffff',
    borderWidth: 2,
    width: '60%',
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: theme.colors.grey1,
    marginTop: Platform.OS === 'ios' ? scale(25) : scale(15),
    paddingBottom: Platform.OS === 'ios' ? scale(12) : 0,
    paddingHorizontal: scale(10),
    alignItems: 'center',
  },
  input: {
    color: theme.colors.grey1,
    fontSize: 16,
    fontFamily: theme.fonts.redHatNormal,
    marginLeft: scale(10),
    width: theme.SCREENWIDTH / 1.5,
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  buttonContainer: {
    paddingVertical: scale(11),
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
  login: {
    textAlign: 'center',
    color: theme.colors.white,
    fontFamily: theme.fonts.redHatBold,
    fontSize: 17,
  },
  forgot: {
    marginTop: scale(12),
    alignSelf: 'flex-end',
    color: theme.colors.grey2,
    fontSize: 14,
  },
  privacyView: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: scale(30),
  },
  privacy: {
    color: theme.colors.grey2,
    fontSize: 17,
    alignSelf: 'center',
    fontFamily: theme.fonts.redHatNormal,
  },
  devider: {
    width: 2,
    height: 20,
    backgroundColor: theme.colors.grey4,
    marginHorizontal: 20,
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(40),
    width: theme.SCREENWIDTH - 60,
    marginBottom: scale(20),
  },
  dontAcc: {
    color: theme.colors.grey3,
    fontSize: 15,
    fontFamily: theme.fonts.redHatNormal,
  },
  bottomSignup: {
    color: theme.colors.sky,
    fontSize: 16,
    fontFamily: theme.fonts.redHatMedium,
  },
  error_input: {
    color: theme.colors.red,
    fontSize: 13,
    fontFamily: theme.fonts.redHatMedium,
  },
});

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (params) => dispatch(setUserData(params)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
