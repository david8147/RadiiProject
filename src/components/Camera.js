/**
 * Radii
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {HEADER_HEIGHT, iconImages} from "../constants/constants";
import SendBar from "./SendBar";

import Orientation from 'react-native-orientation'

export default class Camera extends Component<> {

    orientationDidChange = (orientation) => {
        this.setState(() => ({orientation}));
    };
    handleBackPress = () => {
        const {closeCamera} = this.props;
        closeCamera();
    };
    takePicture = async function () {
        const {photoTakenCallback} = this.props;
        if (this.camera && !this.takeImageClicked) {
            this.takeImageClicked = true;
            const options = {quality: 0.5, base64: true, fixOrientation: true};
            const imageData = await this.camera.takePictureAsync(options);
            this.setState({photoTaken: true, imageData});
            photoTakenCallback(imageData)
        }
    };

    constructor(props) {
        super(props);

        const orientation = Orientation.getInitialOrientation();

        this.state = {
            photoTaken: false,
            imageData: null,
            height: null,
            photoMessage: '',
            orientation
        };

        this.takeImageClicked = false;

    };


    render() {
        const {
            imageData,
            photoTaken,
        } = this.state;


        const {
            showingAlert,
            setText,
            showAlert,
            drawerOpen,
            pulseMessage
        } = this.props;


        return (

            <View style={styles.container}>

                {!photoTaken ? <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.on}
                        permissionDialogTitle={'Permission to use camera'}
                        permissionDialogMessage={'We need your permission to use your camera phone'}
                        forceUpOrientation={true}
                    /> :
                    <View>
                        <Image
                            source={{
                                isStatic: true,
                                resizeMode: Image.resizeMode.contain,
                                uri: 'data:image/jpeg;base64,' + imageData.base64,
                            }}
                            style={{height: "90%", width: '100%'}}
                        />
                    </View>
                }


                {!photoTaken ? <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
                        <TouchableOpacity
                            onPress={this.takePicture.bind(this)}
                            style={styles.capture}
                        >
                            <Image style={styles.cameraButtonStyle}
                                   source={iconImages['camera']}/>

                        </TouchableOpacity>
                    </View> :
                    <View style={styles.sendBarStyle}>
                        <SendBar
                            setText={setText}
                            showAlert={showAlert}
                            showingAlert={showingAlert}
                            placeHolder={'Say something about this image...'}
                            drawerOpen={drawerOpen}
                            imageData={imageData}
                            message={pulseMessage}
                        />
                    </View>}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
        paddingTop: HEADER_HEIGHT,
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        margin: 20
    },
    cameraButtonStyle: {
        height: 40,
        width: 40,
    },
    sendBarStyle: {
        marginBottom: 20,
        marginTop: -15,
    },
});
