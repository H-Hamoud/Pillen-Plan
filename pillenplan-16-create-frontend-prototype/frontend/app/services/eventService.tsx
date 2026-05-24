import { NativeEventEmitter } from "react-native";
import Appointment from "../model/appointment"
import EventEmitter from "events";
import MedicationIntake, { Wiederholung } from "../model/medicationIntake";


export default class EventService extends NativeEventEmitter {

  private events = [
    {
      title: 'Ibuprofen',
      start: new Date(2024, 11, 6, 10, 0),
      end: new Date(2024, 11, 6, 10, 30),
      appointment: new Appointment()
    },
    {
      title: 'Flecainid',
      start: new Date(2024, 11, 6, 16, 0),
      end: new Date(2024, 11, 6, 16, 30),
      appointment: new Appointment()
    },
    {
      title: 'Doxazosin',
      start: new Date(2024, 11, 6, 20, 0),
      end: new Date(2024, 11, 6, 20, 30),
      appointment: new Appointment()
    },
  ];
  private pillen = [
    {
      title: 'Ibuprofen',
      start: new Date(2024, 11, 2, 10, 0),
      end: new Date(2024, 11, 2, 10, 30),
      pillenEinnahme: new MedicationIntake()
    },
    {
      title: 'Flecainid',
      start: new Date(2024, 11, 2, 16, 0),
      end: new Date(2024, 11, 2, 16, 30),
      pillenEinnahme: new MedicationIntake()
    },
    {
      title: 'Doxazosin',
      start: new Date(2024, 11, 2, 20, 0),
      end: new Date(2024, 11, 2, 20, 30),
      pillenEinnahme: new MedicationIntake()
    },
  ];

  static getInstance() {
    return new EventService
  }

  getEvents() {
    let allEvents = [...this.events, ...this.pillen];
    return allEvents;
  }

  getOnlyPillen(){
    return this.pillen;
  }
  

  async createEvent(event: Appointment) {
    this.events.push({title: event.title,
        start: event.startDate,
        end: event.endDate,
        appointment: event});
    this.emit('newEvent', event);
  }

  async updateEvent(updatedEvent: Appointment) {
  }

  async fetchEvents(userId: string) {
    return this.events;
  }

  async createPillenIntake(newPillenIntake: MedicationIntake, endDate: Date) {
    const oneDay = 24 * 60 * 60 * 1000; // Millisekunden in einem Tag
  let increment = oneDay; // Standard ist täglich

  // Bestimme den Intervall basierend auf der Wiederholung
  if (newPillenIntake.wiederholung === Wiederholung.wöchentlich) {
    increment = oneDay * 7; // Wöchentlich: 7 Tage
  } else if (newPillenIntake.wiederholung === Wiederholung.zweiwöchentlich) {
    increment = oneDay * 14; // Zweiwöchentlich: 14 Tage
  }
    let currentDate = new Date(newPillenIntake.plannedIntake); // Startdatum kopieren
    
    while (currentDate <= endDate) {
      this.pillen.push({
        title: newPillenIntake.medikament.name,
        start: new Date(currentDate), // Kopie des aktuellen Datums
        end: new Date(currentDate.getTime() + 60 * 60 * 1000), // Eine Stunde nach Start
        pillenEinnahme: {
          ...newPillenIntake, // Originaldaten übernehmen
          plannedIntake: new Date(currentDate) // Geändertes Datum setzen
        }
      });
  
      // Zum nächsten Tag wechseln
      currentDate = new Date(currentDate.getTime() + increment);
    }
  
    // Event auslösen
    this.emit('newPille', newPillenIntake);
  }
  
  async updatePillenIntake(updatedPille: MedicationIntake, endDate: Date) {
  }

  // Listener für das "newEvent"-Ereignis hinzufügen
  addEventListener(listener: (event: Appointment) => void) {
    this.addListener('newEvent', listener);
  }

  // Listener für das "updatedEvent"-Ereignis hinzufügen
  addUpdatedEventListener(listener: (event: Appointment) => void) {
    this.addListener('updatedEvent', listener);
  }

  addPilleListener(listener: (pille: MedicationIntake) => void) {
    this.addListener('newPille', listener);
  }

  // Listener für das "updatedEvent"-Ereignis hinzufügen
  addUpdatedPilleListener(listener: (pille: MedicationIntake) => void) {
    this.addListener('updatedPille', listener);
  }
}
