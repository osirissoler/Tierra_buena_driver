import React, { useState, useEffect } from 'react';
import { Platform, View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert, FlatList, Button } from 'react-native';

import * as Location from 'expo-location';
import * as Linking from 'expo-linking';


import { showLocation } from 'react-native-map-link';

import { ScreenContainer } from '../components/Shared';
import { fetchData, sendData } from '../httpRequests';

import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

export default function OrderDetailsScreen({ navigation, route }: any) {
	const [products, setProducts]: any = useState([]);
	const [order, setOrder]: any = useState({});
	const [cartPrices, setCartPrices]: any = useState({});
	const [user, setUser]: any = useState({});
	const [pharmacy, setPharmacy]: any = useState({});

	const [location, setLocation]: any = useState(null);
	const [errorMsg, setErrorMsg]: any = useState(null);

	useEffect(() => {
		// loadOrder();

		const pharmacy = route.params.pharmacy;
		setPharmacy(pharmacy);

		const user = route.params.user;
		setUser(user);
		setOrder(user);
		loadOrderDetails(user);

		return () => {
			setPharmacy({});
			setUser({});
			setProducts([]);
			setCartPrices({});
		};
	}, []);

	useEffect(() => {
		getLocationByDriver()
	}, []);


	const getLocationByDriver = async () => {

		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			setErrorMsg('Permission to access location was denied');
			return;
		}

		let location = await Location.getCurrentPositionAsync({});
		setLocation(location);

	}
	let text = 'Waiting..';
	if (errorMsg) {
		text = errorMsg;
	} else if (location) {
		text = JSON.stringify(location);
	}

	const sendMessage = async () => {

		await Linking.openURL(`https://wa.me/+1${order.phone}/?Hello`)


	}
	const sendCall = async () => {
		await Linking.openURL(`https://bluesoft360.my3cx.us/webclient`)

	}


	// const loadOrder = () => {
	// 	const url = '/orders/getOrderById';
	// 	const data = {
	// 		order_id: route.params.orderId
	// 	};
	// 	sendData(url, data).then((response: any) => {
	// 		if (Object.keys(response).length > 0) {
	// 			const order = response['order'];
	// 			const orderDate: string = order.created_at;
	// 			order.orderDate = orderDate.split(' ')[0];
	// 			setOrder(order);


	// 			navigation.setOptions({ title: 'Order: #' + order.code });
	// 		}
	// 	});
	// };

	const loadOrderDetails = (order: any) => {
		const url = '/orders/getOrderDetails';
		const data = {
			order_id: order.id
		};
		sendData(url, data).then((response: any) => {
			if (Object.keys(response).length > 0) {
				const orderProducts = response['orderdetail'];
				setProducts(orderProducts);
				// console.log(orderProducts, "orderProducts")
				// 		calculatePrices(orderProducts);
			}
		});
	};

	const calculatePrices = (orderProducts: any) => {
		let prices = {
			subTotal: 0.0,
			ivu_est: 0.0,
			ivu_mun: 0.0,
			fee: 1.0,
			deliveryFee: 6.0,
			total: 0.0
		};

		orderProducts.map((product: any) => {
			let price = product.product_price;
			const subTotal = prices.subTotal + price;
			prices.subTotal = roundNumber(subTotal);
			if (product.ivu_statal) {
				prices.ivu_est += price * 0.105;
			}
			if (product.ivu_municipal) {
				prices.ivu_mun += price * 0.01;
			}
		});
		prices.ivu_est = roundNumber(prices.ivu_est);
		prices.ivu_mun = roundNumber(prices.ivu_mun);
		prices.total = roundNumber(prices.subTotal + prices.ivu_est + prices.ivu_mun + prices.fee + prices.deliveryFee);
		setCartPrices(prices);
	};

	const roundNumber = (number: number) => {
		return Number.parseFloat((Math.round(number * 100) / 100).toFixed(2));
	};

	const proccessOrder = (status: number) => {
		const url = '/orders/updateOrderStatus';
		const data = {
			order_id: order.id,
			state: status,
			user_id: order.user_id
		};
		Alert.alert('Information', 'Are you sure you want to perform this action?', [
			{
				text: 'Cancel'
			},
			{
				text: 'Ok',
				onPress: () => {
					sendData(url, data).then((response) => {
						if (Object.keys(response).length > 0) {
							if (status == 4) {
								Alert.alert('Information', 'Order has been started');
								getOrder(order.id);
							}
							if (status == 5) {
								Alert.alert('Information', 'Order has been completed! Congrats!', [
									{
										text: 'Ok',
										onPress: () => {
											navigation.reset({
												index: 0,
												routes: [{ name: 'Root', screen: 'Home' }]
											});
										}
									}
								])
							}
						}
					});

				}
			}

		])

	};

	const getOrder = async (id: any) => {
		const url = `/orders/getNewOrderById/${id}`;
		fetchData(url).then((response) => {
			if (Object.keys(response).length > 0) {
				console.log(response.order)

				setUser(response.order);
				setOrder(response.order);
				loadOrderDetails(response.order);
			}
		})


	}
	const goToYosemite = () => {
		console.log(order)
		if (order)

			showLocation({
				// 18.506466, -69.857522
				latitude: order.latitude,
				longitude: order.longitude,
				alwaysIncludeGoogle: true,
				dialogTitle: 'Go location',
				dialogMessage: 'Reach product location',
				directionsMode: 'car'
			})

	}

	return (
		<>
			<ScreenContainer>
				<View style={styles.container}>
					<View
						style={{
							height: '12%',
							justifyContent: 'space-between',
							flexDirection: 'row',
							padding: 10
						}}
					>
						<View>
							<View >
								<ImageBackground
									source={{ uri: (user.user_img == null || user.user_img == '') ? 'https://assets.stickpng.com/images/585e4bcdcb11b227491c3396.png' : user.user_img }}
									resizeMode={'cover'}
									style={{ width: 40, height: 40, marginRight: 15 }}
									imageStyle={{ borderRadius: 8 }}
								/>
								<Text style={{ fontWeight: '500', fontSize: 16 }}>
									{user.first_name + ' ' + user.last_name}
								</Text>
							</View>
							<Text style={{ fontSize: 16 }}>{ }</Text>
						</View>
					</View>
					<View style={styles.body}>
						<View
							style={{
								marginVertical: 10,
								paddingBottom: 5,
								borderBottomColor: '#F7F7F7',
								borderBottomWidth: 1
							}}
						>
							<Text style={{ color: '#8B8B9790', fontWeight: 'bold', fontSize: 12 }}>PICK UP</Text>
							<Text style={{ fontSize: 16, fontWeight: '400', marginTop: 5 }}>{user.address}</Text>
						</View>
						<View
							style={{
								marginVertical: 10,
								paddingBottom: 5,
								borderBottomColor: '#F7F7F7',
								borderBottomWidth: 1
							}}
						>
							<Text style={{ color: '#8B8B9790', fontWeight: 'bold', fontSize: 12 }}>DROP OFF</Text>
							<Text style={{ fontSize: 16, fontWeight: '400', marginTop: 5 }}>{user.address_1}</Text>
						</View>
						<View
							style={{
								marginVertical: 10,
								paddingBottom: 5,
								borderBottomColor: '#F7F7F7',
								borderBottomWidth: 1
							}}
						>
							<Text style={{ color: '#8B8B9790', fontWeight: 'bold', fontSize: 12 }}>NOTES</Text>
							<Text style={{ fontSize: 16, fontWeight: '400', marginTop: 5 }}>{user.notes}</Text>
						</View>

						<View
							style={{
								marginVertical: 10,
								paddingBottom: 5,
								borderBottomColor: '#F7F7F7',
								borderBottomWidth: 1
							}}
						>
							<Text style={{ color: '#8B8B9790', fontWeight: 'bold', fontSize: 12 }}>PHARMACY</Text>
							<Text style={{ fontSize: 16, fontWeight: '400', marginTop: 5 }}>{user.name}</Text>
						</View>
						<View
							style={{
								marginVertical: 10,
								paddingBottom: 5,
								borderBottomColor: '#F7F7F7',
								borderBottomWidth: 1
							}}
						>
							<Text style={{ color: '#8B8B9790', fontWeight: 'bold', fontSize: 12 }}>DISPATCHER CONTACT NAME</Text>
							<Text style={{ fontSize: 16, fontWeight: '400', marginTop: 5 }}>{user.dispatcher}</Text>
						</View>
						<View
							style={{
								marginVertical: 10,
								paddingBottom: 5,
								borderBottomColor: '#F7F7F7',
								borderBottomWidth: 1
							}}
						>
							<Text style={{ color: '#8B8B9790', fontWeight: 'bold', fontSize: 12 }}>PLACE OF DISPATCH</Text>
							<Text style={{ fontSize: 16, fontWeight: '400', marginTop: 5 }}>{user.placeOfDispatch}</Text>
						</View>
						<View
							style={{
								marginVertical: 10,
								paddingBottom: 5,
								borderBottomColor: '#F7F7F7',
								borderBottomWidth: 1
							}}
						>
							<Text style={{ color: '#8B8B9790', fontWeight: 'bold', fontSize: 12 }}>DISPATCHER EXTENSION NUMBER </Text>
							<Text style={{ fontSize: 16, fontWeight: '400', marginTop: 5 }}>{user.dispatcherPhone}</Text>
						</View>
						{/* <View style={{ paddingBottom: 15, borderBottomColor: '#F7F7F7', borderBottomWidth: 1 }}>
							<View style={styles.cartPrices}>
								<Text>Sub Total</Text>
								<Text style={styles.cartPrice}>${cartPrices.subTotal}</Text>
							</View>
							<View style={styles.cartPrices}>
								<View>
									<Text>State SUT</Text>
								</View>
								<View>
									<Text style={styles.cartPrice}>${cartPrices.ivu_est}</Text>
								</View>
							</View>
							<View style={styles.cartPrices}>
								<View>
									<Text>Municipal SUT</Text>
								</View>
								<View>
									<Text style={styles.cartPrice}>${cartPrices.ivu_mun}</Text>
								</View>
							</View>
							<View style={styles.cartPrices}>
								<Text>Transaction Fee</Text>
								<Text style={styles.cartPrice}>${cartPrices.fee}</Text>
							</View>
							<View style={styles.cartPrices}>
								<Text>Delivery Fee</Text>
								<Text style={styles.cartPrice}>${cartPrices.deliveryFee}</Text>
							</View>
							<View style={styles.cartPrices}>
								<Text style={{ fontWeight: '700', fontSize: 16 }}>Total</Text>
								<Text style={[styles.cartPrice, { fontWeight: '700', fontSize: 16 }]}>
									${cartPrices.total}
								</Text>
							</View>
						</View> */}




						{/* <View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								paddingVertical: 5,
								marginTop: 30
							}}
						>
							<TouchableOpacity
								onPress={() => navigation.navigate('OrderProducts', { products, pharmacyId: user.pharmacy_id })}
								style={{
									backgroundColor: '#128780',
									height: 45,
									width: '90%',
									borderRadius: 7,
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<Text style={{ color: '#fff', fontWeight: '500', fontSize: 16 }}>Show products</Text>
							</TouchableOpacity>
						</View> */}
						{/* <View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								paddingVertical: 5,
								marginTop: 30
							}}
						>
							{order.order_state_id == 4 && (<TouchableOpacity

								onPress={() => goToYosemite()}
								style={{
									backgroundColor: '#128780',
									height: 45,
									width: '90%',
									borderRadius: 7,
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<Text style={{ color: '#fff', fontWeight: '500', fontSize: 16 }}>Go locations </Text>
							</TouchableOpacity>)}


						</View> */}
						{/* <View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								paddingVertical: 5,
								marginTop: 30
							}}
						>
							{order.order_state_id == 4 && (<TouchableOpacity
							
								onPress={() => sendCall()}
								style={{
									backgroundColor: '#128780',
									height: 45,
									width: '90%',
									borderRadius: 7,
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<Text style={{ color: '#fff', fontWeight: '500', fontSize: 16 }}>Call </Text>
							</TouchableOpacity>)}


						</View> */}
						{/* <View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								paddingVertical: 5,
								marginTop: 30
							}}
						>
							{order.order_state_id == 4 && (<TouchableOpacity
							
								onPress={() => sendMessage()}
								style={{
									backgroundColor: '#128780',
									height: 45,
									width: '90%',
									borderRadius: 7,
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<Text style={{ color: '#fff', fontWeight: '500', fontSize: 16 }}>Send message </Text>
							</TouchableOpacity>)}


						</View> */}



						{/* <Button
							color={'#bdc3c7'}
							onPress={() => goToYosemite()}
							title="Click To Open Maps 🗺" /> */}

					</View>
				</View>
			</ScreenContainer>

			<View style={{
				width: '100%',
				bottom: 0,
				marginTop: 5,
				marginBottom: 5,
				backgroundColor: '60941A',
			}}>

				<View style={{
					justifyContent: 'space-between',
					flexDirection: 'row',
				}}>
					<View style={{
						alignItems: 'center'
					}}>
						<TouchableOpacity disabled={false} onPress={() => sendCall()}>
							<Ionicons name="call" size={40} color='#60941A' style={{ width: 60, height: 60, textAlign: 'center' }} />
							<Text style={{marginLeft:3}}>Call clients</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity onPress={() => navigation.navigate('OrderProducts', { products, pharmacyId: user.pharmacy_id })} style={{
						alignItems: 'center'
					}}>
						<AntDesign name="shoppingcart" size={40} color='#60941A' style={{ width: 60, height: 60, textAlign: 'center' }} />
						<Text>Show product</Text>
					</TouchableOpacity>

					{(order.order_state_id == 4) && <TouchableOpacity onPress={() => goToYosemite()}>
						<FontAwesome5 name="location-arrow" size={40} color='#60941A' style={{ width: 60, height: 60, textAlign: 'center' }} />
						<Text>Location</Text>
					</TouchableOpacity>}

					<TouchableOpacity onPress={() => sendMessage()}>
						<FontAwesome name="whatsapp" size={40} color='#60941A'  style={{ width: 60, height: 60, textAlign: 'center'  }} />
						<Text style={{marginRight:3}}>WhatsApp</Text>
					</TouchableOpacity>
				</View>
			</View>
			<TouchableOpacity
				onPress={() => proccessOrder(order.order_state_id + 1)}
				style={{
					backgroundColor: '#60941A',
					height: '13%',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Text style={{ fontSize: 18, fontWeight: '500', color: '#fff' }}>{order.order_state_id == 3 ? 'START' : 'COMPLETE'}</Text>
			</TouchableOpacity>
		</>
	);
}

function OrderProduct({ item, order }: any) {
	// console.log(item, order, "fddddfd")
	// const [product, setProduct]: any = useState({});
	// console.log('product', "fsdfsdf",)
	// useEffect(() => {
	// 	const url = '/products/getPharmaciesProductByid';
	// 	const data = { pharmacy_id: order.pharmacy_id, id: item.pharmacy_product_id };
	// 	sendData(url, data).then((response) => {
	// 		const product = response['pharmacyProduct'];
	// 		setProduct(product);

	// 	});
	// 	return () => {
	// 		setProduct({});
	// 	};
	// }, []);

	// return (
	// 	<View style={styles.card}>
	// 		<View style={styles.cardImage}>
	// 			<Image source={{ uri: product.product_img }} style={{ flex: 1, resizeMode: 'contain' }} />
	// 		</View>
	// 		<View style={{ marginLeft: 10, paddingRight: 90 }}>
	// 			<Text style={{ fontSize: 15, fontWeight: '700', color: 'rgba(0, 0, 0, 0.5)' }}>
	// 				{product.product_name}
	// 			</Text>
	// 			<Text style={{ fontSize: 15, color: 'rgba(0, 0, 0, 0.6)', marginVertical: 5 }}>
	// 				Quantity: {item.quantity}
	// 			</Text>
	// 			<Text style={{ fontSize: 15, color: 'rgba(0, 0, 0, 0.6)' }}>${item.product_price}</Text>
	// 			{item.gift_status_id == 1 && (
	// 				<View style={{ marginTop: 10 }}>
	// 					<Text style={{ fontStyle: 'italic', color: 'rgba(0, 0, 0, 0.5)' }}>"{item.message}"</Text>
	// 					<Text style={{ fontStyle: 'italic', color: 'rgba(0, 0, 0, 0.5)' }}>From: {item.from}</Text>
	// 				</View>
	// 			)}
	// 		</View>
	// 	</View>
	// );
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#F7F7F7',
		flex: 1,
		height: '100%'
	},
	body: {
		padding: 10,
		backgroundColor: '#ffffff',
		height: '89%',
	},
	orderHeader: {
		marginBottom: 10,
		paddingVertical: 10,
		borderBottomColor: 'rgba(0, 0, 0, 0.1)',
		borderBottomWidth: 1
	},
	orderText: {
		fontSize: 15,
		color: 'rgba(0, 0, 0, 0.5)',
		marginBottom: 10
	},
	card: {
		alignContent: 'center',
		flexDirection: 'row',
		width: '100%',
		paddingHorizontal: 15,
		paddingVertical: 20,
		borderBottomColor: 'rgba(0, 0, 0,  0.1)',
		borderBottomWidth: 1,
		position: 'relative',
		marginVertical: 10
	},
	cardImage: {
		height: 100,
		width: 100
	},
	cartPrices: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 2
	},
	cartPrice: {
		textAlign: 'right'
	},
	card2: {
		alignContent: 'center',
		flexDirection: 'row',
		width: '100%',
		paddingHorizontal: 15,
		paddingVertical: 20,
		borderBottomColor: 'rgba(0, 0, 0,  0.1)',
		borderBottomWidth: 1,
		position: 'relative',
		marginVertical: 10
	},
});
