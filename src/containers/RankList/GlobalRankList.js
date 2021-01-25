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

class GlobalRankList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      langData: [
        {name: 'Bulgarian', flag: images.uk},
        {name: 'Croatian', flag: images.bulgaria},
        {name: 'English (UK)', flag: images.uk},
        {name: 'Finish', flag: images.bulgaria},
        {name: 'French', flag: images.uk},
        {name: 'Bulgarian', flag: images.bulgaria},
        {name: 'Croatian', flag: images.bulgaria},
        {name: 'English (UK)', flag: images.uk},
        {name: 'Finish', flag: images.bulgaria},
        {name: 'French', flag: images.uk},
      ],
      selectedLang: images.uk,
      isLangModal: false,
      itemToRender: 10,
      isWeekSelect: true,
      data: [
        {
          id: 1,
          icon: 'https://bootdey.com/img/Content/avatar/avatar1.png',
          name: 'Cornell',
          status: 'Fast Finger Dog',
          w: '65',
          L: '20',
          socre: '74,855',
          cross: 'right',
        },
        {
          id: 2,
          icon: 'https://bootdey.com/img/Content/avatar/avatar2.png',
          name: 'Adam',
          status: 'Fast Finger Dog',
          w: '62',
          L: '18',
          socre: '72,254',
          cross: 'wrong',
        },
        {
          id: 3,
          icon: 'https://bootdey.com/img/Content/avatar/avatar3.png',
          name: 'Pete Ho',
          status: 'Fast Finger Dog',
          w: '60',
          L: '15',
          socre: '71,957',
          cross: 'wrong',
        },
        {
          id: 4,
          icon: 'https://bootdey.com/img/Content/avatar/avatar4.png',
          name: 'Sherita',
          status: 'Fast Finger Dog',
          w: '58',
          L: '09',
          socre: '70,955',
          cross: 'wrong',
        },
        {
          id: 5,
          icon: 'https://bootdey.com/img/Content/avatar/avatar3.png',
          name: 'Pete Ho',
          status: 'Fast Finger Dog',
          w: '60',
          L: '15',
          socre: '71,957',
          cross: 'wrong',
        },
        {
          id: 6,
          icon: 'https://bootdey.com/img/Content/avatar/avatar4.png',
          name: 'Sherita',
          status: 'Fast Finger Dog',
          w: '58',
          L: '09',
          socre: '70,955',
          cross: 'wrong',
        },
      ],
    };
  }

  handleLangModal = () => {
    this.setState({
      isLangModal: !this.state.isLangModal,
    });
  };

  handleLang = (flag) => {
    this.setState({
      isLangModal: false,
      selectedLang: flag,
    });
  };

  render() {
    const {navigation} = this.props;
    const {isWeekSelect, selectedLang} = this.state;
    return (
      <ScreenContainer>
        <ScrollView
          style={styles.user_data}
          contentContainerStyle={{paddingBottom: 30}}
          //   contentContainerStyle={{paddingBottom: 70}}
          //   onMomentumScrollEnd={(e) => {
          //     const scrollPosition = e.nativeEvent.contentOffset.y;
          //     const scrolViewHeight = e.nativeEvent.layoutMeasurement.height;
          //     const contentHeight = e.nativeEvent.contentSize.height;
          //     const isScrolledToBottom = scrolViewHeight + scrollPosition;
          //     // check if scrollView is scrolled to bottom and limit itemToRender to data length
          //     if (
          //       isScrolledToBottom >= contentHeight - 50 &&
          //       this.state.itemToRender <= this.state.data.length
          //     ) {
          //       this.setState({itemToRender: this.state.itemToRender + 10});
          //     }
          //         }}
        >
          <ImageBackground
            source={images.globalRankBack}
            style={styles.bg_image}
            resizeMode="stretch">
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={images.goBack} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.handleLangModal}
                style={styles.langView}>
                <Image source={selectedLang} style={styles.langImage} />
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
                onPress={() => this.setState({isWeekSelect: true})}
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
                onPress={() => this.setState({isWeekSelect: false})}>
                <Text style={styles.optionButtonText}>{'All Time'}</Text>
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center', marginTop: 8}}>
              <View style={[styles.avtarViewStyle, styles.avtarView]}>
                <Image style={styles.avatar} source={images.image1} />
              </View>
              <Text style={styles.name}>{'Leia Rangel'}</Text>
              <Text style={styles.subText}>{'MasterMIND'}</Text>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                colors={[theme.colors.orange5, theme.colors.orange6]}
                style={styles.gradient}>
                <FontAwesome name="star" color={theme.colors.white} size={12} />
                <Text style={styles.topScore}>{'84,855'}</Text>
              </LinearGradient>
            </View>

            <View style={styles.rank23View}>
              <View style={{marginLeft: 5}}>
                <View style={[styles.avtarViewStyle, styles.avtarView1]}>
                  <Image style={styles.avatar1} source={images.image5} />
                </View>
                <Text style={styles.name}>{'Monty David'}</Text>
                <Text style={styles.subText}>{'Tiger Gang Clan'}</Text>
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
                  <Text style={styles.topScore}>{'84,855'}</Text>
                </LinearGradient>
              </View>

              <View style={{marginTop: 18}}>
                <View style={[styles.avtarViewStyle, styles.avtarView1]}>
                  <Image style={styles.avatar1} source={images.image4} />
                </View>
                <Text style={styles.name}>{'Mabelle Dean'}</Text>
                <Text style={styles.subText}>{'Bad Ass Monkey'}</Text>
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
                  <Text style={styles.topScore}>{'80,855'}</Text>
                </LinearGradient>
              </View>
            </View>
          </ImageBackground>

          <View style={styles.listView}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.listHeader, {width: '8%'}]}>#</Text>
              <Text style={[styles.listHeader, {width: '45%'}]}>User</Text>
              <Text style={[styles.listHeader, {width: '10%'}]}>W</Text>
              <Text style={[styles.listHeader, {width: '10%'}]}>L</Text>
              <Text style={[styles.listHeader, {width: '18%'}]}>Score</Text>
              <Text style={[styles.listHeader, {width: '10%'}]}>C</Text>
            </View>

            {this.state.data.map((elem, i) => {
              //   if (i + 1 <= this.state.itemToRender) {
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
                  <Text style={[styles.socre, {width: '10%'}]}>{elem.w}</Text>
                  <Text style={[styles.socre, {width: '10%'}]}>{elem.L}</Text>
                  <View style={[styles.profileView, {width: '18%'}]}>
                    <Image style={{marginRight: 3}} source={images.star} />
                    <Text style={[styles.socre]}>{elem.socre}</Text>
                  </View>
                  <View
                    style={
                      elem.cross === 'right'
                        ? styles.rightCross
                        : styles.wrongCross
                    }>
                    <Image
                      style={[styles.crossImage]}
                      source={
                        elem.cross === 'right'
                          ? images.rightCross
                          : images.wrongCross
                      }
                    />
                  </View>
                </View>
              );
              //   }
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
  },
  subText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.redHatMedium,
    fontSize: 12,
    marginVertical: 3,
  },
  gradient: {
    flexDirection: 'row',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
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
  socre: {
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
