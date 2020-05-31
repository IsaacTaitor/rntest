import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {styles} from './styles';

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

export default TodosModal;
