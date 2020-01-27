import {combineReducers} from 'redux';

import {
    ADD_FILTERED_OUT_PULSE,
    ADD_FILTERED_OUT_PULSE_LIST,
    ADD_LAST_PULSE_KEY,
    ADD_LAT_LNG_TO_STORE,
    ADD_NEW_BATCH_PULSES,
    ADD_NEW_PULSE,
    ADD_NEW_PULSE_LIST,
    ADD_PULSE_COMMENT,
    ADD_RADIUS_TO_STORE,
    ADD_USER_ID_TO_STORE,
    BANNED,
    LISTENING_TO_DATA,
    LOADING_BATCH_PULSES,
    NEW_USER_CREATED,
    PULSES_TIMED_OUT,
    START_LISTENING_FOR_PULSES,
    UPDATE_TIMES_REPORTED,
    UPDATE_USER_SETTINGS
} from "../actions/actions"
import {DEFAULT_LATITUDE, DEFAULT_LONGITUDE} from "../constants/constants";

let dataState = {
    retrievedUserId: '',
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    radius: 10,
    pulses: [],
    filteredOutPulses: [],
    timedOut: false,
    listeningForData: false,
    pulseCommentsData: [],
    userSettings: {},
    startListeningForPulses: false,
    timesReported: 0,
    banned: false,
    curLatitude: DEFAULT_LATITUDE,
    curLongitude: DEFAULT_LONGITUDE,
    lastPulseKey: '',
    loadingBatchPulses: false,
};

const dataReducer = (state = dataState, action) => {
    switch (action.type) {
        case NEW_USER_CREATED:
            state = Object.assign({}, state, {retrievedUserId: action.payload});
            return state;
        case ADD_LAST_PULSE_KEY:
            state = Object.assign({}, state, {lastPulseKey: action.payload});
            return state;
        case BANNED:
            state = Object.assign({}, state, {banned: action.payload});
            return state;
        case UPDATE_USER_SETTINGS:
            const userSettingsCopy = JSON.parse(JSON.stringify(action.userSettings));
            state = Object.assign({}, state, {userSettings: userSettingsCopy});
            return state;
        case ADD_USER_ID_TO_STORE:
            state = Object.assign({}, state, {retrievedUserId: action.userId});
            return state;
        case ADD_LAT_LNG_TO_STORE:
            state = Object.assign({}, state, {curLatitude: action.latitude, curLongitude: action.longitude});
            return state;
        case ADD_RADIUS_TO_STORE:
            state = Object.assign({}, state, {radius: action.radius});
            return state;
        case LISTENING_TO_DATA:
            state = Object.assign({}, state, {listeningForData: action.listeningForData});
            return state;
        case START_LISTENING_FOR_PULSES:
            state = Object.assign({}, state, {startListeningForPulses: action.payload});
            return state;
        case ADD_NEW_PULSE_LIST:
            state = Object.assign({}, state, {pulses: action.payload});
            return state;
        case ADD_FILTERED_OUT_PULSE_LIST:
            state = Object.assign({}, state, {filteredOutPulses: action.payload});
            return state;
        case UPDATE_TIMES_REPORTED:
            state = Object.assign({}, state, {timesReported: action.payload});
            return state;
        case ADD_NEW_BATCH_PULSES:
            state = Object.assign({}, state, {pulses: [...state.pulses, ...action.payload.reverse()]});
            return state;
        case LOADING_BATCH_PULSES:
            state = Object.assign({}, state, {loadingBatchPulses: action.payload});
            return state;
        case ADD_NEW_PULSE:
            if (!action.payload) {
                state = Object.assign({}, state, {pulses: []});
            }
            else {
                state = Object.assign({}, state, {pulses: [action.payload, ...state.pulses]});
            }
            return state;
        case ADD_FILTERED_OUT_PULSE:
            if (!action.payload) {
                state = Object.assign({}, state, {filteredOutPulses: []});
            }
            else {
                state = Object.assign({}, state, {filteredOutPulses: [action.payload, ...state.filteredOutPulses]});
            }
            return state;
        case PULSES_TIMED_OUT:
            state = Object.assign({}, state, {timedOut: true});
            return state;
        case ADD_PULSE_COMMENT:
            if (!action.payload) {
                state = Object.assign({}, state, {pulseCommentsData: []});
            }
            else {

                let pulseCommentsData = [action.payload, ...state.pulseCommentsData];

                pulseCommentsData.sort(function (a, b) {
                    return b.votes - a.votes;
                });

                state = Object.assign({}, state, {pulseCommentsData});
            }
            return state;
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    dataReducer
});

export default rootReducer;
