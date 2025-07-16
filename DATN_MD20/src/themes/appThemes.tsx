import { ThemeType } from './type';

export const lightTheme: ThemeType = {
  mode: 'light',
  dark: false,

  background: '#FFFFFF',
  text: '#030101',
  card: '#f4f4f4',
  border: '#e0e0e0',

  primary: '#007aff',
  danger: '#ff3b30',
  success: '#28a745',

  blue1: '#007aff',
  blue2: '#5ac8fa',
  orange: '#ff9500',

  gray: '#8e8e93',
  shadow: 'rgba(0,0,0,0.1)',
  white: '#FFFFFF',
};

export const darkTheme: ThemeType = {
  mode: 'dark',
  dark: true,

  background: '#232326',
  text: '#FFFFFF',
  card: '#1e1e1e',
  border: '#3a3a3c',

  primary: '#0a84ff',
  danger: '#ff453a',
  success: '#28c76f',

  blue1: '#0a84ff',
  blue2: '#64d2ff',
  orange: '#ff9f0a',

  gray: '#a1a1a1',
  shadow: 'rgba(255,255,255,0.05)',
  white: '#FFFFFF',
};
