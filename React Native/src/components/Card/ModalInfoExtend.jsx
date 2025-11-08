import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {imageUrl && (
              <Image
                source={{uri: imageUrl}}
                style={styles.img}
                resizeMode="contain"
              />
            )}
            <Text style={styles.title}>{name || 'Sin título'}</Text>
            <Text style={styles.author}>{author || 'Autor desconocido'}</Text>
            {year && <Text style={styles.year}>Publicado en {year}</Text>}
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.textStyle}>Cerrar</Text>
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
    maxWidth: 500,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxHeight: '90%',
  },
  scrollContent: {
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#E1B16C',
    borderRadius: 20,
    padding: 12,
    marginTop: 15,
    minWidth: 100,
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
    color: '#fff',
    textAlign: 'center',
  },
  author: {
    fontSize: 20,
    marginBottom: 15,
    color: '#E1B16C',
    textAlign: 'center',
  },
  year: {
    fontSize: 19,
    marginBottom: 15,
    color: '#ADADAC',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'justify',
    lineHeight: 24,
    marginBottom: 10,
  },
  img: {
    width: 200,
    height: 250,
  },
});

export default ModalInfoExtend;
