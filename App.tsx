import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  // The main App component renders the AppNavigator which contains our navigation logic
  // This allows us to switch between different screens like Login and Home
  return <AppNavigator />;
}