/**
 * Neutralizes CSV formula injection by prepending a tab or single quote
 * if a string cell starts with dangerous formula characters: '=', '+', '-', '@', '\t', '\r', '\n'
 */
export function sanitizeCsvField(field: unknown): string {
  if (field === null || field === undefined) {
    return '""';
  }

  let str = String(field);

  // If starts with dangerous character, neutralize with a leading tab / quote
  if (/^[=\+\-@\t\r\n]/.test(str)) {
    str = `'${str}`;
  }

  // Escape internal double quotes by doubling them
  str = str.replace(/"/g, '""');

  return `"${str}"`;
}

/**
 * Generates and downloads a CSV file with UTF-8 BOM so Bengali text displays correctly in Excel / LibreOffice.
 */
export function exportToCsv(filename: string, headers: string[], rows: (string | number | null | undefined)[][]): void {
  const headerLine = headers.map(sanitizeCsvField).join(',');
  const rowLines = rows.map((row) => row.map(sanitizeCsvField).join(','));

  const csvContent = [headerLine, ...rowLines].join('\r\n');

  // Prepend UTF-8 Byte Order Mark (BOM: \uFEFF) to ensure Excel recognizes Bengali unicode correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
