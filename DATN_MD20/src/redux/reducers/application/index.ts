import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import i18n, {LANG_KEY} from '../../../constants/i18n';

interface ApplicationState {
  lang: {label: string; value: string};
}

const init: ApplicationState = {
  lang: {label: 'Tiếng Việt', value: 'vi'},
};

const ApplicationSlice = createSlice({
  name: 'application',
  initialState: init,
  reducers: {
    setChangeLanguage: (
      state,
      action: PayloadAction<{label: string; value: string}>,
    ) => {
      state.lang = action.payload;
      //   i18n.changeLanguage(action.payload.value);
      AsyncStorage.setItem(LANG_KEY, action.payload.value);
    },
  },
});

export const {setChangeLanguage} = ApplicationSlice.actions;
export default ApplicationSlice.reducer;
