export type ThemeType = {
  mode: 'light' | 'dark';      // Chế độ sáng hoặc tối
  dark: boolean;               // true nếu là dark mode

  background: string;          // Màu nền chính
  text: string;                // Màu chữ chính
  card: string;                // Màu nền card (khác background)
  border: string;              // Màu viền

  primary: string;             // Màu chính
  danger: string;              // Màu cảnh báo
  success: string;             // Màu thành công

  blue1: string;
  blue2: string;
  orange: string;

  gray: string;                // Màu chữ/viền phụ
  shadow: string;              // Màu đổ bóng
  white: string;               // Màu trắng (cố định)
};
