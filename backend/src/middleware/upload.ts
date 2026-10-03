import express, { Request, Response, NextFunction } from 'express';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface FileRequest extends Request {
  fileContent?: string;
}

export function uploadMiddleware(req: FileRequest, res: Response, next: NextFunction) {
  let data = '';
  let size = 0;

  req.setEncoding('utf-8');

  req.on('data', (chunk: string) => {
    size += Buffer.byteLength(chunk, 'utf-8');
    if (size > MAX_FILE_SIZE) {
      res.status(413).json({
        success: false,
        error: 'File size exceeds 10MB limit',
      });
      req.destroy();
      return;
    }
    data += chunk;
  });

  req.on('end', () => {
    req.fileContent = data;
    next();
  });

  req.on('error', (err) => {
    console.error('Upload error:', err);
    res.status(400).json({
      success: false,
      error: 'Error reading file',
    });
  });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);

  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
}
