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
import {
  Header,
  ScreenContainer,
  SocialMedia,
  MenuModal,
} from '../../components';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {images, theme, scale} from '../../constants';
class SessionPlayed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
      currentUser: auth().currentUser,
      loading: true,
      itemToRender: 10,
      session_loading: true,
      user_name: 'you',
      menu_bar: false,
      session_list: [],
    };
  }

  componentDidMount() {
    this.getSessionsList();
  }

  getSessionsList = async () => {
    const user = auth().currentUser;
    const events = await firestore().collection('sessions');
    events.get().then((querySnapshot) => {
      const session_list = querySnapshot.docs
        .filter((item) => item.id !== user.uid)
        .map((doc) => {
          return {uid: doc.id, ...doc.data()};
        });
      this.setState({session_list});
    });
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

  getRoomID = async (user) => {
    let list = [];
    let name = '';
    const currentUser = auth().currentUser;
    const room1 = user.uid + '_' + currentUser.uid;
    const room2 = currentUser.uid + '_' + user.uid;
    await firestore()
      .collection('messages')
      .get()
      .then((snapshot) => {
        list = snapshot.docs.map((doc) => doc.id);
      });
    if (list.includes(room1)) {
      name = room1;
    } else if (list.includes(room2)) {
      name = room2;
    }

    return name;
  };

  selectList = async (user) => {
    const {navigation} = this.props;
    const {currentUser} = this.state;
    let roomId = await this.getRoomID(user);
    const newRoom = currentUser.uid + '_' + user.uid;

    if (!roomId) {
      await firestore().collection('messages').doc(newRoom).set({
        id: newRoom,
      });
      navigation.navigate('Versus', {...user, roomId: newRoom});
    } else {
      navigation.navigate('ActiveSession', {...user, roomId});
    }
  };

  render() {
    return (
      <ScreenContainer>
        <ImageBackground source={images.newGameBack} style={styles.bg_image}>
          <View style={styles.mainContainer}>
            <Header {...this.props} onMenubarHandle={this.handleMenu} />
            <ScrollView
              style={styles.container}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={theme.PB35}>
              {this.state.session_list.map((elem, i) => {
                return (
                  <TouchableOpacity
                    key={i.toString()}
                    onPress={() => this.selectList(elem)}>
                    <View style={styles.box}>
                      <Image
                        style={styles.image}
                        source={{uri: elem.photoURL}}
                      />
                      <View style={styles.info}>
                        <View>
                          <Text style={styles.title}>{elem.name}</Text>
                          <Text style={styles.session}>
                            Session: {elem.language}
                          </Text>
                          <Text
                            style={[
                              styles.status,
                              {
                                color:
                                  elem.status === 'YOUR MOVE'
                                    ? theme.colors.green
                                    : elem.status === 'PENDING'
                                    ? theme.colors.orange3
                                    : theme.colors.grey2,
                              },
                            ]}>
                            {elem.status}
                          </Text>
                        </View>
                        {elem.time && (
                          <Text
                            style={[
                              styles.title,
                              {
                                color: elem.time.includes('Left')
                                  ? theme.colors.orange4
                                  : elem.time.includes('Lost')
                                  ? theme.colors.red2
                                  : theme.colors.green,
                              },
                            ]}>
                            {elem.time}
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
              <SocialMedia textStyle={{color: theme.colors.white}} />
            </ScrollView>
          </View>
        </ImageBackground>
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

const styles = StyleSheet.create({
  bg_image: {
    width: '100%',
    height: '100%',
  },
  mainContainer: {
    flex: 1,
    marginTop: scale(35),
    marginHorizontal: scale(18),
  },
  container: {
    marginTop: 35,
    paddingHorizontal: scale(12),
  },
  box: {
    flex: 1,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
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
  title: {
    fontSize: 14,
    color: theme.colors.grey5,
    fontFamily: theme.fonts.redHatBold,
  },
  session: {
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

export default SessionPlayed;
