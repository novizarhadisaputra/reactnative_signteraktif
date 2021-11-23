import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { useDispatch, useSelector } from 'react-redux';
import { CalendarIcon, ChatIcon, NotificationActiveIcon, NotificationIcon } from '../../assets/icons';
import { dummyPhoto } from '../../assets/images';
import { Gap, SelectForm } from '../../components';
import { tailwind } from '../../extra/tailwind';
import { changeFormatDate } from '../../helper/global';
import { getDataPartner } from '../../services';
import messaging from '@react-native-firebase/messaging';

const index = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const region = [t('all'), 'Yogyakarta', 'Boyolali'];
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    const [show, setShow] = useState(false)
    const { now, sex, province } = state.homeReducer;
    const [partners, setpartners] = useState([])
    const [mounted, setmounted] = useState(true)
    const { hasNotification, hasSubmit } = state.globalReducer;
    const borderActive = tailwind('border w-24 px-4 py-2 border-green-600 rounded-2xl bg-green-600');
    const borderNonActive = tailwind('border w-24 color-border-gray px-4 py-2 rounded-2xl');

    const changeRegion = async (selectedRegion) => {
        setmounted(true);
        const currentDate = moment().format("YYYY-MM-DD");
        let selected = moment(new Date(now)).tz('Asia/Jakarta').format("YYYY-MM-DD");
        if ((new Date(selected) > new Date(currentDate))) {
            selected = moment(new Date(now)).tz('Asia/Jakarta').format("YYYY-MM-DD");
        } else {
            selected = `${moment(new Date(now)).tz('Asia/Jakarta').format("YYYY-MM-DD")} ${moment().tz('Asia/Jakarta').format("HH:mm:ss")}`;
        }
        const response = await getDataPartner(selected, selectedRegion, sex).then(result => {
            setpartners(result.partners)
            setmounted(false);
        });
        dispatch({ type: 'SET_PROVINCE', value: { province: selectedRegion } });
    }

    const changeSex = async (selectedSex) => {
        setmounted(true);
        const currentDate = moment().format("YYYY-MM-DD");
        let selected = moment(new Date(now)).format("YYYY-MM-DD");
        if ((new Date(selected) > new Date(currentDate))) {
            selected = moment(new Date(now)).format("YYYY-MM-DD");
        } else {
            selected = moment(new Date(now)).format("YYYY-MM-DD HH:mm:ss");
        }
        const response = await getDataPartner(selected, province, selectedSex).then(result => {
            setpartners(result.partners)
            setmounted(false);
        });
        dispatch({ type: 'SET_SEX', value: { sex: selectedSex } });
    }

    const changeDate = async (selectedDate) => {
        const currentDate = moment().tz('Asia/Jakarta').format("YYYY-MM-DD");
        let selected = moment(new Date(selectedDate)).tz('Asia/Jakarta').format("YYYY-MM-DD");
        if ((new Date(selected) > new Date(currentDate))) {
            selected = moment(new Date(selectedDate)).tz('Asia/Jakarta').format("YYYY-MM-DD");
        } else {
            selected = moment(new Date(selectedDate)).tz('Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss");
        }
        setmounted(true);
        const response = await getDataPartner(selected, province, sex).then(result => {
            setpartners(result.partners)
            setmounted(false);
        });

        dispatch({ type: 'SET_DATE', value: { now: selectedDate } });
        setShow(!show);
    }

    const showCalendar = () => setShow(!show);
    const gotoParnerList = () => navigation.navigate('Partner');
    const gotoParnerDetail = (p) => {
        navigation.navigate('PartnerDetail', {
            screen: 'PartnerDetail',
            params: { partner: p },
        });

    }
    const gotoNotification = () => navigation.navigate('Notification')
    useEffect(() => {
        async function clearReduxLogin() {
            dispatch({ type: 'SET_HAS_SUBMIT', value: { hasSubmit: false } });
        }

        messaging()
            .getToken()
            .then(token => {
                console.log(`token`, token)
            });

        async function loadPartnerData() {
            let date = `${moment(new Date(now)).tz('Asia/Jakarta').format("YYYY-MM-DD")} ${moment().tz('Asia/Jakarta').format('HH:mm:ss')}`;
            const response = await getDataPartner(date, province, sex);
            setpartners(response.partners);
            setmounted(false);
        }



        if (mounted) {
            clearReduxLogin();
            loadPartnerData();
        }
        return () => {
            messaging().onTokenRefresh(token => {
                console.log(`token`, token)
            });
            setmounted(false);
        }
    }, [])

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <SafeAreaView>
                <View style={tailwind('w-full h-full bg-gray-100')}>
                    <View style={tailwind('absolute h-36 w-full bg-green-600')} />
                    <View style={tailwind('flex-row p-4 items-center justify-between')}>
                        <Text style={tailwind(`font-poppins-600 text-2xl text-white`)}>{'Signteraktif'}</Text>
                        <TouchableOpacity onPress={gotoNotification}>
                            {hasNotification ? <NotificationActiveIcon /> : <NotificationIcon />}
                        </TouchableOpacity>
                    </View>
                    <View style={tailwind('px-4 w-full')}>
                        <View style={tailwind('bg-white shadow-card rounded-2xl')}>
                            <View style={tailwind('px-4 py-5')}>
                                <Text style={tailwind(`font-poppins-600`)}>{t('Temukan juru bahasa isyarat terbaik ')}</Text>
                                <Gap size={'h-4'}></Gap>
                                <SelectForm
                                    action={changeRegion}
                                    backgroundColor={'bg-white'}
                                    borderColor={'border-gray-200'}
                                    defaultButtonText={'all'}
                                    data={region}
                                    label={t('selectRegion')}
                                />
                                <Gap size={'h-4'}></Gap>
                                <Text style={tailwind(`font-poppins-400 mb-2 opacity-70`)}>{t('chooseDate')}</Text>
                                <View style={tailwind('flex-row pl-4 border rounded-xl h-10 border-gray-200')}>
                                    <View style={tailwind('justify-center w-10/12')}>
                                        <Text style={tailwind(`font-poppins-400 text-sm text-left`)}>{changeFormatDate(now)}</Text>
                                    </View>
                                    <TouchableOpacity onPress={showCalendar} style={tailwind('bg-yellow-500 items-center rounded-r-xl justify-center w-2/12')}>
                                        <CalendarIcon></CalendarIcon>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    date={new Date(now)}
                                    isVisible={show}
                                    mode="date"
                                    onConfirm={changeDate}
                                    onCancel={showCalendar}
                                />
                            </View>
                        </View>
                        <Gap size={'h-8'}></Gap>

                        <View style={tailwind('flex-row items-center justify-between')}>
                            <Text style={tailwind(`font-poppins-600 text-base`)}>
                                {t('signLanguageInterpreter')}
                            </Text>
                            <TouchableOpacity onPress={gotoParnerList}>
                                <Text style={tailwind('text-green-600')}>{t('seeMore')}</Text>
                            </TouchableOpacity>
                        </View>
                        <Gap size={'h-4'}></Gap>
                        <View style={tailwind('flex-row w-11/12 justify-between')}>
                            <TouchableOpacity onPress={() => changeSex('All')} style={sex == 'All' ? borderActive : borderNonActive}>
                                <Text style={tailwind(`${sex == 'All' ? 'font-poppins-500 text-center text-white' : 'text-center font-poppins-400 opacity-60'}`)}>{t('all')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => changeSex('Man')} style={sex == 'Man' ? borderActive : borderNonActive}>
                                <Text style={tailwind(`${sex == 'Man' ? 'font-poppins-500 text-center text-white' : 'text-center font-poppins-400 opacity-60'}`)}>{t('man')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => changeSex('Woman')} style={sex == 'Woman' ? borderActive : borderNonActive}>
                                <Text style={tailwind(`${sex == 'Woman' ? 'font-poppins-500 text-center text-white' : 'text-center font-poppins-400 opacity-60'}`)}>{t('woman')}</Text>
                            </TouchableOpacity>
                        </View>
                        <Gap size={'h-4'}></Gap>
                        <ScrollView>
                            {
                                mounted ? <Text style={tailwind('font-poppins-400 text-lg')}>{'Loading......'}</Text> : partners.map((p, i) =>
                                    <TouchableOpacity key={i} onPress={() => gotoParnerDetail(p)} style={tailwind('flex-row shadow-card px-4 py-5 mb-3 items-center justify-between bg-white rounded-2xl')}>
                                        <Image source={dummyPhoto} style={tailwind('rounded-full w-10 h-10')} />
                                        <View style={tailwind('w-10/12 flex-row justify-between items-center')}>
                                            <View>
                                                <Text style={tailwind(`font-poppins-500 text-sm`)}>
                                                    {p.name}
                                                </Text>
                                                <Text style={tailwind(`font-poppins-400 text-xs`)}>
                                                    {`Tersedia pukul ${p.schedules[0].time_start} - ${p.schedules[0].time_end}`}
                                                </Text>
                                            </View>
                                            <View>
                                                <ChatIcon></ChatIcon>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

export default index

const styles = StyleSheet.create({})
