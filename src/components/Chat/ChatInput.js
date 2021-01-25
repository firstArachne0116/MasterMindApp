import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {images, theme} from '../../constants';
import EmojiBoard from 'react-native-emoji-board';

const ChatInput = (props) => {
  const {
    onSend,
    message,
    isEmojiKeyboard,
    handleFocus,
    handleKeyboard,
    handleInput,
    handleEmoji,
    isFocus,
  } = props;
  let textInput = null;
  return (
    <View>
      {isEmojiKeyboard && (
        <EmojiBoard
          onClick={handleEmoji}
          emojiSize={20}
          containerStyle={{bottom: 80, height: 230}}
        />
      )}
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handleKeyboard(textInput)}>
          <Image
            source={isEmojiKeyboard ? images.keyboardIcon : images.emojiIcon}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TextInput
          ref={(input) => {
            textInput = input;
          }}
          style={styles.input}
          value={message}
          placeholder={'Type your message here'}
          placeholderTextColor={theme.colors.grey1}
          onChangeText={(txt) => handleInput(txt)}
          onFocus={() => handleFocus(textInput)}
          showSoftInputOnFocus={!isFocus}
        />
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          locations={[0, 0.4]}
          colors={[theme.colors.sky1, theme.colors.sky]}
          style={styles.gradient}>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              onSend({text: message});
              handleInput('');
            }}>
            <Icon name="send" size={15} color={theme.colors.white} />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    height: 55,
    borderRadius: 20,
    borderTopRightRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 32,
    paddingLeft: 10,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    bottom: 20,
    elevation: 2,
  },
  icon: {
    width: 25,
    height: 25,
    margin: 5,
    resizeMode: 'contain',
  },
  input: {
    width: '65%',
    height: 40,
    color: theme.colors.black1,
    fontFamily: theme.fonts.redHatNormal,
  },
  gradient: {
    borderRadius: 20,
    borderTopRightRadius: 0,
    marginRight: 6,
  },
  sendButton: {
    height: 44,
    width: 57,
    borderRadius: 20,
    borderTopRightRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatInput;
