import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import asyncStorage from '@react-native-async-storage/async-storage';
import { checkStorage, ScreenContainer, Loading, hideLoadingModal } from '../components/Shared';
import { sendData } from '../httpRequests';

export default function ProfileScreen({ navigation }: any) {
	const [isSelecting, setIsSelecting]: any = useState(false);
	const [profileImage, setProfileImage]: any = useState(require('../assets/images/profile_avatar.png'));
	const [user, setUser]: any = useState({});
	const [showLoading, setShowLoading]: any = useState(false);

	useEffect(() => {
		checkStorage('USER_LOGGED', (data: string) => {
			if (data) {
				const url = '/user/getDriverById';
				sendData(url, JSON.parse(data)).then((response: any) => {
					if (Object.keys(response).length > 0) {
						const user = response['driver'];
						if (user.img) setProfileImage({ uri: user.img });
						setUser(user);
					}
				});
			}
		});
	}, []);

	let openImagePickerAsync = async () => {
		setIsSelecting(true);
		Alert.alert(
			'Information',
			'',
			[
				{
					text: 'Take picture',
					onPress: () => setProfilePicture(1)
				},
				{
					text: 'Upload from galery',
					onPress: () => setProfilePicture(2)
				}
			],
			{ cancelable: true, onDismiss: () => setIsSelecting(false) }
		);
	};

	const setProfilePicture = async (type: number) => {
		let pickerResult: any;
		if (type == 1) {
			// 1 == Camera
			let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

			if (permissionResult.granted === false) {
				alert('Permission to access camera is required!');
				setIsSelecting(false);
				return;
			}

			pickerResult = await ImagePicker.launchCameraAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1
			});
		} else if (type == 2) {
			// 2 == Galery
			let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (permissionResult.granted === false) {
				alert('Permission to access camera roll is required!');
				setIsSelecting(false);
				return;
			}

			pickerResult = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1
			});
		}

		if (pickerResult.cancelled === true) {
			setIsSelecting(false);
			return;
		}

		setShowLoading(true);
		const resultUri = pickerResult.uri;
		let fileName = resultUri.split('/').pop();
		let match = /\.(\w+)$/.exec(fileName);
		let fileType = match ? `image/${match[1]}` : `image`;

		let formData = new FormData();
		formData.append('image', { uri: resultUri, name: fileName, fileType });

		const url = '/user/updateDriveImage/' + user.id;
		const data = formData;
		sendData(url, data).then((response) => {
			hideLoadingModal(setShowLoading, () => {
				if (Object.keys(response).length > 0) {
					setProfileImage({ uri: pickerResult.uri });
					Alert.alert('Information', 'Profile picture has been saved.');
				}

				setIsSelecting(false);
			});
		});
	};

	const logout = () => {
		asyncStorage.clear();
		navigation.reset({
			index: 0,
			routes: [{ name: 'SignIn' }]
		});
	};

	const deleteUser = ()=>{
		const url = `/user/enableDesible/${user.id}`;

		sendData(url, {}).then((response: any) => {
			if (response.ok) {
				logout();
				// const user = response['driver'];
				// if (user.img) setProfileImage({ uri: user.img });
				// setUser(user);
			}
		});
		
	}

	return (
		<ScreenContainer>
			<Loading showLoading={showLoading} />
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity
						disabled={isSelecting}
						style={{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 100 }}
						onPress={openImagePickerAsync}
					>
						<ImageBackground
							source={!!profileImage ? profileImage : null}
							style={styles.profilePicture}
							resizeMode={'cover'}
							imageStyle={{ borderRadius: 100 }}
						/>
					</TouchableOpacity>
					<View style={{ marginLeft: 15 }}>
						<Text style={styles.profileText}>{user.first_name}</Text>
						<Text style={styles.profileText}>{user.email}</Text>
					</View>
				</View>
				<View style={styles.menu}>
					{/* <Pressable
						style={styles.option}
						onPress={() => {
							console.log('hey');
						}}
					>
						<Text style={styles.optionText}>Driving License</Text>
						<AntDesign style={styles.optionIcon} name='right' size={16} />
					</Pressable>
					<Pressable
						style={styles.option}
						onPress={() => {
							console.log('hey');
						}}
					>
						<Text style={styles.optionText}>Vehicle License</Text>
						<AntDesign style={styles.optionIcon} name='right' size={16} />
					</Pressable>
					*/}
					<Pressable
						style={styles.option}
						onPress={() => {
							
								console.log('delete')
								Alert.alert(
									'Warning',
									'Do you want to delete your account?',
									[
										{
											text: 'Yes',
											onPress: () => {
												deleteUser()
											}
										},
										{
											text: 'No'
										}
									]
								)
							
						}}
					>
						<Text style={styles.optionText}>Request to delete my account</Text>
						<AntDesign style={styles.optionIcon} name='delete' size={16} color='red' />
					</Pressable> 
					<Pressable
						style={styles.option}
						onPress={() => {
							logout();
						}}
					>
						<Text style={styles.optionText}>Log Out</Text>
						<AntDesign style={styles.optionIcon} name='right' size={16} />
					</Pressable>
				</View>
				<View style={styles.footer}>
					<Text style={styles.footerText}>Terms & Conditions</Text>
					<Text style={styles.footerText}>Privacy Policy</Text>
				</View>
			</View>
		</ScreenContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1
	},
	title: {
		marginTop: 10,
		fontSize: 18,
		textAlign: 'center',
		fontWeight: '700'
	},
	header: {
		flexDirection: 'row',
		marginTop: 20,
		paddingHorizontal: 30,
		alignItems: 'center'
	},
	profilePicture: {
		height: 70,
		width: 70,
		borderRadius: 100
	},
	profileText: {
		fontSize: 16
	},
	menu: {
		marginTop: 30
	},
	option: {
		alignContent: 'center',
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		paddingHorizontal: 15,
		paddingVertical: 27,
		borderBottomColor: 'rgba(0, 0, 0,  0.1)',
		borderBottomWidth: 1
	},
	optionText: {
		fontSize: 16
	},
	optionIcon: {
		// color: 'rgba(0, 0, 0, 0.3)'
	},
	footer: {
		marginTop: 30,
		flexDirection: 'row',
		justifyContent: 'space-around'
	},
	footerText: {
		fontSize: 13
	}
});
