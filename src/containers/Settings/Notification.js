/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {Switch} from 'react-native-switch';
import auth from '@react-native-firebase/auth';
import {images, theme} from '../../constants';
import {ScreenContainer} from '../../components';
import firestore from '@react-native-firebase/firestore';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      push_message_flag: false,
      email_message_flag: false,
      push_move_flag: false,
      email_move_flag: false,
      uid: auth().currentUser.uid,
    };
  }

  componentDidMount() {
    const user = auth().currentUser;
    firestore()
      .collection('notifications')
      .doc(user.uid)
      .get()
      .then((res) => {
        const data = res.data();
        this.setState(data);
      });
  }

  onHandleSwitch = (key) => {
    const {uid} = this.state;

    const data = {[key]: !this.state[key]};
    this.setState(data);
    firestore().collection('notifications').doc(uid).update(data);
  };

  handleBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
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
        value={!this.state[key]}
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
          <Text style={[styles.title]}>Notifications</Text>
          <Text style={[styles.subText]}>
            Choose which notifications to recieve
          </Text>
        </View>
        <View style={{marginHorizontal: 35}}>
          <Text style={[styles.subTitle]}>Notify Private Messages</Text>
          <View style={[styles.cardcontainer]}>
            <View style={[styles.switchView]}>
              <Text style={[styles.label]}>Push Notification</Text>
              {this.renderSwitch('push_message_flag')}
            </View>
            <View style={styles.switchView}>
              <Text style={[styles.label]}>Email Notification</Text>
              {this.renderSwitch('email_message_flag')}
            </View>
          </View>

          <Text style={[styles.subTitle]}>Remind 5 hrs Before My Move</Text>
          <View style={[styles.cardcontainer]}>
            <View style={styles.switchView}>
              <Text style={[styles.label]}>Push Notification</Text>
              {this.renderSwitch('push_move_flag')}
            </View>
            <View style={styles.switchView}>
              <Text style={[styles.label]}>Email Notification</Text>
              {this.renderSwitch('email_move_flag')}
            </View>
          </View>
        </View>
      </ScreenContainer>
    );
  }
}

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
  subText: {
    color: theme.colors.grey3,
    fontSize: 15,
    marginTop: 15,
    fontFamily: theme.fonts.redHatMedium,
  },
  subTitle: {
    color: theme.colors.black1,
    fontSize: 18,
    marginTop: 30,
    fontFamily: theme.fonts.redHatExtraBold,
  },
  label: {
    color: theme.colors.grey3,
    fontSize: 16,
    fontFamily: theme.fonts.redHatNormal,
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
    marginTop: 14,
  },
  switchView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  switchInsideCircle: {
    width: 20,
    height: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
  },
});

const mapStateToProps = (state) => ({userData: state.AppReducer.userData});

export default connect(mapStateToProps)(Notification);
