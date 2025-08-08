import axios from 'axios';
import { ParkingLocation } from '../types/parking';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
});

export const fetchParkingLocations = async (): Promise<ParkingLocation[]> => {
  // TODO: Replace with real endpoint once backend is ready
  // return (await api.get('/v1/parking')).data.data;

  // Mock for now
  return [
    {
      id: '1',
      name: 'Federation Square Car Park',
      latitude: -37.817979,
      longitude: 144.969097,
      available: 42,
      capacity: 300,
      type: 'off_street',
      pricePerHour: 7.5,
      accessible: true,
      familyFriendly: true,
    },
    {
      id: '2',
      name: 'Collins St On-street',
      latitude: -37.81736,
      longitude: 144.96332,
      available: 5,
      capacity: 12,
      type: 'on_street',
      pricePerHour: 5.2,
      accessible: false,
      familyFriendly: false,
    },
  ];
};

export default api;


