/**
 * Radii
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    ActivityIndicator,
    BackHandler,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {HEADER_HEIGHT, MAX_REPORTS_UNTIL_BAN} from "../../constants/constants";
import AwesomeAlert from "react-native-awesome-alerts";

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from '../../actions/actions'

import TimerMixin from 'react-timer-mixin';
import {isOverAWeekAgo, retrieveData, storeData, timestampToDate} from "../../utils/utils";
import {usersRef} from "../../firebase/FirebaseDB";

import SendBar from "../SendBar";

import PulseCard from "./PulseCards/PulseCard";
import CommentCard from "./CommentCards/CommentCard";

const reactMixin = require('react-mixin');

let listeningTo = '';

class Pulses extends Component<> {
    handleBackPress = () => {
        const {inPulseComment, imageUrl} = this.state;
        if (inPulseComment) {
            this.setState({inPulseComment: false})
        }
        else if(imageUrl){
            this.setState({imageUrl:''})
        }
        return true;
    };
    renderFooter = () => {
        const {loadingBatchPulses} = this.props;
        if (!loadingBatchPulses) return null;
        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator size="large" color="#05386B"/>
            </View>
        );
    };
    setText = (text) => {
        if (text) {
            this.setState({commentMessage: text})
        }
    };
    getReportKey = (userId, postId) => {
        return `${userId}|${postId}|reported`
    };
    reportedRetrieved = (savedData) => {
        const {commentId} = this.props;
        if (savedData === 'Not Found') {
            this.setState({
                showingReportPulseAlert: true,
                alertString: `Report this ${commentId ? 'comment' : 'pulse'}?`
            });
        }
    };
    report = (userId, pulseId, commentId) => {
        const postIdToReport = commentId ? commentId : pulseId;
        this.setState({
            alertString: `Report this ${commentId ? 'comment' : 'pulse'}?`,
            userIdToReport: userId,
            postIdToReport
        });
        retrieveData(this.getReportKey(userId, postIdToReport), this.reportedRetrieved)

    };
    showCommentAlert = () => {
        this.setState({
            alertString: 'Send this comment?',
            showingCommentAlert: true,
        });

    };
    submitButton = (report) => {
        if (report) {

            const {userIdToReport, postIdToReport} = this.state;
            const {timesReported, updateTimesReported, banUser} = this.props;

            let timesReportedRef = usersRef.child(userIdToReport).child('timesReported');

            const now = Math.floor(Date.now() / 1000);

            let timesReportedThisWeek = 0;

            for (let report in timesReported) {
                if (isOverAWeekAgo(now, timesReported[report])) {
                    timesReportedRef.child(report).set(null);
                }
                else {
                    timesReportedThisWeek += 1;
                }
            }

            updateTimesReported(userIdToReport, now);

            timesReportedThisWeek += 1;

            if (timesReportedThisWeek >= MAX_REPORTS_UNTIL_BAN) {
                banUser(userIdToReport);
            }

            storeData(this.getReportKey(userIdToReport, postIdToReport), 'true');

        }
        else {
            const {retrievedUserId, addPulseComment, pulses} = this.props;
            const {commentMessage, commentOpen} = this.state;
            addPulseComment(pulses[commentOpen].pulseId, commentMessage, retrievedUserId);
        }
    };
    showImage = (imageUrl) =>{
        this.setState({imageUrl});
    };

    constructor(props) {
        super(props);
        this.state = {
            inPulseComment: false,
            commentOpen: 0,
            showingReportPulseAlert: false,
            showingCommentAlert: false,
            userIdToReport: '',
            postIdToReport: '',
            commentMessage: '',
            loadedLastKeys: [],
            imageUrl:'',
        };

    };
    getPulsesView = (pulses) => {
        const {timedOut} = this.props;

        if (timedOut && pulses.length === 0) {
            return <View style={styles.timedOutContainer}>
                <Text style={styles.timedOutText}>No Pulses Found</Text>
            </View>
        }
        else {
            return (
                <View>
                    {pulses.length > 0 ? this.getPulseCardData(pulses) :
                        <View style={styles.loaderStyle}>
                            <ActivityIndicator size="large" color="#05386B"/>
                        </View>
                    }
                </View>);
        }
    };
    getPulseCardData = (pulseCardData) => {
        const {
            lastPulseKey,
            getNextPulseBatch,
            retrievedUserId,
            userSettings,
            loadingBatchPulses,
            filteredOutPulses
        } = this.props;

        const {loadedLastKeys} = this.state;

        return (
            <FlatList
                bounces={false}
                onEndReachedThreshold={.01}
                ListFooterComponent={this.renderFooter}
                onEndReached={() => {
                    if (!loadingBatchPulses && !loadedLastKeys.includes(lastPulseKey) && pulseCardData.length + filteredOutPulses.length > 5) {
                        this.setState({loadedLastKeys: [...loadedLastKeys, lastPulseKey]});
                        getNextPulseBatch(lastPulseKey, retrievedUserId, userSettings)
                    }
                }
                }
                data={pulseCardData}
                keyExtractor={this.keyExtractor}
                renderItem={({item, index}) =>
                    <TouchableOpacity key={item.pulseId}
                                      onPress={() => this.setState({inPulseComment: true, commentOpen: index})}>
                        <PulseCard
                            pulseMessage={item.pulseMessage}
                            boxesChecked={item.boxesChecked}
                            pulseSentTime={timestampToDate(item.pulseSentTime)}
                            pulseDistance={item.radius}
                            report={this.report}
                            pulseId={item.pulseId}
                            distanceAway={item.distanceAway}
                            userId={item.userId}
                            imageData={item.imageData||''}
                            showImage={this.showImage}
                        >

                        </PulseCard>
                    </TouchableOpacity>

                }
            />
        )

    };
    keyExtractor = (item, index) => item.pulseId;
    getCommentsView = (commentHeader) => {
        const {showingCommentAlert, showingReportPulseAlert, commentMessage} = this.state;
        const {pulseCommentsData, drawerOpen} = this.props;

        const commentCards = pulseCommentsData.map((card, i) =>
            <CommentCard key={`${card.commentId}${i}`}
                         userId={card.userId}
                         pulseId={card.pulseId}
                         commentSentTime={timestampToDate(card.commentSentTime)}
                         commentId={card.commentId}
                         drawerOpen={drawerOpen}
                         commentMessage={card.commentMessage}
                         report={this.report}
                         index={i}

            >
            </CommentCard>
        );

        const headerCard = <PulseCard drawerOpen={drawerOpen}
                                       pulseMessage={commentHeader.pulseMessage}
                                       boxesChecked={commentHeader.boxesChecked}
                                       pulseSentTime={timestampToDate(commentHeader.pulseSentTime)}
                                       pulseDistance={commentHeader.radius}
                                       report={this.report}
                                       pulseId={commentHeader.pulseId}
                                       distanceAway={commentHeader.distanceAway}
                                       userId={commentHeader.userId}
                                       commentHeader={true}
                                       imageData={commentHeader.imageData}
                                       showImage={this.showImage}
        >

        </PulseCard>;

        const deviceHeight = Dimensions.get('window').height;
        return (
            <View style={styles.commentContainer}>
                <ScrollView style={{height: deviceHeight - 135}}>
                    {headerCard}
                    {commentCards}
                </ScrollView>
                <SendBar
                    setText={this.setText}
                    showAlert={this.showCommentAlert}
                    showingCommentAlert={showingCommentAlert}
                    showingReportPulseAlert={showingReportPulseAlert}
                    placeHolder={'Comment on this pulse...'}
                    drawerOpen={drawerOpen}
                    handleBackPress={this.handleBackPress}
                    inComment={true}
                    message={commentMessage}
                />
            </View>
        )

    };
    render() {

        const {
            inPulseComment,
            commentOpen,
            showingReportPulseAlert,
            alertString,
            showingCommentAlert,
            commentMessage,
            imageUrl,
        } = this.state;

        const {drawerOpen, pulses} = this.props;

        if (drawerOpen) {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        }
        else {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        }


        const pulsesView = this.getPulsesView(pulses);



        if (inPulseComment && listeningTo !== pulses[commentOpen].pulseId) {
            const {newCommentsListener} = this.props;
            listeningTo = pulses[commentOpen].pulseId;
            newCommentsListener(pulses[commentOpen].pulseId);
        }


        return (
            <View style={{height: '100%'}}>
                <View style={styles.container}>
                    {imageUrl?
                        <View>
                            <Image
                                style={{width: '100%', height: '100%'}}
                                source={{uri: imageUrl}}
                            />
                        </View>
                        : (
                            inPulseComment ?
                                <View>
                                    {this.getCommentsView(pulses[commentOpen])}
                                </View>
                                :
                                <View>
                                    {pulsesView}
                                </View>)
                    }
                </View>

                {showingReportPulseAlert && <AwesomeAlert
                    show={showingReportPulseAlert}
                    showProgress={false}
                    title={alertString}
                    message={""}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={true}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText="Cancel"
                    confirmText="Yes"
                    confirmButtonColor={"#6F0000"}
                    onCancelPressed={() => {
                        this.setState({showingReportPulseAlert: false});

                    }}
                    onConfirmPressed={() => {
                        this.setState({showingReportPulseAlert: false});
                        this.submitButton(true);
                    }}
                />}

                {showingCommentAlert && <AwesomeAlert
                    show={showingCommentAlert}
                    showProgress={false}
                    title={alertString}
                    message={commentMessage}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={true}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText="Cancel"
                    confirmText="Yes"
                    confirmButtonColor={"#8CC7A1"}
                    onCancelPressed={() => {
                        this.setState({showingCommentAlert: false, commentMessage: ''});
                    }}
                    onConfirmPressed={() => {
                        this.setState({showingCommentAlert: false, commentMessage: ''});
                        this.submitButton(false);
                    }}
                />}
            </View>
        );
    }
}

const styles = StyleSheet.create({

        container: {
            marginTop: HEADER_HEIGHT,
        },
        timedOutContainer: {
            paddingTop: 20,
        },
        timedOutText: {
            fontSize: 18,
            textAlign: 'center'

        },
        loaderStyle: {
            paddingTop: 20
        },
        commentContainer: {}
    })
;

reactMixin(Pulses.prototype, TimerMixin);

function mapStateToProps(state, props) {
    return {
        retrievedUserId: state.dataReducer.retrievedUserId,
        latitude: state.dataReducer.latitude,
        longitude: state.dataReducer.longitude,
        radius: state.dataReducer.radius,
        pulses: state.dataReducer.pulses,
        filteredOutPulses: state.dataReducer.filteredOutPulses,
        timedOut: state.dataReducer.timedOut,
        timesReported: state.dataReducer.timesReported,
        pulseCommentsData: state.dataReducer.pulseCommentsData,
        lastPulseKey: state.dataReducer.lastPulseKey,
        userSettings: state.dataReducer.userSettings,
        loadingBatchPulses: state.dataReducer.loadingBatchPulses,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Pulses);
