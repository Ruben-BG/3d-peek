import styled from 'styled-components/native';
import {Colors} from "react-native-ui-lib";

interface DefaultViewProps {
    backgroundColor?: string;
    centerItems?: boolean;
}

export const DefaultView = styled.View<DefaultViewProps>`
    flex: 1;
    background-color: ${({ backgroundColor }) => backgroundColor || Colors.$backgroundDefault};
    align-items: ${({ centerItems }) => centerItems ? 'center' : 'flex-start'};
`;
