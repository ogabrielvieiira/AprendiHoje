import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { gravacoes } from '../utils/store';

type FormData = {
  titulo: string;
  categoria: string;
  favorito: boolean;
};

const CATEGORIAS = ['Exatas', 'Humanas', 'Biológicas', 'Idiomas', 'Artes', 'Outros'];

export default function Formulario() {
  const router = useRouter();
  const { uri } = useLocalSearchParams();

  const [salvando, setSalvando] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      titulo: '',
      categoria: 'Outros',
      favorito: false,
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setSalvando(true);

      const novaAnotacao = {
        id: Math.random().toString(36).substring(7),
        titulo: data.titulo,
        categoria: data.categoria,
        favorito: data.favorito,
        audioUri: uri,
      };

      gravacoes.push(novaAnotacao);

      Alert.alert('Sucesso!', 'Nota salva temporariamente.');
      router.replace('/');

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a anotação.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Salvar Anotação</Text>
        <Text style={styles.subtitle}>Defina o título e a matéria do seu áudio.</Text>

        <Text style={styles.label}>Tópico / Título *</Text>
        <Controller
          control={control}
          rules={{ required: 'O título é obrigatório.' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.titulo && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Ex: Resumo Revolução Francesa"
            />
          )}
          name="titulo"
        />
        {errors.titulo && <Text style={styles.errorText}>{errors.titulo.message}</Text>}

        <Text style={styles.label}>Matéria / Categoria</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.categoriesContainer}>
              {CATEGORIAS.map((cat) => {
                const isSelected = value === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => onChange(cat)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          name="categoria"
        />

        <View style={styles.switchContainer}>
          <Text style={styles.labelSwitch}>Marcar como Importante</Text>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Switch
                onValueChange={onChange}
                value={value}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={value ? '#006d00' : '#f4f3f4'}
              />
            )}
            name="favorito"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, salvando && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Salvar Áudio</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#f5f5f5' },
  container: { padding: 20, paddingBottom: 40, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 20, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  label: { fontSize: 16, marginBottom: 10, fontWeight: 'bold', color: '#444' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  inputError: { borderColor: '#dc3545', borderWidth: 2 },
  errorText: { color: '#dc3545', marginBottom: 15, marginTop: -15, fontWeight: 'bold' },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 25,
  },
  chip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  chipSelected: {
    backgroundColor: '#006d00',
    borderColor: '#006d00',
  },
  chipText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  labelSwitch: { fontSize: 16, fontWeight: 'bold', color: '#444' },
  button: {
    backgroundColor: '#28a745',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonDisabled: { backgroundColor: '#6c757d' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});