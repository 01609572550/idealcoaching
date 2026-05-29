import { create } from 'zustand';

const QUEUE_KEY = 'ideal_offline_mutation_queue';

function loadQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}

function persist(items) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

export const useOfflineQueue = create((set, get) => ({
  items: loadQueue(),
  online: navigator.onLine,
  syncing: false,
  enqueue(task) {
    const items = [...get().items, { id: crypto.randomUUID(), createdAt: new Date().toISOString(), attempts: 0, ...task }];
    persist(items);
    set({ items });
  },
  remove(id) {
    const items = get().items.filter(item => item.id !== id);
    persist(items);
    set({ items });
  },
  setOnline(online) {
    set({ online });
  },
  setSyncing(syncing) {
    set({ syncing });
  }
}));

window.addEventListener('online', () => useOfflineQueue.getState().setOnline(true));
window.addEventListener('offline', () => useOfflineQueue.getState().setOnline(false));
