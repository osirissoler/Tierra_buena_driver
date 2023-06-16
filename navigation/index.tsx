/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Button, ColorSchemeName, Pressable } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';

import Colors from '../constants/Colors';
import { Context } from '../Context';
import useColorScheme from '../hooks/useColorScheme';
import AcceptedOrders from '../screens/AcceptedOrdersScreen';
import HomeScreen from '../screens/HomeScreen';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import Osiris from '../screens/Osiris'
import SignUpScreen from '../screens/SignUpScreen';
import OrderProductsScreen from '../screens/OrderProductsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SignInScreen from '../screens/SignInScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
	return (
		<NavigationContainer linking={LinkingConfiguration} theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<RootNavigator />
		</NavigationContainer>
	);
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
	return (
		<Stack.Navigator screenOptions={{ animation: 'slide_from_right'}}>
			<Stack.Screen
				name='SignIn'
				component={SignInScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name='SignUpScreen'
				component={SignUpScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen name='Root' component={BottomTabNavigator} options={{ headerShown: false }} />
			<Stack.Screen
				name='OrderDetails'
				component={OrderDetailsScreen}
				options={{
					headerStyle: { backgroundColor: '#fff' },
					headerTitleStyle: { color: '#000', fontWeight: '400' }
				}}
			/>
			<Stack.Screen
				name='Osiris'
				component={Osiris}
				options={{
					headerStyle: { backgroundColor: '#fff' },
					headerTitleStyle: { color: '#000', fontWeight: '400' }
				}}
			/>
			<Stack.Screen
				name='AcceptedOrders'
				component={AcceptedOrders}
				options={{
					headerTitle: 'Accepted Orders',
					headerStyle: { backgroundColor: '#fff' },
					headerTitleStyle: { color: '#000', fontWeight: '400' }
				}}
			/>
			<Stack.Screen
				name='OrderProducts'
				component={OrderProductsScreen}
				options={{
					headerStyle: { backgroundColor: '#fff' },
					headerTitleStyle: { color: '#000', fontWeight: '400' }
				}}
			/>
			<Stack.Screen name='NotFound' component={NotFoundScreen} options={{ title: 'Oops!' }} />
			<Stack.Group screenOptions={{ presentation: 'modal' }}>
				<Stack.Screen name='Modal' component={ModalScreen} />
			</Stack.Group>
		</Stack.Navigator>
	);
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
	const colorScheme = useColorScheme();
	const { changeStatus, onlineStatus } = React.useContext(Context);

	return (
		<BottomTab.Navigator
			initialRouteName='Home'
			screenOptions={{
				tabBarActiveTintColor: '#60941A',
				tabBarStyle: {
					backgroundColor: '#fff',
					borderTopColor: 'rgba(0, 0, 0, 0.1)'
				}
			}}
		>
			<BottomTab.Screen
				name='Home'
				component={HomeScreen}
				options={{
					title: 'Orders',
					headerStyle: { backgroundColor: '#fff' },
					headerTitleStyle: { color: '#000', fontWeight: '400' },
					headerRightContainerStyle: {
						paddingRight: 10
					},
					headerRight: () => (
						<ToggleSwitch
							label='Online'
							isOn={onlineStatus}
							onColor={'#60941A'}
							onToggle={(isOn) => changeStatus(isOn)}
						/>
					),
					tabBarIcon: ({ color }) => <TabBarIcon name='home' color={color} />
				}}
			/>
			<BottomTab.Screen
				name='Profile'
				component={ProfileScreen}
				options={{
					title: 'Profile',
					headerStyle: { backgroundColor: '#fff' },
					headerTitleStyle: { color: '#000', fontWeight: '400' },
					tabBarIcon: ({ color }) => <TabBarIcon name='user' color={color} />
				}}
			/>
		</BottomTab.Navigator>
	);
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
	return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
