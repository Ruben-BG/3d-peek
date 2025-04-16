import {useRouter} from 'expo-router';
import {useEffect, useState} from "react";
import {Colors} from "react-native-ui-lib";
import {loadDarkMode, saveDarkMode} from "@/data/storage";
import {Preview} from "@/app/viewScreens/preview";
import {Configuration} from "@/app/viewScreens/configuration";
import {Dimensions, ToastAndroid} from "react-native";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import * as DocumentPicker from "expo-document-picker";

export const unstable_settings = {
    headerShown: true,
};

const initialLayout = { width: Dimensions.get('window').width };

export default function Home() {
    const router = useRouter();

    const [archive, setArchive] = useState<DocumentPicker.DocumentPickerResult | null>(null);
    const [viewDisabled, setViewDisabled] = useState(true);
    const [tempDarkMode, setTempDarkMode] = useState(false);

    //tabController
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'preview', title: 'Preview' },
        { key: 'configuration', title: 'Configuração' },
    ]);

    useEffect(() => {
        const initializeDarkMode = async () => {
            const isDarkMode = await loadDarkMode();
            setTempDarkMode(isDarkMode);
            Colors.setScheme(isDarkMode ? 'dark' : 'light');
        };

        void initializeDarkMode();
    }, []);

    const handleDarkModeChange = (value: boolean) => {
        setTempDarkMode(value);
        Colors.setScheme(value ? 'dark' : 'light');
    };

    const saveChanges = async () => {
        await saveDarkMode(tempDarkMode);
        ToastAndroid.show('Reinicie o aplicativo para aplicar as alterações corretamente.', ToastAndroid.LONG);
    };

    const renderScene = SceneMap({
        preview: () => (
            <Preview
                archive={archive}
                setArchive={setArchive}
                viewDisabled={viewDisabled}
                setViewDisabled={setViewDisabled}
                router={router}
            />
        ),
        configuration: () => (
            <Configuration
                tempDarkMode={tempDarkMode}
                handleDarkModeChange={handleDarkModeChange}
                saveChanges={saveChanges}
            />
        ),
    });

    return (
        <>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: Colors.$backgroundGeneralMedium }}
                        style={{ backgroundColor: Colors.$backgroundDefault }}
                        activeColor={Colors.$textGeneral}
                        inactiveColor={Colors.$textNeutral}
                    />
                )}
            />
        </>
    );
}
