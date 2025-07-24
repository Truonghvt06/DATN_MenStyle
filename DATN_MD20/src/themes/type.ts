export type ThemeType = {
  mode: 'light' | 'dark';

  background: string;
  card: string;
  background_item: string;
  background_modal: string;
  background_pro: string;
  background_cate: string;
  background_header: string;
  background_login: string;
  background_img: string;
  background_input: string;

  text: string;
  text_gray: string;
  icon: string;

  shadow_color: string;
  border_color: string;

  primary: string;
  gray: string;
  sky_blue: string;
  danger: string;
  placeholderTextColor: string;

  success: string;
  blue1: string;
  blue2: string;
  orange: string;

  // Bổ sung cho giá và discount
  price_original: string;
  price_current: string;
  discount_badge_bg: string;
  discount_text: string;
};
