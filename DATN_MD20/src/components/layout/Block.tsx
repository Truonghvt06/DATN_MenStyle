import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableWithoutFeedbackProps,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';

interface Props extends ViewStyle, TouchableWithoutFeedbackProps {
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;

  w?: number | string | undefined;
  minW?: number | string | undefined;
  maxW?: number | string | undefined;
  w100?: boolean | undefined;

  h?: number | string | undefined;
  minH?: number | string | undefined;
  maxH?: number | string | undefined;
  h100?: boolean | undefined;

  square?: number | undefined;
  middle?: boolean | undefined;
  row?: boolean | undefined;
  centerBW?: boolean | undefined;

  flex1?: boolean | undefined;
  flex2?: boolean | undefined;
  flex3?: boolean | undefined;
  flex4?: boolean | undefined;
  flex5?: boolean | undefined;
  flex6?: boolean | undefined;
  flex7?: boolean | undefined;
  flex8?: boolean | undefined;
  flex9?: boolean | undefined;

  pad?: number | undefined;
  padH?: number | undefined;
  padV?: number | undefined;
  padL?: number | undefined;
  padR?: number | undefined;
  padT?: number | undefined;
  padB?: number | undefined;

  pad10?: boolean | undefined;

  mar?: number | undefined;
  marH?: number | undefined;
  marV?: number | undefined;
  marL?: number | undefined;
  marR?: number | undefined;
  marT?: number | undefined;
  marB?: number | undefined;

  padH20?: boolean | undefined;
  marH20?: boolean | undefined;

  bgWhite?: boolean | undefined;
  borderRadius?: number | undefined;
  backgroundColor?: string | undefined;

  alignCT?: boolean | undefined;
  justifyCT?: boolean | undefined;
  justifyBW?: boolean | undefined;

  borderW?: number | undefined;
  borderW1?: boolean | undefined;
  borderBottomW?: number | undefined;
  borderTopW?: number | undefined;

  borderColor?: string | undefined;
  borderBlack?: boolean | undefined;

  borderW1_Bl?: boolean | undefined;
  borderW1_Gr?: boolean | undefined;

  positionA?: boolean | undefined;
  positionFull?: boolean | undefined;
  positionR?: boolean | undefined;
  left0?: boolean | undefined;
  top0?: boolean | undefined;
  right0?: boolean | undefined;
  bottom0?: boolean | undefined;
}

export default (props: Props) => {
  const styleProps: Array<any> = [
    props.flex1 && {flex: 1},
    props.flex2 && {flex: 2},
    props.flex3 && {flex: 3},
    props.flex4 && {flex: 4},
    props.flex5 && {flex: 5},
    props.flex6 && {flex: 6},
    props.flex7 && {flex: 7},
    props.flex8 && {flex: 8},
    props.flex9 && {flex: 9},

    props.borderRadius && {borderRadius: props.borderRadius},

    props.w && {width: props.w},
    props.minW && {minWidth: props.minW},
    props.maxW && {maxWidth: props.maxW},
    props.w100 && {width: '100%'},

    props.h && {height: props.h},
    props.minH && {minHeight: props.minH},
    props.maxH && {maxHeight: props.maxH},
    props.h100 && {height: '100%'},

    props.square && {width: props.square, height: props.square},
    props.middle && {justifyContent: 'center', alignItems: 'center'},
    props.row && {flexDirection: 'row'},
    props.centerBW && {justifyContent: 'space-between', alignItems: 'center'},

    props.pad && {padding: props.pad},
    props.padH && {paddingHorizontal: props.padH},
    props.padV && {paddingVertical: props.padV},
    props.padL && {paddingLeft: props.padL},
    props.padR && {paddingRight: props.padR},
    props.padT && {paddingTop: props.padT},
    props.padB && {paddingBottom: props.padB},

    props.pad10 && {padding: 10},

    props.mar && {margin: props.mar},
    props.marH && {marginHorizontal: props.marH},
    props.marV && {marginVertical: props.marV},
    props.marL && {marginLeft: props.marL},
    props.marR && {marginRight: props.marR},
    props.marT && {marginTop: props.marT},
    props.marB && {marginBottom: props.marB},

    props.padH20 && {paddingHorizontal: 20},
    props.marH20 && {marginHorizontal: 20},

    props.bgWhite && {backgroundColor: 'white'},
    props.backgroundColor && {backgroundColor: props.backgroundColor},

    props.alignCT && {alignItems: 'center'},
    props.justifyCT && {justifyContent: 'center'},
    props.justifyBW && {justifyContent: 'space-between'},

    props.borderW && {borderWidth: props.borderW},
    props.borderW1 && {borderWidth: 1},
    props.borderBottomW && {borderBottomWidth: props.borderBottomW},
    props.borderTopW && {borderTopWidth: props.borderTopW},

    props.borderColor && {borderColor: props.borderColor},
    props.borderBlack && {borderColor: 'black'},

    props.borderW1_Bl && {borderColor: '#000', borderWidth: 1},
    props.borderW1_Gr && {borderColor: '#8B8B8B', borderWidth: 1},

    props.positionA && {position: 'absolute'},
    props.positionFull && {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    props.positionR && {position: 'relative'},
    props.left0 && {left: 0},
    props.top0 && {top: 0},
    props.right0 && {right: 0},
    props.bottom0 && {bottom: 0},
  ];
  return (
    <View style={[styleProps, props.containerStyle]} {...props}>
      {props.children}
    </View>
  );
};
