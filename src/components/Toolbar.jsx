import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar as MuiToolbar,
  IconButton,
  Tooltip,
  Divider,
  Button,
  Menu,
  MenuItem,
  Stack,
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
  Search,
  FormatColorText,
  FormatSize,
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
import FindReplaceDialog from './FindReplaceDialog';

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 44, 48];
const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
];

const Toolbar = () => {
  const dispatch = useDispatch();
  const { selectedRange, cells } = useSelector((state) => state.spreadsheet);
  const [findReplaceOpen, setFindReplaceOpen] = useState(false);
  const [fontSizeAnchor, setFontSizeAnchor] = useState(null);
  const [colorAnchor, setColorAnchor] = useState(null);

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
            ...cell,
            format: {
              ...(cell?.format || {}),
              [format]: !(cell?.format?.[format]),
            },
          },
        }));
      }
    }
  };

  const handleFontSize = (size) => {
    if (!selectedRange) return;

    const { start, end } = selectedRange;
    for (let row = start.row; row <= end.row; row++) {
      for (let col = start.col; col <= end.col; col++) {
        const cellId = `${col}:${row}`;
        const cell = cells[cellId];
        dispatch(updateCell({
          id: cellId,
          cell: {
            ...cell,
            format: {
              ...(cell?.format || {}),
              fontSize: size,
            },
          },
        }));
      }
    }
    setFontSizeAnchor(null);
  };

  const handleColor = (color) => {
    if (!selectedRange) return;

    const { start, end } = selectedRange;
    for (let row = start.row; row <= end.row; row++) {
      for (let col = start.col; col <= end.col; col++) {
        const cellId = `${col}:${row}`;
        const cell = cells[cellId];
        dispatch(updateCell({
          id: cellId,
          cell: {
            ...cell,
            format: {
              ...(cell?.format || {}),
              color,
            },
          },
        }));
      }
    }
    setColorAnchor(null);
  };

  return (
    <>
      <AppBar position="static" color="default">
        <MuiToolbar variant="dense">
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Undo">
              <IconButton onClick={() => dispatch(undo())}>
                <Undo />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo">
              <IconButton onClick={() => dispatch(redo())}>
                <Redo />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Cut">
              <IconButton>
                <ContentCut />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy">
              <IconButton>
                <ContentCopy />
              </IconButton>
            </Tooltip>
            <Tooltip title="Paste">
              <IconButton>
                <ContentPaste />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Bold">
              <IconButton onClick={() => toggleFormat('bold')}>
                <FormatBold />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic">
              <IconButton onClick={() => toggleFormat('italic')}>
                <FormatItalic />
              </IconButton>
            </Tooltip>
            <Tooltip title="Font Size">
              <IconButton onClick={(e) => setFontSizeAnchor(e.currentTarget)}>
                <FormatSize />
              </IconButton>
            </Tooltip>
            <Tooltip title="Text Color">
              <IconButton onClick={(e) => setColorAnchor(e.currentTarget)}>
                <FormatColorText />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Add Row">
              <IconButton onClick={() => dispatch(addRow())}>
                <Add />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Row">
              <IconButton onClick={() => selectedRange && dispatch(deleteRow({ rowIndex: selectedRange.start.row }))}>
                <Remove />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Column">
              <IconButton onClick={() => dispatch(addColumn())}>
                <Add />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Column">
              <IconButton onClick={() => selectedRange && dispatch(deleteColumn({ colIndex: selectedRange.start.col }))}>
                <Remove />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Find and Replace">
              <IconButton onClick={() => setFindReplaceOpen(true)}>
                <Search />
              </IconButton>
            </Tooltip>
          </Stack>
        </MuiToolbar>
      </AppBar>

      <Menu
        anchorEl={fontSizeAnchor}
        open={Boolean(fontSizeAnchor)}
        onClose={() => setFontSizeAnchor(null)}
      >
        {FONT_SIZES.map((size) => (
          <MenuItem key={size} onClick={() => handleFontSize(size)}>
            {size}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={colorAnchor}
        open={Boolean(colorAnchor)}
        onClose={() => setColorAnchor(null)}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4, padding: 8 }}>
          {COLORS.map((color) => (
            <div
              key={color}
              onClick={() => handleColor(color)}
              style={{
                width: 20,
                height: 20,
                backgroundColor: color,
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </Menu>

      <FindReplaceDialog
        open={findReplaceOpen}
        onClose={() => setFindReplaceOpen(false)}
      />
    </>
  );
};

export default Toolbar;
