import React, {Component} from 'react';
import {StyleSheet, Keyboard} from 'react-native';
import {
  ChatHeader,
  ScreenContainer,
  WelcomeChat,
  ChatInput,
} from '../../components';
import {theme} from '../../constants';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

class ChatConversion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      messages: [],
      message: '',
      user: {},
      isEmojiKeyboard: false,
      isFocus: false,
    };
    // this.navigateToHomeScreen = this.navigateToHomeScreen.bind(this);
    // this.navigateToDetailScreen = this.navigateToDetailScreen.bind(this);
  }

  componentDidMount() {
    const currentUser = auth().currentUser;
    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .get()
      .then((user) => {
        const userData = user.data();
        this.setState({
          user: {
            name: userData.full_name,
            email: userData.email,
            avatar: userData.photoURL,
            _id: userData.uid,
          },
        });
      });

    this.interval = setInterval(async () => {
      const roomId = this.props.route.params.roomId;
      await firestore()
        .collection('messages')
        .doc(roomId)
        .collection('sub')
        .orderBy('createdAt', 'desc')
        .get()
        .then((snapshot) => {
          let temp = [];
          snapshot.forEach((doc) => {
            if (doc) {
              temp.push(doc.data());
            }
          });

          this.setState({messages: temp});
        })
        .catch((err) => {
          console.log('Error getting documents', err);
        });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onSend(messages = []) {
    if (messages[0].text !== '') {
      this.saveMessage(messages[0]);
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, messages),
        };
      });
    }
    // this.setState({isFocus: false, isEmojiKeyboard: false});
  }

  saveMessage = (message) => {
    const roomId = this.props.route.params.roomId;
    firestore()
      .collection('messages')
      .doc(roomId)
      .collection('sub')
      .add(message);
  };

  _handleInput = (txt) => {
    this.setState({message: txt});
  };

  _handleKeyboard = (textInput) => {
    this.setState(
      {
        isEmojiKeyboard: !this.state.isEmojiKeyboard,
      },
      () => {
        if (this.state.isEmojiKeyboard) {
          Keyboard.dismiss();
          this.setState({
            isFocus: false,
          });
        } else {
          textInput.focus();
        }
      },
    );
  };

  handleFocus = (textInput) => {
    this.setState({
      isFocus: true,
    });
    textInput.focus();
  };

  handleEmoji = (emoji) => {
    const {message} = this.state;
    this.setState({
      message: message + emoji.code,
    });
  };

  render() {
    const {messages, user} = this.state;
    const {navigation} = this.props;
    return (
      <ScreenContainer style={{backgroundColor: theme.colors.white}}>
        {!!user && (
          <ChatHeader
            {...this.props}
            {...this.state}
            onSettingHandle={() => navigation.navigate('ChatSettings')}
          />
        )}

        <GiftedChat
          messages={messages}
          renderChatEmpty={() => <WelcomeChat />}
          onSend={(message) => {
            this.onSend(message);
          }}
          user={user}
          renderTime={() => {
            return null;
          }}
          renderDay={() => {
            return null;
          }}
          renderBubble={(props) => {
            return (
              <Bubble
                {...props}
                wrapperStyle={{
                  left: [
                    styles.messageBox,
                    {
                      backgroundColor: theme.colors.blue2,
                    },
                  ],
                  right: [
                    styles.messageBox,
                    {
                      backgroundColor: theme.colors.grey6,
                    },
                  ],
                }}
                textStyle={{
                  left: [
                    styles.message,
                    {
                      color: theme.colors.white,
                    },
                  ],
                  right: [
                    styles.message,
                    {
                      color: theme.colors.grey3,
                    },
                  ],
                }}
              />
            );
          }}
          // minInputToolbarHeight={isFocus ? 70 : isEmojiKeyboard ? 300 : 70}
          renderInputToolbar={(props) => {
            return (
              <ChatInput
                {...props}
                {...this.state}
                handleInput={this._handleInput}
                handleKeyboard={this._handleKeyboard}
                handleFocus={this.handleFocus}
                handleEmoji={this.handleEmoji}
              />
            );
          }}
        />
      </ScreenContainer>
    );
  }
}

export default ChatConversion;

const styles = StyleSheet.create({
  messageBox: {
    marginBottom: 20,
    borderRadius: 7,
    paddingHorizontal: 10,
  },
  message: {
    fontFamily: theme.fonts.redHatNormal,
    fontSize: 13,
  },
});
