/**
 * Radii
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {allCategories, iconImages, MAX_CATEGORIES} from "../../constants/constants";
import CheckBox from '../CheckBox'

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../../actions/actions'
import {retrieveData, storeData} from "../../utils/utils";

class SubmitPulseModal extends Component<> {

    setCheckBox = (i) => {
        const {numChecked} = this.state;
        if (this.state[i]) {
            if (numChecked > 0) {
                this.setState({numChecked: numChecked - 1, [i]: !this.state[i]});
            }
        }
        else {
            if (numChecked < MAX_CATEGORIES) {
                this.setState({numChecked: numChecked + 1, [i]: !this.state[i]});
            }
        }

    };
    getBoxesChecked = () => {
        let categoriesList = [];
        for (let i of allCategories) {
            categoriesList.push(i.image);
        }

        let checkedBoxes = [];
        for (let i = 0; i < 12; i++) {
            if (this.state[i]) {
                checkedBoxes.push(categoriesList[i])
            }
        }
        return checkedBoxes
    };
    getCategories = () => {
        return (allCategories.map((category, i) => (

            <View key={i}>
                <View style={styles.categoryStyle}>
                    <CheckBox
                        onChange={() => this.setCheckBox(i)}
                        checked={this.state[i]}
                    />
                    <Image style={styles.categoryIconStyle} source={iconImages[category.image]}/>
                </View>
            </View>
        )))
    };
    sendButtonClicked = () => {

        let boxesChecked = {};

        for (let i = 0; i < 12; i += 1) {
            boxesChecked[i] = this.state[i];
        }

        storeData('boxesChecked', JSON.stringify(boxesChecked));

        const {
            hideAlert,
            sendPulse,
            pulseMessage,
            imageData,
            retrievedUserId,
            curLatitude,
            curLongitude,
            radius
        } = this.props;
        hideAlert();

        sendPulse(
            this.getBoxesChecked(),
            pulseMessage,
            imageData,
            retrievedUserId,
            curLatitude,
            curLongitude,
            radius
        )
        ;
    };

    getSavedBoxesChecked = (data) =>{
        let jsonData = JSON.parse(data);
        let numChecked = 0;
        for(let boxNum in jsonData){
            this.setState({[boxNum]: jsonData[boxNum]});
            if (jsonData[boxNum]){
                numChecked += 1;
            }
        }
        this.setState({numChecked})
    };

    constructor(props) {
        super(props);

        retrieveData('boxesChecked', this.getSavedBoxesChecked);

        this.state = {
            numChecked: 0,
            0: false,
            1: true,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false,
            8: false,
            9: false,
            10: false,
            11: false,
        };
    };

    render() {

        const {
            showingAlert,
            hideAlert,
            pulseMessage,
            imageData,
        } = this.props;

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showingAlert}

                onRequestClose={() => {
                    alert('Modal has been closed.');
                }}>

                <View style={styles.container}>
                    <View style={[styles.modalContent]}>

                        <Text style={[styles.mainTextStyle]}>Choose Pulse Categories</Text>
                        <View style={styles.categories}>
                            {this.getCategories()}
                        </View>

                        <Text style={styles.mainTextStyle}>Send this pulse?</Text>


                        {imageData && <Image
                            source={{
                                isStatic: true,
                                resizeMode: Image.resizeMode.contain,
                                uri: 'data:image/jpeg;base64,' + imageData.base64,
                            }}
                            style={{height: imageData.height / 10, width: imageData.width / 10, marginBottom: 10}}
                        />
                        }

                        <View style={styles.messageTextContainer}>
                            <Text
                                style={styles.messageText}>{pulseMessage}</Text>
                        </View>
                        <View style={styles.buttons}>
                            <TouchableOpacity style={[styles.buttonStyle, styles.cancelButton]}
                                              onPress={() => hideAlert()}>
                                <Text style={styles.buttonTextStyle}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.buttonStyle, styles.sendButton]}
                                              onPress={() => this.sendButtonClicked()}>
                                <Text style={styles.buttonTextStyle}>Send Pulse</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 100,
        marginRight: 100,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

    },
    modalContent: {
        backgroundColor: 'white',
        // height: 290,
        width: 390,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 10
    },
    mainTextStyle: {
        fontSize: 18,

        paddingTop: 10,
        paddingBottom: 10,

    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 10,
    },
    buttonStyle: {
        borderRadius: 5,
        borderWidth: 1,
        padding: 5,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10
    },

    cancelButton: {
        backgroundColor: '#D0D0D0',
        borderColor: '#D0D0D0'
    },
    sendButton: {
        backgroundColor: '#8CC7A1',
        borderColor: '#8CC7A1'
    },

    buttonTextStyle: {
        color: 'white',
        textAlign: 'center'
    },
    categories: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',

        width: '90%',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center'
    },
    categoryIconStyle: {
        height: 20,
        width: 20,
        marginLeft: 2,
    },
    categoryStyle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 8,
    },

    messageTextContainer: {
        paddingLeft: 10,
        paddingRight: 20,
    },
    messageText: {}


});


function mapStateToProps(state, props) {
    return {
        retrievedUserId: state.dataReducer.retrievedUserId,
        curLatitude: state.dataReducer.curLatitude,
        curLongitude: state.dataReducer.curLongitude,
        radius: state.dataReducer.radius,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitPulseModal);
