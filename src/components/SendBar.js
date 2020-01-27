/**
 * Radii
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Image, StyleSheet, TextInput, TouchableOpacity, View, Keyboard} from 'react-native';
import {iconImages, MAX_RADIUS_METERS} from "../constants/constants";
import RadiusSlider from "./RadiusSlider"

export default class SendBar extends Component<> {

    constructor(props) {
        super(props);
        this.state = {
            isMounted: false
        }
    };

    submitButtonClicked = () =>{
      const {showAlert, message} = this.props;
        if (message) {
            showAlert();
            Keyboard.dismiss()
        }
    };

    changeText = (text) =>{
        const {setText} = this.props;
        this.setState({text});
        setText(text);
    };

    render() {
        const {
            drawerOpen,
            radius,
            updateRadius,
            placeHolder,
            showingAlert,
            openCamera,
            handleBackPress,
            inComment,
            showingCommentAlert,
            showingReportPulseAlert
        } = this.props;

        const {text} = this.state;


        if ((showingCommentAlert || showingAlert) && this.textInput) {
            this.textInput.clear();
        }

        return (

            <View style={styles.bottomItems}>

                {openCamera ? <TouchableOpacity onPress={() => openCamera()}>
                        <Image style={drawerOpen ? styles.invisible : styles.cameraButtonStyle}
                               source={iconImages['camera']}/>
                    </TouchableOpacity> :


                    <TouchableOpacity onPress={() => handleBackPress()}>
                        <Image style={drawerOpen ? styles.invisible : styles.backButtonStyle}
                               source={iconImages['backButton']}/>
                    </TouchableOpacity>

                }

                <TextInput ref={input => {
                    this.textInput = input
                }}
                           style={[(drawerOpen ? styles.invisible : styles.textInputStyle), ((showingCommentAlert||showingReportPulseAlert) && inComment)?styles.transparent:'']}
                           underlineColorAndroid={'transparent'}
                           paddingLeft={10}
                           placeholder={placeHolder}
                           value={text}
                           onChangeText={(text) => this.changeText(text)}
                           onSubmitEditing={() => {
                               this.submitButtonClicked();
                           }}
                />

                <TouchableOpacity onPress={() => {
                    this.submitButtonClicked();
                }
                }>
                    <Image style={drawerOpen ? styles.invisible : styles.sendStyle}
                           source={iconImages['send']}/>
                </TouchableOpacity>

                {radius && <View style={drawerOpen ? styles.invisible : styles.sliderStyle}>
                    <RadiusSlider maxRadius={MAX_RADIUS_METERS} updateRadius={updateRadius}
                                  radius={radius}
                    />
                </View>
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    bottomItems: {
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
    },
    sendStyle: {
        marginRight: 15,
        height: 30,
        width: 30,

    },
    cameraButtonStyle: {
        marginLeft: 15,
        height: 30,
        width: 30,
    },

    backButtonStyle: {
        marginLeft: 15,
        height: 15,
        width: 15,
    },
    invisible: {
        opacity: 0
    },
    textInputStyle: {
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',

        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        backgroundColor: 'white',
        marginLeft: 15,
        marginRight: 15,
    },
    transparent: {
        opacity: .1
    }
});


