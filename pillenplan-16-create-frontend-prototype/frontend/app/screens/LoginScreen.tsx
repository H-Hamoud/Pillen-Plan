// screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface LoginScreenProps {
  setIsLoggedIn: (value: boolean) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Fiktive Authentifizierung
    if (username === 'user' && password === 'pass') {
      setIsLoggedIn(true);
    } else {
      alert('Ungültige Anmeldedaten');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Benutzername"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Passwort"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Anmelden" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 16 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 16, padding: 8 },
});

export default LoginScreen;
