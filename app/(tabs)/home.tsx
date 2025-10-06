import { Platform, StyleSheet, View, TextInput, Button, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { ScrollView } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/fonts';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '@/app/context/theme-context';
import React, { useContext, useState } from 'react';
import { Colors } from '@/constants/theme';

export default function RobotMonitorScreen() {
  const isOnline = true;
  const { colorScheme, toggleColorScheme } = useContext(ThemeContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Monitoramento do Robô
        </ThemedText>
        <Pressable onPress={toggleColorScheme}>
          {({ pressed }) => (
            <FontAwesome
              name={colorScheme === 'dark' ? 'sun-o' : 'moon-o'}
              size={25}
              color={Colors[colorScheme ?? 'light'].text}
              style={{ marginLeft: 10, opacity: pressed ? 0.5 : 1 }}
            />
          )}
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.loginContainer}>
        <TextInput
          style={[styles.input, { color: Colors[colorScheme ?? 'light'].text, backgroundColor: Colors[colorScheme ?? 'light'].background }]} 
          placeholder="Usuário"
          placeholderTextColor={Colors[colorScheme ?? 'light'].text}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[styles.input, { color: Colors[colorScheme ?? 'light'].text, backgroundColor: Colors[colorScheme ?? 'light'].background }]} 
          placeholder="Senha"
          placeholderTextColor={Colors[colorScheme ?? 'light'].text}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Entrar" onPress={() => console.log("Login: ", username, password)} />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginContainer: {
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
});

