import { StyleSheet, Text, View } from 'react-native'
import React,{useEffect} from 'react'

const Welcome = ({navigation}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
          navigation.replace('Home'); // Chuyển sang màn Home sau 3 giây
        }, 3000);
        return () => clearTimeout(timer);
      }, []);
    
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Chào mừng đến với Ứng dụng!</Text>
        </View>
      );
    }

export default Welcome

const styles = StyleSheet.create({
    container: {
      flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#007bff',
    },
    title: {
      fontSize: 24, fontWeight: 'bold', color: 'white',
    },
  });