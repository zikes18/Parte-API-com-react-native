
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from '@/hooks/use-color-scheme';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  colorScheme: Theme;
  toggleColorScheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  colorScheme: 'light',
  toggleColorScheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useSystemColorScheme();
  const [colorScheme, setColorScheme] = useState<Theme>(systemColorScheme ?? 'light');

  const toggleColorScheme = () => {
    setColorScheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    if (systemColorScheme) {
      setColorScheme(systemColorScheme);
    }
  }, [systemColorScheme]);

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
