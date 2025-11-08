import {useState, useContext, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {setIsActionDone} = useContext(AppContext);
  const alertTimeoutRef = useRef(null);

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
    // Limpiar timeout anterior si existe
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
    if (!url || url.trim().length === 0) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const verifyImageUrl = async (url) => {
    if (!validateImageUrl(url)) return false;
    
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        timeout: 5000,
      });
      return response.ok;
    } catch (error) {
      console.log('Error verificando URL de imagen:', error);
      return false;
    }
  };

  const handleAddBook = async () => {
    // Validación de campos requeridos
    if (!title.trim() || !author.trim() || !year.trim() || !imageUrl.trim() || !description.trim()) {
      showAlert('Por favor, completa todos los campos', 'danger');
      return;
    }

    // Validación del año
    const yearNum = Number(year);
    const currentYear = new Date().getFullYear();
    if (isNaN(yearNum) || yearNum < 0 || yearNum > currentYear + 1) {
      showAlert(`El año debe ser un número válido entre 0 y ${currentYear + 1}`, 'danger');
      return;
    }

    // Validación de URL de imagen
    if (!validateImageUrl(imageUrl)) {
      showAlert('La URL de la imagen no es válida', 'danger');
      return;
    }

    setIsSubmitting(true);

    try {
      // Verificar que la imagen es accesible
      const isImageUrlValid = await verifyImageUrl(imageUrl);
      if (!isImageUrlValid) {
        showAlert('No se pudo acceder a la URL de la imagen. Verifica que sea válida.', 'danger');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`${serverIP}/books/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: title.trim(),
          author: author.trim(),
          publication_year: yearNum,
          cover: imageUrl.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== 'Success') {
        showAlert(data.message || 'Error al agregar el libro', 'danger');
        setIsSubmitting(false);
        return;
      }

      showAlert('Libro agregado exitosamente', 'success');
      
      // Limpiar formulario
      setTitle('');
      setAuthor('');
      setYear('');
      setImageUrl('');
      setDescription('');

      // Cerrar modal después de mostrar el mensaje de éxito
      setTimeout(() => {
        setIsActionDone(true);
        setTimeout(() => {
          setIsActionDone(false);
        }, 1000);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error agregando libro:', error);
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
        style={styles.mainAddBook}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.close} onPress={onClose}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa el título"
              placeholderTextColor="#ADADAC"
              value={title}
              onChangeText={text => setTitle(capitalizeFirstLetter(text))}
              editable={!isSubmitting}
            />
            <Text style={styles.label}>Autor *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa el autor"
              placeholderTextColor="#ADADAC"
              value={author}
              onChangeText={text => setAuthor(capitalizeFirstLetter(text))}
              editable={!isSubmitting}
            />
            <Text style={styles.label}>Año de Publicación *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa el año"
              placeholderTextColor="#ADADAC"
              value={year}
              onChangeText={setYear}
              keyboardType="numeric"
              editable={!isSubmitting}
            />
            <Text style={styles.label}>URL de Portada *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa la URL de la imagen"
              placeholderTextColor="#ADADAC"
              value={imageUrl}
              onChangeText={setImageUrl}
              autoCapitalize="none"
              editable={!isSubmitting}
            />
            <Text style={styles.label}>Descripción *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ingresa la descripción"
              placeholderTextColor="#ADADAC"
              value={description}
              onChangeText={text => setDescription(capitalizeFirstLetter(text))}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
            <TouchableOpacity
              style={[styles.addBookButton, isSubmitting && styles.addBookButtonDisabled]}
              onPress={handleAddBook}
              disabled={isSubmitting}>
              <Text style={styles.addBookButtonText}>
                {isSubmitting ? 'Agregando...' : 'Agregar Libro'}
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
  mainAddBook: {
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
    margin: 20,
    width: '85%',
    maxWidth: 500,
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
    justifyContent: 'center',
    zIndex: 1,
  },
  closeText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
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
    fontSize: 14,
    fontWeight: '500',
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

export default AddBook;
