import { Switch, SwitchProps } from '@mui/material';

interface CustomSwitchProps extends SwitchProps {
    inputRef?: React.Ref<HTMLInputElement>;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function CustomSwitch({ inputRef, checked, onChange, ...props }: CustomSwitchProps) {
    return (
        <Switch
            {...props}
            checked={checked}
            onChange={onChange}
            inputRef={inputRef}
            sx={{
                '& .MuiSwitch-track': {
                    backgroundColor: 'gray',
                    opacity: 1,
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#8257e5',
                    opacity: 1
                },
                ...props.sx,
            }}
        />
    );
}

export default CustomSwitch;