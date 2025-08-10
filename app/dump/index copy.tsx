import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { getProducts } from '@/src/api/getProducts';
import { Product } from '@/src/types/products';
import { getClubs } from '@/src/api/getClubs';
import { Clubs } from '@/src/types/clubs';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';

// Sebaiknya gunakan library icon seperti @expo/vector-icons
// Saya akan menggunakan Feather sebagai contoh.
// Jalankan: npx expo install @expo/vector-icons
import { Feather } from '@expo/vector-icons';


const categories = ['Nike', 'Adidas', 'Puma', 'Balenciaga', 'Converse', 'Jordan'];

// --- Komponen Utama ---
export default function HomeScreen() {
   const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };
  fetchData();
}, []);

  const [activeCategory, setActiveCategory] = useState('Nike');

  return (
   <SafeAreaView style={styles.safeArea}>
  <FlatList
    data={products}
    keyExtractor={(item) => item.id.toString()}
    numColumns={2}
    columnWrapperStyle={{ justifyContent: 'space-between' }}
    showsVerticalScrollIndicator={false}

    // Header tetap di atas FlatList
    ListHeaderComponent={
      <View>
        {/* Bagian Header */}
        <View style={styles.header}>
          <Feather name="menu" size={30} color="#0D253C" />
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            }}
            style={styles.profileImage}
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Find Shoes"
            style={styles.searchInput}
            placeholderTextColor="#8A8A8A"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Feather name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View>
          <Text style={styles.title}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScrollView}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setActiveCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    }

    // Item Grid
    renderItem={({ item }) => (
      <View style={styles.productCard}>
        <TouchableOpacity style={styles.favoriteButton}>
          <Feather name="heart" size={20} color="#F87265" />
        </TouchableOpacity>
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>
          Rp {item.price.toLocaleString('id-ID')}
        </Text>
      </View>
    )}
  />
</SafeAreaView>

  );
}

// --- StyleSheet untuk kerapian kode ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DDF1FA',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 100, // Beri ruang agar tidak tertutup tab bar
  },
  header: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: '#1AD0BC',
    borderWidth: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0D253C',
    height: 45,
  },
  searchButton: {
    backgroundColor: '#1AD0BC',
    borderRadius: 12,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D253C',
    marginTop: 25,
    marginBottom: 15,
  },
  categoryScrollView: {
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 17,
    color: '#9A9A9A',
    marginRight: 25,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#0D253C',
    fontWeight: 'bold',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    width: '48%', // Sekitar setengah lebar, dikurangi sedikit untuk spasi
    marginBottom: 15,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  favoriteButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: 110,
    alignSelf: 'center',
    marginBottom: 15,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D253C',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D253C',
  },
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    height: 70,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
});