import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const testFiles = {
  invalidExtensions: [
    {
      name: 'pdf file',
      path: path.join(__dirname, 'empty-file.pdf')
    },
    {
      name: 'xlsx file',
      path: path.join(__dirname, 'empty-file.xlsx')
    }
  ],
  invalidJson: [
    {
      name: 'empty json file',
      path: path.join(__dirname, '/empty-file.json')
    },
    {
      name: 'invalid json format file',
      path: path.join(__dirname, 'invalid-format-file.json')
    }
  ]
};
