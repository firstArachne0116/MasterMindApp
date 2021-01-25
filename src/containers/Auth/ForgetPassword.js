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
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {images, scale, theme} from '../../constants';
import {ScreenContainer} from '../../components';
import {RenderAlert} from '../../Helper/alert';

class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      email: '',
      emailError: '',
      emailValidate: false,
      emailValidateText: false,
    };
  }

  onSubmit = async () => {
    const {navigation} = this.props;
    const {email} = this.state;
    let emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let emailError;
    if (email === '') {
      emailError = 'Please enter email address';
    } else if (!email.match(emailReg)) {
      emailError = 'Please enter valid email address';
    } else {
      try {
        await auth().sendPasswordResetEmail(email);
        await RenderAlert('Please check your mail box.');
        this.setState({
          emailError: '',
          email: '',
        });
        navigation.navigate('Login');
      } catch (error) {
        this.setState({
          emailError: error.message,
        });
      }
    }
    this.setState({
      emailError,
    });
  };

  render() {
    const {navigation} = this.props;
    const {email} = this.state;
    return (
      <ScreenContainer>
        <KeyboardAvoidingScrollView>
          <ImageBackground
            resizeMode={'stretch'}
            source={images.forgotBack}
            style={styles.bg_image}>
            <TouchableOpacity
              style={styles.topContainer}
              onPress={() => navigation.goBack()}>
              <Image source={images.goBack} />
            </TouchableOpacity>
            <Image
              source={images.forgot}
              style={[styles.forgot, styles.topContainer]}
            />
            <Text style={[styles.title, styles.topContainer]}>
              {'Forget\nPassword?'}
            </Text>
            <Text style={[styles.subText, styles.topContainer]}>
              {
                'Enter your email below and we will send you\ninstructions on how to reset your password'
              }
            </Text>
          </ImageBackground>
          <View style={styles.bottomContainer}>
            <View style={styles.inputContainer}>
              <Image source={images.at1} style={styles.icon} />
              <TextInput
                placeholder="Enter Email Address"
                placeholderTextColor={theme.colors.grey1}
                underlineColorAndroid="transparent"
                onChangeText={(txt) => this.setState({email: txt})}
                style={[styles.input]}
                value={email}
              />
            </View>
            {this.state.emailError !== '' && (
              <Text style={styles.error_input}>{this.state.emailError}</Text>
            )}

            <View style={styles.buttonView}>
              <TouchableOpacity
                style={[styles.buttonContainer]}
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.buttonContainer, styles.sendButton]}
                onPress={() => this.onSubmit()}>
                <Text style={[styles.buttonText, {color: theme.colors.white}]}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{marginTop: scale(60)}}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.return}>{'RETURN TO LOGIN'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingScrollView>
      </ScreenContainer>
    );
  }
}

export default ForgetPassword;

const styles = StyleSheet.create({
  bg_image: {
    width: theme.SCREENWIDTH,
    height: theme.SCREENWIDTH + 40,
    paddingTop: scale(25),
  },
  topContainer: {
    marginLeft: scale(30),
  },
  forgot: {
    width: scale(70),
    height: scale(80),
    resizeMode: 'contain',
    marginTop: theme.SCREENHEIGHT > 680 ? scale(30) : scale(20),
    marginBottom: theme.SCREENHEIGHT > 680 ? scale(17) : scale(10),
  },
  title: {
    color: theme.colors.white,
    fontSize: 34,
    fontFamily: theme.fonts.extraBold,
  },
  subText: {
    color: theme.colors.white,
    fontSize: 14,
    fontFamily: theme.fonts.redHatNormal,
    marginTop: theme.SCREENHEIGHT > 680 ? scale(16) : scale(11),
  },
  bottomContainer: {
    marginHorizontal: scale(30),
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: theme.colors.grey1,
    // marginTop: -50,
    // marginTop: Platform.OS === 'ios' ? scale(25) : scale(10),
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
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(27),
  },
  buttonContainer: {
    borderWidth: 2,
    borderColor: theme.colors.sky,
    width: theme.SCREENWIDTH / 2.55,
    paddingVertical: scale(12),
    borderRadius: scale(23),
  },
  sendButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 2,
    backgroundColor: theme.colors.sky,
  },
  buttonText: {
    color: theme.colors.sky,
    fontSize: 17,
    fontFamily: theme.fonts.redHatBold,
    textAlign: 'center',
  },
  return: {
    fontFamily: theme.fonts.redHatMedium,
    color: theme.colors.sky,
    fontSize: 15,
    alignSelf: 'center',
    // marginTop: scale(60),
    marginBottom: 10,
  },
  error_input: {
    color: theme.colors.red,
    fontSize: 13,
    fontFamily: theme.fonts.redHatMedium,
  },
});
