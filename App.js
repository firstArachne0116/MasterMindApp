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
  NewGame,
  SessionInvitation,
  ChatConversion,
  ChatSettings,
  SessionPlayed,
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

const Stack = createStackNavigator();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
    };
  }

  componentDidMount() {
    const currentUser = auth().currentUser;

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
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
          <Stack.Screen name="NewGame" component={NewGame} />
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
          <Stack.Screen name="SessionPlayed" component={SessionPlayed} />
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
