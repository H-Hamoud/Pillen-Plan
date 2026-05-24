import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, Button, Platform } from 'react-native';
import Kalender from './kalender';
import EventService from '../services/eventService';
import appointment from '../model/appointment';
import Appointment from '../model/appointment';
import { Provider } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

interface MyModalProps {
  visible: boolean; // Der Typ für die `visible`-Prop
  onClose: () => void; // Der Typ für die `onClose`-Callback-Funktion
  service: EventService;
  termin: Appointment | null | undefined;
}

const TerminDetail: React.FC<MyModalProps> = ({ visible, service, termin, onClose }) => {
    const eventService = service;
    const [title, onTitleChange] = React.useState(termin?.title ?? '');
    const [ort, onOrtChange] = React.useState(termin?.location ?? '');
    const [startDate, onStartDateChange] = React.useState(termin?.startDate ?? new Date());
    const [endDate, onEndDateChange] = React.useState(termin?.endDate ?? new Date(new Date().getTime() + 60 * 60 * 1000));
    const [description, onDescriptionChange] = React.useState(termin?.description ?? '');
    const [doctor, onDoctorChange] = React.useState(termin?.doctor ?? '');
    const [praxis, onPraxisChange] = React.useState(termin?.praxis ?? '');
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = React.useState(false);
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = React.useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = React.useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = React.useState(false);
    const [editable, setEditable] = React.useState(termin == null);
    const ueberschrift: string = editable ? 'Neuen Termin erstellen' : 'Arzttermin'
    const [closeButtonText, setCloseButtonText] = React.useState(termin == null ? 'Abbrechen' : 'Schließen');
    const [saveButtonText, setSaveButtonText] = React.useState(termin == null ? 'Erstellen' : 'Speichern');
    

    React.useEffect(() => {
        onTitleChange(termin?.title ?? '');
        onOrtChange(termin?.location ?? '');
        onStartDateChange(termin?.startDate ?? new Date());
        onEndDateChange(termin?.endDate ?? new Date(new Date().getTime() + 60 * 60 * 1000));
        onDescriptionChange(termin?.description ?? '');
        onDoctorChange(termin?.doctor ?? '');
        onPraxisChange(termin?.praxis ?? '');
        setEditable(termin == null);
        setSaveButtonText(termin == null ? 'Erstellen' : 'Speichern');
      }, [termin]);

      React.useEffect(() => {
        if (!visible) {
          setEditable(false);
          onTitleChange(termin?.title ?? '');
          onOrtChange(termin?.location ?? '');
          onStartDateChange(termin?.startDate ?? new Date());
          onEndDateChange(termin?.endDate ?? new Date(new Date().getTime() + 60 * 60 * 1000));
          onDescriptionChange(termin?.description ?? '');
          onDoctorChange(termin?.doctor ?? '');
          onPraxisChange(termin?.praxis ?? '');
          setEditable(termin == null);
          setSaveButtonText(termin == null ? 'Erstellen' : 'Speichern');
        }
      }, [visible]);

    const openStartDatePicker = () => setStartDatePickerVisibility(true);
    const openStartTimePicker = () => setStartTimePickerVisibility(true);
    const openEndDatePicker = () => setEndDatePickerVisibility(true);
    const openEndTimePicker = () => setEndTimePickerVisibility(true);

    const createTermin = () => {
        const newAppointment: Appointment = {
            id: '',
            title,
            location: ort,
            startDate,
            endDate,
            description,
            doctor,
            praxis
        };
        eventService.createEvent(newAppointment);
    };

    const saveTermin = () => {
        if (termin){
            updateTermin
        } else {
            createTermin()
            console.log("Hier")
        }

        onClose();
    }

    const updateTermin = () => {
        if(termin) {
        const updateEvent: Appointment = {
            title: title,
            location: ort,
            startDate: startDate,
            endDate: endDate,
            description: description,
            doctor: doctor,
            praxis: praxis,
            id: termin?.id
        }
        eventService.updateEvent(updateEvent)
    }
    }

    const onStartDateConfirm = (params: any) => {
        setStartDatePickerVisibility(false);
        const newStartDate = params.date;
        onStartDateChange(newStartDate);
        // Set end date one hour after the start date by default
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

    const onEndDateConfirm = (params: any) => {
        setEndDatePickerVisibility(false);
        onEndDateChange(params.date);
    };

    const onEndTimeConfirm = ({ hours, minutes }: { hours: number; minutes: number }) => {
        setEndTimePickerVisibility(false);
        const newEndDate = new Date(endDate);
        newEndDate.setHours(hours, minutes);
        onEndDateChange(newEndDate);
    };

    const openEditMode = () => {
        setEditable (true);
        setCloseButtonText('Abbrechen');
    }

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
                <Text>Titel:</Text>
                <TextInput value={title} placeholder="Titel" style={styles.input} onChangeText={onTitleChange} editable={editable} />
                <Text>Ort:</Text>
                <TextInput value={ort} placeholder="Ort" style={styles.input} onChangeText={onOrtChange} editable={editable}/>
                
                <Text>Start:</Text>
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

                <Text>Ende:</Text>
                {/* Enddatum und -zeit */}
                <View style={styles.zeitArea}>
                    <TextInput  placeholder="Enddatum" 
                                style={styles.datum} 
                                onFocus={openEndDatePicker} 
                                value={endDate.toLocaleDateString()}
                                editable={editable} />
                    <TextInput  placeholder="Endzeit" 
                                style={styles.zeit} 
                                onFocus={openEndTimePicker} 
                                value={endDate.toLocaleTimeString([], 
                                { hour: '2-digit', minute: '2-digit' })}
                                editable={editable} />
                </View>

                <DatePickerModal
                  locale="de"
                  mode="single"
                  visible={isEndDatePickerVisible}
                  onDismiss={() => setEndDatePickerVisibility(false)}
                  date={endDate}
                  onConfirm={onEndDateConfirm}
                />

                <TimePickerModal
                  visible={isEndTimePickerVisible}
                  onDismiss={() => setEndTimePickerVisibility(false)}
                  onConfirm={onEndTimeConfirm}
                  hours={endDate.getHours()}
                  minutes={endDate.getMinutes()}
                />
                <Text>Beschreibung:</Text>
                <TextInput value={description} placeholder="Beschreibung" style={styles.input} onChangeText={onDescriptionChange} editable={editable}/>
                <Text>Behandelnder Arzt:</Text>
                <TextInput value={doctor} placeholder="Behandelnder Arzt" style={styles.input} onChangeText={onDoctorChange} editable={editable}/>
                <Text>Arztpraxis:</Text>
                <TextInput value={praxis} placeholder="Arztpraxis" style={styles.input} onChangeText={onPraxisChange} editable={editable}/>
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
});

export default TerminDetail;
