import React, { useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateCell,
  setSelectedRange,
  pushUndo,
} from '../store/spreadsheetSlice';
import {
  evaluateFormula,
  columnIndexToLetter,
  cellIdToReference,
} from '../utils/formulaEngine';

const Spreadsheet = () => {
  const dispatch = useDispatch();
  const { cells, rows, columns } = useSelector((state) => state.spreadsheet);

  const createColumnDefs = useCallback(() => {
    const headerCol = {
      headerName: '',
      field: 'rowHeader',
      width: 50,
      pinned: 'left',
      suppressMovable: true,
      cellStyle: { backgroundColor: '#f8f9fa' },
    };

    const dataCols = Array.from({ length: columns }, (_, i) => ({
      headerName: columnIndexToLetter(i),
      field: `col${i}`,
      width: 100,
      editable: true,
      valueGetter: (params) => {
        const cellId = `${i}:${params.node.rowIndex}`;
        const cell = cells[cellId];
        return cell?.computedValue ?? '';
      },
      valueSetter: (params) => {
        const cellId = `${i}:${params.node.rowIndex}`;
        const value = params.newValue;
        
        dispatch(pushUndo());
        dispatch(updateCell({
          id: cellId,
          cell: {
            value,
            formula: value?.toString().startsWith('=') ? value : '',
            computedValue: value?.toString().startsWith('=')
              ? evaluateFormula(value, {
                  getCellValue: (ref) => cells[ref]?.computedValue,
                  getCellRange: (start, end) => {
                    const values = [];
                    for (let row = start.row; row <= end.row; row++) {
                      for (let col = start.col; col <= end.col; col++) {
                        const ref = `${col}:${row}`;
                        values.push(cells[ref]?.computedValue);
                      }
                    }
                    return values;
                  },
                })
              : value,
          },
        }));
        return true;
      },
      cellStyle: (params) => {
        const cellId = `${i}:${params.node.rowIndex}`;
        const cell = cells[cellId];
        const format = cell?.format || {};
        
        return {
          fontWeight: format.bold ? 'bold' : 'normal',
          fontStyle: format.italic ? 'italic' : 'normal',
          fontSize: format.fontSize ? `${format.fontSize}px` : '14px',
          color: format.color || '#000000',
        };
      },
      cellRenderer: (params) => {
        const cellId = `${i}:${params.node.rowIndex}`;
        const cell = cells[cellId];
        const value = cell?.computedValue ?? '';
        
        if (cell?.formula) {
          return `<div title="${cell.formula}">${value}</div>`;
        }
        return value;
      },
    }));

    return [headerCol, ...dataCols];
  }, [cells, columns, dispatch]);

  const rowData = useMemo(() => {
    return Array.from({ length: rows }, (_, i) => ({
      rowHeader: i + 1,
    }));
  }, [rows]);

  const defaultColDef = {
    resizable: true,
    sortable: false,
    filter: false,
  };

  const onCellClicked = (params) => {
    if (params.column.colId === 'rowHeader') return;
    
    const col = parseInt(params.column.colId.replace('col', ''));
    const row = params.node.rowIndex;
    
    dispatch(setSelectedRange({
      start: { col, row },
      end: { col, row },
    }));
  };

  const onRangeSelectionChanged = (params) => {
    if (!params.finished) return;
    
    const ranges = params.api.getCellRanges();
    if (!ranges || ranges.length === 0) return;
    
    const range = ranges[0];
    if (!range.startColumn?.getColId()?.startsWith('col')) return;
    
    const startCol = parseInt(range.startColumn.getColId().replace('col', ''));
    const endCol = parseInt(range.endColumn.getColId().replace('col', ''));
    
    dispatch(setSelectedRange({
      start: { col: startCol, row: range.startRow.rowIndex },
      end: { col: endCol, row: range.endRow.rowIndex },
    }));
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 'calc(100vh - 48px)', width: '100%' }}>
      <AgGridReact
        columnDefs={createColumnDefs()}
        rowData={rowData}
        defaultColDef={defaultColDef}
        rowHeight={25}
        headerHeight={32}
        onCellClicked={onCellClicked}
        enableRangeSelection={true}
        onRangeSelectionChanged={onRangeSelectionChanged}
        suppressCopyRowsToClipboard={true}
        enableFillHandle={true}
      />
    </div>
  );
};

export default Spreadsheet;
