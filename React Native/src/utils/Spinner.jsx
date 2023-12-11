import {StyleSheet, View, ActivityIndicator} from 'react-native';

const Spinner = () => {
  return (
    <View style={styles.mainWindow}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
};

const styles = StyleSheet.create({
  mainWindow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Spinner;
