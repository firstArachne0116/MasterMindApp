import React from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const getClassName = (w) => {
  if (w === -1) {
    return styles.starTile;
  }
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
  return styles.tile;
};

export const Tile = ({tile, onSelectTile}) => {
  return (
    <TouchableHighlight
      onPress={() => onSelectTile(tile)}
      underlayColor="transparent">
      <>
        {!tile.fill && (
          <View style={getClassName(tile.w)}>
            {tile.id === 112 ? (
              <AntDesign name="star" style={styles.gameboxTitle} />
            ) : (
              <Text style={styles.gameboxTitle}>{tile.letter}</Text>
            )}
          </View>
        )}
        {tile.fill && tile.success === undefined && (
          <View style={styles.fillTile}>
            <Text style={styles.fillTitle}>{tile.letter}</Text>
          </View>
        )}
        {tile.success && tile.success !== undefined && tile.fill && (
          <View style={styles.successTile}>
            <Text style={styles.colorTitle}>{tile.letter}</Text>
          </View>
        )}
        {!tile.success && tile.success !== undefined && tile.fill && (
          <View style={styles.dangerTile}>
            <Text style={styles.colorTitle}>{tile.letter}</Text>
          </View>
        )}
      </>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 50,
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
  starTile: {
    backgroundColor: '#fe6738',
    height: 22,
    width: 22,
    paddingHorizontal: 5,
    paddingTop: 4,
    borderRadius: 5,
  },
  fillTile: {
    backgroundColor: '#EAC269',
    height: 22,
    width: 22,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fillTitle: {
    textTransform: 'uppercase',
    fontSize: 20,
    color: '#9b5f1a',
    fontWeight: 'bold',
  },
  colorTitle: {
    textTransform: 'uppercase',
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  successTile: {
    backgroundColor: 'green',
    height: 22,
    width: 22,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerTile: {
    backgroundColor: '#f90000',
    height: 22,
    width: 22,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
