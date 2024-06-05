import { useEffect, useLayoutEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tw, { useDeviceContext } from 'twrnc';
import { Provider } from 'react-redux';
import { store } from './store';
import MasonryList from '@react-native-seoul/masonry-list'
import { useSearchNotesQuery, useAddNoteMutation, useDeleteNoteMutation } from './db';

const bodyColor = ['rgb(241, 245, 249)', 'rgb(30,41,59)']
const headerColor = ['rgb(156, 163, 175)', 'rgb(15,23,42)']

function HomeScreen({ navigation }) {
  const { data: searchData, error, isLoading } = useSearchNotesQuery("");
  const [ deleteNote ] = useDeleteNoteMutation();
  
  const [lightMode, onLightModeChange] = useState(0);

  const swapLightMode = () => {
    onLightModeChange((lightMode + 1) % 2);
  }

  const styles = StyleSheet.create({
    background: {
      backgroundColor:bodyColor[lightMode],
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={swapLightMode} title="Mode" />
      ),
    });
  }, [navigation, lightMode]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Edit", {data: item}) } style={tw`w-[98%] mb-0.5 mx-auto bg-purple-300 rounded-sm px-1`}> 
      <Text>{item.title}</Text>
      <Text>{item.content}</Text>
    </TouchableOpacity>
  )
  return (
    <View style={styles.background}>
      {searchData ? 
        <MasonryList
          style={tw`px-0.5 pt-0.5 pb-20`}
          data={searchData}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />  
        : <></>
      }
      <TouchableOpacity onPress={() => { navigation.navigate("Add", {data: ""}); }} style={tw`bg-blue-500 rounded-full absolute bottom-[5%] right-8 mx-auto items-center flex-1 justify-center w-12 h-12`}>
        <Text style={tw`text-white text-center text-3xl mt--1`}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function EditScreen({ route, navigation }) {
  useLayoutEffect(() => {
    
  }, []);

  return (
    <View style={tw`flex-1 items-center justify-center bg-purple-400`}>
      <Text style={tw`text-lg text-white`}>Edit Screen {route.params.data.title} {route.params.data.id}</Text>
    </View>
  );
}

function AddScreen({ route, navigation }) {
  const [title, changeTitle] = useState('');
  const [content, changeContent] = useState('');

  const [ addNote, { data: addNoteData, error: addNoteError }] = useAddNoteMutation();

  useLayoutEffect(() => {
    navigation.setOptions({ 
      headerRight: () => (
        <Button onPress={() => addNote({title: title, content: content})} title="Apply" />
      ),
     });
  }, [title, content, navigation]);

  useEffect(() => {
    if (addNoteData != undefined) {
      console.log(addNoteData.title);
      navigation.navigate("Home");
    }
  }, [addNoteData]);

  return (
    <View style={tw`flex-1 bg-purple-400`}>
      <TextInput style={styles.inputfield}
        onChangeText={text => changeTitle(text)}
        value={title}
        placeholder="Title"
      />
      <TextInput style={styles.inputfield}
        onChangeText={text => changeContent(text)}
        value={content}
        placeholder="Body"
        multiline={true}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  useDeviceContext(tw);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            options={{
              headerStyle: {backgroundColor:headerColor[1]}, 
              headerTintColor: '#fff',
              headerTitleStyle: tw`font-bold`,
              headerShadowVisible: false, // gets rid of border on device
            }}
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            options={{
              headerStyle: {backgroundColor:headerColor[1]}, 
              headerTintColor: '#fff',
              headerTitleStyle: tw`font-bold`,
              headerShadowVisible: false, // gets rid of border on device
            }}
            name="Edit"
            component={EditScreen}
          />
          <Stack.Screen
            options={{
              headerStyle: {backgroundColor:headerColor[1]}, 
              headerTintColor: '#fff',
              headerTitleStyle: tw`font-bold`,
              headerShadowVisible: false, // gets rid of border on device
            }}
            name="Add"
            component={AddScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  inputfield: {
    height: 48,
    margin: 12,
    fontSize: 20,
    padding: 12,
  },
});