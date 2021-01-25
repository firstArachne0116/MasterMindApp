import {tile} from '../constants';
import dictionary from '../constants/words.en.json';

const defineMatrix = () => {
  let matrix = [];
  for (let i = 0; i < 15; i++) {
    matrix[i] = [];
    for (let j = 0; j < 15; j++) {
      let id = i * 15 + j;
      const point = tile.COLOR_TILE_BOARD.find(
        (item) => item.col === i && item.row === j,
      );

      if (point) {
        matrix[i][j] = {
          id: id,
          x: i,
          y: j,
          letter: point.lb,
          w: point.w,
          fill: false,
        };
      } else {
        matrix[i][j] = {id: id, x: i, y: j, letter: '', w: 0, fill: false};
      }
    }
  }
  return matrix;
};

const generatorNewCard = () => {
  const index = Math.floor(Math.random() * 26);
  const weight = Math.floor(Math.random() * 26);
  return {letter: tile.CHARS[index], w: tile.WEIGHTS[weight], selected: false};
};

const getNewWord = async () => {
  let tempWord = [];
  const firstCard = await generatorNewCard();
  const keyDic = await dictionary[firstCard.letter.toLowerCase()].filter(
    (word) => word.length < 7,
  );

  const keyDicIndex = Math.floor(Math.random() * keyDic.length);
  const word = keyDic[keyDicIndex];
  const wordArray = word ? word.split('') : [];

  for (let i = 0; i < 7; i++) {
    if (i < wordArray.length) {
      tempWord.push({
        letter: wordArray[i].toUpperCase(),
        w: tile.WEIGHTS[Math.floor(Math.random() * 26)],
        selected: false,
      });
    } else {
      tempWord.push(generatorNewCard());
    }
  }
  console.log('word', word);
  return tempWord
    .sort(() => Math.random() - 0.5)
    .map((item, index) => ({...item, id: index}));
};

const isAvailableWord = async (word, list) => {
  const findWord = await list.find((item) => item === word.toLowerCase());
  if (findWord) {
    return true;
  }
  return false;
};

const getAvailableWords = async (char) => {
  const filterDic = await dictionary[char.toLowerCase()];
  return filterDic;
};

const getWeight = async (word, tiles) => {
  let dw = 1;
  let weight = 0;
  let usedTile = 0;
  const usedTiles = tiles.filter((item) => item.cardId === -2);
  if (usedTiles.length > 0) {
    usedTile = 1;
  }
  await word.forEach((item) => {
    const t_weight = tiles.find((tileItem) => tileItem.cardId === item.id);
    if (t_weight) {
      if (t_weight.w === 2) {
        dw = 2;
      }
      if (t_weight.w === 4) {
        dw = 3;
      }
    }
    weight = weight + item.w;
  });
  return weight * dw + usedTile;
};

export {
  defineMatrix,
  generatorNewCard,
  getNewWord,
  isAvailableWord,
  getAvailableWords,
  getWeight,
};
