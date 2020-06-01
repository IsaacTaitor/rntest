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
import {styles} from './styles';

import {SwipeListView} from 'react-native-swipe-list-view';

const rowTranslateAnimatedValues = {};
Array(200)
  .fill('')
  .forEach((_, i) => {
    rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
  });

const renderHiddenItem = () => (
  <View style={styles.rowBack}>
    <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
      <Text style={styles.backTextWhite}>Delete</Text>
    </View>
  </View>
);

function TodosModal() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  let animationIsRunning = false;

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onSwipeValueChange = (swipeData) => {
    const {key, value} = swipeData;
    if (value < -10 && !animationIsRunning) {
      animationIsRunning = true;
      Animated.timing(rowTranslateAnimatedValues[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        const newData = [...data];
        const prevIndex = data.findIndex((item) => item.key === key);
        newData.splice(prevIndex, 1);
        setData(newData);
        animationIsRunning = false;
      });
    }
  };

  const renderItem = ({item}) => {
    return (
      <Animated.View
        style={{
          height: rowTranslateAnimatedValues[item.id].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 50],
          }),
        }}>
        <View style={styles.rowFront}>
          <Text>
            id: {item.id}; title: {item.title}; completed: {item.completed}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <SwipeListView
            disableRightSwipe
            data={data}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-10}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onSwipeValueChange={onSwipeValueChange}
            useNativeDriver={false}
            keyExtractor={(item) => String(item.id)}
          />
        )}
      </View>
    </View>
  );
}

export default memo(TodosModal);
