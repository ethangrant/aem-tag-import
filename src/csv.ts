import fs from 'fs';
import ConvertCsvToJson from "convert-csv-to-json";
import chalk from "chalk";

export interface TagCsv {
    Namespace: string;
    Tag: string;
}

/**
 * Reads a CSV file from the specified path and converts its content into an array of TagCsv objects.
 *
 * @param {string} csvPath
 * @return {TagCsv[]}
 */
export function getCsvData(csvPath: string): TagCsv[] {
    if (!fs.existsSync(csvPath)) {
        throw new Error(`CSV file not found: ${csvPath}`);
    }

    const json = ConvertCsvToJson.fieldDelimiter(', ')
        .getJsonFromCsv(csvPath);

    const isValidTagData = (data: any): data is TagCsv => {
        return typeof data === 'object'
            && typeof data.Namespace === 'string'
            && typeof data.Tag === 'string';
    };

    if (!Array.isArray(json) || !json.every(isValidTagData)) {
        throw new Error(chalk.red('Invalid CSV structure. Expected columns: Namespace, Tag'));
    }

    console.log(chalk.green('CSV to JSON conversion complete:\n'));
    console.log(json);
    console.log('\n');

    return json;
}