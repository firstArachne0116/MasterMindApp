import {Alert} from 'react-native';

export const RenderAlert = (message) => {
  return Alert.alert(
    '',
    message,
    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    {cancelable: false},
  );
};
