import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, Button, Platform } from 'react-native';
import EventService from '../services/eventService';
import Appointment from '../model/appointment';
import { Provider } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import MedicationIntake, { Wiederholung } from '../model/medicationIntake';
import Medikament from '../model/medikament';

interface MyModalProps {
  visible: boolean; // Der Typ für die `visible`-Prop
  onClose: () => void; // Der Typ für die `onClose`-Callback-Funktion
  service: EventService;
  pille: MedicationIntake | null | undefined;
}

const PillenDetail: React.FC<MyModalProps> = ({ visible, service, pille, onClose }) => {
    const eventService = service;
    const [medikament, onMedikamentChange] = React.useState(pille?.medikament.name ?? '');
    const [anzahl, onAnzahlChange] = React.useState(pille?.anzahlPillen ?? 1);
    const [startDate, onStartDateChange] = React.useState(pille?.plannedIntake ?? new Date());
    const [actualIntake, inActualIntakeChange] = React.useState(pille?.actualIntake ?? null);
    const [endDate, onEndDateChange] = React.useState(new Date(startDate.getTime() + 60 * 60 * 1000) );
    const [wiederholung, onWiederholungChange] = React.useState(pille?.wiederholung);
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = React.useState(false);
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = React.useState(false);
    const [editable, setEditable] = React.useState(pille == null);
    const ueberschrift: string = editable ? 'Neue Pilleneinnahme erstellen' : 'Pilleneinnahme'
    const [closeButtonText, setCloseButtonText] = React.useState(pille == null ? 'Abbrechen' : 'Schließen');
    const [saveButtonText, setSaveButtonText] = React.useState(pille == null ? 'Erstellen' : 'Speichern');
    

    React.useEffect(() => {
        onMedikamentChange(pille?.medikament.name ?? '');
        onAnzahlChange(pille?.anzahlPillen ?? 1);
        onStartDateChange(pille?.plannedIntake ?? new Date());
        onEndDateChange(new Date(startDate.getTime() + 60 * 60 * 1000) );
        onWiederholungChange(pille?.wiederholung);
        setEditable(pille == null);
      }, [pille]);

      React.useEffect(() => {
        if (!visible) {
            onMedikamentChange(pille?.medikament.name ?? '');
            onAnzahlChange(pille?.anzahlPillen ?? 1);
            onStartDateChange(pille?.plannedIntake ?? new Date());
            onEndDateChange(new Date(startDate.getTime() + 60 * 60 * 1000) );
            onWiederholungChange(pille?.wiederholung);
            setEditable(pille == null);
        }
      }, [visible]);

    const openStartDatePicker = () => setStartDatePickerVisibility(true);
    const openStartTimePicker = () => setStartTimePickerVisibility(true); 
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = React.useState(false);

    const openEndDatePicker = () => setEndDatePickerVisibility(true);
    const onEndDateConfirm = (params: any) => {
      setEndDatePickerVisibility(false);
      onEndDateChange(params.date);
    };

    const createPillenIntake = () => {
        const newPillenIntake: MedicationIntake = {
            id: '',
            medikament: new Medikament(medikament),
            anzahlPillen: anzahl,
            plannedIntake: startDate,
            actualIntake: actualIntake,
            wiederholung: wiederholung
        };
        eventService.createPillenIntake(newPillenIntake, endDate);
    };

    const saveTermin = () => {
        if (pille){
            updatePille
        } else {
            createPillenIntake()
        }

        onClose();
    }

    const updatePille = () => {
        if(pille) {
        const updatedPille: MedicationIntake = {
            id: pille?.id,
            medikament: new Medikament(medikament),
            anzahlPillen: anzahl,
            plannedIntake: startDate,
            actualIntake: actualIntake,
            wiederholung: wiederholung
        }
        eventService.updatePillenIntake(updatedPille, endDate)
    }
    }

    const onStartDateConfirm = (params: any) => {
        setStartDatePickerVisibility(false);
        const newStartDate = params.date;
        onStartDateChange(newStartDate);
        onEndDateChange(new Date(newStartDate.getTime() + 60 * 60 * 1000));
    };

    const onStartTimeConfirm = ({ hours, minutes }: { hours: number; minutes: number }) => {
        setStartTimePickerVisibility(false);
        const newStartDate = new Date(startDate);
        newStartDate.setHours(hours, minutes);
        onStartDateChange(newStartDate);
        // Update end date to be one hour after new start time
        onEndDateChange(new Date(newStartDate.getTime() + 60 * 60 * 1000));
    };

    const openEditMode = () => {
        setEditable (true);
        setCloseButtonText('Abbrechen');
    }

    const options = [
        { label: 'Täglich', value: Wiederholung.täglich },
        { label: 'Wöchentlich', value: Wiederholung.wöchentlich },
        { label: 'Zweiwöchentlich', value: Wiederholung.zweiwöchentlich },
      ];
    
      const handleSelection = (value:any) => {
        onWiederholungChange(value); // Wert der Wiederholung setzen
      };

    return (
      <Provider>
        <Modal animationType="none" transparent={true} visible={visible} onRequestClose={onClose}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <View style={styles.headline}>
              <Text style={styles.modalText}>{ueberschrift}</Text>
              {!editable && (
                <TouchableOpacity style={styles.icon} onPress={openEditMode}>
                    <Ionicons name="pencil" size={20} />
                </TouchableOpacity>
                )}
              </View>
              <View style={styles.form}>
                <Text>Medikament:</Text>
                <TextInput value={medikament} placeholder="Medikament" style={styles.input} onChangeText={onMedikamentChange} editable={editable} />
                
                <Text>Einnahmezeit:</Text>
                {/* Startdatum und -zeit */}
                <View style={styles.zeitArea}>
                    <TextInput  placeholder="Startdatum" 
                                style={styles.datum} 
                                onFocus={openStartDatePicker} 
                                value={startDate.toLocaleDateString()} 
                                editable={editable}/>
                    <TextInput  placeholder="Startzeit" 
                                style={styles.zeit} 
                                onFocus={openStartTimePicker} 
                                value={startDate.toLocaleTimeString([], 
                                { hour: '2-digit', minute: '2-digit' })} 
                                editable={editable}/>
                </View>

                <DatePickerModal
                  locale="de"
                  mode="single"
                  visible={isStartDatePickerVisible}
                  onDismiss={() => setStartDatePickerVisibility(false)}
                  date={startDate}
                  onConfirm={onStartDateConfirm}
                />

                <TimePickerModal
                  visible={isStartTimePickerVisible}
                  onDismiss={() => setStartTimePickerVisibility(false)}
                  onConfirm={onStartTimeConfirm}
                  hours={startDate.getHours()}
                  minutes={startDate.getMinutes()}
                />
                <Text>Wiederholung:</Text>
                <View style={styles.radioGroup}>
                    {options.map((option) => (
                        <TouchableOpacity
                        key={option.value}
                        style={styles.radioContainer}
                        onPress={() => handleSelection(option.value)}
                        >
                        <View style={styles.radioCircle}>
                            {wiederholung === option.value && <View style={styles.selectedCircle} />}
                        </View>
                        <Text style={styles.radioLabel}>{option.label}</Text>
                        </TouchableOpacity>
                        ))}
                    </View>
                    <Text>Enddatum:</Text>
                    <TextInput
                      placeholder="Enddatum"
                      style={styles.input}
                      onFocus={openEndDatePicker}
                      value={endDate.toLocaleDateString()}
                      editable={editable}
                    />

                    <DatePickerModal
                      locale="de"
                      mode="single"
                      visible={isEndDatePickerVisible}
                      onDismiss={() => setEndDatePickerVisibility(false)}
                      date={endDate}
                      onConfirm={onEndDateConfirm}
                    />
                </View>
              <View style={styles.buttonArea}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Text style={styles.buttonText}>{closeButtonText}</Text>
                </TouchableOpacity>
                {editable && (
                <TouchableOpacity style={styles.addButton} onPress={saveTermin}>
                  <Text style={styles.buttonText}>{saveButtonText}</Text>
                </TouchableOpacity>)}
              </View>
            </View>
          </View>
        </Modal>
      </Provider>
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
    width: 600,
    minHeight: 300,
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
  buttonArea: {
    width: 550,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  form: {
    
  }, 
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1.5,
    padding: 10,
    width: 400
  },
  datum: {
    height: 50,
    margin: 12,
    borderWidth: 1.5,
    padding: 10,
    width: 295
  },
  zeit:{
    height: 50,
    margin: 12,
    borderWidth: 1.5,
    padding: 10,
    width: 83
  },
  zeitArea: {
    flexDirection: "row"
  },
  headline: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  icon: {
    position: 'absolute',
    top: 3,
    right: 100, 
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  radioLabel: {
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',  // Layout für horizontale Anordnung
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default PillenDetail;
