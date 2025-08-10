// src/app/detailJersey.tsx
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '@/src/context/CartContext'; // Import useCart

// Tipe data produk yang diterima dari navigasi
interface Product {
    id: number;
    name: string;
    stock: number;
    price: number;
    image: string;
    clubId: number | null;
    description?: string;
}

export default function DetailJersey() {
  const { addToCart } = useCart(); // Gunakan hook useCart
  const router = useRouter();
  const params = useLocalSearchParams();

  const productParam = params.product as string | undefined;

  // default in case no product passed
  let product: Product | null = null;
  try {
    if (productParam) {
      product = JSON.parse(decodeURIComponent(productParam));
    }
  } catch (err) {
    console.warn('Failed to parse product param', err);
  }

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  
  // Fungsi yang diperbaiki untuk menambah ke keranjang
  const handleAddToCart = () => {
    if (!product) return;

    // Mapping data dari 'Product' ke 'CartItem'
    const productDataForCart = {
      id_products: product.id,
      name_products: product.name,
      prices: product.price,
      image_products: product.image,
      stock: product.stock,
      // quantity tidak perlu disediakan, akan di-handle oleh context
    };

    addToCart(productDataForCart);
    Alert.alert('Berhasil', 'Produk ditambahkan ke keranjang');
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Tidak ada data produk. Kembali ke daftar.</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
            <Text style={{ color: '#1AD0BC' }}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header dengan tombol kembali */}
        <View style={styles.header2}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Feather name="chevron-left" size={24} color="#0D253C" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Detail Produk</Text>
        </View>

        <View style={styles.container}>
          {/* Info Produk */}
          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>{product.name}</Text>
            <Text style={styles.typeText}>Stok Tersedia: {product.stock ?? '-'}</Text>
          </View>

          {/* Harga */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              {formatRupiah(product.price ?? 0)}
            </Text>
          </View>

          {/* Gambar Produk */}
          <View style={styles.imageBigContainer}>
            <Image source={{ uri: product.image }} style={styles.bigImage} contentFit="contain" />
          </View>

          {/* Deskripsi */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Detail</Text>
            <Text style={styles.descriptionText}>
              {product.description ?? 'Belum ada deskripsi untuk produk ini.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Tombol Add To Bag */}
      <View style={styles.footer}>
        <TouchableOpacity 
            onPress={handleAddToCart} 
            style={styles.addToBagButton}
            disabled={product.stock === 0} // Disable jika stok habis
        >
          <Text style={styles.addToBagText}>{product.stock === 0 ? 'Stok Habis' : 'Add To Bag'}</Text>
          <Feather name="shopping-bag" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// (Salin semua 'styles' dari file lama Anda ke sini, tidak ada perubahan pada styles)
const styles = StyleSheet.create({
  header2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
    backButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D253C',
    marginLeft: -40, 
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#DDF1FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    
  },
  infoContainer: {
    // marginTop: 15,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D253C',
    marginTop: 6,
  },
  typeText: {
    fontSize: 14,
    color: '#6A7D8F',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D253C',
  },
  imageBigContainer: {
    marginVertical: 18,
    alignItems: 'center',
  },
  bigImage: {
    width: 300,
    height: 220,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D253C',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6A7D8F',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#DDF1FA',
  },
  addToBagButton: {
    backgroundColor: '#1AD0BC',
    borderRadius: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1AD0BC',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  addToBagText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
});