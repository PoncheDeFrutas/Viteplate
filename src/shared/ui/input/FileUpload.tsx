import { useCallback, useRef, useState } from 'react';
import { Upload, X, File } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import type { DragEvent, InputHTMLAttributes } from 'react';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface FileUploadProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value'
> {
    /** Called when files are selected or dropped. */
    onFilesChange?: (files: File[]) => void;
    /** Accepted MIME types (e.g. `"image/*,.pdf"`). */
    accept?: string;
    /** Allow multiple file selection. */
    multiple?: boolean;
    /** Maximum file size in bytes. Files exceeding this are silently rejected. */
    maxSize?: number;
    /** Render the selected file list inside the component. */
    showFileList?: boolean;
}

/**
 * Drag-and-drop file upload zone.
 */
export function FileUpload({
    className,
    onFilesChange,
    accept,
    multiple,
    maxSize,
    showFileList = true,
    disabled,
    ...props
}: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const processFiles = useCallback(
        (incoming: FileList | null) => {
            if (!incoming) return;
            let list = Array.from(incoming);
            if (maxSize) {
                list = list.filter((f) => f.size <= maxSize);
            }
            if (!multiple) {
                list = list.slice(0, 1);
            }
            setFiles(list);
            onFilesChange?.(list);
        },
        [maxSize, multiple, onFilesChange],
    );

    const handleDrop = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            if (disabled) return;
            processFiles(e.dataTransfer.files);
        },
        [disabled, processFiles],
    );

    const handleDragOver = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            if (!disabled) setIsDragging(true);
        },
        [disabled],
    );

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const removeFile = useCallback(
        (index: number) => {
            const next = files.filter((_, i) => i !== index);
            setFiles(next);
            onFilesChange?.(next);
        },
        [files, onFilesChange],
    );

    return (
        <div className={cn('space-y-2', className)}>
            <div
                role="button"
                tabIndex={disabled ? -1 : 0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        inputRef.current?.click();
                    }
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                    'flex min-h-[8rem] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-input p-4 text-sm text-muted-foreground',
                    'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
                    isDragging && 'border-primary bg-muted',
                    disabled && 'pointer-events-none opacity-50',
                )}
            >
                <Upload className="h-8 w-8" />
                <p>
                    <span className="font-medium text-foreground">Click to upload</span> or drag and
                    drop
                </p>
                {accept && <p className="text-xs text-muted-foreground">{accept}</p>}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                onChange={(e) => processFiles(e.target.files)}
                className="sr-only"
                {...props}
            />

            {showFileList && files.length > 0 && (
                <ul className="space-y-1">
                    {files.map((file, i) => (
                        <li
                            key={`${file.name}-${file.size}`}
                            className="flex items-center gap-2 border border-border px-3 py-2 text-sm"
                        >
                            <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="flex-1 truncate">{file.name}</span>
                            <button
                                type="button"
                                onClick={() => removeFile(i)}
                                className="p-0.5 text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                aria-label={`Remove ${file.name}`}
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
