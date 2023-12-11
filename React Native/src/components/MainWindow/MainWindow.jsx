import {StyleSheet, ScrollView, View, Text} from 'react-native';
import {useEffect, useState, useContext} from 'react';
import serverIP from '../../../Global';
import Spinner from '../../utils/Spinner';
import Card from '../Card/Card';
import {AppContext} from '../../utils/AppContext';

const MainWindow = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(false);
  const {isActionDone} = useContext(AppContext);

  const getAllBooks = async () => {
    try {
      const response = await fetch(`${serverIP}/books/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) {
        setError(true);
      } else {
        const data = await response.json();
        setBooks(data.data);
        if (data.data !== undefined) {
          setIsLoading(false);
        }
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    getAllBooks();
  }, []);

  useEffect(() => {
    getAllBooks();
  }, [isActionDone]);

  return (
    <View style={styles.main}>
      <ScrollView contentContainerStyle={styles.mainWindow}>
        {error ? (
          <Text style={{marginTop: 40, fontSize: 17, marginHorizontal: 50}}>
            There was an error getting the books, please try again later.
          </Text>
        ) : isLoading ? (
          <Spinner />
        ) : books.length === 0 ? (
          <Card
            name="No books available"
            author="Add one using the add button"
            imageUrl=""
            id=""
            updateBooks={getAllBooks}
          />
        ) : (
          books.map(book => (
            <Card
              key={book.id}
              id={book.id}
              name={book.name}
              author={book.author}
              imageUrl={book.cover}
              updateBooks={getAllBooks}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#4e6676',
  },
  mainWindow: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#4e6676',
  },
});

export default MainWindow;
