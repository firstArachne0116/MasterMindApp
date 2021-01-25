import React from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {theme} from '../constants';

const ScreenContainer = (props) => {
  const {children, style} = props;
  return (
    <View style={[styles.container, style]}>
      <SafeAreaView style={styles.container}>{children}</SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});
export default ScreenContainer;
