import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ImageBackground, SafeAreaView, StatusBar,
  ScrollView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../navigation/MainTabNavigator';
import { auth } from '../firebase';
import { Ionicons } from '@expo/vector-icons';

type SettingsScreenProps = NativeStackScreenProps<MainTabParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: SettingsScreenProps) => {

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            await auth.signOut();
            // The onAuthStateChanged listener in AppNavigator will handle the redirect.
          },
        },
      ]
    );
  };

  // Placeholder functions for other settings
  const handleEditProfile = () => Alert.alert("Edit Profile", "This feature is coming soon!");
  const handlePrivacyPolicy = () => Alert.alert("Privacy Policy", "This feature is coming soon!");
  const handleTermsOfService = () => Alert.alert("Terms of Service", "This feature is coming soon!");


  return (
    <ImageBackground
      source={require('../../assets/images/5.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Settings</Text>

          {/* User Profile Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <TouchableOpacity style={styles.row} onPress={handleEditProfile}>
              <Ionicons name="person-circle-outline" size={24} color="#250243" style={styles.rowIcon} />
              <Text style={styles.rowText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={22} color="#250243" />
            </TouchableOpacity>
          </View>

          {/* Legal Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal</Text>
            <TouchableOpacity style={styles.row} onPress={handlePrivacyPolicy}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#250243" style={styles.rowIcon} />
              <Text style={styles.rowText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={22} color="#250243" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={handleTermsOfService}>
              <Ionicons name="document-text-outline" size={24} color="#250243" style={styles.rowIcon} />
              <Text style={styles.rowText}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={22} color="#250243" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 35,
    color: '#250243',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
    color: '#250243',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.6,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
  },
  rowIcon: {
    marginRight: 15,
  },
  rowText: {
    flex: 1, // Takes up remaining space to push the chevron to the end
    fontFamily: 'Quicksand-Medium',
    fontSize: 16,
    color: '#250243',
  },
  logoutButton: {
    backgroundColor: '#FFEBF0', // A soft, attention-grabbing red
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E53935',
  },
  logoutButtonText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#E53935', // A strong red for the logout text
  },
});

export default SettingsScreen;