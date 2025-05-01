import AdmZip from "adm-zip";
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { TagCsv } from "./csv";

export default class PackageModifier {
    constructor(
        private readonly packagePath: string,
        private readonly unzippedPath: string,
    ) {
        if (!packagePath || !unzippedPath) {
            throw new Error(chalk.red('Package path and unzipped path are required'));
        }
    }

    /**
     * Runs full process of adding additional tags to the package.
     *
     * @throws Error if any step in the process fails
     */
    addTags(tagsData: TagCsv[]) {
        try {
            this.unzipPackage();
            this.createTagFiles(tagsData);
            this.zipPackage();
            this.cleanup();
        } catch (error) {
            throw new Error(`Failed to add tags to package: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Creates tag directories and files based on the provided tag data.
     * Processes each row from the input tagsData, creating namespace and tag-specific
     * directories if they do not already exist, and generates `.content.xml` files
     * with the associated content for each tag.
     *
     * @param {TagCsv[]} tagsData - Array of tag data where each entry contains
     *                              information about Namespace and Tag.
     * @return {void} - No return value.
     */
    private createTagFiles(tagsData: TagCsv[]) {
        const tagFolderPath = path.join(this.unzippedPath, 'jcr_root', 'content', '_cq_tags');

        tagsData.forEach((row) => {
            const namespace = row.Namespace;
            const tag = row.Tag;
            const namespacePath = path.join(tagFolderPath, namespace);
            const tagPath = path.join(namespacePath, tag);

            try {
                if(!fs.existsSync(namespacePath)) {
                    fs.mkdirSync(namespacePath, { recursive: true });
                    console.log(chalk.blue(`✓ Namespace directory created: ${chalk.cyan(namespacePath)}`));
                }

                this.writeTagContentXml(namespacePath, namespace);

                if(!fs.existsSync(tagPath)) {
                    fs.mkdirSync(tagPath);
                    console.log(chalk.blue(`✓ Tag directory created: ${chalk.cyan(tagPath)}`));
                }

                this.writeTagContentXml(tagPath, tag);
            } catch (err) {
                throw new Error(`Failed to process tag ${tag} in namespace ${namespace}: ${err}`);
            }
        });
    }

    private writeTagContentXml(pathToXml: string, tag: string) {
        const fullPath = path.join(pathToXml, '.content.xml');
        fs.copyFileSync(path.join(process.cwd(), 'fixtures/.content.xml'), fullPath);

        const content = fs.readFileSync(fullPath, 'utf8');
        const newContent = content.replace(/TAG_NAME/g, tag);
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(chalk.blue(`✓ Updated content in file: ${chalk.cyan(fullPath)} \n`));
    }

    /**
     * Unzips the package file
     * @returns {string} the path to the unzipped package
     * @throws Error if unzipping fails
     */
    private unzipPackage(): string {
        try {
            const zip = new AdmZip(this.packagePath);
            zip.extractAllTo(this.unzippedPath, true);
            return this.unzippedPath;
        } catch (error) {
            throw new Error(`Failed to unzip package: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Zips the modified package contents back into a zip file
     * @throws Error if zipping fails
     */
    private zipPackage() {
        try {
            const zip = new AdmZip();

            // Add the jcr_root and META-INF directories to the zip
            const jcrRootPath = path.join(this.unzippedPath, 'jcr_root');
            const metaInfPath = path.join(this.unzippedPath, 'META-INF');

            if (fs.existsSync(jcrRootPath)) {
                zip.addLocalFolder(jcrRootPath, 'jcr_root');
            }

            if (fs.existsSync(metaInfPath)) {
                zip.addLocalFolder(metaInfPath, 'META-INF');
            }

            // Write the zip file to current directory
            const currentDirPath = path.join(process.cwd(), `modified-${path.basename(this.packagePath)}`);
            zip.writeZip(currentDirPath);
            console.log(chalk.green(`✓ Created zip file at: ${chalk.cyan(currentDirPath)}`));
        } catch (error) {
            throw new Error(`Failed to create zip file: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private cleanup() {
        try {
            if (fs.existsSync(this.unzippedPath)) {
                fs.rmSync(this.unzippedPath, { recursive: true, force: true });
                console.log(chalk.blue(`✓ Cleaned up temporary files at: ${chalk.cyan(this.unzippedPath)}`));
            }
        } catch (error) {
            console.warn(chalk.yellow(`Warning: Failed to clean up temporary files: ${error}`));
        }
    }
}