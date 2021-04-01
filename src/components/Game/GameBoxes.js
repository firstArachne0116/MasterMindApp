import React, {Component, Fragment} from 'react';
import {StyleSheet, View} from 'react-native';
import {Tile} from './Tile';

class GameBox extends Component {
  renderRow = (row, index) => {
    const {
      handleSelectTile,
      handleReturnCard,
      success,
      lastWordTiles,
    } = this.props;
    if (row.length > 0) {
      return (
        <View style={styles.innerWrapper} key={index}>
          {row.map((tile, tileIndex) => (
            <Tile
              key={'tile' + tileIndex}
              tile={tile}
              lastWordTiles={lastWordTiles}
              onSelectTile={handleSelectTile}
              onReturnCard={handleReturnCard}
              success={success}
            />
          ))}
        </View>
      );
    } else {
      return <></>;
    }
  };

  render() {
    const {data, tiles, cards} = this.props;
    const renderData = [];
    for (let i = 0; i < 15; i++) {
      renderData[i] = [];
      for (let j = 0; j < 15; j++) {
        renderData[i][j] = data[i][j];
      }
    }
    tiles.map((tile) => {
      renderData[tile.row][tile.col] = {...tile, fill: true, type: 'tile'};
    });
    cards.map((card) => {
      if (card.row !== undefined) {
        renderData[card.row][card.col] = {...card, fill: true, type: 'card'};
      }
    });
    return (
      <Fragment>
        {renderData.map((row, index) => this.renderRow(row, index))}
      </Fragment>
    );
  }
}

export default GameBox;

const styles = StyleSheet.create({
  innerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
});
