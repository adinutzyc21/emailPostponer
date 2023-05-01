import { FormControl, FormHelperText, Paper, Input, InputLabel, IconButton, InputAdornment } from '@mui/material';

export default function MyFormInput(props:
    {
        label: string,
        value: string,
        startIcon?: JSX.Element,
        endIconBtn?: JSX.Element,
        helperText: string,
        stateName: string,
        onClick?: (stateName: string) => void,
        onChange: (event: any, stateName: string) => void,
        required?: boolean,
        disabled?: boolean,
    }) {
    return (
        <Paper
            component="form"
            sx={{ padding: '2px 4px', display: 'flex', alignItems: 'left', margin: "16px 0px 0px" }}
        >
            <FormControl variant="standard" required={props.required} disabled={props.disabled} sx={{ ml: 1, flex: 1 }} aria-label='paste text here'>
                <InputLabel htmlFor="component-helper">{props.label}</InputLabel>
                <Input
                    id="component-helper" value={props.value}
                    onChange={(event) => props.onChange(event, props.stateName)}
                    aria-describedby="component-helper-text"
                    startAdornment={
                        props.startIcon && (
                            <InputAdornment position="start">
                                {props.startIcon}
                            </InputAdornment>
                        )
                    }
                />
                <FormHelperText id="component-helper-text">
                    {props.helperText}
                </FormHelperText>
            </FormControl>
            {props.endIconBtn && (
                <IconButton color="primary" sx={{ p: '10px' }} aria-label="paste" onClick={() => props.onClick?.(props.stateName)}>
                    {props.endIconBtn}
                </IconButton>
            )}
        </Paper >
    );
}
