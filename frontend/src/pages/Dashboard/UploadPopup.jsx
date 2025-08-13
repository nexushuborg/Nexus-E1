import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { UploadCloud, File, X, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export function UploadCodeDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    setFile(null);
    setOpen(false);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setFile(null);
          setIsAnalyzing(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="rounded-lg bg-purple-500 text-white border-purple-500 hover:cursor-pointer">
          Upload Code
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] sm:w-max sm:max-w-[480px] bg-white rounded-lg shadow-lg border border-gray-300 dark:bg-card">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Upload Code Snippet
          </DialogTitle>
          <DialogDescription className="text-gray-700">
            Upload a file with your code to get an analysis. Accepted formats:
            .java, .py, .html.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {!file ? (
            <div
              className={cn(
                "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors",
                isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300"
              )}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-gray-500" />
                <p className="mb-2 text-sm text-gray-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-600 uppercase tracking-wide">
                  JAVA, PYTHON, or HTML
                </p>
              </div>
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".java,.py,.html"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-100 border-gray-300">
              <div className="flex items-center gap-3">
                <File className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </span>
              </div>
              <button
                onClick={() => setFile(null)}
                className="h-7 w-7 rounded-full p-0 flex items-center justify-center bg-popover hover:bg-muted-foreground/10"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className="w-full bg-pink-400 text-white hover:bg-pink-500"
          >
            {isAnalyzing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
