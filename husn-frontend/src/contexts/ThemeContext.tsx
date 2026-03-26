import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void; // 1. أضفنا هذه عشان صفحة الإعدادات تستخدمها
  toggleTheme: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // استخدمنا 'husn-theme' ليتطابق مع كود صفحة الإعدادات
    return (localStorage.getItem('husn-theme') as Theme) || 'dark';
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('muted') === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('theme-light');
      root.classList.remove('dark'); // تأكدي من حذف class dark إذا كان موجود
    } else {
      root.classList.remove('theme-light');
      root.classList.add('dark');
    }
    localStorage.setItem('husn-theme', theme); // حفظ الثيم المختار
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      localStorage.setItem('muted', String(!prev));
      return !prev;
    });
  };

  return (
    // 2. أضفنا setTheme هنا في الـ value
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isMuted, toggleMute }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};