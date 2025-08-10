// components/Header.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '@/src/context/AuthContext'; // <-- 1. Import useAuth

export default function Header() {
  const { user, logout } = useAuth(); // <-- 2. Ambil data user dan fungsi logout
  const [menuVisible, setMenuVisible] = useState(false); // <-- 3. State untuk menu

  const handleLogout = () => {
    setMenuVisible(false); // Tutup menu
    logout(); // Jalankan fungsi logout
  };

  return (
    <View style={styles.header}>
      <Feather name="menu" size={30} color="#0D253C" />

      {/* 4. Kelompokkan email dan foto profil agar bisa diklik */}
      <View>
        <TouchableOpacity style={styles.profileContainer} onPress={() => setMenuVisible(!menuVisible)}>          
          <Text style={styles.emailText}>{user?.name}</Text>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
            }}
            style={styles.profileImage}
            contentFit="cover"
          />
        </TouchableOpacity>

        {/* 5. Tampilkan menu jika menuVisible adalah true */}
        {menuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Feather name="log-out" size={16} color="#E74C3C" />
              <Text style={styles.menuItemText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 100, // Sedikit disesuaikan
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF', // Warna bisa disesuaikan
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    // paddingTop: 40,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailText: {
    marginRight: 10,
    fontSize: 16,
    color: '#0D253C',
    fontWeight: '600',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  // Style untuk menu dropdown
  menu: {
    position: 'absolute',
    top: 55, // Atur posisi di bawah foto profil
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#EEE',
zIndex: 9999,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#E74C3C',
  },
});