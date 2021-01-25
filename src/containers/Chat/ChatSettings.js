import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Switch} from 'react-native-switch';
import {theme, images, scale} from '../../constants';
import {ScreenContainer} from '../../components';

class ChatSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      //isSwitchOn:false,
      mutePlayer: false,
      blockPlayer: false,
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  onMutePlayer = (value) => {
    this.setState({mutePlayer: value});
    console.log('Switch 1 is: ' + value);
  };

  onBlockPlayer = (value) => {
    this.setState({blockPlayer: value});
    console.log('Switch 2 is: ' + value);
  };

  render() {
    const {navigation} = this.props;
    return (
      <ScreenContainer>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={images.goBack}
              style={{tintColor: theme.colors.sky}}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{'Chat Settings'}</Text>
          <View style={styles.box}>
            <Image source={images.mutePlayer} style={styles.image} />
            <View style={styles.rightSideView}>
              <View>
                <Text style={styles.playerTite}>{'Mute Player'}</Text>
                <Text style={styles.playerSubText}>
                  {'Hides chat from this player.'}
                </Text>
              </View>
              <Switch
                activeText={''}
                barHeight={22}
                inActiveText={''}
                circleSize={20}
                // switchLeftPx={0}
                // switchRightPx={3}
                backgroundActive={theme.colors.pink2}
                backgroundInactive={theme.colors.grey1}
                circleBorderWidth={0}
                renderInsideCircle={() => (
                  <View style={styles.switchInsideCircle} />
                )}
                switchWidthMultiplier={2.5}
                onValueChange={this.onMutePlayer}
                value={this.state.mutePlayer}
              />
            </View>
          </View>
          <View style={styles.box}>
            <Image source={images.blockPlayer} style={styles.image} />
            <View style={styles.rightSideView}>
              <View>
                <Text style={styles.playerTite}>{'Block Player'}</Text>
                <Text style={styles.playerSubText}>
                  {'Hides chat and blocks game\nrequests from this player.'}
                </Text>
              </View>
              <Switch
                activeText={''}
                barHeight={22}
                inActiveText={''}
                circleSize={20}
                backgroundActive={theme.colors.pink2}
                backgroundInactive={theme.colors.grey1}
                circleBorderWidth={0}
                renderInsideCircle={() => (
                  <View style={styles.switchInsideCircle} />
                )}
                onValueChange={this.onBlockPlayer}
                value={this.state.blockPlayer}
                switchWidthMultiplier={2.5}
              />
            </View>
          </View>

          <View style={styles.box}>
            <Image source={images.reportPlayer} style={styles.image} />
            <View style={styles.rightSideView}>
              <View>
                <Text style={styles.playerTite}>{'Report Player'}</Text>
                <Text style={styles.playerSubText}>
                  {'Report this player to'}
                  <Text style={styles.customerSupport}>
                    {'\nCustomer Support.'}
                  </Text>
                </Text>
              </View>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                locations={[0.1, 1]}
                colors={[theme.colors.orange1, theme.colors.orange2]}
                style={styles.gradient}>
                <TouchableOpacity
                  // onPress={()=>this.navigateToHomeScreen('WelcomeChat')}
                  style={styles.reportButton}>
                  <Text style={styles.report}>Report</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>

          <Text style={styles.important}>
            {
              'Important: To Prevent further interactions with this player, use the "BLOCK" option  above.'
            }
          </Text>

          <Text style={styles.globalSetting}>{'Global Settings'}</Text>
          <View style={styles.box}>
            <Image source={images.mutePlayer} style={styles.image} />
            <View style={styles.rightSideView}>
              <View>
                <Text style={styles.playerTite}>{'Mute Public Chat'}</Text>
                <Text style={styles.playerSubText}>
                  {
                    "Mutes chat for players that\naren't Friends, Favourites, or\nContacts."
                  }
                </Text>
              </View>
              <TouchableOpacity>
                <Image source={images.settingBlue} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }
}

export default ChatSettings;

const styles = StyleSheet.create({
  container: {
    padding: scale(30),
  },
  title: {
    textAlign: 'center',
    color: theme.colors.black1,
    fontFamily: theme.fonts.extraBold,
    fontSize: 24,
    marginTop: 11,
  },
  text: {
    color: 'white',
    fontSize: 14,
    marginLeft: 40,
  },
  box: {
    flexDirection: 'row',
    marginTop: 30,
  },
  image: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  rightSideView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 13,
  },
  playerTite: {
    color: theme.colors.black1,
    fontFamily: theme.fonts.extraBold,
    fontSize: 18,
  },
  playerSubText: {
    fontSize: 14,
    fontFamily: theme.fonts.redHatNormal,
    color: theme.colors.grey3,
    marginTop: 10,
    lineHeight: 21,
  },
  gradient: {
    borderRadius: 20,
  },
  customerSupport: {
    color: theme.colors.sky,
  },
  reportButton: {
    // backgroundColor: 'red',
    borderRadius: 20,
    height: 36,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  report: {
    fontFamily: theme.fonts.redHatBold,
    fontSize: 14,
    color: theme.colors.white,
  },
  important: {
    color: theme.colors.red1,
    fontFamily: theme.fonts.redHatMedium,
    fontSize: 12,
    marginTop: 10,
    marginLeft: 47,
  },
  globalSetting: {
    textAlign: 'center',
    fontSize: 20,
    color: theme.colors.black1,
    fontFamily: theme.fonts.redHatBold,
    marginTop: 40,
    backgroundColor: theme.colors.grey6,
    width: theme.SCREENWIDTH,
    marginLeft: -35,
    marginBottom: 10,
    paddingVertical: 12,
  },
  switchInsideCircle: {
    width: 20,
    height: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
  },
});
