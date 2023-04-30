import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Paper, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';

export default function SelectOrRbComp(props:
    {
        options: Array<string>,
        onChange: (event: any, stateName: string) => void,
        stateName: string,
        label: string,
        value: string,
        required: boolean
    }) {

    return (
        <Paper
            component="form"
            sx={{ padding: '2px 4px', margin: "20px 5px 200px" }}
        >
            {props.options.length < 5 ? <FormControl variant="standard" sx={{ ml: 1 }} aria-label='select radiobutton' required={props.required}>
                <FormLabel sx={{ fontSize: "12px" }}>{props.label}</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name={props.label}
                    value={props.value}
                    onChange={(event) => props.onChange(event, props.stateName)}
                >
                    {props.options.map(val =>
                        <FormControlLabel value={val} control={<Radio />} label={val} />
                    )}
                </RadioGroup>
            </FormControl > : <FormControl variant="standard" fullWidth>
                <InputLabel id={props.label}>{props.label}</InputLabel>
                <Select
                    labelId={props.label}
                    id={props.label}
                    value={props.value}
                    label={props.label}
                    onChange={(event) => props.onChange(event, props.stateName)}
                >
                    {props.options.map(val =>
                        <MenuItem value={val}>{val}</MenuItem>
                    )}
                </Select>
                <FormHelperText>Select {props.label}</FormHelperText>
            </FormControl>}
        </Paper>
    );
}