import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
} from '@mui/material';
import { setFindReplaceState, findAndReplace } from '../store/spreadsheetSlice';

const FindReplaceDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const findReplaceState = useSelector((state) => state.spreadsheet.findReplaceState);

  const handleChange = (field) => (event) => {
    dispatch(setFindReplaceState({
      [field]: field === 'matchCase' || field === 'matchWholeCell'
        ? event.target.checked
        : event.target.value,
    }));
  };

  const handleReplace = () => {
    dispatch(findAndReplace());
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Find and Replace</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Find"
            value={findReplaceState.findText}
            onChange={handleChange('findText')}
            fullWidth
          />
          <TextField
            label="Replace with"
            value={findReplaceState.replaceText}
            onChange={handleChange('replaceText')}
            fullWidth
          />
          <Stack direction="row" spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={findReplaceState.matchCase}
                  onChange={handleChange('matchCase')}
                />
              }
              label="Match case"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={findReplaceState.matchWholeCell}
                  onChange={handleChange('matchWholeCell')}
                />
              }
              label="Match whole cell"
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleReplace}
          variant="contained"
          disabled={!findReplaceState.findText}
        >
          Replace All
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FindReplaceDialog;
