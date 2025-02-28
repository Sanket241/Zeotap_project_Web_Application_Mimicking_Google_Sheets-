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
                  getCurrentCell: () => cellIdToReference(cellId),
                })
              : value,
          },
        }));
        return true;
      },
    }));

    return [headerCol, ...dataCols];
  }, [columns, cells, dispatch]);

  const rowData = useMemo(() => {
    return Array.from({ length: rows }, (_, i) => ({
      rowHeader: i + 1,
    }));
  }, [rows]);

  const defaultColDef = useMemo(() => ({
    sortable: false,
    resizable: true,
  }), []);

  const onCellClicked = useCallback((event) => {
    if (event.column.colId === 'rowHeader') return;
    
    const colIndex = parseInt(event.column.colId.replace('col', ''));
    const range = {
      start: { row: event.rowIndex, col: colIndex },
      end: { row: event.rowIndex, col: colIndex },
    };
    dispatch(setSelectedRange(range));
  }, [dispatch]);

  const onRangeSelectionChanged = useCallback((event) => {
    if (!event.finished) return;

    const range = event.api.getCellRanges()?.[0];
    if (!range) return;

    dispatch(setSelectedRange({
      start: {
        row: range.startRow.rowIndex,
        col: parseInt(range.columns[0].colId.replace('col', '')),
      },
      end: {
        row: range.endRow.rowIndex,
        col: parseInt(range.columns[range.columns.length - 1].colId.replace('col', '')),
      },
    }));
  }, [dispatch]);

  return (
    <div className="ag-theme-alpine" style={{ width: '100%', height: '100%' }}>
      <AgGridReact
        columnDefs={createColumnDefs()}
        rowData={rowData}
        defaultColDef={defaultColDef}
        rowHeight={25}
        headerHeight={25}
        onCellClicked={onCellClicked}
        onRangeSelectionChanged={onRangeSelectionChanged}
        enableRangeSelection={true}
        suppressMovableColumns={true}
      />
    </div>
  );
};

export default Spreadsheet;
