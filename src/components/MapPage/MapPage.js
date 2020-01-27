/**
 * Radii
 * @format
 * @flow
 */

import React, {Component} from 'react';
import MapView, {Circle} from 'react-native-maps';
import {StyleSheet, View} from 'react-native';
import {getMapRegion, storeData} from "../../utils/utils";


import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../../actions/actions'
import SubmitPulseModal from "./SubmitPulseModal";
import SendBar from "../SendBar";
import Camera from "../Camera";
import {MAX_RADIUS_METERS} from "../../constants/constants";


class MapPage extends Component {


    showAlert = () => {
        this.closeCamera();
        this.setState({
            showingAlert: true
        });
    };

    hideAlert = () => {
        this.setState({
            showingAlert: false
        });
    };

    setText = (text) => {
        this.setState({pulseMessage: text})
    };

    openCamera = () => {
        this.setState({cameraOn: true})
    };

    closeCamera = () => {
        this.setState({cameraOn: false})
    };

    photoTakenCallback = (imageData) => {
        this.setState({imageData})
    };

    updateRadius = (radius) => {
        const {addRadiusToStore} = this.props;
        if (radius > 0 && radius < MAX_RADIUS_METERS) {
            addRadiusToStore(radius);
            storeData('radius', radius.toString())
        }
    };


    constructor(props) {
        super(props);

        this.state = {
            showingAlert: false,
            pulseMessage: '',
            cameraOn: false,
            photoMessage: '',
        };
    };
    render() {

        const {
            pulseMessage,
            showingAlert,
            cameraOn,
            imageData,
        } = this.state;
        const {
            drawerOpen,
            // longitude,
            // latitude,
            radius,
            curLatitude,
            curLongitude,
        } = this.props;

        //const circleColor = 'rgba(119, 186, 153, .5)';
        const circleColor = 'rgba(133, 193, 163, .5)';
        //const circleColor = 'rgba(180,180,180, .5)';c


        return (

            <View style={styles.map}>
                {cameraOn ?
                    <Camera
                        drawerOpen={drawerOpen}
                        closeCamera={this.closeCamera}
                        photoTakenCallback={this.photoTakenCallback}
                        showAlert={this.showAlert}
                        setText={this.setText}
                        showingAlert={showingAlert}
                        pulseMessage={pulseMessage}
                    />
                    :
                    <View style={styles.map}>
                        <MapView
                            style={styles.map}
                            showUserLocation
                            followUserLocation
                            loadingEnabled
                            // customMapStyle={mapStyle}
                            region={getMapRegion(radius, curLatitude, curLongitude)}
                        >
                            <Circle fillColor={circleColor} center={{
                                latitude: curLatitude,
                                longitude: curLongitude
                            }}
                                    radius={radius}
                                    strokeWidth={0}/>

                        </MapView>

                        <SendBar
                            setText={this.setText}
                            showAlert={this.showAlert}
                            showingAlert={showingAlert}
                            radius={radius}
                            placeHolder={'What would you like to say?'}
                            drawerOpen={drawerOpen}
                            openCamera={this.openCamera}
                            message={pulseMessage}
                            updateRadius={this.updateRadius}
                        />

                        <SubmitPulseModal
                            pulseMessage={pulseMessage}
                            showingAlert={showingAlert}
                            hideAlert={this.hideAlert}
                            imageData={imageData}
                        />
                    </View>
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bottomItems: {
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'center',

    },
    textInputStyle: {
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: 15,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        backgroundColor: 'white',
    },
    sendStyle: {
        marginLeft: 15,
        height: 30,
        width: 30,

    },
    sliderStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    menuContainer: {},
    menuStyle: {
        marginLeft: 5,
        height: 40,
        width: 40,
    },
    topItems: {
        marginBottom: 'auto',
    },
    invisible: {
        opacity: 0
    },

    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
});


function mapStateToProps(state, props) {
    return {
        retrievedUserId: state.dataReducer.retrievedUserId,
        radius: state.dataReducer.radius,
        curLatitude: state.dataReducer.curLatitude,
        curLongitude: state.dataReducer.curLongitude,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MapPage);
