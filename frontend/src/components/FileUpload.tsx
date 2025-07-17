// // frontend/src/components/FileUpload.tsx
// import { useState } from 'react';
// import { Upload, FileText, Loader2 } from 'lucide-react';

// interface FileUploadProps {
//   onSuccess: (file: File) => void;
// }

// export default function FileUpload({ onSuccess }: FileUploadProps) {
//   const [fileName, setFileName] = useState('');
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setFileName(file.name);
//     setUploading(true);
//     setMessage('');
//     setIsError(false);

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const res = await fetch('http://localhost:8000/upload-pdf/', {
//         method: 'POST',
//         body: formData,
//       });

//       if (res.ok) {
//         setMessage('PDF uploaded and processed successfully!');
//         onSuccess(file);
//       } else {
//         const data = await res.json();
//         setMessage(`Upload failed: ${data.error || res.statusText}`);
//         setIsError(true);
//       }
//     } catch (err) {
//       setMessage('Failed to upload. Server might be down.');
//       setIsError(true);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
//       <div className="flex items-center gap-3 mb-4">
//         <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//           <Upload className="w-5 h-5 text-white" />
//         </div>
//         <h3 className="text-lg font-semibold text-slate-800">Upload PDF</h3>
//       </div>
      
//       <label className="block">
//         <input
//           type="file"
//           accept=".pdf"
//           onChange={handleFileChange}
//           disabled={uploading}
//           className="hidden"
//         />
//         <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
//           {uploading ? (
//             <div className="flex items-center justify-center gap-2">
//               <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
//               <span className="text-blue-600">Processing...</span>
//             </div>
//           ) : (
//             <div>
//               <Upload className="w-8 h-8 text-blue-500 mx-auto mb-3" />
//               <p className="text-slate-600 font-medium">Click to upload or drag & drop</p>
//               <p className="text-slate-400 text-sm mt-1">PDF files only</p>
//             </div>
//           )}
//         </div>
//       </label>

//       {fileName && (
//         <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//           <p className="text-sm text-blue-700 flex items-center gap-2">
//             <FileText className="w-4 h-4" />
//             {fileName}
//           </p>
//         </div>
//       )}

//       {message && (
//         <div className={`mt-4 p-3 rounded-lg ${
//           isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
//         }`}>
//           <p className="text-sm font-medium">{message}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// frontend/src/components/FileUpload.tsx
import { useState } from 'react';
import { Upload, FileText, Loader2, RefreshCw } from 'lucide-react';

interface FileUploadProps {
  onSuccess: (file: File) => void;
  isUploaded?: boolean;
}

export default function FileUpload({ onSuccess, isUploaded = false }: FileUploadProps) {
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    setMessage('');
    setIsError(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/upload-pdf/', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setMessage('PDF uploaded and processed successfully!');
        onSuccess(file);
      } else {
        const data = await res.json();
        setMessage(`Upload failed: ${data.error || res.statusText}`);
        setIsError(true);
      }
    } catch (err) {
      setMessage('Failed to upload. Server might be down.');
      setIsError(true);
    } finally {
      setUploading(false);
    }
  };

  // Minimized version after upload
  if (isUploaded) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30">
        <label className="block">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => {
              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
              if (fileInput) fileInput.click();
            }}
            disabled={uploading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Upload Other PDF
              </>
            )}
          </button>
        </label>

        {fileName && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 flex items-center gap-2">
              <FileText className="w-3 h-3" />
              {fileName}
            </p>
          </div>
        )}

        {message && (
          <div className={`mt-3 p-2 rounded-lg ${
            isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            <p className="text-xs font-medium">{message}</p>
          </div>
        )}
      </div>
    );
  }

  // Full version before upload
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Upload PDF</h3>
      </div>
      
      <label className="block">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
          {uploading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-blue-600">Processing...</span>
            </div>
          ) : (
            <div>
              <Upload className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">Click to upload or drag & drop</p>
              <p className="text-slate-400 text-sm mt-1">PDF files only</p>
            </div>
          )}
        </div>
      </label>

      {fileName && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {fileName}
          </p>
        </div>
      )}

      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}
    </div>
  );
}