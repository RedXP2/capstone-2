import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { useAuthStore } from '../srcstore/authStore';
import { useTheme } from '../srccontext/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuthStore();
  const { theme } = useTheme();
  
  const hasMinLength = (pass) => pass.length >= 8;
  const hasUpperCase = (pass) => /[A-Z]/.test(pass);
  const hasLowerCase = (pass) => /[a-z]/.test(pass);
  const hasNumber = (pass) => /[0-9]/.test(pass);
  const hasSpecialChar = (pass) => /[!@#$%^&*(),.?":{}|<>]/.test(pass);
  
  const validatePassword = (pass) => {
    return hasMinLength(pass) && hasUpperCase(pass) && hasLowerCase(pass) && hasNumber(pass) && hasSpecialChar(pass);
  };
  
  const handleRegister = async () => {
    setErrorMessage('');
    
    if (!name) {
      setErrorMessage('Please enter your name');
      return;
    }
    
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    if (!password) {
      setErrorMessage('Please enter a password');
      return;
    }
    
    if (!validatePassword(password)) {
      setErrorMessage('Password does not meet the requirements');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await register(name, email, password);
      
      if (!result.success) {
        // Format error message for better readability
        let errorMsg = result.error || 'Registration failed. Please try again.';
        
        if (errorMsg.includes('auth/email-already-in-use')) {
          errorMsg = 'This email is already registered. Please use a different email or login.';
        } else if (errorMsg.includes('auth/invalid-email')) {
          errorMsg = 'Invalid email format. Please enter a valid email address.';
        } else if (errorMsg.includes('auth/weak-password')) {
          errorMsg = 'Password is too weak. Please use a stronger password.';
        }
        
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: theme.primary }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Join the muscle recovery community</Text>
          
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, { 
              borderColor: errorMessage && !name ? '#F44336' : theme.border,
              backgroundColor: theme.inputBackground
            }]}>
              <Ionicons name="person-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Full Name"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>
            
            <View style={[styles.inputWrapper, { 
              borderColor: errorMessage && !email ? '#F44336' : theme.border,
              backgroundColor: theme.inputBackground
            }]}>
              <Ionicons name="mail-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Email"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={[styles.inputWrapper, { 
              borderColor: errorMessage && (!password || !validatePassword(password)) ? '#F44336' : theme.border,
              backgroundColor: theme.inputBackground
            }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons 
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.inputWrapper, { 
              borderColor: errorMessage && password !== confirmPassword ? '#F44336' : theme.border,
              backgroundColor: theme.inputBackground
            }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Confirm Password"
                placeholderTextColor={theme.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Ionicons 
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                  size={20} 
                  color={theme.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.passwordRequirements}>
            <Text style={[styles.requirementsTitle, { color: theme.text }]}>Password Requirements:</Text>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={hasMinLength(password) ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={hasMinLength(password) ? theme.primary : theme.textSecondary} 
              />
              <Text style={[styles.requirementText, { 
                color: hasMinLength(password) ? theme.primary : theme.textSecondary 
              }]}>
                At least 8 characters
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={hasUpperCase(password) ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={hasUpperCase(password) ? theme.primary : theme.textSecondary} 
              />
              <Text style={[styles.requirementText, { 
                color: hasUpperCase(password) ? theme.primary : theme.textSecondary 
              }]}>
                At least one uppercase letter
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={hasLowerCase(password) ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={hasLowerCase(password) ? theme.primary : theme.textSecondary} 
              />
              <Text style={[styles.requirementText, { 
                color: hasLowerCase(password) ? theme.primary : theme.textSecondary 
              }]}>
                At least one lowercase letter
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={hasNumber(password) ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={hasNumber(password) ? theme.primary : theme.textSecondary} 
              />
              <Text style={[styles.requirementText, { 
                color: hasNumber(password) ? theme.primary : theme.textSecondary 
              }]}>
                At least one number
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={hasSpecialChar(password) ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={hasSpecialChar(password) ? theme.primary : theme.textSecondary} 
              />
              <Text style={[styles.requirementText, { 
                color: hasSpecialChar(password) ? theme.primary : theme.textSecondary 
              }]}>
                At least one special character (!@#$%^&*...)
              </Text>
            </View>
          </View>
          
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color="#F44336" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Creating Account...' : 'Register'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.linkText, { color: theme.primary }]}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  inputIcon: {
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 15,
  },
  passwordRequirements: {
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  requirementText: {
    fontSize: 14,
    marginLeft: 5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  errorText: {
    color: '#F44336',
    marginLeft: 5,
    fontSize: 14,
    flex: 1,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: '#4CAF50',
    fontSize: 16,
  },
});

export default RegisterScreen;