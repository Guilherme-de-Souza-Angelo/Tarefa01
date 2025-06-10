import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Pressable
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator,
         DrawerContentScrollView,
         DrawerItemList,
         DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons'; // Import icons

// Firebase imports (replace with your config)
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Custom hook to fetch data from API
function useFetchPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading };
}

// Login/Register Screen
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuthAction = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        // Register
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          // Add other user data here
        });

        Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
      } else {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
      }

      // Navigate to Main App drawer after login/register
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainDrawer' }],
      });
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.loginTitle}>
          {isRegistering ? 'Criar Conta' : 'Bem-vindo'}
        </Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Senha"
          style={styles.input}
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginVertical: 16 }} />
        ) : (
          <Pressable style={styles.loginButton} onPress={handleAuthAction}>
            <Text style={styles.loginButtonText}>
              {isRegistering ? 'Criar Conta' : 'Entrar'}
            </Text>
          </Pressable>
        )}
        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
          <Text style={styles.switchButtonText}>
            {isRegistering
              ? 'Já tem uma conta? Entrar'
              : 'Não tem uma conta? Criar conta'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Dashboard Screen (Main)
function DashboardScreen({ navigation }) {
  const { posts, loading } = useFetchPosts();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Details', { item })}
              activeOpacity={0.7}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text numberOfLines={1} style={styles.cardDescription}>
                {item.body}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

// Details Screen
function DetailsScreen({ route }) {
  const { item } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Detalhes</Text>
      <View style={styles.card}>
        <Text style={[styles.cardTitle, { fontSize: 24 }]}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.body}</Text>
      </View>
    </SafeAreaView>
  );
}

// Profile/Settings Screen
function ProfileScreen({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Navigate back to Login screen and reset navigation stack
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Perfil</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />
      ) : userProfile ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Email: {userProfile.email}</Text>
          {/* Display other profile information here */}
        </View>
      ) : (
        <Text>Erro ao carregar o perfil.</Text>
      )}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </Pressable>
    </SafeAreaView>
  );
}

// Stack Navigator inside drawer
const Stack = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: '#222',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 24,
        },
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={({ route }) => ({ title: route.params.item.title })}
      />
    </Stack.Navigator>
  );
}

// Drawer Navigator
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{paddingTop: 0}}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Minha App</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: false,
        drawerActiveTintColor: '#000',
        drawerLabelStyle: {fontWeight: '600', fontSize: 16},
        drawerIcon: ({ focused, color, size }) => {
          let iconName;
          const route = props.state.routeNames[props.state.index];

          if (route === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Drawer.Screen
        name="Home"
        component={MainStack}
        options={{
          drawerLabel: 'Início',
        }}
      />
      <Drawer.Screen name="Perfil" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

// Root Stack to toggle Login and MainDrawer
function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainDrawer" component={MainDrawer} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111',
    marginBottom: 20,
  },
  loginBox: {
    marginTop: 80,
    marginHorizontal: 16,
    backgroundColor: '#f9f9f9',
    padding: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  loginTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#111',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    color: '#111',
  },
  loginButton: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  card: {
    backgroundColor: '#fefefe',
    borderRadius: 12,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 16,
    color: '#6b7280',
  },
  drawerHeader: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: '#f3f4f6',
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  switchButtonText: {
    marginTop: 16,
    color: '#4b5563',
    textAlign: 'center',
  },
});
