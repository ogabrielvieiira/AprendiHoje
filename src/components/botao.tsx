import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

type ButtonCustomProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'success' | 'danger' | 'secondary';
};

export default function Botao({ title, onPress, loading = false, disabled = false, variant = 'success' }: ButtonCustomProps) {
  
  const getBackgroundColor = () => {
    if (disabled || loading) return '#6c757d';
    if (variant === 'danger') return '#dc3545';
    if (variant === 'secondary') return '#6c757d';
    return '#28a745';
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: getBackgroundColor() }]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    width: '100%',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});