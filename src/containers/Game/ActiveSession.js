import React, {Component} from 'react';
import {StyleSheet, ScrollView, ImageBackground} from 'react-native';
import {scale, images} from '../../constants/index.js';
import {
  defineMatrix,
  getNewWord,
  isAvailableWord,
  generatorNewCard,
  getAvailableWords,
  getWeight,
} from '../../Helper/generator';
import {COLOR_TILE_BOARD} from '../../constants/tile';
import {
  GameBoxes,
  GameBoxHeader,
  GameBoxPlayer,
  GameBoxFooter,
  PassModal,
  ScreenContainer,
} from '../../components';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default class ActiveSession extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      me: auth().currentUser,
      data: defineMatrix(),
      tiles: [],
      cards: [],
      selectedChar: {},
      replaceLetter: {},
      isStart: false,
      word: [],
      checkWord: [],
      success: false,
      turnId: '',
      addition: 0,
      horizental: false,
      vertical: false,
      passed: false,
    };
  }

  async componentDidMount() {
    const {roomId} = this.props.route.params;
    const {me} = this.state;
    const newCards = await getNewWord();
    const tiles = [];

    database()
      .ref(`board/${roomId}/turnId`)
      .on('value', (snapshot) => {
        if (!snapshot.exists()) {
          database().ref(`board/${roomId}/turnId`).set(me.uid);
        } else {
          this.setState({turnId: snapshot.val()});
        }
      });
    database()
      .ref(`board/${roomId}/data`)
      .on('value', (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          data.map((row) => {
            row.map((item) => {
              tiles.push(item);
            });
          });
          this.setState({data: data, isStart: true, addition: 1});
        }
      });
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({cards: newCards, tiles: tiles});
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  handleSelectCard = (char) => {
    const {cards, word, checkWord, me, turnId} = this.state;
    if (me.uid === turnId) {
      const newCards = cards.map((card) => {
        if (card.id === char.id) {
          const newCard = {
            ...card,
            selected: true,
          };
          this.setState({
            word: [...word, newCard],
            checkWord: [...checkWord, newCard],
          });
          return newCard;
        } else {
          const newCard = {
            ...card,
            selected: false,
          };
          return newCard;
        }
      });
      this.setState({selectedChar: char, cards: newCards});
    }
  };

  handleReplaceCard = async (id) => {
    const {replaceLetter, cards} = this.state;
    await this.replaceData(replaceLetter, -1);
    await this.replaceCard(replaceLetter, id);
    const filledCards = await cards.filter((card) => card.letter !== '');
    if (filledCards.length === 6) {
      this.setState({word: [], checkWord: [], passed: false});
      this.colorInitData(undefined);
    }
  };

  handleSelectTile = async (tile) => {
    const {selectedChar, cards, passed, replaceLetter} = this.state;
    if (selectedChar.letter) {
      const updatedData = await this.updatedData(selectedChar, tile);
      if (!passed) {
        this.setCheckWord(tile.id);
      }
      if (tile.id === 112) {
        this.passedStart();
      }
      const deletedCard = cards.map((card) => {
        if (card.selected && updatedData.updated) {
          return {
            ...card,
            letter: '',
            selected: false,
          };
        } else {
          return card;
        }
      });

      this.setState({
        data: updatedData.data,
        tiles: updatedData.tiles,
        selectedChar: {},
        cards: deletedCard,
      });
      this.checkWord();
    } else {
      if (tile.letter && tile.letter.length === 1 && tile.cardId !== -1) {
        this.setState({
          replaceLetter: {
            id: tile.id,
            letter: tile.letter,
            w: tile.w,
            cardId: tile.cardId,
          },
        });
      } else {
        if (replaceLetter.letter) {
          if (replaceLetter.id === 112) {
            this.setState({isStart: false});
          }
          this.replaceData(replaceLetter, tile.id);
        }
      }
    }
  };

  setCheckWord = (id) => {
    const {tiles, checkWord} = this.state;
    const nextHorChar = tiles.find(
      (tile) => tile.id === id + 1 && tile.cardId === -1,
    );
    const nextVerChar = tiles.find(
      (tile) => tile.id === id + 15 && tile.cardId === -1,
    );
    const prevHorChar = tiles.find(
      (tile) => tile.id === id - 1 && tile.cardId === -1,
    );
    const prevVerChar = tiles.find(
      (tile) => tile.id === id - 15 && tile.cardId === -1,
    );
    if (prevVerChar && prevVerChar.letter !== '') {
      this.setState({
        vertical: true,
        passed: true,
        checkWord: [
          {
            id: prevVerChar.id,
            letter: prevVerChar.letter,
            selected: true,
            w: 1,
          },
          ...checkWord,
        ],
      });
    } else if (prevHorChar && prevHorChar.letter !== '') {
      this.setState({
        horizental: true,
        passed: true,
        checkWord: [
          {
            id: prevHorChar.id,
            letter: prevHorChar.letter,
            selected: true,
            w: 1,
          },
          ...checkWord,
        ],
      });
    } else if (nextVerChar && nextVerChar.letter !== '') {
      this.setState({
        vertical: true,
        passed: true,
        checkWord: [
          ...checkWord,
          {
            id: nextVerChar.id,
            letter: nextVerChar.letter,
            selected: true,
            w: 1,
          },
        ],
      });
    } else if (nextHorChar && nextHorChar.letter !== '') {
      this.setState({
        horizental: true,
        passed: true,
        checkWord: [
          ...checkWord,
          {
            id: nextHorChar.id,
            letter: nextHorChar.letter,
            selected: true,
            w: 1,
          },
        ],
      });
    }
  };

  updatedData = async (selectedChar, tile) => {
    const {data} = this.state;
    let newTiles = [];
    let updated = false;
    const temp = await data.map((row) => {
      return row.map((item) => {
        if (item.id === tile.id && item.letter.length !== 1) {
          const newItem = {
            ...item,
            letter: selectedChar.letter,
            fill: true,
            cardId: selectedChar.id,
          };
          newTiles.push(newItem);
          updated = true;
          return newItem;
        } else {
          newTiles.push(item);
          return item;
        }
      });
    });

    return {
      data: temp,
      tiles: newTiles,
      updated: updated,
    };
  };

  replaceData = async (replaceLetter, id) => {
    const {data} = this.state;
    let newTiles = [];
    const temp = await data.map((row) => {
      return row.map((item) => {
        if (item.id === replaceLetter.id) {
          const label = COLOR_TILE_BOARD.find(
            (char) => char.col === item.x && char.row === item.y,
          );
          const newItem = {
            ...item,
            letter: label ? label.lb : '',
            fill: false,
            cardId: '',
            success: undefined,
          };
          newTiles.push(newItem);
          return newItem;
        } else if (id !== -1 && item.id === id) {
          const newItem = {
            ...item,
            letter: replaceLetter.letter,
            cardId: replaceLetter.cardId,
            fill: true,
          };
          newTiles.push(newItem);
          return newItem;
        } else {
          newTiles.push(item);
          return item;
        }
      });
    });

    this.setState({
      data: temp,
      tiles: newTiles,
      replaceLetter: {},
    });
    if (replaceLetter.id === 112) {
      this.passedStart();
    }
    const chars = await this.getChars();
    if (chars.includes(replaceLetter)) {
      this.colorInitData(undefined);
    } else {
      this.checkWord();
    }
  };

  replaceCard = (replaceLetter, id) => {
    const {cards, word} = this.state;
    const newCards = cards.map((card) => {
      if (card.id === id) {
        return {
          ...card,
          letter: replaceLetter.letter,
          w: word.find((item) => item.id === replaceLetter.cardId).w,
        };
      } else {
        return card;
      }
    });

    this.setState({
      cards: newCards,
      word: word.filter((item) => item.id !== replaceLetter.cardId),
    });
  };

  checkWord = async () => {
    const {isStart, word, checkWord} = this.state;
    if (!isStart) {
      this.passedStart();
    }

    if (word.length > 1 || checkWord.length > 1) {
      const chars = await this.getChars();
      if (chars) {
        const wordList = await getAvailableWords(chars.charAt(0));
        const existedWord = await isAvailableWord(chars, wordList);
        this.setState({success: existedWord && isStart});
        this.colorData(existedWord && isStart);
      }
    }
  };

  getChars = async () => {
    const {tiles, checkWord, addition} = this.state;
    let chars = '';
    let oldX = 0;
    let oldY = 0;
    let index = 0;
    let horizental = false;
    if (checkWord.length > 1) {
      const filledXYTiles = await tiles.filter((item) => item.fill === true);
      const firstCardTile = await filledXYTiles.find(
        (item) =>
          (item.cardId === checkWord[0].id && item.cardId !== -1) ||
          (item.cardId === -1 && item.id === checkWord[0].id),
      );
      const secondCardTile = await filledXYTiles.find(
        (item) =>
          (item.cardId === checkWord[1].id && item.cardId !== -1) ||
          (item.cardId === -1 && item.id === checkWord[1].id),
      );

      if (firstCardTile && secondCardTile) {
        if (firstCardTile.x === secondCardTile.x) {
          horizental = false;
        }

        if (firstCardTile.y === secondCardTile.y) {
          horizental = true;
        }
        const filledXTiles = await filledXYTiles.filter(
          (item) => item.x === firstCardTile.x,
        );
        const filledYTiles = await filledXYTiles.filter(
          (item) => item.y === firstCardTile.y,
        );
        const filledTiles = horizental ? filledYTiles : filledXTiles;

        await filledTiles.forEach((item) => {
          if (index === 0) {
            oldX = item.x;
            oldY = item.y;
            chars = item.letter;
          } else {
            if (index < checkWord.length + addition) {
              if (
                (item.x - oldX === 1 && item.y === oldY) ||
                (item.y - oldY === 1 && item.x === oldX)
              ) {
                chars = chars + item.letter;
                oldX = item.x;
                oldY = item.y;
              } else {
                index = 0;
                chars = '';
              }
            }
          }
          index++;
        });
        this.setState({vertical: !horizental, horizental: horizental});
      }
    }
    return chars;
  };

  passedStart = () => {
    const {tiles} = this.state;
    const isStartTile = tiles.find((item) => item.id === 112);

    if (isStartTile.letter.length === 1) {
      this.setState({isStart: true});
    } else {
      this.setState({isStart: false});
    }
  };

  handleSubmit = async () => {
    const {roomId, uid} = this.props.route.params;
    const {tiles, data, word, success, cards, me, turnId} = this.state;
    const filledTiles = tiles.filter((item) => item.fill === true);
    const totalWeight = await getWeight(word, filledTiles);

    if (success && turnId === me.uid) {
      const temp = await data.map((row) => {
        return row.map((item) => {
          const tile = word.find((w) => w.id === item.cardId);
          if ((tile && word.length > 1) || item.cardId === -1) {
            const newItem = {
              ...item,
              cardId: -1,
              success: undefined,
            };
            return newItem;
          } else {
            return item;
          }
        });
      });

      database().ref(`board/${roomId}`).push({
        tiles: filledTiles,
        word: word,
        total: totalWeight,
        id: me.uid,
      });
      database().ref(`board/${roomId}/turnId`).set(uid);
      database().ref(`board/${roomId}/data`).set(temp);

      const newCards = cards.map((card) => {
        if (card.letter === '') {
          return {
            id: card.id,
            ...generatorNewCard(),
          };
        } else {
          return card;
        }
      });

      this.colorData(undefined);
      this.setState({
        success: false,
        cards: newCards,
        word: [],
        passed: false,
        checkWord: [],
      });
    }
  };

  colorData = async (success) => {
    const {data, checkWord} = this.state;
    const temp = await data.map((row) => {
      return row.map((item) => {
        const tile = checkWord.find(
          (w) => w.id === item.cardId || w.id === item.id,
        );
        if (tile && checkWord.length > 1) {
          const newItem = {
            ...item,
            success: success,
          };
          return newItem;
        } else {
          return item;
        }
      });
    });

    this.setState({data: temp});
  };

  colorInitData = async (success) => {
    const {data} = this.state;
    const temp = await data.map((row) => {
      return row.map((item) => {
        if (item.fill) {
          const newItem = {
            ...item,
            success: success,
          };
          return newItem;
        } else {
          return {
            ...item,
            success: false,
          };
        }
      });
    });

    this.setState({data: temp});
  };

  render() {
    const {isModalVisible, me, data, cards} = this.state;
    const {navigation} = this.props;
    const {params} = this.props.route;
    return (
      <ScreenContainer>
        <ScrollView contentContainerStyle={styles.container}>
          <ImageBackground
            source={images.curveImage}
            resizeMode={'stretch'}
            style={styles.bg_image}>
            <GameBoxHeader navigation={navigation} params={params} />
            <GameBoxPlayer params={params} me={me} />
          </ImageBackground>
          <GameBoxes
            data={data}
            cards={cards}
            handleSelectCard={this.handleSelectCard}
            handleSelectTile={this.handleSelectTile}
            handleReplaceCard={this.handleReplaceCard}
          />
          <PassModal
            isModalVisible={isModalVisible}
            toggleModalVisibility={() =>
              this.setState({isModalVisible: !this.state.isModalVisible})
            }
          />
        </ScrollView>
        <GameBoxFooter
          handleSubmit={this.handleSubmit}
          toggleModal={this.toggleModal}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
  },
  bg_image: {
    width: '100%',
    height: 110,
    paddingTop: scale(22),
  },
});
