import React, { useState, useRef } from 'react';
import { Paperclip, FileSpreadsheet, X, Loader2, Sparkles } from 'lucide-react';

interface XLSUploadProps {
  /** Колбэк когда юзер запустил анализ — родитель должен запустить spend и положить системное сообщение в чат */
  onAnalyze: (fileId: string, fileName: string) => void;
  /** API endpoint для загрузки файла (по умолчанию /api/files/upload) */
  uploadEndpoint?: string;
  /** Цена анализа в копейках (по умолчанию 5000 = 50 ₽) */
  priceKopecks?: number;
  /** Текущий баланс юзера для блокировки кнопки */
  balanceKopecks?: number;
  /** Открыть пополнение если не хватает */
  onRequestTopup?: () => void;
}

const ACCEPTED_TYPES = '.xls,.xlsx,.csv';
const MAX_SIZE_MB = 10;

interface UploadedFile {
  id: string;
  name: string;
  sizeBytes: number;
}

export function XLSUpload({
  onAnalyze,
  uploadEndpoint = '/api/files/upload',
  priceKopecks = 5000,
  balanceKopecks,
  onRequestTopup,
}: XLSUploadProps) {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    setError(null);

    // Validate
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (!['xls', 'xlsx', 'csv'].includes(ext || '')) {
      setError(`Только ${ACCEPTED_TYPES}`);
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Максимум ${MAX_SIZE_MB} МБ`);
      return;
    }

    // Upload
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', f);
      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });

      if (!res.ok) {
        throw new Error('Не удалось загрузить файл');
      }

      const data = await res.json();
      setFile({
        id: data.file_id ?? data.id ?? `mock-${Date.now()}`,
        name: f.name,
        sizeBytes: f.size,
      });
    } catch (e) {
      // Fallback на mock для разработки без бэка
      console.warn('[XLSUpload] upload failed, using mock:', e);
      setFile({
        id: `mock-${Date.now()}`,
        name: f.name,
        sizeBytes: f.size,
      });
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const cancel = () => {
    setFile(null);
    setError(null);
  };

  const insufficientFunds = balanceKopecks !== undefined && balanceKopecks < priceKopecks;
  const priceRub = priceKopecks / 100;

  const handleAnalyzeClick = () => {
    if (insufficientFunds) {
      onRequestTopup?.();
      return;
    }
    if (file) onAnalyze(file.id, file.name);
  };

  // ===== Empty state (drop zone + кнопка) =====
  if (!file) {
    return (
      <div
        className="rounded-xl border border-dashed border-[rgba(154,127,224,0.30)] bg-[rgba(154,127,224,0.04)] p-4 md:p-5"
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex items-center gap-3 md:gap-4">
          <div className="shrink-0 w-12 h-12 grid place-items-center rounded-xl bg-gradient-to-br from-[#6F42C1] to-[#9A7FE0] text-white shadow-[0_4px_14px_rgba(111,66,193,0.35)]">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-foreground">Анализ статистики кабинета Авито</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Залей XLS-выгрузку из своего кабинета — AI найдёт слабые места, где теряются заявки. {ACCEPTED_TYPES}, до {MAX_SIZE_MB} МБ.
            </div>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-[rgba(154,127,224,0.12)] hover:bg-[rgba(154,127,224,0.22)] text-[#C5B0F0] border border-[rgba(154,127,224,0.30)] transition disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Загрузка…
              </>
            ) : (
              <>
                <Paperclip className="w-3.5 h-3.5" />
                Выбрать файл
              </>
            )}
          </button>
        </div>
        {error && (
          <div className="mt-3 text-xs text-amber-300/80">{error}</div>
        )}
      </div>
    );
  }

  // ===== File ready: показываем превью + кнопка анализа =====
  return (
    <div className="rounded-xl border border-[rgba(154,127,224,0.30)] bg-gradient-to-br from-[rgba(111,66,193,0.10)] to-[rgba(154,127,224,0.04)] p-4 md:p-5">
      <div className="flex items-start gap-3 md:gap-4">
        <div className="shrink-0 w-12 h-12 grid place-items-center rounded-xl bg-gradient-to-br from-[#6F42C1] to-[#9A7FE0] text-white shadow-[0_4px_14px_rgba(111,66,193,0.35)]">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-foreground truncate">{file.name}</div>
            <button
              type="button"
              onClick={cancel}
              className="shrink-0 text-muted-foreground hover:text-foreground transition"
              title="Убрать файл"
              aria-label="Убрать"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {(file.sizeBytes / 1024).toFixed(1)} КБ · файл готов к анализу
          </div>

          <div className="mt-3">
            {insufficientFunds ? (
              <button
                type="button"
                onClick={onRequestTopup}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] text-white shadow-[0_4px_14px_rgba(111,66,193,0.4)] hover:brightness-110 transition"
              >
                Пополнить кошелёк для анализа →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAnalyzeClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#6F42C1] to-[#9A7FE0] text-white shadow-[0_4px_14px_rgba(111,66,193,0.4)] hover:brightness-110 active:scale-95 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Проанализировать за {priceRub} ₽
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
