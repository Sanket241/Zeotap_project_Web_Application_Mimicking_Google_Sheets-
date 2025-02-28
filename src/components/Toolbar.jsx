import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar as MuiToolbar,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  Add,
  Remove,
  Undo,
  Redo,
  ContentCopy,
  ContentPaste,
  ContentCut,
} from '@mui/icons-material';
import {
  updateCell,
  addRow,
  addColumn,
  deleteRow,
  deleteColumn,
  undo,
  redo,
} from '../store/spreadsheetSlice';

const Toolbar = () => {
  const dispatch = useDispatch();
  const { selectedRange, cells } = useSelector((state) => state.spreadsheet);

  const toggleFormat = (format) => {
    if (!selectedRange) return;

    const { start, end } = selectedRange;
    for (let row = start.row; row <= end.row; row++) {
      for (let col = start.col; col <= end.col; col++) {
        const cellId = `${col}:${row}`;
        const cell = cells[cellId];
        dispatch(updateCell({
          id: cellId,
          cell: {
            format: {
              ...(cell?.format || {}),
              [format]: !(cell?.format?.[format]),
            },
          },
        }));
      }
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <MuiToolbar variant="dense">
        <Tooltip title="Undo (Ctrl+Z)">
          <IconButton onClick={() => dispatch(undo())}>
            <Undo />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo (Ctrl+Y)">
          <IconButton onClick={() => dispatch(redo())}>
            <Redo />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Tooltip title="Cut (Ctrl+X)">
          <IconButton>
            <ContentCut />
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy (Ctrl+C)">
          <IconButton>
            <ContentCopy />
          </IconButton>
        </Tooltip>
        <Tooltip title="Paste (Ctrl+V)">
          <IconButton>
            <ContentPaste />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Tooltip title="Bold (Ctrl+B)">
          <IconButton onClick={() => toggleFormat('bold')}>
            <FormatBold />
          </IconButton>
        </Tooltip>
        <Tooltip title="Italic (Ctrl+I)">
          <IconButton onClick={() => toggleFormat('italic')}>
            <FormatItalic />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Tooltip title="Add Row">
          <IconButton onClick={() => dispatch(addRow())}>
            <Add />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Row">
          <IconButton onClick={() => selectedRange && dispatch(deleteRow(selectedRange.start.row))}>
            <Remove />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Tooltip title="Add Column">
          <IconButton onClick={() => dispatch(addColumn())}>
            <Add />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Column">
          <IconButton onClick={() => selectedRange && dispatch(deleteColumn(selectedRange.start.col))}>
            <Remove />
          </IconButton>
        </Tooltip>
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;
