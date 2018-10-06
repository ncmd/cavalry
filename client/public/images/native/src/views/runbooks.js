import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

class Runbooks extends Component {


componentWillMount(){
  this.startHeaderHeight = 80
  if(Platform.OS == 'android'){
    this.startHeaderHeight = 100 + StatusBar.currentHeight
  }
}


  render(){
    return (
      <SafeAreaView style={{flex:1, paddingTop:20}}>
        <View style={{flex:1}}>
          <View style={{height: this.startHeaderHeight, backgroundColor:'white', borderBottomWidth:1, borderBottomColor:'#dddddd'}}>
            <View style={{
                flexDirection:'row',
                padding: 10,
                backgroundColor: 'white',
                marginHorizontal: 20,
                shadowOffset: { width: 0, height:0},
                shadowColor: 'black',
                shadowOpacity: 0.2,
                elevation: 5,
                marginTop: Platform.OS == 'android' ? 30 : null}}>
              <Icon name="search" size={25}></Icon>
              <TextInput placeholder="Search for a Runbook" placeholderTextColor="grey" style={{flex:1, fontWeight:'400', backgroundColor:'white', paddingBottom:10}}/>
            </View>
          </View>
          <ScrollView scrollEventThrottle={16}>
            <View style={{flex:1, backgroundColor:'white',paddingTop:20}}>
              <Text style={{fontSize:20, fontWeight:'400', paddingHorizontal:20}}>What can we help you find?</Text>
              <View style={{height:130, marginTop:20}}>
                <ScrollView>
                  <View style={{height:130, height:130}}>
                    <View style={{flex:2}}>
                      <Image style={{flex:1, width:null, height:null, resizeMode:'cover', backgroundColor:'blue'}}></Image>
                    </View>
                    <View style={{flex:1, paddingLeft: 10, paddingTop:10}}>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}

export default Runbooks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
