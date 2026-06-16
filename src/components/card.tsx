import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type NotaCardProps = {
  titulo: string;
  categoria: string;
  importante: boolean;
  onPress: () => void;
  onDelete: () => void;
};

export default function Card({ titulo, categoria, importante, onPress, onDelete }: NotaCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{titulo}</Text>
        <Text style={styles.cardCategory}>{categoria}</Text>
        {importante ? <Text style={styles.star}>★ Importante</Text> : null}
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash-outline" size={24} color="#dc3545" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});