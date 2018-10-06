import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Team extends Component {
  render(){
    return (
      <View style={styles.container}>
      <Text>team</Text>
      </View>
    )
  }
}

export default Team;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
