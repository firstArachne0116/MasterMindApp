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
} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {ScreenContainer, SocialMedia, LanguageModal} from '../../components';
import {images, theme} from '../../constants';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import languages from '../../Helper/languages.json';

class GlobalRankList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      langData: languages,
      selectedLang: {name: 'English (UK)', code: 'en', flag: '🇬🇧'},
      isLangModal: false,
      isWeekSelect: true,
      data: [],
    };
  }
  _unsubscribe = null;

  componentDidMount() {
    this.getGlobalRankList();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getGlobalRankList();
    });
  }

  componentWillUnmount() {
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }

  getGlobalRankList = async () => {
    firestore()
      .collection('users')
      .get()
      .then(async (snapshot) => {
        if (!snapshot) {
          snapshot = {docs: []};
        }
        const users = snapshot.docs
          // .filter((user) => user.data().uid !== currentUser.uid)
          .map(async (user) => {
            const userData = user.data();
            const now = new Date();
            const scores = (
              await firestore()
                .collection('users')
                .doc(userData.uid)
                .collection('score')
                .get()
            ).docs
              .map((scoreSnap) => scoreSnap.data())
              .filter((score) => {
                if (
                  score.language !== this.state.selectedLang.code ||
                  score.type === 'unsigned' ||
                  (this.state.isWeekSelect &&
                    now.getTime() - score.date.toDate().getTime() >
                      7 * 24 * 3600 * 1000)
                ) {
                  return false;
                }
                return true;
              });
            const sessions = (
              await firestore()
                .collection('messages')
                .where('id', 'in', [
                  userData.uid +
                    '_' +
                    auth().currentUser.uid +
                    '_' +
                    this.state.selectedLang.code,
                  auth().currentUser.uid +
                    '_' +
                    userData.uid +
                    '_' +
                    this.state.selectedLang.code,
                ])
                .get()
            ).docs.length;
            const firstName = userData.full_name.split(' ')[0];
            const lastName = userData.full_name.split(' ')[1];
            return {
              uid: userData.uid,
              icon: userData.photoURL,
              name:
                userData.full_name.length > 13
                  ? (firstName + (lastName ? ' ' + lastName[0] : '')).slice(
                      0,
                      13,
                    )
                  : userData.full_name,
              w: scores.filter((score) => score.win === 1).length,
              L: scores.filter((score) => score.win === -1).length,
              score: scores.reduce((a, b) => a + b.score, 0),
              cross: false,
              sessions,
            };
          });
        for (let i = 0; i < users.length; i++) {
          users[i] = await users[i];
        }
        users.sort((a, b) => {
          if (a.score < b.score) {
            return 1;
          }
          if (a.score > b.score) {
            return -1;
          }
          return 0;
        });
        const scoreLimits = [1000, 5000, 10000, 20000, 35000, 65000];
        const levels = [
          'JumpingSheep',
          'RunningChicken',
          'FightCoala',
          'FastFingerDog',
          'BadAssMonkey',
          'TigerGangClan',
          'MasterBrain',
        ];
        this.setState({
          data: users
            .map((user, id) => ({
              ...user,
              status: levels[scoreLimits.findIndex((li) => li > user.score)],
              id: id + 1,
            }))
            .slice(0, 100),
        });
      });
  };

  handleLangModal = () => {
    this.setState({
      isLangModal: !this.state.isLangModal,
    });
  };

  handleLang = (lang) => {
    this.setState(
      {
        isLangModal: false,
        selectedLang: lang,
      },
      () => {
        this.getGlobalRankList();
      },
    );
  };

  render() {
    const {navigation} = this.props;
    const {isWeekSelect, selectedLang, data} = this.state;
    return (
      <ScreenContainer>
        <ScrollView
          style={styles.user_data}
          contentContainerStyle={{paddingBottom: 30}}>
          <ImageBackground
            source={images.globalRankBack}
            style={styles.bg_image}
            resizeMode="stretch">
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Image source={images.goBack} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.handleLangModal}
                style={styles.langView}>
                {/* <Image source={selectedLang} style={styles.langImage} /> */}
                <Text>{selectedLang.flag}</Text>
                <Icon
                  name="chevron-down"
                  size={20}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>{'Global Rank List'}</Text>
            <View style={styles.optionButtonView}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({isWeekSelect: true});
                  this.getGlobalRankList();
                }}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isWeekSelect
                      ? theme.colors.sky
                      : 'transparent',
                  },
                ]}>
                <Text style={[styles.optionButtonText]}>{'This Week'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: !isWeekSelect
                      ? theme.colors.sky
                      : 'transparent',
                  },
                ]}
                onPress={() => {
                  this.setState({isWeekSelect: false});
                  this.getGlobalRankList();
                }}>
                <Text style={styles.optionButtonText}>{'All Time'}</Text>
              </TouchableOpacity>
            </View>
            {!!data[0] && (
              <View style={{alignItems: 'center', marginTop: 8}}>
                <View style={[styles.avtarViewStyle, styles.avtarView]}>
                  <Image style={styles.avatar} source={{uri: data[0].icon}} />
                </View>
                <Text style={styles.name}>{data[0].name}</Text>
                <Text style={styles.subText}>{data[0].status}</Text>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  colors={[theme.colors.orange5, theme.colors.orange6]}
                  style={styles.gradient}>
                  <FontAwesome
                    name="star"
                    color={theme.colors.white}
                    size={12}
                  />
                  <Text style={styles.topScore}>{data[0].score}</Text>
                </LinearGradient>
              </View>
            )}

            <View style={styles.rank23View}>
              {!!data[1] && (
                <View style={{marginLeft: 5}}>
                  <View style={[styles.avtarViewStyle, styles.avtarView1]}>
                    <Image
                      style={styles.avatar1}
                      source={{uri: data[1].icon}}
                    />
                  </View>
                  <Text style={styles.name}>{data[1].name}</Text>
                  <Text style={styles.subText}>{data[1].status}</Text>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    colors={[theme.colors.orange5, theme.colors.orange6]}
                    style={styles.gradient}>
                    <FontAwesome
                      name="star"
                      color={theme.colors.white}
                      size={12}
                    />
                    <Text style={styles.topScore}>{data[1].score}</Text>
                  </LinearGradient>
                </View>
              )}

              {!!data[2] && (
                <View style={{marginTop: 18}}>
                  <View style={[styles.avtarViewStyle, styles.avtarView1]}>
                    <Image
                      style={styles.avatar1}
                      source={{uri: data[2].icon}}
                    />
                  </View>
                  <Text style={styles.name}>{data[2].name}</Text>
                  <Text style={styles.subText}>{data[2].status}</Text>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    colors={[theme.colors.orange5, theme.colors.orange6]}
                    style={styles.gradient}>
                    <FontAwesome
                      name="star"
                      color={theme.colors.white}
                      size={12}
                    />
                    <Text style={styles.topScore}>{data[2].score}</Text>
                  </LinearGradient>
                </View>
              )}
            </View>
          </ImageBackground>

          <View style={styles.listView}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.listHeader, {width: '8%'}]}>#</Text>
              <Text style={[styles.listHeader, {width: '45%'}]}>User</Text>
              <Text style={[styles.listHeader, {width: '10%'}]}>W</Text>
              <Text style={[styles.listHeader, {width: '10%'}]}>L</Text>
              <Text style={[styles.listHeader, {width: '18%'}]}>Score</Text>
              <Text
                style={[
                  styles.listHeader,
                  {width: '10%', textAlign: 'center', paddingRight: '2%'},
                ]}>
                C
              </Text>
            </View>

            {data.map((elem, i) => {
              return (
                <View key={i.toString()} style={styles.notificationBox}>
                  <Text style={[styles.id, {width: '8%'}]}>{elem.id}</Text>
                  <View style={styles.profileView}>
                    <Image style={[styles.image]} source={{uri: elem.icon}} />
                    <View style={{marginLeft: 9}}>
                      <Text style={[styles.id]}>{elem.name}</Text>
                      <Text style={styles.statusSubText}>{elem.status}</Text>
                    </View>
                  </View>
                  <Text style={[styles.score, {width: '10%'}]}>{elem.w}</Text>
                  <Text style={[styles.score, {width: '10%'}]}>{elem.L}</Text>
                  <View style={[styles.profileView, {width: '18%'}]}>
                    <Image style={{marginRight: 3}} source={images.star} />
                    <Text style={[styles.score]}>{elem.score}</Text>
                  </View>
                  {elem.uid !== auth().currentUser.uid &&
                    (elem.sessions ? (
                      <View style={styles.rightCross}>
                        <Image
                          style={[styles.crossImage]}
                          source={images.rightCross}
                        />
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.wrongCross}
                        onPress={() => {
                          console.log('to SelectGameType', {
                            uid: elem.uid,
                            name: elem.name,
                          });
                          navigation.navigate('SelectGameType', {
                            player: {
                              uid: elem.uid,
                              name: elem.name,
                              language: selectedLang.code,
                            },
                          });
                        }}>
                        <Image
                          style={[styles.crossImage]}
                          source={images.wrongCross}
                        />
                      </TouchableOpacity>
                    ))}
                </View>
              );
            })}
          </View>
          <SocialMedia />
        </ScrollView>
        <LanguageModal
          {...this.state}
          {...this.props}
          handleLangModal={this.handleLangModal}
          onPress={this.handleLang}
        />
      </ScreenContainer>
    );
  }
}

export default GlobalRankList;

const styles = StyleSheet.create({
  bg_image: {
    width: theme.SCREENWIDTH,
    height: 540,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 35,
    marginTop: 30,
  },
  langView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.white,
    padding: 5,
  },
  langImage: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  title: {
    color: theme.colors.white,
    fontFamily: theme.fonts.extraBold,
    textAlign: 'center',
    marginTop: 7,
    fontSize: 24,
  },
  optionButtonView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 16,
  },
  optionButton: {
    backgroundColor: theme.colors.sky,
    width: theme.SCREENWIDTH / 3,
    marginHorizontal: 7,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 20,
  },
  optionButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.redHatMedium,
    fontSize: 15,
  },
  avtarView: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avtarView1: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  avtarViewStyle: {
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.white,
    backgroundColor: theme.colors.white,
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 3,
    borderColor: theme.colors.pink2,
  },
  name: {
    color: theme.colors.white,
    fontSize: 15,
    fontFamily: theme.fonts.extraBold,
    marginTop: 3,
    textAlign: 'center',
  },
  subText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.redHatMedium,
    fontSize: 12,
    marginVertical: 3,
    textAlign: 'center',
  },
  gradient: {
    flexDirection: 'row',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    width: 80,
  },
  topScore: {
    color: theme.colors.white,
    fontSize: 12,
    fontFamily: theme.fonts.redHatNormal,
    marginLeft: 5,
  },
  rank23View: {
    flexDirection: 'row',
    marginHorizontal: 37,
    justifyContent: 'space-between',
    marginTop: -80,
  },
  listView: {
    backgroundColor: theme.colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginHorizontal: 20,
    marginTop: -55,
    borderRadius: 13,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  listHeader: {
    fontFamily: theme.fonts.redHatBold,
    color: theme.colors.orange3,
    fontSize: 14,
  },
  avatar1: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: theme.colors.pink2,
  },
  notificationList: {
    marginTop: -10,
    padding: 10,
  },
  notificationBox: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  id: {
    fontSize: 13,
    fontFamily: theme.fonts.redHatBold,
    color: theme.colors.black1,
  },
  profileView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
  },
  statusSubText: {
    fontSize: 12,
    fontFamily: theme.fonts.redHatMedium,
    color: theme.colors.grey5,
  },
  score: {
    fontSize: 12,
    fontFamily: theme.fonts.redHatMedium,
    color: theme.colors.grey3,
  },
  rightCross: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: theme.colors.orange3,
  },
  wrongCross: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.orange3,
  },
  crossImage: {
    width: 18,
    height: 18,
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});
