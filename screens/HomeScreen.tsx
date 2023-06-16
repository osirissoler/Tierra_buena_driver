import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList, Alert, Image, Modal, TextInput, } from 'react-native';
// import { collection, Firestore, onSnapshot, query, where } from '@firebase/firestore';
import { checkStorage, ScreenContainer } from '../components/Shared';
import { Context } from '../Context';
import { fetchData, sendData } from '../httpRequests';
// import { db } from '../firebase';
// import { firebase } from '../firebase';
// import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo'
import { object } from 'yup';
import RNPickerSelect from 'react-native-picker-select';
import ModalDropdown from 'react-native-modal-dropdown';
import { MaterialCommunityIcons } from '@expo/vector-icons';


Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
		allowBadge: true,
	}),
});

export default function HomeScreen({ navigation }: any) {
	const { onlineStatus, changeStatus } = React.useContext(Context);
	const [driver, setDriver]: any = useState({});
	const [driver_id, setDriverId]: any = useState(null);
	const [orders, setOrders]: any = useState([]);
	const [acceptedOrders, setAcceptedOrders]: any = useState([]);
	const [pharmacy, setPharmacy]: any = useState({});
	const [pharmacyId, setPharmacyId]: any = useState(null);
	const [isFetching, setIsFetching]: any = useState(false);
	const [expoPushToken, setExpoPushToken]: any = useState('');
	const [user, setUser]: any = useState({});
	const [pharmacies, setPharmacies]: any = useState([
	]);
	const [showFilterModal, setShowFilterModal]: any = useState(false);
	const [placeholder, setPlaceholder]: any = useState({
		label: 'Select pharmacy',
		value: 0,
		color: '#128780',
	});
	const [selectValue, setSelectValue]: any = useState(0);
	const [zip, setZip]: any = useState("");
	const [selectName, serSelectName]: any = useState("Select Pharmacies");




	useEffect(() => {
		navigation.addListener('focus', () => {
			onRefresh();
		});

		return () => {
			// setDriver({});
			setOrders([]);
			setPharmacy({});
		};
	}, []);

	useEffect(() => {
		if (onlineStatus) {
			setIsFetching(true)
			loadDriver()
			// saveDriveFirebase()
		}

	}, [onlineStatus])
	useEffect(() => {

		if (pharmacyId != null) {
			// checkNewOrders();
		}
		if (pharmacyId != null) {
			// checkNewOrdersAdmin()
		}


	}, [pharmacyId])
	// 

	// buscamos la info del driver
	const loadDriver = () => {
		checkStorage('USER_LOGGED', (data: any) => {
			const url = '/user/getDriverById';
			sendData(url, JSON.parse(data)).then((response: any) => {
				if (Object.keys(response).length > 0) {
					const driver = response['driver'];
					// setDriver(driver);
					changeStatus(driver.active);

					if (driver.active) {
						loadOderDriver()
					}
					// loadPharmacy(driver);
				}
			});
		});
	};

	const getDriverOrderPharmacy = async (data: any) => {
		let url = `/orders/getDriverOrder/${data.pharmacy_id}`
		fetchData(url).then(async (res) => {
			const order = res['order']
			await setOrders(order);
			setIsFetching(false)
		})
	}

	const loadOderDriver = () => {
		checkStorage('USER_LOGGED', async (data: any) => {
			setIsFetching(true)
			const info = JSON.parse(data)
			setDriver(info)
			setPharmacyId(info.pharmacy_id)
			setDriverId(info.driver_id)

			if (info.zip_code == 'admin') {
				console.log(info)
				getDriverOrderAdmin(info)
				setZip('admin')
			} else {
				getDriverOrderPharmacy(info)
			}

			if (info.pharmacy_id != null) {
				setPharmacyId(info.pharmacy_id)
			}
			if (info.driver_id != null) {
				setDriverId(info.driver_id)
			}
		})

	}

	// const saveDriveFirebase = async () => {
	// 	let farmacysInFirebase: any[] = [];
	// 	const getList = await firebase.firestore().collection('driveActive').get()
	// 	getList.forEach(snapHijo => {
	// 		farmacysInFirebase.push({
	// 			id: snapHijo.id,
	// 			...snapHijo.data()
	// 		})
	// 	})
	// 	checkStorage('USER_LOGGED', async (data: any) => {
	// 		const info = JSON.parse(data)
	// 		if (farmacysInFirebase.length <= 0) {
	// 			const dbRef = firebase.firestore().collection('driveActive');
	// 			dbRef.add({ ...info, status: true });
	// 		} else {
	// 			const idFiltered = farmacysInFirebase.filter(e => {
	// 				return e.driver_id == info.driver_id
	// 			})
	// 			if (idFiltered.length != 0) {

	// 				const id = idFiltered[0].id
	// 				delete idFiltered[0].id
	// 				idFiltered[0].status = !idFiltered[0].status
	// 				firebase.firestore().doc(`/driveActive/${id}`).update({ ...idFiltered[0] });
	// 			} else {

	// 				const dbRef = firebase.firestore().collection('driveActive');
	// 				dbRef.add({ ...info, status: true });
	// 			}

	// 		}

	// 	})
	// }
	// verificar las ordernes nueva en tiempo real
	// const checkNewOrders = () => {

	// 	const q = query(collection(db, 'orders'), where('order_status', '==', 3), where('farmacy_id', '==', pharmacyId));
	// 	onSnapshot(q, (querySnapshot) => {

	// 		if (!(querySnapshot.docChanges().length == 0)) {
	// 			checkStorage('USER_LOGGED', async (data: any) => {
	// 				setIsFetching(true)
	// 				const info = JSON.parse(data)
	// 				setDriver(info)
	// 				setPharmacyId(info.pharmacy_id)

	// 				if (info.zip_code == 'admin') {
	// 					getDriverOrderAdmin(info)
	// 				} else {
	// 					getDriverOrderPharmacy(info)
	// 				}
	// 			})

	// 		}
	// 		// }
	// 	});
	// }
	// const checkNewOrdersAdmin = () => {

	// 	const q = query(collection(db, 'ordersAdminDriver'), where('order_status', '==', 3), where('admin', '==', true), where('driver_id', '==', Number(driver_id)));
	// 	onSnapshot(q, (querySnapshot) => {

	// 		if (!(querySnapshot.docChanges().length == 0)) {

	// 			checkStorage('USER_LOGGED', async (data: any) => {
	// 				setIsFetching(true)
	// 				const info = JSON.parse(data)
	// 				setDriver(info)
	// 				// setPharmacyId(info.pharmacy_id)

	// 				if (info.zip_code == 'admin') {
	// 					getDriverOrderAdmin(info)
	// 				}
	// 			})

	// 		}

	// 	});
	// }

	const onRefresh = () => {
		setIsFetching(true);
		loadDriver()
	};


	const getDriverOrderAdmin = (data: any) => {
		getPharmacyDriverAdmin(data)
		let url = `/orders/getOrdersDriverAdmin/${data.driver_id}`
		fetchData(url).then(async (res) => {
			const order = res['order']
			// console.log(order)
			await setOrders(order);
			setOrders(res.order);
			setIsFetching(false)
		})


	}

	const acceptOrder = (item: any) => {
		Alert.alert('Information', 'Are you sure you want to accept this order?', [
			{
				text: 'No'
			},
			{
				text: 'Yes',
				onPress: async () => {
					const data = {
						driver_id: driver.driver_id,
						order_id: item.id
					};
					const data2 = {
						user_id: item.user_id
					};
					const url = '/user/getUserById';
					sendData(url, data2).then((response: any) => {
						if (Object.keys(response).length > 0) {

							const user = response['user'];
							if (user.img) user.img_url = { uri: user.img };
							else user.img_url = require('../assets/images/profile_avatar.png');


							sendData('/orders/driverSelectOrder', data).then(async (resp) => {
								if (Object.keys(resp).length > 0) {
									// const addOrderfirebase = await firebase.firestore().collection('orders')
									// addOrderfirebase.add({
									// 	order_id: item.id,
									// 	order_status: 3,
									// 	farmacy_id: Number(item.pharmacy_id)
									// })
									navigation.navigate('OrderDetails', { orderId: item.id, pharmacy: item.name, user: { ...item } });
								}
							})
						}
					});
				}
			}
		]);
	};

	const getPharmacyDriverAdmin = (data: any) => {
		
		let pruebaArrayPharmacies: any[] = []
		let url = `/driver/getPharmacyDriverAdmin/${data.driver_id}`
		fetchData(url).then(async (res) => {
			const pharmacies = res['pharmacies']
			setPharmacies(pharmacies)
			



			// pharmacies.map((e: any) => {
			// 	pruebaArrayPharmacies.push(e.label)
			// })
			// console.log(pruebaArrayPharmacies)
			// setPharmacies(pruebaArrayPharmacies)


		})
		// console.log("Dios", data.driver_id)
	}
	// const [selectedValue, setSelectedValue] = useState("java");
	const closeFilterModal = () => {
		setShowFilterModal(false)

	}

	const setPharmacyActive = (item: any) => {
		setShowFilterModal(false)

		let url = `/orders/getDriverOrder/${item.pharmacy_id}`
		// console.log(url)
		fetchData(url).then(async (res) => {
			const order = res['order']
			// console.log(order)
			await setOrders(order);
			setIsFetching(false)
		})

	}


	return (

		<View style={styles.body}>
			<Modal visible={showFilterModal} animationType='slide'>

				<View style={{ paddingHorizontal: 20, marginTop: 30 }}>
					<View style={{}}>
						<TouchableOpacity
							style={{

								// position: 'absolute', right: 0,
								width: 30,
								height: 30,
								backgroundColor: 'red',
								borderRadius: 50,
								justifyContent: 'center',
								alignItems: 'center',
								marginRight: 10,
								marginTop: 10
							}}
							onPress={() => closeFilterModal()}
						>
							<Text style={{
								alignItems: 'center',
								marginVertical: 5,
								color: 'white',
								fontWeight: '700'
							}}>
								X
							</Text>
						</TouchableOpacity>
					</View>
					<View style={{ position: 'relative', justifyContent: 'center', }}>
						<Text style={{ fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 10 }}>
							Farmacias
						</Text>

					</View>

					{/* <View style={styles.formInputIcon}>
						 <Text>osiris</Text> 
						<TextInput
							placeholder={'Search pharmacy' 
							placeholderTextColor={'gray'}
							style={[styles.textInput, { zIndex: 1 }]}
						onChangeText={filterCategory}
						/>
					</View> */}

				</View>
				{(Object.keys(pharmacies).length > 0 && (
					<FlatList
						style={{ height: '85%' }}
						columnWrapperStyle={{ justifyContent: 'space-around' }}
						data={pharmacies}
						// refreshing={fetchingCategories}
						// onRefresh={onRefresh}
						renderItem={({ item }: any) => (
							<TouchableOpacity
								style={styles.categoryCard}
								onPress={() => setPharmacyActive(item)}
								key={item.id}
							>
								<View style={{ height: 50, width: 50, marginBottom: 10 }}>
									<Image source={(item.Pharmacy_img != null) ? { uri: item.Pharmacy_img } : require('../assets/images/iconFarmacy.png')} style={{ height: 60, width: 55 }} />
									{/* { uri: (item.Pharmacy_img !=null)?item.Pharmacy_img:"" } */}
								</View>
								<Text style={styles.categoryName}>
									{item.label}
								</Text>

							</TouchableOpacity>

						)}
						numColumns={2}
					>

					</FlatList>
				)) || (
						<Text style={{ fontSize: 16, marginTop: 20 }}>
							NO tienes farmacias asignada
						</Text>
					)}

			</Modal>

			{(zip == 'admin') &&
				(<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
					<View style={{ alignItems: 'center' }}>
						<TouchableOpacity disabled={onlineStatus ? false : true} style={styles.categoryCard2} onPress={() => {
							if (zip == 'admin') {
								setSelectValue(0)
							}

							navigation.navigate('AcceptedOrders')
						}}>
							<View style={{ height: 50, width: 50, marginBottom: 10 }}>
								<Image source={require('../assets/images/carf.png')} style={{ height: 60, width: 55 }} />
							</View>


						</TouchableOpacity>
						<Text style={styles.categoryName}>
							Orders accepted in process
						</Text>
					</View>
					<View>
						<TouchableOpacity disabled={onlineStatus ? false : true} style={styles.categoryCard2} onPress={() => {
							
							getPharmacyDriverAdmin({driver_id})

							setShowFilterModal(true)

						}}>
							<View style={{ height: 50, width: 50, marginBottom: 10 }}>
								<Image source={require('../assets/images/iconFarmacy.png')} style={{ height: 60, width: 55 }} />
							</View>


						</TouchableOpacity>
						<Text style={styles.categoryName}>
							Pharmacies
						</Text>
					</View>
				</View>) || (<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						paddingVertical: 5,
						borderBottomColor: '#8B8B9720',
						borderBottomWidth: 1
					}}
				>
					<TouchableOpacity disabled={onlineStatus ? false : true}
						onPress={() => {
							if (zip == 'admin') {
								setSelectValue(0)
							}

							navigation.navigate('AcceptedOrders')
						}}
						style={{
							backgroundColor: '#60941A',
							height: 45,
							width: '90%',
							borderRadius: 7,
							justifyContent: 'center',
							alignItems: 'center',
							marginVertical: 5
						}}
					>
						<Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Orders accepted in process</Text>
					</TouchableOpacity>
				</View>)}


			{/* {(zip != 'admin') && } */}

			{/* {(zip == 'admin') && <View
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					borderBottomColor: '#8B8B9720',
					borderBottomWidth: 1
				}}
			>
				<TouchableOpacity
					style={{
						height: 50,
						width: '90%',
						borderRadius: 7,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>

					<RNPickerSelect placeholder={placeholder} value={selectValue}
						onValueChange={
							(value) => {
								console.log(value)
								if (value != 0) {
									setSelectValue(value)
									let url = `/orders/getDriverOrder/${value}`
									fetchData(url).then(async (res) => {
										const order = res['order']
										await setOrders(order);
										setIsFetching(false)
									})
								}

							}
						}
						style={pickerSelectStyles}
						items={pharmacies}
					/>
				</TouchableOpacity>
			</View>} */}
			<View
			>
				{/* {(zip == 'admin') &&
					<ModalDropdown
						options={['osiris']}
						animated
						isFullWidth
						defaultValue="select pharmacies"
						dropdownTextProps
						renderButtonText={(text: string) => { serSelectName(text) }}
						textStyle={{
							color: 'red',
							fontSize: 16,
							fontWeight: 'bold'
						}}
					>
						<View style={{
							justifyContent: 'center',
							alignItems: 'center',
							paddingVertical: 5,
							borderBottomColor: '#8B8B9720',
							borderBottomWidth: 1
						}}>

							<View style={{
								backgroundColor: '#128780',
								height: 45,
								width: '90%',
								borderRadius: 7,
								justifyContent: 'center',
								alignItems: 'center',
								marginVertical: 5,
							}}>
								<Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{selectName}</Text>
							</View>

						</View>
					</ModalDropdown>} */}



			</View>
			<View style={{ marginTop: 10 }}>
				{(onlineStatus &&
					((Object.keys(orders).length > 0 && (

						<FlatList
							style={{ height: '90%' }}
							onRefresh={onRefresh}
							refreshing={isFetching}
							data={orders}
							keyExtractor={(item) => item.id}
							renderItem={({ item, index }: any) => (
								// <OrderCard
								// 	order={item}
								// 	pharmacy={pharmacy}
								// 	navigation={navigation}
								// 	driver={driver}
								// />
								// aqui poner el otro componente

								<View style={{ height: 325, marginBottom: 20, borderBottomColor: '#8B8B9720', borderBottomWidth: 1 }}>
									<View
										style={{
											backgroundColor: '#F7F7F7',
											height: 75,
											justifyContent: 'space-between',
											flexDirection: 'row',
											padding: 10
										}}
									>
										<View >
											<ImageBackground
												source={{ uri: (item.user_img == null || item.user_img == '') ? 'https://assets.stickpng.com/images/585e4bcdcb11b227491c3396.png' : item.user_img }}
												resizeMode={'cover'}
												style={{ width: 40, height: 40, marginRight: 15 }}
												imageStyle={{ borderRadius: 8 }}
											/>
											<Text style={{ fontWeight: '500', fontSize: 16, marginBottom: 5 }}>
												{item.first_name + ' ' + item.last_name}
											</Text>
										</View>
										{/* <Text style={{ fontSize: 16 }}>${item.total_order}</Text> */}
									</View>

									<View style={{ padding: 10, backgroundColor: '#fff' }}>
										<View
											style={{
												marginVertical: 10,
												paddingBottom: 15,
												borderBottomColor: '#F7F7F7',
												borderBottomWidth: 1
											}}
										>
											<Text style={{ color: '#8B8B9790', fontWeight: 'bold', fontSize: 13 }}>START</Text>
											<Text style={{ fontSize: 16, fontWeight: '500', marginTop: 5 }}>{item.pharmacy_address}</Text>
										</View>
										<View
											style={{
												marginVertical: 10,
												paddingBottom: 15,
												borderBottomColor: '#F7F7F7',
												borderBottomWidth: 1
											}}
										>
											<Text style={{ color: '#8B8B9790', fontWeight: 'bold', fontSize: 13 }}>DROP OFF</Text>
											<Text style={{ fontSize: 16, fontWeight: '500', marginTop: 5, marginBottom: 5 }}>{item.address_1}</Text>
											<Text style={{ color: '#8B8B9790', fontWeight: 'bold', fontSize: 13 }}>PHARMACY</Text>
											<Text style={{ fontSize: 16, fontWeight: '500', marginTop: 5, marginBottom: 5 }}>{item.name}</Text>
											{/* <Text style={{ color: '#8B8B9790', fontWeight: 'bold', fontSize: 13 }}>DISPATCHER CONTACT NAME</Text>
											<Text style={{ fontSize: 16, fontWeight: '500', marginTop: 5,  marginBottom: 5 }}>{item.dispatcher}</Text>
											<Text style={{ color: '#8B8B9790', fontWeight: 'bold', fontSize: 13 }}>DISPATCHER EXTENSION NUMBER </Text>
											<Text style={{ fontSize: 16, fontWeight: '500', marginTop: 5,  marginBottom: 5 }}>{item.dispatcherPhone}</Text>
											<Text style={{ color: '#8B8B9790', fontWeight: 'bold', fontSize: 13 }}>PLACE OF DISPATCH</Text>
											<Text style={{ fontSize: 16, fontWeight: '500', marginTop: 5,  marginBottom: 5 }}>{item.placeOfDispatch}</Text> */}

											{/* dispatcher */}
										</View>
										<View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 5 }}>
											<TouchableOpacity
												onPress={() => acceptOrder(item)}
												style={{
													backgroundColor: '#60941A',
													height: 45,
													width: '90%',
													borderRadius: 7,
													justifyContent: 'center',
													alignItems: 'center'
												}}
											>
												<Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Accept order</Text>
											</TouchableOpacity>
										</View>
									</View>

								</View>
							)}
						/>
					)) || (
							<View style={{ alignItems: 'center', marginTop: 30 }}>
								{(zip != 'admin') && <Text style={{ fontSize: 16, fontWeight: '400', }}>No orders available</Text>}


								{(zip == 'admin') && <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 16 }}>You do not have an available order, wait for it to be assigned</Text>}
							</View>



						))) || (
						<View style={{ alignItems: 'center', marginTop: 30 }}>
							<Text style={{ fontSize: 16, fontWeight: '400' }}>Offline mode</Text>
						</View>
					)}
			</View>
		</View>


	);
}

const styles = StyleSheet.create({
	body: {
		backgroundColor: '#F7F7F7',
		flex: 1
	},
	container: {
		height: 40,
		backgroundColor: "red",
		alignItems: "center",
		justifyContent: "center",
	},
	categoryIcon: {
		marginBottom: 15,
		marginTop: 24

	},
	formInputIcon: {
		position: 'relative',
		flexDirection: 'row',
		marginTop: 20
	},
	textInput: {
		height: 50,
		width: '100%',
		backgroundColor: '#F7F7F7',
		paddingRight: 40,
		paddingLeft: 20,
		borderRadius: 5,
		marginVertical: 10
	},
	categoryCard: {
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F7F7F7',
		borderRadius: 15,
		marginVertical: 10,
		width: '43%',
		height: 120
	},
	categoryCard2: {
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 50,
		marginVertical: 10,
		width: 100,
		height: 100

	},

	categoryCardActive: {
		borderWidth: 1,
		borderColor: '#000'
	},
	categoryName: {
		fontSize: 15,
		fontWeight: '400',
		textAlign: 'center'
	},




});

const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		fontSize: 20,
		borderWidth: 1,
		borderBottomWidth: 0.5,
		color: 'black',
		paddingRight: 30,
		borderColor: "#128780",
		borderRadius: 7,
		padding: 15
	},
	inputAndroid: {
		fontSize: 20,
		borderWidth: 1,
		borderBottomWidth: 0.5,
		color: 'black',
		paddingRight: 30,
		borderColor: "#128780",
		borderRadius: 7,
		padding: 15
	},
});

