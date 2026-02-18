import { Target, Edit3 } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface IntentBadgeProps {
  intent: string;
  editable?: boolean;
  onUpdate?: (intent: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const IntentBadge = ({ intent, editable = false, onUpdate, size = 'md' }: IntentBadgeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(intent);

  const handleSave = () => {
    if (draft.trim() && onUpdate) {
      onUpdate(draft.trim());
    }
    setIsEditing(false);
  };

  if (size === 'sm') {
    return (
      <div className="flex items-start gap-2 px-3 py-2 bg-craft-orange-muted border border-craft-orange/20 rounded-xl">
        <Target size={12} className="text-craft-orange shrink-0 mt-0.5" />
        <p className="text-xs text-craft-white font-medium leading-relaxed">{intent}</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`flex items-start gap-3 p-4 bg-craft-orange-muted border border-craft-orange/25 rounded-xl ${editable ? 'cursor-pointer hover:border-craft-orange/50 transition-all' : ''}`}
        onClick={editable ? () => { setDraft(intent); setIsEditing(true); } : undefined}
      >
        <div className="w-8 h-8 rounded-lg bg-craft-orange/20 flex items-center justify-center shrink-0">
          <Target size={16} className="text-craft-orange" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-craft-orange uppercase tracking-wider mb-1">
            Current Intent
          </p>
          <p className={`text-craft-white font-medium leading-snug ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
            {intent}
          </p>
        </div>
        {editable && (
          <Edit3 size={14} className="text-craft-gray-400 shrink-0 mt-0.5" />
        )}
      </div>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Update Your Intent">
        <div className="space-y-4">
          <p className="text-sm text-craft-gray-400">
            Tell the room what you are seeking or offering. Be specific — better signals lead to better matches.
          </p>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={140}
            rows={3}
            placeholder="e.g. Seeking a developer co-founder for my creative tools startup"
            className="craft-input resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-craft-gray-400">{draft.length}/140</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={!draft.trim()}>Update Intent</Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
