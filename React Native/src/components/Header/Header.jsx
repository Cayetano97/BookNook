import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import AddBook from '../AddBook/AddBook';

const Header = () => {
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  const handleAddPress = () => {
    setAddModalVisible(true);
  };

  const handleCloseAddModal = () => {
    setAddModalVisible(false);
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>BookNook</Text>
        <TouchableOpacity style={styles.add} onPress={handleAddPress}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}>
        <AddBook onClose={handleCloseAddModal} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: 120,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2E3B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  add: {
    backgroundColor: '#E1B16C',
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    maxWidth: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainTitle: {
    fontSize: 35,
    color: '#E1B16C',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});

export default Header;
