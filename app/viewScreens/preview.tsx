import * as DocumentPicker from 'expo-document-picker';
import {Button, Colors} from "react-native-ui-lib";
import {
    PreviewItemScreenView,
    PreviewItemSubtitle,
    PreviewItemTitle,
    PreviewItemTitleAndSubtitle
} from "@/components/previewComponent";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Router} from "expo-router";
import {DefaultView} from "@/components/commonComponents";

interface PreviewProps {
    archive: DocumentPicker.DocumentPickerResult | null;
    setArchive: (archive: DocumentPicker.DocumentPickerResult | null) => void;
    viewDisabled: boolean;
    setViewDisabled: (disabled: boolean) => void;
    router: Router;
}

export function Preview({ archive, setArchive, viewDisabled, setViewDisabled, router }: PreviewProps) {
    const handleImport = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['model/gltf+json', 'model/gltf-binary', 'application/octet-stream'],
                copyToCacheDirectory: true,
            });

            if (result.assets) {
                console.log('Arquivo selecionado:', result.assets[0]);
                setArchive(result);
                setViewDisabled(false);
            } else {
                console.log('Seleção de arquivo cancelada');
                setArchive(null);
                setViewDisabled(true);
            }
        } catch (error) {
            console.error('Erro ao selecionar arquivo:', error);
        }
    };

    return (
        <DefaultView>
            <PreviewItemScreenView>
                <PreviewItemTitleAndSubtitle>
                    <PreviewItemTitle>Selecione o objeto 3D</PreviewItemTitle>
                    <PreviewItemSubtitle>
                        {archive != null && archive.assets != null ? archive.assets[0].name : ''}
                    </PreviewItemSubtitle>
                </PreviewItemTitleAndSubtitle>
                <Button
                    label={'Importar'}
                    backgroundColor={Colors.$backgroundGeneralHeavy}
                    onPress={handleImport}
                    labelStyle={{
                        fontSize: 16,
                        color: Colors.$textDefaultLight,
                        fontWeight: 'bold',
                        marginEnd: 8,
                    }}
                    iconSource={
                        () =>
                            <MaterialCommunityIcons
                                name="import"
                                size={20}
                                color={Colors.$textDefaultLight}
                            />
                    }
                    iconOnRight={true}
                    style={{
                        height: 42,
                    }}
                />
            </PreviewItemScreenView>
            <Button
                disabled={viewDisabled}
                label={'Visualizar'}
                backgroundColor={Colors.$backgroundDefault}
                onPress={() => router.push({ pathname: '/view', params: { archive: JSON.stringify(archive) } })}
                labelStyle={{
                    fontSize: 20,
                    color: viewDisabled ? Colors.$textNeutral : Colors.$textGeneral,
                    fontWeight: 'bold',
                    marginStart: 8,
                }}
                iconSource={
                    () =>
                        <MaterialCommunityIcons
                            name="cube"
                            size={24}
                            color={viewDisabled ? Colors.$textNeutral : Colors.$textGeneral}
                        />
                }
                style={{
                    width: '100%',
                    height: 60,
                    borderRadius: 0,
                }}
            />
        </DefaultView>
    );
}