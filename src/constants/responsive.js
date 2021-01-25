import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('screen');
import storage from '@react-native-firebase/storage';

const guideLineBaseWidth = 350;
const guideLineBaseHeight = 680;

const scale = (size) => (width / guideLineBaseWidth) * size;
const verticalScale = (size) => (height / guideLineBaseHeight) * size;
const moderatedScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const convertName = (name) => {
  if (name) {
    let arr = name.split(' ');
    if (arr.length > 1) {
      return arr[0] + ' ' + arr[1].charAt(0);
    }
    return arr[0];
  }
  return;
};

const getPlatformURI = async (imagePath) => {
  let imgSource = imagePath;

  if (isNaN(imagePath)) {
    imgSource = {uri: imagePath};
    if (imagePath.includes('http')) {
      return imgSource;
    }
    const url = await storage().ref(imagePath).getDownloadURL();
    console.log('url', url);
    imgSource = {uri: url};
    return imgSource;
  }
  return imgSource;
};

export {scale, verticalScale, moderatedScale, convertName, getPlatformURI};
