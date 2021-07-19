import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Routes from './Routes';
import {Provider} from 'react-redux';
import store from '../redux/store';
const index = () => {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

export default index;

const styles = StyleSheet.create({});
