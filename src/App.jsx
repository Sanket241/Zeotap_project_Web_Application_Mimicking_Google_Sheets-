import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store';
import Spreadsheet from './components/Spreadsheet';
import Toolbar from './components/Toolbar';
import FormulaBar from './components/FormulaBar';
import Box from '@mui/material/Box';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a73e8',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Toolbar />
          <FormulaBar />
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Spreadsheet />
          </Box>
        </Box>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
