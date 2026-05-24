import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-big-calendar';

interface MyModalProps {
  visible: boolean; // Der Typ für die `visible`-Prop
  onClose: () => void; // Der Typ für die `onClose`-Callback-Funktion
}

const events = [
  { id: '1', title: 'Meeting', start: new Date(2023, 10, 1, 10, 0), end: new Date(2023, 10, 1, 11, 0) },
  { id: '2', title: 'Lunch', start: new Date(2023, 10, 2, 12, 0), end: new Date(2023, 10, 2, 13, 0) },
  { id: '3', title: 'Gym', start: new Date(2023, 10, 3, 18, 0), end: new Date(2023, 10, 3, 19, 0) },
];

const Einstellungen: React.FC<MyModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
        <View style={styles.container}>
      {/* Kalenderansicht */}
      <Calendar events={events} height={400} />

      {/* Listenansicht */}
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text>
              {item.start.toLocaleDateString()} {item.start.toLocaleTimeString()} -{' '}
              {item.end.toLocaleTimeString()}
            </Text>
          </View>
        )}
      />
    </View>
          <Text style={styles.modalText}>Dies ist ein Popup-Modal!</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  eventItem: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Einstellungen;
