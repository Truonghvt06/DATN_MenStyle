import {createReducer, PayloadAction} from '@reduxjs/toolkit';
import {onLogout, setToken} from '../../actions/auth';

interface AuthState {
  token: string | null;
}
const initialState: AuthState = {
  token: null,
};

export default createReducer(initialState, builder => {
  builder.addCase(setToken, (state, action: PayloadAction<string>) => {
    state.token = action.payload;
  });
  builder.addCase(onLogout, state => {
    state.token = null;
  });
});
