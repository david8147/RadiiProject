/**
 * Radii
 * @format
 * @flow
 */

import React, {Component} from 'react';

import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import PulseVoteComponent from "./PulseVoteComponent";
import {iconImages} from "../../../constants/constants";
import {truncateDistance, truncateLargeNumber} from "../../../utils/utils";
import {pulsesRef} from "../../../firebase/FirebaseDB";

export default class PulseCard extends Component<> {

    getIconRow = (icons) => {
        return (icons.map((imageName, i) => <Image key={i} style={styles.iconStyle} source={iconImages[imageName]}/>))
    };

    constructor(props) {
        super(props);
        this.state = {numReceived: 0, numComments: 0, imageUrl: ''};
    };

    componentDidMount() {
        const {pulseId, imageData} = this.props;

        const numReceivedRef = pulsesRef.child(pulseId).child('numReceived');
        numReceivedRef.on("value", function (dataSnapshot) {
            const numReceived = dataSnapshot.val();
            if (numReceived && numReceived !== 0) {
                this.setState({
                    numReceived
                });
                numReceivedRef.off("value");
            }
        }.bind(this));


        const numCommentsRef = pulsesRef.child(pulseId).child('numComments');
        numCommentsRef.on("value", function (dataSnapshot) {
            this.setState({
                numComments: dataSnapshot.val() || 0
            });
        }.bind(this));

        if (imageData === 'ontheway') {
            const imageDataRef = pulsesRef.child(pulseId).child('pulseData').child('imageData');
            imageDataRef.on("value", function (dataSnapshot) {
                if (dataSnapshot.val()) {
                    this.setState({
                        imageUrl: dataSnapshot.val() || imageData
                    });
                    imageDataRef.off("value");
                }
            }.bind(this));
        }

    }

    render() {

        const cardStyle = Platform.select({
            ios: () =>
                StyleSheet.create({
                    container: {
                        shadowRadius: elevation,
                        shadowOpacity: opacity,
                        shadowOffset: {width: 0, height: elevation},
                        borderRadius: cornerRadius,
                        backgroundColor: this.props.backgroundColor,
                        // width: Dimensions.get('window').width - 40,
                    }
                }),
            android: () =>
                StyleSheet.create({
                    container: {
                        elevation: elevation,
                        borderRadius: cornerRadius,
                        backgroundColor: this.props.backgroundColor,
                    }
                })
        })();

        const {
            elevation,
            opacity,
            cornerRadius,
            pulseMessage,
            boxesChecked,
            pulseSentTime,
            report,
            userId,
            pulseId,
            distanceAway,
            commentHeader,
            imageData,
            showImage
        } = this.props;

        const {numReceived, numComments, imageUrl} = this.state;

        let containerStyle = styles.container;
        let textStyle = styles.textStyle;
        let dateTextContainer = styles.dateTextContainer;
        let dateTextStyle = styles.dateTextStyle;

        if (commentHeader) {
            containerStyle = styles.headerContainer;
            textStyle = styles.headerTextStyle;
        }

        const url = imageUrl || imageData;

        return (
            <View style={[cardStyle.container, containerStyle]}>


                <View style={styles.pulseTextContainer}>
                    <Text style={textStyle}>{pulseMessage}</Text>

                    <PulseVoteComponent commentHeader={commentHeader} pulseId={pulseId}/>
                </View>

                {url !== '' &&
                <TouchableOpacity onPress={() => showImage(url)}>
                    <Image
                        style={{width: '100%', height: 200}}
                        source={{uri: url}}
                    />
                </TouchableOpacity>
                }

                <View style={styles.bottomRow}>


                    <View style={styles.inRowIcons}>
                        {this.getIconRow(boxesChecked)}
                    </View>


                    <View style={styles.distanceContainer}><Text>{truncateDistance(distanceAway)}</Text></View>


                    <View>
                        <View style={styles.imageTextRow}>
                            <Image style={styles.iconStyle} source={iconImages['message']}/>
                            <Text>{truncateLargeNumber(numComments)}</Text>
                        </View>
                    </View>

                    <View>
                        <View style={styles.imageTextRow}>
                            <Image style={styles.iconStyle} source={iconImages['people']}/>
                            <Text>{truncateLargeNumber(numReceived)}</Text>
                        </View>
                    </View>

                    <View style={styles.inRow}>
                        <TouchableOpacity
                            onPress={() => {
                                report(userId, pulseId)
                            }}>
                            <Image style={styles.iconStyle} source={iconImages['report']}/>
                        </TouchableOpacity>

                    </View>

                    <View style={dateTextContainer}>
                        <Text style={dateTextStyle}>{pulseSentTime}</Text>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        margin: 5,
        backgroundColor: '#ffffff',
        elevation: 3,
        opacity: 1,

    },
    headerContainer: {
        padding: 15,
        margin: 5,
        backgroundColor: '#ffffff',
        elevation: 6,
        opacity: 1,
    },
    pulseTextContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    textStyle: {
        width: 346,
    },

    headerTextStyle: {
        fontSize: 18,
        width: 340,
    },
    centerItems: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    invisible: {
        opacity: 0,
    },
    bottomRow: {
        paddingTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    inRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageTextRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: 37
    },

    inRowIcons: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: 60,
    },

    iconStyle: {
        display: 'flex',
        flexDirection: 'row',
        height: 15,
        width: 15,
        marginLeft: 2,
        marginRight: 2,
    },

    dateTextContainer: {
        width: 40,
    },

    dateTextStyle: {},

    distanceContainer: {
        width: 47
    },

});
