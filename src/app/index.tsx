import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { gravacoes as gravacoesDaStore } from '../utils/store';

type Gravacao = {
  id: string;
  titulo: string;
  categoria: string;
  descricao: string;
  favorito: boolean;
  audioUri: string;
};

const CATEGORIAS_FILTRO = ['Todas', 'Exatas', 'Humanas', 'Biológicas', 'Idiomas', 'Artes', 'Outros'];

export default function Home() {
  const [gravacoes, setGravacoes] = useState<Gravacao[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('Todas');
  
  const router = useRouter();

  const buscarGravacoes = () => {
    setCarregando(true);
    setGravacoes([...gravacoesDaStore]); 
    setCarregando(false);
  };

  const excluirGravacao = (id: string) => {
    const index = gravacoesDaStore.findIndex(item => item.id === id);
    if (index > -1) {
      gravacoesDaStore.splice(index, 1);
      buscarGravacoes(); 
    }
  };

  useFocusEffect(
    useCallback(() => {
      buscarGravacoes();
    }, [])
  );

  const gravacoesFiltradas = categoriaSelecionada === 'Todas' 
    ? gravacoes 
    : gravacoes.filter((item) => item.categoria === categoriaSelecionada);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Notas de Estudo</Text>
      <View style={styles.filtroContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filtroScroll}
        >
          {CATEGORIAS_FILTRO.map((categoria) => (
            <TouchableOpacity
              key={categoria}
              style={[
                styles.filtroButton,
                categoriaSelecionada === categoria && styles.filtroButtonAtivo
              ]}
              onPress={() => setCategoriaSelecionada(categoria)}
            >
              <Text style={[
                styles.filtroText,
                categoriaSelecionada === categoria && styles.filtroTextAtivo
              ]}>
                {categoria}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={gravacoesFiltradas} 
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma anotação encontrada para esta matéria.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push({ 
                pathname: '/detalhes', 
                params: {
                  id: item.id,
                  titulo: item.titulo,
                  categoria: item.categoria,
                  favorito: String(item.favorito), 
                  audioUri: item.audioUri
                } 
              })}
            >
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                <Text style={styles.cardCategory}>{item.categoria}</Text>
                {item.favorito ? (
                  <Text style={styles.star}>★ Favorito</Text>
                ) : null}
              </View>

              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => excluirGravacao(item.id)}
              >
                <Ionicons name="trash-outline" size={24} color="#dc3545" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/gravador')}
      >
        <Text style={styles.fabText}>+ Gravar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, marginTop: 40, color: '#333' },
  filtroContainer: { marginBottom: 20 },
  filtroScroll: { gap: 10, paddingRight: 20 },
  filtroButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filtroButtonAtivo: { backgroundColor: '#006d00' },
  filtroText: { fontSize: 14, color: '#555', fontWeight: 'bold' },
  filtroTextAtivo: { color: '#fff' },
  loader: { marginTop: 50 },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 50, fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cardCategory: { fontSize: 14, color: '#666', marginTop: 4 },
  star: { color: '#FFD700', fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  deleteButton: { padding: 10, marginLeft: 10 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#006d00',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});