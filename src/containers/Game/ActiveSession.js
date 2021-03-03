import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import {scale, images} from '../../constants/index.js';
import {defineMatrix} from '../../Helper/generator';
import {initialBag} from '../../constants/tile';
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
import firestore from '@react-native-firebase/firestore';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from '@react-native-firebase/admob';

const adUnitIdPROD =
  Platform.OS === 'android'
    ? 'ca-app-pub-2121153401296954/6531125858'
    : 'ca-app-pub-2121153401296954/7621023859';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : adUnitIdPROD;
// const adUnitId = TestIds.INTERSTITIAL;
let interstitial = null;

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
      reason: 'Please place your tiles',
      turnId: '',
      totalMe: 0,
      totalYou: 0,
      passedMe: 0,
      passedYou: 0,
      adsLoaded: false,
    };
  }
  onTurnId = null;
  onTiles = null;
  onScore = null;
  unsubscribeAdListener = null;

  componentDidMount() {
    const {roomId, uid, language} = this.props.route.params;
    const {me} = this.state;
    firestore()
      .collection('users')
      .doc(me.uid)
      .get()
      .then((user) => {
        this.setState({me: user.data()});
      });
    const that = this;
    interstitial = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['fashion', 'clothing'],
    });
    this.unsubscribeAdListener = interstitial.onAdEvent((type) => {
      console.log('ads', type);
      switch (type) {
        case AdEventType.LOADED:
          that.setState({adsLoaded: true});
          break;
        case AdEventType.CLOSED:
          that.setState({adsLoaded: false});
          interstitial.load();
          break;
      }
    });
    interstitial.load();

    firestore()
      .collection('messages')
      .doc(roomId)
      .get()
      .then((rm) => {
        if (rm.exists) {
          this.onTurnId = database()
            .ref(`board/${roomId}/turnId`)
            .on('value', (snapshot) => {
              if (!snapshot.exists()) {
                database().ref(`board/${roomId}/turnId`).set(me.uid);
              } else {
                this.setState({turnId: snapshot.val()});
              }
            });
          this.onTiles = database()
            .ref(`board/${roomId}/tiles`)
            .on('value', (snapshot) => {
              if (!snapshot.exists()) {
                database()
                  .ref(`board/${roomId}/tiles`)
                  .set(initialBag(language));
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
                if (
                  (cards.length < 7 || oCards.length < 7) &&
                  bag.length !== 0
                ) {
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
          this.onScore = database()
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
                      if (this.onTurnId) {
                        database()
                          .ref(`board/${roomId}/turnId`)
                          .off('value', this.onTurnId);
                        this.onTurnId = null;
                      }
                      if (this.onTiles) {
                        database()
                          .ref(`board/${roomId}/tiles`)
                          .off('value', this.onTiles);
                        this.onTiles = null;
                      }
                      if (this.onScore) {
                        database()
                          .ref(`board/${roomId}/score`)
                          .off('value', this.onScore);
                        this.onScore = null;
                      }
                      const finishMessages = [
                        'Sorry, you lost the game.',
                        'Withdrawed.',
                        'Congratulation, you won the game.',
                      ];
                      Alert.alert(
                        '',
                        finishMessages[data.win + 1],
                        [
                          {
                            text: 'OK',
                            onPress: () =>
                              this.props.navigation.navigate('GlobalRankList'),
                          },
                        ],
                        {cancelable: false},
                      );
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
      });
    switch (language) {
      case 'de':
        import('../../constants/wordlist.de.json').then((dic) => {
          console.log('de', dic);
          that.dictionary = dic;
        });
        break;
      case 'hr':
        import('../../constants/wordlist.hr.json').then((dic) => {
          console.log('hr', dic);
          that.dictionary = dic;
        });
        break;
      default:
        import('../../constants/wordlist.en.json').then((dic) => {
          console.log('en', dic);
          that.dictionary = dic;
        });
        break;
    }
  }

  componentWillUnmount() {
    const {roomId} = this.props.route.params;
    if (this.onTurnId) {
      database().ref(`board/${roomId}/turnId`).off('value', this.onTurnId);
      this.onTurnId = null;
    }
    if (this.onTiles) {
      database().ref(`board/${roomId}/tiles`).off('value', this.onTiles);
      this.onTiles = null;
    }
    if (this.onScore) {
      database().ref(`board/${roomId}/score`).off('value', this.onScore);
      this.onScore = null;
    }
    if (this.unsubscribeAdListener) {
      this.unsubscribeAdListener();
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
      if (cards[i].row !== undefined) {
        for (let j = i + 1; j < cards.length; j++) {
          if (
            cards[j].row &&
            cards[i].row !== cards[j].row &&
            cards[i].col !== cards[j].col
          ) {
            console.log('not on line');
            this.setState({
              reason:
                'Tiles must be placed in a vertical or horizontal line on the board',
            });
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
      if (tiles.length) {
        this.setState({
          reason:
            'At least one of the tiles must be placed adjacent to an existing board tile',
        });
      } else {
        this.setState({
          reason:
            'On the first move, one of the tiles must instead cross the center of the board',
        });
      }
      return false;
    }

    console.log('linked');
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
          this.setState({
            reason: 'There must be no blank between tiles',
          });
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
      if (card.row !== undefined) {
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
    const wrongWords = [];
    if (words.length) {
      for (const word of words) {
        if (!this.dictionary[word.toLowerCase()]) {
          console.log(`'${word}' is not a word`);
          wrongWords.push(`${word} is not a word`);
        }
      }
      if (wrongWords.length) {
        this.setState({reason: wrongWords.join('\n')});
        return false;
      }
    } else {
      this.setState({reason: 'Please place more tiles'});
      return false;
    }
    return true;
  };

  handleSubmit = async () => {
    const {
      roomId,
      uid,
      language,
      type,
      photoURL,
      name,
    } = this.props.route.params;
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
    if (turnId !== me.uid) {
      return;
    }
    if (!success) {
      Alert.alert('', this.state.reason);
      return;
    }
    if (this.state.adsLoaded && type === 'unsigned') {
      interstitial.show();
    } else {
      console.log(this.state.adsLoaded, type);
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
      newScore[0].win =
        newScore[0].score > newScore[1].score
          ? 1
          : newScore[0].score === newScore[1].score
          ? 0
          : -1;
      newScore[1].win =
        newScore[0].score < newScore[1].score
          ? 1
          : newScore[0].score === newScore[1].score
          ? 0
          : -1;

      firestore().collection('messages').doc(roomId).delete();
      firestore().collection('users').doc(me.uid).collection('score').add({
        score: newScore[0].score,
        win: newScore[0].win,
        language,
        date: new Date(),
        type,
      });
      firestore().collection('users').doc(uid).collection('score').add({
        score: newScore[1].score,
        win: newScore[1].win,
        language,
        date: new Date(),
        type,
      });
    } else {
      firestore()
        .collection('messages')
        .doc(roomId)
        .set({
          id: roomId,
          language,
          type,
          updated_at: new Date(),
          end_at: new Date(new Date().getTime() + 48 * 3600 * 1000),
          players: [
            {
              uid: me.uid,
              full_name: me.full_name,
              photoURL: me.photoURL,
              status: 'Your move',
            },
            {
              uid: uid,
              full_name: name,
              photoURL,
              status: 'Pending',
            },
          ],
        });
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
    const {
      roomId,
      uid,
      language,
      type,
      name,
      photoURL,
    } = this.props.route.params;
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
      newScore[0].win = -1;
      newScore[1].win = 1;

      firestore().collection('messages').doc(roomId).delete();
      firestore().collection('users').doc(me.uid).collection('score').add({
        score: newScore[0].score,
        win: newScore[0].win,
        language,
        type,
        date: new Date(),
      });
      firestore().collection('users').doc(uid).collection('score').add({
        score: newScore[1].score,
        win: newScore[1].win,
        language,
        type,
        date: new Date(),
      });
    } else {
      firestore()
        .collection('messages')
        .doc(roomId)
        .set({
          id: roomId,
          language,
          type,
          updated_at: new Date(),
          end_at: new Date(new Date().getTime() + 48 * 3600 * 1000),
          players: [
            {
              uid: me.uid,
              full_name: me.full_name,
              photoURL: me.photoURL,
              status: 'Your move',
            },
            {
              uid,
              full_name: name,
              photoURL,
              status: 'Pending',
            },
          ],
        });
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
