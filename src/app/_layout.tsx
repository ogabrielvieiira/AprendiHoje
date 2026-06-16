import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#006d00', 
          tabBarInactiveTintColor: '#8e8e93', 
          headerStyle: {
            backgroundColor: '#006d00',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: 'Meus Estudos',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            ),
          }} 
        />
        
        <Tabs.Screen 
          name="gravador" 
          options={{ 
            title: 'Gravar',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="mic-circle" size={size + 4} color={color} />
            ),
          }} 
        />
        
        <Tabs.Screen 
          name="formulario" 
          options={{ 
            title: 'Salvar Gravação',
            href: null, 
          }} 
        />

        <Tabs.Screen 
          name="detalhes" 
          options={{ 
            title: 'Detalhes do Áudio',
            href: null,
          }} 
        />
      </Tabs>
    </>
  );
}