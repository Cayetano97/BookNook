import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const ErrorComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Error</Text>
          <Text style={styles.cardDescription}>Failed to load data</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.errorMessage}>
            An error occurred while retrieving the data. Please try again.
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
  },
  card: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 16,
    color: '#888888',
  },
  cardContent: {
    alignItems: 'center',
    gap: 10,
  },
  errorMessage: {
    color: '#888888',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#0000FF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ErrorComponent;
