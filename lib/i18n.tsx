"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "./types";

// ============================================================
// Translation strings — add new keys in BOTH en and vi
// ============================================================
export const translations = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.profile": "Profile",
    "nav.matches": "Matches",
    "nav.meetings": "Meetings",
    "nav.messages": "Messages",
    "nav.schedule": "Schedule",
    "nav.startups": "Startups",
    "nav.analytics": "Analytics",
    "nav.logout": "Sign Out",
    "nav.settings": "Settings",

    // Landing
    "landing.hero.tagline": "Accelerating Vietnam's Innovation Ecosystem with AI",
    "landing.hero.subtitle": "soNIC connects startups with corporations, universities, research institutions, and investment funds — intelligently and instantly.",
    "landing.hero.cta.startup": "I'm a Startup",
    "landing.hero.cta.partner": "I'm a Partner Organization",
    "landing.hero.cta.nic": "NIC Staff Login",
    "landing.features.title": "The Fastest Path from Idea to Deal",
    "landing.features.subtitle": "AI handles the heavy lifting — you focus on building.",
    "landing.features.matchmaking.title": "AI Matchmaking",
    "landing.features.matchmaking.desc": "Our AI analyzes 50+ data points to surface the most relevant partners in seconds, not months.",
    "landing.features.deal.title": "AI Deal Assistant",
    "landing.features.deal.desc": "Get AI-generated talking points, term sheets, and negotiation guidance tailored to each match.",
    "landing.features.meeting.title": "Meeting Automation",
    "landing.features.meeting.desc": "Smart scheduling syncs calendars, sends reminders, and prepares briefing docs automatically.",
    "landing.features.compliance.title": "Compliance AI",
    "landing.features.compliance.desc": "Automated regulatory checks ensure every deal meets Vietnam's investment and IP frameworks.",
    "landing.workflow.title": "From Upload to Deal in Days",
    "landing.workflow.subtitle": "A streamlined AI-powered process that cuts months of manual scouting to just a few clicks.",
    "landing.workflow.step1": "Upload Profile",
    "landing.workflow.step2": "AI Analysis",
    "landing.workflow.step3": "Smart Matching",
    "landing.workflow.step4": "Meeting",
    "landing.workflow.step5": "Deal Closed",

    // Auth
    "auth.email": "Email Address",
    "auth.password": "Password",
    "auth.signin": "Sign In",
    "auth.signingIn": "Signing in...",
    "auth.forgotPassword": "Forgot password?",
    "auth.noAccount": "Don't have an account?",
    "auth.register": "Register",
    "auth.startup.title": "Startup Login",
    "auth.startup.subtitle": "Sign in to access your startup dashboard and matches.",
    "auth.partner.title": "Partner Organization Login",
    "auth.partner.subtitle": "Sign in to discover startups that match your needs.",
    "auth.nic.title": "NIC Staff Login",
    "auth.nic.subtitle": "Access the NIC management and analytics platform.",
    "auth.error.invalid": "Invalid email or password.",
    "auth.demo.hint": "Demo: use ",

    // Startup Dashboard
    "startup.dashboard.welcome": "Welcome back",
    "startup.dashboard.subtitle": "Your AI-powered deal pipeline at a glance.",
    "startup.dashboard.readiness": "Readiness Score",
    "startup.dashboard.matches": "Active Matches",
    "startup.dashboard.meetings": "Scheduled Meetings",
    "startup.dashboard.profileComplete": "Profile Complete",
    "startup.dashboard.viewMatches": "View All Matches",
    "startup.dashboard.editProfile": "Edit Profile",
    "startup.dashboard.topMatch": "Top Match This Week",
    "startup.dashboard.upcomingMeeting": "Upcoming Meeting",
    "startup.dashboard.aiInsight": "AI Insight",

    // Startup Profile
    "startup.profile.title": "Company Profile",
    "startup.profile.subtitle": "Complete your profile to unlock AI-powered matching.",
    "startup.profile.phase1": "Company Information",
    "startup.profile.phase2": "AI Profile Analysis",
    "startup.profile.step.basic": "Basic Info",
    "startup.profile.step.technology": "Technology",
    "startup.profile.step.product": "Product",
    "startup.profile.step.market": "Market",
    "startup.profile.step.funding": "Funding",
    "startup.profile.step.goals": "Goals",
    "startup.profile.step.upload": "Upload",
    "startup.profile.next": "Next Step",
    "startup.profile.back": "Back",
    "startup.profile.submit": "Submit for AI Analysis",
    "startup.profile.processing": "AI is analyzing your profile...",
    "startup.profile.processingDesc": "Our AI agents are extracting key insights from your profile and pitch deck.",
    "startup.profile.complete": "Analysis Complete",
    "startup.profile.aiSummary": "AI-Generated Summary",
    "startup.profile.readiness": "Startup Readiness",
    "startup.profile.uploadDeck": "Upload Pitch Deck",
    "startup.profile.uploadDeckDesc": "PDF, PPTX — max 20MB",
    "startup.profile.dragDrop": "Drag & drop or click to upload",

    // Readiness checks
    "readiness.funding": "Funding Ready",
    "readiness.product": "Product Ready",
    "readiness.legal": "Legal Structure",
    "readiness.traction": "Traction Metrics",
    "readiness.team": "Team Completeness",
    "readiness.ip": "IP Protection",

    // Match Results
    "matches.title": "Your Matches",
    "matches.subtitle": "AI-curated matches based on your profile and goals.",
    "matches.score": "Match Score",
    "matches.viewDetail": "View Details",
    "matches.express": "Express Interest",
    "matches.filter.all": "All",
    "matches.filter.investment": "Investment",
    "matches.filter.pilot": "Pilot",
    "matches.filter.research": "Research",
    "matches.filter.distribution": "Distribution",
    "matches.status.pending": "Pending",
    "matches.status.interested": "Interested",
    "matches.status.meeting": "Meeting Scheduled",
    "matches.status.closed": "Deal Closed",

    // Match Detail
    "match.detail.title": "Match Detail",
    "match.detail.aiExplanation": "AI Explanation",
    "match.detail.capabilities": "Capability Comparison",
    "match.detail.startupHas": "You Have",
    "match.detail.orgNeeds": "They Need",
    "match.detail.roadmap": "Collaboration Roadmap",
    "match.detail.scheduleMeeting": "Schedule Meeting",
    "match.detail.back": "Back to Matches",

    // Partner Dashboard
    "partner.dashboard.welcome": "Welcome back",
    "partner.dashboard.subtitle": "Discover startups that match your strategic goals.",
    "partner.dashboard.matches": "Startup Matches",
    "partner.dashboard.meetings": "Meetings",
    "partner.dashboard.interests": "Expressed Interests",

    // Partner Profile
    "partner.profile.title": "Organization Profile",
    "partner.profile.subtitle": "Tell us about your organization to find the best startup matches.",
    "partner.profile.selectType": "Select Organization Type",
    "partner.profile.selectTypeDesc": "Your profile form will be tailored to your organization type.",
    "partner.profile.type.corporation": "Corporation",
    "partner.profile.type.corporation.desc": "Large company seeking startup innovation partners",
    "partner.profile.type.vc": "VC / Investment Fund",
    "partner.profile.type.vc.desc": "Fund looking to invest in high-growth startups",
    "partner.profile.type.university": "University",
    "partner.profile.type.university.desc": "Academic institution for research collaboration",
    "partner.profile.type.research": "Research Institute",
    "partner.profile.type.research.desc": "R&D organization seeking industry application partners",
    "partner.profile.submit": "Save Profile",

    // NIC Dashboard
    "nic.dashboard.title": "NIC Operations Dashboard",
    "nic.dashboard.subtitle": "Real-time overview of the soNIC innovation ecosystem.",
    "nic.stats.applications": "Applications",
    "nic.stats.matches": "AI Matches",
    "nic.stats.meetings": "Meetings",
    "nic.stats.success": "Success Rate",
    "nic.chart.sector": "Startups by Sector",
    "nic.chart.funding": "Funding Demand by Stage",
    "nic.chart.recommendations": "AI Recommendations Over Time",
    "nic.startups.title": "All Startups",
    "nic.startups.search": "Search startups...",
    "nic.meetings.title": "Meeting Schedule",

    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.view": "View",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",
    "common.status": "Status",
    "common.date": "Date",
    "common.actions": "Actions",
    "common.noData": "No data found.",
    "common.learnMore": "Learn More",
    "common.getStarted": "Get Started",
    "common.backHome": "Back to Home",
    "common.score": "Score",
  },

  vi: {
    // Nav
    "nav.home": "Trang chủ",
    "nav.dashboard": "Bảng điều khiển",
    "nav.profile": "Hồ sơ",
    "nav.matches": "Kết nối",
    "nav.meetings": "Cuộc họp",
    "nav.messages": "Tin nhắn",
    "nav.schedule": "Xếp lịch",
    "nav.startups": "Startup",
    "nav.analytics": "Phân tích",
    "nav.logout": "Đăng xuất",
    "nav.settings": "Cài đặt",

    // Landing
    "landing.hero.tagline": "Thúc Đẩy Hệ Sinh Thái Đổi Mới Việt Nam Bằng AI",
    "landing.hero.subtitle": "soNIC kết nối startup với doanh nghiệp, trường đại học, viện nghiên cứu và quỹ đầu tư — thông minh và tức thì.",
    "landing.hero.cta.startup": "Tôi là Startup",
    "landing.hero.cta.partner": "Tôi là Tổ chức Đối tác",
    "landing.hero.cta.nic": "Đăng nhập NIC",
    "landing.features.title": "Con Đường Nhanh Nhất Từ Ý Tưởng Đến Hợp Đồng",
    "landing.features.subtitle": "AI xử lý phần phức tạp — bạn tập trung vào xây dựng.",
    "landing.features.matchmaking.title": "Kết Nối AI",
    "landing.features.matchmaking.desc": "AI phân tích hơn 50 điểm dữ liệu để tìm ra đối tác phù hợp nhất trong vài giây, không phải vài tháng.",
    "landing.features.deal.title": "Trợ Lý Thỏa Thuận AI",
    "landing.features.deal.desc": "Nhận các điểm thảo luận, điều khoản và hướng dẫn đàm phán do AI tạo ra cho từng kết nối.",
    "landing.features.meeting.title": "Tự Động Hóa Cuộc Họp",
    "landing.features.meeting.desc": "Lên lịch thông minh đồng bộ lịch, gửi nhắc nhở và tự động chuẩn bị tài liệu họp.",
    "landing.features.compliance.title": "AI Tuân Thủ",
    "landing.features.compliance.desc": "Kiểm tra quy định tự động đảm bảo mọi giao dịch đáp ứng khung đầu tư và IP của Việt Nam.",
    "landing.workflow.title": "Từ Hồ Sơ Đến Hợp Đồng Trong Vài Ngày",
    "landing.workflow.subtitle": "Quy trình AI hợp lý hóa cắt giảm hàng tháng tìm kiếm thủ công xuống chỉ vài cú nhấp chuột.",
    "landing.workflow.step1": "Tải Hồ Sơ",
    "landing.workflow.step2": "AI Phân Tích",
    "landing.workflow.step3": "Kết Nối Thông Minh",
    "landing.workflow.step4": "Cuộc Họp",
    "landing.workflow.step5": "Chốt Hợp Đồng",

    // Auth
    "auth.email": "Địa chỉ Email",
    "auth.password": "Mật khẩu",
    "auth.signin": "Đăng nhập",
    "auth.signingIn": "Đang đăng nhập...",
    "auth.forgotPassword": "Quên mật khẩu?",
    "auth.noAccount": "Chưa có tài khoản?",
    "auth.register": "Đăng ký",
    "auth.startup.title": "Đăng Nhập Startup",
    "auth.startup.subtitle": "Đăng nhập để truy cập bảng điều khiển và các kết nối của bạn.",
    "auth.partner.title": "Đăng Nhập Tổ Chức Đối Tác",
    "auth.partner.subtitle": "Đăng nhập để khám phá các startup phù hợp với nhu cầu của bạn.",
    "auth.nic.title": "Đăng Nhập Nhân Viên NIC",
    "auth.nic.subtitle": "Truy cập nền tảng quản lý và phân tích NIC.",
    "auth.error.invalid": "Email hoặc mật khẩu không hợp lệ.",
    "auth.demo.hint": "Demo: dùng ",

    // Startup Dashboard
    "startup.dashboard.welcome": "Chào mừng trở lại",
    "startup.dashboard.subtitle": "Tổng quan pipeline giao dịch được hỗ trợ bởi AI của bạn.",
    "startup.dashboard.readiness": "Điểm Sẵn Sàng",
    "startup.dashboard.matches": "Kết Nối Đang Hoạt Động",
    "startup.dashboard.meetings": "Cuộc Họp Đã Lên Lịch",
    "startup.dashboard.profileComplete": "Hồ Sơ Hoàn Chỉnh",
    "startup.dashboard.viewMatches": "Xem Tất Cả Kết Nối",
    "startup.dashboard.editProfile": "Chỉnh Sửa Hồ Sơ",
    "startup.dashboard.topMatch": "Kết Nối Tốt Nhất Tuần Này",
    "startup.dashboard.upcomingMeeting": "Cuộc Họp Sắp Tới",
    "startup.dashboard.aiInsight": "Nhận Xét AI",

    // Startup Profile
    "startup.profile.title": "Hồ Sơ Công Ty",
    "startup.profile.subtitle": "Hoàn thiện hồ sơ để mở khóa kết nối bằng AI.",
    "startup.profile.phase1": "Thông Tin Công Ty",
    "startup.profile.phase2": "Phân Tích Hồ Sơ AI",
    "startup.profile.step.basic": "Thông Tin Cơ Bản",
    "startup.profile.step.technology": "Công Nghệ",
    "startup.profile.step.product": "Sản Phẩm",
    "startup.profile.step.market": "Thị Trường",
    "startup.profile.step.funding": "Tài Chính",
    "startup.profile.step.goals": "Mục Tiêu",
    "startup.profile.step.upload": "Tải Lên",
    "startup.profile.next": "Bước Tiếp Theo",
    "startup.profile.back": "Quay Lại",
    "startup.profile.submit": "Gửi để AI Phân Tích",
    "startup.profile.processing": "AI đang phân tích hồ sơ của bạn...",
    "startup.profile.processingDesc": "Các tác nhân AI đang trích xuất thông tin chính từ hồ sơ và pitch deck của bạn.",
    "startup.profile.complete": "Phân Tích Hoàn Tất",
    "startup.profile.aiSummary": "Tóm Tắt Bởi AI",
    "startup.profile.readiness": "Mức Độ Sẵn Sàng",
    "startup.profile.uploadDeck": "Tải Pitch Deck",
    "startup.profile.uploadDeckDesc": "PDF, PPTX — tối đa 20MB",
    "startup.profile.dragDrop": "Kéo thả hoặc nhấp để tải lên",

    // Readiness checks
    "readiness.funding": "Sẵn Sàng Gọi Vốn",
    "readiness.product": "Sản Phẩm Hoàn Thiện",
    "readiness.legal": "Cơ Cấu Pháp Lý",
    "readiness.traction": "Chỉ Số Tăng Trưởng",
    "readiness.team": "Đội Ngũ Đầy Đủ",
    "readiness.ip": "Bảo Vệ Sở Hữu Trí Tuệ",

    // Match Results
    "matches.title": "Kết Nối Của Bạn",
    "matches.subtitle": "Kết nối được AI tuyển chọn dựa trên hồ sơ và mục tiêu của bạn.",
    "matches.score": "Điểm Kết Nối",
    "matches.viewDetail": "Xem Chi Tiết",
    "matches.express": "Bày Tỏ Quan Tâm",
    "matches.filter.all": "Tất Cả",
    "matches.filter.investment": "Đầu Tư",
    "matches.filter.pilot": "Thí Điểm",
    "matches.filter.research": "Nghiên Cứu",
    "matches.filter.distribution": "Phân Phối",
    "matches.status.pending": "Chờ Xử Lý",
    "matches.status.interested": "Quan Tâm",
    "matches.status.meeting": "Đã Lên Lịch Họp",
    "matches.status.closed": "Đã Chốt Hợp Đồng",

    // Match Detail
    "match.detail.title": "Chi Tiết Kết Nối",
    "match.detail.aiExplanation": "Giải Thích Từ AI",
    "match.detail.capabilities": "So Sánh Năng Lực",
    "match.detail.startupHas": "Bạn Có",
    "match.detail.orgNeeds": "Họ Cần",
    "match.detail.roadmap": "Lộ Trình Hợp Tác",
    "match.detail.scheduleMeeting": "Lên Lịch Cuộc Họp",
    "match.detail.back": "Quay Lại Kết Nối",

    // Partner Dashboard
    "partner.dashboard.welcome": "Chào mừng trở lại",
    "partner.dashboard.subtitle": "Khám phá các startup phù hợp với mục tiêu chiến lược của bạn.",
    "partner.dashboard.matches": "Kết Nối Startup",
    "partner.dashboard.meetings": "Cuộc Họp",
    "partner.dashboard.interests": "Quan Tâm Đã Bày Tỏ",

    // Partner Profile
    "partner.profile.title": "Hồ Sơ Tổ Chức",
    "partner.profile.subtitle": "Cho chúng tôi biết về tổ chức của bạn để tìm các startup phù hợp nhất.",
    "partner.profile.selectType": "Chọn Loại Tổ Chức",
    "partner.profile.selectTypeDesc": "Biểu mẫu hồ sơ sẽ được điều chỉnh theo loại tổ chức của bạn.",
    "partner.profile.type.corporation": "Doanh Nghiệp",
    "partner.profile.type.corporation.desc": "Công ty lớn tìm kiếm đối tác đổi mới từ startup",
    "partner.profile.type.vc": "Quỹ Đầu Tư / VC",
    "partner.profile.type.vc.desc": "Quỹ muốn đầu tư vào các startup tăng trưởng cao",
    "partner.profile.type.university": "Trường Đại Học",
    "partner.profile.type.university.desc": "Cơ sở học thuật hợp tác nghiên cứu",
    "partner.profile.type.research": "Viện Nghiên Cứu",
    "partner.profile.type.research.desc": "Tổ chức R&D tìm kiếm đối tác ứng dụng công nghiệp",
    "partner.profile.submit": "Lưu Hồ Sơ",

    // NIC Dashboard
    "nic.dashboard.title": "Bảng Điều Khiển NIC",
    "nic.dashboard.subtitle": "Tổng quan thời gian thực về hệ sinh thái đổi mới soNIC.",
    "nic.stats.applications": "Đơn Ứng Tuyển",
    "nic.stats.matches": "Kết Nối AI",
    "nic.stats.meetings": "Cuộc Họp",
    "nic.stats.success": "Tỷ Lệ Thành Công",
    "nic.chart.sector": "Startup Theo Lĩnh Vực",
    "nic.chart.funding": "Nhu Cầu Vốn Theo Giai Đoạn",
    "nic.chart.recommendations": "Đề Xuất AI Theo Thời Gian",
    "nic.startups.title": "Tất Cả Startup",
    "nic.startups.search": "Tìm kiếm startup...",
    "nic.meetings.title": "Lịch Cuộc Họp",

    // Common
    "common.loading": "Đang tải...",
    "common.save": "Lưu",
    "common.cancel": "Hủy",
    "common.edit": "Chỉnh Sửa",
    "common.delete": "Xóa",
    "common.view": "Xem",
    "common.search": "Tìm Kiếm",
    "common.filter": "Lọc",
    "common.all": "Tất Cả",
    "common.status": "Trạng Thái",
    "common.date": "Ngày",
    "common.actions": "Hành Động",
    "common.noData": "Không tìm thấy dữ liệu.",
    "common.learnMore": "Tìm Hiểu Thêm",
    "common.getStarted": "Bắt Đầu",
    "common.backHome": "Về Trang Chủ",
    "common.score": "Điểm",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

// ============================================================
// Context
// ============================================================
interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("sonic_lang") as Language | null;
    if (stored === "en" || stored === "vi") {
      setLangState(stored);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("sonic_lang", newLang);
  };

  const t = (key: TranslationKey, fallback?: string): string => {
    return translations[lang][key] ?? fallback ?? key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
