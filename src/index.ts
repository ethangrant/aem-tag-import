#!/usr/bin/env node
import { Command } from "commander";
import figlet from "figlet";
import { getCsvData } from "./csv";
import PackageModifier from "./PackageModifier";

const program = new Command();

console.log(figlet.textSync("AEM Tag Import"));

program
  .version("1.0.0")
  .description("Create AEM package to import tags from a CSV file.")
  .requiredOption("-c, --csv-path <value>", "Path to CSV Import File.")
  .requiredOption("-p, --package-path <value>", "Path to Package With Existing Tags.")
    .option("-u, --unzipped-path <value>", "Path to unzip the package", 'pkg_unzipped')
  .parse(process.argv);

const options = program.opts();
const { csvPath, packagePath, unzippedPath } = options;

const modifier = new PackageModifier(packagePath, unzippedPath);
modifier.addTags(getCsvData(csvPath));