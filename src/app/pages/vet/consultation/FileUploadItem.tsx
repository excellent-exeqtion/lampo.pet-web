// src/components/forms/consultation/FileUploadItem.tsx
import React from 'react';
import { ConsultationFileType } from '@/types/index';
import { FaFilePdf, FaFileImage, FaFileAlt, FaTrash } from 'react-icons/fa';

interface FileUploadItemProps {
    file: ConsultationFileType;
    onDelete: (fileId: string) => void;
    // onDownload?: (filePath: string) => void; // Opcional, si manejas la descarga
}

export function FileUploadItem({ file, onDelete /*, onDownload */ }: FileUploadItemProps) {
    const getFileIcon = () => {
        if (file.file_type?.startsWith('image/')) return <FaFileImage className="text-blue-500" />;
        if (file.file_type === 'application/pdf') return <FaFilePdf className="text-red-500" />;
        return <FaFileAlt className="text-gray-500" />;
    };

    // La URL de descarga vendría de una API que genere una URL firmada
    // const handleDownload = () => {
    //     if(onDownload) onDownload(file.file_path);
    // };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem',
            border: '1px solid var(--primary-inverse)',
            borderRadius: '4px',
            marginBottom: '0.5rem',
            fontSize: '0.9rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {getFileIcon()}
                <span>{file.file_name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-lightgray)' }}> ({(file.file_size_bytes! / 1024).toFixed(1)} KB)</span>
            </div>
            <div>
                {/* 
                // Botón de descarga (requiere API para URL firmada)
                <button 
                    type="button" 
                    onClick={handleDownload} 
                    className="outline secondary" 
                    aria-label="Descargar archivo"
                    style={{marginRight: '0.5rem', padding: '0.25rem 0.5rem'}}
                >
                    <FaDownload />
                </button> 
                */}
                <button
                    type="button"
                    onClick={() => onDelete(file.id)}
                    className="outline secondary"
                    aria-label="Eliminar archivo"
                    style={{ color: 'var(--pico-color-red-500)', borderColor: 'var(--pico-color-red-500)', padding: '0.25rem 0.5rem' }}
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
}