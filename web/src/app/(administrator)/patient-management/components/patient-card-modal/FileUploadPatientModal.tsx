/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from 'react';
import { X, Upload, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
    onFileUpload?: (files: File[]) => void;
    className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
    onFileUpload,
    className = "" 
}) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (files: File[]) => {
        const validFiles = files.filter(file => {
            const isValidType = file.name.match(/\.(xls|xlsx)$/i);
            const isValidSize = file.size <= 25 * 1024 * 1024;
            return isValidType && isValidSize;
        });

        setUploadedFiles(prev => [...prev, ...validFiles]);
        if (onFileUpload) {
            onFileUpload(validFiles);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const removeFile = (fileName: string) => {
        setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
    };

    const getFileIcon = (fileName: string) => {
        if (fileName.match(/\.(xls|xlsx)$/i)) {
            return (
                <div className="w-6 h-6 bg-green-500 dark:bg-green-600 rounded flex items-center justify-center">
                    <span className="text-xs text-white font-medium">XLS</span>
                </div>
            );
        }
        return (
            <div className="w-6 h-6 bg-blue-500 dark:bg-blue-600 rounded flex items-center justify-center">
                <span className="text-xs text-white font-medium">FIG</span>
            </div>
        );
    };

    return (
        <div className={`lg:min-w-[425px] bg-white dark:bg-gray-700 rounded-xl shadow-sm ${className}`}>
            {/* Tabs */}
            <div className="flex rounded-t-xl overflow-hidden border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'upload'
                            ? 'bg-white dark:bg-gray-600 text-blue-500 dark:text-blue-400 border-b-2 border-blue-500'
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                >
                    Upload
                </button>
                <button
                    onClick={() => setActiveTab('download')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'download'
                            ? 'bg-white dark:bg-gray-800 text-blue-500 dark:text-blue-400 border-b-2 border-blue-500'
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                >
                    Download
                </button>
            </div>

            <div className="p-6">
                {/* Área de Upload */}
                <div
                    className={`
                        border-2 border-dashed rounded-xl 
                        ${dragActive 
                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10' 
                            : 'border-gray-200 dark:border-gray-600'
                        }
                        transition-all duration-200
                        cursor-pointer
                    `}
                    onDragEnter={() => setDragActive(true)}
                    onDragLeave={() => setDragActive(false)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="p-8 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                            <Upload className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-1">
                            Drag & drop or click to choose files
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".xls,.xlsx"
                            multiple
                            onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                        />
                    </div>
                </div>

                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                    <span>Supported formats: XLS, XLSX</span>
                    <span>Max: 25MB</span>
                </div>

                {/* Lista de Arquivos */}
                <AnimatePresence>
                    {uploadedFiles.map((file, index) => (
                        <motion.div
                            key={file.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="mt-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                {getFileIcon(file.name)}
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {index === 0 && (
                                    <div className="w-24 h-1 bg-blue-100 dark:bg-blue-500/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 dark:bg-blue-400 transition-all duration-300"
                                            style={{ width: '74%' }}
                                        />
                                    </div>
                                )}
                                <button
                                    onClick={() => removeFile(file.name)}
                                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};