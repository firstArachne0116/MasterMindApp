/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {images, scale, theme} from '../../constants';
import {ScreenContainer} from '../../components';
import {RenderAlert} from '../../Helper/alert';
import {setUserData} from '../../redux/actions';
import moment from 'moment';

const RenderContainer = (props) => {
  const {children} = props;
  if (Platform.OS === 'ios') {
    return (
      <ScreenContainer>
        <ImageBackground source={images.welcomeBack} style={styles.bg_image}>
          <KeyboardAvoidingScrollView style={{flex: 1}}>
            {children}
          </KeyboardAvoidingScrollView>
        </ImageBackground>
      </ScreenContainer>
    );
  } else {
    return (
      <ImageBackground source={images.welcomeBack} style={styles.bg_image}>
        <KeyboardAvoidingScrollView style={{flex: 1}}>
          {children}
        </KeyboardAvoidingScrollView>
      </ImageBackground>
    );
  }
};
class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      name: '',
      email: '',
      password: '',
      c_password: '',
      nameValidate: false,
      emailvalidate: false,
      passwordValidate: false,
      c_passwordValidate: false,
      nameValidateText: false,
      emailvalidateText: false,
      passwordValidateText: false,
      c_passwordValidateText: false,

      signupForm: [
        {
          placeholder: 'Enter Email Address',
          value: '',
          empty: 'Please enter email address',
          noValid: 'Please enter a valid email address',
          name: 'email',
          icon: images.at,
          regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        {
          placeholder: 'Enter Username',
          value: '',
          empty: 'Please enter User name',
          noValid: 'User Name field must be alphabatic',
          name: 'name',
          icon: images.user,
          regex: /^[a-zA-Z0-9._\s]+$/,
        },
        {
          placeholder: 'Password',
          value: '',
          empty: 'Please enter Password',
          noValid:
            'Password field must be alpha-numeric and at least 10 character',
          name: 'password',
          icon: images.lock,
          regex: /^(?=.*?[A-Z0-9])(?=.*?[a-z0-9]).{6,20}$/,
          showPassword: false,
        },
        {
          placeholder: 'Confirm Password',
          value: '',
          empty: 'Please enter Confirm Password',
          noValid: 'No match password',
          name: 'cpassword',
          icon: images.lock,
          showPassword: false,
        },
      ],
      isEmpty: '',
      isInvalid: '',
      isFormProcess: false,
    };
  }

  handleSignup = () => {
    const {signupForm, isFormProcess, isEmpty, isInvalid} = this.state;
    if (!isFormProcess) {
      this.setState({
        isFormProcess: true,
      });
    }
    if (isEmpty) {
      this.setState({
        isEmpty: '',
      });
    }
    if (isInvalid) {
      this.setState({
        isInvalid: '',
      });
    }
    let formData = {};
    let isFormDataValid = false;

    for (let index = 0; index < signupForm.length; index++) {
      let item = signupForm[index];
      let itemValues = signupForm[index].value;

      let inputValue = itemValues.trim();
      if (inputValue) {
        if (item.name !== 'cpassword') {
          if (item.regex) {
            if (inputValue.match(item.regex)) {
              formData = {...formData, ...{[item.name]: inputValue}};
              isFormDataValid = true;
            } else {
              this._handleformError('isInvalid', 'isEmpty', index);
              isFormDataValid = false;
              break;
            }
          }
        } else {
          if (inputValue !== signupForm[index - 1].value) {
            this._handleformError('isInvalid', 'isEmpty', index);
            isFormDataValid = false;
            break;
          } else {
            isFormDataValid = true;
          }
        }
      } else {
        this._handleformError('isEmpty', 'isInvalid', index);
        isFormDataValid = false;
        break;
      }
    }
    if (isFormDataValid) {
      let newFormData = {...formData, displayName: formData.name};
      this._handleApiCall(newFormData);
    }
  };

  _handleApiCall(newFormData) {
    const {email, password} = newFormData;
    this.setState({
      loading: true,
    });
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.addSignupData(newFormData);
        this.props.setUser({...newFormData, register_type: 'email'});
        this.setState({loading: false});
      })
      .catch((error) => {
        this.setState({loading: false});
        if (error.code === 'auth/email-already-in-use') {
          RenderAlert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          RenderAlert('That email address is invalid!');
        }

        console.error(error);
      });
  }

  addSignupData = (userData) => {
    const {navigation} = this.props;
    const userRef = auth().currentUser;
    let docRef = firestore().collection('users').doc(userRef.uid);
    let notifications = firestore()
      .collection('notifications')
      .doc(userRef.uid);
    const currentTime = moment();
    let data = {
      uid: userRef.uid,
      full_name: userData.name,
      user_name: userData.name,
      email: userData.email,
      password: userData.password,
      created_at: currentTime._d,
      updated_at: currentTime._d,
      register_type: 'email',
    };
    notifications.set({
      email_message_flag: false,
      email_move_flag: false,
      push_message_flag: false,
      push_move_flag: false,
    });
    firestore()
      .collection('privacies')
      .doc(userRef.uid)
      .set({uid: userRef.uid});
    docRef.set(data).then(() => {
      this.setState({
        loading: false,
      });
      navigation.navigate('NewGame', {isLoading: false});
    });
  };

  _handleformError(type, clearType, index) {
    this.setState({
      [type]: index,
      [clearType]: '',
    });
  }

  dataChecker = (txt, item) => {
    const {isFormProcess} = this.state;
    if (isFormProcess) {
      if (txt.match(item.regex)) {
        this.setState({
          isEmpty: '',
          isInvalid: '',
        });
      }
    }
  };

  handleInput = (txt, item, index) => {
    this.dataChecker(txt, item);
    let updatedForm = this.state.signupForm;
    updatedForm[index] = {...updatedForm[index], value: txt};
    this.setState({
      signupForm: updatedForm,
    });
  };

  renderError = (item, index) => {
    const {isEmpty, isInvalid, isFormProcess} = this.state;

    if (isFormProcess && isInvalid === index) {
      return <Text style={styles.inputError}>{item.noValid}</Text>;
    }
    if (isFormProcess && isEmpty === index) {
      return <Text style={styles.inputError}>{item.empty}</Text>;
    }
    return null;
  };

  render() {
    const {signupForm} = this.state;
    const {navigation} = this.props;
    return (
      <RenderContainer>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.goBack} />
          </TouchableOpacity>
          <Text style={[styles.title]}>{'Sign Up'}</Text>
          <Text style={[styles.subText]}>
            {
              'Please Register to play mastermind. Your Email\naddress will not be given to Third Parties'
            }
          </Text>

          <View>
            {this.state.signupForm.map((item, index) => {
              return (
                <View key={index.toString()}>
                  <View
                    style={[
                      styles.inputContainer,
                      {marginTop: index === 3 ? 15 : 30},
                    ]}>
                    <Image source={item.icon} style={styles.icon} />
                    <TextInput
                      placeholder={item.placeholder}
                      placeholderTextColor={theme.colors.white}
                      underlineColorAndroid="transparent"
                      secureTextEntry={
                        index === 2 || index === 3
                          ? item.showPassword
                            ? false
                            : true
                          : false
                      }
                      onChangeText={(txt) => this.handleInput(txt, item, index)}
                      style={[styles.input]}
                    />
                    {(index === 2 || index === 3) && (
                      <TouchableOpacity
                        onPress={() => {
                          signupForm[index].showPassword = !signupForm[index]
                            .showPassword;
                          this.setState({
                            signupForm: this.state.signupForm,
                          });
                        }}>
                        <Icon
                          name={'md-eye-outline'}
                          size={scale(15)}
                          color={theme.colors.white}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {this.renderError(item, index)}
                  {index === 2 && (
                    <Text style={styles.passwordHint}>
                      {'At least 10 characters'}
                    </Text>
                  )}
                </View>
              );
            })}
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.handleSignup}>
              {this.state.loading ? (
                <ActivityIndicator size="large" color="#9cbfa7" />
              ) : (
                <Text style={styles.signup}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.info}>
            {
              'By signing up, you agreed with our Terms of\nServices and Privacy Policy.'
            }
          </Text>
          <View style={styles.bottomView}>
            <Text style={styles.alreadyLoginText}>
              {'Already have an account ?'}
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.login}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RenderContainer>
    );
  }
}

const styles = StyleSheet.create({
  bg_image: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    marginHorizontal: scale(30),
    marginVertical: scale(35),
  },
  title: {
    fontFamily: theme.fonts.extraBold,
    color: theme.colors.white,
    marginTop: 30,
    fontSize: scale(30),
  },
  subText: {
    color: theme.colors.white,
    fontSize: 14,
    fontFamily: theme.fonts.redHatNormal,
    marginTop: scale(14),
  },
  inputContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: theme.colors.white,
    paddingBottom: Platform.OS === 'ios' ? scale(12) : 0,
    paddingHorizontal: scale(10),
    alignItems: 'center',
  },
  icon: {
    width: scale(16),
    height: scale(16),
    tintColor: theme.colors.white,
  },
  input: {
    color: theme.colors.white,
    fontFamily: theme.fonts.redHatNormal,
    fontSize: 15,
    marginLeft: scale(10),
    width: theme.SCREENWIDTH / 1.45,
  },
  inputError: {
    color: theme.colors.red,
    fontSize: 13,
    fontFamily: theme.fonts.redHatMedium,
  },
  passwordHint: {
    color: theme.colors.white,
    textAlign: 'right',
    fontFamily: theme.fonts.redHatNormal,
    fontSize: scale(11),
    marginTop: 5,
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
  signup: {
    textAlign: 'center',
    color: theme.colors.white,
    fontFamily: theme.fonts.redHatBold,
    fontSize: 17,
  },
  info: {
    textAlign: 'center',
    color: theme.colors.white,
    marginTop: scale(15),
    fontSize: scale(12),
    fontFamily: theme.fonts.redHatNormal,
  },
  bottomView: {
    flexDirection: 'row',
    marginTop: 70,
    justifyContent: 'space-between',
    width: theme.SCREENWIDTH - 70,
  },
  alreadyLoginText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.redHatNormal,
  },
  login: {
    color: theme.colors.white,
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
export default connect(mapStateToProps, mapDispatchToProps)(Signup);
