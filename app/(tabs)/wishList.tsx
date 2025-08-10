// app/wishlist.tsx
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useWishlist } from '@/src/context/WishlistContext';
import { useCart } from '@/src/context/CartContext';
import { Product } from '@/src/types/products';

export default function WishlistScreen() {
  const router = useRouter();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToBag = (product: Product) => {
    // 1. Siapkan data untuk keranjang
    const productDataForCart = {
      id_products: product.id,
      name_products: product.name,
      prices: product.price,
      image_products: product.image,
      stock: product.stock,
    };
    
    // 2. Tambahkan ke keranjang
    addToCart(productDataForCart);

    // 3. Hapus dari wishlist
    removeFromWishlist(product.id);

    // 4. Beri notifikasi
    Alert.alert('Sukses', `${product.name} telah dipindahkan ke keranjang.`);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.itemCard}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetailsContainer}>
        <View>
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.itemInfo}>Stok: {item.stock}</Text>
        </View>
        <View style={styles.itemActions}>
          <Text style={styles.itemPrice}>Rp {item.price.toLocaleString('id-ID')}</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => handleAddToBag(item)}
            disabled={item.stock === 0}
          >
            <Text style={styles.addButtonText}>{item.stock === 0 ? 'Habis' : 'Add to Bag'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Tombol Hapus */}
      <TouchableOpacity 
        style={styles.removeButton} 
        onPress={() => removeFromWishlist(item.id)}
      >
        <Feather name="x" size={20} color="#6A7D8F" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Feather name="chevron-left" size={24} color="#0D253C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
        <View style={{width: 40}} />{/* Spacer */}
      </View>

      {wishlistItems.length > 0 ? (
        <FlatList
          data={wishlistItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Wishlist kamu masih kosong.</Text>
          <TouchableOpacity onPress={() => router.replace('/')} style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Cari Produk</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#DDF1FA' },
  listContainer: { paddingHorizontal: 20, paddingTop: 10 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
  headerButton: { padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#0D253C' },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  itemImage: { width: 80, height: 100, resizeMode: 'contain', borderRadius: 8 },
  itemDetailsContainer: { flex: 1, marginLeft: 16, height: 100, justifyContent: 'space-between' },
  itemName: { fontSize: 16, fontWeight: '600', color: '#0D253C' },
  itemInfo: { fontSize: 13, color: '#6A7D8F', marginTop: 4 },
  itemActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#0D253C' },
  addButton: {
    backgroundColor: '#1AD0BC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    padding: 4,
  },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#6A7D8F' },
  shopButton: { marginTop: 20, backgroundColor: '#1AD0BC', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 20 },
  shopButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});