import { useRef, useState } from "react";
import { Send, Paperclip, Mic } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

const DisabledIconBtn = ({ icon, tooltip }: { icon: React.ReactNode; tooltip: string }) => (
  <div className="relative group">
    <button
      disabled
      className="p-2.5 rounded-full opacity-40 cursor-not-allowed transition-colors text-gray-500"
    >
      {icon}
    </button>
    <span
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white shadow-md z-10"
    >
      {tooltip}
    </span>
  </div>
);

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="px-4 pb-6 pt-4 flex-shrink-0 bg-white mt-2">
      <div className="max-w-[760px] mx-auto">
        <div className="flex items-end gap-2.5 rounded-[24px] px-5 py-3 bg-white border border-gray-200 shadow-sm focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
          <DisabledIconBtn icon={<Paperclip size={18} />} tooltip="Próximamente" />

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Pregunta algo o comparte conocimiento..."
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-[15px] leading-relaxed py-1.5 text-gray-900 placeholder:text-gray-400 font-medium"
            style={{
              maxHeight: "140px",
              overflowY: "auto",
            }}
          />

          <DisabledIconBtn icon={<Mic size={18} />} tooltip="Próximamente" />

          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`flex-shrink-0 w-9 h-9 mb-0.5 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
              canSend 
                ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-[1px]" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send size={15} className={canSend ? "translate-x-[-1px]" : ""} />
          </button>
        </div>
        <p className="text-center mt-3 text-xs text-gray-500 font-medium tracking-tight">
          Nukor puede cometer errores. Verifica la información importante.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
