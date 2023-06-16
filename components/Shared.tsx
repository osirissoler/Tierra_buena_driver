import React from 'react';
import {
	Platform,
	SafeAreaView,
	StyleSheet,
	KeyboardAvoidingView,
	StatusBar,
	Modal,
	View,
	ActivityIndicator,
	Text
} from 'react-native';
import asyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

export const ScreenContainer = ({ children, style, keyboard }: any) => {
	return (
		<SafeAreaView
			style={
				!!style
					? [style, { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]
					: styles.container
			}
		>
			{keyboard ? (
				<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'position'}>
					{children}
				</KeyboardAvoidingView>
			) : (
				<>{children}</>
			)}
		</SafeAreaView>
	);
};

export const Loading = ({ showLoading }: any) => {
	return (
		<Modal visible={showLoading} transparent animationType='fade'>
			<BlurView intensity={80} tint={'dark'} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<View
					style={{
						height: 120,
						backgroundColor: '#fff',
						width: 150,
						borderRadius: 20,
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<ActivityIndicator size='large' color='#128780' />
					<Text style={{ marginTop: 20, fontSize: 16 }}>{'Loading'}</Text>
				</View>
			</BlurView>
		</Modal>
	);
};

export const hideLoadingModal = (setShowLoading: any, callback: Function) => {
	setTimeout(() => {
		setShowLoading(false);
		callback();
	}, 1500);
};

export const checkStorage = (key: string, callback: any) => {
	const data = asyncStorage.getItem(key);
	data.then((response: any) => {
		callback(response);
	});
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
	}
});
