import React, {Component} from 'react';
import {View, Animated, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {images, scale, theme} from '../constants';
import {ScreenContainer} from './';

export default class LoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progressAnimated: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const {progressAnimated} = this.state;
    Animated.timing(progressAnimated, {
      toValue: 100,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }

  render() {
    const {progressAnimated} = this.state;
    const progress = progressAnimated.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
      extrapolate: 'clamp',
    });
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <FastImage source={images.loadingBack} style={styles.bgImage} />
          <FastImage
            source={images.masterMindLogo}
            style={styles.masterMindLogo}
            resizeMode="contain"
          />
          <View style={styles.progressOuter}>
            <Animated.View
              style={[
                styles.progressInner,
                {
                  width: progress,
                },
              ]}
            />
          </View>
          <Text style={styles.welcome}>{'WELCOME ON BORAD'}</Text>
        </View>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  masterMindLogo: {
    width: theme.SCREENWIDTH / 1.4,
    height: 100,
  },
  progressOuter: {
    width: theme.SCREENWIDTH / 1.8,
    height: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 50,
    marginVertical: scale(33),
  },
  progressInner: {
    backgroundColor: theme.colors.sky,
    height: 20,
    borderRadius: 50,
  },
  welcome: {
    fontFamily: theme.fonts.light,
    fontSize: 16,
    color: theme.colors.white,
  },
});
