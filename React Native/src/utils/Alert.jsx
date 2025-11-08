import {View, Text, StyleSheet} from 'react-native';

const Alert = ({message, type = 'danger'}) => {
  const getAlertStyle = () => {
    switch (type) {
      case 'success':
        return styles.success;
      case 'danger':
      case 'error':
        return styles.danger;
      default:
        return styles.danger;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.alert, getAlertStyle()]}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1000,
  },
  alert: {
    width: '80%',
    maxWidth: 300,
    minHeight: 50,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  danger: {
    backgroundColor: '#d32f2f',
  },
  success: {
    backgroundColor: '#2e7d32',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Alert;
