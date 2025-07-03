import * as React from 'react';
import {CommonActions, StackActions} from '@react-navigation/native';
import ScreenName from './ScreenName';

export const navigationRef = React.createRef<any>();
export const isReadyRef: any = React.createRef<any>();

const navigate = (routeName: string, params?: any) => {
  if (isReadyRef.current && navigationRef.current) {
    const action = CommonActions.navigate(routeName, params);
    navigationRef.current.dispatch(action);
  }
};
const reset = (routeName: string, params?: any) => {
  if (isReadyRef.current && navigationRef.current) {
    const action = CommonActions.reset({
      index: 0,
      routes: [{name: routeName, params}],
    });
    navigationRef.current.dispatch(action);
  }
};
const resetToHome = (routeName: string, params?: any) => {
  if (isReadyRef.current && navigationRef.current) {
    const action = CommonActions.reset({
      index: 0,
      routes: [
        {
          name: ScreenName.Main.MainStack,
          state: {
            index: 0,
            routes: [{name: routeName, params}],
          },
        },
      ],
    });
    navigationRef.current.dispatch(action);
  }
};

const goBack = () => {
  if (isReadyRef.current && navigationRef.current) {
    const action = CommonActions.goBack();
    navigationRef.current.dispatch(action);
  }
};

const replace = (routeName: string, params?: any) => {
  if (isReadyRef.current && navigationRef.current) {
    const action = StackActions.replace(routeName, params);
    navigationRef.current.dispatch(action);
  }
};

export default {
  navigate,
  goBack,
  reset,
  resetToHome,
  replace,
};
