import { FormControl, MenuItem, TextField } from "@mui/material";

const ScopeDropdown = ({ setFilterScope, filterScope }) => (
    <FormControl>
        <TextField
            select
            label="Filter by Scope"
            value={filterScope}
            onChange={(e) => setFilterScope(e.target.value)}
        >
            <MenuItem value="All Scopes">All Scopes</MenuItem>
            <MenuItem value="Scope 1">Scope 1</MenuItem>
            <MenuItem value="Scope 2">Scope 2</MenuItem>
            <MenuItem value="Scope 3">Scope 3</MenuItem>
        </TextField>
        
    </FormControl>
);

export default ScopeDropdown;