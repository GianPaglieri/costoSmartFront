import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../views/homeScreen';
import IngredientListScreen from '../views/IngredientListScreen';
import TortasScreen from '../views/TortasScreen';
import NewIngredientScreen from '../views/NewIngredientScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const IngredientStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="IngredientList"
      component={IngredientListScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="NewIngredient"
      component={NewIngredientScreen}
      options={{ title: 'Nuevo Ingrediente' }}
    />
  </Stack.Navigator>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      
      initialRouteName="Login"
    >
      <Tab.Screen
        name="IngredientStack"
        component={IngredientStack}
        options={{
          tabBarLabel: 'Ingredientes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tortas"
        component={TortasScreen}
        options={{
          tabBarLabel: 'Tortas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cake" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;












