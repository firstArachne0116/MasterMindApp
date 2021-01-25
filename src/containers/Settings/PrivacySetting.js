import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import RadioForm, {RadioButton} from 'react-native-simple-radio-button';
import auth from '@react-native-firebase/auth';
import {Switch} from 'react-native-switch';
import {images, theme} from '../../constants';
import {ScreenContainer} from '../../components';
import firestore from '@react-native-firebase/firestore';

class PrivacySetting extends Component {
  constructor(props) {
    super(props);
    this.radio_props = [
      {label: 'Public', value: 0},
      {label: 'Private', value: 1},
    ];
    this.state = {
      find_via_email: false,
      find_via_username: false,
      enable_chat: false,
      value: 0,
      currentUID: auth().currentUser.uid,
      privacyData: [],
    };
  }

  async componentDidMount() {
    await firestore()
      .collection('privacies')
      .doc(this.state.currentUID)
      .get()
      .then((res) => {
        const data = res._data;
        this.setState({
          find_via_email: data.find_via_email,
          find_via_username: data.find_via_username,
          value: data.public_statistics,
          enable_chat: data.enable_chat,
        });
      });
  }

  handleBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  onHandleSwitch = (key) => {
    const data = {[key]: !this.state[key]};
    this.setState(data);
    firestore().collection('privacies').doc(this.state.currentUID).update(data);
  };

  handleRadio = (value) => {
    this.setState({value});
    const data = {public_statistics: value};
    firestore().collection('privacies').doc(this.state.currentUID).update(data);
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

  render() {
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <TouchableOpacity onPress={this.handleBack}>
            <Image
              source={images.goBack}
              style={{tintColor: theme.colors.sky}}
            />
          </TouchableOpacity>
          <Text style={[styles.title]}>Privacy Settings</Text>
          <Text style={[styles.text]}>Set your privacy settings</Text>
        </View>
        <View style={styles.container}>
          <Text style={[styles.subTitle]}>Find me via</Text>
          <View style={[styles.cardcontainer]}>
            <View style={styles.switchView}>
              <Text style={[styles.label]}>Email Id</Text>
              {this.renderSwitch('find_via_email')}
            </View>
            <View style={styles.switchView}>
              <Text style={[styles.label]}>Username</Text>
              {this.renderSwitch('find_via_username')}
            </View>
          </View>

          <Text style={[styles.subTitle]}>Statistics</Text>
          <View style={[styles.cardcontainer]}>
            <View style={{marginVertical: 10}}>
              <RadioForm formHorizontal={true}>
                {this.radio_props.map((obj, i) => {
                  var is_selected = this.state.value == i;
                  return (
                    <View key={i} style={styles.radioButtonWrap}>
                      <RadioButton
                        isSelected={is_selected}
                        obj={obj}
                        index={i}
                        buttonColor={theme.colors.sky}
                        buttonSize={11}
                        buttonOuterSize={23}
                        labelStyle={[styles.label]}
                        style={[
                          i !== this.radio_props.length - 1 &&
                            styles.radioStyle,
                        ]}
                        onPress={(value) => this.handleRadio(value)}
                      />
                    </View>
                  );
                })}
              </RadioForm>
            </View>
          </View>

          <Text style={[styles.subTitle]}>Chat Possibility</Text>
          <View style={[styles.cardcontainer]}>
            <View style={styles.switchView}>
              <Text style={[styles.label]}>Disable Chat</Text>
              {this.renderSwitch('enable_chat')}
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }
}

export default PrivacySetting;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginHorizontal: 35,
  },
  title: {
    color: theme.colors.black1,
    fontSize: 24,
    marginTop: 19,
    fontFamily: theme.fonts.extraBold,
  },
  subTitle: {
    color: theme.colors.black1,
    fontSize: 18,
    marginTop: 30,
    fontFamily: theme.fonts.extraBold,
  },
  text: {
    color: theme.colors.grey3,
    fontSize: 16,
    marginTop: 15,
    fontFamily: theme.fonts.redHatMedium,
  },
  label: {
    color: theme.colors.black1,
    fontSize: 16,
    fontFamily: theme.fonts.redHatBold,
  },
  cardcontainer: {
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
  },
  switchView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioButtonWrap: {
    marginRight: 5,
  },
  radioStyle: {
    paddingRight: 25,
  },
});
