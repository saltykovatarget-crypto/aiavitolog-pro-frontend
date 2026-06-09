import React, { useState } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { 
  Folder, 
  Upload, 
  Trash2, 
  FileText, 
  File, 
  Image, 
  AlertTriangle,
  RefreshCw,
  Eye
} from 'lucide-react';

export type FilesState = 'normal' | 'empty' | 'overflow' | 'loading' | 'error';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  icon: any;
}

interface MyFilesSectionProps {
  state: FilesState;
  onStateChange?: (state: FilesState) => void;
}

export function MyFilesSection({ state, onStateChange }: MyFilesSectionProps) {
  const [expandedList, setExpandedList] = useState(false);

  // Sample files data
  const sampleFiles: FileItem[] = [
    {
      id: '1',
      name: 'Договор_поставка.docx',
      type: 'docx',
      size: '2.3 МБ',
      date: '15.09.2025',
      icon: FileText
    },
    {
      id: '2',
      name: 'Финансовый_отчет.xlsx',
      type: 'xlsx',
      size: '1.8 МБ',
      date: '14.09.2025',
      icon: File
    },
    {
      id: '3',
      name: 'Презентация_Q3.pdf',
      type: 'pdf',
      size: '5.1 МБ',
      date: '13.09.2025',
      icon: FileText
    },
    {
      id: '4',
      name: 'Схема_процесса.png',
      type: 'png',
      size: '890 КБ',
      date: '12.09.2025',
      icon: Image
    },
    {
      id: '5',
      name: 'Техническое_задание.docx',
      type: 'docx',
      size: '1.2 МБ',
      date: '11.09.2025',
      icon: FileText
    }
  ];

  const additionalFiles: FileItem[] = [
    {
      id: '6',
      name: 'Backup_database.sql',
      type: 'sql',
      size: '12.5 МБ',
      date: '10.09.2025',
      icon: File
    },
    {
      id: '7',
      name: 'Logo_company.png',
      type: 'png',
      size: '256 КБ',
      date: '09.09.2025',
      icon: Image
    }
  ];

  const allFiles = [...sampleFiles, ...additionalFiles];

  // Storage info based on state
  const getStorageInfo = () => {
    switch (state) {
      case 'overflow':
        return {
          filesCount: 15,
          usedSpace: 5.0,
          totalSpace: 5.0,
          percentage: 100
        };
      case 'empty':
        return {
          filesCount: 0,
          usedSpace: 0,
          totalSpace: 5.0,
          percentage: 0
        };
      default:
        return {
          filesCount: 12,
          usedSpace: 1.2,
          totalSpace: 5.0,
          percentage: 24
        };
    }
  };

  const storageInfo = getStorageInfo();

  const handleDeleteFile = (fileId: string) => {
    console.log('Delete file:', fileId);
    // In real app, this would handle file deletion
  };

  const handleUploadFile = () => {
    console.log('Upload file');
    // In real app, this would open file picker
  };

  const handleShowAllFiles = () => {
    setExpandedList(!expandedList);
  };

  const handleRetry = () => {
    if (onStateChange) {
      onStateChange('loading');
      setTimeout(() => {
        onStateChange('normal');
      }, 2000);
    }
  };

  // Render different states
  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="w-8 h-8 rounded" />
              </div>
            ))}
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="font-medium mb-2">Ошибка загрузки</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Не удалось загрузить список файлов, попробуйте позже
            </p>
            <Button onClick={handleRetry} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Повторить
            </Button>
          </div>
        );

      case 'empty':
        return (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-lg bg-muted/10 flex items-center justify-center mx-auto mb-4">
              <Folder className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">Файлы ещё не загружены</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Загрузите файлы для анализа и работы с ИИ
            </p>
            <Button onClick={handleUploadFile} className="gap-2">
              <Upload className="w-4 h-4" />
              Загрузить файл
            </Button>
          </div>
        );

      default:
        const filesToShow = expandedList ? allFiles : sampleFiles;
        return (
          <div className="space-y-4">
            {filesToShow.map((file) => {
              const IconComponent = file.icon;
              return (
                <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{file.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{file.date}</span>
                      <span>•</span>
                      <span>{file.size}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFile(file.id)}
                    className="w-8 h-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}

            {!expandedList && allFiles.length > sampleFiles.length && (
              <Button
                variant="outline"
                onClick={handleShowAllFiles}
                className="w-full gap-2"
              >
                <Eye className="w-4 h-4" />
                Показать все файлы ({allFiles.length})
              </Button>
            )}

            {expandedList && (
              <Button
                variant="outline"
                onClick={handleShowAllFiles}
                className="w-full gap-2"
              >
                Скрыть файлы
              </Button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Folder className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Мои файлы</h3>
          {state !== 'loading' && state !== 'error' && (
            <p className="text-sm text-muted-foreground">
              Загружено {storageInfo.filesCount} файлов · Использовано {storageInfo.usedSpace} ГБ из {storageInfo.totalSpace} ГБ доступных
            </p>
          )}
        </div>
        {(state === 'normal' || state === 'overflow') && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadFile}
            className="gap-2"
            disabled={state === 'overflow'}
          >
            <Upload className="w-4 h-4" />
            Загрузить
          </Button>
        )}
      </div>

      {/* Progress bar */}
      {state !== 'loading' && state !== 'error' && state !== 'empty' && (
        <div className="space-y-2">
          <Progress 
            value={storageInfo.percentage} 
            className={`h-2 ${state === 'overflow' ? '[&>div]:bg-destructive' : ''}`}
          />
          {state === 'overflow' && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="w-4 h-4" />
              <span>Достигнут лимит 5 ГБ, удалите ненужные файлы</span>
            </div>
          )}
        </div>
      )}

      {/* Files list */}
      {renderContent()}
    </div>
  );
}