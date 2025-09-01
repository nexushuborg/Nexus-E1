/* This code defines a React component called `UploadCodeDialog` that creates a dialog box for
uploading and analyzing code snippets. Here's a breakdown of what the code does: At present it is not being used*/
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

// Component for a dialog that allows users to upload a code file for analysis.
export function UploadCodeDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection from the input.
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  // Simulate an analysis process.
  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    // Simulate API call with a 2-second delay.
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    setFile(null);
    setOpen(false);
  };

  // Drag and drop event handlers.
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

  // Programmatically trigger the hidden file input.
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        // Reset state when the dialog is closed.
        if (!isOpen) {
          setFile(null);
          setIsAnalyzing(false);
        }
      }}
    >
      {/* Button to open the dialog. */}
      <DialogTrigger asChild>
        <Button className="rounded-lg bg-purple-500 text-white border-purple-500 hover:cursor-pointer">
          Upload Code
        </Button>
      </DialogTrigger>

      {/* Dialog content. */}
      <DialogContent className="w-[90vw] sm:w-max sm:max-w-[480px] bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Upload Code Snippet
          </DialogTitle>
          <DialogDescription className="text-gray-700 dark:text-gray-300">
            Upload a file with your code to get an analysis. Accepted formats:
            .java, .py, .html.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Conditional rendering for drag-and-drop area or selected file display. */}
          {!file ? (
            <div
              className={cn(
                "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                isDragging
                  ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                  : "border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800",
                "hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-700 dark:text-gray-200">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  JAVA, PYTHON, or HTML
                </p>
              </div>
              {/* Hidden file input. */}
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
            // Display for the selected file.
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <File className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {file.name}
                </span>
              </div>
              {/* Button to remove the selected file. */}
              <button
                onClick={() => setFile(null)}
                className="h-7 w-7 rounded-full p-0 flex items-center justify-center bg-popover dark:bg-gray-700 hover:bg-muted-foreground/10"
              >
                <X className="w-4 h-4 text-muted-foreground dark:text-gray-300" />
              </button>
            </div>
          )}
        </div>

        <DialogFooter>
          {/* "Analyze" button with a loading state. */}
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
