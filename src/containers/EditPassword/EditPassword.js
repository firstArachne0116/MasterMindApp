import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {images, theme, scale} from '../../constants';
import {ScreenContainer} from '../../components';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class EditPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showOldPwd: false,
      showNewPwd: false,
      showConfirmPwd: false,
      oldPassword: null,
      newPassword: null,
      confirmPassword: null,
      user: auth().currentUser,
      error: null,
      success: null,
    };
  }

  handleShowPassword = (key) => {
    this.setState({[key]: !this.state[key]});
  };

  handleChange = ({name, val}) => {
    this.setState({[name]: val, error: null});
  };

  handleSubmit = () => {
    const {oldPassword, newPassword, confirmPassword} = this.state;
    const validation = new RegExp(
      '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})',
    );
    if (!!oldPassword && !!newPassword && !!confirmPassword) {
      if (validation.test(newPassword)) {
        if (newPassword === confirmPassword) {
          this.changePassword(oldPassword, newPassword);
        } else {
          this.setState({
            error: 'password and confirm password must match.',
          });
        }
      } else {
        this.setState({
          error: 'password is too week.',
        });
      }
    } else {
      this.setState({
        error: 'please check all fields.',
      });
    }
  };

  reauthenticate = (currentPassword) => {
    const {user} = this.state;
    var cred = auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  };

  changePassword = (currentPassword, newPassword) => {
    const {user} = this.state;
    this.reauthenticate(currentPassword)
      .then(() => {
        user
          .updatePassword(newPassword)
          .then(() => {
            this.setState({success: 'Password is updated successfully.'});
            firestore()
              .collection('users')
              .doc(user.uid)
              .update({password: newPassword});
          })
          .catch((error) => {
            this.setState({error: error.message});
          });
      })
      .catch((error) => {
        this.setState({error: error.message});
      });
  };

  render() {
    const {navigation} = this.props;
    const {showOldPwd, showNewPwd, showConfirmPwd, error, success} = this.state;
    return (
      <ScreenContainer>
        <KeyboardAvoidingScrollView>
          <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name={'close'} size={20} color={theme.colors.sky} />
            </TouchableOpacity>
            <Text style={[styles.title]}>Password</Text>
            <TouchableOpacity onPress={this.handleSubmit}>
              <Text style={[styles.save]}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomContainer}>
            <Text style={[styles.label]}>Old Password</Text>
            <View style={styles.inputContainer}>
              <Image source={images.lock1} style={styles.icon} />
              <TextInput
                placeholderTextColor={theme.colors.grey1}
                secureTextEntry={!showOldPwd}
                underlineColorAndroid="transparent"
                onChangeText={(val) =>
                  this.handleChange({name: 'oldPassword', val})
                }
                style={[styles.input]}
              />
              <TouchableOpacity
                onPress={() => this.handleShowPassword('showOldPwd')}>
                <Image source={images.eye} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.label]}>New Password</Text>
            <View style={styles.inputContainer}>
              <Image source={images.lock1} style={styles.icon} />
              <TextInput
                placeholderTextColor={theme.colors.grey1}
                secureTextEntry={!showNewPwd}
                onChangeText={(val) =>
                  this.handleChange({name: 'newPassword', val})
                }
                underlineColorAndroid="transparent"
                style={[styles.input]}
              />
              <TouchableOpacity
                onPress={() => this.handleShowPassword('showNewPwd')}>
                <Image source={images.eye} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.label]}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <Image source={images.lock1} style={styles.icon} />
              <TextInput
                placeholderTextColor={theme.colors.grey1}
                secureTextEntry={!showConfirmPwd}
                onChangeText={(val) =>
                  this.handleChange({name: 'confirmPassword', val})
                }
                underlineColorAndroid="transparent"
                style={[styles.input]}
              />
              <TouchableOpacity
                onPress={() => this.handleShowPassword('showConfirmPwd')}>
                <Image source={images.eye} style={styles.icon} />
              </TouchableOpacity>
            </View>
            {!!error && <Text style={{color: 'red'}}>{error}</Text>}
            {!!success && <Text style={{color: 'green'}}>{success}</Text>}
          </View>
        </KeyboardAvoidingScrollView>
      </ScreenContainer>
    );
  }
}

export default EditPassword;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    marginHorizontal: 35,
  },
  title: {
    color: theme.colors.black1,
    fontSize: 24,
    fontFamily: theme.fonts.extraBold,
  },
  save: {
    color: theme.colors.sky,
    fontFamily: theme.fonts.redHatMedium,
    fontSize: 16,
  },
  bottomContainer: {
    marginHorizontal: 35,
    marginTop: 27,
  },
  label: {
    color: theme.colors.black1,
    fontFamily: theme.fonts.redHatBold,
    fontSize: 16,
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
    marginTop: Platform.OS === 'ios' ? scale(10) : 0,
    paddingBottom: Platform.OS === 'ios' ? scale(12) : 0,
    paddingHorizontal: scale(10),
    marginBottom: 30,
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
});
