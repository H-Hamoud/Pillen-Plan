import { Calendar } from 'react-native-big-calendar'
import { useEffect, useState } from 'react';
import Appointment from '../model/appointment';
import EventService from '../services/eventService';
import TerminDetail from './terminDetail';
import { View } from 'react-native';
import MedicationIntake from '../model/medicationIntake';
import PillenDetail from './pillenDetail';

interface KalenderProps {
  service: EventService
}

interface EventObjekt {
  title: string, 
  start: Date, 
  end: Date, 
  appointment?: Appointment,
  pillenEinnahme?: MedicationIntake
}

const Kalender: React.FC<KalenderProps> = ({ service }) => {
  const eventservice = service;
  const [allEvents, setAllEvents] = useState<EventObjekt[]>(service.getEvents());

  const [modalTerminDetailVisible, setModalTerminDetailVisible] = useState(false);
  const [modalPillenDetailVisible, setModalPillenDetailVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Appointment>();
  const [selectedPille, setSelectedPille] = useState<MedicationIntake>();


  const handleEventPress = (event: any) => {
    const eventObj = event as EventObjekt;

    if (eventObj.appointment != null && eventObj.appointment != undefined) {
      setSelectedEvent(eventObj.appointment);
      setModalTerminDetailVisible(true);
    } else  {
      setSelectedPille(eventObj.pillenEinnahme);
      setModalPillenDetailVisible(true);
    }
  };

  useEffect(() => {
    console.log(allEvents)
    // Event-Listener für neue Events
    const handleNewEvent = () => {
      setAllEvents((prevEvents) => [...prevEvents, ...eventservice.getEvents()]);
    };

    // Event-Listener für aktualisierte Events
    const handleUpdatedEvent = () => {
      setAllEvents(eventservice.getEvents());
    };

    const handleNewPille = () => {
      setAllEvents((prevEvents) => [...prevEvents, ...eventservice.getEvents()]);
    };
    const handleUpdatePille = () => {
      setAllEvents(eventservice.getEvents);
    }

    // Abonnieren der Events
    service.addEventListener(handleNewEvent)
    service.addUpdatedEventListener(handleUpdatedEvent)
    service.addPilleListener(handleNewPille);
    service.addUpdatedPilleListener(handleUpdatePille)

    return () => {
      service.removeAllListeners
    };
  }, []);
  return (
      <View style={{ width: '100%' }}>
            <Calendar
                events={allEvents}
                height={window.innerHeight - 50}
                onPressEvent={handleEventPress}
            />

          <TerminDetail
              visible={modalTerminDetailVisible}
              onClose={() => { setModalTerminDetailVisible(false) }}
              service={eventservice}
              termin={selectedEvent}

          />
           <PillenDetail
               visible={modalPillenDetailVisible}
               onClose={() => { setModalPillenDetailVisible(false) }}
               service={eventservice}
               pille={selectedPille}

           />
    </View>
    )
}

export default Kalender