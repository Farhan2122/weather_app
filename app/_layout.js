
import { Stack } from 'expo-router';

import { StatusBar } from 'expo-status-bar';

import 'react-native-reanimated';
import "../global.css";
import React from 'react';



export default function RootLayout() {
  
  
   

  

  return (
   <>
      <Stack initialRouteName='HomeScreen'>
        <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
        
      </Stack>
      <StatusBar style="auto" />
      </>
   
  );
}
