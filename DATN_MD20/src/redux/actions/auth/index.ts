import {createAction} from '@reduxjs/toolkit';
import types from '../../types';

export interface Login {
  tk: string;
  mk: string;
}

export const login = createAction<Login>(types.auth.login);
export const setToken = createAction<string>(types.auth.setToken);
export const onLogout = createAction(types.auth.logout);
