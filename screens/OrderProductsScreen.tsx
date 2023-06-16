import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { ScreenContainer } from '../components/Shared';
import { sendData } from '../httpRequests';

export default function OrderProductsScreen({ navigation, route }: any) {
	const [products, setProducts]: any = useState([]);
	useEffect(() => {
		const products = route.params.products;
		console.log(products , 'orderprod')
		if (products) setProducts(products);
	}, []);

	return (
		<ScreenContainer>
			<View style={styles.container}>
				<FlatList
					data={products}
					style={{ height: '90%' }}
					renderItem={({ item }) => <OrderProduct item={item} pharmacyId={route.params.pharmacyId} />}
				/>
			</View>
		</ScreenContainer>
	);
}

function OrderProduct({ item, pharmacyId }: any) {
	const [product, setProduct]: any = useState({});

	useEffect(() => {
		const url = '/products/getPharmaciesProductByid';
		const data = { pharmacy_id: pharmacyId, id: item.pharmacy_product_id };
		sendData(url, data).then((response) => {
			const product = response['pharmacyProduct'];
			setProduct(product);
		});
		return () => {
			setProduct({});
		};
	}, []);

	return (
		<View style={styles.card}>
			<View style={styles.cardImage}>
				<Image source={{ uri: product.product_img }} style={{ flex: 1, resizeMode: 'contain' }} />
			</View>
			<View style={{ marginLeft: 10, paddingRight: 90 }}>
				<Text style={{ fontSize: 15, fontWeight: '700', color: 'rgba(0, 0, 0, 0.5)' }}>
					{product.product_name}osiris
				</Text>
				<Text style={{ fontSize: 15, color: 'rgba(0, 0, 0, 0.6)', marginVertical: 5 }}>
					Quantity: {item.quantity}
				</Text>
				<Text style={{ fontSize: 15, color: 'rgba(0, 0, 0, 0.6)' }}>${item.product_price}</Text>
				{item.gift_status_id == 1 && (
					<View style={{ marginTop: 10 }}>
						<Text style={{ fontStyle: 'italic', color: 'rgba(0, 0, 0, 0.5)' }}>"{item.message}"</Text>
						<Text style={{ fontStyle: 'italic', color: 'rgba(0, 0, 0, 0.5)' }}>From: {item.from}</Text>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#F7F7F7',
		flex: 1
	},
	body: {
		padding: 10,
		backgroundColor: '#ffffff'
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
	}
});
