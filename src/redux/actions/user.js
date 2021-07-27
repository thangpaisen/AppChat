import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
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
        dispatch(updateProfileUser(name));
        dispatch(loginUserSuccess());
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
    var nameNew=name;
    var listUserVip=[];
    const snapshot = await firestore().collection('USER_VIP').get();
    snapshot.forEach((doc) => {
        // console.log(doc.id, '=>', doc.data());
          const firebaseData = doc.data();
          listUserVip.push(firebaseData);
      });
    listUserVip.every(item => {
        if(name.replace(/ /g, "").toUpperCase() === item.UserName.toUpperCase())
            {
              nameNew=`${name}[Fake]`;
              return false;
            }
        else if(name===item.CodeLogin)
            {
              nameNew=item.UserName;
              return false;
            }
        return true;
    })
  try {
    await auth()
      .currentUser.updateProfile({
        displayName: nameNew,
      })
      .then(() => {
        const user = auth().currentUser;
        dispatch(setUser(user));
      });
  } catch (e) {
    console.error(e);
  }
};
