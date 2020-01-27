/**
 * Radii
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MapPage from "../components/MapPage/MapPage";
import FallingDrawer from '../components/react-native-falling-drawer/index'
import Settings from "../components/Settings";
import Pulses from "./Pulses/Pulses";
import {connect} from 'react-redux';

import {bindActionCreators} from 'redux';
import * as Actions from '../actions/actions'
import {retrieveData, storeData} from "../utils/utils";
import {MAX_RADIUS_METERS} from "../constants/constants";

import Permissions from 'react-native-permissions'
import {geoFire} from "../firebase/FirebaseDB";

let listening = false;

class Controller extends Component {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        this.state = {drawerOpen: false};

        retrieveData('userSettings', this.retrieveUserData);
        retrieveData('lastKnownLatLng', this.setStoredLatLng);
        retrieveData('userId', this.setUserId);
        retrieveData('radius', this.setRadius);
    }
    retrieveUserData = (data) => {
        const {updateUserSettings, retrievedUserId, newPulseListener} = this.props;
        let userSettings = data;
        if (userSettings === 'Not Found') {
            userSettings = {
                data: {
                    'pushNotifications': true,
                    'mutedUntil': 'null',
                    'pulseDigest': 'realtime',
                    'receivingRadius': MAX_RADIUS_METERS,
                    'emergencyPulseCheckbox': true,
                    'emergency': true,
                    'fire': true,
                    'calendar': true,
                    'community': true,
                    'question': true,
                    'info': true,
                    'music': true,
                    'paw': true,
                    'sports': true,
                    'tools': true,
                    'star': true,
                    'food': true,
                    'smileyface': true,
                    'money': true,
                    'heart': true,
                },
            };
            storeData('userSettings', JSON.stringify(userSettings));
        }
        userSettings = JSON.parse(data);

        updateUserSettings(userSettings);
    };
    setStoredLatLng = (latLng) => {
        let latLngSplit = latLng.split("|");
        const {addNewUser, retrievedUserId, addLatLngToStore} = this.props;

        if (latLngSplit[0] !== 'Not Found') {
            let latitude = parseFloat(latLngSplit[0]);
            let longitude = parseFloat(latLngSplit[1]);

            if (retrievedUserId === 'Not Found') {
                addNewUser(latitude, longitude)
            }

            addLatLngToStore(latitude, longitude)
        }
    };
    setUserId = (userId) => {
        const {addUserIdToStore} = this.props;
        addUserIdToStore(userId)
    };
    setRadius = (savedRadius) => {
        const {radius, addRadiusToStore} = this.props;
        let savedRadiusFloat = parseFloat(savedRadius);
        if (savedRadiusFloat && radius !== savedRadiusFloat) {
            addRadiusToStore(savedRadiusFloat)
        }
    };

    componentDidMount() {
        Permissions.check('location').then(response => {
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            this.setState({locationPermission: response});

            if (response !== 'authorized') {
                Permissions.request('location', {type: 'always'}).then(response => {
                    this.setState({locationPermission: response});
                    if (response === 'authorized') {
                        this.getCurrentLocation();
                    }
                })
            }
            else {
                this.getCurrentLocation();
            }
        })
    }

    getCurrentLocation = () => {
        const {addNewUser, retrievedUserId, addLatLngToStore, curLatitude, curLongitude} = this.props;
        this.watchID = navigator.geolocation.watchPosition(
            position => {
                const {latitude, longitude} = position.coords;

                storeData("lastKnownLatLng", `${JSON.stringify(latitude)}|${JSON.stringify(longitude)}`);

                if (retrievedUserId === 'Not Found') {
                    addNewUser(latitude, longitude)
                }

                if (latitude && longitude && retrievedUserId) {
                    geoFire.set(retrievedUserId, [latitude, longitude]).then(function (a) {
                    }, function (error) {
                        console.log("Error: " + error);
                    });
                    addLatLngToStore(latitude, longitude)
                }

            },
            error => console.log(error),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    };
    drawerState = (drawerOpen) => {
        this.setState({drawerOpen})
    };
    render() {
        const SCREENS = [
            {
                key: "Radii",
                name: "Radii",
                color: "#77BA99",
                titleColor: "#fff",
                hamburgerColor: "#fff",
                render: () => <View style={styles.container}>
                    <MapPage drawerOpen={this.state.drawerOpen}/>
                </View>,
            },

            {
                key: "Pulses",
                name: "Pulses",
                color: "#05386B",
                titleColor: "#fff",
                hamburgerColor: "#fff",
                render: () => <View><Pulses drawerOpen={this.state.drawerOpen}/></View>
            },

            {
                key: "Settings",
                name: "Settings",
                color: "#226666",
                titleColor: "#fff",
                hamburgerColor: "#fff",
                render: () => <View><Settings/></View>
            },

        ];

        const {
            retrievedUserId,
            timesReportedListener,
            bannedListener,
            banned,
            newPulseListener,
            userSettings,
            curLatitude,
            curLongitude
        } = this.props;


        if (retrievedUserId && retrievedUserId !== 'Not Found' && !listening && userSettings && userSettings !== 'Not Found') {
            listening = true;
            timesReportedListener(retrievedUserId);
            bannedListener(retrievedUserId);
            newPulseListener(retrievedUserId, userSettings)
        }

        return (
            <View style={styles.container}>
                {banned ?
                    <View style={styles.bannedContainer}>
                        <Text style={styles.bannedTextStyle}>You have been banned from Radii</Text>
                    </View> :
                    <View style={styles.container}>
                        <FallingDrawer drawerState={this.drawerState} screens={SCREENS}/>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    bannedContainer: {
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    bannedTextStyle: {
        fontSize: 20,
        textAlign: 'center'
    },
});


function mapStateToProps(state, props) {
    return {
        retrievedUserId: state.dataReducer.retrievedUserId,
        listeningForData: state.dataReducer.listeningForData,
        startListeningForPulses: state.dataReducer.startListeningForPulses,
        userSettings: state.dataReducer.userSettings,
        banned: state.dataReducer.banned,
        curLatitude: state.dataReducer.curLatitude,
        curLongitude: state.dataReducer.curLongitude,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Controller);

