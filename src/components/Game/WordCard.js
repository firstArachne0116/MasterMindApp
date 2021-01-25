import React from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../../constants';

export const WordCard = ({cards, onSelectCard, onReplaceCard}) => (
  <View style={styles.passView}>
    {cards.map((char, i) => {
      return (
        <LinearGradient
          key={i.toString()}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          colors={[
            char.selected ? theme.colors.yellow2 : theme.colors.yellow1,
            char.selected ? theme.colors.yellow3 : theme.colors.yellow2,
          ]}
          style={styles.letterView}>
          <TouchableHighlight
            onPress={() =>
              char.letter ? onSelectCard(char) : onReplaceCard(char.id)
            }
            underlayColor="transparent">
            <View style={styles.letterView}>
              <Text style={styles.letterIndex}>
                {char.letter ? char.w : ''}
              </Text>
              <Text style={styles.letter}>{char.letter}</Text>
            </View>
          </TouchableHighlight>
        </LinearGradient>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  passView: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 23,
  },
  letterView: {
    width: theme.SCREENWIDTH / 8.2,
    height: theme.SCREENWIDTH / 8.2,
    borderRadius: 5,
    marginHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterIndex: {
    position: 'absolute',
    top: 4,
    left: 4,
    fontSize: 9,
    color: theme.colors.brown,
    fontFamily: theme.fonts.redHatMedium,
  },
  letter: {
    color: theme.colors.brown,
    fontSize: 20,
    fontFamily: theme.fonts.redHatBold,
  },
});
