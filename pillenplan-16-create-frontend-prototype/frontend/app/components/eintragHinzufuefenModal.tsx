import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import TerminDetail from './terminDetail';
import EventService from '../services/eventService';
import Appointment from '../model/appointment';
import PillenDetail from './pillenDetail';

interface MyModalProps {
  visible: boolean; // Der Typ für die `visible`-Prop
  onClose: () => void; // Der Typ für die `onClose`-Callback-Funktion
  service: EventService
}

const EintragHinzufuegen: React.FC<MyModalProps> = ({ visible, service, onClose }) => {

  const eventService = service

  const [modalTerminDetailVisible, setModalTerminDetailVisible] = useState(false);
  const [modalPillenDetailVisible, setModalPillenDetailVisible] = useState(false);

  const handleTermin = (event: GestureResponderEvent ): void =>  {
    setModalTerminDetailVisible(true);
}
const handlePille = (event: GestureResponderEvent ): void =>  {
  setModalPillenDetailVisible(true);
}

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Wähle die Art des Eintrages aus...</Text>
          <View style={styles.buttonarea}>
            <TouchableOpacity style={styles.ActionButton} onPress={handleTermin}>
                <Text style={styles.modalText}>Arzt-Besuch</Text>
                <Ionicons
                name='medkit'
                size={30}
                style={styles.image}></Ionicons>
            </TouchableOpacity>

            <TerminDetail visible={modalTerminDetailVisible} service={eventService} onClose={() => { setModalTerminDetailVisible(false), onClose(); } } termin={null}></TerminDetail>

            <TouchableOpacity style={styles.ActionButton} onPress={handlePille}>
                <Text style={styles.modalText}>Pillen-errinnerung</Text>
                <Ionicons
                name='flask'
                size={30}
                style={styles.image}></Ionicons>
            </TouchableOpacity>

            <PillenDetail visible={modalPillenDetailVisible} service={eventService} onClose={() => { setModalPillenDetailVisible(false), onClose(); } } pille={null}></PillenDetail>

          </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 600,
    minHeight: 300,
    padding: 20,
    backgroundColor: '#f0f2f5',
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
  ActionButton:{
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    width: 125,
    height: 125,
    justifyContent: "center",
    borderRadius: 5
  },
  image: {
    justifyContent: "center",
    alignSelf: "center"
  },
  buttonarea: {
    display: "flex",
    flexDirection: "row",
    flex: 2
  }
});

export default EintragHinzufuegen;
