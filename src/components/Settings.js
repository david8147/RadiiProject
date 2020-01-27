/**
 * Radii
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Image, Picker, StyleSheet, Text, View} from 'react-native';
import SwitchToggle from 'react-native-switch-toggle';
import {Slider} from "react-native-elements"
import CheckBox from "../components/CheckBox"
import {fadeElement, getMutedUntilString, getTimeUnmuted, metersToMiles} from "../utils/utils";

import {allCategories, HEADER_HEIGHT, iconImages, MAX_RADIUS_METERS} from "../constants/constants";

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../actions/actions';

const SETTINGS_FONT_SIZE = 18;

class Settings extends Component {

    onSwitch = (onOrOff) => {
        const {updateUserSettings} = this.props;
        const {userSettings} = this.props;
        const changedSettings = userSettings;
        changedSettings.data.pushNotifications = !onOrOff;
        updateUserSettings(changedSettings);
    };

    getPushRow = () => {
        const {userSettings} = this.props;

        return (<View style={styles.settingsRow}>
            <Text style={styles.settingsText}>Push Notifications</Text>

            <SwitchToggle
                containerStyle={{
                    width: 65,
                    height: 27,
                    borderRadius: 25,
                    backgroundColor: '#CCC',
                    padding: 5,
                }}

                circleStyle={{
                    width: 20,
                    height: 20,
                    borderRadius: 19,
                    backgroundColor: 'white', // rgb(102,134,205)
                }}

                switchOn={userSettings.data.pushNotifications}
                onPress={() => this.onSwitch(userSettings.data.pushNotifications)}
            />

        </View>);
    };
    getMuteRow = () => {
        const {userSettings, updateUserSettings} = this.props;
        const {mutedUntilChosen} = this.state;

        const mutedUntilString = getMutedUntilString(userSettings.data.mutedUntil);

        let muted = false;

        if (mutedUntilString) {
            muted = true;
        }

        let pickerItems = [[' ', 'null']];

        if (muted) {
            pickerItems.push(['Unmute', 'unmute'])
        }
        pickerItems.push(['30 Minutes', '30min'], ['1 Hour', '1hr'], ['8 Hours', '8hr'], ['24 Hours', '24hr']);

        return (<View style={styles.settingsRow}>

            <Text style={styles.settingsText}>Mute</Text>
            <Text>{mutedUntilString}</Text>

            <Picker
                style={{width: 145}}
                selectedValue={mutedUntilChosen}
                onValueChange={(itemValue, itemIndex) => {
                    if (itemValue !== 'null') {
                        const changedSettings = userSettings;
                        this.setState({mutedUntilChosen: itemValue});
                        changedSettings.data.mutedUntil = getTimeUnmuted(itemValue);
                        updateUserSettings(changedSettings);
                    }
                }
                }
            >

                {pickerItems.map((item, i) => (
                    <Picker.Item key={item[0]} label={item[0]} value={item[1]}/>
                ))}

            </Picker>
        </View>);
    };

    slidingComplete = () => {
        const {radius} = this.state;
        const {userSettings, pulses, filteredOutPulses, refilterPulses, updateUserSettings} = this.props;

        const shortenedRadius = Math.round(radius * 100) / 100;

        const changedSettings = userSettings;
        changedSettings.data.receivingRadius = shortenedRadius;

        updateUserSettings(changedSettings);


        refilterPulses(changedSettings, pulses, filteredOutPulses)
    };

    getRadiusRow = (radius) => {
        return (<View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', paddingBottom: 20}}>
            <Text style={{
                flex: 2.5, fontSize: SETTINGS_FONT_SIZE,
                paddingRight: 10
            }}>Receiving Radius</Text>
            <Slider
                style={{flex: 1.8}}
                maximumValue={MAX_RADIUS_METERS}
                onSlidingComplete={this.slidingComplete}
                width={100}
                maximumTrackTintColor={'#B3B3B3'}
                minimumTrackTintColor={'#B3B3B3'}
                thumbTintColor={'#B6D8C7'}
                value={radius}
                onValueChange={(sliderVal) => this.setState({radius: sliderVal})}/>
            <Text style={{
                flex: 1,
                textAlign: 'center',
                marginLeft: 20
            }}>{`${ metersToMiles(radius).toFixed(2) } mi`}</Text>
        </View>);
    };
    getPulseDigestRow = () => {
        const {userSettings, updateUserSettings} = this.props;
        return (<View style={styles.settingsRow}>
            <Text style={styles.settingsText}>Pulse Digest</Text>

            <Picker
                selectedValue={userSettings.data.pulseDigest}
                style={{width: 154}}
                onValueChange={(itemValue, itemIndex) => {
                    const changedSettings = userSettings;
                    changedSettings.data.pulseDigest = itemValue;
                    updateUserSettings(changedSettings)
                }
                }
            >
                <Picker.Item label="Realtime" value="realtime"/>
                <Picker.Item label="Every 30 Min" value="30min"/>
                <Picker.Item label="Every Hour" value="1hr"/>
                <Picker.Item label="Every 8 Hrs" value="8hr"/>
                <Picker.Item label="Every 24 Hrs" value="24hr"/>
                <Picker.Item label="Every Week" value="week"/>

            </Picker>
        </View>);
    };
    getAllowEmergencyPulsesRow = () => {
        const {userSettings, updateUserSettings, pulses, filteredOutPulses, refilterPulses} = this.props;
        return (<View style={styles.settingsRow}>
            <Text style={styles.settingsText}>Always Allow Emergency Pulses</Text>

            <CheckBox
                checked={userSettings ? userSettings.data.emergencyPulseCheckbox : true}
                onChange={() => {
                    const newCheckedState = !userSettings.data.emergencyPulseCheckbox;
                    const changedSettings = userSettings;
                    changedSettings.data.emergencyPulseCheckbox = newCheckedState;
                    updateUserSettings(changedSettings);
                    refilterPulses(changedSettings, pulses, filteredOutPulses)
                }
                }
            />

        </View>);
    };
    getCategoryRows = () => {
        let categoryRows = [];
        for (let i = 0; i < allCategories.length; i += 3) {
            let cols = {
                'col1': {
                    'name': allCategories[i].name,
                    'image': allCategories[i].image,
                },
                'col2': {
                    'name': allCategories[i + 1].name,
                    'image': allCategories[i + 1].image,
                },
                'col3': {
                    'name': allCategories[i + 2].name,
                    'image': allCategories[i + 2].image,
                },
            };
            categoryRows.push(cols)
        }
        return categoryRows;
    };
    setCheckBox = (imageName) => {
        const {updateUserSettings, userSettings, pulses, filteredOutPulses, refilterPulses} = this.props;

        if (userSettings) {
            const newCheckedState = !userSettings.data[imageName];

            const changedSettings = userSettings;
            changedSettings.data[imageName] = newCheckedState;

            updateUserSettings(changedSettings);
            refilterPulses(changedSettings, pulses, filteredOutPulses)
        }

    };
    getIconAndCheckbox = (image, imageName) => {
        const {userSettings} = this.props;
        return (
            <View style={styles.categoryStyle}>
                <CheckBox
                    checked={userSettings ? userSettings.data[imageName] : true}
                    onChange={() => this.setCheckBox(imageName)}
                />
                <Image style={styles.categoryIconStyle} source={image}/>
            </View>
        );
    };
    getCategories = (categoryRows) => {

        const categoryJsx = categoryRows.map((categoryRow, i) => (

            <View key={i} style={styles.categoryRowContainerStyle}>

                {this.getIconAndCheckbox(iconImages[categoryRow.col1.image], categoryRow.col1.image)}

                {this.getIconAndCheckbox(iconImages[categoryRow.col2.image], categoryRow.col2.image)}

                {this.getIconAndCheckbox(iconImages[categoryRow.col3.image], categoryRow.col3.image)}

            </View>

        ));

        return (
            <View style={styles.categoriesStyle}>

                {categoryJsx}

            </View>)
    };

    constructor(props) {
        super(props);

        this.state = {
            switchOn: true,
            radius: -1,
            inputRadius: '',
            emergencyPulseCheckbox: true,
            mutedUntilChosen: 'null',
        };
    };

    render() {
        const {radius} = this.state;
        const {userSettings} = this.props;

        if (userSettings && userSettings.data.receivingRadius && radius === -1) {
            this.setState({radius: userSettings.data.receivingRadius})
        }

        return (
            <View style={styles.container}>

                {this.getPushRow()}

                {this.getMuteRow()}

                {this.getPulseDigestRow()}

                {this.getRadiusRow(radius)}

                {this.getAllowEmergencyPulsesRow()}

                <Text style={styles.categoriesHeaderText}>Allowed Categories</Text>

                {this.getCategories(this.getCategoryRows())}

            </View>
        );
    }
}

const styles = StyleSheet.create({

    categoryStyle: {
        display: 'flex',
        flexDirection: 'row',
    },

    categoriesStyle: {
        display: 'flex',
        alignItems: 'center'
    },
    categoryRowContainerStyle: {
        display: 'flex',
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between',
        paddingBottom: 8
    },

    container: {
        paddingTop: HEADER_HEIGHT + 20,
        marginLeft: 20,
        marginRight: 20,
        height: '100%'

    },
    settingsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 20,
    },
    settingsText: {
        fontSize: SETTINGS_FONT_SIZE,
        paddingRight: 10,
    },
    categoryIconStyle: {
        height: 25,
        width: 25,
        marginRight: 5,
    },
    categoriesHeaderText: {
        textAlign: 'center',
        fontSize: SETTINGS_FONT_SIZE + 5,
        marginTop: 20,
        marginBottom: 20,
    },
});


function mapStateToProps(state, props) {
    return {
        retrievedUserId: state.dataReducer.retrievedUserId,
        filteredOutPulses: state.dataReducer.filteredOutPulses,
        pulses: state.dataReducer.pulses,
        userSettings: state.dataReducer.userSettings,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

