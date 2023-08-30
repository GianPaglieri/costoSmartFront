import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import styles from '../styles/styles';
import HomeScreen from '../views/homeScreen';
import IngredientListScreen from '../views/IngredientListScreen';
import TortasScreen from '../views/TortasScreen';
import RecetaScreen from '../views/RecetaScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  const [isExpanded, setExpanded] = useState(false);
  const navigation = useNavigation();

  const sidebarWidth = isExpanded ? 250 : 60;
  const arrowIcon = isExpanded ? 'chevron-left' : 'chevron-right';

  const toggleMenu = () => {
    setExpanded(!isExpanded);
  };

  const handleDashboardClick = () => {
    navigation.navigate('Home');
  };
  const handleIngredientesClick = () => {
    navigation.navigate('IngredientListScreen');
  };

  const handleTortasClick = () => {
    navigation.navigate('TortasScreen');
  };
  const handleRecetaClick = () => {
    navigation.navigate('RecetaScreen');
  };

  return (
    <View style={styles.containerNav}>
      <TouchableOpacity
        style={[styles.sidebar, { width: sidebarWidth }]}
        onPress={toggleMenu}
        activeOpacity={0.7}
      >
        <View style={styles.expandButton}>
          <Ionicons
            name={arrowIcon}
            size={24}
            color="white"
            style={styles.expandIcon}
          />
        </View>
        <Text style={[styles.logo, isExpanded ? {} : styles.hiddenText]}>
          @CostoSmart
        </Text>

        {isExpanded && (
          <View style={styles.menuItems}>
            <TouchableOpacity onPress={handleDashboardClick}>
              <Text style={styles.menuItem}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleIngredientesClick}>
              <Text style={styles.menuItem}>Ingredientes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleTortasClick}>
              <Text style={styles.menuItem}>Tortas</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRecetaClick}>
              <Text style={styles.menuItem}>Recetas</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Cuenta clicked')}>
              <Text style={styles.menuItem}>Cuenta</Text>
            </TouchableOpacity>
          </View>
        )}
        <View
          style={[styles.separator, isExpanded ? null : styles.hiddenSeparator]}
        />
        {isExpanded && (
          <View style={styles.bottomMenu}>
            <TouchableOpacity onPress={() => console.log('Settings clicked')}>
              <Text style={styles.bottomMenuItem}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Ayuda clicked')}>
              <Text style={styles.bottomMenuItem}>Ayuda</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Contactanos clicked')}>
              <Text style={styles.bottomMenuItem}>Contactanos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Cerrar Sesion clicked')}>
              <Text style={styles.bottomMenuItem}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
      <View style={styles.content}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="IngredientListScreen"
            component={IngredientListScreen}
            options={{
              title: 'Ingredientes',
            }}
          />
          <Stack.Screen
            name="TortasScreen"
            component={TortasScreen}
            options={{
              title: 'Tortas',
            }}
          />
          <Stack.Screen
            name="RecetaScreen"
            component={RecetaScreen}
            options={{
              title: 'Receta',
            }}
          />
        </Stack.Navigator>
      </View>
    </View>
  );
};

export default Navigation;






















































