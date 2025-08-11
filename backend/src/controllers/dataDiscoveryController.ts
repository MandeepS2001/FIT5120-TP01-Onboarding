import { Request, Response } from 'express';
import { DataProcessor } from '../utils/dataProcessor';

// Get overview of all available data files
export const getDataOverview = async (req: Request, res: Response) => {
  try {
    const files = DataProcessor.listDataFiles();
    
    res.json({
      success: true,
      data: {
        totalFiles: (files.datasets?.length || 0) + (files.visualizations?.length || 0),
        datasets: files.datasets || [],
        visualizations: files.visualizations || [],
        lastUpdated: new Date().toISOString()
      },
      source: 'data-science folder discovery'
    });
  } catch (error: any) {
    console.error('Error getting data overview:', error);
    res.status(500).json({ error: 'Failed to get data overview', message: error.message });
  }
};

// Get detailed information about a specific data file
export const getDataFileInfo = async (req: Request, res: Response) => {
  try {
    const { filePath } = req.params;
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path parameter is required' });
    }

    const metadata = DataProcessor.getFileMetadata(filePath);
    
    if (!metadata.exists) {
      return res.status(404).json({ error: 'Data file not found', filePath });
    }

    // Try to get a sample of the data
    let sampleData = null;
    let dataType = 'unknown';
    
    try {
      if (filePath.endsWith('.csv')) {
        const fullPath = DataProcessor.getDataPath(filePath);
        const data = DataProcessor.parseCSV(fullPath);
        sampleData = data.slice(0, 5); // First 5 rows
        dataType = 'csv';
      } else if (filePath.endsWith('.json')) {
        const fullPath = DataProcessor.getDataPath(filePath);
        const data = DataProcessor.parseJSON(fullPath);
        if (Array.isArray(data)) {
          sampleData = data.slice(0, 5); // First 5 items
        } else {
          sampleData = data; // Single object
        }
        dataType = 'json';
      }
    } catch (parseError) {
      // If parsing fails, just return metadata
      console.warn(`Could not parse sample data from ${filePath}:`, parseError);
    }

    return res.json({
      success: true,
      data: {
        filePath,
        metadata,
        dataType,
        sampleData,
        fullDataEndpoint: `/api/v1/data-insights/${filePath.replace(/[^a-zA-Z0-9]/g, '-')}`
      },
      source: 'data-science folder file inspection'
    });
  } catch (error: any) {
    console.error('Error getting data file info:', error);
    return res.status(500).json({ error: 'Failed to get data file info', message: error.message });
  }
};

// Get data file statistics
export const getDataStatistics = async (req: Request, res: Response) => {
  try {
    const files = DataProcessor.listDataFiles();
    
    let totalSize = 0;
    let fileCount = 0;
    let dataTypes: { [key: string]: number } = {};
    
    // Calculate statistics
    [...(files.datasets || []), ...(files.visualizations || [])].forEach(file => {
      if (file.size) {
        totalSize += file.size;
        fileCount++;
      }
      
      const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown';
      dataTypes[extension] = (dataTypes[extension] || 0) + 1;
    });

    const statistics = {
      totalFiles: fileCount,
      totalSizeBytes: totalSize,
      totalSizeMB: parseFloat((totalSize / (1024 * 1024)).toFixed(2)),
      dataTypes,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: statistics,
      source: 'data-science folder statistics'
    });
  } catch (error: any) {
    console.error('Error getting data statistics:', error);
    res.status(500).json({ error: 'Failed to get data statistics', message: error.message });
  }
};
