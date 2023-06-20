import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Formik } from 'formik';
import asyncStorage from '@react-native-async-storage/async-storage';
import { checkStorage, ScreenContainer } from '../components/Shared';
import { sendData } from '../httpRequests';
import Toast from 'react-native-root-toast';
import * as Notifications from 'expo-notifications';
import registerForPushNotificationsAsync from '../helper/TokenDevice';
// import useRef from 'react';

// Notifications.setNotificationHandler({
// 	handleNotification: async () => ({
// 		shouldShowAlert: true,
// 		shouldPlaySound: true,
// 		shouldSetBadge: true,
// 		allowBadge: true,
// 	}),
// });





export default function SignInScreen({ navigation }: any) {
	const [passwordIcon, setPasswordIcon]: any = useState('eye-slash');
	const [passwordIconStatus, setPasswordIconStatus]: any = useState(true);
	const [notification, setNotification]: any = useState(null);
	const notificationListener = useRef<any>();
	const responseListener = useRef<any>();

	useEffect(() => {
		checkStorage('USER_LOGGED', (data: any) => {
			if (data) navigateToHome();
		});
		buscartoken()
	}, []);



	const buscartoken = async () => {
		let token: any = await registerForPushNotificationsAsync()

		await setNotification(token)
		// await setNotification2(token)
		if (token) {
			asyncStorage.setItem('TOKEN', token);
			// console.log(token)
		}

		notificationListener.current = Notifications.addNotificationReceivedListener(notification => {

			setNotification(notification);
		});

		responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {

		});

		return () => {
			Notifications.removeNotificationSubscription(notificationListener.current);
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}

	const togglePassword = () => {
		if (passwordIcon == 'eye-slash') {
			setPasswordIcon('eye');
			setPasswordIconStatus(false);
		} else {
			setPasswordIcon('eye-slash');
			setPasswordIconStatus(true);
		}
	};

	const login = (values: { email: string; password: string }) => {
		const url = '/auth/loginDriver';
		console.log(values)
		sendData(url, values)
			.then((response: any) => {
				if (response.ok) {
					const driver = response['user'];
					const data = {
						driver_id: driver.id,
						pharmacy_id: driver.pharmacy_id,
						zip_code: driver.zip_code

					};
					asyncStorage.setItem('USER_LOGGED', JSON.stringify(data));
					navigateToHome();
				} else {
					showErrorToast(response.message)
					console.log(response.message)
				};
			})
			// .catch((error) => {
			// 	showErrorToast('Error connecting with server, please try again later.');
			// 	console.log(error);
			// });
	};

	const showErrorToast = (message: string) => {
		Toast.show(message, {
			duration: Toast.durations.LONG,
			containerStyle: { backgroundColor: 'red', width: '80%' }
		});
	};

	const navigateToHome = () => {
		navigation.reset({
			index: 0,
			routes: [{ name: 'Root', screen: 'Home' }]
		});
	};

	return (
		<ScreenContainer style={{ backgroundColor: '#fff'}}>
			<View style={styles.header}>
				<Image style={styles.logo} source={require('../assets/images/buena2.png')} />
			</View>
			<View style={styles.body}>
				<Text style={styles.title}>Login</Text>
				<Formik initialValues={{ email: '', password: '' }} onSubmit={login}>
					{({ handleChange, handleBlur, handleSubmit, values }:any) => (
						<>
							<Text style={styles.labelInput}>Email</Text>
							<TextInput
								style={styles.textInput}
								onChangeText={handleChange('email')}
								onBlur={handleBlur('email')}
								value={values.email}
								keyboardType='email-address'
								autoCapitalize={'none'}
							/>
							<Text style={styles.labelInput}>Password</Text>
							<View style={styles.formInputIcon}>
								<TextInput
									style={[styles.textInput, { zIndex: 1 }]}
									onChangeText={handleChange('password')}
									onBlur={handleBlur('password')}
									value={values.password}
									secureTextEntry={passwordIconStatus}
								/>
								<FontAwesome
									 style={ passwordIconStatus ? styles.inputIcon2:styles.inputIcon1 }
									name={passwordIcon}
									size={16}
									onPress={() => togglePassword()}
								/>
							</View>
							{/* <Text style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
								Forgot Password?
							</Text> */}
							<TouchableOpacity style={styles.loginButton} onPress={() => handleSubmit()}>
								<Text style={styles.loginButtonText}>Login</Text>
							</TouchableOpacity>

							<View style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								marginTop: 20
							}}>
								<Text style={styles.registerText}>
									Don't have an account?
								</Text>
								<Text style={styles.registerLink} onPress={() => navigation.navigate('SignUpScreen')}>
									Sign Up
								</Text>
							</View>
						</>
					)}
				</Formik>
			</View>
		</ScreenContainer>
	);
}

const styles = StyleSheet.create({
	header: {
		height: 80,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	logo: {
		height: 80,
		width: 100,
		resizeMode: 'contain',
	},
	body: {
		padding: 20
	},
	title: {
		fontSize: 36,
		fontWeight: '300',
		marginVertical: 15,
		marginBottom: 30
	},
	labelInput: {
		fontSize: 15,
		color: '#8B8B97',
		marginTop: 20
	},
	textInput: {
		height: 50,
		width: '100%',
		backgroundColor: '#F7F7F7',
		paddingRight: 35,
		paddingLeft: 20,
		borderRadius: 5,
		marginVertical: 10
	},
	formInputIcon: {
		position: 'relative',
		flexDirection: 'row'
	},
	inputIcon: {
		position: 'absolute',
		right: 15,
		top: '40%',
		zIndex: 2
	},
	inputIcon1: {
        position: 'absolute',
        right: 15,
        top: '40%',
        zIndex: 2,
        color:"#60941A"
    },
    inputIcon2: {
        position: 'absolute',
        right: 15,
        top: '40%',
        zIndex: 2,
        color:"#E6241B"
       
    },
	forgotPassword: {
		textAlign: 'right',
		marginVertical: 10
	},
	loginButton: {
		width: '100%',
		height: 50,
		backgroundColor: '#60941A',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
		marginVertical: 30
	},
	loginButtonText: {
		color: '#ffffff',
		fontSize: 18,
		fontWeight:'700'
	},
	registerText: {
		textAlign: 'center',
		fontSize: 14
	},
	registerLink: {
		padding: 5,
		color: '#60941A'
	}
});
