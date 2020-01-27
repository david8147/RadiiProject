import {bannedRef, geoFire, pulsesRef, storageRef, usersRef} from "../firebase/FirebaseDB";
import {NUM_PULSES_TO_GRAB, SEARCH_FOR_NEARBY_USERS_TIMEOUT, SEARCH_FOR_PULSES_TIMEOUT} from "../constants/constants";
import {getFilteredOutPulses, pulsePassesFilters, storeData} from "../utils/utils";

import RNFetchBlob from 'rn-fetch-blob'

const Blob = RNFetchBlob.polyfill.Blob;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export const NEW_USER_CREATED = 'NEW_USER_CREATED';
export const ADD_USER_ID_TO_STORE = 'ADD_USER_ID_TO_STORE';
export const ADD_LAT_LNG_TO_STORE = 'ADD_LAT_LNG_TO_STORE';
export const ADD_RADIUS_TO_STORE = 'ADD_RADIUS_TO_STORE';
export const ADD_NEW_PULSE = 'ADD_NEW_PULSE';
export const ADD_NEW_BATCH_PULSES = 'ADD_NEW_BATCH_PULSE';
export const LOADING_BATCH_PULSES = 'LOADING_BATCH_PULSES';
export const PULSES_TIMED_OUT = 'PULSES_TIMED_OUT';
export const LISTENING_TO_DATA = 'LISTENING_TO_DATA';
export const ADD_PULSE_COMMENT = 'ADD_PULSE_COMMENT';
export const START_LISTENING_FOR_PULSES = 'START_LISTENING_FOR_PULSES';
export const ADD_FILTERED_OUT_PULSE = 'ADD_FILTERED_OUT_PULSE';
export const ADD_NEW_PULSE_LIST = 'ADD_NEW_PULSE_LIST';
export const ADD_FILTERED_OUT_PULSE_LIST = 'ADD_FILTERED_OUT_PULSE_LIST';
export const UPDATE_TIMES_REPORTED = 'UPDATE_TIMES_REPORTED';
export const BANNED = 'BANNED';
export const UPDATE_USER_SETTINGS = 'UPDATE_USER_SETTINGS';
export const ADD_LAST_PULSE_KEY = 'ADD_LAST_PULSE_KEY';


export const banUser = (userIdToReport, now) => async () => {
    usersRef.child(userIdToReport).child('BANNED').set(true);
    const now = Math.floor(Date.now() / 1000);
    bannedRef.push().set({user: userIdToReport, date: now})
};


export const updateTimesReported = (userIdToReport, now) => async () => {
    usersRef.child(userIdToReport).child('timesReported').push().set(now);
};

export const addUserIdToStore = (userId) => async dispatch => {
    dispatch({type: ADD_USER_ID_TO_STORE, userId: userId});
};

export const addLatLngToStore = (latitude, longitude) => async dispatch => {
    dispatch({type: ADD_LAT_LNG_TO_STORE, latitude, longitude});
};

export const addRadiusToStore = (radius) => async dispatch => {
    dispatch({type: ADD_RADIUS_TO_STORE, radius});
};

export const updateUserSettings = (userSettings) => async dispatch => {

    dispatch({
        type: UPDATE_USER_SETTINGS,
        userSettings
    });

    storeData('userSettings', JSON.stringify(userSettings));
};


export const refilterPulses = (userSettings, pulses, filteredOutPulses) => async dispatch => {

    if (userSettings) {

        dispatch({
            type: ADD_NEW_PULSE,
            payload: null
        });

        dispatch({
            type: ADD_FILTERED_OUT_PULSE,
            payload: null
        });

        const addedPulses = pulses.concat(filteredOutPulses);

        const allFilteredOutPulses = getFilteredOutPulses(userSettings, addedPulses);

        let newPulses = allFilteredOutPulses[0];

        newPulses.sort(function (a, b) {
            return b.pulseSentTime - a.pulseSentTime;
        });

        let newFilteredOutPulses = allFilteredOutPulses[1];

        dispatch({
            type: ADD_NEW_PULSE_LIST,
            payload: newPulses
        });

        dispatch({
            type: ADD_FILTERED_OUT_PULSE_LIST,
            payload: newFilteredOutPulses
        });
    }

};

export const addNewUser = (latitude, longitude) => async dispatch => {

    let newUser = usersRef.push();

    storeData('userId', newUser.key);

    geoFire.set(newUser.key, [latitude, longitude]).then(function (a) {
    }, function (error) {
        console.log("Error: " + error);
    });

    dispatch({
        type: NEW_USER_CREATED,
        payload: newUser.key
    });
};


export const uploadImage = (pulseKey, imageData) => async dispatch => {
    const UUID = require('uuid-js');
    const uuid4 = UUID.create();

    const uploadTask = storageRef.ref('/images/').child(uuid4).put(imageData.uri, {contentType: 'image/png;base64'});
    uploadTask.on('state_changed', function (snapshot) {
        pulsesRef.child(pulseKey).child('pulseData').child('imageData').set(snapshot.downloadURL);
    }, (error) => {
        console.warn('Upload Error: ' + error)
    })
};

export const sendPulse = (
    boxesChecked,
    pulseMessage,
    imageData,
    retrievedUserId,
    latitude,
    longitude,
    radius
) => async dispatch => {

    let newPulse = pulsesRef.push();

    const geoFireQuery = geoFire.query({
        center: [latitude, longitude],
        radius: radius / 1000
    });

    let numReceived = 0;

    newPulse.set({
        pulseData: {
            boxesChecked,
            pulseMessage,
            imageData: (imageData ? 'ontheway' : ''),
            userId: retrievedUserId,
            latitude,
            longitude,
            radius,
            pulseSentTime: Math.floor(Date.now() / 1000),
        },
        votes: 0,
        numComments: 0,
    });

    if (imageData) {
        dispatch(uploadImage(newPulse.key, imageData));
    }

    const onKeyEnteredRegistration = geoFireQuery.on("key_entered", function (key, location, distance) {
        usersRef.child(key).child('receivedPulses').push().set({
            pulseId: newPulse.key,
            distanceAway: distance / 1000
        });
        numReceived += 1;
    });

    this.setTimeout(() => {
        onKeyEnteredRegistration.cancel();

        newPulse.child('numReceived').set(numReceived)

    }, SEARCH_FOR_NEARBY_USERS_TIMEOUT);

};

export const addNewPulse = (pulseId, distanceAway, userSettings) => async dispatch => {

    let pulseRef = pulsesRef.child(pulseId).child('pulseData');

    pulseRef.once('value').then(function (snapshot) {
        let pulseData = snapshot.val();
        if (pulseData) {
            pulseData.pulseId = pulseId;
            pulseData.distanceAway = distanceAway;

            if (pulsePassesFilters(userSettings, pulseData)) {

                dispatch({
                    type: ADD_NEW_PULSE,
                    payload: pulseData
                });
            }

            else {
                dispatch({
                    type: ADD_FILTERED_OUT_PULSE,
                    payload: pulseData
                });
            }
        }
    });
};

export const newPulseListener = (userKey, userSettings) => async dispatch => {


    dispatch({
        type: START_LISTENING_FOR_PULSES,
        payload: false
    });

    dispatch({
        type: ADD_NEW_PULSE,
        payload: null
    });

    dispatch({
        type: LISTENING_TO_DATA,
        listeningForData: true
    });

    let recievedPulsesRef = usersRef.child(userKey).child('receivedPulses');

    let gotFirstKey = false;

    recievedPulsesRef.limitToLast(NUM_PULSES_TO_GRAB).on("child_added", function (snapshot, prevChildKey) {

        if (!gotFirstKey) {
            gotFirstKey = true;
            dispatch({
                type: ADD_LAST_PULSE_KEY,
                payload: snapshot.key
            });
        }

        let pulseId = snapshot.val().pulseId;
        let distanceAway = snapshot.val().distanceAway;
        dispatch(addNewPulse(pulseId, distanceAway, userSettings));

    });

    this.setTimeout(() => {
        dispatch({
            type: PULSES_TIMED_OUT,
            payload: 'timedout'
        });
    }, SEARCH_FOR_PULSES_TIMEOUT);

};

export const getNextPulseBatch = (lastPulseKey, userKey, userSettings) => async dispatch => {

    let recievedPulsesRef = usersRef.child(userKey).child('receivedPulses');

    recievedPulsesRef.orderByKey().endAt(lastPulseKey).limitToLast(NUM_PULSES_TO_GRAB).once("value", function (snapshot) {

        const numChildren = snapshot._childKeys.length;
        const childKeyToSkip = snapshot._childKeys[numChildren - 1];
        const lastChildKey = snapshot._childKeys[numChildren - 2];

        if (numChildren > 1) {
            dispatch({
                type: LOADING_BATCH_PULSES,
                payload: true
            });

            dispatch({
                type: ADD_LAST_PULSE_KEY,
                payload: snapshot._childKeys[0]
            });
        }


        let batchesArray = [];

        snapshot.forEach(function (childSnapshot) {

            const childKey = childSnapshot.key;

            const pulseId = childSnapshot.val().pulseId;
            const distanceAway = childSnapshot.val().distanceAway;

            if (childKey !== childKeyToSkip) {
                let pulseRef = pulsesRef.child(pulseId).child('pulseData');

                pulseRef.once('value').then(function (pulseDataSnapshot) {
                    let pulseData = pulseDataSnapshot.val();
                    pulseData.pulseId = pulseId;
                    pulseData.distanceAway = distanceAway;

                    if (pulsePassesFilters(userSettings, pulseData)) {
                        batchesArray.push(pulseData);
                        if (childKey === lastChildKey) {

                            dispatch({
                                type: LOADING_BATCH_PULSES,
                                payload: false
                            });

                            dispatch({
                                type: ADD_NEW_BATCH_PULSES,
                                payload: batchesArray
                            });
                        }
                    }
                });
            }
        });
    });

};


export const addPulseComment = (
    pulseId,
    commentMessage,
    userId,
) => async dispatch => {

    let newPulseComment = pulsesRef.child(pulseId).child('pulseComments').push();
    newPulseComment.set({
        commentData: {
            commentMessage,
            commentSentTime: Math.floor(Date.now() / 1000),
            commentId: newPulseComment.key,
            pulseId: pulseId,
            userId,
            votes: 0
        },
    });

    let numCommentsRef = pulsesRef.child(pulseId).child('numComments');

    numCommentsRef.once('value', (snapshot) => {
        let curNumComments = snapshot.val();
        numCommentsRef.set(curNumComments + 1)
    });

};

export const newCommentsListener = (pulseId) => async dispatch => {

    let pulseCommentsRef = pulsesRef.child(pulseId).child('pulseComments');

    dispatch({
        type: ADD_PULSE_COMMENT,
        payload: null
    });

    pulseCommentsRef.on("child_added", function (snapshot, prevChildKey) {
        dispatch({
            type: ADD_PULSE_COMMENT,
            payload: snapshot.val().commentData
        });

    });
};


export const timesReportedListener = (userId) => async dispatch => {
    let reportedRef = usersRef.child(userId).child('timesReported');
    reportedRef.on("value", function (snapshot) {
        dispatch({
            type: UPDATE_TIMES_REPORTED,
            payload: snapshot.val()
        });
    });
};

export const bannedListener = (userId) => async dispatch => {
    let bannedRef = usersRef.child(userId).child('BANNED');
    bannedRef.on("value", function (snapshot) {
        dispatch({
            type: BANNED,
            payload: snapshot.val()
        });
    });
};
