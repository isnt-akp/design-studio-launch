// Receipt Scanner UI with manual fallback (Web equivalent of on-device OCR)
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, X, Check, Edit3, AlertTriangle } from "lucide-react";

interface ExtractedData {
  merchant: string;
  amount: string;
  date: string;
  category: string;
  items: string[];
}

interface ReceiptScannerProps {
  onExtracted: (data: ExtractedData) => void;
  onClose: () => void;
}

export function ReceiptScanner({ onExtracted, onClose }: ReceiptScannerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showManualFallback, setShowManualFallback] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedData>({
    merchant: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "Food",
    items: [],
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setIsProcessing(true);

    // Simulate OCR processing (in production, this would use Tesseract.js WebAssembly)
    setTimeout(() => {
      setIsProcessing(false);
      // Show manual fallback since we don't have real OCR in this web MVP
      setShowManualFallback(true);
      setExtracted({
        merchant: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "Food",
        items: [],
      });
    }, 1500);
  };

  const handleConfirm = () => {
    if (!extracted.amount || !extracted.merchant) return;
    onExtracted(extracted);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto glass-card rounded-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Camera size={18} /> Scan Receipt
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
        </div>

        {!imageUrl && (
          <div className="space-y-3">
            <button onClick={() => fileRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-border rounded-card flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors">
              <Upload size={24} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Upload receipt image</p>
              <p className="text-[10px] text-muted-foreground">JPG, PNG, or PDF</p>
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <p className="text-xs text-muted-foreground text-center">
              Or <button onClick={() => { setShowManualFallback(true); setImageUrl("manual"); }}
                className="text-primary-light hover:underline">enter manually</button>
            </p>
          </div>
        )}

        {imageUrl && imageUrl !== "manual" && (
          <div className="relative">
            <img src={imageUrl} alt="Receipt" className="w-full rounded-button max-h-48 object-cover" />
            {isProcessing && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center rounded-button">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              </div>
            )}
          </div>
        )}

        {showManualFallback && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="p-2 bg-warning/10 rounded-button flex items-center gap-2">
              <AlertTriangle size={14} className="text-warning shrink-0" />
              <p className="text-xs text-warning">OCR unavailable in web browser. Please verify or enter details manually.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Merchant</label>
              <input value={extracted.merchant} onChange={e => setExtracted({ ...extracted, merchant: e.target.value })}
                placeholder="e.g., Starbucks, D-Mart" className="w-full h-9 px-3 text-sm bg-muted rounded-button text-foreground outline-none placeholder:text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Amount (₹)</label>
              <input type="number" value={extracted.amount} onChange={e => setExtracted({ ...extracted, amount: e.target.value })}
                placeholder="0" className="w-full h-9 px-3 text-sm bg-muted rounded-button text-foreground font-mono outline-none placeholder:text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Date</label>
              <input type="date" value={extracted.date} onChange={e => setExtracted({ ...extracted, date: e.target.value })}
                className="w-full h-9 px-3 text-sm bg-muted rounded-button text-foreground outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Category</label>
              <select value={extracted.category} onChange={e => setExtracted({ ...extracted, category: e.target.value })}
                className="w-full h-9 px-3 bg-muted rounded-button text-foreground text-sm outline-none">
                {["Food", "Grocery", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Other"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button onClick={onClose}
                className="flex-1 h-9 rounded-button bg-muted text-foreground text-sm font-medium hover:bg-border transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirm}
                className="flex-1 h-9 rounded-button bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <Check size={14} /> Confirm
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
