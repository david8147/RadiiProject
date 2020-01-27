/**
 * Radii
 * @format
 * @flow
 */

import React, {Component} from 'react';

import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CommentVoteComponent from "./CommentVoteComponent";
import {iconImages} from "../../../constants/constants";

export default class CommentCard extends Component<> {

    constructor(props) {
        super(props);
        this.state = {numReceived: 0, numComments: 0};
    };

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
            userId,
            pulseId,
            commentSentTime,
            commentId,
            drawerOpen,
            commentMessage,
            report,
            commentHeader,
            elevation,
            opacity,
            cornerRadius,
            comment,
            commentsRefId
        } = this.props;

        let containerStyle = styles.commentContainer;
        let textStyle = styles.commentTextStyle;
        let dateTextStyle = styles.commentDateStyle;
        let dateTextContainer = styles.commentDateTextContainer;


        return (

            <View style={(drawerOpen ? styles.invisible : [cardStyle.container, containerStyle])}>

                <View style={styles.pulseTextContainer}>

                    <Text style={textStyle}>{commentMessage}</Text>

                    <CommentVoteComponent commentsRefId={commentsRefId} pulseId={pulseId} commentId={commentId}
                                          commentHeader={commentHeader}
                                          comment={comment}/>
                </View>

                <View style={styles.bottomRow}>


                    <View style={styles.inRow}>
                        <TouchableOpacity

                            onPress={() => {

                                report(userId, pulseId, commentId)

                            }}>

                            <Image style={styles.iconStyle} source={iconImages['report']}/>

                        </TouchableOpacity>


                    </View>

                    <View style={dateTextContainer}>

                        <Text style={dateTextStyle}>{commentSentTime}</Text>

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
    commentContainer: {
        padding: 15,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 2,
        marginBottom: 2,
        backgroundColor: '#ffffff',
        elevation: 3,
        opacity: 1
    },
    pulseTextContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    textStyle: {
        width: 358,
    },


    commentTextStyle: {
        width: 350,
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
        width: 80,
    },
    commentDateStyle: {
        fontSize: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    commentIconRow: {},
    iconStyle: {
        display: 'flex',
        flexDirection: 'row',
        height: 15,
        width: 15,
        marginLeft: 2,
        marginRight: 2,
    },

    dateTextContainer: {
        width: 29,
    },

    commentDateTextContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },

    dateTextStyle: {},

    distanceContainer: {
        width: 47
    },

});
