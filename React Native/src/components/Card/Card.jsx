import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import serverIP from '../../../Global';
import ModalInfoExtend from './ModalInfoExtend';
import EditCard from './EditCard';

const Card = ({author, name, imageUrl, id, updateBooks}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [extendInfo, setExtendInfo] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [bookInfo, setBookInfo] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const deleteBook = async id => {
    try {
      const response = await fetch(`${serverIP}/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) {
        console.log('Error deleting book');
      } else {
        updateBooks();
      }
    } catch (error) {
      console.log('Error deleting book', error);
    }
  };

  const extendInfoModal = async id => {
    try {
      const response = await fetch(`${serverIP}/books/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) {
        console.log('Error getting book info');
      } else {
        const data = await response.json();
        setBookInfo(data);
        setIsLoading(false);
        if (bookInfo !== undefined) {
          setExtendInfo(true);
        }
      }
    } catch (error) {
      console.log('Error getting book info', error);
    }
  };

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
          <TouchableOpacity onPress={() => extendInfoModal(id)}>
            <Text style={styles.title}>{name}</Text>
          </TouchableOpacity>
          <Text style={styles.author}>{author}</Text>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => setEditModalVisible(true)}
            style={{
              ...styles.button,
              backgroundColor: 'white',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteBook(id)}
            style={{
              ...styles.button,
              backgroundColor: 'red',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              Delete
            </Text>
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
        animationType="none"
        transparent={true}
        visible={extendInfo}
        onRequestClose={() => {
          setExtendInfo(!extendInfo);
        }}>
        {isLoading ? (
          <Text></Text>
        ) : (
          <ModalInfoExtend
            author={author}
            description={bookInfo.data.description}
            name={name}
            year={bookInfo.data.publication_year}
            imageUrl={imageUrl}
            modalVisible={extendInfo}
            setModalVisible={setExtendInfo}
          />
        )}
      </Modal>

      <Modal animationType="none" transparent={true} visible={editModalVisible}>
        {isLoading ? (
          <Text></Text>
        ) : (
          <EditCard
            author={author}
            description={bookInfo.data.description}
            name={name}
            year={bookInfo.data.publication_year}
            imageUrl={imageUrl}
            id={id}
            onBookUpdated={() => {
              updateBooks();
              setEditModalVisible(false);
            }}
            onClose={() => {
              setEditModalVisible(false);
            }}
          />
        )}
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
    padding: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
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
  },
  img: {
    height: 120,
    width: 90,
  },
  ImageView: {
    flex: 2,
    justifyContent: 'center',
    width: '40%',
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
