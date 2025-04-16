import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { LoaderScreen, Colors } from 'react-native-ui-lib';
import { useEffect } from 'react';
import { loadDarkMode } from '@/data/storage';

export default function Layout() {
    const [fontsLoaded] = useFonts({
        'WixMadeforText': require('../assets/fonts/WixMadeforText-VariableFont_wght.ttf'),
        'WixMadeforTextItalic': require('../assets/fonts/WixMadeforText-Italic-VariableFont_wght.ttf'),
    });

    useEffect(() => {
        const initializeDarkMode = async () => {
            const isDarkMode = await loadDarkMode();
            Colors.setScheme(isDarkMode ? 'dark' : 'light');
        };

        void initializeDarkMode();
    }, []);

    if (!fontsLoaded) {
        return <LoaderScreen color={Colors.$textPrimary} />;
    }

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: '3D Peek',
                    headerTitleAlign: 'left',
                    headerTitleStyle: {
                        fontSize: 24,
                        fontWeight: 'bold',
                        fontFamily: 'WixMadeforText',
                        color: Colors.$textPrimary,
                    },
                    headerStyle: {
                        backgroundColor: Colors.$backgroundDefault,
                    },
                    statusBarBackgroundColor: Colors.$backgroundGeneralHeavy,
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name="view"
                options={{
                    title: 'Visualização',
                    headerTitleAlign: 'left',
                    headerBackTitle: 'Voltar',
                    headerTitleStyle: {
                        fontSize: 24,
                        fontWeight: 'bold',
                        fontFamily: 'WixMadeforText',
                        color: Colors.$textPrimary,
                    },
                    headerStyle: {
                        backgroundColor: Colors.$backgroundDefault,
                    },
                    statusBarBackgroundColor: Colors.$backgroundGeneralHeavy,
                }}
            />
        </Stack>
    );
}