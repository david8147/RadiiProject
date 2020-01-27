import firebase from 'react-native-firebase';
import geofire from 'geofire';

firebase.auth()
    .signInAnonymouslyAndRetrieveData()
// .then(credential => {
//     if (credential) {
//         console.log('default app user ->', credential.user.toJSON());
//     }
// });

let firebaseRef = firebase.database().ref();

export const usersRef = firebaseRef.child("users");
export const userLocationsRef = firebaseRef.child("userLocations");
export const pulsesRef = firebaseRef.child("pulses");
export const geoFire = new geofire(userLocationsRef);
export const bannedRef = firebaseRef.child("bannedUsers");
export const storageRef = firebase.storage();
