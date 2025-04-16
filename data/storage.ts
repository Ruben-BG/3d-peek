import AsyncStorage from '@react-native-async-storage/async-storage';

const DARK_MODE_KEY = 'isDarkMode';

export const saveDarkMode = async (isDarkMode: boolean): Promise<void> => {
    try {
        await AsyncStorage.setItem(DARK_MODE_KEY, isDarkMode.toString());
    } catch (error) {
        console.error('Erro ao salvar modo escuro no AsyncStorage:', error);
    }
};

export const loadDarkMode = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem(DARK_MODE_KEY);
        return value === 'true';
    } catch (error) {
        console.error('Erro ao carregar modo escuro do AsyncStorage:', error);
        return false;
    }
};