import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cells: {},
  rows: 100,
  columns: 26, // A to Z
  selectedRange: null,
  copiedRange: null,
  undoStack: [],
  redoStack: [],
};

const spreadsheetSlice = createSlice({
  name: 'spreadsheet',
  initialState,
  reducers: {
    updateCell(state, action) {
      const { id, cell } = action.payload;
      state.cells[id] = { ...state.cells[id], ...cell };
    },
    setSelectedRange(state, action) {
      state.selectedRange = action.payload;
    },
    setCopiedRange(state, action) {
      state.copiedRange = action.payload;
    },
    addRow(state) {
      state.rows += 1;
    },
    addColumn(state) {
      state.columns += 1;
    },
    deleteRow(state, action) {
      if (state.rows > 1) {
        state.rows -= 1;
        // Clean up cells in the deleted row
        Object.keys(state.cells).forEach(key => {
          const [col, row] = key.split(':').map(Number);
          if (row === action.payload) {
            delete state.cells[key];
          }
        });
      }
    },
    deleteColumn(state, action) {
      if (state.columns > 1) {
        state.columns -= 1;
        // Clean up cells in the deleted column
        Object.keys(state.cells).forEach(key => {
          const [col, row] = key.split(':').map(Number);
          if (col === action.payload) {
            delete state.cells[key];
          }
        });
      }
    },
    pushUndo(state) {
      state.undoStack.push(JSON.parse(JSON.stringify({
        cells: state.cells,
        rows: state.rows,
        columns: state.columns,
      })));
      state.redoStack = [];
    },
    undo(state) {
      if (state.undoStack.length > 0) {
        const previousState = state.undoStack.pop();
        state.redoStack.push(JSON.parse(JSON.stringify({
          cells: state.cells,
          rows: state.rows,
          columns: state.columns,
        })));
        state.cells = previousState.cells;
        state.rows = previousState.rows;
        state.columns = previousState.columns;
      }
    },
    redo(state) {
      if (state.redoStack.length > 0) {
        const nextState = state.redoStack.pop();
        state.undoStack.push(JSON.parse(JSON.stringify({
          cells: state.cells,
          rows: state.rows,
          columns: state.columns,
        })));
        state.cells = nextState.cells;
        state.rows = nextState.rows;
        state.columns = nextState.columns;
      }
    },
  },
});

export const {
  updateCell,
  setSelectedRange,
  setCopiedRange,
  addRow,
  addColumn,
  deleteRow,
  deleteColumn,
  pushUndo,
  undo,
  redo,
} = spreadsheetSlice.actions;

export default spreadsheetSlice.reducer;
