export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface Word {
  id: string;
  word: string;
  meaning: string;
  example: string;
  imageUrl: string;
  level: number; // 1-20 scale
  userId: string;
  createdAt: number;
  lastShownAt: number | null;
}

export interface AppSettings {
  notificationInterval: number; // in minutes
  userId: string;
}
