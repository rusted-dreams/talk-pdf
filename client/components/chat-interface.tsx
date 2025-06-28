"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Trash2,
  MessageSquare,
  Loader2,
  FileText,
  Files,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { ChatMessage, PdfFile } from "@/app/chat/page";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  selectedPdfs: PdfFile[];
  disabled: boolean;
}

export function ChatInterface({
  messages,
  onSendMessage,
  onClearChat,
  selectedPdfs,
  disabled,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || disabled) return;

    onSendMessage(inputValue.trim());
    setInputValue("");
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getPlaceholderText = () => {
    if (selectedPdfs.length === 0) {
      return "Select PDFs to start chatting...";
    } else if (selectedPdfs.length === 1) {
      return `Ask a question about ${selectedPdfs[0].title}...`;
    } else {
      return `Ask a question about your ${selectedPdfs.length} selected documents...`;
    }
  };

  const getEmptyStateContent = () => {
    if (selectedPdfs.length === 0) {
      return {
        icon: (
          <MessageSquare className="w-16 h-16 text-muted-foreground/30 mb-4" />
        ),
        title: "Select PDFs to start chatting",
        description:
          "Upload PDF documents and select them from the list to begin an AI-powered conversation about their contents.",
      };
    } else if (!selectedPdfs.every((pdf) => pdf.status === "ready")) {
      return {
        icon: <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />,
        title: "Processing PDFs",
        description:
          "Please wait while we prepare your documents for analysis...",
      };
    } else {
      return {
        icon: (
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            {selectedPdfs.length === 1 ? (
              <FileText className="w-8 h-8 text-primary" />
            ) : (
              <Files className="w-8 h-8 text-primary" />
            )}
          </div>
        ),
        title:
          selectedPdfs.length === 1
            ? "Start a conversation"
            : "Chat with multiple documents",
        description:
          selectedPdfs.length === 1
            ? "Ask questions about your PDF document. I can help you understand content, find specific information, or summarize sections."
            : `Ask questions across your ${selectedPdfs.length} selected documents. I can find connections, compare information, and provide comprehensive insights from multiple sources.`,
      };
    }
  };

  const emptyState = getEmptyStateContent();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          {selectedPdfs.length === 1 ? (
            <FileText className="w-5 h-5 text-primary" />
          ) : selectedPdfs.length > 1 ? (
            <Files className="w-5 h-5 text-primary" />
          ) : (
            <MessageSquare className="w-5 h-5 text-primary" />
          )}
          <div>
            <h2 className="text-lg font-semibold">Chat</h2>
            {selectedPdfs.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedPdfs.length === 1
                  ? `Chatting with ${selectedPdfs[0].title}`
                  : `Chatting with ${selectedPdfs.length} documents`}
              </p>
            )}
          </div>
        </div>

        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearChat}
            className="text-xs"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            {emptyState.icon}
            <h3 className="text-lg font-medium mb-2">{emptyState.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              {emptyState.description}
            </p>
            {selectedPdfs.length > 0 &&
              selectedPdfs.every((pdf) => pdf.status === "ready") && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedPdfs.length === 1 ? (
                    <>
                      <Badge variant="secondary" className="text-xs">
                        Summarize this document
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Find key points
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Explain complex terms
                      </Badge>
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary" className="text-xs">
                        Compare documents
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Find common themes
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Cross-reference information
                      </Badge>
                    </>
                  )}
                </div>
              )}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[85%] p-3 rounded-lg relative
                    ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-12"
                        : "bg-muted mr-12"
                    }
                  `}
                >
                  {message.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">
                        {selectedPdfs.length === 1
                          ? "Analyzing document..."
                          : "Analyzing documents..."}
                      </span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      {message.sourcePdfs && message.sourcePdfs.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-current/20">
                          <div className="flex flex-wrap gap-1">
                            {message.sourcePdfs.map((pdfId) => {
                              const pdf = selectedPdfs.find(
                                (p) => p.id === pdfId
                              );
                              return pdf ? (
                                <Badge
                                  key={pdfId}
                                  variant="outline"
                                  className="text-xs bg-background/50"
                                >
                                  {pdf.title}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                      <span
                        className={`
                        text-xs mt-2 block
                        ${
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }
                      `}
                      >
                        {formatTime(message.timestamp)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholderText()}
              disabled={disabled}
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
          </div>
          <Button
            type="submit"
            disabled={!inputValue.trim() || disabled}
            size="default"
            className="shrink-0 h-[44px] w-[44px] p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {selectedPdfs.length > 0 && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Connected to {selectedPdfs.length} document
              {selectedPdfs.length > 1 ? "s" : ""}
            </p>
            {selectedPdfs.length > 1 && (
              <p className="text-xs text-primary">
                Multi-document analysis enabled
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
