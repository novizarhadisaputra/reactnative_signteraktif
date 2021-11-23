import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from "../config";

export const getDataProfile = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${baseUrl}/api/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.data.data).catch(e => console.log(e));
    return response;
}

export const updateField = async (data, id) => {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.put(`${baseUrl}/api/user/${id}`, data, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.data.data).catch(e => console.log(e));
    return response;
}