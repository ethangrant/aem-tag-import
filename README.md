# AEM Tag Import

A command-line tool for importing tags into Adobe Experience Manager (AEM) packages from CSV files.

## Features

- Import tags from CSV files into AEM packages
- Support for custom CSV delimiters
- Automatic namespace and tag directory creation
- Error handling and validation
- Progress feedback with colored console output

## Installation

```
npm install aem-tag-import
```

## Prerequisites

- Node.js 18 or higher
- An existing AEM package containing tags (or where you want to add tags)
- A CSV file with tag definitions

## CSV File Format

The CSV file must contain two columns:
- `Namespace`: The namespace for the tag
- `Tag`: The tag name

## Usage

```
aem-tag-import -c <path-to-csv> -p <path-to-package>
```

### Options

```
- `-c, --csv-path <value>` (required): Path to the CSV file containing tag definitions
- `-p, --package-path <value>` (required): Path to the existing AEM package
- `-d, --delimiter <value>` (optional): CSV delimiter character (default: ',')
- `-u, --unzipped-path <value>` (optional): Temporary path for package extraction (default: 'pkg_unzipped')
- `-v, --version`: Display version information
- `-h, --help`: Display help information
```

```
## Output

The tool will:
1. Unzip the existing package
2. Create necessary tag directories and files
3. Generate a new package with added tags
4. Clean up temporary files

The modified package will be saved as `modified-<original-package-name>` in the current directory.
```

## Development

### Prerequisites

- Node.js 18.x
- npm

### Setup

#### Clone the repository

````
git clone <repository-url>
````

##### Install dependencies

````
npm install
````

##### Build the project

````
npm run build
````

### Dependencies

- `adm-zip`: ZIP file manipulation
- `chalk`: Terminal string styling
- `commander`: Command-line interface
- `convert-csv-to-json`: CSV parsing
- `figlet`: ASCII art text generator
