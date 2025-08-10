// app/index.tsx
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { getProducts } from '@/src/api/getProducts';
import { getClubs } from '@/src/api/getClubs';
import { Product } from '@/src/types/products';
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
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';

export default function HomeScreen() {
  const router = useRouter();
  const { cartItems } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [clubs, setClubs] = useState<Clubs[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | number>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodDataRaw, clubData] = await Promise.all([
          getProducts(),
          getClubs(),
        ]);

        const prodData: Product[] = prodDataRaw.map((p: any) => ({
          id: p.id_products ?? p.id ?? p.id_product,
          name: p.name_products ?? p.name ?? p.title,
          stock: p.stock ?? 0,
          price: p.prices ?? p.price ?? p.price_idr ?? 0,
          image: p.image_products ?? p.image ?? p.image_url,
          clubId: p.club_id ?? p.clubId ?? p.club_id_fk ?? null,
        }));

        setProducts(prodData);
        setClubs(clubData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleToggleWishlist = (product: Product) => {
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const changeCategory = (category: 'all' | number) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((p) => {
    const matchCategory = activeCategory === 'all' ? true : p.clubId === activeCategory;
    const matchSearch =
      searchQuery.trim() === ''
        ? true
        : p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToDetail = (product: Product) => {
    const productStr = encodeURIComponent(JSON.stringify(product));
    router.push(`/detailJersey?product=${productStr}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={paginatedProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ paddingBottom: 10 }}>
            <View style={styles.header}>
              <Text style={styles.headerAppTitle}>Jersey Store</Text>
              <View style={styles.headerIcons}>
                <TouchableOpacity onPress={() => router.push('/wishList')} style={styles.cartButton}>
                  <Feather name="heart" size={24} color="#0D253C" />
                   {wishlistItems.length > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{wishlistItems.length}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/cart')} style={styles.cartButton}>
                  <Feather name="shopping-cart" size={24} color="#0D253C" />
                  {cartItems.length > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Cari Jersey"
                style={styles.searchInput}
                placeholderTextColor="#8A8A8A"
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setCurrentPage(1);
                }}
              />
              <TouchableOpacity style={styles.searchButton}>
                <Feather name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScrollView}
            >
              {[{ id_club: 'all', name_club: 'Semua' }, ...clubs].map((club) => (
                <TouchableOpacity
                  key={club.id_club?.toString() ??  club.name_club}
                  onPress={() =>
                    changeCategory(club.id_club === 'all' ? 'all' : Number(club.id_club))
                  }
                  style={{ marginRight: 18 }}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      activeCategory === (club.id_club === 'all' ? 'all' : Number(club.id_club)) &&
                        styles.categoryTextActive,
                    ]}
                  >
                    {club.name_club}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.productWrapper}>
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => goToDetail(item)}
              activeOpacity={0.8}
            >
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => handleToggleWishlist(item)}
              >
                <Feather 
                  name="heart" 
                  size={20} 
                  color={isWishlisted(item.id) ? '#F87265' : '#C0C0C0'}
                />
              </TouchableOpacity>
              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
                contentFit="contain"
              />
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.productPrice}>
                Rp {Number(item.price).toLocaleString('id-ID')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          totalPages > 1 ? (
            <View style={styles.pagination}>
              <TouchableOpacity
                disabled={currentPage === 1}
                onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                <Text
                  style={[
                    styles.pageButton,
                    currentPage === 1 && styles.pageButtonDisabled,
                  ]}
                >
                  Prev
                </Text>
              </TouchableOpacity>
              <Text style={styles.pageInfo}>
                {currentPage} / {totalPages}
              </Text>
              <TouchableOpacity
                disabled={currentPage === totalPages}
                onPress={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                <Text
                  style={[
                    styles.pageButton,
                    currentPage === totalPages && styles.pageButtonDisabled,
                  ]}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DDF1FA',
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerAppTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D253C',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  cartButton: {
    padding: 5,
  },
  cartBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#F87265',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
    fontSize: 22,
    fontWeight: '700',
    color: '#0D253C',
    marginTop: 18,
    marginBottom: 12,
  },
  categoryScrollView: {
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    color: '#9A9A9A',
    marginRight: 8,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#0D253C',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  productWrapper: {
    width: '48%',
    marginBottom: 15,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  favoriteButton: {
    alignSelf: 'flex-end',
    marginBottom: 6,
    padding: 4,
  },
  productImage: {
    width: '100%',
    height: 110,
    alignSelf: 'center',
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D253C',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D253C',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  pageButton: {
    fontSize: 16,
    color: '#1AD0BC',
    marginHorizontal: 20,
    fontWeight: 'bold',
  },
  pageButtonDisabled: {
    color: '#9A9A9A',
  },
  pageInfo: {
    fontSize: 16,
    color: '#0D253C',
    fontWeight: '500',
  },
});