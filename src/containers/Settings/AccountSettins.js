/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {Switch} from 'react-native-switch';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Octicons from 'react-native-vector-icons/Octicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScreenContainer} from '../../components';
import {scale, theme, images, getPlatformURI} from '../../constants';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {setUserData} from '../../redux/actions';
import {RenderAlert} from '../../Helper/alert';

class AccountSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: null,
      userStatus: false,
      name: '',
      userName: '',
      myStatus: '',
      email: '',
      password: '123456',
      socialMedia: [{name: 'Facebook'}, {name: 'Instagram'}, {name: 'Twitter'}],
      facebook: false,
      instagram: false,
      twitter: false,
      friendList: [1, 2, 3, 4, 5, 6],
      imagePath: '',
      loading: true,
    };
  }

  componentDidMount() {
    const currentUser = auth().currentUser;
    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .get()
      .then((snapshot) => {
        const userData = snapshot.data();
        this.initState({currentUser, userData});
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });
  }

  initState = async ({currentUser, userData}) => {
    console.log(currentUser);
    this.setState({
      ...this.state,
      loading: false,
      uid: currentUser.uid,
      name: userData.full_name,
      myStatus: userData.status,
      facebook: userData.facebook,
      instagram: userData.instagram,
      twitter: userData.twitter,
      email: userData.email,
      userName: userData.user_name,
      imagePath: currentUser.photoURL,
    });
  };

  handleBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  renderDetailsHeader = (title) => (
    <Text style={styles.infoTitle}>{title}</Text>
  );

  onHandleSwitch = async (key) => {
    await this.setState({[key]: !this.state[key]});
    await this.handleSubmit();
  };

  renderSwitch = (key) => {
    return (
      <Switch
        activeText={''}
        barHeight={22}
        inActiveText={''}
        circleSize={20}
        backgroundActive={theme.colors.sky}
        backgroundInactive={theme.colors.grey1}
        circleBorderWidth={0}
        renderInsideCircle={() => <View style={styles.switchInsideCircle} />}
        switchWidthMultiplier={2.5}
        onValueChange={() => this.onHandleSwitch(key)}
        value={this.state[key]}
      />
    );
  };

  handleCamera = () => {
    const options = {
      title: 'Select Profile',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, async (response) => {
      if (!response.didCancel && !response.error && !response.customButton) {
        let path = await this.getPlatformPath(response).value;
        let fileName = await this.getFileName(response.fileName, path);

        await this.uploadImageToStorage(path, fileName);
        const photoURL = await getPlatformURI('assets/' + fileName);
        await this.setState({imagePath: photoURL.uri});
        auth().currentUser.updateProfile({photoURL: photoURL.uri});
        firestore()
          .collection('users')
          .doc(auth().currentUser.uid)
          .update({photoURL: photoURL.uri});
      }
    });
  };

  getFileName(name, path) {
    if (name != null) {
      return name;
    }

    if (Platform.OS === 'ios') {
      path = '~' + path.substring(path.indexOf('/Documents'));
    }
    return path.split('/').pop();
  }

  uploadImageToStorage(path, fileName) {
    this.setState({isLoading: true});
    const that = this;
    const name = fileName + new Date().getTime();
    let reference = storage().ref('assets/' + name);
    let task = reference.putFile(path);
    task
      .then(async () => {
        console.log('Image uploaded to the bucket!');
        const imagePath = await storage()
          .ref(`assets/${name}`)
          .getDownloadURL();
        console.log(imagePath);
        that.setState({
          isLoading: false,
          status: 'Image uploaded successfully',
          imagePath,
        });
        firestore()
          .collection('users')
          .doc(this.state.currentUser.uid)
          .update({photoURL: imagePath});
      })
      .catch((e) => {
        this.setState({isLoading: false, status: 'Something went wrong'});
      });
  }

  /**
   * Get platform specific value from response
   */
  getPlatformPath({path, uri}) {
    return Platform.select({
      android: {value: path},
      ios: {value: uri},
    });
  }

  handleChange = ({name, val}) => {
    if (name === 'userName') {
      auth().currentUser.updateProfile({displayName: val});
    }
    this.setState({
      [name]: val,
    });
  };

  reauthenticate = (currentPassword) => {
    var user = auth().currentUser;
    var cred = auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  };

  handleChangeEmail = () => {
    const {password, email} = this.state;
    if (password !== '123456') {
      this.reauthenticate(password)
        .then(() => {
          var user = auth().currentUser;
          user
            .updateEmail(email)
            .then(() => {
              RenderAlert('Email is updated successfully.');
              this.handleSubmit();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({passwordError: 'first, please fill out password.'});
    }
  };

  handleSubmit = async () => {
    const {
      uid,
      email,
      name,
      userName,
      myStatus,
      facebook,
      instagram,
      twitter,
    } = this.state;

    const date = new Date();
    const updateData = {
      created_at: this.props.userData.created_at,
      email,
      user_name: userName,
      full_name: name,
      status: myStatus,
      facebook,
      instagram,
      twitter,
      updated_at: date,
    };
    await this.props.setUser(updateData);
    await firestore().collection('users').doc(uid).update(updateData);
  };

  render() {
    const {
      name,
      userName,
      myStatus,
      email,
      password,
      socialMedia,
      friendList,
      imagePath,
      loading,
      passwordError,
    } = this.state;
    const {navigation} = this.props;

    if (loading) {
      return <></>;
    } else {
      return (
        <ScreenContainer style={{backgroundColor: '#FEFEFE'}}>
          <ScrollView
            contentContainerStyle={{paddingBottom: 40}}
            style={styles.container}>
            <TouchableOpacity onPress={this.handleBack}>
              <Image
                source={images.goBack}
                style={{tintColor: theme.colors.sky}}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Account Settings</Text>
            <View style={[styles.profileView, styles.shadow]}>
              <Image
                source={imagePath ? {uri: imagePath} : images.image1}
                style={styles.profile}
              />
              <TouchableOpacity
                style={styles.cameraView}
                onPress={this.handleCamera}>
                <Feather name="camera" size={17} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
            <View style={[styles.shadow, styles.cardContainer]}>
              {this.renderDetailsHeader('Full Name')}
              <InputContainer>
                <FontAwesome name="user-o" size={18} color={theme.colors.sky} />
                <TextInput
                  value={name}
                  underlineColorAndroid="transparent"
                  onChangeText={(val) => this.handleChange({name: 'name', val})}
                  style={[styles.input]}
                />
                <TouchableOpacity
                  style={styles.rightIconButton}
                  onPress={this.handleSubmit}>
                  <Text style={styles.rightInputText}>Done</Text>
                </TouchableOpacity>
              </InputContainer>

              {this.renderDetailsHeader('User Name')}
              <InputContainer>
                <FontAwesome name="user-o" size={18} color={theme.colors.sky} />
                <TextInput
                  value={userName}
                  underlineColorAndroid="transparent"
                  onChangeText={(val) =>
                    this.handleChange({name: 'userName', val})
                  }
                  style={[styles.input]}
                />
                <EditButton onPress={this.handleSubmit} />
              </InputContainer>

              {this.renderDetailsHeader('My Status')}
              <InputContainer>
                <Feather name="smile" size={18} color={theme.colors.sky} />
                <TextInput
                  value={myStatus}
                  underlineColorAndroid="transparent"
                  onChangeText={(val) =>
                    this.handleChange({name: 'myStatus', val})
                  }
                  maxLength={50}
                  style={[styles.input]}
                />
              </InputContainer>
              <TouchableOpacity
                style={[styles.rightIconButton, styles.statusSaveButton]}
                onPress={this.handleSubmit}>
                <Text style={styles.rightInputText}>Save</Text>
              </TouchableOpacity>

              {this.renderDetailsHeader('Email Address')}
              <InputContainer>
                <Octicons name="mail" size={18} color={theme.colors.sky} />
                <TextInput
                  value={email}
                  underlineColorAndroid="transparent"
                  onChangeText={(val) =>
                    this.handleChange({name: 'email', val})
                  }
                  style={[styles.input]}
                />
                <EditButton onPress={this.handleChangeEmail} />
              </InputContainer>

              {this.renderDetailsHeader('Password')}
              <InputContainer>
                <EvilIcons name="lock" size={30} color={theme.colors.sky} />
                <TextInput
                  value={password}
                  secureTextEntry
                  onChangeText={(val) =>
                    this.handleChange({name: 'password', val})
                  }
                  underlineColorAndroid="transparent"
                  style={[styles.input]}
                />
                <EditButton
                  onPress={() => navigation.navigate('EditPassword')}
                />
              </InputContainer>
              {!!passwordError && (
                <Text style={{color: 'red'}}>{passwordError}</Text>
              )}
            </View>

            <Header title={'Social Media'} />

            <View
              style={[
                styles.shadow,
                styles.cardContainer,
                {paddingVertical: 20},
              ]}>
              {socialMedia.map((d, i) => {
                return (
                  <View key={i.toString()} style={styles.switchView}>
                    <Text style={styles.socialName}>{d.name}</Text>
                    {this.renderSwitch(d.name.toLowerCase())}
                  </View>
                );
              })}
            </View>

            <Header title={'Friend List'} />

            <View
              style={[
                styles.shadow,
                styles.cardContainer,
                {paddingVertical: 25},
              ]}>
              {friendList.map((d, i) => {
                return (
                  <View
                    key={i.toString()}
                    style={[
                      styles.friendView,
                      {
                        // flexDirection: 'row',
                      },
                    ]}>
                    <Image source={images.image2} style={styles.friendImage} />
                    <View style={{marginLeft: 10, width: '53%'}}>
                      <Text style={styles.friendName}>{'Amy Lewis'}</Text>
                      <Text style={styles.friendId}>{'Amy766256'}</Text>
                    </View>
                    <View style={styles.friendScoreView}>
                      <Image source={images.star} style={styles.star} />
                      <Text style={styles.friendScore}>{'2,895'}</Text>
                    </View>
                    {i % 2 === 0 ? (
                      <Fontisto
                        name="unlocked"
                        size={20}
                        color={theme.colors.grey1}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="block-helper"
                        size={20}
                        color={theme.colors.red2}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </ScreenContainer>
      );
    }
  }
}

const InputContainer = (props) => (
  <View style={styles.inputContainer}>{props.children}</View>
);

const EditButton = (props) => {
  return (
    <TouchableOpacity style={styles.rightIconButton} onPress={props.onPress}>
      <FontAwesome name="edit" size={18} color={theme.colors.sky} />
    </TouchableOpacity>
  );
};

const Header = (props) => <Text style={styles.header}>{props.title}</Text>;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 35,
    paddingTop: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: theme.fonts.extraBold,
    color: theme.colors.black1,
    marginVertical: 19,
  },
  profileView: {
    width: scale(115),
    height: scale(115),
    borderRadius: scale(57),
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  profile: {
    width: scale(105),
    height: scale(105),
    borderRadius: scale(52),
    backgroundColor: theme.colors.white,
  },
  cameraView: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.sky,
    bottom: 8,
    right: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardContainer: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 20,
    paddingVertical: 35,
    marginTop: 20,
    borderRadius: 10,
    margin: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.redHatBold,
    color: theme.colors.black1,
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
    flex: 1,
    fontSize: 13,
    color: theme.colors.grey1,
    marginHorizontal: 10,
    fontFamily: theme.fonts.redHatNormal,
  },
  rightIconButton: {
    padding: 5,
  },
  statusSaveButton: {
    marginTop: -30,
    alignSelf: 'flex-end',
    marginRight: scale(6),
    marginBottom: 10,
  },
  rightInputText: {
    color: theme.colors.sky,
    fontSize: 12,
    fontFamily: theme.fonts.redHatMedium,
  },
  header: {
    fontSize: 20,
    fontFamily: theme.fonts.redHatExtraBold,
    color: theme.colors.black1,
    marginTop: 35,
  },
  switchView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  socialName: {
    fontSize: 16,
    fontFamily: theme.fonts.redHatBold,
    color: theme.colors.black1,
  },
  switchInsideCircle: {
    width: 20,
    height: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
  },
  friendView: {
    alignItems: 'center',
    marginVertical: 10,
    flexDirection: 'row',
  },
  friendImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  friendName: {
    fontFamily: theme.fonts.redHatBold,
    color: theme.colors.black1,
    fontSize: 16,
  },
  friendId: {
    color: theme.colors.grey2,
    fontSize: 12,
    fontFamily: theme.fonts.redHatNormal,
    marginTop: 5,
  },
  friendScoreView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '25%',
  },
  star: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 6,
  },
  friendScore: {
    fontSize: 13,
    fontFamily: theme.fonts.redHatMedium,
    color: theme.colors.grey3,
  },
});

const mapStateToProps = (state) => ({userData: state.AppReducer.userData});
const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (params) => dispatch(setUserData(params)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
