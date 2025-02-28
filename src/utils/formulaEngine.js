const formulaRegistry = {
  SUM: (range) => {
    return range
      .filter(val => typeof val === 'number')
      .reduce((sum, val) => sum + val, 0);
  },
  AVERAGE: (range) => {
    const numbers = range.filter(val => typeof val === 'number');
    return numbers.length > 0 ? numbers.reduce((sum, val) => sum + val, 0) / numbers.length : 0;
  },
  MAX: (range) => {
    const numbers = range.filter(val => typeof val === 'number');
    return numbers.length > 0 ? Math.max(...numbers) : null;
  },
  MIN: (range) => {
    const numbers = range.filter(val => typeof val === 'number');
    return numbers.length > 0 ? Math.min(...numbers) : null;
  },
  COUNT: (range) => {
    return range.filter(val => typeof val === 'number').length;
  },
  TRIM: (text) => {
    return typeof text === 'string' ? text.trim() : text;
  },
  UPPER: (text) => {
    return typeof text === 'string' ? text.toUpperCase() : text;
  },
  LOWER: (text) => {
    return typeof text === 'string' ? text.toLowerCase() : text;
  },
  REMOVE_DUPLICATES: (range) => {
    return Array.from(new Set(range));
  },
};

export function parseFormula(formula) {
  const match = formula.match(/^=(\w+)\((.*)\)$/);
  if (!match) throw new Error('Invalid formula format');
  
  const [_, func, argsString] = match;
  const args = argsString.split(',').map(arg => arg.trim());
  
  return { func, args };
}

export function evaluateFormula(formula, context) {
  try {
    if (!formula.startsWith('=')) return formula;

    const { func, args } = parseFormula(formula);
    const resolvedArgs = args.map(arg => {
      if (isCellReference(arg)) {
        return context.getCellValue(arg);
      }
      return arg;
    });

    const formulaFunc = formulaRegistry[func];
    if (!formulaFunc) throw new Error(`Unknown function: ${func}`);

    return formulaFunc(...resolvedArgs);
  } catch (error) {
    return `#ERROR: ${error.message}`;
  }
}

export function isCellReference(value) {
  return /^[A-Z]+[1-9][0-9]*$/.test(value);
}

export function getCellReferences(formula) {
  if (!formula.startsWith('=')) return [];

  try {
    const { args } = parseFormula(formula);
    return args.filter(isCellReference);
  } catch {
    return [];
  }
}

export function columnIndexToLetter(index) {
  let letter = '';
  while (index >= 0) {
    letter = String.fromCharCode(65 + (index % 26)) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

export function cellIdToReference(id) {
  const [col, row] = id.split(':').map(Number);
  return `${columnIndexToLetter(col)}${row + 1}`;
}

export function referenceToIndices(ref) {
  const match = ref.match(/^([A-Z]+)([1-9][0-9]*)$/);
  if (!match) throw new Error('Invalid cell reference');

  const [_, col, row] = match;
  let columnIndex = 0;
  for (let i = 0; i < col.length; i++) {
    columnIndex = columnIndex * 26 + col.charCodeAt(i) - 65;
  }
  return [columnIndex, parseInt(row) - 1];
}
