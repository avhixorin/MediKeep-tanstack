import { createFileRoute, Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileImage,
  FilePlus,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { useAuthStore } from '@/stores';
import { cn } from '@/lib/utils';
import { UserRole, type DocumentType, type MedicalRecord, type ProcessingStatus } from '@/types';

export const Route = createFileRoute('/dashboard/records/$entityId')({
  component: RecordDetailsPage,
});

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  PRESCRIPTION: 'Prescription',
  BLOOD_REPORT: 'Blood Report',
  ECG_REPORT: 'ECG Report',
  XRAY_REPORT: 'X-Ray Report',
  OTHER: 'Other',
};

const STATUS_CONFIG: Record<
  ProcessingStatus,
  { label: string; icon: typeof Clock; className: string }
> = {
  PENDING: { label: 'Pending', icon: Clock, className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
  PROCESSING: { label: 'Processing', icon: Loader2, className: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  COMPLETED: { label: 'Completed', icon: CheckCircle2, className: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  FAILED: { label: 'Failed', icon: AlertCircle, className: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
};

function RecordDetailsPage() {
  const { entityId } = Route.useParams();
  const { user } = useAuthStore();
  const isDoctor = user?.role === UserRole.DOCTOR;

  const doctorId = isDoctor ? user?._id : entityId;
  const patientId = isDoctor ? entityId : user?._id;

  const entity = (isDoctor ? user?.patients : user?.doctors)?.find((e) => e._id === entityId);

  const { records, uploadFiles, isUploading, deleteFile, retryProcessing } = useMedicalRecords({
    doctorId,
    patientId,
  });

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    uploadFiles({ files, target: entityId });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/records"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-5 w-5 text-slate-500" />
          </Link>
          <Avatar className="size-10">
            <AvatarImage src={entity?.profilePicture} alt={entity?.firstName} />
            <AvatarFallback className="bg-primary-100 text-primary-600">
              {entity?.firstName?.[0]}
              {entity?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {isDoctor ? '' : 'Dr. '}
              {entity ? `${entity.firstName} ${entity.lastName}` : 'Records'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Shared medical records</p>
          </div>
          <Link
            to="/dashboard/ai/$entityId"
            params={{ entityId }}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Ask AI
          </Link>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
            isDragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <FilePlus className="h-6 w-6 text-slate-500" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="font-medium text-primary-600"
                disabled={isUploading}
              >
                Click to upload
              </button>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-slate-500">PDF, JPG, PNG up to 50MB each</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="application/pdf,image/png,image/jpeg"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
            />
          </div>
        </div>

        {records.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500">No records yet</p>
              <p className="text-sm text-slate-400 mt-1">Upload the first shared record above</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {records.map((record, index) => (
              <RecordCard
                key={record._id}
                record={record}
                index={index}
                onDelete={() => deleteFile(record._id)}
                onRetry={() => retryProcessing(record._id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

function RecordCard({
  record,
  index,
  onDelete,
  onRetry,
}: {
  record: MedicalRecord;
  index: number;
  onDelete: () => void;
  onRetry: () => void;
}) {
  const status = STATUS_CONFIG[record.processingStatus] ?? STATUS_CONFIG.COMPLETED;
  const StatusIcon = status.icon;
  const isImage = record.fileType === 'image/png' || record.fileType === 'image/jpeg';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card className="group hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0">
              {isImage ? (
                <FileImage className="h-8 w-8 text-purple-500" />
              ) : (
                <FileText className="h-8 w-8 text-blue-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <a
                href={record.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-900 dark:text-white truncate block hover:underline"
              >
                {record.title || record.fileName}
              </a>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span>{new Date(record.uploadedAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{record.uploadedByRole === 'DOCTOR' ? 'Uploaded by doctor' : 'Uploaded by patient'}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge className={cn('gap-1', status.className)} variant="outline">
                  <StatusIcon className={cn('h-3 w-3', record.processingStatus === 'PROCESSING' && 'animate-spin')} />
                  {status.label}
                </Badge>
                {record.processingStatus === 'COMPLETED' && record.documentType && (
                  <Badge variant="secondary">{DOCUMENT_TYPE_LABELS[record.documentType]}</Badge>
                )}
              </div>
              {record.processingStatus === 'FAILED' && record.processingError && (
                <p className="text-xs text-red-500 mt-2">{record.processingError}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {record.processingStatus === 'FAILED' && (
                <button onClick={onRetry} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Retry processing">
                  <RefreshCw className="h-4 w-4 text-slate-500" />
                </button>
              )}
              <button onClick={onDelete} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Delete record">
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
