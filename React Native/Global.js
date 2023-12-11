import {Platform} from 'react-native';

let serverIP;

if (Platform.OS === 'android') {
  serverIP = 'http://10.0.2.2:8000';
} else if (Platform.OS === 'ios') {
  // Reemplaza 'localhost' con la dirección IP de tu máquina local si estás utilizando un dispositivo físico.
  serverIP = 'http://localhost:8000';
}

export default serverIP;
