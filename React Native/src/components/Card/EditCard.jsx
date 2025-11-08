import {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import serverIP from '../../../Global';
import Alert from '../../utils/Alert';

const EditCard = ({
  author = '',
  description = '',
  name = '',
  year = '',
  id,
  imageUrl: initialImageUrl = '',
  onBookUpdated,
  onClose,
}) => {
  const [editedTitle, setEditedTitle] = useState(name);
  const [editedAuthor, setEditedAuthor] = useState(author);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedYear, setEditedYear] = useState(year?.toString() || '');
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const alertTimeoutRef = useRef(null);

  // Sincronizar props con estado cuando cambian
  useEffect(() => {
    setEditedTitle(name);
    setEditedAuthor(author);
    setEditedDescription(description);
    setEditedYear(year?.toString() || '');
    setImageUrl(initialImageUrl);
  }, [name, author, description, year, initialImageUrl]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  const capitalizeFirstLetter = string => {
    if (!string || string.length === 0) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const showAlert = (message, type) => {
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }
    
    setAlert({visible: true, message, type});
    
    alertTimeoutRef.current = setTimeout(() => {
      setAlert(null);
      alertTimeoutRef.current = null;
    }, 3000);
  };

  const validateImageUrl = (url) => {
    if (!url || url.trim().length === 0) return true; // Opcional
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleEdit = async () => {
    // Validación del año si se proporciona
    if (editedYear.trim() !== '') {
      const yearNum = Number(editedYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(yearNum) || yearNum < 0 || yearNum > currentYear + 1) {
        showAlert(`El año debe ser un número válido entre 0 y ${currentYear + 1}`, 'danger');
        return;
      }
    }

    // Validación de URL de imagen si se proporciona
    if (imageUrl.trim() !== '' && !validateImageUrl(imageUrl)) {
      showAlert('La URL de la imagen no es válida', 'danger');
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {};
      if (editedTitle.trim() !== '') updateData.name = editedTitle.trim();
      if (editedAuthor.trim() !== '') updateData.author = editedAuthor.trim();
      if (editedDescription.trim() !== '') updateData.description = editedDescription.trim();
      if (editedYear.trim() !== '') updateData.publication_year = Number(editedYear);
      if (imageUrl.trim() !== '') updateData.cover = imageUrl.trim();

      const response = await fetch(`${serverIP}/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok || data.status !== 'Success') {
        showAlert(data.message || 'Error al editar el libro', 'danger');
        setIsSubmitting(false);
        return;
      }

      showAlert('Libro editado exitosamente', 'success');
      
      setTimeout(() => {
        onBookUpdated();
      }, 1500);
    } catch (error) {
      console.error('Error editando libro:', error);
      showAlert('Error de conexión. Por favor, intenta de nuevo.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <View style={styles.blurBackground} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.close} onPress={onClose}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              value={editedTitle}
              onChangeText={text => setEditedTitle(capitalizeFirstLetter(text))}
              placeholder="Título"
              placeholderTextColor="#ADADAC"
              editable={!isSubmitting}
            />
            <Text style={styles.label}>Autor</Text>
            <TextInput
              style={styles.input}
              value={editedAuthor}
              onChangeText={text => setEditedAuthor(capitalizeFirstLetter(text))}
              placeholder="Autor"
              placeholderTextColor="#ADADAC"
              editable={!isSubmitting}
            />
            <Text style={styles.label}>Año de Publicación</Text>
            <TextInput
              style={styles.input}
              value={editedYear}
              onChangeText={setEditedYear}
              placeholder="Año"
              placeholderTextColor="#ADADAC"
              keyboardType="numeric"
              editable={!isSubmitting}
            />
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editedDescription}
              onChangeText={text =>
                setEditedDescription(capitalizeFirstLetter(text))
              }
              placeholder="Descripción"
              placeholderTextColor="#ADADAC"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
            <Text style={styles.label}>URL de Portada</Text>
            <TextInput
              style={styles.input}
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="URL de la imagen"
              placeholderTextColor="#ADADAC"
              autoCapitalize="none"
              editable={!isSubmitting}
            />
            <TouchableOpacity
              style={[styles.addBookButton, isSubmitting && styles.addBookButtonDisabled]}
              onPress={handleEdit}
              disabled={isSubmitting}>
              <Text style={styles.addBookButtonText}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {alert?.visible && (
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  modalView: {
    backgroundColor: '#2E2D33',
    width: '85%',
    maxWidth: 500,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    margin: 20,
  },
  input: {
    height: 40,
    width: '100%',
    marginTop: 5,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'white',
    borderRadius: 5,
  },
  textArea: {
    height: 100,
    paddingTop: 10,
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
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  addBookButtonDisabled: {
    opacity: 0.6,
  },
  addBookButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default EditCard;
