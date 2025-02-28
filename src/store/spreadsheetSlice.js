import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cells: {},
  rows: 100,
  columns: 26,
  selectedRange: null,
  undoStack: [],
  redoStack: [],
  findReplaceState: {
    findText: '',
    replaceText: '',
    matchCase: false,
    matchWholeCell: false,
  },
};

const spreadsheetSlice = createSlice({
  name: 'spreadsheet',
  initialState,
  reducers: {
    updateCell: (state, action) => {
      const { id, cell } = action.payload;
      state.cells[id] = {
        ...state.cells[id],
        ...cell,
      };
    },
    updateCellBatch: (state, action) => {
      const { updates } = action.payload;
      updates.forEach(({ id, cell }) => {
        state.cells[id] = {
          ...state.cells[id],
          ...cell,
        };
      });
    },
    setSelectedRange: (state, action) => {
      state.selectedRange = action.payload;
    },
    addRow: (state) => {
      state.rows += 1;
    },
    deleteRow: (state, action) => {
      const { rowIndex } = action.payload;
      // Remove cells in the row
      Object.keys(state.cells).forEach(key => {
        const [col, row] = key.split(':').map(Number);
        if (row === rowIndex) {
          delete state.cells[key];
        } else if (row > rowIndex) {
          // Move cells up
          const newKey = `${col}:${row - 1}`;
          state.cells[newKey] = state.cells[key];
          delete state.cells[key];
        }
      });
      state.rows -= 1;
    },
    addColumn: (state) => {
      state.columns += 1;
    },
    deleteColumn: (state, action) => {
      const { colIndex } = action.payload;
      // Remove cells in the column
      Object.keys(state.cells).forEach(key => {
        const [col, row] = key.split(':').map(Number);
        if (col === colIndex) {
          delete state.cells[key];
        } else if (col > colIndex) {
          // Move cells left
          const newKey = `${col - 1}:${row}`;
          state.cells[newKey] = state.cells[key];
          delete state.cells[key];
        }
      });
      state.columns -= 1;
    },
    pushUndo: (state) => {
      state.undoStack.push(JSON.stringify(state.cells));
      state.redoStack = [];
    },
    undo: (state) => {
      if (state.undoStack.length > 0) {
        const prevState = state.undoStack.pop();
        state.redoStack.push(JSON.stringify(state.cells));
        state.cells = JSON.parse(prevState);
      }
    },
    redo: (state) => {
      if (state.redoStack.length > 0) {
        const nextState = state.redoStack.pop();
        state.undoStack.push(JSON.stringify(state.cells));
        state.cells = JSON.parse(nextState);
      }
    },
    setFindReplaceState: (state, action) => {
      state.findReplaceState = {
        ...state.findReplaceState,
        ...action.payload,
      };
    },
    findAndReplace: (state, action) => {
      const { findText, replaceText, matchCase, matchWholeCell } = state.findReplaceState;
      
      Object.entries(state.cells).forEach(([id, cell]) => {
        const value = cell.value?.toString() || '';
        let shouldReplace = false;
        
        if (matchWholeCell) {
          shouldReplace = matchCase
            ? value === findText
            : value.toLowerCase() === findText.toLowerCase();
        } else {
          shouldReplace = matchCase
            ? value.includes(findText)
            : value.toLowerCase().includes(findText.toLowerCase());
        }
        
        if (shouldReplace) {
          const newValue = matchWholeCell
            ? replaceText
            : value.replace(
                new RegExp(findText, matchCase ? 'g' : 'gi'),
                replaceText
              );
          
          state.cells[id] = {
            ...cell,
            value: newValue,
            computedValue: newValue,
          };
        }
      });
    },
  },
});

export const {
  updateCell,
  updateCellBatch,
  setSelectedRange,
  addRow,
  deleteRow,
  addColumn,
  deleteColumn,
  pushUndo,
  undo,
  redo,
  setFindReplaceState,
  findAndReplace,
} = spreadsheetSlice.actions;

export default spreadsheetSlice.reducer;
