import React, {useState} from 'react';
import {Modal} from 'react-native';
import {Button, Icon} from 'native-base';
import {createStackNavigator} from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import HomeScreen from './screen/HomeScreen';
import TodosModal from './components/TodosModal/TodosModal';

const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();

function Home({navigation}) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerLeft: () => (
            <Button transparent onPress={() => navigation.openDrawer()}>
              <Icon type="FontAwesome" name="navicon" />
            </Button>
          ),
        }}
      />
    </Stack.Navigator>
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

function DrawerContent() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
}

export default DrawerContent;
