import styled from 'styled-components/native';
import { Colors } from 'react-native-ui-lib';

interface DefaultViewProps {
    borderColor?: string;
    textColor?: string;
}

export const PreviewItemScreenView = styled.View<DefaultViewProps>`
    width: 100%;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    align-items: center;
    padding: 16px 0px;
    border-bottom-color: ${({ borderColor }) => borderColor || Colors.$outlineNeutralHeavy};
    border-bottom-width: 1px;
    border-bottom-style: solid;
`;

export const PreviewItemTitleAndSubtitle = styled.View`
    width: 56%;
    flex-direction: column;
    justify-content: flex-start;
`;

export const PreviewItemTitle = styled.Text<DefaultViewProps>`
    font-size: 20px;
    font-weight: bold;
    color: ${({ textColor }) => textColor || Colors.$textDefault};
    font-family: 'WixMadeforText';
    margin-bottom: 6px;
`;

export const PreviewItemSubtitle = styled.Text<DefaultViewProps>`
    font-size: 15px;
    color: ${({ textColor }) => textColor || Colors.$textNeutralHeavy};
    font-family: 'WixMadeforTextItalic';
`;