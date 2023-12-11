import {useState, useContext} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import serverIP from '../../../Global';
import {AppContext} from '../../utils/AppContext';
import Alert from '../../utils/Alert';

const AddBook = ({onClose}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [alert, setAlert] = useState(false);
  const {setIsActionDone} = useContext(AppContext);

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const verifyImageUrl = async imageUrl => {
    try {
      const response = await fetch(imageUrl, {
        method: 'HEAD',
      });
      return response.ok;
    } catch (error) {
      console.log('Error verifying image URL', error);
      return false;
    }
  };

  const handleAddBook = async () => {
    if (!title || !author || !year || !imageUrl || !description) {
      setAlert({
        visible: true,
        message: 'Please fill all the fields',
        type: 'danger',
      });
      setTimeout(() => {
        setAlert(false);
      }, 3000);
      return;
    } else {
      if (isNaN(year)) {
        setAlert({
          visible: true,
          message: 'Year must be a number',
          type: 'danger',
        });
        setTimeout(() => {
          setAlert(false);
        }, 3000);
        return;
      } else {
        const isImageUrlValid = await verifyImageUrl(imageUrl);
        if (!isImageUrlValid) {
          setAlert({
            visible: true,
            message: 'Invalid image URL',
            type: 'danger',
          });
          setTimeout(() => {
            setAlert(false);
          }, 3000);
          return;
        }
        try {
          const response = await fetch(`${serverIP}/books/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: title,
              author: author,
              publication_year: Number(year),
              cover: imageUrl,
              description: description,
            }),
          });
          if (response.status !== 200) {
            setAlert({
              visible: true,
              message: 'Error adding book',
              type: 'danger',
            });
            setTimeout(() => {
              setAlert(false);
            }, 3000);
            return;
          } else {
            const data = await response.json();
            setAlert({
              visible: true,
              message: 'Book added successfully',
              type: 'success',
            });
            setTimeout(() => {
              setAlert(false);
              onClose();
            }, 3000);
            setIsActionDone(true);
            setTimeout(() => {
              setIsActionDone(false);
            }, 1000);
          }
        } catch (error) {
          console.log('Error adding book', error);
        }
      }
    }
  };

  return (
    <>
      <View style={styles.blurBackground} />
      <View style={styles.mainAddBook}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            placeholderTextColor="#ADADAC"
            value={title}
            onChangeText={text => setTitle(capitalizeFirstLetter(text))}
          />
          <Text style={styles.label}>Author</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter author"
            placeholderTextColor="#ADADAC"
            value={author}
            onChangeText={text => setAuthor(capitalizeFirstLetter(text))}
          />
          <Text style={styles.label}>Publication Year</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter year"
            placeholderTextColor="#ADADAC"
            value={year}
            onChangeText={setYear}
          />
          <Text style={styles.label}>Cover URL</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter image URL"
            placeholderTextColor="#ADADAC"
            value={imageUrl}
            onChangeText={setImageUrl}
          />
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            placeholderTextColor="#ADADAC"
            value={description}
            onChangeText={text => setDescription(capitalizeFirstLetter(text))}
          />
          <TouchableOpacity
            style={styles.addBookButton}
            onPress={handleAddBook}>
            <Text style={styles.addBookButtonText}>Add Book</Text>
          </TouchableOpacity>
        </View>
      </View>
      {alert && (
        <>
          <View
            style={{
              ...styles.blurBackground,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}
          />
          <Alert message={alert.message} type={alert.type} />
        </>
      )}
    </>
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
  mainAddBook: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    width: '85%',
    backgroundColor: '#2E2D33',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
  },
  close: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: '#E1B16C',
    borderRadius: 50,
    padding: 5,
    width: 30,
    height: 30,
    alignItems: 'center',
  },
  closeText: {
    color: '#000',
    fontSize: 15,
  },
  input: {
    height: 40,
    width: '100%',
    marginTop: 5,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    color: 'white',
    borderRadius: 5,
  },
  label: {
    color: 'white',
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  addBookButton: {
    backgroundColor: '#C4D1A2',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addBookButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default AddBook;
