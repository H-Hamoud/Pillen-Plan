import { Ionicons } from "@expo/vector-icons";
import { Link } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, GestureResponderEvent, Image, StyleSheet, Text, TouchableOpacity, Animated, View, Pressable } from "react-native";
import SpracheingabeModal from "./spracheingabeModal";
import EintragHinzufuegen from "./eintragHinzufuefenModal";
import Einstellungen from "./einstellungenModal";
import EventService from "../services/eventService";
import MedicationIntake from "../model/medicationIntake";

interface SideBarProps {
    service: EventService
}

const Sidebar: React.FC<SideBarProps> = ({ service }) => {
    const [modalSpracheingabeVisible, setModalSpracheingabeVisible] = useState(false);
    const [modalEintraghinzufuegenVisible, setModalEintragHinzufuegenVisible] = useState(false);
    const [modalEinstellungenVisible, setModalEinstellungenVisible] = useState(false);
    const [heutigePillen, setHeutigePillen] = useState<MedicationIntake[]>([]);
    const eventservice = service;

    const [pressedStates, setPressedStates] = useState({
        spracheingabe: false,
        eintragHinzufuegen: false,
        einstellungen: false
    });

    useEffect(() => {
        const fetchHeutigePillen = () => {
            const heute = new Date();
            const pillen = service
                .getOnlyPillen()
                .filter((pille) => {
                    const intakeDate = new Date(pille.pillenEinnahme.plannedIntake);
                    return (
                        intakeDate.getDate() === heute.getDate() &&
                        intakeDate.getMonth() === heute.getMonth() &&
                        intakeDate.getFullYear() === heute.getFullYear()
                    );
                })
                .sort((a, b) => {
                    const dateA = new Date(a.pillenEinnahme.plannedIntake);
                    const dateB = new Date(b.pillenEinnahme.plannedIntake);
                    return dateA.getTime() - dateB.getTime();
                })
                .map((pille) => pille.pillenEinnahme)
                .sort();
            setHeutigePillen(pillen);
        };

        fetchHeutigePillen();

        const handlePillenUpdate = () => fetchHeutigePillen();
        service.addPilleListener(handlePillenUpdate);
        service.addUpdatedPilleListener(handlePillenUpdate);

        return () => {
            service.removeAllListeners;
        };
    }, [service]);

    const handleSpracheingabe = () => {
        setModalSpracheingabeVisible(true);
    };

    const handleEintragHinzufuegen = () => {
        setModalEintragHinzufuegenVisible(true);
    };

    const handleEinstellungen = () => {
        setModalEinstellungenVisible(true);
    };

    return (
        <View style={styles.page}>
            {/* Heutige Pillen Box */}
            <View style={styles.box}>
                <View style={styles.heutige_Pillen}>
                    <Text style={styles.h1}>Heutige Pillen:</Text>
                    {heutigePillen.length > 0 ? (
                        heutigePillen.map((pille, index) => (
                            <Text key={index} style={styles.text}>
                                {new Date(pille.plannedIntake).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}:{" "}
                                {pille.anzahlPillen}x {pille.medikament.name}
                            </Text>
                        ))
                    ) : (
                        <Text style={styles.text}>Keine Pillen für heute</Text>
                    )}
                </View>
            </View>

            {/* Spracheingabe Button */}
            <View style={styles.box}>
                <TouchableOpacity
                    onPress={handleSpracheingabe}
                    activeOpacity={1}
                    style={[
                        styles.touchableBox,
                        pressedStates.spracheingabe && styles.pressed
                    ]}
                    onPressIn={() => setPressedStates(prev => ({ ...prev, spracheingabe: true }))}
                    onPressOut={() => setPressedStates(prev => ({ ...prev, spracheingabe: false }))}
                >
                    <View style={styles.addEntry}>
                        <Image
                            source={require('../../assets/icons/mic-icon.png')}
                            style={styles.image}
                        />
                        <Text style={styles.h1}>Spracheingabe</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <SpracheingabeModal
                visible={modalSpracheingabeVisible}
                service={eventservice}
                onClose={() => setModalSpracheingabeVisible(false)}
            />

            {/* Eintrag hinzufügen Button */}
            <View style={styles.box}>
                <TouchableOpacity
                    onPress={handleEintragHinzufuegen}
                    activeOpacity={1}
                    style={[
                        styles.touchableBox,
                        pressedStates.eintragHinzufuegen && styles.pressed
                    ]}
                    onPressIn={() => setPressedStates(prev => ({ ...prev, eintragHinzufuegen: true }))}
                    onPressOut={() => setPressedStates(prev => ({ ...prev, eintragHinzufuegen: false }))}
                >
                    <View style={styles.addEntry}>
                        <Image
                            source={require('../../assets/icons/add-icon.png')}
                            style={styles.image}
                        />
                        <Text style={styles.h1}>Eintrag hinzufügen </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <EintragHinzufuegen
                visible={modalEintraghinzufuegenVisible}
                service={eventservice}
                onClose={() => setModalEintragHinzufuegenVisible(false)}
            />

            {/* Einstellungen Button */}
            <View style={styles.box}>
                <TouchableOpacity
                    onPress={handleEinstellungen}
                    activeOpacity={1}
                    style={[
                        styles.touchableBox,
                        pressedStates.einstellungen && styles.pressed
                    ]}
                    onPressIn={() => setPressedStates(prev => ({ ...prev, einstellungen: true }))}
                    onPressOut={() => setPressedStates(prev => ({ ...prev, einstellungen: false }))}
                >
                    <View style={styles.addEntry}>
                        <Image
                            source={require('../../assets/icons/settings-icon.png')}
                            style={styles.image}
                        />
                        <Text style={styles.h1}>Einstellungen</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <Einstellungen
                visible={modalEinstellungenVisible}
                onClose={() => setModalEinstellungenVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    page: {
        width: '90%',
        height: "100%",
        backgroundColor: "#f0f2f5",
        borderRadius: 8,
        padding: 4
    },

    box: {
        minHeight: 25,
        backgroundColor: "white",
        justifyContent: "center",
        borderRadius: 8,
        marginVertical: 5,
        marginHorizontal: 1,
        marginRight: 0.1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.4,
        elevation: 5,
    },

    touchableBox: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 30,
        width: '100%',
        height: '100%',
        // 3D-Effekt
        shadowColor: '#ddd',
        shadowOffset: {
            width: 0,
            height: 4, // 3D-Effekt nach unten
        },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4, // Für Android
    },


    pressed: {
        backgroundColor: "#fff",
        transform: [{translateY: 4}], // Bewegung nach unten beim Drücken
        shadowOffset: {
            width: 0,
            height: 0, // Schatten verschwindet beim Drücken
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 1,
    },

    text: {
        flexWrap: "wrap",
        width: "80%",
        margin: 5,
        fontSize: 20,
        marginLeft: 10,
        color: "#333",
    },

    h1: {
        color: "#333",
        fontSize: 22,
        fontWeight: "bold",
        padding: 5,
        marginLeft: 10,
        flexWrap: "wrap"
    },

    heutige_Pillen: {
        padding: 15,
        alignSelf: 'flex-start',
        width: '100%',
    },


    image: {
        width: 70,
        height: 70,
    },

    addEntry: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 10
    },

});

export default Sidebar;