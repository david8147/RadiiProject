/**
 * Radii
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {iconImages} from "../constants/constants";


export default class RadiusSlider extends Component<> {

    constructor(props) {
        super(props);
    };


    render() {
        const {checked, onChange} = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={onChange}>
                    <Image style={styles.checkboxStyle}
                           source={checked ? iconImages['checked'] : iconImages['unchecked']}/>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},

    checkboxStyle: {
        height: 30,
        width: 30,
    },

});
