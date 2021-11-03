import React, {useEffect, useState} from 'react';
import * as LocalAuthentication from 'expo-local-authentication'
import { StyleSheet, Text, View, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
    //update state if device supports biometric or not
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
 
  const [isBioMetric, setIsBioMetric] = useState(true);
  
  // this will hardcode the 'crowdFactureUser' (for testing purposes)
  // const storeData = async (value) => {
  //   try {
  //     await AsyncStorage.setItem('crowdFactureUser', value)

  //     console.log('Success')
  //   } catch (e) {
  //       console.log('error', e)
  //     // saving error
  //   }
  // }

  useEffect(() =>{
    // storeData('crowdFactureUser');

    // This checks if there is a save value in the storage 
    AsyncStorage.getItem('crowdFactureUser').then(value =>{
      if(value === null) setIsBioMetric(false)
    })
  },[])

  // Check if hardware supports biometrics
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      console.log('compatible', compatible)
      setIsBiometricSupported(compatible);
    })();
  },[]);

  const logUserIn  = (userEmail, password) =>{
    //do all your password and user name auth
    //...
    //..
    //.
    //if yes the log user in and execute code the below (basically)
    setAuthorization(userEmail)
  }


   //this functions is called on each login
   const setAuthorization = async (UserEmail) => {
    try {
      // the app stores user email on the device storage
      //the device will use this email in combination with then fingerprint to authenticate the user
      AsyncStorage.setItem('UserEmail', UserEmail)
    } catch (err) {
      console.log('Error UserEmail: ', err);
    }
  }

  //this function is called by your biometric button
  //where the user then registers his/her biometric

  const onFaceId = async () => {
    try {
          // Checking if device is compatible
          const isCompatible = await LocalAuthentication.hasHardwareAsync();
          if (!isCompatible) {
            throw new Error('Your device isn\'t compatible.')
          }

          // Checking if device has biometrics records
          const isEnrolled = await LocalAuthentication.isEnrolledAsync();
          if (!isEnrolled) {
            throw new Error('No Faces / Fingers found.')
          }

          // Authenticate user
          const auth =  await LocalAuthentication.authenticateAsync();
          if(auth.success){
            AsyncStorage.getItem('crowdFactureUser').then(value =>{
              // logUserIn(value)
              Alert.alert('Authenticated', `Welcome back ! ${value}`)
            })
          }else{
            Alert.alert( 'Biometric record not found',  'Please verify your identity with your password')
          }
    } catch (error) {
      Alert.alert('An error as occured', error?.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      {
        isBioMetric &&  
        <TouchableOpacity style={styles.smBtn} onPress={onFaceId}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/890/890122.png'}} style={styles.btnImage}/>
        </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smBtn: {
    marginLeft: 20,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 2
  },
  btnImage: {
    width: 40,
    height: 40,
  },
});
