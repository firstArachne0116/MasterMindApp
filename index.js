import {AppRegistry} from 'react-native';
import AppRoute from './AppRoute';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppRoute);
