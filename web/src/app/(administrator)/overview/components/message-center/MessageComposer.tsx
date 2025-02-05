import React, { useRef } from 'react';
import { Paperclip, Send, X } from 'lucide-react';

interface MessageComposerProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export const MessageComposer = ({
  message,
  onMessageChange,
  onSendMessage
}: MessageComposerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = React.useState<File | null>(null);

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none h-32 outline-none"
        />
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleFileAttach}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
              <span className="text-sm">Anexar</span>
            </button>
            {attachedFile && (
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full">
                <span className="text-sm truncate max-w-xs">{attachedFile.name}</span>
                <button
                  onClick={handleRemoveFile}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={onSendMessage}
            disabled={!message.trim()}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${
              !message.trim()
                ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600'
            } text-white shadow-sm`}
          >
            <Send className="w-4 h-4" />
            <span>Enviar</span>
          </button>
        </div>
      </div>
    </div>
  );
};