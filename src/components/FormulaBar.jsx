import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, TextField } from '@mui/material';
import { updateCell, pushUndo } from '../store/spreadsheetSlice';
import { evaluateFormula, cellIdToReference } from '../utils/formulaEngine';

const FormulaBar = () => {
  const dispatch = useDispatch();
  const { selectedRange, cells } = useSelector((state) => state.spreadsheet);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!selectedRange) return;

    const cellId = `${selectedRange.start.col}:${selectedRange.start.row}`;
    const cell = cells[cellId];
    setValue(cell?.formula || cell?.value || '');
  }, [selectedRange, cells]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && selectedRange) {
      event.preventDefault();
      
      const cellId = `${selectedRange.start.col}:${selectedRange.start.row}`;
      dispatch(pushUndo());
      dispatch(updateCell({
        id: cellId,
        cell: {
          value: value,
          formula: value.toString().startsWith('=') ? value : '',
          computedValue: value.toString().startsWith('=')
            ? evaluateFormula(value, {
                getCellValue: (ref) => cells[ref]?.computedValue,
                getCurrentCell: () => cellIdToReference(cellId),
              })
            : value,
        },
      }));
    }
  };

  return (
    <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
      <TextField
        fullWidth
        size="small"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter a value or formula (e.g. =SUM(A1:A10))"
        sx={{ backgroundColor: 'background.paper' }}
      />
    </Box>
  );
};

export default FormulaBar;
