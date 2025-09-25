/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from 'xlsx';

interface ParseResult<T> {
  data: T[];
  errorsHtml?: string;
}

export function parseExcelFile<T = any>(
  file: File,
  keys: string[],
  uniqueKeys: string[] = [],
): Promise<ParseResult<T>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const wb: XLSX.WorkBook = XLSX.read(e.target.result, {
          type: 'binary',
        });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        const errors: string[] = [];

        if (!rows.length) {
          errors.push('<li>Empty file</li>');
        }

        const header = rows[0].map((h: any) => (h || '').toString().trim());
        keys.forEach((k) => {
          if (!header.includes(k)) {
            errors.push(`<li>Missing column: ${k}</li>`);
          }
        });

        if (errors.length) {
          return reject(`<ul>${errors.join('')}</ul>`);
        }

        const data: T[] = [];
        const uniqueTracker: Record<string, Record<string, number[]>> = {};

        uniqueKeys.forEach((k) => (uniqueTracker[k] = {}));

        rows.slice(1).forEach((row, rowIndex) => {
          const obj: any = {};
          keys.forEach((k, colIndex) => {
            const colIdx = header.indexOf(k);
            obj[k] = row[colIdx] ?? '';
          });
          data.push(obj);

          uniqueKeys.forEach((k) => {
            const val = obj[k];
            if (!uniqueTracker[k][val]) {
              uniqueTracker[k][val] = [];
            }
            uniqueTracker[k][val].push(rowIndex + 2);
          });
        });

        for (const key of uniqueKeys) {
          for (const [val, rowsArr] of Object.entries(uniqueTracker[key])) {
            if (rowsArr.length > 1 && val) {
              errors.push(
                `<li>Duplicated data of <b>${key}</b> = "${val}" at rows ${rowsArr.join(', ')}</li>`,
              );
            }
          }
        }

        if (errors.length) {
          return reject(`<ul>${errors.join('')}</ul>`);
        }

        resolve({ data });
      } catch (err: any) {
        reject(`<ul><li>Invalid file format: ${err.message}</li></ul>`);
      }
    };

    reader.onerror = () => {
      reject('<ul><li>Failed to read file</li></ul>');
    };

    reader.readAsBinaryString(file);
  });
}
