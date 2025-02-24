import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import { useLoginUserMutation } from '../../../redux/auth/authApi'
import { setUser } from '../../../redux/auth/authSlice'

 
const LoginScreen=({ navigation })=> {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginUser, { isLoading }] = useLoginUserMutation()
  const dispatch = useDispatch()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password')
      return
    }

    try {
      // Log email and password
      console.log('Login attempt:', { email, password })
      
      const { user, token } = await loginUser({ email, password }).unwrap()
      dispatch(setUser({ user, token }))
      console.log('user, token,', { user, token })
      navigation.replace('Main')
    } catch (err) {
      console.error('Login error', err)
      Alert.alert('Login Failed', err.message || 'An error occurred during login')
    }
  }

  return (
    <View className="flex-1 justify-center items-center bg-base p-6">
      <View className="w-full max-w-sm">
        <Text className="text-3xl font-bold text-indigo-400 mb-8 text-center">
          Welcome Back
        </Text>
        <TextInput
          className="w-full bg-white border border-blue-300 rounded-lg px-4 py-3 mb-4 text-blue-900"
          placeholder="Email"
          placeholderTextColor="#3B82F6"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="w-full bg-white border border-blue-300 rounded-lg px-4 py-3 mb-6 text-blue-900"
          placeholder="Password"
          placeholderTextColor="#3B82F6"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          className={`w-full bg-blue-400 rounded-lg py-3 ${isLoading ? 'opacity-70' : ''}`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {isLoading ? 'Logging in...' : 'Log In'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-4">
          <Text className="text-red-500 text-center">
            Forgot Password ?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LoginScreen