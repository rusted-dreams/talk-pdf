"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { PdfUpload } from "@/components/pdf-upload";
import { ChatInterface } from "@/components/chat-interface";
import { PdfList } from "@/components/pdf-list";
import { Toaster } from "@/components/ui/sonner";

export interface PdfFile {
  id: string;
  title: string;
  uploadDate: Date;
  fileSize: number;
  status: "uploading" | "processing" | "ready" | "error";
  progress?: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isLoading?: boolean;
  sourcePdfs?: string[]; // Track which PDFs contributed to this response
}

export default function ChatPage() {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [selectedPdfs, setSelectedPdfs] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const handleFileUpload = (files: File[]) => {
    const newPdfs: PdfFile[] = files.map((file) => ({
      id: crypto.randomUUID(),
      title: file.name,
      uploadDate: new Date(),
      fileSize: file.size,
      status: "uploading" as const,
      progress: 0,
    }));

    setPdfFiles((prev) => [...prev, ...newPdfs]);

    // Simulate upload progress for each file
    newPdfs.forEach((newPdf) => {
      const interval = setInterval(() => {
        setPdfFiles((prev) =>
          prev.map((pdf) =>
            pdf.id === newPdf.id
              ? {
                  ...pdf,
                  progress: Math.min((pdf.progress || 0) + 10, 100),
                  status:
                    (pdf.progress || 0) >= 90 ? "processing" : "uploading",
                }
              : pdf
          )
        );
      }, 200);

      // Simulate processing completion
      setTimeout(() => {
        clearInterval(interval);
        setPdfFiles((prev) =>
          prev.map((pdf) =>
            pdf.id === newPdf.id
              ? { ...pdf, status: "ready", progress: 100 }
              : pdf
          )
        );
      }, 3000 + Math.random() * 2000); // Stagger completion times
    });
  };

  const handleDeletePdf = (id: string) => {
    setPdfFiles((prev) => prev.filter((pdf) => pdf.id !== id));
    setSelectedPdfs((prev) => prev.filter((pdfId) => pdfId !== id));

    // Clear chat if no PDFs are selected
    if (selectedPdfs.length === 1 && selectedPdfs[0] === id) {
      setChatMessages([]);
    }
  };

  const handleSelectPdf = (id: string) => {
    setSelectedPdfs((prev) => {
      if (prev.includes(id)) {
        // Deselect PDF
        const newSelection = prev.filter((pdfId) => pdfId !== id);
        if (newSelection.length === 0) {
          setChatMessages([]); // Clear chat if no PDFs selected
        }
        return newSelection;
      } else {
        // Select PDF
        return [...prev, id];
      }
    });
  };

  const handleSelectAllPdfs = () => {
    const readyPdfs = pdfFiles
      .filter((pdf) => pdf.status === "ready")
      .map((pdf) => pdf.id);
    setSelectedPdfs(readyPdfs);
  };

  const handleDeselectAllPdfs = () => {
    setSelectedPdfs([]);
    setChatMessages([]);
  };

  const handleSendMessage = (content: string) => {
    if (selectedPdfs.length === 0) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    const loadingMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: "",
      role: "assistant",
      timestamp: new Date(),
      isLoading: true,
    };

    setChatMessages((prev) => [...prev, userMessage, loadingMessage]);

    // Simulate AI response with multiple PDF analysis
    setTimeout(() => {
      const selectedPdfTitles = selectedPdfs.map(
        (id) => pdfFiles.find((pdf) => pdf.id === id)?.title || "Unknown"
      );

      let responseContent = "";

      if (selectedPdfs.length === 1) {
        responseContent = `Based on my analysis of "${selectedPdfTitles[0]}", here's what I found regarding your question: "${content}"\n\nThis is a simulated response that would normally contain AI-generated insights from the document. In a real implementation, this would include specific information extracted from the PDF content.`;
      } else {
        responseContent = `I've analyzed ${
          selectedPdfs.length
        } documents (${selectedPdfTitles.join(
          ", "
        )}) to answer your question: "${content}"\n\nCross-document analysis reveals:\n\n• Common themes across documents\n• Relevant information from multiple sources\n• Synthesized insights from all selected PDFs\n\nThis is a simulated response that would normally contain AI-generated insights from multiple documents, showing how information connects across your selected files.`;
      }

      const response: ChatMessage = {
        id: loadingMessage.id,
        content: responseContent,
        role: "assistant",
        timestamp: new Date(),
        isLoading: false,
        sourcePdfs: selectedPdfs,
      };

      setChatMessages((prev) =>
        prev.map((msg) => (msg.id === loadingMessage.id ? response : msg))
      );
    }, 2000 + Math.random() * 1000);
  };

  const handleClearChat = () => {
    setChatMessages([]);
  };

  const selectedPdfFiles = pdfFiles.filter((pdf) =>
    selectedPdfs.includes(pdf.id)
  );
  const readyPdfCount = pdfFiles.filter((pdf) => pdf.status === "ready").length;
  const hasReadyPdfs = readyPdfCount > 0;
  const allReadySelected =
    hasReadyPdfs && selectedPdfs.length === readyPdfCount;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* PDF Management Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Upload PDFs</h2>
              <PdfUpload onFileUpload={handleFileUpload} />
            </div>

            <div className="bg-card rounded-lg border p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Documents</h2>
                {hasReadyPdfs && (
                  <div className="flex gap-2">
                    {!allReadySelected ? (
                      <button
                        onClick={handleSelectAllPdfs}
                        className="text-xs text-primary hover:underline"
                      >
                        Select All
                      </button>
                    ) : (
                      <button
                        onClick={handleDeselectAllPdfs}
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        Deselect All
                      </button>
                    )}
                  </div>
                )}
              </div>

              {selectedPdfs.length > 0 && (
                <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    {selectedPdfs.length} document
                    {selectedPdfs.length > 1 ? "s" : ""} selected for chat
                  </p>
                  {selectedPdfs.length > 1 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Ask questions across multiple documents for comprehensive
                      insights
                    </p>
                  )}
                </div>
              )}

              <PdfList
                pdfFiles={pdfFiles}
                selectedPdfs={selectedPdfs}
                onSelectPdf={handleSelectPdf}
                onDeletePdf={handleDeletePdf}
                multiSelect={true}
              />
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border h-full">
              <ChatInterface
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onClearChat={handleClearChat}
                selectedPdfs={selectedPdfFiles}
                disabled={
                  selectedPdfs.length === 0 ||
                  !selectedPdfFiles.every((pdf) => pdf.status === "ready")
                }
              />
            </div>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
}
