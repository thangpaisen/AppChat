import auth from '@react-native-firebase/auth';
import * as Types from '../../../code'
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

export const loginUser = name => async dispatch => {
  // console.log(name);
  try {
    dispatch(loginUserLoading());
    await auth()
      .signInAnonymously()
      .then(() => {
        dispatch(loginUserSuccess());
        dispatch(updateProfileUser(name));
      });
  } catch (e) {
    dispatch(loginUserSuccess());
    switch (e.code) {
      case 'auth/operation-not-allowed':
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

export const updateProfileUser = name => async dispatch => {
  console.log('PASSWORD_ADMIN',Types.PASSWORD_ADMIN);
  var nameNew ;
  if(name.toUpperCase()==='ADMIN' || name.toUpperCase()==='AD' || name.toUpperCase()==='BOSS')
    nameNew= `${name}[Fake]`
  else
  {
    if(name===Types.PASSWORD_ADMIN)
      nameNew='Admin'
    else
    nameNew=name;
  }
    
  try {
    await auth()
      .currentUser.updateProfile({
        displayName: nameNew,
      })
      .then(() => {
        console.log('updateProfileUserOK');
        const user = auth().currentUser;
        dispatch(setUser(user));
      });
  } catch (e) {
    console.error(e);
  }
};
