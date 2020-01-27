/**
 * Radii
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {iconImages} from "../../../constants/constants";


import {pulsesRef} from "../../../firebase/FirebaseDB";
import {retrieveData, storeData} from "../../../utils/utils";

export default class PulseVoteComponent extends Component<> {

    getVotedKey = (upVotedOrDownVoted) => {
        const {pulseId} = this.props;
        return `${pulseId}|${upVotedOrDownVoted}`
    };

    getUpVotedState = (upVoted) => {
        if (upVoted === 'true') {
            this.setState({upVoted: true})
        }
    };
    getDownVotedState = (downVoted) => {
        if (downVoted === 'true') {
            this.setState({downVoted: true})
        }
    };
    tapUp = () => {
        const {upVoted, downVoted, votes, voteRef} = this.state;

        const upKey = this.getVotedKey('upVoted');
        const downKey = this.getVotedKey('downVoted');

        let newVotes = votes;


        if (upVoted) {
            newVotes -= 1;
            storeData(upKey, 'false');
            this.setState({upVoted: false});
        }
        else if (downVoted) {
            newVotes += 2;
            storeData(upKey, 'true');
            storeData(downKey, 'false');

            this.setState({upVoted: true});
            this.setState({downVoted: false});
        }
        else if (!upVoted && !downVoted) {
            newVotes += 1;
            storeData(upKey, 'true');
            this.setState({upVoted: true});
        }

        voteRef.set(newVotes);
    };

    tapDown = () => {

        const {upVoted, downVoted, votes, voteRef} = this.state;
        const upKey = this.getVotedKey('upVoted');
        const downKey = this.getVotedKey('downVoted');

        let newVotes = votes;
        if (downVoted) {
            newVotes += 1;
            storeData(downKey, 'false');
            this.setState({downVoted: false})
        }
        else if (upVoted) {
            newVotes -= 2;
            this.setState({upVoted: false});
            this.setState({downVoted: true});

            storeData(upKey, 'false');
            storeData(downKey, 'true');
        }
        else if (!upVoted && !downVoted) {
            newVotes -= 1;
            this.setState({downVoted: true});
            storeData(downKey, 'true');
        }

        voteRef.set(newVotes);

    };

    getVoteRef = () => {
        const {pulseId} = this.props;
        return pulsesRef.child(pulseId).child('votes');
    };

    constructor(props) {
        super(props);
        this.state = {votes: 0, upVoted: false, downVoted: false};
    };

    componentDidMount() {

        const upKey = this.getVotedKey('upVoted');
        const downKey = this.getVotedKey('downVoted');

        retrieveData(upKey, this.getUpVotedState);
        retrieveData(downKey, this.getDownVotedState);

        const voteRef = this.getVoteRef();
        this.setState({voteRef: voteRef});

        voteRef.on("value", function (dataSnapshot) {
            this.setState({
                votes: dataSnapshot.val()
            });
        }.bind(this));

    }


    componentWillUnmount() {
        const {voteRef} = this.state;
        if (voteRef) {
            voteRef.off('value')
        }

    }


    render() {
        const {votes, upVoted, downVoted} = this.state;
        const {commentHeader} = this.props;

        let arrowStyle = styles.arrowStyle;
        if (commentHeader) {
            arrowStyle = styles.headerArrowStyle
        }

        return (
            <View style={styles.container}>

                <TouchableOpacity style={[styles.buttonStyle, styles.cancelButton]}
                                  onPress={() => this.tapUp()}>

                    <Image style={[arrowStyle, {opacity: (upVoted ? 1 : .4)}]} source={iconImages['up_arrow']}/>
                </TouchableOpacity>


                <Text style={commentHeader && styles.headerTextStyle}>{votes}</Text>

                <TouchableOpacity style={[styles.buttonStyle, styles.cancelButton]}
                                  onPress={() => this.tapDown()}>
                    <Image style={[arrowStyle, {opacity: (downVoted ? 1 : .4)}]}
                           source={iconImages['down_arrow']}/>
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    arrowStyle: {
        height: 30,
        width: 30,
    },
    headerArrowStyle: {
        height: 40,
        width: 40,
    },

    headerTextStyle: {
        fontSize: 22
    },

});
