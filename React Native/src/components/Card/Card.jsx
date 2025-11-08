import {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Alert as RNAlert,
} from 'react-native';
import serverIP from '../../../Global';
import ModalInfoExtend from './ModalInfoExtend';
import EditCard from './EditCard';

const Card = ({author, name, imageUrl, id, updateBooks}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [extendInfo, setExtendInfo] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [bookInfo, setBookInfo] = useState(null);
  const [isLoadingBookInfo, setIsLoadingBookInfo] = useState(false);

  const deleteBook = useCallback(async (bookId) => {
    RNAlert.alert(
      'Eliminar Libro',
      '¿Estás seguro de que deseas eliminar este libro?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${serverIP}/books/${bookId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              const data = await response.json();

              if (!response.ok || data.status !== 'Success') {
                throw new Error(data.message || 'Error al eliminar el libro');
              }

              updateBooks();
            } catch (error) {
              console.error('Error eliminando libro:', error);
              RNAlert.alert('Error', 'No se pudo eliminar el libro. Por favor, intenta de nuevo.');
            }
          },
        },
      ]
    );
  }, [updateBooks]);

  const fetchBookInfo = useCallback(async (bookId) => {
    setIsLoadingBookInfo(true);
    try {
      const response = await fetch(`${serverIP}/books/${bookId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok || data.status !== 'Success') {
        throw new Error(data.message || 'Error al obtener la información del libro');
      }

      setBookInfo(data.data);
      return data.data;
    } catch (error) {
      console.error('Error obteniendo información del libro:', error);
      RNAlert.alert('Error', 'No se pudo cargar la información del libro.');
      return null;
    } finally {
      setIsLoadingBookInfo(false);
    }
  }, []);

  const handleExtendInfo = useCallback(async () => {
    if (!bookInfo) {
      const info = await fetchBookInfo(id);
      if (info) {
        setExtendInfo(true);
      }
    } else {
      setExtendInfo(true);
    }
  }, [bookInfo, id, fetchBookInfo]);

  const handleEdit = useCallback(async () => {
    if (!bookInfo) {
      const info = await fetchBookInfo(id);
      if (info) {
        setEditModalVisible(true);
      }
    } else {
      setEditModalVisible(true);
    }
  }, [bookInfo, id, fetchBookInfo]);

  return (
    <View style={styles.card}>
      <View style={styles.ImageView}>
        {imageUrl ? (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={{uri: imageUrl}}
              style={styles.img}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={{
                uri: 'https://static-00.iconduck.com/assets.00/file-not-found-icon-1839x2048-n34iw16d.png',
              }}
              style={styles.img}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.TextView}>
        <View style={styles.titleView}>
          <TouchableOpacity onPress={handleExtendInfo}>
            <Text style={styles.title}>{name || 'Sin título'}</Text>
          </TouchableOpacity>
          <Text style={styles.author}>{author || 'Autor desconocido'}</Text>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={handleEdit}
            style={[styles.button, styles.editButton]}
            disabled={isLoadingBookInfo}>
            <Text style={styles.editButtonText}>
              {isLoadingBookInfo ? 'Cargando...' : 'Editar'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteBook(id)}
            style={[styles.button, styles.deleteButton]}
            disabled={isLoadingBookInfo}>
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.blurBackground} />
        <View>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Image
              source={{uri: imageUrl}}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={extendInfo}
        onRequestClose={() => setExtendInfo(false)}>
        {bookInfo ? (
          <ModalInfoExtend
            author={bookInfo.author || author}
            description={bookInfo.description || ''}
            name={bookInfo.name || name}
            year={bookInfo.publication_year || ''}
            imageUrl={bookInfo.cover || imageUrl}
            modalVisible={extendInfo}
            setModalVisible={setExtendInfo}
          />
        ) : null}
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}>
        {bookInfo ? (
          <EditCard
            author={bookInfo.author || author}
            description={bookInfo.description || ''}
            name={bookInfo.name || name}
            year={bookInfo.publication_year || ''}
            imageUrl={bookInfo.cover || imageUrl}
            id={id}
            onBookUpdated={() => {
              setBookInfo(null); // Limpiar cache
              updateBooks();
              setEditModalVisible(false);
            }}
            onClose={() => {
              setEditModalVisible(false);
            }}
          />
        ) : null}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  ImageView: {
    flex: 2,
    justifyContent: 'center',
    width: '40%',
  },
  author: {
    color: '#ddd',
    fontSize: 17,
    marginTop: 5,
  },
  blurBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  button: {
    alignItems: 'center',
    borderRadius: 5,
    flex: 0.4,
    marginTop: 5,
    padding: 8,
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: 'white',
  },
  editButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    gap: 10,
  },
  card: {
    backgroundColor: '#2C2E3B',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
    width: '90%',
    minHeight: 140,
  },
  img: {
    height: 120,
    width: 90,
    borderRadius: 5,
  },
  TextView: {
    flexDirection: 'column',
    flex: 4,
    padding: 5,
    width: '60%',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleView: {
    flex: 1,
  },
});

export default Card;
