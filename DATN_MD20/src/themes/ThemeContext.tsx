import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { lightTheme, darkTheme } from './appThemes';
import { ThemeType } from './type';

const ThemeContext = createContext<ThemeType>(lightTheme);
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const mode = useSelector((state: RootState) => state.theme?.mode ?? 'light');
  const theme: ThemeType = mode === 'dark' ? darkTheme : lightTheme;
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useAppTheme = (): ThemeType => useContext(ThemeContext);
