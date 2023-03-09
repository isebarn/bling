import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, Button, ImageBackground } from 'react-native';
import axios from 'axios';
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';


const Layout1 = ({ story, chapterId, shaddowHeight, onPress }) => {
  let url = "https://isebarn-vid.s3.eu-west-2.amazonaws.com/"

  // find the chapter with the id of chapterId
  let chapter = story.chapters.find((chapter) => chapter.id === chapterId);

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: url + chapter.id + "/original" }} style={{
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center'
      }}
      >
        <LinearGradient colors={['transparent', ...Array(shaddowHeight).fill('black')]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 0, y: 1 }}>
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,.2)'
          }}>
            <View style={{ flex: 1 }}></View>
            <View style={{ flex: 1 }}></View>
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{
                fontSize: 30,
                fontFamily: 'Kimberley',
                color: "#BDFDFD",
                justifyContent: 'center'
              }}>
                {chapter.name}
              </Text>
              <RenderHtml contentWidth={200} source={{ html: chapter.content }} tagsStyles={styles.tagsStyles} systemFonts={systemFonts} />
              <View style={{
                flex: 1,
                alignSelf: 'stretch',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 20
              }}>

                {/* for each choice in chapter.choices make a LinearGradient with Text and if clicked, it calls the Layout1 method with the choice.chapter */}
                {chapter.choices.map((choice) => (
                  <LinearGradient key={choice.id} colors={['#FEA900', '#FE4200']} style={[styles.buttonStyle, styles.roundButton]}>
                    <Text style={{ fontSize: 20, color: 'black', backgroundColor: 'transparent', fontSize: 20, fontFamily: 'Kimberley' }} onPress={() => {
                      onPress(choice.chapter.id)
                    }}>{choice.text}</Text>
                  </LinearGradient>
                ))}

              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapterId, setChapterId] = useState('')


  const handlePress = (newChapterId) => {
    setChapterId(newChapterId);
  };


  const [loaded] = useFonts({
    MedievalSharp: require('./assets/fonts/medievalsharp/MedievalSharp.ttf'),
    Orbitron: require('./assets/fonts/Orbitron-VariableFont_wght.ttf'),
    Witless: require('./assets/fonts//witless/witless_.ttf'),
    Kimberley: require('./assets/fonts/kimberley.otf'),
  });

  // fetch data from https://storyapi.isebarn.com/api/story?$include=chapters,chapters__choices and store in data
  useEffect(() => {
    axios.get('https://storyapi.isebarn.com/api/story?$include=chapters,chapters__choices')
      .then(response => {
        setData(response.data);
        setChapterId(data[0].chapters[0].id)
        setLoading(false)
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return <Layout1
    story={data[0]}
    chapterId={chapterId}
    shaddowHeight={2}
    onPress={handlePress}
  />

}

const systemFonts = [...defaultSystemFonts, 'Orbitron', 'Witless', 'Kimberley'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  buttonStyle: {
    flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 10,
    resizeMode: 'cover',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  roundButton: {
    borderRadius: 35,
  },

  tagsStyles: {
    body: {
      whiteSpace: 'normal',
      color: 'gray'
    },
    p: {
      color: '#FFFFFD',
      overflow: 'hidden',
      fontFamily: 'Kimberley',
      marginHorizontal: 20,
    }
  }
});
