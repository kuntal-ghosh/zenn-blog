import axios from 'axios';
import { User } from '../types';

const API_URL = '/api/users';

export const fetchUserProfile = async (userId: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
};

export const updateUserProfile = async (userId: string, userData: Partial<User>): Promise<User> => {
    const response = await axios.put(`${API_URL}/${userId}`, userData);
    return response.data;
};

export const deleteUserProfile = async (userId: string): Promise<void> => {
    await axios.delete(`${API_URL}/${userId}`);
};