import { useLingui } from '@lingui/react/macro';
import { LoaderCircleIcon, Trash2Icon } from 'lucide-react';
import React from 'react';

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger
} from '@/shared/ui/file-upload';
import { useFieldContext } from '@/shared/ui/form/hooks.ts';

import type { FormControlProps } from './FormBase';

import { FormBase } from './FormBase';

type FormFileUploadProps = FormControlProps &
  React.ComponentProps<typeof FileUpload> & {
    accept?: string;
    label: string;
    loading?: boolean;
    loadingText?: string;
    maxFiles?: number;
    multiple?: boolean;
    selectText?: string;
    uploadHint?: string;
  };

export const FormFileUpload = ({
  label,
  description,
  isRequired,
  accept,
  loading,
  loadingText,
  maxFiles,
  multiple,
  uploadHint,
  selectText,
  ...props
}: FormFileUploadProps) => {
  const { t } = useLingui();

  const field = useFieldContext<File[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <>
      <FormBase isRequired={isRequired} label={label} description={description}>
        <FileUpload
          accept={accept}
          disabled={loading || props.disabled}
          maxFiles={maxFiles}
          multiple={multiple}
          value={field.state.value || []}
          onValueChange={(files) => field.handleChange(files)}
          {...props}
        >
          {(multiple || field.state.value.length === 0) && (
            <FileUploadDropzone className='gap-2 px-4 py-5'>
              <p className='text-muted-foreground text-xs'>
                {uploadHint || t`Drop a file here or choose one`}
              </p>
              <FileUploadTrigger
                aria-invalid={isInvalid}
                className='hover:bg-muted flex items-center rounded-none border px-2 py-1 text-xs transition-colors'
                disabled={loading || props.disabled}
              >
                {loading && <LoaderCircleIcon className='mr-1 size-3.5 animate-spin' />}
                {loading ? loadingText || t`Loading...` : selectText || t`Select file`}
              </FileUploadTrigger>
            </FileUploadDropzone>
          )}
          {field.state.value.length > 0 && (
            <FileUploadList className='mt-2'>
              {field.state.value.map((file, index) => (
                <FileUploadItem key={`${file.name}-${file.lastModified}-${index}`} value={file}>
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata size='sm' />
                  <FileUploadItemDelete className='hover:bg-muted rounded-none border p-1 transition-colors'>
                    <Trash2Icon className='size-3.5' />
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          )}
        </FileUpload>
      </FormBase>
    </>
  );
};
