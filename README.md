# Google Sheets Clone

A web application that mimics the core functionalities of Google Sheets, built with modern web technologies.

## Tech Stack

1. **Frontend Framework**: React + Vite
   - React for building a dynamic and responsive UI
   - Vite for fast development and optimized builds

2. **State Management**: Redux Toolkit
   - Manages spreadsheet data and UI state
   - Handles complex cell dependencies and formula calculations

3. **UI Components**: Material-UI (MUI)
   - Provides consistent and professional UI components
   - Enables Google Sheets-like styling and interactions

4. **Grid Management**: AG Grid
   - Enterprise-grade grid component for handling large datasets
   - Built-in support for cell editing, selection, and formatting

## Data Structures

1. **Spreadsheet Data Model**:
   ```javascript
   {
     cells: {
       [rowId]: {
         [colId]: {
           value: any,           // Raw cell value
           formula: string,      // Formula if present
           format: {            // Cell formatting
             bold: boolean,
             italic: boolean,
             fontSize: number,
             color: string
           },
           dependencies: string[] // Cell references used in formula
         }
       }
     }
   }
   ```

2. **Formula Evaluation**:
   - Abstract Syntax Tree (AST) for parsing formulas
   - Directed Acyclic Graph (DAG) for managing cell dependencies
   - Topological sorting for updating dependent cells

## Key Features

1. **Spreadsheet Interface**
   - Google Sheets-like UI with toolbar and formula bar
   - Cell drag functionality
   - Dynamic cell dependencies
   - Basic cell formatting
   - Row/column management

2. **Mathematical Functions**
   - SUM, AVERAGE, MAX, MIN, COUNT

3. **Data Quality Functions**
   - TRIM, UPPER, LOWER
   - REMOVE_DUPLICATES
   - FIND_AND_REPLACE

4. **Data Entry and Validation**
   - Multi-type data support
   - Data validation
   - Formula parsing and evaluation

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Implementation Details

1. **Cell Management**:
   - Each cell is a controlled React component
   - Changes trigger formula re-evaluation in dependent cells
   - Optimized rendering using virtualization

2. **Formula Engine**:
   - Custom parser for formula evaluation
   - Support for cell references and basic operations
   - Error handling for circular dependencies

3. **UI/UX Features**:
   - Responsive design
   - Keyboard navigation
   - Context menus
   - Drag-and-drop functionality
