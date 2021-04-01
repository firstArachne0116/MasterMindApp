import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';

const getUnFillClassName = (w) => {
  if (w === 1) {
    return styles.dlTile;
  }
  if (w === 2) {
    return styles.dwTile;
  }
  if (w === 3) {
    return styles.tlTile;
  }
  if (w === 4) {
    return styles.twTile;
  }
  if (w === 5) {
    return styles.qlTile;
  }
  return styles.tile;
};

export const Tile = ({
  tile,
  onSelectTile,
  onReturnCard,
  success,
  lastWordTiles,
}) => {
  const isLastWordTile = !!lastWordTiles.find(
    (wordTile) => wordTile.row === tile.row && wordTile.col === tile.col,
  );
  if (isLastWordTile) {
    console.log(isLastWordTile);
  }
  return (
    <View underlayColor="transparent">
      <>
        {!tile.fill && (
          <TouchableOpacity
            style={getUnFillClassName(tile.w)}
            onPress={() => onSelectTile(tile)}>
            {tile.id === 112 ? (
              <AntDesign name="star" style={styles.starTile} />
            ) : (
              <Text style={styles.gameboxTitle}>{tile.letter}</Text>
            )}
          </TouchableOpacity>
        )}
        {tile.fill && tile.status === 'board' && (
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            colors={
              isLastWordTile ? ['#FFEE00', '#FFEE00'] : ['#F6E5B0', '#E6BC5B']
            }
            style={[styles.tile, styles.fillTile]}>
            <Text style={[styles.fillTitle, styles.value]}>{tile.value}</Text>
            <Text style={styles.fillTitle}>{tile.letter}</Text>
          </LinearGradient>
        )}
        {tile.fill && tile.status === 'new' && (
          <View style={[styles.tile, styles.newTile]}>
            <Text style={[styles.fillTitle, styles.value]}>{tile.value}</Text>
            <Text style={styles.fillTitle}>{tile.letter}</Text>
          </View>
        )}
        {tile.fill &&
          tile.status !== 'board' &&
          tile.status !== 'new' &&
          success && (
            <TouchableOpacity
              style={[styles.tile, styles.cardTile]}
              onPress={() => onReturnCard(tile)}>
              <Text style={[styles.fillTitle, styles.value]}>{tile.value}</Text>
              <Text style={styles.fillTitle}>{tile.letter}</Text>
            </TouchableOpacity>
          )}
        {tile.fill &&
          tile.status !== 'board' &&
          tile.status !== 'new' &&
          !success && (
            <TouchableOpacity
              style={[styles.tile, styles.dangerTile]}
              onPress={() => onReturnCard(tile)}>
              <Text style={[styles.dangerTitle, styles.value]}>
                {tile.value}
              </Text>
              <Text style={styles.dangerTitle}>{tile.letter}</Text>
            </TouchableOpacity>
          )}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  dwTile: {
    height: 22,
    width: 22,
    backgroundColor: '#21AFCE',
    textAlign: 'center',
    alignItems: 'center',
    paddingTop: 2,
    borderRadius: 5,
  },
  twTile: {
    height: 22,
    width: 22,
    backgroundColor: '#FC5757',
    textAlign: 'center',
    alignItems: 'center',
    paddingTop: 2,
    borderRadius: 5,
  },
  dlTile: {
    height: 22,
    width: 22,
    backgroundColor: '#E8A368',
    textAlign: 'center',
    alignItems: 'center',
    paddingTop: 2,
    borderRadius: 5,
  },
  tlTile: {
    height: 22,
    width: 22,
    backgroundColor: '#6F4CE5',
    textAlign: 'center',
    alignItems: 'center',
    paddingTop: 2,
    borderRadius: 5,
  },
  qlTile: {
    height: 22,
    width: 22,
    backgroundColor: '#139B78',
    textAlign: 'center',
    alignItems: 'center',
    paddingTop: 2,
    borderRadius: 5,
  },
  starTile: {
    color: '#FFCB00',
    textTransform: 'uppercase',
    fontSize: 18,
  },
  fillTitle: {
    textTransform: 'uppercase',
    fontSize: 14,
    color: '#9b5f1a',
  },
  newTile: {
    backgroundColor: '#A3FF00',
  },
  lastTile: {
    backgroundColor: '#FFFF00',
  },
  cardTile: {
    backgroundColor: '#FFD819',
  },
  dangerTitle: {
    textTransform: 'uppercase',
    fontSize: 14,
    color: '#FFF',
  },
  successTile: {
    backgroundColor: 'green',
  },
  dangerTile: {
    backgroundColor: '#f90000',
  },
  tile: {
    height: 22,
    width: 22,
    backgroundColor: '#f3f2f2',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gameboxTitle: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  value: {
    fontSize: 7,
    top: 0,
    left: 2,
    position: 'absolute',
  },
});
