import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeEditorProps {
  code: string;
  language?: string;
  readOnly?: boolean;
  onRun?: () => void;
  className?: string;
}

export default function CodeEditor({ 
  code, 
  language = "javascript", 
  readOnly = false, 
  onRun,
  className 
}: CodeEditorProps) {
  const [currentCode, setCurrentCode] = useState(code);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      toast({
        title: "Copied to clipboard",
        description: "Code has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          {language.toUpperCase()}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="glass-card border-blue-400/30"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          {onRun && (
            <Button
              size="sm"
              onClick={onRun}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
          )}
        </div>
      </div>
      
      <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
        <pre className="text-sm text-slate-100 overflow-x-auto">
          <code>{currentCode}</code>
        </pre>
      </div>
    </div>
  );
}
