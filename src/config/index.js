import firestore from '@react-native-firebase/firestore';

const db = firestore();

export const getUserData = () => {
  return db
    .collection('users')
    .get()
    .then((res) => {
      console.log('res', res);
      const data = res.docs.map((doc) => {
        console.log('docccc', doc.data());
        return doc.data();
      });
      console.log('datatattaa::::', data);
      return data;
    });
};

export const getPrivacyData = () => {
  return db
    .collection('privacies')
    .get()
    .then((res) => {
      console.log('res', res);
      const data = res.docs.map((doc) => {
        console.log('docccc', doc.data());
        return doc.data();
      });
      console.log('datatattaa::::', data);
      return data;
    });
};
