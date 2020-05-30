import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  Button,
  Alert,
  Animated,
  TouchableHighlight,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {SwipeListView} from 'react-native-swipe-list-view';

const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();

function HomeScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
    </View>
  );
}

function Home({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerLeft: () => (
            <Button
              onPress={() => navigation.openDrawer()}
              title="="
              style={{width: '100%', heigth: '100%', color: '#000'}}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

const renderHiddenItem = () => (
  <View style={styles.rowBack}>
    <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
      <Text style={styles.backTextWhite}>Delete</Text>
    </View>
  </View>
);

const rowTranslateAnimatedValues = {};
Array(200)
  .fill('')
  .forEach((_, i) => {
    rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
  });

function TodosModal() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
        console.log(data);
      });
  }, []);

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            renderItem={({item}) => (
              <Text key={item.id}>
                id: {item.id}; title: {item.title}; completed: {item.completed}
              </Text>
            )}
          />
        )}
      </View>
    </View>
  );
}

function CustomDrawerContent({progress, ...rest}) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <React.Fragment>
      <DrawerContentScrollView {...rest}>
        <DrawerItemList {...rest} />
        <DrawerItem label="Todos" onPress={() => setModalVisible(true)} />
      </DrawerContentScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        {modalVisible && <TodosModal />}
      </Modal>
    </React.Fragment>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={Home} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
