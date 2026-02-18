import { useState } from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  online?: boolean;
  className?: string;
}

const sizeMap: Record<AvatarSize, { container: string; text: string; dot: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-xs', dot: 'w-1.5 h-1.5 border' },
  sm: { container: 'w-8 h-8', text: 'text-xs', dot: 'w-2 h-2 border' },
  md: { container: 'w-10 h-10', text: 'text-sm', dot: 'w-2.5 h-2.5 border-2' },
  lg: { container: 'w-12 h-12', text: 'text-base', dot: 'w-3 h-3 border-2' },
  xl: { container: 'w-16 h-16', text: 'text-lg', dot: 'w-3.5 h-3.5 border-2' },
  '2xl': { container: 'w-24 h-24', text: 'text-2xl', dot: 'w-4 h-4 border-2' },
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const hashColor = (name: string): string => {
  const colors = [
    'from-orange-500 to-amber-600',
    'from-teal-500 to-cyan-600',
    'from-rose-500 to-pink-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-green-600',
    'from-sky-500 to-blue-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
};

export const Avatar = ({ src, name, size = 'md', online, className = '' }: AvatarProps) => {
  const [imgError, setImgError] = useState(false);
  const { container, text, dot } = sizeMap[size];
  const showImg = src && !imgError;

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div className={`${container} rounded-full overflow-hidden`}>
        {showImg ? (
          <img
            src={src}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${hashColor(name)} font-bold ${text} text-white`}
          >
            {getInitials(name)}
          </div>
        )}
      </div>
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 ${dot} rounded-full border-craft-black ${online ? 'bg-craft-green' : 'bg-craft-gray-600'}`}
        />
      )}
    </div>
  );
};
