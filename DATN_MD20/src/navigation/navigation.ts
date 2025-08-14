import * as React from 'react';
import {
  CommonActions,
  StackActions,
  TabActions,
} from '@react-navigation/native';
import ScreenName from './ScreenName';
import {handleNotificationNavigation} from '../utils/common/firebase/fcmHelper';

export const navigationRef = React.createRef<any>();
export const isReadyRef: any = React.createRef<any>();

// 👉 Thêm util hàng đợi
let pendingNavData: any | null = null;

export const queueNotificationNav = (data?: any) => {
  if (!data) return;
  pendingNavData = data;
  tryProcessPendingNav();
};

export const tryProcessPendingNav = () => {
  if (!pendingNavData) return;
  if (isReadyRef.current && navigationRef.current) {
    handleNotificationNavigation(pendingNavData);
    pendingNavData = null;
  }
};

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

// chuyển màn và k cho back lại
const replace = (routeName: string, params?: any) => {
  if (isReadyRef.current && navigationRef.current) {
    const action = StackActions.replace(routeName, params);
    navigationRef.current.dispatch(action);
  }
};

//Dùng để chuyển tab trong Tab Navigator.
const jumpTo = (routeName: string, params?: any) => {
  if (isReadyRef.current && navigationRef.current) {
    const action = TabActions.jumpTo(routeName, params);
    navigationRef.current.dispatch(action);
  }
};
const resetToStackWithScreen = (
  rootStackName: string,
  screenName: string,
  params?: any,
) => {
  if (isReadyRef.current && navigationRef.current) {
    const action = CommonActions.reset({
      index: 0,
      routes: [
        {
          name: rootStackName,
          state: {
            index: 0,
            routes: [{name: screenName, params}],
          },
        },
      ],
    });
    navigationRef.current.dispatch(action);
  }
};

// quay lại n màn trước đấy
const pop = (index: number) => {
  if (isReadyRef.current && navigationRef.current) {
    const action = StackActions.pop(index);
    navigationRef.current.dispatch(action);
  }
};

export default {
  pop,
  jumpTo,
  navigate,
  goBack,
  reset,
  resetToStackWithScreen,
  resetToHome,
  replace,
};
