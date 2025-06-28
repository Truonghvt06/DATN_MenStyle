import {Text, TextProps, TextStyle} from 'react-native';
import {colors} from '../../../themes/colors';

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
  const {color = colors.black, medium = false, bold = false, style} = props;
  const renderBold = (): '500' | 'bold' | 'normal' => {
    if (medium) {
      return '500';
    } else if (bold) {
      return 'bold';
    } else {
      return 'normal';
    }
  };
  return (
    <Text
      {...props}
      style={[
        {
          // textAlign: 'left',
          color: color,
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
  const {color = colors.black, medium = false, bold = false, style} = props;

  const renderBold = (): '500' | 'bold' | 'normal' => {
    if (medium) {
      return '500';
    } else if (bold) {
      return 'bold';
    } else {
      return 'normal';
    }
  };
  return (
    <Text
      {...props}
      style={[
        style,
        {
          // textAlign: 'left',
          color: color,
          fontSize: 16,
          lineHeight: 16 * 1.5,
          fontWeight: renderBold(),
        },
      ]}
    />
  );
};
export const TextHeight = (props: Props) => {
  const {color = colors.black, medium = false, bold = false, style} = props;

  const renderBold = (): '500' | 'bold' | 'normal' => {
    if (medium) {
      return '500';
    } else if (bold) {
      return 'bold';
    } else {
      return 'normal';
    }
  };
  return (
    <Text
      {...props}
      style={[
        style,
        {
          //   textAlign: 'left',
          color: color,
          fontSize: 18,
          lineHeight: 18 * 1.5,
          fontWeight: renderBold(),
        },
      ]}
    />
  );
};

export const TextSizeCustom = (props: PropsSizeCustom) => {
  const {
    color = colors.black,
    medium = false,
    bold = false,
    size,
    style,
  } = props;

  const renderBold = (): '500' | 'bold' | 'normal' => {
    if (medium) {
      return '500';
    } else if (bold) {
      return 'bold';
    } else {
      return 'normal';
    }
  };
  return (
    <Text
      {...props}
      style={[
        style,
        {
          color: color,
          fontSize: size,
          lineHeight: size * 1.5,
          fontWeight: renderBold(),
        },
      ]}
    />
  );
};
