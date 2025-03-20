import React, { Component } from "react";
import { View, Text, Image } from 'react-native';
class App extends Component {
    render() {
      return(
          <View>
            <Text style={{color: '#4B0082', fontSize: 30, margin: 10}}>Jogos</Text>
            <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/pt/9/99/Super_Mario_Odyssey_Capa.png'}}
            style={{width: 150, height: 250}}
          />
            <Text>Nome: Super Mario Odyssey</Text>
            <Text>Lançamento: 27 de outubro de 2017</Text>

            <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/pt/e/ef/Super_Mario_Maker_2_capa.png'}}
            style={{width: 150, height: 250}}
            
          />
          <Text>Super Mario Maker 2</Text>
          <Text>Lançamento:28 de junho de 2019</Text>
          </View>
      );
    }
}
export default App;