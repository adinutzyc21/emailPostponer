import { InputLabel, Select, MenuItem, FormControl, Paper, FormHelperText } from '@mui/material';

export default function MySelect(props:
    {
        options: Array<string>,
        onChange: (event: any, stateName: string) => void,
        stateName: string,
        label: string,
        value: string
    }) {
    return (
        <Paper
            component="form"
            sx={{ padding: '2px 4px', margin: "20px 5px 200px" }}
        >
            <FormControl variant="standard" fullWidth>
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
            </FormControl>
        </Paper>
    );
}