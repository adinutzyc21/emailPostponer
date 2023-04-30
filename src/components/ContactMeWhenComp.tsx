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
    }) {

    return (
        <Paper
            component="form"
            sx={{ padding: '2px 4px', margin: "20px 5px 200px" }}
        >
            <FormControl variant="standard" sx={{ ml: 1 }} aria-label='select radiobutton'>
                <FormLabel sx={{ fontSize: "12px" }}>{props.label}</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name={props.label}
                    value={props.valueRb}
                    onChange={(event) => props.onChangeRb(event, props.stateNameRb)}
                >
                    {props.optionsRb.map(val =>
                        <FormControlLabel value={val} control={<Radio />} label={val} />
                    )}
                </RadioGroup>
                <Select
                    labelId={props.label}
                    id={props.label}
                    value={props.valueSel}
                    label={props.label}
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