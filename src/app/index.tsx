import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../utils/api';
import Card from '../components/card';

type Gravacao = {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  importante: boolean;
  audioUri: string;
};

const CATEGORIAS_FILTRO = ['Todas', 'Exatas', 'Humanas', 'Biológicas', 'Idiomas', 'Artes', 'Outros'];

export default function Home() {
  const [gravacoes, setGravacoes] = useState<Gravacao[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('Todas');
  
  const router = useRouter();

  const buscarGravacoes = async () => {
    try {
      setCarregando(true);
      const response = await api.get('/anotacoes');
      setGravacoes(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as suas anotações.');
    } finally {
      setCarregando(false);
    }
  };

  const excluirGravacao = async (id: string) => {
    try {
      await api.delete(`/anotacoes/${id}`);
      Alert.alert('Sucesso', 'Anotação excluída.');
      buscarGravacoes();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a anotação.');
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
        <ActivityIndicator size="large" color="#006d00" style={styles.loader} />
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
            <Card
              titulo={item.titulo}
              categoria={item.categoria}
              importante={item.importante}
              onPress={() => router.push({ 
                pathname: '/detalhes', 
                params: {
                  id: item.id,
                  titulo: item.titulo,
                  descricao: item.descricao,
                  categoria: item.categoria,
                  importante: String(item.importante),
                  audioUri: item.audioUri
                } 
              })}
              onDelete={() => excluirGravacao(item.id)}
            />
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