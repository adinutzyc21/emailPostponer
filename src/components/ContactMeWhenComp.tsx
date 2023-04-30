import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Paper, MenuItem, Select } from '@mui/material';

export default function ContactMeWhenComp(props:
    {
        label: string,
        optionsRb: Array<string>,
        optionsSel: Array<string>,
        onChangeRb: (event: any, stateName: string) => void,
        onChangeSel: (event: any, stateName: string) => void,
        stateNameRb: string,
        stateNameSel: string,
        valueRb: string,
        valueSel: string,
        required: boolean
    }) {

    return (
        <Paper
            component="form"
            sx={{ padding: '2px 4px', margin: "20px 5px 200px" }}
        >
            <FormControl variant="standard" fullWidth required={props.required} aria-label='select around dropdown' >
                <FormLabel sx={{ fontSize: "12px" }}>{props.label}</FormLabel>
                <Select
                    id={props.label}
                    value={props.valueRb}
                    onChange={(event) => props.onChangeRb(event, props.stateNameRb)}
                >
                    {props.optionsRb.map(val =>
                        <MenuItem value={val}>{val}</MenuItem>
                    )}
                </Select>
                <Select
                    id={props.label}
                    value={props.valueSel}
                    onChange={(event) => props.onChangeSel(event, props.stateNameSel)}
                >
                    {props.optionsSel.map(val =>
                        <MenuItem value={val}>{val}</MenuItem>
                    )}
                </Select>
            </FormControl >
        </Paper>
    );
}