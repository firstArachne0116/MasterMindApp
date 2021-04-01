/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {scale, theme, images} from '../../constants/index.js';
import {ScreenContainer, SocialMedia} from '../../components';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {
  InviteContent,
  MediaAttachment,
  Invites,
} from 'getsocial-react-native-sdk';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
class SessionInvitation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inviteList: [
        {
          title: 'Invite your\nMasterMIND friend',
          icon: images.girl,
          cardImage: images.inviteFriend,
          handler: () => {
            this.searchRef.current.focus();
          },
        },
        {
          title: 'Invite your\nFacebook friend',
          icon: images.fbIcon,
          cardImage: images.fbFriend,
          handler: () => {
            this.inviteSocial('facebook');
          },
        },
        {
          title: 'Invite your\nWhatsApp friend',
          icon: images.whatsapp,
          cardImage: images.fbFriend,
          handler: () => {
            this.inviteSocial('whatsapp');
          },
        },
        {
          title: 'Invite your\nViber freinds',
          icon: images.viber,
          cardImage: images.viberFriend,
          handler: () => {
            this.inviteSocial('viber');
          },
        },
        {
          title: 'Invite from\nyour contact list',
          icon: images.contactList,
          cardImage: images.viberFriend,
          handler: () => {
            this.inviteSocial('sms');
          },
        },
        {
          title: 'Invite random\nMasterMIND user',
          icon: images.team,
          cardImage: images.inviteRandomUser,
          handler: this.inviteRandomUser,
        },
      ],
      friends: [],
      selectedFriend: null,
      searchTxt: '',
    };
    this.searchRef = React.createRef();
    this.timerID = null;
  }

  componentDidMount() {
    Invites.getAvailableChannels().then((channels) => {
      console.log(channels);
    });
    const {params} = this.props.route;
    if (params && params.player) {
      console.log(params.player);
      this.handleSearchFriend(params.player.name);
      firestore()
        .collection('users')
        .doc(params.player.uid)
        .get()
        .then((snap) => {
          this.setState({selectedFriend: snap.data()}, () => {
            this.inviteFriend();
          });
        });
    }
  }

  inviteSocial = (channel) => {
    const linkParams = {
      $link_name: 'https://bemastermind.gsc.im/3djZy6UGtC',
    };

    const customInviteContent = new InviteContent();
    customInviteContent.subject = "I can't stop playing! Get it here";
    customInviteContent.text = 'Check out this app [APP_INVITE_URL]';
    customInviteContent.mediaAttachment = MediaAttachment.withImageUrl(
      'https://docs.getsocial.im/images/logo.png',
    );

    customInviteContent.linkParams = linkParams;
    console.log(customInviteContent);
    Invites.send(
      customInviteContent,
      channel,
      () => {
        console.log('Customized invitation via facebook was sent');
      },
      () => {
        console.log(`Customized invitation via ${channel} was cancelled`);
      },
      (error) => {
        console.log(
          `Customized invitation via ${channel} failed, error: `,
          error.message,
        );
        console.log(error);
        if (channel === 'whatsapp' || channel === 'viber') {
          Alert.alert(
            'Invitation failed',
            `Maybe you need to install ${capitalize(channel)} on your device.`,
          );
        } else {
          Alert.alert('Invitation failed', 'Something went wrong.');
        }
      },
    );
  };

  getRoomID = async (uid, lang) => {
    let list = [];
    let name = '';
    const currentUser = auth().currentUser;
    const room1 = uid + '_' + currentUser.uid + '_' + lang;
    const room2 = currentUser.uid + '_' + uid + '_' + lang;
    await firestore()
      .collection('messages')
      .get()
      .then((snapshot) => {
        if (!snapshot) {
          snapshot = {docs: []};
        }
        list = snapshot.docs.map((doc) => doc.id);
      });
    if (list.includes(room1)) {
      name = room1;
    } else if (list.includes(room2)) {
      name = room2;
    }

    return name;
  };

  invitePlayer = (newRoom, currentUser, player) => {
    const {language, type} = this.props.route.params;
    const {navigation} = this.props;
    firestore()
      .collection('messages')
      .doc(newRoom)
      .set({
        id: newRoom,
        language,
        type,
        created_at: new Date(),
        updated_at: new Date(),
        end_at: new Date(new Date().getTime() + 48 * 3600 * 1000),
        players: [
          {
            uid: currentUser.uid,
            full_name: currentUser.full_name,
            photoURL: currentUser.photoURL,
            status: 'Invited',
          },
          {
            uid: player.uid,
            full_name: player.full_name,
            photoURL: player.photoURL,
            status: 'Waiting',
          },
        ],
      })
      .then(() => {
        database().ref(`board/${newRoom}/tiles`).remove();
        database().ref(`board/${newRoom}/turnId`).remove();
        database().ref(`board/${newRoom}/score`).remove();

        Alert.alert(
          '',
          'Successfully invited your friend.',
          [{text: 'OK', onPress: () => navigation.navigate('Home')}],
          {cancelable: false},
        );
      });
  };

  inviteFriend = async () => {
    const {selectedFriend} = this.state;
    const {language} = this.props.route.params;
    if (selectedFriend) {
      const roomId = await this.getRoomID(selectedFriend.uid, language);
      const currentUser = (
        await firestore().collection('users').doc(auth().currentUser.uid).get()
      ).data();
      const newRoom =
        currentUser.uid + '_' + selectedFriend.uid + '_' + language;
      if (roomId) {
        Alert.alert('', 'You already have a match with this player.');
      } else {
        this.invitePlayer(newRoom, currentUser, selectedFriend);
      }
    }
  };

  inviteRandomUser = () => {
    firestore()
      .collection('messages')
      .get()
      .then((messageSnaphot) => {
        const messages = messageSnaphot.docs.map((msg) => msg.data());
        firestore()
          .collection('users')
          .get()
          .then(async (querySnapshot) => {
            const currentUser = (
              await firestore()
                .collection('users')
                .doc(auth().currentUser.uid)
                .get()
            ).data();
            const users = querySnapshot.docs
              .map((userDoc) => userDoc.data())
              .filter(
                (user) =>
                  user.uid !== currentUser.uid &&
                  messages.findIndex(
                    (msg) =>
                      msg.id === currentUser.uid + '_' + user.uid ||
                      msg.id === user.uid + '_' + currentUser.uid,
                  ) === -1,
              );
            if (!users.length) {
              Alert.alert('Error', 'There is no more user to invite');
              return;
            }
            console.log(users.length);
            const randomUser = users[getRandomInt(users.length)];
            const newRoom = currentUser.uid + '_' + randomUser.uid;
            this.invitePlayer(newRoom, currentUser, randomUser);
          });
      });
  };

  handleSearchFriend = (txt) => {
    console.log(txt);
    const user = auth().currentUser;
    const that = this;
    firestore()
      .collection('users')
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot) {
          querySnapshot = {docs: []};
        }
        const friends = querySnapshot.docs
          .map((item) => item.data())
          .filter((item) =>
            item.user_name.toLowerCase().includes(txt.toLowerCase()),
          );
        that.setState({
          friends: friends.filter((item) => item.uid !== user.uid),
          selectedFriend: friends.find(
            (item) =>
              that.state.selectedFriend &&
              item.uid === that.state.selectedFriend.uid,
          )
            ? that.state.selectedFriend
            : null,
        });
      });
  };

  handleChangeSearch = (txt) => {
    const that = this;
    if (this.timerID) {
      clearTimeout(this.timerID);
    }
    this.timerID = setTimeout(() => {
      that.timerID = null;
      that.handleSearchFriend(txt);
    }, 1000);
    this.setState({searchTxt: txt});
  };

  selectFriend = (ele) => {
    this.setState({selectedFriend: ele}, () => {
      this.inviteFriend();
    });
  };

  render() {
    const {inviteList, searchTxt, selectedFriend} = this.state;

    return (
      <ScreenContainer>
        <ScrollView
          contentContainerStyle={{paddingBottom: 40}}
          style={{flex: 1}}>
          <ImageBackground
            source={images.sessionInviteTop}
            resizeMode={'stretch'}
            style={styles.bg_image}>
            <Text style={styles.title}> {'Search For a MasterMIND'}</Text>
            <View style={styles.searchView}>
              <Icon
                name={'md-search-sharp'}
                size={20}
                color={theme.colors.grey1}
              />
              <TextInput
                style={styles.input}
                ref={this.searchRef}
                underlineColorAndroid="transparent"
                onChangeText={(txt) => this.handleChangeSearch(txt)}
                placeholder="Search"
              />
            </View>
          </ImageBackground>

          {searchTxt ? (
            <>
              <View style={{marginTop: 29}}>
                {this.state.friends.map((elem, i) => {
                  return (
                    <TouchableOpacity
                      style={{marginHorizontal: 30, marginBottom: 20}}
                      key={'user' + i.toString()}
                      onPress={() => this.selectFriend(elem)}>
                      <View
                        style={[
                          styles.box,
                          {
                            backgroundColor:
                              selectedFriend && elem.uid === selectedFriend.uid
                                ? theme.colors.orange1
                                : theme.colors.white,
                          },
                        ]}>
                        <Image
                          style={styles.image}
                          source={{uri: elem.photoURL}}
                        />
                        <View style={styles.info}>
                          <View>
                            <Text style={styles.name}>{elem.full_name}</Text>
                            <Text style={styles.userName}>
                              {elem.user_name}
                            </Text>
                            <Text style={styles.status}>{elem.status}</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity
                  onPress={() => {
                    this.inviteFriend();
                  }}
                  key="btn0"
                  style={styles.cardView}>
                  <Image source={images.inviteFriend} style={styles.card} />
                  <View
                    style={[
                      styles.iconBack,
                      {
                        backgroundColor: theme.colors.white,
                      },
                    ]}>
                    <Image source={images.girl} style={styles.cardIcon3} />
                  </View>
                  <Text style={styles.cardTitle}>
                    {'Invite your\nMasterMIND friend'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={{marginTop: 29}}>
                {inviteList.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        if (item.handler) {
                          item.handler();
                        }
                      }}
                      style={styles.cardView}
                      key={'btn' + index.toString()}>
                      <Image source={item.cardImage} style={styles.card} />
                      <View
                        style={[
                          styles.iconBack,
                          {
                            backgroundColor:
                              index !== 2 ? theme.colors.white : 'transparent',
                          },
                        ]}>
                        <Image
                          source={item.icon}
                          style={[
                            index === 2
                              ? styles.cardIcon1
                              : index === 0
                              ? styles.cardIcon3
                              : styles.cardIcon2,
                          ]}
                        />
                      </View>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity style={styles.playNow}>
                <Image source={images.playNow} style={styles.playNowImage} />
              </TouchableOpacity>
            </>
          )}
          <SocialMedia />
        </ScrollView>
      </ScreenContainer>
    );
  }
}

export default SessionInvitation;

const styles = StyleSheet.create({
  bg_image: {
    width: '100%',
    height: scale(210),
    paddingTop: scale(35),
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 38,
    marginTop: -32,
  },
  searchView: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: theme.colors.white,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '85%',
    marginTop: scale(30),
  },
  input: {
    width: '90%',
    marginLeft: 10,
    fontFamily: theme.fonts.redHatNormal,
    fontSize: 15,
    color: theme.colors.grey1,
  },
  cardView: {
    marginBottom: 20,
    width: theme.SCREENWIDTH - 70,
    alignSelf: 'center',
    height: 100,
    alignItems: 'center',
    paddingLeft: 30,
    flexDirection: 'row',
  },
  card: {
    position: 'absolute',
    height: 110,
    resizeMode: 'contain',
    left: 0,
    width: theme.SCREENWIDTH - 70,
  },
  iconBack: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon1: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  cardIcon2: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  cardIcon3: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 1,
    resizeMode: 'contain',
  },
  cardTitle: {
    marginLeft: 30,
    fontSize: 16,
    fontFamily: theme.fonts.redHatBold,
    color: theme.colors.white,
  },
  playNow: {
    alignSelf: 'center',
  },
  playNowImage: {
    height: 140,
    width: theme.SCREENWIDTH - 70,
    resizeMode: 'stretch',
  },
  title: {
    textAlign: 'center',
    fontSize: 19,
    color: theme.colors.white,
    fontFamily: theme.fonts.redHatBold,
    marginTop: 30,
  },
  image_circle: {
    marginTop: -80,
    marginLeft: 26,
    backgroundColor: 'white',
    borderRadius: 40,
    width: '18%',
    height: 65,
  },
  pay_now: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 5,
    marginTop: 15,
    width: '35%',
    marginLeft: 150,
    height: 40,
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 10,
    padding: 15,
    shadowColor: theme.colors.white,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    alignItems: 'center',
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  info: {
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    color: theme.colors.grey5,
    fontFamily: theme.fonts.redHatBold,
  },
  userName: {
    fontSize: 13,
    fontFamily: theme.fonts.redHatMedium,
    color: theme.colors.grey3,
    marginVertical: 3,
  },
  status: {
    fontFamily: theme.fonts.redHatMedium,
    fontSize: 13,
  },
});
