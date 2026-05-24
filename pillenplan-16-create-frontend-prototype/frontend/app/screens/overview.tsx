import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import Kalender from "../components/kalender";
import React, { ReactNode } from 'react';
import Sidebar from "../components/sidebar";
import EventService from "../services/eventService";



export default function Overview() {
    const service = EventService.getInstance();
    return (
        <View
        style={styles.page}
        >
            <View
            style={styles.sidebar}>
                <Sidebar service={service}></Sidebar>
            </View>
            <View
            style={styles.calendar}>
                <Kalender service={service}></Kalender>
            </View>
            
            
        </View>
    )
}


const styles = StyleSheet.create({
    page: {
        flexDirection: "row", // Zeilenrichtung für nebeneinanderliegende Views
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f2f5',

    },

    sidebar: {
        width: '30%',
        minWidth: 250,
        backgroundColor: '#f0f2f5',
        padding: 6,
    },

    calendar: {
        flex: 1, // Kalender nimmt den restlichen Platz ein
        minWidth:10,
        maxWidth: '69%',
        backgroundColor: 'white',
        padding: 6,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15,
        // Schatten für iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Schatten für Android
        elevation: 5,
       
    }
});
