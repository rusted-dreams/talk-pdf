"use client";

import React from "react";
import {
  FileText,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { PdfFile } from "@/app/chat/page";

interface PdfListProps {
  pdfFiles: PdfFile[];
  selectedPdfs: string[];
  onSelectPdf: (id: string) => void;
  onDeletePdf: (id: string) => void;
  multiSelect?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getStatusIcon = (status: PdfFile["status"]) => {
  switch (status) {
    case "uploading":
      return <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />;
    case "processing":
      return <Clock className="w-3.5 h-3.5 text-yellow-500" />;
    case "ready":
      return <CheckCircle className="w-3.5 h-3.5 text-green-500" />;
    case "error":
      return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
  }
};

const getStatusBadge = (status: PdfFile["status"]) => {
  const variants = {
    uploading: "default",
    processing: "secondary",
    ready: "default",
    error: "destructive",
  } as const;

  const labels = {
    uploading: "Uploading",
    processing: "Processing",
    ready: "Ready",
    error: "Error",
  };

  return (
    <Badge variant={variants[status]} className="text-xs px-1.5 py-0.5 h-5">
      {labels[status]}
    </Badge>
  );
};

export function PdfList({
  pdfFiles,
  selectedPdfs,
  onSelectPdf,
  onDeletePdf,
  multiSelect = false,
}: PdfListProps) {
  if (pdfFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <p className="text-sm text-muted-foreground">
          No documents uploaded yet
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Upload PDFs to start chatting
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-2">
        {pdfFiles.map((pdf) => {
          const isSelected = selectedPdfs.includes(pdf.id);
          const canSelect = pdf.status === "ready";

          return (
            <div
              key={pdf.id}
              className={`
                group relative p-3 border rounded-lg transition-all duration-200
                ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : canSelect
                    ? "border-border hover:border-primary/50 hover:bg-accent/50 cursor-pointer"
                    : "border-border opacity-60"
                }
              `}
              onClick={() => canSelect && onSelectPdf(pdf.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                  {multiSelect && canSelect && (
                    <div className="flex-shrink-0">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelectPdf(pdf.id)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary w-4 h-4"
                      />
                    </div>
                  )}

                  <div className="flex-shrink-0">
                    {getStatusIcon(pdf.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3
                        className="text-sm font-medium truncate pr-2"
                        title={pdf.title}
                      >
                        {pdf.title}
                      </h3>
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        {getStatusBadge(pdf.status)}
                        {isSelected && (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePdf(pdf.id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(pdf.fileSize)}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(pdf.uploadDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {pdf.status === "uploading" &&
                typeof pdf.progress === "number" && (
                  <Progress value={pdf.progress} className="h-1 mt-2" />
                )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
