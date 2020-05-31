import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import DrawerContent from './src/Navigation';

function App() {
  return (
    <NavigationContainer>
      <DrawerContent />
    </NavigationContainer>
  );
}

export default App;
