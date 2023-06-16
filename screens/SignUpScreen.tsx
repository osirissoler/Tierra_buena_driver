
import React, { useState, useCallback } from 'react';

import { Text, View, Linking, Alert, FlatList, TouchableOpacity, StyleSheet, TextInput, ScrollView, Button, Image, Modal, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ScreenContainer } from '../components/Shared';
import { Formik } from 'formik';
import * as yup from 'yup';
import { BottomPopup } from '../components/BottomPopup';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { BlurView } from 'expo-blur';
import { sendData } from '../httpRequests';
import Toast from 'react-native-root-toast';
import asyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen({ navigation }: any) {
    const [showLoading, setShowLoading]: any = useState(false);
    const [termAndCoditionAccepted, settermAndCoditionAccepted] = useState(false)

    const OpenURLButton = ({ url }: any) => {
        const handlePress = useCallback(async () => {
            // Checking if the link is supported for links with custom URL scheme.
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                // by some browser in the mobile
                await Linking.openURL(url);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        }, [url]);

        return <Text onPress={handlePress} style={{color:'#60941A'}}> Terms & Conditions</Text>;
    };

    const validationSchema = yup.object().shape({
        fullName: yup.string().required('First name is required' /* First name is required */),
        // phone: yup.string().required(translation.t('signUpPhoneNumberRequiredText') /* Phone number is required */),
        email: yup
            .string()
            .email('Please enter valid email') /* Please enter valid email */
            .required('Email is required') /* Email is required */,
        password: yup
            .string()
            .matches(
                /\w*[a-z]\w*/,
                'Password must have a small letter' /*Password must have a small letter */
            )
            .matches(
                /\w*[A-Z]\w*/,
                'Password must have a capital letter' /* Password must have a capital letter */
            )
            .matches(/\d/, 'Password must have a number' /* Password must have a number */)
            .min(
                8,
                ({ min }) =>
                    `Password must be at least ${min} characters` +
                    min /* `Password must be at least ${min} characters` */
            )
            .required('Password is required' /* Password is required */),
        passwordConfirmation: yup
            .string()
            .oneOf([yup.ref('password')], 'Passwords do not match' /* Passwords do not match */)
            .required('Confirm password is required'/* Confirm password is required */)
    });
    let popupRef: any = React.createRef();

    const onShowPopup = () => {
        popupRef.show();
    };
    const onClosePopup = () => {
        popupRef.close();
    };

    const navigateToHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Root', screen: 'Home' }]
        });
    };

    const login = (values: any) => {
        const url = '/auth/loginDriver';
        sendData(url, values)
            .then((response: any) => {
                if (Object.keys(response).length > 0) {
                    const driver = response['user'];
                    const data = {
                        driver_id: driver.id,
                        pharmacy_id: driver.pharmacy_id,
                        zip_code: driver.zip_code

                    };
                    asyncStorage.setItem('USER_LOGGED', JSON.stringify(data));
                    navigateToHome();
                } else showErrorToast('Wrong credentials');
            })
            .catch((error) => {
                showErrorToast('Error connecting with server, please try again later.');
                console.log(error);
            });
    };


    const onSignUp = (values: any) => {
        setShowLoading(true)
        const url = '/user/createDriverUser';
        const data = {
            first_name: values.fullName,
            email: values.email,
            password: values.password,
            active: 0,
            pharmacy_id: 530,
            zip_code: "admin"
        };
        sendData(url, data)
            .then((response: any) => {
                if (response.ok) {
                    setShowLoading(false)
                    showErrorToastGood(response.message);
                    login({ email: data.email, password: data.password })
                } else {
                    showErrorToast(response.message);
                    setShowLoading(false)
                }
            })
    }

    const showErrorToast = (message: string) => {
        Toast.show(message, {
            duration: Toast.durations.LONG,
            containerStyle: { backgroundColor: 'red', width: '80%' }
        });
    };

    const showErrorToastGood = (message: string) => {
        Toast.show(message, {
            duration: Toast.durations.LONG,
            containerStyle: { backgroundColor: '#128780', width: '80%' }
        });
    };

    function InputPassword({ handleChange, handleBlur, value, label, name }: any) {
        const [showPassword, setShowPassword]: any = useState(false);
        const [passwordIcon, setPasswordIcon]: any = useState('eye-slash');

        const toggleShowPassword = () => {
            if (showPassword) {
                setShowPassword(false);
                setPasswordIcon('eye-slash');
            } else {
                setShowPassword(true);
                setPasswordIcon('eye');
            }
        };

        return (
            <>
                <Text style={styles.labelInput}>{label}</Text>
                <View style={styles.formInputIcon}>
                    <TextInput
                        style={[styles.textInput, { zIndex: 1 }]}
                        onChangeText={handleChange(name)}
                        onBlur={handleBlur(name)}
                        value={value}
                        secureTextEntry={!showPassword}
                        keyboardType={!showPassword ? undefined : 'visible-password'}
                    />
                    <FontAwesome
                        style={ showPassword ? styles.inputIcon1:styles.inputIcon2 }
                        name={passwordIcon}
                        size={16}
                        onPress={() => toggleShowPassword()}
                    />
                    {/*  color: "#E6241B" */}
                </View>
            </>
        );
    }



    const supportedURL = "https://coopharma-83beb.web.app/termsandconditions";

    return (
        <ScreenContainer style={{ backgroundColor: '#fff', flex: 1 }} keyboard={true}>
            <View style={styles.header}>
                <Image style={styles.logo} source={require('../assets/images/buena2.png')} />
            </View>
            <View style={styles.body}>
                <Text style={styles.title}>Create account</Text>
                <Formik validationSchema={validationSchema} initialValues={{
                    fullName: '',
                    email: '',
                    password: '',
                    passwordConfirmation: ''
                }} onSubmit={(values) => { onSignUp(values) }}

                >
                    {({ handleChange, handleBlur, handleSubmit, values, isValid, errors, touched }: any) => (
                        <View>
                            <Text style={styles.labelInput}>Full Name</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={handleChange('fullName')}
                                onBlur={handleBlur('fullName')}
                                value={values.fullName}
                            />
                            <Text style={styles.labelInput}>Email</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                            />
                            <InputPassword
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                value={values.password}
                                label='Password'
                                name={'password'}
                            />
                            <InputPassword
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                value={values.passwordConfirmation}
                                label='Password Confirmation'
                                name={'passwordConfirmation'}
                            />

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 20,

                            }}>
                                {/* <Text style={styles.termCoditions}> */}
                                <BouncyCheckbox
                                    size={25}
                                    fillColor="#60941A"
                                    textStyle={{
                                        textDecorationLine: "none",
                                        // color: ""
                                    }}


                                    disableText
                                    text={'Terms & Conditions'}

                                    onPress={(isChecked: boolean) => { settermAndCoditionAccepted(isChecked); }}


                                />

                                <OpenURLButton url={supportedURL} />

                            </View>

                            <TouchableOpacity
                                disabled={!termAndCoditionAccepted}
                                style={termAndCoditionAccepted ? styles.registerButton : styles.registerButtonDisabled}
                                onPress={() => (Object.keys(errors).length > 0 ? onShowPopup() : handleSubmit())}
                            >
                                <Text style={styles.registerButtonText} >
                                    Register
                                </Text>
                            </TouchableOpacity>
                            <BottomPopup
                                ref={(target: any) => (popupRef = target)}
                                onTouchOutside={onClosePopup}
                                title={'Alert'}
                                errors={errors}
                            />

                        </View>


                    )}

                </Formik>

            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,

            }}>
                <Text style={styles.registerText}>
                    Already have an account?
                </Text>
                <Text style={styles.registerLink} onPress={() => navigation.navigate('SignIn')}>
                    Sign In
                </Text>
            </View>

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
                    // loading
                    >
                        <ActivityIndicator size='large' color='#128780' />
                        <Text style={{ marginTop: 20, fontSize: 16 }}>Loading...</Text>
                    </View>
                </BlurView>
            </Modal>
        </ScreenContainer>

    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        // backgroundColor: "#fff",
        alignItems: "center",
        marginTop: 20,
        // padding: 16,

    },
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
        flexDirection: 'row',
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
        backgroundColor: '6#0941A',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginVertical: 30
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 18
    },
    registerText: {
        textAlign: 'center',
        fontSize: 14
    },
    registerLink: {
        padding: 5,
        color: '#60941A'
    },
    registerButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#60941A',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 20
    },
    registerButtonDisabled: {
        width: '100%',
        height: 50,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 20
    },
    registerButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight:'700'
        
    },

});