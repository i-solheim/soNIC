// ============================================================
// soNIC Platform — TypeScript Type Definitions
// ============================================================

// --- User & Auth ---
export type UserRole = "startup" | "partner" | "nic";

export type OrgType = "corporation" | "vc_fund" | "university" | "research_institute";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  orgType?: OrgType;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// --- Startup Profile ---
export type FundingStage = "bootstrapped" | "pre_seed" | "seed" | "series_a" | "series_b_plus";
export type CustomerType = "b2b" | "b2c" | "government" | "enterprise";
export type BusinessModel = "saas" | "marketplace" | "hardware" | "licensing" | "services";
export type GoalType = "investment" | "pilot" | "manufacturing" | "rd" | "distribution" | "talent";

export interface StartupProfile {
  id: string;
  userId: string;
  companyName: string;
  tagline: string;
  logoUrl?: string;
  website?: string;

  // Phase 1 — Basic
  industry: string;
  location: string;
  stage: FundingStage;
  employees: number;
  foundedYear: number;

  // Technology
  technologies: string[];

  // Product
  problemStatement: string;
  solution: string;

  // Customers & Market
  customerTypes: CustomerType[];
  targetMarkets: string[];

  // Business Model
  businessModels: BusinessModel[];

  // Funding
  currentFunding: FundingStage;
  fundingNeed: number; // USD
  fundingCurrency: string;

  // Growth
  users: number;
  monthlyRevenue: number;
  monthlyGrowthRate: number;

  // Goals & Capabilities
  goals: GoalType[];
  capabilities: string[];
  pitchDeckUrl?: string;

  // Phase 2 — AI Generated
  aiSummary?: string;
  aiKeywords?: string[];
  readinessScore?: number;
  readinessChecks?: ReadinessCheck[];
  phase: 1 | 2;
  profileStatus: "draft" | "processing" | "complete";
}

export interface ReadinessCheck {
  label: string;
  labelVi: string;
  status: "pass" | "warning" | "fail";
}

// --- Partner Profile ---
export interface PartnerProfile {
  id: string;
  userId: string;
  orgName: string;
  orgType: OrgType;
  logoUrl?: string;
  website?: string;
  description: string;

  // Corporation fields
  industry?: string;
  innovationPriorities?: string[];
  technologyInterests?: string[];
  openInnovationPrograms?: string[];
  procurementNeeds?: string[];
  pilotOpportunities?: string[];
  geographicMarkets?: string[];
  esgGoals?: string[];
  preferredStartupStage?: FundingStage[];
  budget?: string;
  strategicInitiatives?: string[];

  // VC/Fund fields
  investmentStages?: FundingStage[];
  checkSize?: { min: number; max: number };
  industries?: string[];
  geographicFocus?: string[];
  portfolioOverlap?: string;
  riskTolerance?: "low" | "medium" | "high";
  exitExpectations?: string;

  // University/Research fields
  researchFields?: string[];
  labs?: string[];
  professors?: string[];
  availableEquipment?: string[];
  patents?: string[];
  techTransferOffice?: boolean;
  governmentGrants?: string[];
  desiredIndustryPartnerships?: string[];

  profileStatus: "draft" | "complete";
}

// --- Matching ---
export type CollabType = "investment" | "pilot" | "research" | "distribution" | "talent" | "procurement";

export interface MatchResult {
  id: string;
  startupId: string;
  partnerId: string;
  score: number; // 0-100
  collabTypes: CollabType[];
  aiExplanation: string;
  aiExplanationVi: string;
  createdAt: string;
  status: "pending" | "interested" | "meeting_scheduled" | "deal_closed" | "declined";

  // Populated
  startup?: StartupProfile;
  partner?: PartnerProfile;
}

export interface CapabilityComparison {
  startupHas: string[];
  startupHasVi: string[];
  orgNeeds: string[];
  orgNeedsVi: string[];
}

export interface RoadmapStep {
  timeLabel: string;
  timeLabelVi: string;
  milestone: string;
  milestoneVi: string;
  type: CollabType | "meeting";
}

// --- Meetings ---
export type MeetingStatus = "scheduled" | "completed" | "cancelled";

export interface Meeting {
  id: string;
  startupId: string;
  partnerId: string;
  matchId: string;
  scheduledAt: string;
  duration: number; // minutes
  platform: "zoom" | "teams" | "in_person";
  status: MeetingStatus;
  notes?: string;

  // Populated
  startup?: { name: string; logo?: string };
  partner?: { name: string; logo?: string };
}

// --- NIC Analytics ---
export interface NICStats {
  totalApplications: number;
  totalMatches: number;
  totalMeetings: number;
  successRate: number;
  activeStartups: number;
  activePartners: number;
}

export interface SectorData {
  sector: string;
  sectorVi: string;
  count: number;
}

export interface FundingDemandData {
  stage: string;
  stageVi: string;
  totalUSD: number;
  count: number;
}

export interface RecommendationTrend {
  date: string;
  recommendations: number;
  accepted: number;
}


// --- Notifications ---
export type NotificationType = "mutual_match" | "meeting_scheduled" | "interest_received";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  titleVi: string;
  body: string;
  bodyVi: string;
  timestamp: string;
  read: boolean;
  linkHref?: string;
  partnerName?: string;
  startupName?: string;
}

// --- i18n ---
export type Language = "en" | "vi";
