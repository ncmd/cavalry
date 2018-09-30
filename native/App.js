import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {Container, Content} from 'native-base'
import Swiper from 'react-native-swiper';
import {createBottomTabNavigator, tabBarOptions} from 'react-navigation';

import Runbooks from './src/views/runbooks';
import Account from './src/views/account';
import Inbox from './src/views/inbox';
import Requests from './src/views/requests';
import Team from './src/views/team';

import Icon from 'react-native-vector-icons/MaterialIcons'

export default createBottomTabNavigator({
  Runbooks: {
    screen: Runbooks,
    navigationOptions:{
      tabBarLabel:'RUNBOOKS',
      tabBarIcon:({tintColor}) => (
        <Icon name="search" color={tintColor} size={24} />
      )
    }
  },
  Requests:{
    screen: Requests,
    navigationOptions:{
      tabBarLabel:'REQUESTS',
      tabBarIcon:({tintColor}) => (
        <Icon name="speaker-notes" color={tintColor} size={24} />
      )
    }
  },
  Inbox:{
    screen: Inbox,
    navigationOptions:{
      tabBarLabel:'INBOX',
      tabBarIcon:({tintColor}) => (
        <Icon name="mail-outline" color={tintColor} size={24} />
      )
    }
  },
  Team:{
    screen: Team,
    navigationOptions:{
      tabBarLabel:'TEAM',
      tabBarIcon:({tintColor}) => (
        <Icon name="group" color={tintColor} size={24} />
      )
    }
  },
  Account:{
    screen: Account,
    navigationOptions:{
      tabBarLabel:'ACCOUNT',
      tabBarIcon:({tintColor}) => (
        <Icon name="accessibility" color={tintColor} size={24} />
      )
    }
  }
}, tabBarOptions:{
  activeTintColor:'blue',
  inactiveTintColr:'grey',
  style:{
    backgroundColor: 'white',
    borderTopWidth: 0,
    shadowOffset: { width: 5, height: 3},
    shadowColor: 'black',
    shadowOpacity: 0.5,
    elevation:5,
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
