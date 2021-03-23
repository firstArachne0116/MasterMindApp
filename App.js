import 'react-native-gesture-handler';
import * as React from 'react';
import {connect} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {setUserData} from './src/redux/actions';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {
  Welcome,
  Signup,
  Login,
  ForgetPassword,
  SessionInvitation,
  ChatConversion,
  ChatSettings,
  Versus,
  GlobalRankList,
  ProfileStatistics,
  ActiveSession,
  EditPassword,
  Notification,
  PrivacySetting,
  AccountSettings,
  Home,
  SelectGameType,
  SelectLanguage,
  BuyNow,
} from './src/containers';

import admob, {MaxAdContentRating} from '@react-native-firebase/admob';
import messaging from '@react-native-firebase/messaging';
import {Platform, TouchableWithoutFeedback} from 'react-native';

admob()
  .setRequestConfiguration({
    // Update all future requests suitable for parental guidance
    maxAdContentRating: MaxAdContentRating.PG,

    // Indicates that you want your content treated as child-directed for purposes of COPPA.
    tagForChildDirectedTreatment: true,

    // Indicates that you want the ad request to be handled in a
    // manner suitable for users under the age of consent.
    tagForUnderAgeOfConsent: true,
  })
  .then(() => {
    // Request config successfully set!
  });

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}
const Stack = createStackNavigator();

class App extends React.Component {
  navigationRef = React.createRef();

  constructor(props) {
    super(props);
  }

  newInvitation = (message) => {
    if (message.notification.title !== 'You are invited to a new game.') {
      return;
    }
    if (this.navigationRef && this.navigationRef.current) {
      const room = JSON.parse(message.data.room);
      this.navigationRef.current.navigate('Versus', room);
    } else {
      console.log('Naviation failed');
    }
  };

  componentDidMount() {
    const currentUser = auth().currentUser;
    if (Platform.OS === 'ios') {
      requestUserPermission();
    }

    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    const that = this;
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );

      that.newInvitation(remoteMessage);
    });

    messaging().onMessage((message) => {
      that.newInvitation(message);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          that.newInvitation(remoteMessage);
        }
      });
    if (currentUser) {
      firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get()
        .then((snapshot) => {
          const userData = snapshot.data();
          this.props.setUser(userData);
        })
        .catch((err) => {
          console.log('Error getting documents', err);
        });
    }
  }
  render() {
    const {AppReducer} = this.props;
    return (
      <NavigationContainer ref={this.navigationRef}>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="SelectGameType" component={SelectGameType} />
          <Stack.Screen name="SelectLanguage" component={SelectLanguage} />
          <Stack.Screen name="BuyNow" component={BuyNow} />
          <Stack.Screen
            name="SessionInvitation"
            component={SessionInvitation}
          />
          <Stack.Screen name="ChatConversion" component={ChatConversion} />
          <Stack.Screen name="ChatSettings" component={ChatSettings} />
          <Stack.Screen name="Versus" component={Versus} />
          <Stack.Screen name="GlobalRankList" component={GlobalRankList} />
          <Stack.Screen
            name="ProfileStatistics"
            component={ProfileStatistics}
            user={AppReducer.userData}
          />
          <Stack.Screen name="ActiveSession" component={ActiveSession} />
          <Stack.Screen name="EditPassword" component={EditPassword} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="PrivacySetting" component={PrivacySetting} />
          <Stack.Screen name="AccountSettings" component={AccountSettings} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  AppReducer: state.AppReducer,
});
const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (params) => dispatch(setUserData(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
