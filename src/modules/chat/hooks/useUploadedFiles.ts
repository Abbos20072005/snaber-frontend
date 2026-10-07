import type { ChangeEvent } from 'react';

import { useEffect, useRef, useState } from 'react';

import type { UploadedFileItem } from '@/modules/chat';

export const useUploadedFiles = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const uploadedFilesRef = useRef<UploadedFileItem[]>([]);

  const handleFilesUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) return;

    const nextFiles = files.map((file, index) => {
      const isImage = file.type.startsWith('image/');

      return {
        id: `${Date.now()}-${index}-${file.name}`,
        file,
        isImage,
        previewUrl: isImage ? URL.createObjectURL(file) : null
      } satisfies UploadedFileItem;
    });

    setUploadedFiles((prev) => [...prev, ...nextFiles]);
    event.target.value = '';
  };

  const handleRemoveUploadedFile = (id: string) => {
    setUploadedFiles((prev) => {
      const targetFile = prev.find((item) => item.id === id);

      if (targetFile?.previewUrl) URL.revokeObjectURL(targetFile.previewUrl);

      return prev.filter((item) => item.id !== id);
    });
  };

  useEffect(() => {
    uploadedFilesRef.current = uploadedFiles;
  }, [uploadedFiles]);

  useEffect(() => {
    return () => {
      uploadedFilesRef.current.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  return {
    handleFilesUpload,
    handleRemoveUploadedFile,
    setUploadedFiles,
    uploadedFiles
  };
};
