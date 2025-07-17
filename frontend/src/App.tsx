// // frontend/src/App.tsx
// import { useState } from 'react';
// import FileUpload from './components/FileUpload';
// import PDFViewer from './components/PDFViewer';
// import ChatBox from './components/ChatBox';

// export default function App() {
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [fileUrl, setFileUrl] = useState('');

//   const handleFileUpload = (file: File) => {
//     setUploadedFile(file);
//     const url = URL.createObjectURL(file);
//     setFileUrl(url);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <div className="container mx-auto px-4 py-6">
//         <div className="mb-8 text-center">
//           <h1 className="text-4xl font-bold text-slate-800 mb-2">PDF Chat Assistant</h1>
//           <p className="text-slate-600">Upload your PDF and chat with it using AI</p>
//         </div>

//         {/* 
//           - `overflow-hidden` on the grid keeps the page from growing.
//           - `overflow-hidden` on the right panel scopes scrolling to its children.
//         */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)] overflow-hidden">
//           {/* Left Panel - PDF Viewer */}
//           <div className="flex flex-col space-y-4 h-full">
//             <PDFViewer fileUrl={fileUrl} />
//           </div>

//           {/* Right Panel - Upload & Chat */}
//           <div className="flex flex-col space-y-4 h-full overflow-hidden">
//             {/* Upload Section - Changes size based on upload status */}
//             <div className={`${uploadedFile ? 'h-auto' : 'h-48'} transition-all duration-300`}>
//               <FileUpload onSuccess={handleFileUpload} isUploaded={!!uploadedFile} />
//             </div>

//             {/* Chat Section - scroll only inside this panel */}
//             <div className="flex-1 min-h-0 overflow-hidden">
//               <ChatBox />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// frontend/src/App.tsx
import { useState } from 'react';
import FileUpload from './components/FileUpload';
import PDFViewer from './components/PDFViewer';
import ChatBox from './components/ChatBox';

export default function App() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState('');

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setFileUrl(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">PDF Talk</h1>
          <p className="text-slate-600">Upload your PDF and chat with it using AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)] overflow-hidden">
          {/* Left Panel - PDF Viewer */}
          <div className="flex flex-col space-y-4 h-full">
            <PDFViewer fileUrl={fileUrl} />
          </div>

          {/* Right Panel - Upload & Chat */}
          <div className="flex flex-col space-y-4 h-full overflow-hidden">
            {/* Upload Section */}
            <div
              className={`
                ${uploadedFile ? 'h-auto' : 'min-h-64'}
                transition-all duration-300
                overflow-auto
              `}
            >
              <FileUpload onSuccess={handleFileUpload} isUploaded={!!uploadedFile} />
            </div>

            {/* Chat Section */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ChatBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
