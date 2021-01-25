import React from 'react';
import {Provider} from 'react-redux';
import RootScreen from './App';
import {store, persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';

const AppRoute = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootScreen />
      </PersistGate>
    </Provider>
  );
};

export default AppRoute;
