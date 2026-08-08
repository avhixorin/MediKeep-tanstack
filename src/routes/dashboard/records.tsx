import { createFileRoute } from '@tanstack/react-router';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Upload, 
  FilePlus,
  FileImage,
  FileSpreadsheet,
  Download,
  Trash2,
  Brain
} from 'lucide-react';
import { useState, useRef } from 'react';
import { useMedicalRecords } from '@/hooks';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/dashboard/records')({
  component: MedicalRecordsPage,
});

const mockRecords = [
  {
    id: '1',
    title: 'Blood Test Results - Dec 2024',
    description: 'Complete blood count and metabolic panel results',
    type: 'lab',
    size: '2.4 MB',
    date: '2024-12-20',
    tags: ['Lab', 'Blood Work', 'Annual Checkup'],
  },
  {
    id: '2',
    title: 'Chest X-Ray',
    description: 'Routine chest radiography from annual physical',
    type: 'imaging',
    size: '5.8 MB',
    date: '2024-12-15',
    tags: ['X-Ray', 'Imaging', 'Annual Checkup'],
  },
  {
    id: '3',
    title: 'Prescription - Lisinopril',
    description: 'Monthly prescription refill',
    type: 'prescription',
    size: '156 KB',
    date: '2024-12-10',
    tags: ['Prescription', 'Cardiology'],
  },
  {
    id: '4',
    title: 'Consultation Notes - Cardiology',
    description: 'Visit notes from cardiologist appointment',
    type: 'document',
    size: '845 KB',
    date: '2024-12-05',
    tags: ['Consultation', 'Cardiology', 'Notes'],
  },
];

function MedicalRecordsPage() {
  const { uploadFiles, deleteFile } = useMedicalRecords();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredRecords = mockRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === 'all' || record.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    uploadFiles(files);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'lab': return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
      case 'imaging': return <FileImage className="h-8 w-8 text-purple-500" />;
      case 'prescription': return <FileText className="h-8 w-8 text-blue-500" />;
      default: return <FileText className="h-8 w-8 text-slate-500" />;
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Medical Records</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage and access your health documents securely
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Brain className="h-4 w-4" />
              AI Search
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && uploadFiles(Array.from(e.target.files))}
            />
          </div>
        </div>

        {/* AI Search Bar */}
        <Card className="bg-linear-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-200">
          <CardContent className="p-4">
            <div className="relative">
              <Brain className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-600" />
              <Input
                placeholder="Search with AI - Try 'Find my last blood test' or 'Show all cardiology reports'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white/80 dark:bg-slate-900/80"
              />
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'lab', label: 'Lab Results' },
            { id: 'imaging', label: 'Imaging' },
            { id: 'prescription', label: 'Prescriptions' },
            { id: 'document', label: 'Documents' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                activeFilter === filter.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
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
              <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">PDF, JPG, PNG up to 50MB each</p>
          </div>
        </div>

        {/* Records Grid */}
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500">No records found</p>
              <p className="text-sm text-slate-400 mt-1">Upload your first medical record</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0">
                        {getFileIcon(record.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {record.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {record.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          <span>{record.size}</span>
                          <span>•</span>
                          <span>{record.date}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {record.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                          <Download className="h-4 w-4 text-slate-500" />
                        </button>
                        <button 
                          onClick={() => deleteFile(record.id)}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="h-4 w-4 text-danger-500" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
