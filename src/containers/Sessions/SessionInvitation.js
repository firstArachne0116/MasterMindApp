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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {scale, theme, images} from '../../constants/index.js';
import {ScreenContainer, SocialMedia} from '../../components';

class SessionInvitation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user_id: 0,
      contacts: null,
      user_name: 'you',
      menu_bar: false,

      inviteList: [
        {
          title: 'Invite your\nMasterMIND friend',
          icon: images.girl,
          cardImage: images.inviteFriend,
        },
        {
          title: 'Invite your\nFacebook friend',
          icon: images.fbIcon,
          cardImage: images.fbFriend,
        },
        {
          title: 'Invite your\nWhatsApp friend',
          icon: images.whatsapp,
          cardImage: images.fbFriend,
        },
        {
          title: 'Invite your\nViber freinds',
          icon: images.viber,
          cardImage: images.viberFriend,
        },
        {
          title: 'Invite from\nyour contact list',
          icon: images.contactList,
          cardImage: images.viberFriend,
        },
        {
          title: 'Invite random\nMasterMIND user',
          icon: images.team,
          cardImage: images.inviteRandomUser,
        },
      ],
    };
  }

  render() {
    const {naviagtion} = this.props;
    const {inviteList} = this.state;

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
                underlineColorAndroid="transparent"
                //onChangeText={search}
                placeholder="Search"
              />
            </View>
          </ImageBackground>

          <View style={{marginTop: 29}}>
            {inviteList.map((item, index) => {
              return (
                <TouchableOpacity
                  style={styles.cardView}
                  key={index.toString()}>
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
});
