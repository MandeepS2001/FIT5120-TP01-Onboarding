export type ParkingType = 'on_street' | 'off_street';

export interface ParkingLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  available: number;
  capacity?: number;
  type: ParkingType;
  pricePerHour?: number;
  accessible?: boolean;
  familyFriendly?: boolean;
}


