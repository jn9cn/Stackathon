import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';

const OverlayButton = ({ onButtonPress }) => (
    <View>
        <Text>Please sign-in with Google to load your places</Text>
        <Button title="Load My Places" onPress={this._handleButtonPress} style={{marginBottom: 10}}>
            <Text>Load My Places</Text>
        </Button>
    </View>
);

const BottomButton = ({ onButtonPress }) => (
    <View styleName="horizontal">
            <Button>
                <Text>My Location</Text>
            </Button>
    </View>
);

export { OverlayButton, BottomButton };