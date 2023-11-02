"use client";

import { FC, useState } from "react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface DropzoneProps {
  files: any[];
  name: string;
  file: {
    name: string;
  };
}

interface RemoveFile {
  name: string;
}

const Dropzone: FC<DropzoneProps> = ({}) => {
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);

  const removeFile = (name: string) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };
  const removeRejected = (name: string) => {
    setRejected((files) => files.filter(({ file }) => file.name !== name));
  };

  const onDrop = useCallback(
    (acceptedFiles: never[], rejectedFiles: never[]) => {
      // Do something with the files
      if (acceptedFiles?.length) {
        setFiles((previousFiles) => [
          ...previousFiles,
          ...acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          ),
        ]);
      }
      if (rejectedFiles?.length) {
        setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
      }

      console.log(acceptedFiles);
      console.log(rejectedFiles);
    },

    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000,
    onDrop,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!files?.length) return;
    // Pushing each images to cloudinary
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));
      formData.append("upload_prese t", "ww1gtckp");

      const URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
      const data = await fetch(URL, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      console.log(data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        {...getRootProps({
          className: "border-2 p-20",
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag `n` drop some files here, or click to select files</p>
        )}
      </div>

      {/* // preview section */}
      <h3 className="title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3">
        Accepted Files
      </h3>
      <button
        type="submit"
        className="ml-auto mt-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-purple-400 rounded-md px-3 hover:bg-purple-400 hover:text-white transition-colors"
      >
        Upload to Cloudinary
      </button>
      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
        {files.map((file) => (
          <li key={file.name} className="relative h-32 rounded-md shadow-lg">
            <Image
              src={file.preview}
              alt={file.name}
              width={100}
              height={100}
              onLoad={() => {
                URL.revokeObjectURL(file.preview);
              }}
              className="h-full w-full object-contain rounded-md"
            />
            <button
              type="button"
              className="w-7 h-7 border border-red-400 bg-red-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors"
              onClick={() => removeFile(file.name)}
            >
              <XMarkIcon className="w-5 h-5 fill-white hover:fill-red-400 transition-colors" />
            </button>

            <p className="mt-2 text-neutral-500 text-[12px] font-medium">
              {file.name}
            </p>
          </li>
        ))}
      </ul>

      {/* Rejected Files */}
      <h3 className="title text-lg font-semibold text-neutral-600 mt-24 border-b pb-3">
        Rejected Files
      </h3>
      <ul className="mt-6 flex flex-col gap-x-2">
        {rejected.map(({ file, errors }) => (
          <li key={file.name} className="flex items-start justify-between">
            <div>
              <p className="mt-2 text-neutral-500 text-sm font-medium">
                {file.name}
              </p>
              <ul className="text-[12px] text-red-400">
                {errors.map((error) => (
                  <li key={error.code}>{error.message}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className="mt-1 py-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-neutral-500 hover:text-white transition-colors"
              onClick={() => removeRejected(file.name)}
            >
              remove
            </button>
          </li>
        ))}
      </ul>
    </form>
  );
};

export default Dropzone;
