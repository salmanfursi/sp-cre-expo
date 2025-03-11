import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native'
import { useDispatch } from 'react-redux'
import { useLoginUserMutation } from '../../../redux/auth/authApi'
import { setUser } from '../../../redux/auth/authSlice'
import { StatusBar } from 'expo-status-bar'
import { Image } from 'react-native'
import { Checkbox } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Feather';


const salesBgImg = require('./../../../assets/salesBgImg.jpg');
const spWeprovideSolution = require('./../../../assets/spWeprovideSolution.png');
const supportIcon = require('./../../../assets/support_icon-removebg-preview.png');

 
const LoginScreen=({ navigation })=> {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loginUser, { isLoading }] = useLoginUserMutation()
  const dispatch = useDispatch()


 	const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
	const [checked, setChecked] = useState(false);
 
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
      // navigation.replace('Main')
    } catch (err) {
      console.error('Login error', err)
      Alert.alert('Login Failed', err.message || 'An error occurred during login')
    }
  }

  return (
		<ImageBackground source={salesBgImg} className="flex-1" resizeMode="cover">
    <StatusBar style='auto' />
    <View className="flex-1 bg-opacity-50 items-center justify-center">
      {/* Login Card */}
      <View className="bg-gray-200 w-11/12 max-w-md p-6 rounded-3xl">
        {/* Logo Section */}
        <Image
          source={spWeprovideSolution} // Logo image
          className="w-full"
          resizeMode="contain"
        />

        {/* Input Fields */}
        <View className="mt-32">
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="w-full h-12 px-4 rounded-xl bg-gray-50 text-gray-800"
          />
          <View className="relative mt-4">
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword} // Show or hide password based on state
              value={password}
              onChangeText={setPassword}
              className="w-full h-12 px-4 pr-12 rounded-xl bg-gray-50 text-gray-800"
            />
            {/* Eye Button */}
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)} // Toggle password visibility
              className="absolute right-4 top-3"
            >
              <Icon
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color="#687076"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Remember Me and Forgot Password */}
        <View className="flex-row items-center justify-between mt-4">
          <View className="flex-row items-center">
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => setChecked(!checked)}
              color="#0a7ea4"
            />
            <Text className="text-sm text-black font-extrabold">
              Remember me
            </Text>
          </View>
          <TouchableOpacity>
            <Text className="text-sm text-black font-extrabold">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-blue-500 w-full h-14 rounded-full flex items-center justify-center my-6"
        >
          <Text className="text-white text-2xl font-extrabold">
            {isLoading ? 'Logging in...' : 'Log In'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer Text */}
      <Text className="text-xs text-black mt-3 text-center px-12">
        © Solution Provider reserve all rights to this app under copyright
        law.
      </Text>
    </View>

    {/* Support Section */}
    <View className="flex-row items-center justify-end">
      <View className="flex-row items-center justify-center bg-gray-200 px-2 py-1 rounded-2xl gap-2 mr-4 mb-14">
        <Image
          source={supportIcon} // Support icon
          className="w-5 h-5"
          resizeMode="contain"
        />
        <Text className="text-blue-500 font-bold">01949654499</Text>
      </View>
    </View>
  </ImageBackground>
  )
}

export default LoginScreen





