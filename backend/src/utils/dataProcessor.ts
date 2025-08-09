import * as fs from 'fs';
import * as path from 'path';

export class DataProcessor {
  /**
   * Parse CSV file and return structured data
   */
  static parseCSV(filePath: string): any[] {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`CSV file not found: ${filePath}`);
      }

      const csvData = fs.readFileSync(filePath, 'utf-8');
      const lines = csvData.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row');
      }

      const headers = lines[0].split(',').map(header => header.trim());
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim());
        const row: any = {};
        
        headers.forEach((header, index) => {
          let value: string | number = values[index] || '';
          
          // Try to convert numeric values
          if (!isNaN(Number(value)) && value !== '') {
            value = Number(value);
          }
          
          row[header] = value;
        });
        
        return row;
      });

      return data;
    } catch (error) {
      throw new Error(`Failed to parse CSV file: ${error}`);
    }
  }

  /**
   * Parse JSON file and return structured data
   */
  static parseJSON(filePath: string): any {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`JSON file not found: ${filePath}`);
      }

      const jsonData = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(jsonData);
    } catch (error) {
      throw new Error(`Failed to parse JSON file: ${error}`);
    }
  }

  /**
   * Get file path relative to data-science folder
   */
  static getDataPath(relativePath: string): string {
    return path.join(__dirname, '../../../data-science', relativePath);
  }

  /**
   * Check if data file exists
   */
  static fileExists(relativePath: string): boolean {
    const fullPath = this.getDataPath(relativePath);
    return fs.existsSync(fullPath);
  }

  /**
   * Get file metadata
   */
  static getFileMetadata(relativePath: string): { exists: boolean; size?: number; lastModified?: Date } {
    const fullPath = this.getDataPath(relativePath);
    
    if (!fs.existsSync(fullPath)) {
      return { exists: false };
    }

    const stats = fs.statSync(fullPath);
    return {
      exists: true,
      size: stats.size,
      lastModified: stats.mtime
    };
  }

  /**
   * List available data files
   */
  static listDataFiles(): { [key: string]: any } {
    const dataSciencePath = path.join(__dirname, '../../../data-science');
    const files: { [key: string]: any } = {};

    try {
      // Check datasets folder
      const datasetsPath = path.join(dataSciencePath, 'datasets');
      if (fs.existsSync(datasetsPath)) {
        const datasetFiles = fs.readdirSync(datasetsPath);
        files.datasets = datasetFiles.map(file => ({
          name: file,
          path: `datasets/${file}`,
          ...this.getFileMetadata(`datasets/${file}`)
        }));
      }

      // Check vis_us1.1 folder
      const visPath = path.join(dataSciencePath, 'vis_us1.1');
      if (fs.existsSync(visPath)) {
        const visFiles = fs.readdirSync(visPath);
        files.visualizations = visFiles.map(file => ({
          name: file,
          path: `vis_us1.1/${file}`,
          ...this.getFileMetadata(`vis_us1.1/${file}`)
        }));
      }

      return files;
    } catch (error) {
      console.error('Error listing data files:', error);
      return { error: 'Failed to list data files' };
    }
  }
}
