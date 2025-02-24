import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import store from './redux/store';
import RootNavigator from './navigations/RootNavigator';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getSocket} from './hooks/getSocket';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  useEffect(() => {
    getSocket(); // Connect to socket on app start
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaView className="flex-1">
        <GestureHandlerRootView style={{flex: 1}}>
          <RootNavigator />
        </GestureHandlerRootView>
      </SafeAreaView>
    </Provider>
  );
};

export default App;
