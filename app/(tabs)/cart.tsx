// app/cart.tsx
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart, CartItem } from '@/src/context/CartContext';

export default function CartScreen() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();

  // Fungsi untuk format mata uang Rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image_products }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name_products}</Text>
        <Text style={styles.itemPrice}>{formatRupiah(item.prices)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={() => updateQuantity(item.id_products, item.quantity - 1)}
          >
            <Feather name="minus" size={18} color="#0D253C" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={() => updateQuantity(item.id_products, item.quantity + 1)}
            disabled={item.quantity >= item.stock} // Disable jika quantity sama dengan stok
          >
            <Feather name="plus" size={18} color="#0D253C" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id_products)}>
        <Feather name="trash-2" size={22} color="#F87265" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="chevron-left" size={24} color="#0D253C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Keranjang Saya</Text>
      </View>

      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_products.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Keranjang belanja Anda kosong.</Text>
          <TouchableOpacity onPress={() => router.replace('/')} style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Mulai Belanja</Text>
          </TouchableOpacity>
        </View>
      )}

      {cartItems.length > 0 && (
         <View style={styles.footer}>
            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Harga:</Text>
                <Text style={styles.totalPrice}>{formatRupiah(totalPrice)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton}>
                <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
         </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#DDF1FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF'
  },
  backButton: { padding: 5 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#0D253C', marginLeft: -30 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  itemImage: { width: 80, height: 80, borderRadius: 8 },
  itemDetails: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  itemName: { fontSize: 16, fontWeight: '600', color: '#0D253C' },
  itemPrice: { fontSize: 14, color: '#1AD0BC', fontWeight: 'bold', marginVertical: 4 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  quantityButton: { padding: 5, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 5 },
  quantityText: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 15 },
  removeButton: { padding: 8, marginLeft: 10 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#6A7D8F' },
  shopButton: { marginTop: 20, backgroundColor: '#1AD0BC', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 20 },
  shopButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#FFFFFF', backgroundColor: '#DDF1FA' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  totalLabel: { fontSize: 18, color: '#6A7D8F' },
  totalPrice: { fontSize: 22, fontWeight: 'bold', color: '#0D253C' },
  checkoutButton: { backgroundColor: '#1AD0BC', paddingVertical: 15, borderRadius: 20, alignItems: 'center' },
  checkoutText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});