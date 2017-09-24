import React from 'react';
import { View, Image } from 'react-native';
import { distance } from 'react-native-google-matrix';

var distance = require('react-native-google-matrix');


distance.get(
    {
      origin: 'San Francisco, CA',
      destination: 'San Diego, CA'
    },
    function(err, data) {
      if (err) return console.log(err);
      console.log(data);
  });