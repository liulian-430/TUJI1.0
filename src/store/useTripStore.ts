import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as generateUUID } from 'uuid';

// POI 类型定义
export interface POI {
  id: string;
  name: string;
  city: string;
  address: string;
  type: '景点' | '美食' | '住宿' | '交通';
  rating: number;
  price: number;
  openTime: string;
  description: string;
  images: string[];
  latitude: number;
  longitude: number;
}

// 每日行程项
export interface DayItem {
  id: string;
  poiId: string;
  poi: POI;
  startTime: string;
  endTime: string;
  order: number;
}

// 每日行程
export interface DaySchedule {
  dayIndex: number;
  items: DayItem[];
}

// 行程
export interface Trip {
  id: string;
  userId?: string;
  name: string;
  destination: string;
  days: number;
  nights: number;
  people: number;
  startDate: string;
  status: 'planning' | 'ongoing' | 'completed';
  schedule: DaySchedule[];
  createdAt: string;
  updatedAt: string;
}

// 预算
export interface Budget {
  tripId: string;
  totalBudget: number;
  transportation: number;
  accommodation: number;
  food: number;
  ticket: number;
  shopping: number;
  other: number;
}

// 花费记录
export interface Expense {
  id: string;
  tripId: string;
  category: 'transportation' | 'accommodation' | 'food' | 'ticket' | 'shopping' | 'other';
  amount: number;
  date: string;
  note: string;
  attachment?: string;
}

interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  pois: POI[];
  budgets: Record<string, Budget>;
  expenses: Record<string, Expense[]>;
  favorites: string[];

  // 行程操作
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt' | 'schedule'>) => Trip;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  copyTrip: (id: string) => Trip;

  // POI 操作
  addPOI: (poi: POI) => void;
  setPOIs: (pois: POI[]) => void;

  // 预算操作
  setBudget: (tripId: string, budget: Budget) => void;
  getBudget: (tripId: string) => Budget | undefined;

  // 花费操作
  addExpense: (tripId: string, expense: Omit<Expense, 'id'>) => Expense;
  updateExpense: (tripId: string, expenseId: string, updates: Partial<Expense>) => void;
  deleteExpense: (tripId: string, expenseId: string) => void;
  getExpenses: (tripId: string) => Expense[];

  // 收藏操作
  addFavorite: (poiId: string) => void;
  removeFavorite: (poiId: string) => void;
  isFavorite: (poiId: string) => boolean;

  // 行程安排操作
  addDayItem: (tripId: string, dayIndex: number, item: Omit<DayItem, 'id' | 'order'>) => void;
  updateDayItem: (tripId: string, dayIndex: number, itemId: string, updates: Partial<DayItem>) => void;
  deleteDayItem: (tripId: string, dayIndex: number, itemId: string) => void;
  reorderDayItems: (tripId: string, dayIndex: number, itemIds: string[]) => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      trips: [],
      currentTrip: null,
      pois: [],
      budgets: {},
      expenses: {},
      favorites: [],

      // 行程操作
      addTrip: (tripData) => {
        const trip: Trip = {
          ...tripData,
          id: generateUUID(),
          schedule: Array.from({ length: tripData.days }, (_, i) => ({
            dayIndex: i + 1,
            items: [],
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ trips: [...state.trips, trip] }));
        return trip;
      },

      updateTrip: (id, updates) => {
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === id
              ? { ...trip, ...updates, updatedAt: new Date().toISOString() }
              : trip
          ),
          currentTrip:
            state.currentTrip?.id === id
              ? { ...state.currentTrip, ...updates, updatedAt: new Date().toISOString() }
              : state.currentTrip,
        }));
      },

      deleteTrip: (id) => {
        set((state) => ({
          trips: state.trips.filter((trip) => trip.id !== id),
          currentTrip: state.currentTrip?.id === id ? null : state.currentTrip,
        }));
      },

      setCurrentTrip: (trip) => {
        set({ currentTrip: trip });
      },

      copyTrip: (id) => {
        const original = get().trips.find((t) => t.id === id);
        if (!original) throw new Error('行程不存在');

        const copied: Trip = {
          ...original,
          id: generateUUID(),
          name: `${original.name} (副本)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ trips: [...state.trips, copied] }));
        return copied;
      },

      // POI 操作
      addPOI: (poi) => {
        set((state) => ({ pois: [...state.pois, poi] }));
      },

      setPOIs: (pois) => {
        set({ pois });
      },

      // 预算操作
      setBudget: (tripId, budget) => {
        set((state) => ({
          budgets: { ...state.budgets, [tripId]: budget },
        }));
      },

      getBudget: (tripId) => {
        return get().budgets[tripId];
      },

      // 花费操作
      addExpense: (tripId, expenseData) => {
        const expense: Expense = {
          ...expenseData,
          id: generateUUID(),
        };
        set((state) => ({
          expenses: {
            ...state.expenses,
            [tripId]: [...(state.expenses[tripId] || []), expense],
          },
        }));
        return expense;
      },

      updateExpense: (tripId, expenseId, updates) => {
        set((state) => ({
          expenses: {
            ...state.expenses,
            [tripId]: state.expenses[tripId]?.map((exp) =>
              exp.id === expenseId ? { ...exp, ...updates } : exp
            ) || [],
          },
        }));
      },

      deleteExpense: (tripId, expenseId) => {
        set((state) => ({
          expenses: {
            ...state.expenses,
            [tripId]: state.expenses[tripId]?.filter((exp) => exp.id !== expenseId) || [],
          },
        }));
      },

      getExpenses: (tripId) => {
        return get().expenses[tripId] || [];
      },

      // 收藏操作
      addFavorite: (poiId) => {
        set((state) => ({
          favorites: [...state.favorites, poiId],
        }));
      },

      removeFavorite: (poiId) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== poiId),
        }));
      },

      isFavorite: (poiId) => {
        return get().favorites.includes(poiId);
      },

      // 行程安排操作
      addDayItem: (tripId, dayIndex, itemData) => {
        const trip = get().trips.find((t) => t.id === tripId);
        if (!trip) return;

        const daySchedule = trip.schedule.find((d) => d.dayIndex === dayIndex);
        if (!daySchedule) return;

        const item: DayItem = {
          ...itemData,
          id: generateUUID(),
          order: daySchedule.items.length + 1,
        };

        const updatedSchedule = trip.schedule.map((day) =>
          day.dayIndex === dayIndex
            ? { ...day, items: [...day.items, item] }
            : day
        );

        get().updateTrip(tripId, { schedule: updatedSchedule });
      },

      updateDayItem: (tripId, dayIndex, itemId, updates) => {
        const trip = get().trips.find((t) => t.id === tripId);
        if (!trip) return;

        const updatedSchedule = trip.schedule.map((day) =>
          day.dayIndex === dayIndex
            ? {
                ...day,
                items: day.items.map((item) =>
                  item.id === itemId ? { ...item, ...updates } : item
                ),
              }
            : day
        );

        get().updateTrip(tripId, { schedule: updatedSchedule });
      },

      deleteDayItem: (tripId, dayIndex, itemId) => {
        const trip = get().trips.find((t) => t.id === tripId);
        if (!trip) return;

        const updatedSchedule = trip.schedule.map((day) =>
          day.dayIndex === dayIndex
            ? {
                ...day,
                items: day.items
                  .filter((item) => item.id !== itemId)
                  .map((item, idx) => ({ ...item, order: idx + 1 })),
              }
            : day
        );

        get().updateTrip(tripId, { schedule: updatedSchedule });
      },

      reorderDayItems: (tripId, dayIndex, itemIds) => {
        const trip = get().trips.find((t) => t.id === tripId);
        if (!trip) return;

        const daySchedule = trip.schedule.find((d) => d.dayIndex === dayIndex);
        if (!daySchedule) return;

        const reorderedItems = itemIds
          .map((id, idx) => {
            const item = daySchedule.items.find((i) => i.id === id);
            return item ? { ...item, order: idx + 1 } : null;
          })
          .filter(Boolean) as DayItem[];

        const updatedSchedule = trip.schedule.map((day) =>
          day.dayIndex === dayIndex
            ? { ...day, items: reorderedItems }
            : day
        );

        get().updateTrip(tripId, { schedule: updatedSchedule });
      },
    }),
    {
      name: 'trip-storage',
      version: 1,
    }
  )
);