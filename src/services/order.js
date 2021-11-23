import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from "../config";

export const getHistoryOrder = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${baseUrl}/api/transaction/user/history`, { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }).then(res => res.data.data).catch(e => console.log(e.response.data));
    return response;
}

export const storeOrder = async (data) => {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.post(`${baseUrl}/api/transaction`, data, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.data.data).catch(e => console.log(e.response.data));
    return response;
}