"use client"

import { convertFileToUrl } from '@/lib/utils';
import Image from 'next/image';
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

type FileUploaderProps = {
  file: File[];
  onChange: (file: File[]) => void;
}
const FileUploader = ({ file, onChange }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()} className='file-upload'>
      <input {...getInputProps()} />
      {
        <>
          {file && file?.length > 0 ? (
            <Image
              src={convertFileToUrl(file[0])}
              width={1000}
              height={1000}
              alt="uploaded image"
              className="max-h-[400px] overflow-hidden object-cover"
            />
          ) : (
          <Image
            src="/assets/icons/upload.svg"
            width={60}
            height={60}
            alt="file upload"
            className="max-h-[400px] overflow-hidden object-cover"
          />)}
          <div className="file-upload_label">
            <p className="text-14-regular">
              <span className="text-green-500">
                Click to upload
              </span> or drag and drop
            </p>
            <p>SVG,JPG,PNG or GIF (max 800x400)</p>
          </div>
        </>
      }
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

export default FileUploader
