// frontend/src/components/PDFViewer.tsx
// import { useState } from 'react';
import { FileText } from 'lucide-react';

interface PDFViewerProps {
  fileUrl: string;
}

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-inner overflow-hidden">
      {fileUrl ? (
        <div className="h-full flex flex-col">
          <div className="bg-white/80 backdrop-blur-sm p-4 border-b border-white/20">
            <div className="flex items-center gap-2 text-slate-600">
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">PDF Document</span>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <iframe
              src={fileUrl}
              className="w-full h-full rounded-xl border-0 shadow-lg"
              title="PDF Viewer"
            />
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FileText className="w-12 h-12 text-blue-500" />
            </div>
            <p className="text-slate-500 text-lg font-medium">Upload a PDF to view it here</p>
            <p className="text-slate-400 text-sm mt-2">Drag & drop or click to upload</p>
          </div>
        </div>
      )}
    </div>
  );
}