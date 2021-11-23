import messaging from '@react-native-firebase/messaging';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { tailwind } from '../../extra/tailwind';

const index = ({ navigation }) => {
    useEffect(() => {
        async function requestUserPermission() {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('Authorization status:', authStatus);
            }
        }

        requestUserPermission();

        messaging().onMessage(async remoteMessage => {
            alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        });



        const goToLogin = () => {
            setTimeout(() => {
                navigation.navigate('ChooseLangue')
            }, 3000);
        }
        goToLogin();
        return () => {

        }
    }, [])

    return (
        <SafeAreaView style={tailwind('h-full w-full bg-green-600')}>
            <View style={tailwind('flex h-full w-full items-center justify-center ')}>
                <View style={tailwind('justify-start')}>
                    <Text style={tailwind(`text-gray-50 text-base font-poppins-500`)}>
                        Welcome to
                    </Text>
                    <Text style={tailwind(`text-white text-3xl font-poppins-600`)}>
                        SIGNTERAKTIF
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default index

const styles = StyleSheet.create({})
