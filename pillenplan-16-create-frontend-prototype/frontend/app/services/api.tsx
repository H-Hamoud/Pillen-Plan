import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// only a class made to test fetching an api, can be deleted, not used
interface CatFact {
    _id: string;
    text: string;
}


export default function Api() {
    const [facts, setFacts] = useState<CatFact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFacts = async () => {
            try {
                const response = await fetch('https://cat-fact.herokuapp.com/facts');
                const data = await response.json();
                setFacts(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFacts();
    }, []);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            {facts.map((fact) => (
                <Text key={fact._id} style={styles.fact}>
                    {fact.text}
                </Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fact: {
        padding: 10,
        fontSize: 16,
    },
});