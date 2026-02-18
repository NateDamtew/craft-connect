import { useState } from 'react';
import { Target, User, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { WelcomeStep } from './WelcomeStep';
import type { Discipline } from '../types';

interface OnboardingPageProps {
  onComplete: () => void;
}

const DISCIPLINES: Discipline[] = [
  'UI/UX Designer', 'Filmmaker', 'Digital Artist', 'Fashion Designer',
  'Brand Strategist', 'Music Producer', 'Game Developer', 'Creative Technologist',
  'UX Researcher', 'Product Manager', 'Graphic Designer', 'Creative Director',
  'Photographer', 'Animator',
];

const INTENT_SUGGESTIONS = [
  'Seeking a developer co-founder for my creative startup',
  'Looking for collaborators on a short film project',
  'Offering brand strategy to early-stage creative companies',
  'Seeking investors for my design studio',
  'Looking for musicians for an audio-visual project',
  'Offering AR development expertise to creative studios',
];

export const OnboardingPage = ({ onComplete }: OnboardingPageProps) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [discipline, setDiscipline] = useState<Discipline | ''>('');
  const [location, setLocation] = useState('');
  const [intent, setIntent] = useState('');

  const steps = [
    { id: 'welcome', label: 'Welcome' },
    { id: 'identity', label: 'Identity' },
    { id: 'intent', label: 'Intent' },
  ];

  const handleComplete = () => {
    localStorage.setItem('craft_onboarded', 'true');
    onComplete();
  };

  return (
    <div className="min-h-dvh bg-craft-black flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col">
        {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
        {step === 1 && (
          <IdentityStep
            name={name}
            discipline={discipline}
            location={location}
            onNameChange={setName}
            onDisciplineChange={setDiscipline}
            onLocationChange={setLocation}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <IntentStep
            intent={intent}
            onIntentChange={setIntent}
            onComplete={handleComplete}
            onBack={() => setStep(1)}
          />
        )}
      </div>

      {step > 0 && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-2">
          {steps.slice(1).map((s, i) => (
            <div
              key={s.id}
              className={`h-1 rounded-full transition-all duration-300 ${
                i + 1 === step ? 'w-8 bg-craft-orange' : i + 1 < step ? 'w-8 bg-craft-orange/50' : 'w-2 bg-craft-border2'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface IdentityStepProps {
  name: string;
  discipline: Discipline | '';
  location: string;
  onNameChange: (v: string) => void;
  onDisciplineChange: (v: Discipline) => void;
  onLocationChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const IdentityStep = ({
  name, discipline, location,
  onNameChange, onDisciplineChange, onLocationChange,
  onNext, onBack,
}: IdentityStepProps) => (
  <div className="flex-1 flex flex-col px-5 py-8 animate-slide-up">
    <button onClick={onBack} className="self-start text-craft-gray-400 hover:text-craft-white text-sm mb-8 flex items-center gap-1 transition-colors">
      ← Back
    </button>

    <div className="mb-8">
      <div className="flex items-center gap-2 mb-1">
        <User size={16} className="text-craft-orange" />
        <span className="text-xs font-bold text-craft-orange uppercase tracking-widest">Step 1 of 2</span>
      </div>
      <h2 className="text-2xl font-black text-craft-white tracking-tight">Build your identity</h2>
      <p className="text-sm text-craft-gray-400 mt-1">This is how other attendees will find and remember you.</p>
    </div>

    <div className="space-y-5 flex-1">
      <div>
        <label className="craft-label block mb-2">Your Name</label>
        <input
          className="craft-input"
          placeholder="e.g. Abeba Girma"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      <div>
        <label className="craft-label block mb-2">Creative Discipline</label>
        <div className="flex flex-wrap gap-2">
          {DISCIPLINES.map((d) => (
            <button
              key={d}
              onClick={() => onDisciplineChange(d)}
              className={`chip ${discipline === d ? 'chip-active' : 'chip-inactive'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="craft-label block mb-2">Location</label>
        <input
          className="craft-input"
          placeholder="e.g. Addis Ababa, ET"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </div>
    </div>

    <div className="pt-6 pb-16">
      <Button
        fullWidth
        size="lg"
        onClick={onNext}
        disabled={!name.trim() || !discipline}
        rightIcon={<ChevronRight size={18} />}
      >
        Continue
      </Button>
    </div>
  </div>
);

interface IntentStepProps {
  intent: string;
  onIntentChange: (v: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

const IntentStep = ({ intent, onIntentChange, onComplete, onBack }: IntentStepProps) => (
  <div className="flex-1 flex flex-col px-5 py-8 animate-slide-up">
    <button onClick={onBack} className="self-start text-craft-gray-400 hover:text-craft-white text-sm mb-8 flex items-center gap-1 transition-colors">
      ← Back
    </button>

    <div className="mb-8">
      <div className="flex items-center gap-2 mb-1">
        <Target size={16} className="text-craft-orange" />
        <span className="text-xs font-bold text-craft-orange uppercase tracking-widest">Step 2 of 2</span>
      </div>
      <h2 className="text-2xl font-black text-craft-white tracking-tight">Set your intent</h2>
      <p className="text-sm text-craft-gray-400 mt-1">
        What are you seeking or offering at CRAFT Addis? This powers your Whisper matches.
      </p>
    </div>

    <div className="space-y-5 flex-1">
      <div>
        <label className="craft-label block mb-2">Current Intent</label>
        <textarea
          className="craft-input resize-none"
          rows={3}
          maxLength={140}
          placeholder="e.g. Seeking a developer co-founder for my creative tools startup"
          value={intent}
          onChange={(e) => onIntentChange(e.target.value)}
        />
        <p className="text-xs text-craft-gray-400 text-right mt-1">{intent.length}/140</p>
      </div>

      <div>
        <p className="craft-label mb-3">Or start with a suggestion</p>
        <div className="space-y-2">
          {INTENT_SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onIntentChange(s)}
              className={`w-full text-left flex items-center justify-between gap-3 p-3 rounded-xl border text-sm transition-all duration-200 ${
                intent === s
                  ? 'border-craft-orange bg-craft-orange-muted text-craft-white'
                  : 'border-craft-border bg-craft-surface hover:border-craft-border2 text-craft-gray-200'
              }`}
            >
              <span>{s}</span>
              <ChevronRight size={14} className="shrink-0 text-craft-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="pt-6 pb-16">
      <Button
        fullWidth
        size="lg"
        onClick={onComplete}
        disabled={!intent.trim()}
        rightIcon={<Sparkles size={18} />}
      >
        Activate My Passport
      </Button>
    </div>
  </div>
);
