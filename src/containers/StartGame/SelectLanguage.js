/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {images, theme, scale} from '../../constants';
import {ScreenContainer, Header, MenuModal} from '../../components';
import Languages from '../../Helper/languages.json';

class SelectLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
    };
  }

  handleMenu = () => {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
    });
  };

  _handleModalButton = (route) => {
    const {navigation} = this.props;
    this.setState({isMenuOpen: false});
    navigation.navigate(route);
  };

  handleSelect = (item) => {
    const {navigation, route} = this.props;
    navigation.navigate('SessionInvitation', {
      type: route.params.type,
      language: item.code,
      player: route.params.palyer,
    });
  };

  render() {
    return (
      <ScreenContainer>
        <ImageBackground source={images.newGameBack} style={styles.bg_image}>
          <View style={styles.container}>
            <Header {...this.props} onMenubarHandle={this.handleMenu} />
            <View>
              <Text style={styles.chooseLang}>{'Choose your Language'}</Text>
              <ScrollView
                contentContainerStyle={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}
                style={styles.languageScroll}>
                {Languages.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => this.handleSelect(item)}
                      key={index.toString()}
                      style={styles.langButton}>
                      <Text style={{fontSize: 20, marginRight: 20}}>
                        {item.flag}
                      </Text>
                      <Text style={styles.languageStyle}>{item.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </ImageBackground>
        <MenuModal
          {...this.state}
          {...this.props}
          onMenubarHandle={this.handleMenu}
          onButtonHandle={this._handleModalButton}
        />
      </ScreenContainer>
    );
  }
}

export default SelectLanguage;

const styles = StyleSheet.create({
  bg_image: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    marginTop: scale(35),
    marginHorizontal: scale(18),
  },
  chooseLang: {
    color: theme.colors.white,
    fontFamily: theme.fonts.redHatBold,
    fontSize: 19,
    marginVertical: 22,
  },
  languageStyle: {
    fontSize: 15,
    fontFamily: theme.fonts.redHatBold,
    color: theme.colors.black1,
  },
  languageScroll: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    maxHeight: Dimensions.get('window').height - 220,
  },
  langButton: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
  },
});
