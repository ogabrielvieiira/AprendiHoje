import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Detalhes() {
  const params = useLocalSearchParams();
  
  const { titulo, categoria, favorito, audioUri } = params;

  const player = useAudioPlayer(audioUri as string);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        <View style={styles.headerCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{titulo}</Text>
            <Text style={styles.category}>{categoria || 'Sem categoria'}</Text>
          </View>
          
          {favorito === 'true' && (
            <Text style={styles.star}>★ Favorito</Text>
          )}
        </View>

        <View style={styles.playerBox}>
          <Text style={styles.playerTitle}>Reprodutor de Áudio</Text>
          
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={async () => {
                try {
                  await player.play();
                } catch (error) {
                  Alert.alert('Erro', 'Não foi possível reproduzir o áudio neste ambiente.');
                  console.warn(error);
                }
              }}
            >
              <Ionicons name="play" size={32} color="white" />
              <Text style={styles.buttonText}>Tocar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pauseButton}
              onPress={async () => {
                try {
                  await player.pause();
                } catch (error) {
                  Alert.alert('Erro', 'Não foi possível pausar o áudio neste ambiente.');
                  console.warn(error);
                }
              }}
            >
              <Ionicons name="pause" size={32} color="white" />
              <Text style={styles.buttonText}>Pausar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.replayButton}
            onPress={async () => {
              try {
                await player.seekTo(0);
                await player.play();
              } catch (error) {
                Alert.alert('Erro', 'Não foi possível reiniciar o áudio neste ambiente.');
                console.warn(error);
              }
            }}
          >
            <Ionicons name="refresh" size={20} color="#006d00" />
            <Text style={styles.replayText}>Reiniciar Áudio</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#f5f5f5' },
  container: { padding: 20 },
  headerCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  category: { fontSize: 16, color: '#006d00', marginTop: 5, fontWeight: '600' },
  star: { color: '#FFD700', fontSize: 16, fontWeight: 'bold' },
  infoBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  label: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 10 },
  description: { fontSize: 16, color: '#666', lineHeight: 24 },
  playerBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  playerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  controls: { flexDirection: 'row', gap: 15, width: '100%', marginBottom: 15 },
  playButton: {
    flex: 1,
    backgroundColor: '#28a745',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
    padding: 10,
  },
  replayText: { color: '#006d00', fontSize: 16, fontWeight: '600' },
});