import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  FileSpreadsheet, 
  X, 
  AlertTriangle, 
  Download, 
  Upload,
  Loader2
} from 'lucide-react';

export type FilePinState =
  | 'local'
  | 'uploading'
  | 'uploaded'
  | 'oversize'
  | 'wrong-type'
  | 'mirrored'
  | 'error';

export interface FilePinData {
  id: string;
  name: string;
  type: 'docx' | 'xlsx' | 'csv' | 'pdf' | 'txt' | 'json' | 'unknown';
  size: number;
  state: FilePinState;
  file?: File;
  progress?: number; // 0-100 for uploading state
  errorMessage?: string;
  url?: string; // For download in mirrored state
}

interface FilePinProps {
  file: FilePinData;
  onRemove?: (fileId: string) => void;
  onDownload?: (fileId: string) => void;
  className?: string;
}

interface FilePinListProps {
  files: FilePinData[];
  onRemove?: (fileId: string) => void;
  onDownload?: (fileId: string) => void;
  isDragOver?: boolean;
  onDragOver?: (isDragOver: boolean) => void;
  className?: string;
}

const FileIcon = ({ type, state }: { type: FilePinData['type']; state: FilePinState }) => {
  const iconProps = { className: "w-5 h-5" };

  if (state === 'uploading') {
    return <Loader2 {...iconProps} className="w-5 h-5 animate-spin text-primary" />;
  }

  if (state === 'oversize' || state === 'wrong-type' || state === 'error') {
    return <AlertTriangle {...iconProps} className="w-5 h-5 text-destructive" />;
  }
  
  switch (type) {
    case 'docx':
      return <FileText {...iconProps} className="w-5 h-5 text-blue-500" />;
    case 'xlsx':
      return <FileSpreadsheet {...iconProps} className="w-5 h-5 text-green-500" />;
    case 'csv':
      return <FileSpreadsheet {...iconProps} className="w-5 h-5 text-orange-500" />;
    default:
      return <FileText {...iconProps} className="w-5 h-5 text-muted-foreground" />;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FilePin = React.forwardRef<HTMLDivElement, FilePinProps>(({ file, onRemove, onDownload, className = '' }, ref) => {
  const { id, name, type, size, state, progress, errorMessage } = file;
  
  const isError = state === 'oversize' || state === 'wrong-type' || state === 'error';
  const isUploading = state === 'uploading';
  const isMirrored = state === 'mirrored';
  
  const handleAction = () => {
    if (isMirrored && onDownload) {
      onDownload(id);
    } else if (onRemove) {
      onRemove(id);
    }
  };
  
  const getStatusText = () => {
    switch (state) {
      case 'uploading':
        return `Загрузка... ${progress || 0}%`;
      case 'oversize':
        return errorMessage || 'Файл слишком большой (максимум 20 МБ)';
      case 'wrong-type':
        return errorMessage || 'Формат не поддерживается';
      case 'error':
        return errorMessage || 'Не удалось загрузить файл';
      case 'uploaded':
        return formatFileSize(size);
      case 'mirrored':
        return formatFileSize(size);
      case 'local':
        return formatFileSize(size);
      default:
        return formatFileSize(size);
    }
  };
  
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
        ${isError 
          ? 'border-destructive bg-destructive/5' 
          : isMirrored
            ? 'border-border bg-muted/5'
            : 'border-border bg-card hover:bg-accent/5'
        }
        ${className}
      `}
    >
      {/* File icon */}
      <div className="flex-shrink-0">
        <FileIcon type={type} state={state} />
      </div>
      
      {/* File info */}
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-sm truncate ${isError ? 'text-destructive' : 'text-foreground'}`}>
          {name}
        </div>
        <div className={`text-xs mt-1 ${isError ? 'text-destructive' : 'text-muted-foreground'}`}>
          {getStatusText()}
        </div>
        
        {/* Progress bar for uploading */}
        {isUploading && (
          <div className="mt-2">
            <Progress value={progress || 0} className="h-1" />
          </div>
        )}
      </div>
      
      {/* Action button */}
      <div className="flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className={`
            w-8 h-8 p-0 transition-colors
            ${isError || !isMirrored
              ? 'hover:bg-destructive/10 hover:text-destructive'
              : 'hover:bg-accent/10 hover:text-primary'
            }
          `}
          onClick={handleAction}
          title={isMirrored ? 'Скачать файл' : 'Удалить файл'}
        >
          {isMirrored ? (
            <Download className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </Button>
      </div>
    </motion.div>
  );
});

FilePin.displayName = 'FilePin';

const DragOverlay = React.forwardRef<HTMLDivElement, { isDragOver: boolean }>(({ isDragOver }, ref) => {
  if (!isDragOver) return null;
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 border-2 border-dashed border-primary bg-primary/5 rounded-xl flex items-center justify-center"
    >
      <div className="text-center">
        <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
        <p className="text-primary font-medium">Перетащите файл сюда</p>
        <p className="text-xs text-muted-foreground mt-1">
          Поддерживаемые форматы: .docx, .xlsx, .csv
        </p>
      </div>
    </motion.div>
  );
});

DragOverlay.displayName = 'DragOverlay';

export function FilePinList({ 
  files, 
  onRemove, 
  onDownload, 
  isDragOver = false,
  onDragOver,
  className = '' 
}: FilePinListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !onDragOver) return;
    
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDragOver(true);
    };
    
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Only hide overlay if leaving the container entirely
      if (!container.contains(e.relatedTarget as Node)) {
        onDragOver(false);
      }
    };
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDragOver(false);
      
      const draggedFiles = e.dataTransfer?.files;
      if (draggedFiles) {
        // Handle file drop - this would typically be handled by parent component
        console.log('Files dropped:', draggedFiles);
      }
    };
    
    container.addEventListener('dragenter', handleDragEnter);
    container.addEventListener('dragleave', handleDragLeave);
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', handleDrop);
    
    return () => {
      container.removeEventListener('dragenter', handleDragEnter);
      container.removeEventListener('dragleave', handleDragLeave);
      container.removeEventListener('dragover', handleDragOver);
      container.removeEventListener('drop', handleDrop);
    };
  }, [onDragOver]);
  
  if (files.length === 0 && !isDragOver) {
    return null;
  }
  
  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
    >
      {/* Drag overlay */}
      <AnimatePresence>
        <DragOverlay isDragOver={isDragOver} />
      </AnimatePresence>
      
      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {files.map((file) => (
              <FilePin
                key={file.id}
                file={file}
                onRemove={onRemove}
                onDownload={onDownload}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export { FilePin };