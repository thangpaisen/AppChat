import firestore from '@react-native-firebase/firestore';

export const checkNameAdmin =  (list,name) => {
  var result =false;
    list.forEach((item) => {
      if(item.UserName==name)
          result=true;
    });
    return result;
}