import { ThemeType } from './type';

export const lightTheme: ThemeType = {
  mode: 'light',

  background: '#EEEEEE',
  card: '#FFFFFF',              // Màu nền cho card
  background_item: '#FFFFFF',
  background_modal: '#CCCCCC',
  background_pro: '#FFFFFF',
  background_cate: '#C0C0C0',
  background_header: '#EEEEEE',
  background_login: 'rgba(238, 234, 234, 0.7)',
  background_img: 'rgba(0, 0, 0, 0.3)',
  background_input: 'rgba(0, 0, 0, 0.1)',

  text: '#000000',
  text_gray: '#C0C0C0',
  icon: '#000000',
  shadow_color: '#1e1e1e',
  border_color: '#1e1e1e',
  
  primary: '#007aff',
  gray: '#fff',
  sky_blue: '#E5F6FD',
  danger: '#ff3b30',
  placeholderTextColor: '#777777',

  success: '#28a745',
  blue1: '#e3f2fd',
  blue2: '#90caf9',
  orange: '#ff9800',

  // Bổ sung cho giá và discount
  price_original: '#a0a0a0',
  price_current: '#007aff',
  discount_badge_bg: 'red',
  discount_text: '#fff',
};

export const darkTheme: ThemeType = {
  mode: 'dark',

  background: '#1e1e1e',
  card: '#232326',              // Màu nền cho card tối
  background_item: '#232326',
  background_modal: '#232326',
  background_pro: '#232326',
  background_cate: '#fff',
  background_header: '#1e1e1e',
  background_login: 'rgba(0, 0, 0, 0.7)',
  background_img: 'rgba(255, 255, 255, 0.1)',
  background_input: 'rgba(255, 255, 255, 0.1)',

  text: '#fff',
  text_gray: '#C0C0C0',
  icon: '#fff',
  shadow_color: '#C0C0C0',
  border_color: '#fff',

  primary: '#007aff',
  gray: '#8B8B8B',
  sky_blue: '#1e3a5c',
  danger: '#ff453a',
  placeholderTextColor: '#C0C0C0',

  success: '#28c76f',
  blue1: '#0d253f',
  blue2: '#1e3a5c',
  orange: '#ffb74d',

  // Bổ sung cho giá và discount
  price_original: '#888888',
  price_current: '#007aff',
  discount_badge_bg: 'red',
  discount_text: '#fff',
};
