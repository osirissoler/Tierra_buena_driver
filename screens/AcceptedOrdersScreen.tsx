import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, Pressable } from 'react-native';
import { checkStorage, hideLoadingModal, Loading, ScreenContainer } from '../components/Shared';
import { fetchData, sendData } from '../httpRequests';

export default function AcceptedOrders({ navigation }: any) {
	const [acceptedOrders, setAcceptedOrders]: any = useState([]);
	const [pharmacy, setPharmacy]: any = useState({});
	const [isFetching, setIsFetching]: any = useState(false);

	useEffect(() => {
		// loadOderDriver()

		onRefresh();

		return () => {
			setAcceptedOrders([]);
		};
	}, []);

	// const loadDriver = () => {
	// 	checkStorage('USER_LOGGED', (data: any) => {

	// 		const url = '/user/getDriverById';
	// 		sendData(url, JSON.parse(data)).then((response: any) => {
	// 			console.log("accept", response)
	// 			if (Object.keys(response).length > 0) {
	// 				const driver = response['driver'];
	// 				// loadPharmacy(driver);

	// 				if (driver.active) {
	// 					loadOderDriver()
	// 				}
	// 			}
	// 		});
	// 	});
	// };

	const loadOderDriver = () => {
		checkStorage('USER_LOGGED', async (data: any) => {
			setIsFetching(true)
			const info = JSON.parse(data)

			// setDriver(info)
			// setPharmacyId(info.pharmacy_id)

			// if (info.zip_code == 'admin') {
			// 	getDriverOrderAdmin(info)
			// } else {
			getDriverOrderPharmacy(info)
			// }

			// if (info.pharmacy_id != null) {

			// 	setPharmacyId(info.pharmacy_id)

			// }


		})

	}

	const getDriverOrderPharmacy = async (data: any) => {
		// console.log(data)
		let url = `/orders/getOrderSelectedByPharmacy/${data.driver_id}`
		fetchData(url).then(async (res) => {
			const order = res['order']
			// console.log(order)
			// await setOrders(order);
			setIsFetching(false)
			setAcceptedOrders(order);
		})
	}

	// const getDriverOrderAdmin = (data: any) => {
	// 	// let url = `/orders/getOrdersDriverAdmin/${data.driver_id}`
	// 	// fetchData(url).then(async (res) => {
	// 	// 	const order = res['order']
	// 	// 	await setOrders(order);

	// 	// 	setOrders(res.order);
	// 	// 	setIsFetching(false)
	// 	// })
	// }


	// const loadPharmacy = (driver: any) => {
	// 	const url = '/pharmacies/getPharmacyById';
	// 	const data = {
	// 		id: driver.pharmacy_id
	// 	};
	// 	sendData(url, data).then((response: any) => {
	// 		if (Object.keys(response).length > 0) {
	// 			const pharmacy = response['pharmacy'];
	// 			setPharmacy(pharmacy);
	// 			loadPharmacyOrders(driver);
	// 		}
	// 	});
	// };

	// const loadPharmacyOrders = (driver: any) => {
	// 	setAcceptedOrders([]);
	// 	const url = '/orders/getAllOrdersByPharmacy';
	// 	const data = {
	// 		pharmacy_id: driver.pharmacy_id
	// 	};
	// 	sendData(url, data).then((response: any) => {
	// 		if (Object.keys(response).length > 0) {
	// 			const orders = response['order'];
	// 			const acceptedOrders = orders.filter(
	// 				(order: any) =>
	// 					order.driver_id == driver.id && (order.order_state_id == 3 || order.order_state_id == 4)
	// 			);
	// 			acceptedOrders.sort(function (a: any, b: any) {
	// 				return a.code < b.code;
	// 			});
	// 			setAcceptedOrders(acceptedOrders);
	// 		}
	// 		setIsFetching(false);
	// 	});
	// };

	const onRefresh = () => {
		setIsFetching(true);

		loadOderDriver()

		// loadDriver();
	}

	return (
		<ScreenContainer>
			<View style={styles.body}>
				{(acceptedOrders.length > 0 && (
					<FlatList
						style={{ height: '90%' }}
						refreshing={isFetching}
						onRefresh={onRefresh}
						data={acceptedOrders}
						keyExtractor={(item) => item.id}
						renderItem={({ item }: any) => (
							// <AcceptedOrder navigation={navigation} pharmacy={pharmacy} order={item} />
							<View
							>
								<Pressable
									onPress={() => navigation.navigate('OrderDetails', { orderId: item.id, pharmacy:item.name, user:{...item} })}
									style={{
										height: 70,
										borderBottomColor: '#8B8B9720',
										borderBottomWidth: 1
									}}
								>
									<View
										style={{
											backgroundColor: '#fff',
											height: '100%',
											justifyContent: 'space-between',
											alignItems: 'center',
											flexDirection: 'row',
											padding: 10
										}}
									>
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<ImageBackground
												source={{ uri: (item.user_img == null || item.user_img == '') ? 'https://assets.stickpng.com/images/585e4bcdcb11b227491c3396.png' : item.user_img }}
												resizeMode={'cover'}
												style={{ width: 40, height: 40, marginRight: 15 }}
												imageStyle={{ borderRadius: 8 }}
											/>
											<View>
											<Text style={{ fontSize: 16, fontWeight: '500', marginTop: 5 }}>{item.name}</Text>
												<Text style={{ fontWeight: '500', fontSize: 16 }}>
													{item.first_name + ' ' + item.last_name}
												</Text>
												
												{/* <Text style={{ fontSize: 16, marginTop: 1 }}>${item.total_order}</Text> */}
												
											</View>
										</View>
										<AntDesign style={{ textAlign: 'right', color: 'rgba(0, 0, 0, 0.3)' }} name='right' size={16} />
									</View>
								</Pressable>

							</View>
						)}
					/>
				)) || (
						<View style={{ alignItems: 'center', marginTop: 30 }}>
							<Text style={{ fontSize: 16, fontWeight: '400' }}>No orders available</Text>
						</View>
					)}
			</View>
		</ScreenContainer>
	);
}

// function AcceptedOrder({ navigation, pharmacy, order }: any) {
// 	const [user, setUser]: any = useState({});
// 	console.log(order)

// 	useEffect(() => {
// 		const data = {
// 			user_id: order.user_id
// 		};
// 		const url = '/user/getUserById';
// 		sendData(url, data).then((response: any) => {
// 			if (Object.keys(response).length > 0) {
// 				const user = response['user'];
// 				if (user.img) user.img_url = { uri: user.img };
// 				else user.img_url = require('../assets/images/profile_avatar.png');
// 				setUser(user);
// 			}
// 		});

// 		return () => setUser({});
// 	}, []);

// 	return (
// 		<View
// 		>
// 			{Object.keys(user).length > 0 && (
// 				<Pressable
// 					onPress={() => navigation.navigate('OrderDetails', { orderId: order.id, pharmacy, user })}
// 					style={{
// 						height: 70,
// 						borderBottomColor: '#8B8B9720',
// 						borderBottomWidth: 1
// 					}}
// 				>
// 					<View
// 						style={{
// 							backgroundColor: '#fff',
// 							height: '100%',
// 							justifyContent: 'space-between',
// 							alignItems: 'center',
// 							flexDirection: 'row',
// 							padding: 10
// 						}}
// 					>
// 						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
// 							<ImageBackground
// 								source={user.img_url}
// 								resizeMode={'cover'}
// 								style={{ width: 40, height: 40, marginRight: 15 }}
// 								imageStyle={{ borderRadius: 8 }}
// 							/>
// 							<View>
// 								<Text style={{ fontWeight: '500', fontSize: 16 }}>
// 									{user.first_name}
// 								</Text>
// 								<Text style={{ fontWeight: '500', fontSize: 16 }}>
// 									{user.first_name + ' ' + user.last_name}
// 								</Text>
// 								<Text style={{ fontSize: 16, marginTop: 1 }}>${order.total_order}</Text>
// 							</View>
// 						</View>
// 						<AntDesign style={{ textAlign: 'right', color: 'rgba(0, 0, 0, 0.3)' }} name='right' size={16} />
// 					</View>
// 				</Pressable>
// 			)}
// 		</View>
// 	);
// }

const styles = StyleSheet.create({
	body: {
		backgroundColor: '#F7F7F7',
		flex: 1,
		borderTopColor: '#8B8B9720',
		borderTopWidth: 1
	}
});
