import { Ionicons } from '@expo/vector-icons';
import {
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioPlayer,
    useAudioRecorder,
    useAudioRecorderState
} from 'expo-audio';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Gravador() {
    const router = useRouter();
    
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const recorderState = useAudioRecorderState(audioRecorder);
    const player = useAudioPlayer(audioRecorder.uri);

    const record = async () => {
        try {
            await audioRecorder.prepareToRecordAsync();
            audioRecorder.record();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
        }
    };

    const stopRecording = async () => {
        try {
            await audioRecorder.stop();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível parar a gravação.');
        }
    };

    const verificarPermissao = async () => {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
            Alert.alert('Atenção', 'A permissão para acessar o microfone foi negada. O app precisa dela para gravar.');
        }

        await setAudioModeAsync({
            playsInSilentMode: true,
            allowsRecording: true,
        });
    }

    useEffect(() => {
        verificarPermissao();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nova Gravação</Text>
            <Text style={styles.subtitle}>Clique no botão abaixo para gravar sua anotação de estudo.</Text>

            <View style={styles.recordBox}>
                <TouchableOpacity 
                    style={[styles.recordButton, recorderState.isRecording ? styles.recording : null]}
                    onPress={recorderState.isRecording ? stopRecording : record}
                >
                    <Ionicons 
                        name={recorderState.isRecording ? "stop" : "mic"} 
                        size={48} 
                        color="white" 
                    />
                </TouchableOpacity>
                <Text style={styles.statusText}>
                    {recorderState.isRecording ? 'Gravando agora...' : 'Toque para Gravar'}
                </Text>
            </View>

            {audioRecorder.uri && !recorderState.isRecording && (
                <View style={styles.playbackBox}>
                    <Text style={styles.successText}>Áudio capturado com sucesso!</Text>
                    
                    <View style={styles.actionButtons}>
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
                            <Ionicons name="play" size={24} color="white" />
                            <Text style={styles.buttonText}>Ouvir Áudio</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.nextButton} 
                            onPress={() => router.push({ pathname: '/formulario', params: { uri: audioRecorder.uri } })}
                        >
                            <Text style={styles.buttonText}>Avançar</Text>
                            <Ionicons name="arrow-forward" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5', 
        padding: 20, 
        alignItems: 'center',
        justifyContent: 'center' 
    },
    title: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        color: '#333',
        marginBottom: 10 
    },
    subtitle: { 
        fontSize: 16, 
        color: '#666', 
        textAlign: 'center', 
        marginBottom: 50,
        paddingHorizontal: 20
    },
    recordBox: { 
        alignItems: 'center', 
        marginBottom: 40 
    },
    recordButton: {
        backgroundColor: '#006d00',
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    recording: { 
        backgroundColor: '#dc3545' 
    },
    statusText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: '600',
        color: '#444'
    },
    playbackBox: { 
        backgroundColor: '#fff', 
        padding: 20, 
        borderRadius: 15, 
        elevation: 3,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    successText: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: '#28a745', 
        marginBottom: 20 
    },
    actionButtons: {
        flexDirection: 'column',
        width: '100%',
        gap: 15
    },
    playButton: {
        backgroundColor: '#6c757d',
        flexDirection: 'row',
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    nextButton: {
        backgroundColor: '#28a745',
        flexDirection: 'row',
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    buttonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
});