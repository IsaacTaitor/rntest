import React, {useState, useEffect, memo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Animated,
  Dimensions,
} from 'react-native';
import {ListItem, Icon, Left, Body, Right} from 'native-base';
import {styles} from './styles';

import {SwipeListView} from 'react-native-swipe-list-view';

const rowTranslateAnimatedValues = {};
Array(200)
  .fill('')
  .forEach((_, i) => {
    rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
  });

const widthWindow = Dimensions.get('window').width * 0.8;

class Item extends React.PureComponent {
  render() {
    const {item} = this.props;
    return (
      <Animated.View
        style={{
          height: rowTranslateAnimatedValues[item.id].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 50],
          }),
        }}>
        <ListItem
          avatar
          style={{
            width: widthWindow,
            backgroundColor: 'white',
            minHeight: 50,
            marginLeft: 0,
          }}>
          <Left>
            <Text>{item.id}</Text>
          </Left>
          <Body>
            <Text>{item.title}</Text>
          </Body>
          <Right
            style={{
              borderBottomWidth: 0,
            }}>
            {item.completed ? (
              <Icon type="FontAwesome" name="check" style={{color: 'green'}} />
            ) : (
              <Icon type="FontAwesome" name="close" style={{color: 'red'}} />
            )}
          </Right>
        </ListItem>
      </Animated.View>
    );
  }
}

class TodosModal extends React.PureComponent {
  state = {
    isLoading: true,
    data: [],
  };

  componentDidMount() {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((json) => {
        this.setState({data: json});
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({isLoading: false});
      });
  }

  renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}>Delete</Text>
      </View>
    </View>
  );

  animationIsRunning = false;

  onSwipeValueChange = (swipeData) => {
    const {key, value} = swipeData;
    if (value < -widthWindow && !this.animationIsRunning) {
      this.animationIsRunning = true;
      Animated.timing(rowTranslateAnimatedValues[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        const newData = [...this.state.data];
        const prevIndex = newData.findIndex((item) => item.id === key);
        newData.splice(prevIndex, 1);
        this.setState({data: newData});
        this.animationIsRunning = false;
      });
    }
  };

  renderItem = ({item}) => <Item item={item} />;

  render() {
    const {isLoading, data} = this.state;
    return (
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            !isLoading && {width: Dimensions.get('window').width * 0.8},
          ]}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <SwipeListView
              disableRightSwipe
              data={data}
              renderItem={this.renderItem}
              renderHiddenItem={this.renderHiddenItem}
              rightOpenValue={-widthWindow}
              previewRowKey={'0'}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              onSwipeValueChange={this.onSwipeValueChange}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
        </View>
      </View>
    );
  }
}

export default TodosModal;
