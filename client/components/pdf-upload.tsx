"use client";

import React, { useCallback, useState } from "react";
import { Upload, FileText, X, Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

interface PdfUploadProps {
  onFileUpload: (files: File[]) => void;
}

export function PdfUpload({ onFileUpload }: PdfUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  //test:
  const uploadFilesToServer = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("pdf", file)); // backend should support 'files' key

    try {
      const response = await axios.post(
        `http://localhost:8000/api/upload/pdf`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Upload successful");
      console.log(response.data); // handle success
    } catch (error: any) {
      toast.error("Upload failed");
      console.error(error);
    }
  };

  const handleFiles = useCallback(
    (files: File[]) => {
      const pdfFiles = files.filter((file) => file.type === "application/pdf");

      if (pdfFiles.length > 0) {
        onFileUpload?.(pdfFiles);
        uploadFilesToServer(pdfFiles);
        toast.success(
          pdfFiles.length === 1
            ? `Uploading ${pdfFiles[0].name}`
            : `Uploading ${pdfFiles.length} PDF files`
        );
      } else {
        toast.error("Please upload PDF files only");
      }
    },
    [onFileUpload]
  );
  // test over

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [handleFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFiles(files);
      e.target.value = "";
    },
    [handleFiles]
  );

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
        ${
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf"
        multiple
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="flex flex-col items-center space-y-4">
        <div
          className={`
          p-3 rounded-full transition-colors
          ${isDragOver ? "bg-primary text-primary-foreground" : "bg-muted"}
        `}
        >
          {isDragOver ? (
            <Files className="w-6 h-6" />
          ) : (
            <Upload className="w-6 h-6" />
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">
            {isDragOver ? "Drop your PDFs here" : "Drag & drop your PDFs here"}
          </p>
          <p className="text-xs text-muted-foreground">
            Select single or multiple files • PDF format only
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            const input =
              e.currentTarget.parentElement?.parentElement?.querySelector(
                'input[type="file"]'
              ) as HTMLInputElement;
            input?.click();
          }}
        >
          <FileText className="w-4 h-4 mr-2" />
          Select PDFs
        </Button>
      </div>
    </div>
  );
}
