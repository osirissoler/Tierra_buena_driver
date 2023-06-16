import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert } from 'react-native';
// import { Marker, Polyline, PROVIDER_GOOGLE, } from 'react-native-maps';
// import { ScreenContainer } from '../components/Shared';
// import { sendData } from '../httpRequests';
// import MapView from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import * as Location from 'expo-location';
// import { GOOGLE_MAPS_KEYS } from '../';
// import { DarkTheme } from '@react-navigation/native';
// const osir = require('../assets/images/motorcito.png')

export default function Osiris() {
	// let value = 18.479417
	// let value2 = -69.809715
	// 18.480898, -69.814833  18.479274, -69.809543  18.479716, -69.821592  

	// const [location, setLocation]: any = useState(null);
	// const [errorMsg, setErrorMsg]: any = useState(null);
	// const [distance, setDistance]: any = useState(0);
	// const [duration, setduration]: any = useState(0);

	// const [origin, setOrigin]: any = useState({
	// 	latitude: 18.479274,
	// 	longitude: -69.809543
	// })
	// 18.479718, -69.821700

	// const [destination, Setdestination]: any = useState({
	// 	latitude: 18.479716,
	// 	longitude: -69.821592
	// })

	// useEffect(() => {


		// getLocationByDriver()

		// setInterval(() => {
		// getLocationByDriver()
		// }, 5000)


		// const pharmacy = route.params.pharmacy;

		// console.log(pharmacy)

	// }, []);

	// const getLocationByDriver = async () => {

		// let { status } = await Location.requestForegroundPermissionsAsync();
		// if (status !== 'granted') {
		// 	setErrorMsg('Permission to access location was denied');
		// 	return;
		// }
		// let location = await Location.getCurrentPositionAsync({});


		// setOrigin({

		// 	latitude: location.coords.latitude,
		// 	longitude: location.coords.longitude
		// })

		// setLocation(location);
		// console.log(location.coords.latitude, location.coords.longitude)

	// }
	// AIzaSyAaYQAQ7DOfaoeIBHvEzuS43Wp1GQB5IbI
	return (
		<View >
			{/* <MapView style={styles.map} region={{
				latitude: origin.latitude,
				longitude: origin.longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421
			}} */}
				{/* // provider={PROVIDER_GOOGLE}
				// mapType="standard"
				// userInterfaceStyle={'dark'}
				showsUserLocation={true}
				userLocationUpdateInterval={5000}
				zoomControlEnabled={true}
				maxZoomLevel={100}
				scrollDuringRotateOrZoomEnabled={true}
				loadingEnabled={true}
				showsMyLocationButton

			// onUserLocationChange={(direction) => { */}
			{/* // 	console.log('osiris', direction.nativeEvent.coordinate)
			// 	setOrigin(direction.nativeEvent.coordinate)
			// }}  */}

			{/* > */}

				{/* <Marker coordinate={origin}
					key={100}
					title={"osiris"}
					description={"soler ramirez osiris ascanio"}
					onDragEnd={(direction) => {
						setOrigin(direction.nativeEvent.coordinate)
					}}
				>

					<Image source={require('../assets/images/motorcito.png')} style={{ height: 35, width: 35 }} />
				</Marker>
				<Marker draggable={false} coordinate={destination} /> */}


				{/* <MapViewDirections
					origin={origin}
					destination={destination}
					apikey={'AIzaSyAwW_8rADibAXCq6LmNvXiCVAXHDdqnKg4'}
					resetOnChange={false}
					timePrecision="none"
					precision="low"
					strokeColor="red"
					strokeWidth={4}
					mode="DRIVING"
					// optimizeWaypoints={true}
					// onStart={(params) => {
					// 	console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
					// }}
					onReady={result => {
						setDistance(result.distance)
						setduration(result.duration)
						console.log( result)

					}}
				/> */}

				{/* <View style={styles.buttun} > */}
					{/* <Text >distance :{distance} km.time:{duration} min</Text> */}
				{/* </View> */}


			{/* </MapView> */}
			<Text>aaaaa</Text> 
		</View>


	);
}

const styles = StyleSheet.create({
	map: {
		width: '100%',
		height: '100%'
	},
	marker: {
		width: '60px',
		height: '75px'
	},
	buttun: {
		backgroundColor: '#FCFBF9',
		width: '90%',
		height: '8%',
		position: 'absolute',
		bottom: 120,
		left: 25,
		borderRadius: 20,
		color: 'black',
		// textAlign:'center',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'


	}
})