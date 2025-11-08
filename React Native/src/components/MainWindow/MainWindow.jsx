import {StyleSheet, ScrollView, View, Text, TouchableOpacity} from 'react-native';
import {useEffect, useState, useContext, useCallback} from 'react';
import serverIP from '../../../Global';
import Spinner from '../../utils/Spinner';
import Card from '../Card/Card';
import {AppContext} from '../../utils/AppContext';

const MainWindow = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const {isActionDone} = useContext(AppContext);

  const getAllBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${serverIP}/books/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok || data.status !== 'Success') {
        throw new Error(data.message || 'Error al obtener los libros');
      }
      
      setBooks(data.data || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error obteniendo libros:', err);
      setError(err.message || 'Error al obtener los libros. Por favor, intenta de nuevo.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllBooks();
  }, [getAllBooks, isActionDone]);

  const handleRetry = () => {
    getAllBooks();
  };

  return (
    <View style={styles.main}>
      <ScrollView contentContainerStyle={styles.mainWindow}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : isLoading ? (
          <Spinner />
        ) : books.length === 0 ? (
          <Card
            name="No hay libros disponibles"
            author="Agrega uno usando el botón Add"
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
    paddingBottom: 20,
  },
  errorContainer: {
    marginTop: 40,
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#E1B16C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MainWindow;
