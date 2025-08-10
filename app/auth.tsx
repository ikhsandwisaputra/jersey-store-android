// app/login.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Alert,
    ActivityIndicator,
    Image // Tambahkan jika Anda menggunakan Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
type AuthInputProps = {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name']; // Tipe dinamis untuk semua nama ikon
  placeholder: string;
  value: string;
  setValue: (text: string) => void; // Fungsi yang menerima string dan tidak mengembalikan apa-apa
  secureTextEntry?: boolean; // Tanda '?' berarti prop ini opsional
};
// =================================================================
// SOLUSI: Definisikan AuthInput DI LUAR komponen LoginScreen
// =================================================================
// Dengan begini, AuthInput menjadi komponen yang stabil dan tidak dibuat ulang
// pada setiap re-render LoginScreen.
// Terapkan tipe AuthInputProps ke komponen menggunakan React.FC
const AuthInput: React.FC<AuthInputProps> = ({
  iconName,
  placeholder,
  value,
  setValue,
  secureTextEntry = false,
}) => (
    <View style={styles.inputContainer}>
        <MaterialCommunityIcons name={iconName} size={22} color="#888" style={styles.inputIcon} />
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#888"
            value={value}
            onChangeText={setValue}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
        />
    </View>
);


type AuthMode = 'login' | 'signup';

export default function LoginScreen() {
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();

    const handleLogin = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await login(email, password);
        } catch (error) {
            Alert.alert('Login Gagal', (error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignUp = () => {
        Alert.alert('Info', 'Fungsi Sign Up belum diimplementasikan.');
    };

    // Tampilan untuk Login
    const renderLoginView = () => (
        <>
            <Text style={styles.title}>Hello!</Text>
            <Text style={styles.subtitle}>Welcome to plantland</Text>

            <View style={styles.formContainer}>
                <AuthInput iconName="email-outline" placeholder="Email" value={email} setValue={setEmail} />
                <AuthInput iconName="lock-outline" placeholder="Password" value={password} setValue={setPassword} secureTextEntry />
                <TouchableOpacity>
                    <Text style={styles.forgotPassword}>Forgot Password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={isSubmitting}>
                    {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Login</Text>}
                </TouchableOpacity>
            </View>

            <Text style={styles.orText}>Or login with</Text>

            <View style={styles.socialLoginContainer}>
                {/* Tombol Social Login */}
                <TouchableOpacity style={styles.socialButton}><MaterialCommunityIcons name="facebook" size={24} color="#3b5998" /></TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}><MaterialCommunityIcons name="google" size={24} color="#DB4437" /></TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}><MaterialCommunityIcons name="apple" size={24} color="#000" /></TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setMode('signup')}>
                <Text style={styles.switchText}>
                    Don't have account? <Text style={styles.switchLink}>Sign Up</Text>
                </Text>
            </TouchableOpacity>
        </>
    );

    // Tampilan untuk Sign Up
    const renderSignUpView = () => (
        <>
            <TouchableOpacity style={styles.backButton} onPress={() => setMode('login')}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
                <Text style={styles.backButtonText}>Back to login</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Sign Up</Text>

             <View style={styles.formContainer}>
                <AuthInput iconName="email-outline" placeholder="Email" value={email} setValue={setEmail} />
                <AuthInput iconName="lock-outline" placeholder="Password" value={password} setValue={setPassword} secureTextEntry />
                <AuthInput iconName="lock-check-outline" placeholder="Confirm Password" value={confirmPassword} setValue={setConfirmPassword} secureTextEntry />
                <AuthInput iconName="phone-outline" placeholder="Phone" value={phone} setValue={setPhone} />
                
                <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp}>
                    <Text style={styles.primaryButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.topContainer}>
                {/* Ganti dengan Image jika perlu */}                
                <Image source={require('../assets/images/art.png')} style={styles.plantImage}resizeMode="contain"
                ></Image>
            </View>
            <View style={styles.bottomContainer}>
                {mode === 'login' ? renderLoginView() : renderSignUpView()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#166555', // Warna background atas
    },
    topContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    plantImage: {
        width: '50%',
        height: '100%',
    },
    bottomContainer: {
        flex: 0.7,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 30,
        paddingTop: 30,
        alignItems: 'center',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 5,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        marginBottom: 20,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        borderRadius: 15,
        paddingHorizontal: 15,
        marginBottom: 15,
        height: 55,
        borderColor: '#E8E8E8',
        borderWidth: 1,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    forgotPassword: {
        fontSize: 14,
        color: '#166555',
        textAlign: 'right',
        marginBottom: 20,
        fontWeight: '600',
    },
    primaryButton: {
        backgroundColor: '#166555',
        borderRadius: 15,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orText: {
        fontSize: 14,
        color: '#888',
        marginVertical: 20,
    },
    socialLoginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    socialButton: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#F7F7F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        borderColor: '#E8E8E8',
        borderWidth: 1,
    },
    switchText: {
        marginTop: 25,
        fontSize: 14,
        color: '#888',
    },
    switchLink: {
        color: '#166555',
        fontWeight: 'bold',
    },
});