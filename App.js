/**
 * Radii
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import {setCustomText} from 'react-native-global-props';
import {Provider} from 'react-redux';
import store from './src/store';

import Controller from "./src/components/Controller";


const customTextProps = {
    style: {
        fontFamily: 'productsans',
    }
};


export default class App extends Component {

    constructor(props){
        super(props);
        setCustomText(customTextProps);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
        });
    }

    render() {
        return (
            <Provider store={store}>
                <View style={styles.container}>
                    <Controller/>
                </View>
            </Provider>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    }
});



