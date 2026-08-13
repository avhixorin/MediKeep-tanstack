import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks';
import { useAuthStore } from '@/stores';
import { X, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarUploadModalProps {
  onClose: () => void;
}

export function AvatarUploadModal({ onClose }: AvatarUploadModalProps) {
  const { user } = useAuthStore();
  const { uploadAvatar, isUploadAvatarPending } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }
    uploadAvatar(selectedFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-md dark:bg-slate-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 transition-colors hover:text-red-500 dark:text-slate-400"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-4 text-lg font-semibold">Update Profile Picture</h2>

        <div className="flex justify-center">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={preview ?? user?.profilePicture}
              alt="Profile"
            />
            <AvatarFallback className="bg-primary/15 text-primary text-2xl">
              {user?.firstName[0]}
              {user?.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileSelect(e.dataTransfer.files[0]);
          }}
          className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary"
        >
          <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">
            {selectedFile ? selectedFile.name : 'Drag & drop or click to upload'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG or WEBP
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />
        </div>

        <Button
          className="mt-6 w-full"
          disabled={!selectedFile || isUploadAvatarPending}
          onClick={handleUpload}
        >
          {isUploadAvatarPending ? 'Uploading...' : 'Upload Picture'}
        </Button>
      </div>
    </div>
  );
}
