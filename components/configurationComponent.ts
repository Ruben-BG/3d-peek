import styled from 'styled-components/native';
import { Colors } from 'react-native-ui-lib';

interface DefaultViewProps {
    backgroundColor?: string;
    textColor?: string;
}

export const ConfigurationItemScreenView = styled.View<DefaultViewProps>`
    width: 85%;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    padding: 8px 20px;
    border-radius: 10px;
    background-color: ${({ backgroundColor }) => backgroundColor || Colors.$backgroundDefault};
`;

export const ConfigurationItemTitle = styled.Text<DefaultViewProps>`
    font-size: 20px;
    font-weight: bold;
    color: ${({ textColor }) => textColor || Colors.$textDefault};
    font-family: 'WixMadeforText';
`;
