import {Text, TextProps, TextStyle} from 'react-native';
import {colors} from '../../../themes/colors';
import {useAppTheme} from '../../../themes/ThemeContext'; // ✅ Thêm

interface Props extends TextProps {
  color?: string;
  medium?: boolean;
  bold?: boolean;
  style?: TextStyle;
}

interface PropsSizeCustom extends TextProps, Props {
  size: number;
  style?: TextStyle | any;
}

export const TextSmall = (props: Props) => {
  const theme = useAppTheme(); // ✅
  const {
    color = theme.text, // ✅ dùng theme.text nếu không truyền
    medium = false,
    bold = false,
    style,
  } = props;

  const renderBold = (): '500' | 'bold' | 'normal' => {
    if (medium) return '500';
    if (bold) return 'bold';
    return 'normal';
  };

  return (
    <Text
      {...props}
      style={[
        {
          color,
          fontSize: 14,
          lineHeight: 14 * 1.5,
          fontWeight: renderBold(),
        },
        style,
      ]}
    />
  );
};

export const TextMedium = (props: Props) => {
  const theme = useAppTheme(); // ✅
  const {
    color = theme.text,
    medium = false,
    bold = false,
    style,
  } = props;

  const renderBold = (): '500' | 'bold' | 'normal' => {
    if (medium) return '500';
    if (bold) return 'bold';
    return 'normal';
  };

  return (
    <Text
      {...props}
      style={[
        {
          color,
          fontSize: 16,
          lineHeight: 16 * 1.5,
          fontWeight: renderBold(),
        },
        style,
      ]}
    />
  );
};

export const TextHeight = (props: Props) => {
  const theme = useAppTheme(); // ✅
  const {
    color = theme.text,
    medium = false,
    bold = false,
    style,
  } = props;

  const renderBold = (): '500' | 'bold' | 'normal' => {
    if (medium) return '500';
    if (bold) return 'bold';
    return 'normal';
  };

  return (
    <Text
      {...props}
      style={[
        {
          color,
          fontSize: 18,
          lineHeight: 18 * 1.5,
          fontWeight: renderBold(),
        },
        style,
      ]}
    />
  );
};

export const TextSizeCustom = (props: PropsSizeCustom) => {
  const theme = useAppTheme(); // ✅
  const {
    color = theme.text,
    medium = false,
    bold = false,
    size,
    style,
  } = props;

  const renderBold = (): '500' | 'bold' | 'normal' => {
    if (medium) return '500';
    if (bold) return 'bold';
    return 'normal';
  };

  return (
    <Text
      {...props}
      style={[
        {
          color,
          fontSize: size,
          lineHeight: size * 1.5,
          fontWeight: renderBold(),
        },
        style,
      ]}
    />
  );
};
