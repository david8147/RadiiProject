import {AsyncStorage} from "react-native"
import {SimpleAnimation} from "react-native-simple-animations";
import React from "react";
import haversine from 'haversine'

export const getMapRegion = (radius, latitude, longitude) => {
    const oneDegreeOfLongitudeInMeters = 111.32 * 1000;
    const circumference = (40075 / 360) * 1000;

    let calculationsRadius = radius ? radius : 10;

    const latDelta = calculationsRadius * 3 * (1 / (Math.cos(latitude) * circumference));
    const lonDelta = (calculationsRadius * 3 / oneDegreeOfLongitudeInMeters);


    return {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: Math.max(0, latDelta),
        longitudeDelta: Math.max(0, lonDelta)
    }
};


export const calcDistance = (newLatLng, prevLatLng) => {
    return haversine(prevLatLng, newLatLng, {unit: 'meter'}) || 0;
};

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.log(`Error Saving ${key}`, error)
    }
};


export const retrieveData = async (key, callBackFunction) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            callBackFunction(value)
        }
        else {
            callBackFunction("Not Found")
        }
    } catch (error) {
        console.log(`Error Retrieving ${key}`, error);
        return null;
    }
};

export const fadeElement = (element, inOrOut, delay) => {

    return (<SimpleAnimation
        delay={delay}
        duration={1000}
        fade
        staticType='zoom'
        aim={inOrOut}
    >
        {element}
    </SimpleAnimation>)
};

const getNumberString = (number, divisor, fixed) => {
    let newNo = number / divisor;
    if (newNo % 1 !== 0) {
        newNo = newNo.toFixed(fixed)
    }
    return newNo.toString()
};

export const truncateLargeNumber = (number) => {

    if (number > 1000000) {
        return `${getNumberString(number, 1000000, 0)}M`
    }
    if (number >= 100000) {
        return `${getNumberString(number, 1000, 0)}K`
    }
    if (number >= 10000) {
        return `${getNumberString(number, 1000, 1)}K`
    }
    if (number >= 1000) {
        return `${getNumberString(number, 1000, 2)}K`
    }

    return number
};

export const metersToFeet = (meters) => {
    return meters / 3.28084;
};

export const metersToMiles = (meters) => {
    if (meters === -1) {
        return 0;
    }
    return meters * 0.000621371
};

export const truncateDistance = (numberMeters) => {

    const feet = metersToFeet(numberMeters);
    const miles = metersToMiles(numberMeters);

    let unitsToUse = miles;
    let unitstoUseName = 'mi';

    if (feet < 1000) {
        unitsToUse = feet;
        unitstoUseName = 'ft'
    }

    if (Math.floor(unitsToUse) === 999) {
        return `999 ${unitstoUseName}`;
    }
    else if (unitsToUse >= 100) {
        return `${unitsToUse.toFixed(0)} ${unitstoUseName}`;
    }

    return `${unitsToUse.toFixed(1)} ${unitstoUseName}`
};


export const timestampToDate = (timestampSeconds) => {
    let timeSinceSeconds = Math.floor(Date.now() / 1000) - timestampSeconds;

    // Seconds
    if (timeSinceSeconds < 60) {
        return `${timeSinceSeconds}s`
    }
    // Minutes
    else if (timeSinceSeconds < 3600) {
        return `${(timeSinceSeconds / 60).toFixed(0)}m`
    }
    // Hours
    else if (timeSinceSeconds < 86400) {
        return `${(timeSinceSeconds / 3600).toFixed(0)}hr`
    }

    // Days
    else if (timeSinceSeconds < 604800) {
        return `${(timeSinceSeconds / 86400).toFixed(0)}d`
    }

    // Weeks
    else if (timeSinceSeconds < 2.628e+6) {
        return `${(timeSinceSeconds / 604800).toFixed(0)}wk`
    }

    // Months
    else if (timestampSeconds < 3.154e+7) {
        return `${(timestampSeconds / 2.628e+6).toFixed(0)}mo`
    }

    // Years
    else {
        return `${(timestampSeconds / 3.154e+7).toFixed(0)}yr`
    }

};


export const pulsePassesFilters = (userSettings, pulseData) => {

    // Allowed Categories and Emergency
    let containsEmergency = false;

    let r = true;
    for (let category of pulseData.boxesChecked) {
        if (userSettings.data[category] === false) {
            r = false
        }
        if (category === 'emergency') {
            containsEmergency = true;
        }
    }

    if (userSettings.data.emergencyPulseCheckbox && containsEmergency) {
        return true;
    }
    if (r === false) {
        return false
    }

    return pulseData.distanceAway <= userSettings.data.receivingRadius;
};


export const getFilteredOutPulses = (userSettings, allPulses) => {

    let pulses = [];
    let filteredOutPulses = [];

    for (let pulse of allPulses) {
        if (pulsePassesFilters(userSettings, pulse)) {
            pulses.push(pulse);
        }
        else {
            filteredOutPulses.push(pulse);
        }
    }

    return [pulses, filteredOutPulses];
};


export const isOverAWeekAgo = (now, then) => {
    return (now - then) > 604800;
};

export const getTimeUnmuted = (time) => {

    const now = Math.floor(Date.now() / 1000);

    switch (time) {
        case '30min':
            return now + 1800;
        case '1hr':
            return now + 3600;
        case '8hr':
            return now + 28800;
        case '24hr':
            return now + 86400;
        case 'unmute':
            return now;
        default:
            return now
    }

};

export const getMutedUntilString = (timeStamp) => {
    const now = Math.floor(Date.now() / 1000);
    if (now < timeStamp) {
        const timeStampMiliseconds = timeStamp * 1000;
        const unmutedDate = new Date(timeStampMiliseconds);
        const hours = unmutedDate.getHours();
        const minutes = unmutedDate.getMinutes();
        return `Muted until ${(hours > 12 ? hours - 12 : hours)}:${minutes < 10 ? `0${minutes}` : minutes}${(hours < 12 ? "AM" : "PM")} on ${unmutedDate.getMonth() + 1}/${unmutedDate.getDate()}`

    }
    return ''
};
