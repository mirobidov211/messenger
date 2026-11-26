import { create } from 'zustand';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return true;
  try {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
  } catch (e) {}
  return true; // default dark
};

const initialDark = getInitialTheme();
if (typeof document !== 'undefined') {
  if (initialDark) {
    document.documentElement.classList.add('dark');
    document.body?.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.body?.classList.remove('dark');
  }
}

export const useUiStore = create((set, get) => ({
  isSidebarOpen: true,
  currentView: 'chats', // 'chats' | 'profile' | 'settings'
  isDrawerOpen: false,
  isEditingProfile: false,
  isDarkMode: initialDark,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setCurrentView: (view) => set({ currentView: view }),
  setIsDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  setIsEditingProfile: (isEditing) => set({ isEditingProfile: isEditing }),
  toggleDarkMode: (value) => {
    const current = get().isDarkMode;
    const nextMode = value !== undefined ? Boolean(value) : !current;
    try {
      localStorage.setItem('theme', nextMode ? 'dark' : 'light');
      if (nextMode) {
        document.documentElement.classList.add('dark');
        document.body?.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body?.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
    set({ isDarkMode: nextMode });
  },
}));
