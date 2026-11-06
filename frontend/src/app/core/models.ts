export interface User {
  id?: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface WeatherResponse {
  location?: {
    name?: string;
    country?: string;
    localtime?: string;
    lat?: number;
    lon?: number;
  };
  current?: {
    temp_c?: number;
    feelslike_c?: number;
    humidity?: number;
    wind_kph?: number;
    condition?: { text?: string; icon?: string };
  };
}

export interface Favorite {
  id: number;
  city: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface SearchHistory {
  id: number;
  city: string;
  country?: string;
  searched_at?: string;
}
