import React, { Component } from "react";
import { View, Text, Image, ScrollView} from 'react-native';
import { useFonts, Inter_300Light } from "@expo-google-fonts/inter"; 
class App extends Component {
    render() {

    

      return(
        <ScrollView>
          <View>
            <Text style={{color: '#4B0082', fontSize: 25, margin: 10, fontFamily: Inter_300Light, borderWidth: 1, display:'inline-block'}}>Detalhes</Text>
            
            

            <Image
            source={{ uri: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000001130/c42553b4fd0312c31e70ec7468c6c9bccd739f340152925b9600631f2d29f8b5'}}
            style={{width: 400, height: 300}}
          />
          
          <Text style={{borderWidth: 0.5, display:'inline-block'}}>Super Mario Odyssey{"\n"} é um jogo de plataforma lançado para o Nintendo Switch em 2017. {"\n"} Mario embarca em uma jornada para resgatar a Princesa Peach de Bowser,{"\n"} viajando por diversos reinos com a ajuda de Cappy, um chapéu mágico. {"\n"}O jogo destaca-se pela exploração aberta, permitindo que Mario possua inimigos e objetos ao lançar Cappy,{"\n"} o que traz novas mecânicas ao gameplay.{"\n"} Cada reino tem um visual único e oferece desafios e missões para completar. {"\n"}Elogiado por sua liberdade de exploração e trilha sonora.</Text>
          <Text style={{borderWidth: 0.5, display:'inline-block'}}>Preço: R$349,00{"\n"}Duração: 13h{"\n"}Lançamento: 27/10/2017{"\n"}Metacritc: 97%</Text>

          <Image 
          source={{uri: 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_400/ncom/pt_BR/games/switch/s/super-mario-odyssey-switch/description-image'}}
          />

          <Jobs
            largura={150} altura={150}
          />
          </View>
          </ScrollView>
      );
    }
}
export default App;

class Jobs extends Component {
  render(){
    
    let img = 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_400/ncom/pt_BR/games/switch/s/super-mario-odyssey-switch/description-image';
    let img2 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOlJD0g_xjyw7gNaYaRo1rFou1rjm8uxTYBw&s';
    let img3 = 'https://upload.wikimedia.org/wikipedia/pt/b/bc/Bowser_New_Super_Mario.jpg';
    let img4 = 'https://i.pinimg.com/736x/fd/ec/c7/fdecc7d68e5836df8027ee5beb76bee2.jpg';
    
    return(
      
      <View>
        
        <Image 
          source={{uri: img}}
          style={{width: this.props.largura, height: this.props.altura, borderWidth: 1, display:'inline-block', }}
        />
        
         <Image
          source={{uri: img2}}
          style={{width: this.props.largura, height: this.props.altura, borderWidth: 1, display:'inline-block'}}
        />
         <Image
         
          source={{uri: img3}}
          style={{width: this.props.largura, height: this.props.altura, borderWidth: 1, display:'inline-block'}}
        />
         <Image
          source={{uri: img4}}
          style={{width: this.props.largura, height: this.props.altura, borderWidth: 1, display:'inline-block'}}
        />
      
      </View>
      
    );
  }
}
