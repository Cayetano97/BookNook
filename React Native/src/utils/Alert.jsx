import {View, Text, StyleSheet, Dimensions} from 'react-native';

const Alert = ({message, type}) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.alert,
          type === 'danger' ? styles.danger : styles.success,
        ]}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 210,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1000,
  },
  alert: {
    width: 250,
    height: 'auto',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  danger: {
    fontSize: 20,
    backgroundColor: 'red',
  },
  success: {
    backgroundColor: 'green',
  },

  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    zIndex: 1001,
  },
});

export default Alert;
