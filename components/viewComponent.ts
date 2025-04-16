import styled from 'styled-components/native';
import {Colors} from "react-native-ui-lib";

interface DefaultViewProps {
    backgroundColor?: string;
    textColor?: string;
}

export const ViewErrorContainer = styled.View<DefaultViewProps>`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: ${({ backgroundColor }) => backgroundColor || Colors.$backgroundDefault};
`;

export const ViewGeneralText = styled.Text<DefaultViewProps>`
    font-size: 24px;
    font-weight: bold;
    color: ${({ textColor }) => textColor || Colors.$textDanger};
    font-family: 'WixMadeforText';
`;

export const ViewModelContainer = styled.View<DefaultViewProps>`
    flex: 1;
    width: 100%;
    background-color: ${({ backgroundColor }) => backgroundColor || Colors.$backgroundNeutralLight};
`
