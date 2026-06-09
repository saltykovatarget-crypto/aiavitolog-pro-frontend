import React, { useEffect, useMemo, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { AlertTriangle, FileText } from 'lucide-react';
import { fetchMyDocuments, ApiError, type UserDocumentsGroup } from '@/lib/documents';

interface MyDocumentsProps {
  onGoToPricing?: () => void;
}

type ErrorState = {
  type: 'forbidden' | 'generic';
  message: string;
};

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString('ru-RU');
  } catch (error) {
    console.error('Failed to format date', error);
    return dateString;
  }
}

function getStatusVariant(status: string): { label: string; variant: 'secondary' | 'outline' | 'default' } {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case 'ready':
      return { label: 'Готово', variant: 'secondary' };
    case 'uploading':
      return { label: 'Загрузка', variant: 'outline' };
    case 'mirrored':
      return { label: 'Обрабатывается', variant: 'outline' };
    default:
      return { label: status, variant: 'outline' };
  }
}

export function MyDocuments({ onGoToPricing }: MyDocumentsProps) {
  const [groups, setGroups] = useState<UserDocumentsGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);

  const handleNavigate = () => {
    try {
      if (onGoToPricing) {
        onGoToPricing();
      } else {
        window.location.hash = 'pricing';
      }
    } catch (err) {
      console.error('Failed to navigate to pricing', err);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMyDocuments()
      .then((response) => {
        if (!cancelled) {
          setGroups(response);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 403) {
          setError({
            type: 'forbidden',
            message: 'Доступ к документам сейчас ограничен. Попробуйте позже или обратитесь в поддержку.',
          });
          return;
        }
        setError({ type: 'generic', message: 'Не удалось загрузить документы. Попробуйте позже.' });
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const totalDocuments = useMemo(
    () => groups.reduce((acc, group) => acc + group.documents.length, 0),
    [groups],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Мои документы</h3>
          {!loading && !error && (
            <p className="text-sm text-muted-foreground">
              Всего файлов: {totalDocuments}
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 border border-border rounded-xl">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16 rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="border border-destructive/30 bg-destructive/5 text-destructive rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5" />
            <div>
              <p className="font-medium">{error.message}</p>
              {error.type === 'forbidden' && (
                <p className="text-sm text-muted-foreground">Если проблема сохраняется — обновите страницу или попробуйте позже.</p>
              )}
            </div>
          </div>
          <Button size="sm" onClick={handleNavigate}>
            Обновить
          </Button>
        </div>
      )}

      {!loading && !error && groups.length === 0 && (
        <div className="border border-border rounded-xl p-6 text-center text-muted-foreground bg-muted/5">
          Пока нет загруженных документов.
        </div>
      )}

      {!loading && !error && groups.length > 0 && (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.chat_id} className="border border-border rounded-xl p-4 bg-muted/5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold truncate" title={group.chat_title}>
                    {group.chat_title || `Чат ${group.chat_id}`}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{group.documents.length} файл(ов)</span>
              </div>

              <div className="space-y-2">
                {group.documents.map((doc) => {
                  const badge = getStatusVariant(doc.status);
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card shadow-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate" title={doc.file_name}>{doc.file_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(doc.created_at)}
                        </div>
                      </div>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
