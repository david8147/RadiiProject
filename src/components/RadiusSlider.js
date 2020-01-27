/**
 * Radii
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Slider} from 'react-native-elements'
import {iconImages, MAX_RADIUS_METERS, MIN_RADIUS_METERS} from "../constants/constants";


export default class RadiusSlider extends Component<> {

    constructor(props) {
        super(props);
    };


    updateRadius = (sliderVal) => {
        this.props.updateRadius(sliderVal);
    };

    stepForward = (radius) => {
        const newVal = radius - radius / 3;
        if (newVal > 10) {
            return newVal
        }
        return 10;
    };

    stepBackward = (radius) => {
        const newVal = radius + radius / 3;

        if (newVal <= MAX_RADIUS_METERS) {
            return newVal
        }
        return radius;
    };

    render() {
        const {radius, maxRadius} = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.updateRadius(this.stepForward(radius))}>
                    <Image style={styles.arrowStyle}
                           source={iconImages['up_arrow']}/>
                </TouchableOpacity>


                <View style={styles.sliderStyle}>
                    <Slider
                        maximumValue={maxRadius}
                        minimumValue={MIN_RADIUS_METERS}
                        maximumTrackTintColor={'#b3b3b3'}
                        minimumTrackTintColor={'#b3b3b3'}
                        //thumbTintColor={'#8CAEAE'}
                        thumbTintColor={'#B6D8C7'}
                        orientation={"vertical"}
                        value={radius}
                        onValueChange={(sliderVal) => this.updateRadius(sliderVal)}/>
                </View>

                <TouchableOpacity onPress={() => this.updateRadius(this.stepBackward(radius))}>
                    <Image style={styles.arrowStyle}
                           source={iconImages['down_arrow']}/>

                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // marginLeft: 'auto'
    },
    arrowStyle: {
        width: 50,
        height: 50
    },
    sliderStyle: {}
});
