import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
} from 'react-native';
import {XAxis, YAxis, BarChart, LineChart} from 'react-native-svg-charts';
import {Circle, Defs, LinearGradient, Stop, G, Line} from 'react-native-svg';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {scale, theme, images} from '../../constants';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  ProfileCard,
  Header,
  ScreenContainer,
  SocialMedia,
  MenuModal,
} from '../../components';
import Moment from 'moment';
import {setUserData} from '../../redux/actions';

const Gradient = () => (
  <Defs>
    <LinearGradient id={'gradient'} x1={'0%'} y={'100%'} x2={'0%'} y2={'100%'}>
      <Stop offset={'0%'} stopColor={'#48e2ba'} />
      <Stop offset={'100%'} stopColor={'#139b78'} />
    </LinearGradient>
    <LinearGradient id={'gradient1'} x1={'0%'} y={'100%'} x2={'0%'} y2={'100%'}>
      <Stop offset={'0%'} stopColor={'#fdb100'} />
      <Stop offset={'100%'} stopColor={'#f75b00'} />
    </LinearGradient>
    <LinearGradient id={'gradient2'} x1={'0%'} y={'100%'} x2={'0%'} y2={'100%'}>
      <Stop offset={'0%'} stopColor={'#ff3a3a'} />
      <Stop offset={'100%'} stopColor={'#ff3d00'} />
    </LinearGradient>
  </Defs>
);

const Decorator = ({x, y, data}) => {
  return data.map((value, index) => (
    <Circle
      key={index}
      cx={x(index)}
      cy={y(value)}
      r={4}
      stroke={'#747474'}
      fill={'white'}
    />
  ));
};

const DecoratorFill = ({x, y, data}) => {
  return data.map((value, index) => (
    <Circle
      key={index}
      cx={x(index)}
      cy={y(value)}
      r={4}
      stroke={theme.colors.yellow3}
      fill={theme.colors.yellow3}
    />
  ));
};

const CustomGrid = ({x, y, data, ticks}) => {
  const newTicks = [10, 1000, 2000, 3000, 4000, 5000];
  return (
    <G>
      {
        // Horizontal grid
        newTicks.map((tick) => {
          return (
            <Line
              key={tick}
              x1={'0%'}
              x2={'100%'}
              y1={y(tick)}
              y2={y(tick)}
              stroke={theme.colors.grey7}
            />
          );
        })
      }
    </G>
  );
};

class ProfileStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
      userData: null,
    };
  }

  componentDidMount() {
    this.initState();
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    const {userData} = this.props;

    if (userData !== nextProps.userData) {
      this.updateUserData(nextProps.userData);
    }
  }

  initState = async () => {
    const user = await auth().currentUser;
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then((snapshot) => {
        const userData = snapshot.data();
        this.props.setUser(userData);
        this.setState({user, userData});
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });
  };

  updateUserData = (userData) => {
    this.setState({...this.state.userData, userData});
  };

  renderHeading = (title) => <Text style={styles.heading}>{title}</Text>;

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

  render() {
    const data1 = [1000, 3000, 2000, 5000, 1000, 2000];
    const data2 = [10, 500, 600, 1000, 3000, 2200];

    const xAxisData = [
      {title: 'S'},
      {title: 'M'},
      {title: 'T'},
      {title: 'W'},
      {title: 'T'},
      {title: 'F'},
    ];
    const weeklyData = [
      {
        value: 10,
        svg: {
          fill: 'url(#gradient)',
        },
      },
      {
        value: 6,
        svg: {
          fill: 'url(#gradient1)',
        },
      },
      {
        value: 4,
        svg: {
          fill: 'url(#gradient2)',
        },
      },
    ];
    const axesSvg = {fontSize: 14, fill: theme.colors.grey3};
    const verticalContentInset = {top: 10, bottom: 10};
    const xAxisHeight = 30;

    const {user, userData} = this.state;

    if (userData && user) {
      return (
        <ScreenContainer>
          <ScrollView contentContainerStyle={{paddingBottom: 40}}>
            <ImageBackground
              source={images.profileBack}
              resizeMode={'stretch'}
              style={styles.bg_image}>
              <View style={{marginLeft: 30}}>
                <Header {...this.props} onMenubarHandle={this.handleMenu} />
              </View>
              <View style={{marginTop: 25}}>
                <View style={styles.profileView}>
                  <Image
                    source={
                      user.photoURL ? {uri: user.photoURL} : images.image1
                    }
                    style={styles.profile}
                  />
                </View>
                <Text style={styles.name}>{userData.full_name}</Text>
                <Text style={styles.status}>{userData.status}</Text>
                <View style={styles.timeView}>
                  <View style={styles.direction}>
                    <MaterialCommunityIcons
                      name="calendar-month"
                      size={20}
                      color={theme.colors.white}
                    />
                    <Text style={styles.time}>
                      Joined {Moment(Date(userData.created_at)).format('MMM Y')}
                    </Text>
                  </View>
                  <View style={styles.direction}>
                    <Icon
                      name="emotsmile"
                      size={18}
                      color={theme.colors.white}
                    />
                    <Text style={styles.time}>{'Top of the world'}</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>

            <View style={styles.bottomContainer}>
              <View style={styles.oppHeader}>
                <Image source={images.addUser} />
                <Image source={images.play} />
                <Image source={images.userBlock} />
              </View>
              {this.renderHeading('Your Score')}
              <View style={[styles.chartContainer, styles.shadow]}>
                <View
                  style={[styles.direction, {justifyContent: 'space-between'}]}>
                  <Text style={styles.totalScore}>{'Total score'}</Text>
                  <View style={[styles.direction, {alignItems: 'center'}]}>
                    <Image
                      source={images.star}
                      style={{width: 16, height: 16, marginRight: 6}}
                    />
                    <Text style={styles.totalScore}>{'4,520'}</Text>
                  </View>
                </View>
                <View style={styles.lineChartView}>
                  <YAxis
                    data={[0, 1000, 2000, 3000, 4000, 5000]}
                    numberOfTicks={6}
                    style={{marginBottom: xAxisHeight}}
                    contentInset={verticalContentInset}
                    formatLabel={(value, index) =>
                      index === 0 ? 10 : `${index}k`
                    }
                    svg={axesSvg}
                  />
                  <View style={{flex: 1}}>
                    <LineChart
                      style={{flex: 1, marginLeft: 10}}
                      data={data1}
                      contentInset={{top: 10, bottom: 10, left: 10, right: 10}}
                      gridMax={6}
                      gridMin={0}
                      svg={{stroke: theme.colors.grey1}}>
                      {/* <Grid  /> */}
                      <CustomGrid belowChart={true} />
                      <Decorator />
                    </LineChart>
                    <LineChart
                      style={[StyleSheet.absoluteFill, {marginLeft: 10}]}
                      gridMax={6}
                      gridMin={0}
                      data={data2}
                      contentInset={{
                        top: 10,
                        bottom: 10 + xAxisHeight,
                        left: 10,
                        right: 10,
                      }}
                      svg={{stroke: theme.colors.yellow3}}>
                      <DecoratorFill />
                    </LineChart>
                    <XAxis
                      style={{
                        marginHorizontal: -10,
                        height: xAxisHeight,
                      }}
                      data={xAxisData}
                      formatLabel={(value, index) => xAxisData[index].title}
                      contentInset={{left: 25, right: 15}}
                      svg={axesSvg}
                    />
                  </View>
                </View>
              </View>
              {this.renderHeading('Weekly Statistics')}
              <View style={[styles.chartContainer, styles.shadow]}>
                <View style={[styles.barChartDataView, {marginTop: 0}]}>
                  <Text style={styles.barchartHeader}>{'Won'}</Text>
                  <Text
                    style={[
                      styles.barchartHeader,
                      {color: theme.colors.orange3},
                    ]}>
                    {'Withdraw'}
                  </Text>
                  <Text
                    style={[styles.barchartHeader, {color: theme.colors.red3}]}>
                    {'Lost'}
                  </Text>
                </View>
                <BarChart
                  style={{height: 200}}
                  data={weeklyData}
                  gridMin={0}
                  yAccessor={({item}) => item.value}
                  spacingInner={0.3}
                  spacingOuter={0.3}
                  contentInset={{top: 20}}>
                  <Gradient />
                </BarChart>
                <View style={styles.barChartLine} />
                <View style={styles.barChartDataView}>
                  <Text style={styles.barchartBottom}>{'10'}</Text>
                  <Text style={[styles.barchartBottom]}>{'06'}</Text>
                  <Text style={[styles.barchartBottom]}>{'05'}</Text>
                </View>
              </View>
              <View style={styles.scoreView}>
                {[1, 2].map((d, i) => {
                  return (
                    <View
                      key={i.toString()}
                      style={[styles.scoreContainer, styles.shadow]}>
                      <Image
                        source={i === 0 ? images.star : images.sessionIcon}
                        style={styles.scoreIcon}
                      />
                      <View>
                        <Text style={styles.score}>{i === 0 ? 5854 : 25}</Text>
                        <Text style={styles.scoreText}>
                          {i === 0 ? 'Total Score' : 'Sessions Played'}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              {this.renderHeading('Overview')}
              <ProfileCard
                title={'User Global Ranking\nPosition'}
                score="625.55"
              />
              <ProfileCard title="Higest Session Score" score="525" />
              <ProfileCard title="Longest Word" score="Successfully" />
              <ProfileCard title="Higest Word Scoring" score="125" />
              <ProfileCard title="Points to next rank" score="8584" />
            </View>
            <SocialMedia textStyle={{marginTop: 10}} />
          </ScrollView>
          <MenuModal
            {...this.state}
            {...this.props}
            onMenubarHandle={this.handleMenu}
            onButtonHandle={this._handleModalButton}
          />
        </ScreenContainer>
      );
    } else {
      return <></>;
    }
  }
}

const styles = StyleSheet.create({
  bg_image: {
    width: '100%',
    height: 410,
    paddingTop: scale(30),
  },
  bottomContainer: {
    marginHorizontal: 35,
    marginVertical: 30,
  },
  oppHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 50,
    marginBottom: 40,
  },
  profileView: {
    width: 125,
    height: 125,
    borderRadius: 63,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.white,
    alignSelf: 'center',
  },
  profile: {
    width: 113,
    height: 113,
    borderRadius: 56,
  },
  name: {
    textAlign: 'center',
    color: theme.colors.white,
    fontSize: 26,
    fontFamily: theme.fonts.extraBold,
    marginTop: 15,
  },
  status: {
    textAlign: 'center',
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.redHatMedium,
    marginTop: 6,
  },
  direction: {
    flexDirection: 'row',
  },
  timeView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 12,
  },
  time: {
    marginLeft: 7,
    color: theme.colors.white,
    fontSize: 14,
    fontFamily: theme.fonts.redHatNormal,
  },
  heading: {
    color: theme.colors.black1,
    fontSize: 20,
    fontFamily: theme.fonts.redHatExtraBold,
  },
  chartContainer: {
    backgroundColor: theme.colors.white,
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  barchartHeader: {
    fontFamily: theme.fonts.redHatMedium,
    fontSize: 16,
    width: '35%',
    textAlign: 'center',
    color: theme.colors.green,
  },
  barChartLine: {
    backgroundColor: theme.colors.black,
    height: 12,
    borderRadius: 10,
  },
  barChartDataView: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
  },
  barchartBottom: {
    color: theme.colors.grey3,
    fontSize: 16,
    fontFamily: theme.fonts.redHatBold,
    textAlign: 'center',
    width: '35%',
  },
  scoreView: {
    flexDirection: 'row',
    marginTop: -20,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scoreContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 7,
    width: theme.SCREENWIDTH / 2.6,
    flexDirection: 'row',
    paddingVertical: 13,
    justifyContent: 'center',
  },
  scoreIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 8,
  },
  score: {
    color: theme.colors.black1,
    fontFamily: theme.fonts.redHatBold,
    fontSize: 16,
  },
  scoreText: {
    fontSize: 12,
    fontFamily: theme.fonts.redHatNormal,
    color: theme.fonts.grey2,
    marginTop: 3,
  },
  totalScore: {
    fontSize: 16,
    color: theme.colors.grey3,
    fontFamily: theme.fonts.redHatNormal,
  },
  lineChartView: {
    flexDirection: 'row',
    height: 200,
    paddingTop: 20,
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => ({userData: state.AppReducer.userData});
const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (params) => dispatch(setUserData(params)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileStatistics);
