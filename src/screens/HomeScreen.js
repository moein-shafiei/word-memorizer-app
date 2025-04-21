import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word Memorizer</Text>
      <Text style={styles.subtitle}>Learn new words every day</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Add New Word"
          onPress={() => navigation.navigate('AddWord')}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Settings"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
      
      <Text style={styles.infoText}>
        You'll receive word notifications based on your settings.
        Words you're still learning will appear more frequently.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#555',
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
  },
  infoText: {
    marginTop: 30,
    textAlign: 'center',
    color: '#666',
  },
});

export default HomeScreen;
