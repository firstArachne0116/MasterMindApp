import React, {Component, Fragment} from 'react';
import {StyleSheet, View} from 'react-native';
import {Tile} from './Tile';
import {WordCard} from './WordCard';

class GameBox extends Component {
  renderRow = (row, index) => {
    const {handleSelectTile} = this.props;
    if (row.length > 0) {
      return (
        <View style={styles.innerWrapper} key={index}>
          {row.map((tile) => (
            <Tile key={tile.id} tile={tile} onSelectTile={handleSelectTile} />
          ))}
        </View>
      );
    } else {
      return <></>;
    }
  };

  render() {
    const {data, cards, handleSelectCard, handleReplaceCard} = this.props;
    return (
      <Fragment>
        <View style={styles.container}>
          {data.map((row, index) => this.renderRow(row, index))}
        </View>
        {cards && (
          <WordCard
            cards={cards}
            onSelectCard={handleSelectCard}
            onReplaceCard={handleReplaceCard}
          />
        )}
      </Fragment>
    );
  }
}

export default GameBox;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 80,
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 1,
    paddingHorizontal: 3,
    marginHorizontal: 10,
    flex: 1,
  },
  innerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  dwTile: {
    height: 22,
    width: 22,
    backgroundColor: '#ffa200',
    paddingLeft: 3,
    paddingTop: 2,
    borderRadius: 5,
  },
  twTile: {
    height: 22,
    width: 22,
    backgroundColor: '#ff78af',
    paddingLeft: 3,
    paddingTop: 2,
    borderRadius: 5,
  },
  dlTile: {
    height: 22,
    width: 22,
    backgroundColor: '#6ec94e',
    paddingLeft: 3,
    paddingTop: 2,
    borderRadius: 5,
  },
  tlTile: {
    height: 22,
    width: 22,
    backgroundColor: '#b7a6fe',
    paddingLeft: 3,
    paddingTop: 2,
    borderRadius: 5,
  },
  tile: {
    height: 22,
    width: 22,
    backgroundColor: '#f3f2f2',
    borderRadius: 5,
  },
  gameboxTitle: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 12,
  },
});
