import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {scale, images} from '../../constants/index.js';
import {defineMatrix} from '../../Helper/generator';
import dictionary from '../../constants/wordlist.en.json';
import {initalTiles} from '../../constants/tile';
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

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
export default class ActiveSession extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      me: auth().currentUser,
      data: defineMatrix(),
      tiles: [],
      cards: [],
      oCards: [],
      bag: [],
      selectedChar: {},
      success: false,
      turnId: '',
      totalMe: 0,
      totalYou: 0,
      passedMe: 0,
      passedYou: 0,
    };
  }
  onTurnId = null;
  onTiles = null;
  onScore = null;

  componentDidMount() {
    const {roomId, uid} = this.props.route.params;
    const {me} = this.state;

    this.onTurnId = database()
      .ref(`board/${roomId}/turnId`)
      .on('value', (snapshot) => {
        if (!snapshot.exists()) {
          database().ref(`board/${roomId}/turnId`).set(me.uid);
        } else {
          this.setState({turnId: snapshot.val()});
        }
      });
    database()
      .ref(`board/${roomId}/tiles`)
      .on('value', (snapshot) => {
        if (!snapshot.exists()) {
          database().ref(`board/${roomId}/tiles`).set(initalTiles);
        } else {
          const allTiles = snapshot.val();
          const cards = allTiles.filter((tile) => tile.status === me.uid);
          const oCards = allTiles.filter((tile) => tile.status === uid);
          const bag = allTiles.filter((tile) => tile.status === 'bag');
          const tiles = allTiles.filter(
            (tile) => tile.status === 'board' || tile.status === 'new',
          );
          this.setState({
            tiles,
            cards: cards.map((card, index) => ({...card, id: index})),
            bag,
            oCards,
          });
          if ((cards.length < 7 || oCards.length < 7) && bag.length !== 0) {
            console.log('take tiles from bag');
            while (cards.length < 7 && bag.length !== 0) {
              const randomIndex = getRandomInt(bag.length);
              cards.push({...bag[randomIndex], status: me.uid});
              bag.splice(randomIndex, 1);
            }
            while (oCards.length < 7 && bag.length !== 0) {
              const randomIndex = getRandomInt(bag.length);
              oCards.push({...bag[randomIndex], status: uid});
              bag.splice(randomIndex, 1);
            }
            const newTiles = [...cards, ...oCards, ...bag, ...tiles];
            database().ref(`board/${roomId}/tiles`).set(newTiles);
          }
        }
      });
    database()
      .ref(`board/${roomId}/score`)
      .on('value', (snapshot) => {
        const values = snapshot.val();
        let meTotal = 0;
        let youTotal = 0;
        let passedMe = 0;
        let passedYou = 0;
        if (values !== null) {
          values.map((data) => {
            if (data.id === me.uid) {
              meTotal = data.score;
              if (data.passed) {
                passedMe = data.passed;
              }
              if (data.win !== undefined) {
                if (data.win) {
                  this.props.navigation.navigate('GlobalRankList');
                } else {
                  this.props.navigation.goBack();
                }
              }
            } else {
              youTotal = data.score;
              if (data.passed) {
                passedYou = data.passed;
              }
            }
          });
        } else {
          database()
            .ref(`board/${roomId}/score`)
            .set([
              {
                id: me.uid,
                score: 0,
                passed: 0,
              },
              {
                id: uid,
                score: 0,
                passed: 0,
              },
            ]);
        }
        this.setState({
          totalMe: meTotal,
          totalYou: youTotal,
          passedMe,
          passedYou,
        });
      });
  }

  componentWillUnmount() {
    const {roomId} = this.props.route.params;
    if (this.onTurnId) {
      database().ref(`board/${roomId}/turnId`).off('value', this.onTurnId);
    }
    if (this.onTiles) {
      database().ref(`board/${roomId}/tiles`).off('value', this.onTiles);
    }
    if (this.onScore) {
      database().ref(`board/${roomId}/score`).off('value', this.onScore);
    }
  }

  toggleModal = () => {
    if (this.state.turnId !== this.state.me.uid) {
      return;
    }
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  handleSelectCard = (char) => {
    const {cards, me, turnId} = this.state;
    if (me.uid === turnId) {
      const newCards = cards.map((card) => {
        if (card.id === char.id) {
          const newCard = {
            ...card,
            selected: !card.selected,
          };
          return newCard;
        } else {
          const newCard = {
            ...card,
            selected: false,
          };
          return newCard;
        }
      });
      this.setState({selectedChar: char.selected ? {} : char, cards: newCards});
    }
  };

  handleReplaceCard = (id, char) => {
    this.setState({
      cards: this.state.cards.map((card) => ({
        ...card,
        letter: card.id === id ? char : card.letter,
      })),
    });
  };

  handleReturnCard = (tile) => {
    this.setState(
      {
        cards: this.state.cards.map((card) =>
          card.row === tile.row && card.col === tile.col
            ? {
                ...card,
                selected: false,
                row: undefined,
                col: undefined,
              }
            : card,
        ),
      },
      () => this.setState({success: this.checkWord()}),
    );
  };

  handleSelectTile = (tile) => {
    const {selectedChar, cards, turnId, me} = this.state;
    if (turnId === me.uid && selectedChar.letter) {
      this.setState(
        {
          cards: cards.map((card) => ({
            ...card,
            selected: false,
            ...(selectedChar.id === card.id ? {row: tile.x, col: tile.y} : {}),
          })),
          selectedChar: {},
        },
        () => {
          this.setState({success: this.checkWord()});
        },
      );
    }
  };

  getVerticalWord = (data, card) => {
    let t, b, i;
    for (i = card.row; i >= 0; i--) {
      if (!data[i][card.col].fill) {
        break;
      }
    }
    t = ++i;
    for (i = card.row; i < 15; i++) {
      if (!data[i][card.col].fill) {
        break;
      }
    }
    b = --i;
    let word = '',
      score = 0,
      mul = 1;
    for (i = t; i <= b; i++) {
      word += data[i][card.col].letter;
      score +=
        parseInt(data[i][card.col].value, 10) *
        (data[i][card.col].w && data[i][card.col].w % 2 === 1
          ? (data[i][card.col].w + 3) / 2
          : 1);
      if (data[i][card.col].w && data[i][card.col].w % 2 === 0) {
        mul *= data[i][card.col].w / 2 + 1;
      }
    }
    score *= mul;
    return {word, score};
  };

  getHorizontalWord = (data, card) => {
    let l, r, i;
    for (i = card.col; i >= 0; i--) {
      if (!data[card.row][i].fill) {
        break;
      }
    }
    l = ++i;
    for (i = card.col; i < 15; i++) {
      if (!data[card.row][i].fill) {
        break;
      }
    }
    r = --i;
    let word = '',
      score = 0,
      mul = 1;
    for (i = l; i <= r; i++) {
      word += data[card.row][i].letter;
      score +=
        parseInt(data[card.row][i].value, 10) *
        (data[card.row][i].w && data[card.row][i].w % 2 === 1
          ? (data[card.row][i].w + 3) / 2
          : 1);
      if (data[card.row][i].w && data[card.row][i].w % 2 === 0) {
        mul *= data[card.row][i].w / 2 + 1;
      }
    }
    score *= mul;
    return {word, score};
  };

  checkWord = () => {
    const that = this;
    const {cards, data, tiles} = this.state;
    const renderData = [];
    for (let i = 0; i < 15; i++) {
      renderData[i] = [];
      for (let j = 0; j < 15; j++) {
        renderData[i][j] = data[i][j];
      }
    }
    tiles.map((tile) => {
      renderData[tile.row][tile.col] = {
        ...renderData[tile.row][tile.col],
        ...tile,
        fill: true,
      };
    });
    let linked = false;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].row) {
        for (let j = i + 1; j < cards.length; j++) {
          if (
            cards[j].row &&
            cards[i].row !== cards[j].row &&
            cards[i].col !== cards[j].col
          ) {
            console.log('not on line');
            return false;
          }
        }
        if (
          (cards[i].row !== 14 &&
            renderData[cards[i].row + 1][cards[i].col].fill) ||
          (cards[i].row !== 0 &&
            renderData[cards[i].row - 1][cards[i].col].fill) ||
          (cards[i].col !== 14 &&
            renderData[cards[i].row][cards[i].col + 1].fill) ||
          (cards[i].col !== 0 &&
            renderData[cards[i].row][cards[i].col - 1].fill) ||
          (cards[i].row === 7 && cards[i].col === 7)
        ) {
          linked = true;
        }
      }
    }
    if (!linked) {
      console.log('not linked to body');
      return false;
    }

    let minRow = 15,
      minCol = 15,
      maxRow = -1,
      maxCol = -1;
    cards.map((card) => {
      if (card.row !== undefined) {
        minRow = Math.min(card.row, minRow);
        maxRow = Math.max(card.row, maxRow);
        minCol = Math.min(card.col, minCol);
        maxCol = Math.max(card.col, maxCol);
        renderData[card.row][card.col] = {
          ...renderData[card.row][card.col],
          ...card,
          fill: true,
        };
      }
    });

    if (minRow !== maxRow) {
      for (let i = minRow; i < maxRow; i++) {
        if (!renderData[i][minCol].fill) {
          console.log('cards are not linked');
          return false;
        }
      }
    } else {
      for (let i = minCol; i < maxCol; i++) {
        if (!renderData[minRow][i].fill) {
          console.log('cards are not linked');
          return false;
        }
      }
    }

    const words = [];
    let score = 0;

    cards.map((card) => {
      if (card.row) {
        let word = that.getVerticalWord(renderData, card);
        if (
          word.word.length > 1 &&
          words.filter((w) => w === word.word).length === 0
        ) {
          words.push(word.word);
          score += word.score;
        }

        word = that.getHorizontalWord(renderData, card);
        if (
          word.word.length > 1 &&
          words.filter((w) => w === word.word).length === 0
        ) {
          words.push(word.word);
          score += word.score;
        }
      }
    });
    that.setState({score});

    console.log(words);
    if (words.length) {
      for (const word of words) {
        if (!dictionary[word.toLowerCase()]) {
          console.log(`'${word}' is not a word`);
          return false;
        }
      }
    } else {
      return false;
    }
    return true;
  };

  handleSubmit = async () => {
    const {roomId, uid} = this.props.route.params;
    const {
      tiles,
      bag,
      success,
      cards,
      oCards,
      me,
      turnId,
      score,
      totalYou,
      totalMe,
      passedYou,
    } = this.state;
    if (turnId !== me.uid || !success) {
      return;
    }
    let totalScore = score;
    if (
      cards.length === 7 &&
      cards.filter((card) => card.row === undefined).length === 0
    ) {
      totalScore += 40;
    }
    const newTiles = tiles.map((tile) => ({...tile, status: 'board'}));
    const newCards = cards.filter((card) => {
      if (card.row !== undefined) {
        newTiles.push({...card, status: 'new'});
        return false;
      }
      return true;
    });
    const newBag = [...bag];
    if (newCards.length < 7 && newBag.length !== 0) {
      console.log('take tiles from newBag');
      while (newCards.length < 7 && newBag.length !== 0) {
        const randomIndex = getRandomInt(newBag.length);
        newCards.push({...newBag[randomIndex], status: me.uid});
        newBag.splice(randomIndex, 1);
      }
    }
    const newScore = [
      {
        id: me.uid,
        score: totalMe + totalScore,
        passed: 0,
      },
      {
        id: uid,
        score: totalYou,
        passed: passedYou,
      },
    ];
    if (newBag.length === 0 && newCards.length === 0) {
      let remainScore = 0;
      oCards.map((card) => (remainScore += card.value));
      newScore[0].score = totalMe + totalScore + remainScore;
      newScore[1].score = totalYou - remainScore;
      newScore[0].win = newScore[0].score >= newScore[1].score;
      newScore[1].win = newScore[0].score < newScore[1].score;
    }
    database()
      .ref(`board/${roomId}/tiles`)
      .set([...newCards, ...oCards, ...newBag, ...newTiles]);
    database().ref(`board/${roomId}/score`).set(newScore);
    database().ref(`board/${roomId}/turnId`).set(uid);
  };

  handleClear = () => {
    if (this.state.turnId !== this.state.me.uid) {
      return;
    }
    this.setState({
      selectedChar: {},
      success: false,
      cards: this.state.cards.map((card) => ({
        ...card,
        row: undefined,
        col: undefined,
        selected: false,
        letter: card.value === 0 ? ' ' : card.letter,
      })),
      isModalVisible: false,
    });
  };

  handlePass = () => {
    if (this.state.turnId !== this.state.me.uid) {
      return;
    }
    const {roomId, uid} = this.props.route.params;
    this.handleClear();
    const {
      oCards,
      cards,
      tiles,
      bag,
      passedMe,
      passedYou,
      totalMe,
      totalYou,
      me,
    } = this.state;
    const newTiles = tiles.map((tile) => ({
      ...tile,
      status: 'board',
    }));
    const newScore = [
      {
        id: me.uid,
        score: totalMe,
        passed: passedMe + 1,
      },
      {
        id: uid,
        score: totalYou,
        passed: passedYou,
      },
    ];
    if (passedMe === 4) {
      newScore[0].win = false;
      newScore[1].win = true;
    }
    database()
      .ref(`board/${roomId}/tiles`)
      .set([...cards, ...oCards, ...bag, ...newTiles]);
    database().ref(`board/${roomId}/turnId`).set(uid);
    database().ref(`board/${roomId}/score`).set(newScore);
  };

  handleSwap = () => {
    const {bag, turnId, me, cards} = this.state;
    if (turnId !== me.uid) {
      return;
    }
    if (bag.length >= 7) {
      const newCards = [],
        newBag = [...bag];
      Array(7)
        .fill(0)
        .map((_) => {
          const randomIndex = getRandomInt(newBag.length);
          newCards.push({...newBag[randomIndex], status: me.uid});
          console.log(newCards);
          newBag.splice(randomIndex, 1);
        });
      cards.map((card) => {
        newBag.push({...card, row: undefined, col: undefined, status: 'bag'});
      });
      console.log(newCards);
      this.setState({cards: newCards, bag: newBag}, () => {
        this.handlePass();
      });
    }
  };

  render() {
    const {
      isModalVisible,
      me,
      data,
      cards,
      tiles,
      turnId,
      success,
      totalMe,
      totalYou,
    } = this.state;
    const {navigation} = this.props;
    const {params} = this.props.route;
    return (
      <ScreenContainer>
        <SafeAreaView style={styles.mainContainer}>
          <ImageBackground
            source={images.curveImage}
            resizeMode={'stretch'}
            style={styles.bg_image}>
            <GameBoxHeader
              navigation={navigation}
              params={params}
              turnId={turnId}
              me={me}
            />
            <GameBoxPlayer
              params={params}
              me={me}
              totalYou={totalYou}
              totalMe={totalMe}
            />
          </ImageBackground>
          <ScrollView
            contentContainerStyle={styles.container}
            style={styles.scrollView}>
            <GameBoxes
              data={data}
              tiles={tiles}
              cards={cards}
              handleSelectTile={this.handleSelectTile}
              handleReturnCard={this.handleReturnCard}
              success={success}
            />
          </ScrollView>
          <GameBoxFooter
            cards={cards}
            handleSubmit={this.handleSubmit}
            toggleModal={this.toggleModal}
            handleSelectCard={this.handleSelectCard}
            handleReplaceCard={this.handleReplaceCard}
            handleClear={this.handleClear}
            handleSwap={this.handleSwap}
            tilesLeft={this.state.bag.length}
          />
          <PassModal
            isModalVisible={isModalVisible}
            handlePass={() => this.handlePass()}
            handleCancel={() =>
              this.setState({isModalVisible: !this.state.isModalVisible})
            }
          />
        </SafeAreaView>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 10,
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 1,
    paddingHorizontal: 3,
    marginHorizontal: 10,
  },
  scrollView: {
    marginTop: 50,
    height: Dimensions.get('window').height - 290,
  },
  bg_image: {
    width: '100%',
    height: 110,
    paddingTop: scale(22),
  },
});
