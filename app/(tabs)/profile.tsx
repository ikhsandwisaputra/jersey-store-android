// app/(tabs)/profile.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext'; // 1. Import hook yang diperlukan
import { useRouter } from 'expo-router';
import { updateUser as apiUpdateUser, updateUserPassword } from '@/src/api/auth'; // Ganti nama updateUser agar tidak bentrok
export default function Profile() {
// Ambil juga fungsi updateUser dari context
  const { user, token, logout, updateUser } = useAuth();
  const router = useRouter();

  // State untuk form, diinisialisasi kosong
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState(''); // Hanya untuk password baru
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Isi form dengan data user asli saat komponen dimuat
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // 4. Fungsi untuk menyimpan perubahan ke server
  const handleUpdate = async () => {
    if (!user || !token) return; // Guard clause
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Nama dan Email tidak boleh kosong.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiUpdateUser(user.id, { name, email });
      let updateSuccess = false;
      let passwordSuccess = true; // Anggap sukses jika tidak diubah

      // Update nama dan email jika ada perubahan
      if (name !== user.name || email !== user.email) {
        updateUser({
          ...user,
          name,
          email,
        });
        updateSuccess = true;
      }
  // Panggil API untuk update ke database

      // --- INI BAGIAN PENTINGNYA ---
      // Buat objek user baru dengan data yang sudah diubah
      const updatedUserData = {
        ...user, // Ambil data lama (seperti ID)
        name: name, // Timpa dengan nama baru
        email: email, // Timpa dengan email baru
      };
      
      // Panggil fungsi dari context untuk update state di seluruh aplikasi
      updateUser(updatedUserData);
      // Update password hanya jika kolom password baru diisi
      if (newPassword) {
        await updateUserPassword(user.id, newPassword);
        passwordSuccess = true;
      }
      
      if(updateSuccess || passwordSuccess) {
        Alert.alert('Sukses', 'Profil berhasil diperbarui.', [
          { text: 'OK', onPress: () => router.back() } // Kembali setelah sukses
        ]);
        // Disarankan untuk me-refresh data user di context setelah update
      }

    } catch (error) {
      Alert.alert('Update Gagal', (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#0D253C" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity style={styles.headerButton} onPress={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? <ActivityIndicator size="small" /> : <Feather name="check" size={24} color="#0D253C" />}
            </TouchableOpacity>
          </View>

          {/* Foto Profil */}
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Feather name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>

          {/* Form Input */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <View style={styles.inputContainer}>
                <TextInput style={styles.input} value={name} onChangeText={setName} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail address</Text>
              <View style={styles.inputContainer}>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password (optional)</Text>
              <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Isi untuk mengubah password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Feather name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#6A7D8F" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Salin semua style dari file asli Anda
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#DDF1FA', },
  container: { paddingHorizontal: 20, paddingBottom: 30, },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, },
  headerButton: { backgroundColor: '#FFFFFF', padding: 8, borderRadius: 20, },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#0D253C', },
  profileImageContainer: { alignItems: 'center', marginVertical: 20, },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#FFFFFF', },
  editImageButton: { position: 'absolute', bottom: 5, right: '35%', backgroundColor: '#1AD0BC', padding: 8, borderRadius: 15, },
  formContainer: { marginTop: 10, },
  inputGroup: { marginBottom: 20, },
  label: { fontSize: 16, color: '#0D253C', marginBottom: 8, fontWeight: '500', },
  inputContainer: { backgroundColor: '#FFFFFF', borderRadius: 15, paddingHorizontal: 15, height: 55, justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 1, },
  input: { fontSize: 16, color: '#0D253C', },
});