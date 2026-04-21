import React, { useState, useRef } from 'react';
import { X, Upload, Calendar, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useResource } from '../contexts/ResourceContext';
import { Resource } from '../types';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { addResource } = useResource();
  const [selectedClass, setSelectedClass] = useState<string>('1');
  const [dueDate, setDueDate] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const classes = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

  const inferFileType = (fileName: string): Resource['type'] => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) return 'document';
    if (ext === 'pdf') return 'pdf';
    if (['mp4', 'mov', 'avi'].includes(ext)) return 'video';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    if (['doc', 'docx', 'txt', 'ppt', 'pptx'].includes(ext)) return 'document';
    return 'document';
  };

  const formatFileSize = (size: number): string => {
    if (size < 1024) return size + ' B';
    else if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    else return (size / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0 || !dueDate) {
      alert(t('pleaseSelectFile'));
      return;
    }

    selectedFiles.forEach((file, index) => {
      const newResource = {
        id: Date.now().toString() + index,
        name: file.name,
        type: inferFileType(file.name),
        subject: 'General', // Default subject since subject input is removed
        class: selectedClass,
        uploadDate: new Date().toISOString().split('T')[0],
        size: formatFileSize(file.size)
      };
      addResource(newResource);
    });

    // Reset form
    setSelectedFiles([]);
    setDueDate('');
    setSelectedClass('1');
    onClose();
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setDueDate('');
    setSelectedClass('1');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{t('newAssignmentTitle')}</h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              {selectedFiles.length > 0
                ? `${selectedFiles.length} ${t('filesSelected')}`
                : t('clickToSelect')
              }
            </p>
            <p className="text-xs text-gray-400">
              {t('supportsFiles')}
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
            />
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">{t('selectedFiles')}</p>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('class')}
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {classes.map((classNum) => (
                <option key={classNum} value={classNum}>
                  Class {classNum}
                </option>
              ))}
            </select>
          </div>

          {/* Subject will be inferred from file name or set to default */}

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('dueDate')}
            </label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200"
          >
            {t('createAssignment')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;
