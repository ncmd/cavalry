import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Account extends Component {
  render(){
    return (
      <View style={styles.container}>
      <Text>account</Text>
      </View>
    )
  }
}

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
