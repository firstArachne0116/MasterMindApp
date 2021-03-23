import {Dimensions} from 'react-native';
const {width} = Dimensions.get('screen');
import storage from '@react-native-firebase/storage';

const guideLineBaseWidth = 350;

const scale = (size) => (width / guideLineBaseWidth) * size;
const moderatedScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const convertName = (name) => {
  let result = '';
  if (name) {
    let arr = name.split(' ');
    if (arr.length > 1) {
      result = arr[0] + ' ' + arr[1].charAt(0);
    } else {
      result = arr[0];
    }
  }
  if (result.length > 10) {
    result = result.substr(0, 10);
  }
  return result;
};

const getPlatformURI = async (imagePath) => {
  let imgSource = imagePath;

  if (isNaN(imagePath)) {
    imgSource = {uri: imagePath};
    if (imagePath.includes('http')) {
      return imgSource;
    }
    const url = await storage().ref(imagePath).getDownloadURL();
    imgSource = {uri: url};
    return imgSource;
  }
  return imgSource;
};

export {scale, moderatedScale, convertName, getPlatformURI};
