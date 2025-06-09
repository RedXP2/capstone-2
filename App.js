import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { ThemeProvider, useTheme } from './srccontext/ThemeContext';
import ThemedHeader from './srccomponents/ThemedHeader';
import ErrorBoundary from './srccomponents/ErrorBoundary';
// Import screens
import HomeScreen from './srcscreens/HomeScreen';
import AddEntryScreen from './srcscreens/AddEntryScreen';
import ProfileScreen from './srcscreens/ProfileScreen';
import LoginScreen from './srcscreens/LoginScreen';
import RegisterScreen from './srcscreens/RegisterScreen';
import EntryDetailScreen from './srcscreens/EntryDetailScreen';
import EditEntryScreen from './srcscreens/EditEntryScreen';
import SettingsScreen from './srcscreens/SettingsScreen';
import AboutScreen from './srcscreens/AboutScreen';
import HelpSupportScreen from './srcscreens/HelpSupportScreen';
import EditProfileScreen from './srcscreens/EditProfileScreen';

// Import stores
import { useAuthStore } from './srcstore/authStore';
import { useMuscleStore } from './srcstore/muscleStore';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
        tabBarPosition="bottom"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: { 
            height: 70,
            backgroundColor: theme.card,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          tabBarLabelStyle: { 
            fontSize: 12,
            fontWeight: 'bold',
            marginTop: 0,
          },
          tabBarItemStyle: {
            paddingVertical: 5,
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.primary,
            height: 3,
          },
          swipeEnabled: true,
          animationEnabled: true,
          lazy: true,
          lazyPlaceholder: () => null,
          tabBarPressColor: `${theme.primary}20`,
          tabBarPressOpacity: 0.8,
          animationDuration: 250,
          tabBarBounces: false,
          showLabel: true,
          showIcon: true,
          freezeOnBlur: true,
          detachInactiveScreens: false,
          tabBarIcon: ({ focused, color }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Add') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'About') {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            } else if (route.name === 'Help') {
              iconName = focused ? 'help-circle' : 'help-circle-outline';
            }

            return (
              <View style={{ 
                backgroundColor: focused ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                padding: 8,
                borderRadius: 20,
              }}>
                <Ionicons name={iconName} size={24} color={color} />
              </View>
            );
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'Recovery'
          }}
        />
        <Tab.Screen 
          name="Add" 
          component={AddEntryScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'Add Entry'
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'Profile'
          }}
        />
      </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        animationDuration: 300,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyle: { backgroundColor: 'transparent' },
        cardOverlayEnabled: true,
        cardStyleInterpolator: ({ current: { progress }, closing, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: closing ? [-layouts.screen.width, 0] : [layouts.screen.width, 0],
                }),
              },
            ],
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
          },
        }),
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="EntryDetail" 
        component={EntryDetailScreen} 
        options={({ navigation }) => ({
          header: () => <ThemedHeader title="Muscle Details" navigation={navigation} />
        })}
      />
      <Stack.Screen 
        name="EditEntry" 
        component={EditEntryScreen} 
        options={({ navigation }) => ({
          header: () => <ThemedHeader title="Edit Muscle Entry" navigation={navigation} />
        })}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={({ navigation }) => ({
          header: () => <ThemedHeader title="Settings" navigation={navigation} />
        })}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={({ navigation }) => ({
          header: () => <ThemedHeader title="Edit Profile" navigation={navigation} />
        })}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen} 
        options={({ navigation }) => ({
          header: () => <ThemedHeader title="About" navigation={navigation} />
        })}
      />
      <Stack.Screen 
        name="Help" 
        component={HelpSupportScreen} 
        options={({ navigation }) => ({
          header: () => <ThemedHeader title="Help & Support" navigation={navigation} />
        })}
      />
    </Stack.Navigator>
  );
}

/**
 * Main App component with error boundary and theme provider
 * @returns {React.Component} App component
 */
export default function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { loadEntries } = useMuscleStore();
  const [appIsReady, setAppIsReady] = useState(false);
  
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make API calls, etc.
        await checkAuth();
        if (isAuthenticated) {
          await loadEntries();
        }
      } catch (e) {
        console.warn('App initialization error:', e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // Load entries when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      loadEntries();
    }
  }, [isAuthenticated]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <ErrorBoundary onReset={() => setAppIsReady(false)}>
        <AppContent isAuthenticated={isAuthenticated} />
      </ErrorBoundary>
    </ThemeProvider>
  );
};

/**
 * App content component that handles navigation based on authentication state
 * @param {Object} props - Component props
 * @param {boolean} props.isAuthenticated - Authentication status
 * @returns {React.Component} App content component
 */
const AppContent = ({ isAuthenticated }) => {
  const { theme, isDarkMode } = useTheme();
  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <NavigationContainer>
          {isAuthenticated ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

AppContent.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};
