import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BusinessIcon from '@mui/icons-material/Business';
import { IconTypes } from '../types';

export function getIcon(iconName: IconTypes) {
    switch (iconName) {
        case IconTypes.field1Icon:
            return <PersonAddIcon />;
        case IconTypes.field2Icon:
            return <BusinessIcon />;
        default:
            return <PersonAddIcon />;
    }
}