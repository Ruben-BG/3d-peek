import {Button, ButtonSize, Colors, Switch} from "react-native-ui-lib";
import {ConfigurationItemScreenView, ConfigurationItemTitle} from "@/components/configurationComponent";
import {DefaultView} from "@/components/commonComponents";

interface ConfigurationProps {
    tempDarkMode: boolean;
    handleDarkModeChange: (value: boolean) => void;
    saveChanges: () => Promise<void>;
}

export function Configuration({ tempDarkMode, handleDarkModeChange, saveChanges }: ConfigurationProps) {
    return(
        <DefaultView backgroundColor={Colors.$backgroundNeutral} centerItems={true}>
            <ConfigurationItemScreenView>
                <ConfigurationItemTitle>Modo escuro</ConfigurationItemTitle>
                <Switch
                    value={tempDarkMode}
                    onValueChange={handleDarkModeChange}
                    width={52}
                    height={32}
                    style={{
                        width: 52,
                        height: 32,
                    }}
                />
            </ConfigurationItemScreenView>

            <Button
                label={"Salvar alterações"}
                backgroundColor={Colors.$backgroundGeneralHeavy}
                onPress={saveChanges}
                size={ButtonSize.large}
                labelStyle={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: Colors.$textDefaultLight
                }}
                style={{
                    marginTop: 8,
                }}
            />
        </DefaultView>
    )
}