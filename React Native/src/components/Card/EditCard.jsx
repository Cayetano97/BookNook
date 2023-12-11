import {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import serverIP from '../../../Global';
import Alert from '../../utils/Alert';

const EditCard = ({
  author,
  description,
  name,
  year,
  id,
  imageUrl: initialImageUrl,
  onBookUpdated,
  onClose,
}) => {
  const [editedTitle, setEditedTitle] = useState(name);
  const [editedAuthor, setEditedAuthor] = useState(author);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedYear, setEditedYear] = useState(year);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [alert, setAlert] = useState(false);

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleEdit = async () => {
    if (isNaN(editedYear)) {
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
      try {
        const response = await fetch(`${serverIP}/books/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editedTitle !== '' ? editedTitle : undefined,
            author: editedAuthor !== '' ? editedAuthor : undefined,
            description:
              editedDescription !== '' ? editedDescription : undefined,
            publication_year: editedYear !== '' ? editedYear : undefined,
            cover: imageUrl !== '' ? imageUrl : undefined,
          }),
        });
        if (response.status !== 200) {
          setAlert({
            visible: true,
            message: 'Error editing book, please try again later',
            type: 'danger',
          });
          setTimeout(() => {
            setAlert(false);
          }, 3000);
        } else {
          setAlert({
            visible: true,
            message: 'Book edited successfully',
            type: 'success',
          });
          setTimeout(() => {
            setAlert(false);
            onBookUpdated();
          }, 3000);
        }
      } catch (error) {
        setAlert({
          visible: true,
          message: 'Book not edited successfully',
          type: 'error',
        });
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      }
    }
  };

  return (
    <>
      <View style={styles.blurBackground} />
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={editedTitle}
            onChangeText={text => setEditedTitle(capitalizeFirstLetter(text))}
            placeholder="Title"
          />
          <Text style={styles.label}>Author</Text>
          <TextInput
            style={styles.input}
            value={editedAuthor}
            onChangeText={text => setEditedAuthor(capitalizeFirstLetter(text))}
            placeholder="Author"
          />
          <Text style={styles.label}>Publication year</Text>
          <TextInput
            style={styles.input}
            value={editedYear.toString()}
            onChangeText={setEditedYear}
            placeholder="Year"
          />
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={editedDescription}
            onChangeText={text =>
              setEditedDescription(capitalizeFirstLetter(text))
            }
            placeholder="Description"
          />
          <Text style={styles.label}>Cover</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="Image URL"
          />
          <TouchableOpacity style={styles.addBookButton} onPress={handleEdit}>
            <Text style={styles.addBookButtonText}>Edit</Text>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#2E2D33',
    width: 350,
    height: 500,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
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

export default EditCard;
