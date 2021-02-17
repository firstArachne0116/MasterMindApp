import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {images, theme, scale} from '../../constants';
import {
  ScreenContainer,
  Header,
  MenuModal,
  SocialMedia,
  LoadingScreen,
} from '../../components';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Languages from '../../Helper/languages.json';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
      isLoadingScreen:
        this.props.route.params && this.props.route.params.isLoading
          ? false
          : true,
      currentUser: auth().currentUser,
      sessionList: [],
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    const user = auth().currentUser;

    setTimeout(() => {
      if (!user) {
        navigation.navigate('Welcome');
      }
    }, 1600);
    if (user) {
      this.getSessionsList();
      // this._unsubscribe = this.props.navigation.addListener('focus', () => {
      //   this.getSessionsList();
      // });
    }
  }

  // componentWillUnmount() {
  //   this._unsubscribe();
  // }

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

  getSessionsList = () => {
    const user = auth().currentUser;
    firestore()
      .collection('messages')
      .orderBy('updated_at', 'desc')
      .onSnapshot((querySnapshot) => {
        if (!querySnapshot) {
          querySnapshot = {docs: []};
        }
        const sessionList = querySnapshot.docs
          .filter(
            (item) =>
              item.id.startsWith(user.uid) || item.id.endsWith(user.uid),
          )
          .map((doc) => {
            return {uid: doc.id, ...doc.data()};
          });
        const now = new Date();
        const newSessionList = [];
        sessionList.map((room) => {
          if (room.end_at.toDate().getTime() >= now.getTime()) {
            newSessionList.push(room);
            return;
          }
          const player = room.players.find((pl) => pl.uid === user.uid);
          if (player) {
            switch (player.status.toUpperCase()) {
              case 'INVITED':
              case 'WAITING':
                firestore().collection('messages').doc(room.id).delete();
                break;
              case 'YOUR MOVE':
              case 'PENDING':
                // this.passOneTurn(room);
                break;
            }
          } else {
            firestore().collection('messages').doc(room.id).delete();
          }
        });
        this.setState({sessionList, isLoadingScreen: false});
      });
  };

  selectList = async (room) => {
    const {navigation} = this.props;
    const {currentUser} = this.state;

    const player = room.players.find((pl) => pl.uid !== currentUser.uid);
    const status = player.status.toUpperCase();

    console.log(status);

    if (status === 'INVITED') {
      navigation.navigate('Versus', room);
    } else if (status !== 'WAITING') {
      navigation.navigate('ActiveSession', {
        roomId: room.id,
        uid: player.uid,
        name: player.full_name,
        photoURL: player.photoURL,
        language: room.language,
        type: room.type,
      });
    }
  };

  _statusColor = (status) => {
    switch (status) {
      case 'YOUR MOVE':
        return theme.colors.green;
      case 'PENDING':
        return theme.colors.orange3;
      case 'INVITED':
        return theme.colors.orange2;
      default:
        return theme.colors.grey2;
    }
  };

  _timeColor = (elem) => {
    const end_at = elem.end_at.toDate();
    const now = new Date();
    const leftTime = end_at.getTime() - now.getTime();
    if (leftTime < 2 * 3600 * 1000) {
      return theme.colors.orange2;
    }
    return theme.colors.green;
  };

  _leftTime = (elem) => {
    const end_at = elem.end_at.toDate();
    const now = new Date();
    const leftTime = end_at.getTime() - now.getTime();
    const hrs = Math.floor(leftTime / 3600 / 1000);
    if (hrs) {
      return hrs + ' Hrs Left';
    }

    const mins = Math.floor((leftTime - hrs * 3600 * 1000) / 60 / 1000);
    if (mins) {
      return mins + ' Mins Left';
    }

    return 'Less than \na min left';
  };

  render() {
    const {navigation} = this.props;
    const {sessionList, isLoadingScreen} = this.state;
    const currentUser = auth().currentUser;

    if (isLoadingScreen) {
      return <LoadingScreen />;
    } else {
      return (
        <ScreenContainer>
          {sessionList.length ? (
            <ImageBackground
              source={images.newGameBack}
              style={styles.bg_image}>
              <View style={styles.mainContainer}>
                <Header {...this.props} onMenubarHandle={this.handleMenu} />
                <ScrollView
                  style={styles.container}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={theme.PB35}>
                  {this.state.sessionList.map((elem, i) => {
                    const player = elem.players.find(
                      (item) => item.uid !== currentUser.uid,
                    );
                    const language = Languages.find(
                      (lang) => lang.code === elem.language,
                    );
                    return (
                      <TouchableOpacity
                        key={i.toString()}
                        onPress={() => this.selectList(elem)}>
                        <View style={styles.box}>
                          <Image
                            style={styles.image}
                            source={{uri: player.photoURL}}
                          />
                          <View style={styles.info}>
                            <View>
                              <Text style={styles.title}>
                                {player.full_name}
                              </Text>
                              <Text style={styles.session}>
                                Session: {language ? language.name : ''}
                              </Text>
                              <Text
                                style={[
                                  styles.status,
                                  {
                                    color: this._statusColor(
                                      player.status.toUpperCase(),
                                    ),
                                  },
                                ]}>
                                {player.status.toUpperCase()}
                              </Text>
                            </View>
                            {elem.end_at && (
                              <Text
                                style={[
                                  styles.title,
                                  {color: this._timeColor(elem)},
                                ]}>
                                {this._leftTime(elem)}
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
          ) : (
            <ImageBackground
              source={images.newGameBack}
              style={styles.bg_image}>
              <View style={styles.container}>
                <Header {...this.props} onMenubarHandle={this.handleMenu} />
                <View style={styles.addView}>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      navigation.navigate('SelectGameType');
                    }}>
                    <Image source={images.add} style={styles.addImage} />
                  </TouchableOpacity>
                  <Text style={[styles.startGameText]}>
                    {'Start A new Game'}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          )}
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
}

export default Home;

const styles = StyleSheet.create({
  bg_image: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    marginTop: scale(35),
    marginHorizontal: scale(18),
  },
  addView: {
    alignItems: 'center',
    marginTop: theme.SCREENHEIGHT / 4,
  },
  addButton: {
    backgroundColor: theme.colors.white,
    borderRadius: scale(50),
    height: scale(100),
    width: scale(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImage: {
    tintColor: theme.colors.sky,
    width: scale(45),
    height: scale(45),
  },
  startGameText: {
    fontFamily: theme.fonts.redHatBold,
    marginTop: 20,
    fontSize: scale(20),
    color: theme.colors.white,
  },
  mainContainer: {
    flex: 1,
    marginTop: scale(35),
    marginHorizontal: scale(18),
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
