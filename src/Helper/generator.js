import {tile} from '../constants';

const defineMatrix = () => {
  let matrix = [];
  for (let i = 0; i < 15; i++) {
    matrix[i] = [];
    for (let j = 0; j < 15; j++) {
      let id = i * 15 + j;
      const point = tile.COLOR_TILE_BOARD.find(
        (item) => item.col === j && item.row === i,
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

export {defineMatrix};
