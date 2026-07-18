import {
  User, StartupProfile, PartnerProfile, MatchResult,
  Meeting, NICStats, SectorData, FundingDemandData, RecommendationTrend,
  AppNotification
} from "./types";

// ============================================================
// Mock Users
// ============================================================
export const MOCK_USERS: User[] = [
  {
    id: "u1",
    email: "startup@sonic.vn",
    name: "Nguyen Van An",
    role: "startup",
    avatar: undefined,
    createdAt: "2024-01-15",
  },
  {
    id: "u2",
    email: "corp@sonic.vn",
    name: "Tran Thi Bich",
    role: "partner",
    orgType: "corporation",
    avatar: undefined,
    createdAt: "2024-02-01",
  },
  {
    id: "u3",
    email: "vc@sonic.vn",
    name: "Le Minh Duc",
    role: "partner",
    orgType: "vc_fund",
    avatar: undefined,
    createdAt: "2024-02-10",
  },
  {
    id: "u4",
    email: "nic@sonic.vn",
    name: "Pham Thu Huong",
    role: "nic",
    avatar: undefined,
    createdAt: "2024-01-01",
  },
];

// Mock credentials for login
export const MOCK_CREDENTIALS: Record<string, { password: string; userId: string }> = {
  "startup@sonic.vn": { password: "startup123", userId: "u1" },
  "corp@sonic.vn": { password: "partner123", userId: "u2" },
  "vc@sonic.vn": { password: "partner123", userId: "u3" },
  "nic@sonic.vn": { password: "nic123", userId: "u4" },
};

// ============================================================
// Mock Startup Profile
// ============================================================
export const MOCK_STARTUP_PROFILE: StartupProfile = {
  id: "sp1",
  userId: "u1",
  companyName: "MediAI Vietnam",
  tagline: "AI-powered diagnostics for underserved communities",
  website: "https://mediai.vn",
  industry: "HealthTech",
  location: "Ho Chi Minh City, Vietnam",
  stage: "seed",
  employees: 24,
  foundedYear: 2022,
  technologies: ["AI", "IoT", "SaaS"],
  problemStatement: "Lack of specialist doctors in rural Vietnam causes delayed diagnosis and poor health outcomes.",
  solution: "AI-driven diagnostic platform integrated with local clinic devices, accessible via mobile.",
  customerTypes: ["b2c", "government"],
  targetMarkets: ["Healthcare", "Government"],
  businessModels: ["saas", "licensing"],
  currentFunding: "seed",
  fundingNeed: 2000000,
  fundingCurrency: "USD",
  users: 12000,
  monthlyRevenue: 45000,
  monthlyGrowthRate: 18,
  goals: ["investment", "pilot", "distribution"],
  capabilities: ["AI expertise", "Healthcare datasets", "Clinical partnerships", "Regulatory experience"],
  pitchDeckUrl: "/mock/pitch-deck.pdf",
  aiSummary: "MediAI Vietnam is a seed-stage HealthTech startup building AI-powered diagnostic tools for underserved communities in Southeast Asia. The company demonstrates strong product-market fit with 12,000 active users and 18% MoM growth. Their clinical AI models are trained on 2M+ anonymized patient records, and they hold 2 pending patents in diagnostic automation. Primary needs: Series A investment ($2M), hospital pilot partnerships, and regulatory support for cross-border expansion.",
  aiKeywords: ["AI Diagnostics", "Rural Health", "SaaS", "Series A Ready", "Vietnam", "HealthTech", "IoT"],
  readinessScore: 87,
  readinessChecks: [
    { label: "Funding Ready", labelVi: "Sẵn sàng gọi vốn", status: "pass" },
    { label: "Product Ready", labelVi: "Sản phẩm hoàn thiện", status: "pass" },
    { label: "Legal Structure", labelVi: "Cơ cấu pháp lý", status: "pass" },
    { label: "Traction Metrics", labelVi: "Chỉ số tăng trưởng", status: "warning" },
    { label: "Team Completeness", labelVi: "Đội ngũ đầy đủ", status: "pass" },
    { label: "IP Protection", labelVi: "Bảo vệ sở hữu trí tuệ", status: "warning" },
  ],
  phase: 2,
  profileStatus: "complete",
};

// ============================================================
// Mock Partner Profiles (8 cards for the feed)
// ============================================================
export const MOCK_PARTNER_PROFILES: PartnerProfile[] = [
  {
    id: "pp1",
    userId: "u2",
    orgName: "Vingroup Innovation",
    orgType: "corporation",
    website: "https://vingroup.net",
    description: "Vietnam's largest private conglomerate driving open innovation across tech, health, and smart cities.",
    industry: "Conglomerate",
    innovationPriorities: ["HealthTech", "Smart City", "AI/ML"],
    technologyInterests: ["AI", "IoT", "Blockchain"],
    pilotOpportunities: ["Hospital network pilot", "Smart building integration"],
    geographicMarkets: ["Vietnam", "Southeast Asia"],
    esgGoals: ["Carbon neutral 2030", "Digital health access"],
    preferredStartupStage: ["seed", "series_a"],
    budget: "$500K - $2M",
    profileStatus: "complete",
  },
  {
    id: "pp2",
    userId: "u3",
    orgName: "Mekong Capital",
    orgType: "vc_fund",
    website: "https://mekongcapital.com",
    description: "Leading Vietnam-focused growth equity fund investing in consumer, tech, and healthcare.",
    investmentStages: ["seed", "series_a"],
    checkSize: { min: 500000, max: 3000000 },
    industries: ["HealthTech", "EdTech", "FinTech"],
    geographicFocus: ["Vietnam", "Thailand", "Indonesia"],
    riskTolerance: "medium",
    exitExpectations: "5-7 year IPO or strategic acquisition",
    profileStatus: "complete",
  },
  {
    id: "pp3",
    userId: "u5",
    orgName: "HCMC University of Technology",
    orgType: "university",
    website: "https://hcmut.edu.vn",
    description: "Top engineering university in Southern Vietnam with 15 active research labs and strong industry links.",
    researchFields: ["AI/ML", "Biomedical Engineering", "Robotics"],
    labs: ["AI Research Lab", "Biomedical Lab", "Robotics Center"],
    availableEquipment: ["MRI simulators", "GPU clusters", "3D bioprinters"],
    patents: ["VN Patent #2023-041 (Medical Imaging AI)"],
    techTransferOffice: true,
    governmentGrants: ["MOST Grant 2024", "NIC Innovation Fund"],
    desiredIndustryPartnerships: ["HealthTech", "Manufacturing", "AgriTech"],
    profileStatus: "complete",
  },
  {
    id: "pp4",
    userId: "u6",
    orgName: "FPT Corporation",
    orgType: "corporation",
    website: "https://fpt.com",
    description: "Vietnam's leading technology conglomerate with operations in 29 countries, seeking AI and digital transformation startups.",
    industry: "Technology",
    innovationPriorities: ["AI/ML", "Digital Transformation", "Cloud"],
    technologyInterests: ["AI", "SaaS", "Cybersecurity"],
    pilotOpportunities: ["Enterprise software pilot", "Digital health transformation"],
    geographicMarkets: ["Vietnam", "Japan", "USA"],
    esgGoals: ["Digital inclusion", "Green IT"],
    preferredStartupStage: ["seed", "series_a", "series_b_plus"],
    budget: "$2M+",
    profileStatus: "complete",
  },
  {
    id: "pp5",
    userId: "u7",
    orgName: "Do Ventures",
    orgType: "vc_fund",
    website: "https://doventures.vc",
    description: "Early-stage venture fund focused on Vietnam's next generation of tech founders, with strong operator network.",
    investmentStages: ["pre_seed", "seed"],
    checkSize: { min: 100000, max: 500000 },
    industries: ["HealthTech", "FinTech", "EdTech", "AgriTech"],
    geographicFocus: ["Vietnam"],
    riskTolerance: "high",
    exitExpectations: "Series A in 18-24 months",
    profileStatus: "complete",
  },
  {
    id: "pp6",
    userId: "u8",
    orgName: "Vietnam National University",
    orgType: "university",
    website: "https://vnu.edu.vn",
    description: "Vietnam's flagship university system with 7 member universities, 40,000+ students, and extensive R&D capabilities.",
    researchFields: ["Biotechnology", "Environmental Science", "Computer Science", "Economics"],
    labs: ["Biotech Lab", "AI Center", "Environmental Lab", "Innovation Hub"],
    availableEquipment: ["Genomics sequencers", "HPC cluster", "Environmental testing lab"],
    patents: ["VN Patent #2022-118 (AgriTech Sensor)", "VN Patent #2023-055 (EdTech Platform)"],
    techTransferOffice: true,
    governmentGrants: ["NAFOSTED 2024", "World Bank Innovation Grant"],
    desiredIndustryPartnerships: ["AgriTech", "BioTech", "EdTech"],
    profileStatus: "complete",
  },
  {
    id: "pp7",
    userId: "u9",
    orgName: "Vietnam Institute of AI",
    orgType: "research_institute",
    website: "https://viai.vn",
    description: "Government-backed national AI research institute bridging academic AI research and real-world industry applications.",
    researchFields: ["Deep Learning", "Computer Vision", "NLP", "Robotics"],
    labs: ["Vision Lab", "NLP Lab", "Robotics Lab", "Applied AI Lab"],
    availableEquipment: ["NVIDIA GPU cluster (A100)", "Motion capture studio", "Sensor arrays"],
    patents: ["VN Patent #2024-001 (Medical Vision AI)"],
    techTransferOffice: true,
    governmentGrants: ["Ministry of Science 2024", "NIC AI Fund"],
    desiredIndustryPartnerships: ["HealthTech", "Manufacturing", "Smart City", "Agriculture"],
    profileStatus: "complete",
  },
  {
    id: "pp8",
    userId: "u10",
    orgName: "Temasek Holdings Vietnam",
    orgType: "vc_fund",
    website: "https://temasek.com.sg",
    description: "Singaporean sovereign wealth fund with $380B AUM, actively building a portfolio of high-growth SEA tech startups.",
    investmentStages: ["series_a", "series_b_plus"],
    checkSize: { min: 5000000, max: 50000000 },
    industries: ["HealthTech", "FinTech", "CleanTech", "Smart City"],
    geographicFocus: ["Vietnam", "Southeast Asia", "India"],
    riskTolerance: "low",
    exitExpectations: "IPO or strategic M&A within 7-10 years",
    profileStatus: "complete",
  },
];

// ============================================================
// Mock Match Results
// ============================================================
export const MOCK_MATCHES: MatchResult[] = [
  {
    id: "m1",
    startupId: "sp1",
    partnerId: "pp1",
    score: 94,
    collabTypes: ["pilot", "investment"],
    aiExplanation: "Strong complementarity: MediAI's diagnostic AI aligns directly with Vingroup's hospital network expansion. Vingroup's pilot infrastructure reduces MediAI's go-to-market risk while accelerating clinical validation. Geographic overlap in Vietnam is ideal.",
    aiExplanationVi: "Tính bổ sung mạnh mẽ: AI chẩn đoán của MediAI phù hợp trực tiếp với kế hoạch mở rộng mạng lưới bệnh viện của Vingroup.",
    createdAt: "2024-07-01",
    status: "interested",
    partner: MOCK_PARTNER_PROFILES[0],
  },
  {
    id: "m2",
    startupId: "sp1",
    partnerId: "pp2",
    score: 88,
    collabTypes: ["investment"],
    aiExplanation: "Mekong Capital's HealthTech thesis aligns with MediAI's stage and traction. Check size ($500K–$3M) fits MediAI's $2M raise. Geographic focus matches Vietnam-first strategy.",
    aiExplanationVi: "Luận điểm HealthTech của Mekong Capital phù hợp với giai đoạn và tốc độ tăng trưởng của MediAI.",
    createdAt: "2024-07-02",
    status: "meeting_scheduled",
    partner: MOCK_PARTNER_PROFILES[1],
  },
  {
    id: "m3",
    startupId: "sp1",
    partnerId: "pp3",
    score: 79,
    collabTypes: ["research", "pilot"],
    aiExplanation: "HCMUT's AI Research Lab and Biomedical Lab can provide clinical data partnerships and R&D support. The tech transfer office enables IP co-development.",
    aiExplanationVi: "Lab AI và Lab Sinh y học của HCMUT có thể cung cấp quan hệ đối tác dữ liệu lâm sàng và hỗ trợ R&D.",
    createdAt: "2024-07-03",
    status: "pending",
    partner: MOCK_PARTNER_PROFILES[2],
  },
];

// ============================================================
// Match Detail — Capability Comparison & Roadmap
// ============================================================
export const MOCK_CAPABILITY_COMPARISON = {
  m1: {
    startupHas: ["AI diagnostic models", "Clinical AI dataset (2M+ records)", "Mobile app (iOS/Android)", "Regulatory experience", "Clinical partnerships"],
    startupHasVi: ["Mô hình AI chẩn đoán", "Tập dữ liệu lâm sàng (2M+ hồ sơ)", "Ứng dụng di động", "Kinh nghiệm pháp lý", "Quan hệ đối tác lâm sàng"],
    orgNeeds: ["AI-powered diagnostic tool", "Healthcare dataset", "Scalable SaaS platform", "Proven clinical results", "Mobile-first solution"],
    orgNeedsVi: ["Công cụ chẩn đoán AI", "Tập dữ liệu y tế", "Nền tảng SaaS có thể mở rộng", "Kết quả lâm sàng đã được chứng minh", "Giải pháp ưu tiên di động"],
  },
};

export const MOCK_ROADMAP = {
  m1: [
    { timeLabel: "Week 1", timeLabelVi: "Tuần 1", milestone: "Intro Meeting & NDA", milestoneVi: "Cuộc họp giới thiệu & NDA", type: "meeting" as const },
    { timeLabel: "Week 2–4", timeLabelVi: "Tuần 2–4", milestone: "Technical Due Diligence", milestoneVi: "Thẩm định kỹ thuật", type: "research" as const },
    { timeLabel: "Month 2", timeLabelVi: "Tháng 2", milestone: "Hospital Pilot Launch", milestoneVi: "Ra mắt thí điểm bệnh viện", type: "pilot" as const },
    { timeLabel: "Month 4", timeLabelVi: "Tháng 4", milestone: "Series A Investment", milestoneVi: "Đầu tư Series A", type: "investment" as const },
    { timeLabel: "Month 6+", timeLabelVi: "Tháng 6+", milestone: "National Scale", milestoneVi: "Mở rộng toàn quốc", type: "distribution" as const },
  ],
};

// ============================================================
// Mock Meetings
// ============================================================
export const MOCK_MEETINGS: Meeting[] = [
  {
    id: "mt1",
    startupId: "sp1",
    partnerId: "pp2",
    matchId: "m2",
    scheduledAt: "2024-07-20T10:00:00Z",
    duration: 60,
    platform: "zoom",
    status: "scheduled",
    startup: { name: "MediAI Vietnam" },
    partner: { name: "Mekong Capital" },
  },
  {
    id: "mt2",
    startupId: "sp1",
    partnerId: "pp1",
    matchId: "m1",
    scheduledAt: "2024-07-25T14:00:00Z",
    duration: 90,
    platform: "in_person",
    status: "scheduled",
    notes: "Demo day at Vingroup HQ",
    startup: { name: "MediAI Vietnam" },
    partner: { name: "Vingroup Innovation" },
  },
];

// ============================================================
// Mock Notifications
// ============================================================
export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    type: "mutual_match",
    title: "It's a Match! 🎉",
    titleVi: "Đã Kết Nối! 🎉",
    body: "Vingroup Innovation also expressed interest in you. You can now chat with them.",
    bodyVi: "Vingroup Innovation cũng bày tỏ quan tâm đến bạn. Bạn có thể trò chuyện với họ.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    linkHref: "/startup/messages?partnerId=pp1",
    partnerName: "Vingroup Innovation",
  },
  {
    id: "n2",
    type: "mutual_match",
    title: "It's a Match! 🎉",
    titleVi: "Đã Kết Nối! 🎉",
    body: "Mekong Capital also expressed interest in your startup. Open a chat to connect.",
    bodyVi: "Mekong Capital cũng bày tỏ quan tâm đến startup của bạn. Mở chat để kết nối.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
    linkHref: "/startup/messages?partnerId=pp2",
    partnerName: "Mekong Capital",
  },
  {
    id: "n3",
    type: "meeting_scheduled",
    title: "Meeting Confirmed 📅",
    titleVi: "Xác Nhận Cuộc Họp 📅",
    body: "Your meeting with NIC Staff (Mr. Hoang) is confirmed for Tomorrow at 10:00 AM.",
    bodyVi: "Cuộc họp của bạn với NIC (Ông Hoàng) đã được xác nhận vào Ngày mai lúc 10:00 SA.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true,
    linkHref: "/startup/schedule",
  },
  {
    id: "n4",
    type: "interest_received",
    title: "Someone is interested in you 👀",
    titleVi: "Ai đó quan tâm đến bạn 👀",
    body: "FPT Corporation just viewed your profile and expressed interest.",
    bodyVi: "FPT Corporation vừa xem hồ sơ của bạn và bày tỏ quan tâm.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    read: true,
    linkHref: "/startup/matches",
    partnerName: "FPT Corporation",
  },
];

// ============================================================
// NIC Analytics
// ============================================================
export const MOCK_NIC_STATS: NICStats = {
  totalApplications: 142,
  totalMatches: 89,
  totalMeetings: 53,
  successRate: 37,
  activeStartups: 98,
  activePartners: 44,
};

export const MOCK_SECTOR_DATA: SectorData[] = [
  { sector: "HealthTech", sectorVi: "Công nghệ Y tế", count: 28 },
  { sector: "FinTech", sectorVi: "Công nghệ Tài chính", count: 22 },
  { sector: "EdTech", sectorVi: "Công nghệ Giáo dục", count: 18 },
  { sector: "AgriTech", sectorVi: "Công nghệ Nông nghiệp", count: 14 },
  { sector: "Smart City", sectorVi: "Thành phố Thông minh", count: 11 },
  { sector: "CleanTech", sectorVi: "Công nghệ Xanh", count: 9 },
  { sector: "Other", sectorVi: "Khác", count: 40 },
];

export const MOCK_FUNDING_DEMAND: FundingDemandData[] = [
  { stage: "Pre-Seed", stageVi: "Pre-Seed", totalUSD: 2500000, count: 18 },
  { stage: "Seed", stageVi: "Seed", totalUSD: 28000000, count: 42 },
  { stage: "Series A", stageVi: "Series A", totalUSD: 65000000, count: 25 },
  { stage: "Series B+", stageVi: "Series B+", totalUSD: 120000000, count: 8 },
];

export const MOCK_RECOMMENDATION_TRENDS: RecommendationTrend[] = [
  { date: "Feb", recommendations: 12, accepted: 7 },
  { date: "Mar", recommendations: 18, accepted: 11 },
  { date: "Apr", recommendations: 24, accepted: 16 },
  { date: "May", recommendations: 31, accepted: 22 },
  { date: "Jun", recommendations: 38, accepted: 28 },
  { date: "Jul", recommendations: 45, accepted: 35 },
];

// ============================================================
// NIC Startups List
// ============================================================
export const MOCK_NIC_STARTUPS = [
  { id: "sp1", name: "MediAI Vietnam", sector: "HealthTech", stage: "Seed", score: 87, status: "active", matches: 3 },
  { id: "sp2", name: "EduFlow", sector: "EdTech", stage: "Pre-Seed", score: 72, status: "active", matches: 5 },
  { id: "sp3", name: "GreenGrid", sector: "CleanTech", stage: "Series A", score: 91, status: "active", matches: 7 },
  { id: "sp4", name: "FinSight", sector: "FinTech", stage: "Seed", score: 83, status: "active", matches: 4 },
  { id: "sp5", name: "FarmBot VN", sector: "AgriTech", stage: "Pre-Seed", score: 65, status: "pending", matches: 2 },
  { id: "sp6", name: "LogiAI", sector: "Logistics", stage: "Seed", score: 78, status: "active", matches: 6 },
  { id: "sp7", name: "CityPulse", sector: "Smart City", stage: "Series A", score: 89, status: "active", matches: 8 },
  { id: "sp8", name: "BioNext", sector: "BioTech", stage: "Seed", score: 76, status: "review", matches: 1 },
];
