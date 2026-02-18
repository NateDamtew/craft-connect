export type Discipline =
  | 'UI/UX Designer'
  | 'Filmmaker'
  | 'Digital Artist'
  | 'Fashion Designer'
  | 'Brand Strategist'
  | 'Music Producer'
  | 'Game Developer'
  | 'Creative Technologist'
  | 'UX Researcher'
  | 'Product Manager'
  | 'Graphic Designer'
  | 'Creative Director'
  | 'Photographer'
  | 'Animator';

export type StampType = 'attendance' | 'contribution' | 'challenge' | 'presence' | 'speaker' | 'partnership';

export interface Stamp {
  id: string;
  type: StampType;
  label: string;
  description: string;
  eventName: string;
  issuedAt: string;
  color: string;
}

export interface PortfolioLink {
  label: string;
  url: string;
  icon: 'behance' | 'dribbble' | 'instagram' | 'github' | 'linkedin' | 'website' | 'youtube';
}

export interface UserProfile {
  id: string;
  name: string;
  discipline: Discipline;
  bio: string;
  location: string;
  avatarUrl: string;
  currentIntent: string;
  portfolioLinks: PortfolioLink[];
  stamps: Stamp[];
  isLocal: boolean;
  isOnline: boolean;
  doNotDisturb: boolean;
  joinedAt: string;
}

export type SessionType = 'Keynote' | 'Panel' | 'Workshop' | 'Screening' | 'Performance' | 'Networking' | 'Lab';
export type Stage = 'Main Stage' | 'Studio A' | 'Lab' | 'Cafe Stage' | 'Gallery' | 'Courtyard';

export interface Speaker {
  name: string;
  discipline: string;
  avatarUrl: string;
}

export interface ScheduleSession {
  id: string;
  day: 1 | 2 | 3;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  type: SessionType;
  stage: Stage;
  speakers: Speaker[];
  isHappeningNow: boolean;
  isBookmarked: boolean;
}

export type MatchStatus = 'new' | 'viewed' | 'connected' | 'dismissed';

export interface WhisperMatch {
  id: string;
  user: UserProfile;
  matchScore: number;
  myIntent: string;
  theirIntent: string;
  matchedKeywords: string[];
  status: MatchStatus;
  createdAt: string;
}

export type PartnershipStatus = 'active' | 'archived';

export interface TrialPartnership {
  id: string;
  partner: UserProfile;
  status: PartnershipStatus;
  myIntent: string;
  partnerIntent: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
  isOwn: boolean;
}

export interface EventChatMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    discipline: Discipline;
    avatarUrl: string;
    isLocal: boolean;
  };
  text: string;
  sentAt: string;
  isOwn?: boolean;
}

export type NotificationType = 'match' | 'schedule' | 'stamp' | 'message' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  referenceId?: string;
}

export type AppRoute =
  | '/'
  | '/passport'
  | '/discover'
  | '/chat'
  | '/schedule'
  | '/stream'
  | '/notifications'
  | '/settings';
