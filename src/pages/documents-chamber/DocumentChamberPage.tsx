import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {
  FileText, Upload, Eye, PenTool, CheckCircle,
  Clock, Edit, Trash2, X, Download
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'Draft' | 'In Review' | 'Signed';
  uploadedAt: string;
  uploadedBy: string;
}

const DocumentChamberPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Investment Agreement - Series A.pdf',
      type: 'PDF',
      size: '2.4 MB',
      status: 'In Review',
      uploadedAt: '2026-03-10',
      uploadedBy: 'Ali Khan',
    },
    {
      id: '2',
      name: 'Term Sheet - Nexus Deal.pdf',
      type: 'PDF',
      size: '1.1 MB',
      status: 'Draft',
      uploadedAt: '2026-03-12',
      uploadedBy: 'Sarah Johnson',
    },
    {
      id: '3',
      name: 'NDA Agreement.pdf',
      type: 'PDF',
      size: '0.8 MB',
      status: 'Signed',
      uploadedAt: '2026-03-05',
      uploadedBy: 'Sara Ahmed',
    },
  ]);

  const [showSignModal, setShowSignModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status Color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'In Review': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Signed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Status Icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft': return <Edit size={12} />;
      case 'In Review': return <Clock size={12} />;
      case 'Signed': return <CheckCircle size={12} />;
      default: return null;
    }
  };

  // File Upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        status: 'Draft',
        uploadedAt: new Date().toISOString().split('T')[0],
        uploadedBy: 'You',
      };
      setDocuments(prev => [newDoc, ...prev]);
    });
  };

  // Delete Document
  const handleDelete = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  // Change Status
  const handleStatusChange = (id: string, status: Document['status']) => {
    setDocuments(documents.map(d =>
      d.id === id ? { ...d, status } : d
    ));
  };

  // Sign Document
  const handleSign = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      if (selectedDoc) {
        handleStatusChange(selectedDoc.id, 'Signed');
      }
      setShowSignModal(false);
      sigCanvas.current.clear();
    }
  };

  // Stats
  const stats = {
    total: documents.length,
    draft: documents.filter(d => d.status === 'Draft').length,
    inReview: documents.filter(d => d.status === 'In Review').length,
    signed: documents.filter(d => d.status === 'Signed').length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        📁 Document Chamber
      </h1>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'bg-gray-50 border-gray-200', text: 'text-gray-700' },
          { label: 'Draft', value: stats.draft, color: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700' },
          { label: 'In Review', value: stats.inReview, color: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
          { label: 'Signed', value: stats.signed, color: 'bg-green-50 border-green-200', text: 'text-green-700' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} border rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Upload + Documents List */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Upload Area */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              handleFileUpload(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50'
            }`}
          >
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 font-medium">
              Drop files here or click to upload
            </p>
            <p className="text-gray-400 text-sm mt-1">
              PDF, DOC, DOCX supported
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={e => handleFileUpload(e.target.files)}
            />
          </div>

          {/* Documents List */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-700">
                📄 All Documents ({documents.length})
              </h2>
            </div>
            {documents.map(doc => (
              <div key={doc.id}
                className="flex items-center gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-all">

                {/* Icon */}
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-red-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {doc.size} • {doc.uploadedAt} • by {doc.uploadedBy}
                  </p>
                </div>

                {/* Status Badge */}
                <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                  {getStatusIcon(doc.status)}
                  {doc.status}
                </span>

                {/* Actions */}
                <div className="flex gap-1">
                  <button
                    onClick={() => { setSelectedDoc(doc); setShowPreviewModal(true); }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Preview"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => { setSelectedDoc(doc); setShowSignModal(true); }}
                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                    title="Sign"
                  >
                    <PenTool size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Status Change Panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold text-gray-700 mb-4">
              🔄 Update Status
            </h2>
            {documents.map(doc => (
              <div key={doc.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700 truncate mb-2">
                  {doc.name}
                </p>
                <div className="flex flex-col gap-1">
                  {(['Draft', 'In Review', 'Signed'] as Document['status'][]).map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(doc.id, s)}
                      className={`text-xs py-1.5 px-3 rounded-lg border transition-all text-left flex items-center gap-2 ${
                        doc.status === s
                          ? getStatusColor(s) + ' font-semibold'
                          : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {getStatusIcon(s)} {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">📄 Document Preview</h2>
              <button onClick={() => setShowPreviewModal(false)}>
                <X size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
              <FileText size={48} className="mx-auto text-red-400 mb-3" />
              <p className="font-medium text-gray-800">{selectedDoc.name}</p>
              <p className="text-sm text-gray-400 mt-1">{selectedDoc.size}</p>
              <span className={`inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedDoc.status)}`}>
                {getStatusIcon(selectedDoc.status)} {selectedDoc.status}
              </span>
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 text-left">
                <p className="text-xs text-gray-500">Uploaded by: <span className="font-medium text-gray-700">{selectedDoc.uploadedBy}</span></p>
                <p className="text-xs text-gray-500 mt-1">Date: <span className="font-medium text-gray-700">{selectedDoc.uploadedAt}</span></p>
                <p className="text-xs text-gray-500 mt-1">Type: <span className="font-medium text-gray-700">{selectedDoc.type}</span></p>
              </div>
            </div>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {showSignModal && selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">✍️ Sign Document</h2>
              <button onClick={() => setShowSignModal(false)}>
                <X size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4 truncate">
              📄 {selectedDoc.name}
            </p>
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{
                  width: 400,
                  height: 180,
                  className: 'w-full',
                }}
              />
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Draw your signature above
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => sigCanvas.current?.clear()}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 text-sm"
              >
                Clear
              </button>
              <button
                onClick={handleSign}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 text-sm font-medium"
              >
                ✅ Sign & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentChamberPage;