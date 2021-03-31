import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../../constants';

export const WordCard = ({cards, onSelectCard, onReplaceCard}) => {
  const [value, setValue] = useState('');
  return (
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
            {char.letter === ' ' ? (
              <TextInput
                onFocus={() => {}}
                onBlur={() => {
                  if (value) {
                    onReplaceCard(char.id, value);
                    setValue('');
                  }
                }}
                onChangeText={(txt) =>
                  setValue(txt.toUpperCase()[txt.length - 1])
                }
                value={value}
                style={styles.letter}
              />
            ) : (
              <TouchableHighlight
                onPress={() => onSelectCard(char)}
                underlayColor="transparent">
                {char.row === undefined ? (
                  <View style={styles.letterView}>
                    <Text style={styles.letterIndex}>
                      {char.letter ? char.value : ''}
                    </Text>
                    <Text style={styles.letter}>{char.letter}</Text>
                  </View>
                ) : (
                  <View style={styles.empty} />
                )}
              </TouchableHighlight>
            )}
          </LinearGradient>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  passView: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 25,
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
    fontSize: 14,
    color: theme.colors.brown,
    fontFamily: theme.fonts.redHatMedium,
  },
  letter: {
    color: theme.colors.brown,
    fontSize: 20,
    fontFamily: theme.fonts.redHatBold,
  },
  empty: {
    width: theme.SCREENWIDTH / 8.2,
    height: theme.SCREENWIDTH / 8.2,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: '#C9720D',
    borderStyle: 'dashed',
    backgroundColor: 'white',
  },
});
