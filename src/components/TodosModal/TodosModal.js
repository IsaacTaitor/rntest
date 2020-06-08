import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import {ListItem, Icon, Left, Body, Right} from 'native-base';
import {styles} from './styles';

import {SwipeListView} from 'react-native-swipe-list-view';

const rowTranslateAnimatedValues = {};

function setRowTranslateAnimatedValues(lenght) {
  Array(++lenght)
    .fill('')
    .forEach((_, i) => {
      rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
    });
}

const widthWindow = Dimensions.get('window').width;
const ITEM_HEIGHT = 50;

class Item extends React.PureComponent {
  render() {
    const {item} = this.props;
    return (
      <Animated.View
        style={{
          height: rowTranslateAnimatedValues[`${item.id}`].interpolate({
            inputRange: [0, 1],
            outputRange: [0, ITEM_HEIGHT],
          }),
        }}>
        <ListItem
          avatar
          style={[
            styles.listitem,
            {
              width: widthWindow,
            },
          ]}>
          <Left>
            <Text>{item.id}</Text>
          </Left>
          <Body>
            <Text>{item.title}</Text>
          </Body>
          <Right style={styles.icon}>
            {item.completed ? (
              <Icon
                type="FontAwesome"
                name="check"
                style={styles.iconCheckGreen}
              />
            ) : (
              <Icon
                type="FontAwesome"
                name="close"
                style={styles.iconCloseRed}
              />
            )}
          </Right>
        </ListItem>
      </Animated.View>
    );
  }
}

class HidenItem extends React.PureComponent {
  render() {
    return (
      <View style={styles.rowBack}>
        <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
          <Text style={styles.backTextWhite}>Delete</Text>
        </View>
      </View>
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
        setRowTranslateAnimatedValues(json.length);
        this.setState({data: json});
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({isLoading: false});
      });
  }

  animationIsRunning = false;

  onSwipeValueChange = (swipeData) => {
    const {key, value} = swipeData;
    if (value < -widthWindow / 2 && !this.animationIsRunning) {
      this.animationIsRunning = true;
      Animated.timing(rowTranslateAnimatedValues[`${key}`], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        const newData = [...this.state.data];
        const prevIndex = newData.findIndex((item) => item.id == key);
        newData.splice(prevIndex, 1);
        this.setState({data: newData});
        this.animationIsRunning = false;
      });
    }
  };

  renderItem = ({ item }) => <Item item={item} />;

  renderHiddenItem = () => <HidenItem />;

  render() {
    const {isLoading, data} = this.state;
    return (
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            // !isLoading && {width: Dimensions.get('window').width * 0.8},
          ]}>
          {isLoading ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <SwipeListView
              directionalDistanceChangeThreshold={0}
              disableRightSwipe
              data={data}
              renderItem={this.renderItem}
              renderHiddenItem={this.renderHiddenItem}
              rightOpenValue={-widthWindow}
              onSwipeValueChange={this.onSwipeValueChange}
              keyExtractor={(item) => item.id.toString()}
              useNativeDriver={false}
              removeClippedSubviews={true}
              getItemLayout={(data, index) => (
                {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
              )}
            />
          )}
        </View>
      </View>
    );
  }
}

export default TodosModal;
