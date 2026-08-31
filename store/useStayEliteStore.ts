import { create } from 'zustand';

interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
}

interface StayEliteStore {
  favorites: Property[];
  addFavorite: (property: Property) => void;
  removeFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
}

export const useStayEliteStore = create<StayEliteStore>((set, get) => ({
  favorites: [],
  
  addFavorite: (property) => set((state) => ({
    favorites: [...state.favorites, property],
  })),
  
  removeFavorite: (propertyId) => set((state) => ({
    favorites: state.favorites.filter((p) => p.id !== propertyId),
  })),
  
  isFavorite: (propertyId) => {
    const state = get();
    return state.favorites.some((p) => p.id === propertyId);
  },
}));
