import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/Store';
import AppNavigation from './src/navigation/AppNavigation';
import { ThemeProvider } from './src/themes/ThemeContext';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AppNavigation />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;