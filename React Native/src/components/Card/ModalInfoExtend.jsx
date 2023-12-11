import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';

const ModalInfoExtend = ({
  modalVisible,
  setModalVisible,
  author,
  description,
  name,
  year,
  imageUrl,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.blurBackground} />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {imageUrl && (
            <Image
              source={{uri: imageUrl}}
              style={styles.img}
              resizeMode="contain"
            />
          )}
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.author}>{author}</Text>
          <Text style={styles.year}>Published in {year}</Text>
          <Text style={styles.description}>{description}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#2E2D33',
    width: '95%',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
  },
  author: {
    fontSize: 20,
    marginBottom: 15,
  },
  year: {
    fontSize: 19,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
  },
  img: {
    width: 200,
    height: 250,
  },
});

export default ModalInfoExtend;
