import auth from '@react-native-firebase/auth';

export const loginUserLoading = () => {
  return {
    type: 'LOGIN_USER_LOADING',
  };
};

export const loginUserSuccess = data => {
  return {
    type: 'LOGIN_USER_SUCCESS',
  };
};
export const setUser = data => {
  return {
    type: 'SET_USER',
    payload: data,
  };
};

export const loginUser = (name) => async dispatch => {
  console.log(name);
  try {
    dispatch(loginUserLoading());
    auth()
      .signInAnonymously()
      
      .then(() => {
        dispatch(loginUserSuccess());
        auth().currentUser.updateProfile({
          displayName: name,
        });
      });
  } catch (e) {
    switch (e.code) {
      case 'auth/operation-not-allowed':
        dispatch(loginUserSuccess());
        console.log('Enable anonymous in your firebase console.');
        break;
      default:
        console.error(e);
        break;
    }
  }
};
export const logoutUser = () => async dispatch => {
  try {
    await auth().signOut();
  } catch (e) {
    console.error(e);
  }
};
