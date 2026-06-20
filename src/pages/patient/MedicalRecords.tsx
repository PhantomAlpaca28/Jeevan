/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Search,
  Filter,
  UploadCloud,
  FileCode,
  Globe,
  Plus,
  Loader2,
  CheckCircle2,
  Cpu,
  Trash2,
  Download,
  AlertCircle
} from "lucide-react";
import { recordsService, MedicalDocument } from "../../services/records";
import GlassCard from "../../components/GlassCard";

export default function MedicalRecords() {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null);

  // Upload UI state
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState("");
  const [dragError, setDragError] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["All", "Lab Reports", "Prescriptions", "Imaging", "Doctor Notes", "Insurance Documents"];

  useEffect(() => {
    async function loadDocs() {
      const docs = await recordsService.getDocuments();
      setDocuments(docs);
      if (docs.length > 0) {
        setSelectedDoc(docs[0]);
      }
    }
    loadDocs();
  }, []);

  // Filter records based on category and search query
  const filteredDocList = documents.filter((doc) => {
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle Drag Leave
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Trigger Mock cryptographic uploading progression
  const simulateUploadSequence = async (fileName: string, fileSize: string) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStep("CRYPT_KEY: Establishing private Diffie-Hellman safe channel...");

    // Stage 1 (0 to 30%)
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUploadProgress(30);
    setUploadStep("LEDGER_RESONANCE: Calculating SHA-256 Merkle root integrity hash...");

    // Stage 2 (30 to 65%)
    await new Promise((resolve) => setTimeout(resolve, 900));
    setUploadProgress(65);
    setUploadStep("IPFS_DISCOVERY: Slicing file shards into sovereign IPNS peer nodes...");

    // Stage 3 (65 to 100%)
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUploadProgress(100);
    setUploadStep("SOVEREIGN_VAULT: Sealing assets behind glass-membrane cipher block...");

    await new Promise((resolve) => setTimeout(resolve, 400));

    // Formulate a dynamic categories based on name or fall back
    let category: MedicalDocument["category"] = "Doctor Notes";
    if (fileName.toLowerCase().includes("report") || fileName.toLowerCase().includes("blood")) {
      category = "Lab Reports";
    } else if (fileName.toLowerCase().includes("prescription") || fileName.toLowerCase().includes("med")) {
      category = "Prescriptions";
    } else if (fileName.toLowerCase().includes("mri") || fileName.toLowerCase().includes("scan") || fileName.toLowerCase().includes("img")) {
      category = "Imaging";
    } else if (fileName.toLowerCase().includes("insur") || fileName.toLowerCase().includes("policy")) {
      category = "Insurance Documents";
    }

    const mockDoc = await recordsService.uploadDocument({
      title: fileName.replace(/\.[^/.]+$/, ""), // remove extension
      date: new Date().toISOString().replace("T", " ").substring(0, 16) + " UTC",
      category,
      doctorName: "Self-Sovereign Node ID",
      facility: "Ipfs Encrypted Client Space",
      summary: "Patient uploaded sovereign asset securely sealed using local wallet keys. Multi-hop ledger hashes verified on client.",
      details: `Raw local asset successfully indexed. SHA-256 Node: did:vortexa:${Math.random().toString(36).substring(2, 20)}. Full end-to-end cryptographic integrity confirmed by digital token validation keys. Size: ${fileSize}.`,
      fileSize: fileSize || "1.2 MB",
    });

    setDocuments((prev) => [mockDoc, ...prev]);
    setSelectedDoc(mockDoc);
    setIsUploading(false);
    setIsDragging(false);
    setUploadProgress(0);
    setUploadStep("");
  };

  // On Drag Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDragError("");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + " MB";
      simulateUploadSequence(file.name, sizeStr);
    }
  };

  // On Manual Select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + " MB";
      simulateUploadSequence(file.name, sizeStr);
    }
  };

  return (
    <div id="patient-records-view" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Records filters, Search, Document cards list */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard glowColor="none" hoverable={false} className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-950/40">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                id="doc-search-box"
                type="text"
                placeholder="Search sovereign index..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-900 rounded-xl pl-9 pr-4 py-2.5 font-mono text-xs text-slate-300 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all"
              />
            </div>

            {/* Quick action: Trigger dummy manual picker */}
            <button
              id="upload-trigger-btn"
              onClick={() => fileInputRef.current?.click()}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-cyan text-cyber-dark font-display font-bold text-xs tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> UPLOAD SECURE RECORD
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.txt,.json"
            />
          </GlassCard>

          {/* Categories Tab Row */}
          <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-thin select-none">
            {categories.map((cat) => (
              <button
                id={`filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wide transition-all whitespace-nowrap border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40 shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                    : "bg-slate-950/40 text-slate-400 border-slate-900/60 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secure Drag Drop Box */}
          <div
            id="records-dropzone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all bg-slate-950/30 relative overflow-hidden flex flex-col items-center justify-center min-h-[160px] ${
              isDragging
                ? "border-neon-cyan bg-neon-cyan/5 shadow-[0_0_20px_rgba(0,240,255,0.1)]"
                : "border-slate-900 hover:border-neon-cyan/45"
            }`}
          >
            <AnimatePresence>
              {isUploading ? (
                // Fluid Membrane Pulse Animation on secure Upload!
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 w-full"
                >
                  {/* Highly thematic glowing molecular circle */}
                  <div className="relative w-24 h-24 mb-1">
                    {/* Ring ripple */}
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border border-dashed border-neon-cyan/40"
                    />
                    {/* Pulsating fluid bubble core */}
                    <motion.div
                      animate={{
                        borderRadius: ["42% 58% 70% 30% / 45% 45% 55% 55%", "70% 30% 52% 48% / 60% 40% 60% 40%", "42% 58% 70% 30% / 45% 45% 55% 55%"],
                        rotate: 360
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-2 bg-gradient-to-tr from-neon-blue/80 to-neon-cyan/20 backdrop-blur-md border border-neon-cyan/50 flex items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.3)]"
                    >
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </motion.div>
                  </div>

                  <div className="max-w-xs space-y-1.5 z-10">
                    <div className="flex justify-between text-[10px] font-mono text-neon-cyan font-bold">
                      <span>MEMBRANE_CIPHER_ESTABLISHED</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    {/* Glowing progress line */}
                    <div className="w-48 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                      <motion.div
                        className="h-full bg-gradient-to-r from-neon-blue to-neon-cyan"
                        initial={{ width: "0%" }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="font-mono text-[9px] text-slate-500 truncate text-center animate-pulse mt-1">
                      {uploadStep}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-900 group-hover:border-neon-cyan/30 transition-all">
                    <UploadCloud className="w-5 h-5 text-neon-cyan animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-slate-200">Drag & Drop Secure Document</h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">Accepts PDF, JPG, PNG or genomic JSON. Sealed on-client.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Documents Cards List */}
          <div className="space-y-3.5">
            {filteredDocList.length === 0 ? (
              <GlassCard glowColor="none" hoverable={false} className="p-8 text-center text-slate-500 font-mono text-xs">
                <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <span>Zero records match the selected cipher index parameters.</span>
              </GlassCard>
            ) : (
              filteredDocList.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <div
                    id={`doc-item-${doc.id}`}
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`cursor-pointer transition-all ${
                      isSelected ? "scale-[1.01]" : ""
                    }`}
                  >
                    <GlassCard
                      glowColor={isSelected ? "cyan" : "none"}
                      hoverable={!isSelected}
                      className={`p-4 gap-4 flex items-center justify-between border-l-4 ${
                        isSelected
                          ? "border-l-neon-cyan bg-neon-cyan/5"
                          : "border-l-slate-800 bg-slate-950/30"
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-900 shrink-0">
                          <FileText className={`w-5 h-5 ${isSelected ? "text-neon-cyan" : "text-slate-400"}`} />
                        </div>
                        <div className="min-w-0 leading-tight">
                          <h4 className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-slate-300"}`}>
                            {doc.title}
                          </h4>
                          <span className="font-mono text-[8px] bg-slate-950 border border-slate-900/60 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider inline-block mt-1">
                            {doc.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-[9px] text-slate-500 block">{doc.date.split(" ")[0]}</span>
                        <span className="font-mono text-[8px] text-neon-cyan block font-semibold mt-0.5">{doc.fileSize}</span>
                      </div>
                    </GlassCard>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Selected Document complete detail spec panel */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {selectedDoc ? (
              <motion.div
                key={selectedDoc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 80, damping: 14 }}
              >
                <GlassCard glowColor="blue" hoverable={false} className="p-6 space-y-6">
                  {/* Heading header details */}
                  <div className="border-b border-slate-900 pb-4">
                    <span className="font-mono text-[9px] text-neon-blue block font-bold uppercase tracking-widest">{selectedDoc.category}</span>
                    <h3 className="font-display font-black text-lg text-white mt-1 leading-snug">{selectedDoc.title}</h3>
                    <p className="font-mono text-[9px] text-slate-500 mt-1 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-neon-cyan" /> Indexed on {selectedDoc.date}
                    </p>
                  </div>

                  {/* Summary Segment */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[8px] text-slate-500 uppercase tracking-widest block font-bold">SOVEREIGN_SUMMARY</label>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded-xl border border-slate-900/40">
                      {selectedDoc.summary}
                    </p>
                  </div>

                  {/* Full narrative technical info */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[8px] text-slate-500 uppercase tracking-widest block font-bold">CLINICAL_DETAILS</label>
                    <div className="max-h-[160px] overflow-y-auto pr-1 bg-slate-950/40 p-4 rounded-xl border border-slate-900/40 text-[11px] font-mono leading-relaxed text-slate-400">
                      {selectedDoc.details}
                    </div>
                  </div>

                  {/* Metadata Specs Grid */}
                  <div className="grid grid-cols-2 gap-3.5 bg-slate-950 p-3 rounded-xl border border-slate-900 font-mono text-[10px]">
                    <div>
                      <span className="text-slate-500 block uppercase text-[8px] tracking-wider">CERTIFICATE_SIGNER</span>
                      <span className="text-slate-300 truncate block mt-0.5 font-bold">{selectedDoc.doctorName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[8px] tracking-wider">PHYSICAL_FACILITY</span>
                      <span className="text-slate-300 truncate block mt-0.5 font-bold">{selectedDoc.facility}</span>
                    </div>
                  </div>

                  {/* Cryptographic IPFS location details */}
                  <div className="space-y-2 pt-4 border-t border-slate-900">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <FileCode className="w-3.5 h-3.5 text-neon-purple" /> IPFS Decentralized Path
                      </span>
                      <span className="font-mono text-[8px] bg-slate-950 border border-neon-purple/20 text-neon-purple px-1.5 py-0.5 rounded font-bold uppercase">
                        ReadOnly Node
                      </span>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 flex items-center justify-between">
                      <code className="text-[9px] font-mono text-neon-purple truncate select-all">{selectedDoc.ipfsHash}</code>
                      <button
                        title="Download file simulation"
                        onClick={() => alert(`Initiating direct peer file-stream verification for hash:\n${selectedDoc.ipfsHash}`)}
                        className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-neon-purple transition-all ml-2"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <GlassCard glowColor="none" hoverable={false} className="p-12 text-center text-slate-500 text-xs font-mono">
                Select a diagnostic document card to decypher network records.
              </GlassCard>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
