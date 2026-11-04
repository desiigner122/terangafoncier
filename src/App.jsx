import React, { lazy, Suspense } from 'react';
import { Route, Routes, Outlet, Link, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider } from '@/components/ui/NotificationToast';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Analytics } from '@vercel/analytics/react';
import { AIProvider } from '@/hooks/useAI.jsx';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { MaintenanceProvider } from '@/contexts/MaintenanceContext';
import MaintenanceWrapper from '@/components/MaintenanceWrapper';
import { useTitleByRoute } from '@/hooks/usePageTitle';
import GlobalAIAssistant from '@/components/ai/GlobalAIAssistant';
import PremiumAIChatbot from '@/components/ai/PremiumAIChatbot';
import ModernHeader from '@/components/layout/ModernHeader';
import BlockchainFooter from '@/components/layout/BlockchainFooter';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import ProtectedRoute, { AdminRoute, VerifiedRoute, RoleProtectedRoute, BuyerOnlyRoute } from '@/components/layout/ProtectedRoute';
import RoleBasedRedirect from '@/components/layout/RoleBasedRedirect';
import ScrollToTop from '@/components/layout/ScrollToTop';
import TitleUpdater from '@/components/layout/TitleUpdater';
import { motion } from 'framer-motion';
import { ComparisonProvider } from '@/contexts/ComparisonContext';
import { AuthProvider } from '@/contexts/UnifiedAuthContext';
import './lib/errorManager';
import './lib/securityConfig';
import { HelmetProvider } from 'react-helmet-async';
import AccessDeniedPage from '@/components/AccessDeniedPage';
import UserStatusWrapper from '@/components/layout/UserStatusWrapper';

const FonctionnalitesAvanceesPage = lazy(() => import('@/pages/FonctionnalitesAvanceesPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const ModernHomePage = lazy(() => import('@/pages/ModernHomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const ModernLoginPage = lazy(() => import('@/pages/ModernLoginPage'));
const BlockchainLoginPage = lazy(() => import('@/pages/BlockchainLoginPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ModernRegisterPage = lazy(() => import('@/pages/ModernRegisterPage'));
const BlockchainRegisterPage = lazy(() => import('@/pages/BlockchainRegisterPage'));
const MultiStepRegisterPage = lazy(() => import('@/pages/MultiStepRegisterPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const DebugDashboard = lazy(() => import('@/pages/DebugDashboard'));
const PromoterProjectsPage = lazy(() => import('@/pages/PromoterProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'));
const PromoterConstructionRequestsPage = lazy(() => import('@/pages/PromoterConstructionRequestsPageNew'));
const ConstructionRequestDetailPage = lazy(() => import('@/pages/ConstructionRequestDetailPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const BlockchainContactPage = lazy(() => import('@/pages/BlockchainContactPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));

// Imports des sous-pages de suivi Particulier
const PrivateInterests = lazy(() => import('@/pages/dashboards/particulier/tracking').then((m) => ({ default: m.PrivateInterests })));
const MunicipalApplications = lazy(() => import('@/pages/dashboards/particulier/tracking').then((m) => ({ default: m.MunicipalApplications })));
const PromoterReservations = lazy(() => import('@/pages/dashboards/particulier/tracking').then((m) => ({ default: m.PromoterReservations })));
const OwnedProperties = lazy(() => import('@/pages/dashboards/particulier/tracking').then((m) => ({ default: m.OwnedProperties })));
const ConstructionRequest = lazy(() => import('@/pages/dashboards/particulier/tracking/ConstructionRequest'));
const AcheteurMessagesPage = lazy(() => import('@/pages/dashboards/particulier/AcheteurMessagesPage'));
const AcheteurCalendarPage = lazy(() => import('@/pages/dashboards/particulier/AcheteurCalendarPage'));
const AcheteurDocumentsPage = lazy(() => import('@/pages/dashboards/particulier/AcheteurDocumentsPage'));
const AcheteurSettingsPage = lazy(() => import('@/pages/dashboards/particulier/AcheteurSettingsPage'));
const AcheteurNotificationsPage = lazy(() => import('@/pages/dashboards/particulier/AcheteurNotificationsPage'));
const AIFeaturesPage = lazy(() => import('@/pages/AIFeaturesPage'));
const UserProfilePage = lazy(() => import('@/pages/profiles/UserProfilePage'));
const ModernAboutPage = lazy(() => import('@/pages/ModernAboutPage'));
const BlockchainAboutPage = lazy(() => import('@/pages/BlockchainAboutPage'));
const FoncierBlockchainPage = lazy(() => import('@/pages/FoncierBlockchainPage'));
const TestAuthPage = lazy(() => import('@/pages/TestAuthPage'));
const FoncierSenegalPage = lazy(() => import('@/pages/FoncierSenegalPage'));
const MapPage = lazy(() => import('@/pages/MapPage'));
const MyRequestsPage = lazy(() => import('@/pages/MyRequestsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));
const LegalPage = lazy(() => import('@/pages/LegalPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const CookiePolicyPage = lazy(() => import('@/pages/CookiePolicyPage'));
const HowItWorksPage = lazy(() => import('@/pages/HowItWorksPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const PartnersPage = lazy(() => import('@/pages/PartnersPage'));
const SuccessPage = lazy(() => import('@/pages/SuccessPage'));
const ParcellesVendeursPage = lazy(() => import('@/pages/ParcellesVendeursPage'));
const TerrainsVendeursPage = lazy(() => import('@/pages/TerrainsVendeursPage'));
const ParcellesCommunalesPage = lazy(() => import('@/pages/ParcellesCommunalesPage'));
const ParcelleDetailPage = lazy(() => import('@/pages/ParcelleDetailPage'));
const ZoneCommunaleDetailPage = lazy(() => import('@/pages/ZoneCommunaleDetailPage'));
const MunicipalRequestsPage = lazy(() => import('@/pages/MunicipalRequestsPage'));
const GuideAttributionPage = lazy(() => import('@/pages/GuideAttributionPage'));
const SellPropertyPage = lazy(() => import('@/pages/SellPropertyPage'));
const AddPropertyAdvanced = lazy(() => import('@/pages/AddPropertyAdvanced'));
const EditPropertySimple = lazy(() => import('@/pages/EditPropertySimple'));
const EditPropertyComplete = lazy(() => import('@/pages/EditPropertyComplete'));
const DiasporaGuidePage = lazy(() => import('@/pages/DiasporaGuidePage'));
const DocumentsFonciersPage = lazy(() => import('@/pages/DocumentsFonciersPage'));
const LoisFoncieresPage = lazy(() => import('@/pages/LoisFoncieresPage'));
const GuidesTutorielsPage = lazy(() => import('@/pages/GuidesTutorielsPage'));
const ProjectsGuidePage = lazy(() => import('@/pages/ProjectsGuidePage'));
const RequestsGuidePage = lazy(() => import('@/pages/RequestsGuidePage'));
const ConstructionDistancePage = lazy(() => import('@/pages/solutions/ConstructionDistancePage'));
const ConstructionRequestFormPage = lazy(() => import('@/pages/ConstructionRequestFormPage'));
const CommunalZonesPage = lazy(() => import('@/pages/CommunalZonesPage'));
const DiasporaInvestmentPage = lazy(() => import('@/pages/solutions/DiasporaInvestmentPage'));
const ProjectMonitoringPage = lazy(() => import('@/pages/solutions/ProjectMonitoringPage'));
const BlockchainSolutionsPage = lazy(() => import('@/pages/BlockchainSolutionsPage'));
const NFTPropertiesPage = lazy(() => import('@/pages/NFTPropertiesPage'));
const SmartContractsPage = lazy(() => import('@/pages/SmartContractsPage'));
const EscrowPage = lazy(() => import('@/pages/EscrowPage'));
const AgentsFonciersPage = lazy(() => import('@/pages/solutions/AgentsFonciersPage'));
const GeometresPage = lazy(() => import('@/pages/solutions/GeometresPage'));
const PriceCalculatorPage = lazy(() => import('@/pages/tools/PriceCalculatorPage'));
const InteractiveMapPage = lazy(() => import('@/pages/tools/InteractiveMapPage'));
const ToolsMarketAnalysisPage = lazy(() => import('@/pages/tools/MarketAnalysisPage'));
const PropertyVerificationPage = lazy(() => import('@/pages/tools/PropertyVerificationPage'));
const CartePage = lazy(() => import('@/pages/CartePage'));
const MyListingsPage = lazy(() => import('@/pages/MyListingsPage'));
const MyFavoritesPage = lazy(() => import('@/pages/MyFavoritesPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const SavedSearchesPage = lazy(() => import('@/pages/SavedSearchesPage'));
const ComparisonPage = lazy(() => import('@/pages/ComparisonPage'));
const SuccessStoriesPage = lazy(() => import('@/pages/SuccessStoriesPage'));
const PromoterNewBuyersPage = lazy(() => import('@/pages/promoteur/PromoterNewBuyersPage'));
const PromoterNewQuotePage = lazy(() => import('@/pages/promoteur/PromoterNewQuotePage'));
const SecureMessagingPage = lazy(() => import('@/pages/SecureMessagingPage'));
const SimpleDashboard = lazy(() => import('@/pages/SimpleDashboard'));
const PurchaseProcessPage = lazy(() => import('@/pages/PurchaseProcessPage'));

// Pages IA et Analytics
const TerangaAIPage = lazy(() => import('@/pages/TerangaAIPage'));
const AIAnalyticsDashboard = lazy(() => import('@/components/analytics/AIAnalyticsDashboard'));

// Pages communes nouvelles
const MessagesPageNew = lazy(() => import('@/pages/common/MessagesPage'));
const DocumentsPageNew = lazy(() => import('@/pages/common/DocumentsPage'));
const NotificationsPageNew = lazy(() => import('@/pages/common/NotificationsPage'));
const MyRequestsPageNew = lazy(() => import('@/pages/common/MyRequestsPage'));
const CalendarPageNew = lazy(() => import('@/pages/common/CalendarPage'));
const SettingsPageNew = lazy(() => import('@/pages/common/SettingsPageNew'));
const MesTerrainsPageNew = lazy(() => import('@/pages/common/MesTerrainsPage'));
const PurchaseSuccessPage = lazy(() => import('@/pages/PurchaseSuccessPage'));
const MessagesPage = lazy(() => import('@/pages/MessagesPage'));
const DocumentsPage = lazy(() => import('@/pages/DocumentsPage'));
const CRMPageModernNew = lazy(() => import('@/pages/CRM/CRMPageNew'));
const ExportPage = lazy(() => import('@/pages/ExportPage'));
const UploadsPage = lazy(() => import('@/pages/UploadsPage'));
const CityDetailPage = lazy(() => import('@/pages/CityDetailPage'));
const CommunalLandsPage = lazy(() => import('@/pages/CommunalLandsPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const DataProtectionPage = lazy(() => import('@/pages/DataProtectionPage'));
const TerrainProgressPage = lazy(() => import('@/pages/TerrainProgressPage'));
const DashboardMunicipalRequestPage = lazy(() => import('@/pages/DashboardMunicipalRequestPage'));
// DASHBOARDS ADMIN - NETTOYÉ (1 dashboard principal uniquement)
const CompleteSidebarAdminDashboard = lazy(() => import('@/pages/dashboards/admin/CompleteSidebarAdminDashboard'));
const AdminPropertyValidation = lazy(() => import('@/pages/dashboards/admin/AdminPropertyValidation'));
const ModernAdminOverview = lazy(() => import('@/components/admin/ModernAdminOverview'));

// PAGES ADMIN MODERNISÉES AVEC DONNÉES RÉELLES
const ModernUsersPage = lazy(() => import('@/pages/dashboards/admin/ModernUsersPage'));
const ModernTransactionsPage = lazy(() => import('@/pages/dashboards/admin/ModernTransactionsPage'));
const ModernPropertiesManagementPage = lazy(() => import('@/pages/dashboards/admin/ModernPropertiesManagementPage'));
const ModernAnalyticsPage = lazy(() => import('@/pages/dashboards/admin/ModernAnalyticsPage'));
const ModernSettingsPage = lazy(() => import('@/pages/dashboards/admin/ModernSettingsPage'));
const AdminProjectsPage = lazy(() => import('@/pages/admin/AdminProjectsPage'));
const AdminPricingPage = lazy(() => import('@/pages/admin/AdminPricingPage'));
const AdminParcelsPage = lazy(() => import('@/pages/admin/AdminParcelsPage'));

// NOUVELLES PAGES ADMIN - PRIORITÉ 1
const RevenueManagementPage = lazy(() => import('@/pages/admin/RevenueManagementPage'));
const PropertyManagementPage = lazy(() => import('@/pages/admin/PropertyManagementPage'));
const SupportTicketsPage = lazy(() => import('@/pages/admin/SupportTicketsPage'));
const BulkExportPage = lazy(() => import('@/pages/admin/BulkExportPage'));
const UserManagementPage = lazy(() => import('@/pages/admin/UserManagementPage'));
const AdminSystemRequestsPage = lazy(() => import('@/pages/admin/AdminSystemRequestsPage'));
const AdminContractsPage = lazy(() => import('@/pages/admin/AdminContractsPage'));
const SubscriptionManagementPage = lazy(() => import('@/pages/admin/SubscriptionManagementPage'));

// PHASE 1 - PAGES CMS & MARKETING
const AdminPagesList = lazy(() => import('@/pages/admin/AdminPagesList'));
const AdminPageEditor = lazy(() => import('@/pages/admin/AdminPageEditor'));
const AdminLeadsList = lazy(() => import('@/pages/admin/AdminLeadsList'));
const AuthDebugPage = lazy(() => import('@/pages/AuthDebugPage'));

// Import des dashboards
const ParticularDashboard = lazy(() => import('@/pages/dashboards/particulier/CompleteSidebarParticulierDashboard'));
const CompleteSidebarGeometreDashboard = lazy(() => import('@/pages/dashboards/geometre/CompleteSidebarGeometreDashboard'));
const PromoteurDashboard = lazy(() => import('@/pages/dashboards/promoteur/PromoteurDashboard'));
const MunicipaliteDashboard = lazy(() => import('@/pages/dashboards/MunicipaliteDashboard'));
const CompleteSidebarAgentFoncierDashboard = lazy(() => import('@/pages/dashboards/agent-foncier/CompleteSidebarAgentFoncierDashboard'));
const ModernMairieDashboard = lazy(() => import('@/pages/dashboards/ModernMairieDashboard'));
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage'));
const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage'));
const AdminBlogPage = lazy(() => import('@/pages/admin/AdminBlogPage'));
const AdminBlogFormPage = lazy(() => import('@/pages/admin/AdminBlogFormPage'));
const AdminAuditLogPage = lazy(() => import('@/pages/admin/AdminAuditLogPage'));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'));
const AdminUserRequestsPage = lazy(() => import('@/pages/admin/AdminUserRequestsPage'));
const AdminUserVerificationsPage = lazy(() => import('@/pages/admin/AdminUserVerificationsPage'));
const AgentDashboardPage = lazy(() => import('@/pages/agent/AgentDashboardPage'));
const AgentClientsPage = lazy(() => import('@/pages/agent/AgentClientsPage'));
const AgentParcelsPage = lazy(() => import('@/pages/agent/AgentParcelsPage'));
const AgentTasksPage = lazy(() => import('@/pages/agent/AgentTasksPage'));
const SolutionsBanquesPage = lazy(() => import('@/pages/solutions/SolutionsBanquesPage'));
const SolutionsNotairesPage = lazy(() => import('@/pages/solutions/SolutionsNotairesPage'));
const SolutionsPromoteursPage = lazy(() => import('@/pages/solutions/SolutionsPromoteursPage'));
const SolutionsInvestisseursPage = lazy(() => import('@/pages/solutions/SolutionsInvestisseursPage'));
const SolutionsVendeursPage = lazy(() => import('@/pages/solutions/SolutionsVendeursPage'));
const InvestmentsPage = lazy(() => import('@/pages/dashboards/investisseur/InvestmentsPage'));
const DashboardMarketAnalysisPage = lazy(() => import('@/pages/dashboards/investisseur/MarketAnalysisPage'));
const OpportunitiesPage = lazy(() => import('@/pages/dashboards/investisseur/OpportunitiesPage'));
const RoiCalculatorPage = lazy(() => import('@/pages/dashboards/investisseur/RoiCalculatorPage'));
const DueDiligencePage = lazy(() => import('@/pages/dashboards/investisseur/DueDiligencePage'));
const ProjectsPage = lazy(() => import('@/pages/dashboards/promoteur/ProjectsPage'));
const ConstructionTrackingPage = lazy(() => import('@/pages/dashboards/promoteur/ConstructionTrackingPage'));
const SalesPage = lazy(() => import('@/pages/dashboards/promoteur/SalesPage'));
const FundingRequestsPage = lazy(() => import('@/pages/dashboards/banque/FundingRequestsPage'));
const GuaranteesPage = lazy(() => import('@/pages/dashboards/banque/GuaranteesPage'));
const VendorVerificationPage = lazy(() => import('@/pages/VendorVerificationPage'));
const LandValuationPage = lazy(() => import('@/pages/dashboards/banque/LandValuationPage'));
const CompliancePage = lazy(() => import('@/pages/dashboards/banque/CompliancePage'));
const CompleteSidebarMairieDashboard = lazy(() => import('@/pages/dashboards/mairie/CompleteSidebarMairieDashboard'));
const CompleteSidebarBanqueDashboard = lazy(() => import('@/pages/dashboards/banque/CompleteSidebarBanqueDashboard'));
const CompleteSidebarNotaireDashboard = lazy(() => import('@/pages/dashboards/notaire/CompleteSidebarNotaireDashboard'));
// Modules Notaire modernisés avec données réelles Supabase
const NotaireOverviewModernized = lazy(() => import('@/pages/dashboards/notaire/NotaireOverviewModernized'));
const NotaireCRMModernized = lazy(() => import('@/pages/dashboards/notaire/NotaireCRMModernized'));
const NotaireCommunicationModernized = lazy(() => import('@/pages/dashboards/notaire/NotaireCommunicationModernized'));
const NotaireTransactionsModernized = lazy(() => import('@/pages/dashboards/notaire/NotaireTransactionsModernized'));
const NotaireAuthenticationModernized = lazy(() => import('@/pages/dashboards/notaire/NotaireAuthenticationModernized'));
const NotaireCasesModernized = lazy(() => import('@/pages/dashboards/notaire/NotaireCasesModernized'));
const NotaireArchivesModernized = lazy(() => import('@/pages/dashboards/notaire/NotaireArchivesModernized'));
const NotaireComplianceModernized = lazy(() => import('@/pages/dashboards/notaire/NotaireComplianceModernized'));
const NotaireAnalyticsModernized = lazy(() => import('@/pages/dashboards/notaire/NotaireAnalyticsModernized'));
const NotaireAIModernized = lazy(() => import('@/pages/dashboards/notaire/NotaireAIModernized'));
const NotaireBlockchainModernized = lazy(() => import('@/pages/dashboards/notaire/NotaireBlockchainModernized'));
const NotaireSettingsModernized = lazy(() => import('@/pages/dashboards/notaire/NotaireSettingsModernized'));

// Phase 2 - Pages Prioritaires (Sprint 5)
const NotaireSupportPage = lazy(() => import('@/pages/dashboards/notaire/NotaireSupportPage.jsx'));
const NotaireSubscriptionsPage = lazy(() => import('@/pages/dashboards/notaire/NotaireSubscriptionsPage.jsx'));
const NotaireHelpPage = lazy(() => import('@/pages/dashboards/notaire/NotaireHelpPage.jsx'));
const NotaireNotificationsPage = lazy(() => import('@/pages/dashboards/notaire/NotaireNotificationsPage.jsx'));

// Phase 3 - Features Avancées
const NotaireVisioPage = lazy(() => import('@/pages/dashboards/notaire/NotaireVisioPage.jsx'));
const NotaireELearningPage = lazy(() => import('@/pages/dashboards/notaire/NotaireELearningPage.jsx'));
const NotaireMarketplacePage = lazy(() => import('@/pages/dashboards/notaire/NotaireMarketplacePage.jsx'));
const NotaireAPICadastrePage = lazy(() => import('@/pages/dashboards/notaire/NotaireAPICadastrePage.jsx'));
const NotaireFinancialDashboardPage = lazy(() => import('@/pages/dashboards/notaire/NotaireFinancialDashboardPage.jsx'));
const NotaireMultiOfficePage = lazy(() => import('@/pages/dashboards/notaire/NotaireMultiOfficePage.jsx'));

const TerrainOversightPage = lazy(() => import('@/pages/solutions/dashboards/mairies/TerrainOversightPage'));
const TerrainAnalyticsPage = lazy(() => import('@/pages/solutions/dashboards/mairies/TerrainAnalyticsPage'));
const CasesPage = lazy(() => import('@/pages/dashboards/notaire/CasesPage'));
const AuthenticationPage = lazy(() => import('@/pages/dashboards/notaire/AuthenticationPage'));
const ArchivesPage = lazy(() => import('@/pages/dashboards/notaire/ArchivesPage'));
const ComplianceCheckPage = lazy(() => import('@/pages/dashboards/notaire/ComplianceCheckPage'));
// import ModernBanqueDashboard from '@/pages/dashboards/ModernBanqueDashboard';
// import ModernPromoteurDashboard from '@/pages/dashboards/ModernPromoteurDashboard';
const CompleteSidebarParticulierDashboard = lazy(() => import('@/pages/dashboards/particulier/CompleteSidebarParticulierDashboard'));

// Nouvelles pages dashboard particulier refonte avec sidebar moderne
const DashboardParticulierRefonte = lazy(() => import('@/pages/dashboards/particulier/DashboardParticulierRefonte'));
const DashboardParticulierHome = lazy(() => import('@/pages/dashboards/particulier/DashboardParticulierHome'));
const ParticulierTicketsSupport = lazy(() => import('@/pages/dashboards/particulier/ParticulierTicketsSupport'));
const ParticulierAnalytics = lazy(() => import('@/pages/dashboards/particulier/ParticulierAnalytics'));

// Sous-pages particulier refondues pour suivi administratif
const ParticulierOverview = lazy(() => import('@/pages/dashboards/particulier/ParticulierOverview_FIXED_ERRORS'));
const ParticulierRechercheTerrain = lazy(() => import('@/pages/dashboards/particulier/ParticulierRechercheTerrain'));
const ParticulierMesOffres = lazy(() => import('@/pages/dashboards/particulier/ParticulierMesOffres'));
const ParticulierMesAchats = lazy(() => import('@/pages/dashboards/particulier/ParticulierMesAchats'));
const ParticulierVisites = lazy(() => import('@/pages/dashboards/particulier/ParticulierVisites'));
const ParticulierFinancement = lazy(() => import('@/pages/dashboards/particulier/ParticulierFinancement'));
const ParticulierZonesCommunales = lazy(() => import('@/pages/dashboards/particulier/ParticulierZonesCommunales_FUNCTIONAL_FIXED'));
const ParticulierDemandesTerrains = lazy(() => import('@/pages/dashboards/particulier/ParticulierDemandesTerrains'));
const ParticulierTerrainsPrive = lazy(() => import('@/pages/dashboards/particulier/ParticulierTerrainsPrive'));
const ParticulierPromoteurs = lazy(() => import('@/pages/dashboards/particulier/ParticulierPromoteurs'));
const ParticulierFavoris = lazy(() => import('@/pages/dashboards/particulier/ParticulierFavoris'));
const ParticulierMessages = lazy(() => import('@/pages/dashboards/particulier/ParticulierMessages'));
const ParticulierDocuments = lazy(() => import('@/pages/dashboards/particulier/ParticulierDocuments_FUNCTIONAL'));
const ParticulierNotifications = lazy(() => import('@/pages/dashboards/particulier/ParticulierNotifications_FUNCTIONAL'));
const ParticulierConstructions = lazy(() => import('@/pages/dashboards/particulier/ParticulierConstructions'));
const ParticulierCalendar = lazy(() => import('@/pages/dashboards/particulier/ParticulierCalendar'));
const ParticulierTickets = lazy(() => import('@/pages/dashboards/particulier/ParticulierTickets'));
const ParticulierAI = lazy(() => import('@/pages/dashboards/particulier/ParticulierAI'));
const ParticulierBlockchain = lazy(() => import('@/pages/dashboards/particulier/ParticulierBlockchain'));
const ParticulierSettings = lazy(() => import('@/pages/dashboards/particulier/ParticulierSettings_FUNCTIONAL'));

const ModernVendeurDashboard = lazy(() => import('@/pages/dashboards/vendeur/ModernVendeurDashboard'));
const CompleteSidebarVendeurDashboard = lazy(() => import('@/pages/dashboards/vendeur/CompleteSidebarVendeurDashboard'));
const VendeurDashboard = lazy(() => import('@/pages/dashboards/vendeur/VendeurDashboard'));

// Imports pages vendeur RealData
const VendeurOverviewRealDataModern = lazy(() => import('@/pages/dashboards/vendeur/VendeurOverviewRealDataModern'));
const VendeurCRMModernized = lazy(() => import('@/pages/dashboards/vendeur/VendeurCRMModernized'));
const VendeurPropertiesRealData = lazy(() => import('@/pages/dashboards/vendeur/VendeurPropertiesRealData'));
const VendeurPurchaseRequests = lazy(() => import('@/pages/dashboards/vendeur/VendeurPurchaseRequests'));
const VendeurCaseTracking = lazy(() => import('@/pages/dashboards/vendeur/VendeurCaseTracking'));
const ParticulierCaseTracking = lazy(() => import('@/pages/dashboards/particulier/ParticulierCaseTracking'));
const RefactoredParticulierCaseTracking = lazy(() => import('@/pages/dashboards/particulier/RefactoredParticulierCaseTracking'));
const RefactoredVendeurCaseTracking = lazy(() => import('@/pages/dashboards/vendeur/RefactoredVendeurCaseTracking'));
const VendeurAntiFraudeRealData = lazy(() => import('@/pages/dashboards/vendeur/VendeurAntiFraudeRealData'));
const VendeurGPSRealData = lazy(() => import('@/pages/dashboards/vendeur/VendeurGPSRealData'));
const VendeurServicesDigitauxRealData = lazy(() => import('@/pages/dashboards/vendeur/VendeurServicesDigitauxRealData'));
const VendeurAddTerrainRealData = lazy(() => import('@/pages/dashboards/vendeur/VendeurAddTerrainRealData'));
const VendeurPhotosRealData = lazy(() => import('@/pages/dashboards/vendeur/VendeurPhotosRealData'));
const VendeurAnalyticsRealData = lazy(() => import('@/pages/dashboards/vendeur/VendeurAnalyticsRealData'));
const VendeurAIRealData = lazy(() => import('@/pages/dashboards/vendeur/VendeurAIRealData'));
const VendeurBlockchainRealData = lazy(() => import('@/pages/dashboards/vendeur/VendeurBlockchainRealData'));
const VendeurMessagesRealData = lazy(() => import('@/pages/dashboards/vendeur/VendeurMessagesRealData'));
const VendeurSettingsRealData = lazy(() => import('@/pages/dashboards/vendeur/VendeurSettingsRealData'));
const VendeurSupport = lazy(() => import('@/pages/dashboards/vendeur/VendeurSupport'));
const CompleteSidebarInvestisseurDashboard = lazy(() => import('@/pages/dashboards/investisseur/CompleteSidebarInvestisseurDashboard'));
const BanquesDashboardPage = lazy(() => import('@/pages/solutions/dashboards/BanquesDashboardPage'));
const InvestisseursDashboardPage = lazy(() => import('@/pages/solutions/dashboards/InvestisseursDashboardPage'));
const PromoteursDashboardPage = lazy(() => import('@/pages/solutions/dashboards/PromoteursDashboardPage'));
const MairiesDashboardPage = lazy(() => import('@/pages/solutions/dashboards/MairiesDashboardPage'));
const NotairesDashboardPage = lazy(() => import('@/pages/solutions/dashboards/NotairesDashboardPage'));
const SecurityDiagnosticTool = lazy(() => import('@/components/SecurityDiagnosticTool'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const GlossaryPage = lazy(() => import('@/pages/GlossaryPage'));
const TaxGuidePage = lazy(() => import('@/pages/TaxGuidePage'));
const BannedPage = lazy(() => import('@/pages/BannedPage'));
const DebugRole = lazy(() => import('@/pages/DebugRole'));
const DiagnosticVendorProfilePage = lazy(() => import('@/pages/DiagnosticVendorProfilePage'));
const CaseTrackingPage = lazy(() => import('@/pages/CaseTrackingPage'));
const DigitalVaultPage = lazy(() => import('@/pages/DigitalVaultPage'));
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage'));
const VendeurDashboardPage = lazy(() => import('@/pages/solutions/dashboards/VendeurDashboardPage'));
const PaymentPage = lazy(() => import('@/pages/PaymentPage'));
const VerificationPage = lazy(() => import('@/pages/VerificationPage'));

// ===== PAGES IA AUTONOME =====
const AIAssistedTerrainConfigPage = lazy(() => import('@/pages/AIAssistedTerrainConfigPage'));
const AutonomousAIDashboard = lazy(() => import('@/pages/AutonomousAIDashboard'));
const PendingVerificationPage = lazy(() => import('@/pages/PendingVerificationPage'));
const MunicipalLandInfoPage = lazy(() => import('@/pages/MunicipalLandInfoPage'));
const AddParcelPage = lazy(() => import('@/pages/AddParcelPage'));
const ParcelDetailPage = lazy(() => import('@/pages/ParcelDetailPage'));

const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));
const MairiePage = lazy(() => import('@/pages/MairiePage'));
const RegionInvestmentPage = lazy(() => import('@/pages/RegionInvestmentPage'));
const SolutionsAgriculteursPage = lazy(() => import('@/pages/solutions/SolutionsAgriculteursPage'));
const BecomeSellerPage = lazy(() => import('@/pages/BecomeSellerPage'));
const DiasporaPage = lazy(() => import('@/pages/DiasporaPage'));
const BanquesPage = lazy(() => import('@/pages/BanquesPage'));
const NotairesPage = lazy(() => import('@/pages/NotairesPage'));
const VendeursPage = lazy(() => import('@/pages/VendeursPage'));
const PromoteursPage = lazy(() => import('@/pages/PromoteursPage'));
const RejoignezNousPage = lazy(() => import('@/pages/RejoignezNousPage'));
const SolutionsPage = lazy(() => import('@/pages/SolutionsPage'));
const SolutionsParticuliersPage = lazy(() => import('@/pages/solutions/SolutionsParticuliersPage'));

const OneTimePaymentPage = lazy(() => import('@/pages/buy/OneTimePaymentPage'));
const InstallmentsPaymentPage = lazy(() => import('@/pages/buy/InstallmentsPaymentPage'));
const BankFinancingPage = lazy(() => import('@/pages/buy/BankFinancingPage'));
const BuyerBlockchainDashboard = lazy(() => import('@/pages/dashboards/blockchain/BuyerBlockchainDashboard'));
const BuyerFinancingDashboard = lazy(() => import('@/pages/buyer/BuyerFinancingDashboard'));
const PurchaseUnitsPage = lazy(() => import('@/pages/promoters/PurchaseUnitsPage'));
const PaymentPlansPage = lazy(() => import('@/pages/promoters/PaymentPlansPage'));

// Écran d'attente pendant le chargement à la demande d'une page
const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
  </div>
);

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <ModernHeader />
    <main className="flex-1 pt-20">
      <Outlet />
    </main>
    <BlockchainFooter />
    <GlobalAIAssistant />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <MaintenanceProvider>
            <MaintenanceWrapper>
              <ComparisonProvider>
                <NotificationProvider>
                  <AIProvider>
            <ScrollToTop />
            <TitleUpdater />
            <Suspense fallback={<RouteFallback />}>
            <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<BlockchainLoginPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="register" element={<MultiStepRegisterPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              {/* Pages de diagnostic : jamais servies en production */}
              {import.meta.env.DEV && (
                <>
                  <Route path="debug-dashboard" element={<DebugDashboard />} />
                  <Route path="auth-debug" element={<AuthDebugPage />} />
                  <Route path="debug-role" element={<DebugRole />} />
                  <Route path="diagnostic-vendor-profile" element={<DiagnosticVendorProfilePage />} />
                  <Route path="test-auth" element={<TestAuthPage />} />
                </>
              )}
              <Route path="banned" element={<BannedPage />} />
              <Route path="terrains-communaux" element={<CommunalLandsPage />} />
              <Route path="promoters-projects" element={<PromoterProjectsPage />} />
              <Route path="ai-features" element={<AIFeaturesPage />} />
              <Route path="promoter-requests" element={<PromoterConstructionRequestsPage />} />
              <Route path="construction-request/:id" element={<ConstructionRequestDetailPage />} />
              <Route path="project/:id" element={<ProjectDetailPage />} />
              <Route path="promoter-requests" element={<PromoterConstructionRequestsPage />} />
              
              {/* Profile Routes */}
              <Route path="profile/:userType/:userId" element={<UserProfilePage />} />
              
              <Route path="villes/:cityId" element={<CityDetailPage />} />
              <Route path="contact" element={<BlockchainContactPage />} />
              <Route path="about" element={<BlockchainAboutPage />} />
              <Route path="about" element={<ModernAboutPage />} />
              <Route path="purchase/:propertyId" element={<PurchaseProcessPage />} />
              <Route path="purchase-success/:propertyId" element={<PurchaseSuccessPage />} />
              <Route path="diaspora" element={<DiasporaPage />} />
              <Route path="banques" element={<BanquesPage />} />
              <Route path="notaires" element={<NotairesPage />} />
              <Route path="geometres" element={<GeometresPage />} />
              <Route path="agents-fonciers" element={<AgentsFonciersPage />} />
              <Route path="vendeurs" element={<VendeursPage />} />
              <Route path="promoteurs" element={<PromoteursPage />} />
              <Route path="rejoignez-nous" element={<RejoignezNousPage />} />
              <Route path="how-it-works" element={<HowItWorksPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="partners" element={<PartnersPage />} />
              <Route path="success" element={<SuccessPage />} />
              <Route path="terrains" element={<TerrainsVendeursPage />} />
              <Route path="parcelles-vendeurs" element={<ParcellesVendeursPage />} />
              <Route path="communal-zones" element={<CommunalZonesPage />} />
              <Route path="parcelles-communales" element={<ParcellesCommunalesPage />} />
              <Route path="zone-communale/:id" element={<ZoneCommunaleDetailPage />} />
              <Route path="parcelle/:id" element={<ParcelleDetailPage />} />
              <Route path="parcel-blockchain/:id" element={<ParcelleDetailPage />} />
              <Route path="municipal-requests" element={<MunicipalRequestsPage />} />
              <Route path="terrain-progress" element={<TerrainProgressPage />} />
              <Route path="guide-attribution" element={<GuideAttributionPage />} />
              <Route path="guide-diaspora" element={<DiasporaGuidePage />} />
              <Route path="guide-projets" element={<ProjectsGuidePage />} />
              <Route path="guide-demandes" element={<RequestsGuidePage />} />
              <Route path="map" element={<MapPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogPostPage />} />
              <Route path="legal" element={<LegalPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="cookie-policy" element={<CookiePolicyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="data-protection" element={<DataProtectionPage />} />
              <Route path="documents-fonciers" element={<DocumentsFonciersPage />} />
              <Route path="lois-foncieres" element={<LoisFoncieresPage />} />
              <Route path="guides-tutoriels" element={<GuidesTutorielsPage />} />
              
              <Route path="compare" element={<ComparisonPage />} />
              <Route path="success-stories" element={<SuccessStoriesPage />} />
              <Route path="solutions" element={<SolutionsPage />} />
              <Route path="solutions/particuliers" element={<SolutionsParticuliersPage />} />
              <Route path="solutions/banques" element={<SolutionsBanquesPage />} />
              <Route path="solutions/notaires" element={<SolutionsNotairesPage />} />
              <Route path="solutions/promoteurs" element={<SolutionsPromoteursPage />} />
              <Route path="solutions/investisseurs" element={<SolutionsInvestisseursPage />} />
              <Route path="solutions/vendeurs" element={<SolutionsVendeursPage />} />
              <Route path="solutions/agriculteurs" element={<SolutionsAgriculteursPage />} />
              <Route path="solutions/construction-distance" element={<ConstructionDistancePage />} />
              <Route path="solutions/construction-request" element={<ConstructionRequestFormPage />} />
              <Route path="solutions/diaspora-investment" element={<DiasporaInvestmentPage />} />
              <Route path="solutions/project-monitoring" element={<ProjectMonitoringPage />} />
              <Route path="solutions/blockchain" element={<BlockchainSolutionsPage />} />
              <Route path="nft-properties" element={<NFTPropertiesPage />} />
              <Route path="smart-contracts" element={<SmartContractsPage />} />
              <Route path="escrow" element={<EscrowPage />} />
              <Route path="solutions/agents" element={<AgentsFonciersPage />} />
              <Route path="solutions/geometres" element={<GeometresPage />} />
              
              {/* Pages principales */}
              <Route path="terrains" element={<TerrainsVendeursPage />} />
              <Route path="foncier-blockchain" element={<FoncierBlockchainPage />} />
              <Route path="foncier-senegal" element={<FoncierSenegalPage />} />
              <Route path="carte" element={<CartePage />} />
              
              {/* Admin Login - Accessible sans authentification */}
              <Route path="admin/login" element={<AdminLoginPage />} />
              
              {/* Tools Routes */}
              <Route path="tools/price-calculator" element={<PriceCalculatorPage />} />
              <Route path="tools/map" element={<InteractiveMapPage />} />
              <Route path="tools/market-analysis" element={<ToolsMarketAnalysisPage />} />
              <Route path="tools/property-verification" element={<PropertyVerificationPage />} />
              
              {/* IA & Analytics Routes */}
              <Route path="teranga-ai" element={<TerangaAIPage />} />
              <Route path="ai-analytics" element={<AIAnalyticsDashboard />} />
              <Route path="ai-valuation" element={<PriceCalculatorPage />} />
              <Route path="ai-monitoring" element={<AIAnalyticsDashboard />} />
              
              {/* === ROUTES IA AUTONOME === */}
              <Route path="ai-terrain-config" element={<AIAssistedTerrainConfigPage />} />
              <Route path="autonomous-dashboard" element={<AutonomousAIDashboard />} />
              <Route path="ai-chat" element={<PremiumAIChatbot fullScreen={true} />} />
              
              {/* ===== NOUVELLE PAGE CRM MODERNE ===== */}
              <Route path="crm" element={<ProtectedRoute><CRMPageModernNew /></ProtectedRoute>} />
              <Route path="crm/new" element={<ProtectedRoute><CRMPageModernNew /></ProtectedRoute>} />
              
              <Route path="fonctionnalites-avancees" element={<FonctionnalitesAvanceesPage />} />
              <Route path="blockchain" element={<BlockchainSolutionsPage />} />
              <Route path="solutions/mairies/apercu" element={<MairiesDashboardPage />} />
              <Route path="solutions/vendeurs/apercu" element={<VendeurDashboardPage />} />
              <Route path="solutions/banques/apercu" element={<BanquesDashboardPage />} />
              <Route path="solutions/investisseurs/apercu" element={<InvestisseursDashboardPage />} />
              <Route path="solutions/promoteurs/apercu" element={<PromoteursDashboardPage />} />
              <Route path="solutions/notaires/apercu" element={<NotairesDashboardPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="glossary" element={<GlossaryPage />} />
              <Route path="tax-guide" element={<TaxGuidePage />} />
              <Route path="demande-terrain-communal" element={<MunicipalLandInfoPage />} />
              <Route path="mairie/:mairieSlug" element={<MairiePage />} />
              <Route path="region/:regionSlug" element={<RegionInvestmentPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<UserStatusWrapper />}>
                <Route path="verify" element={<VerificationPage />} />
                <Route path="pending-verification" element={<PendingVerificationPage />} />
                <Route path="become-seller" element={<BecomeSellerPage />} />
                <Route path="dashboard-simple" element={<ProtectedRoute><SimpleDashboard /></ProtectedRoute>} />
                
                {/* Route de redirection intelligente pour /dashboard */}
                <Route path="dashboard" element={<ProtectedRoute><RoleBasedRedirect /></ProtectedRoute>} />
                
                {/* Route de test complètement indépendante pour debugging */}
                <Route path="test-vendeur" element={<ModernVendeurDashboard />} />
                
                {/* Dashboard Particulier/Acheteur avec le nouveau sidebar refonte */}
                <Route path="acheteur" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><DashboardParticulierRefonte /></RoleProtectedRoute>}>
                  <Route index element={<DashboardParticulierHome />} />
                  <Route path="home" element={<DashboardParticulierHome />} />
                  <Route path="overview" element={<ParticulierOverview />} />
                  <Route path="recherche" element={<ParticulierRechercheTerrain />} />
                  <Route path="favoris" element={<ParticulierFavoris />} />
                  <Route path="offres" element={<ParticulierMesOffres />} />
                  <Route path="mes-achats" element={<ParticulierMesAchats />} />
                  <Route path="cases/:caseNumber" element={<RefactoredParticulierCaseTracking />} />
                  <Route path="visites" element={<ParticulierVisites />} />
                  <Route path="financement" element={<ParticulierFinancement />} />
                  <Route path="zones-communales" element={<ParticulierZonesCommunales />} />
                  <Route path="demandes" element={<ParticulierDemandesTerrains />} />
                  <Route path="terrains-prives" element={<ParticulierTerrainsPrive />} />
                  <Route path="construction" element={<ParticulierConstructions />} />
                  <Route path="promoteurs" element={<ParticulierPromoteurs />} />
                  <Route path="suivi-dossiers" element={<ParticulierOverview />} />
                  <Route path="mes-demandes" element={<ParticulierDemandesTerrains />} />
                  <Route path="candidatures" element={<ParticulierZonesCommunales />} />
                  <Route path="messages" element={<ParticulierMessages />} />
                  <Route path="notifications" element={<ParticulierNotifications />} />
                  <Route path="calendar" element={<ParticulierCalendar />} />
                  <Route path="documents" element={<ParticulierDocuments />} />
                  <Route path="tickets" element={<ParticulierTicketsSupport />} />
                  <Route path="support" element={<ParticulierTicketsSupport />} />
                  <Route path="analytics" element={<ParticulierAnalytics />} />
                  <Route path="ai" element={<ParticulierAI />} />
                  <Route path="blockchain" element={<ParticulierBlockchain />} />
                  <Route path="settings" element={<ParticulierSettings />} />
                  <Route path="profil" element={<ParticulierSettings />} />
                  
                  {/* Parcours d'achat intégrés dans le dashboard - RÉSERVÉ AUX ACHETEURS */}
                  <Route path="buy/one-time" element={<BuyerOnlyRoute><OneTimePaymentPage /></BuyerOnlyRoute>} />
                  <Route path="buy/installments" element={<BuyerOnlyRoute><InstallmentsPaymentPage /></BuyerOnlyRoute>} />
                  <Route path="buy/bank-financing" element={<BuyerOnlyRoute><BankFinancingPage /></BuyerOnlyRoute>} />
                </Route>
                
                {/* Dashboard Vendeur avec routes imbriquées pour chaque page */}
                <Route path="vendeur" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><CompleteSidebarVendeurDashboard /></RoleProtectedRoute>}>
                  <Route index element={<Navigate to="/vendeur/overview" replace />} />
                  <Route path="overview" element={<VendeurOverviewRealDataModern />} />
                  <Route path="crm" element={<CRMPageModernNew />} />
                  <Route path="properties" element={<VendeurPropertiesRealData />} />
                  <Route path="edit-property/:id" element={<EditPropertyComplete />} />
                  <Route path="purchase-requests" element={<VendeurPurchaseRequests />} />
                  <Route path="cases/:caseNumber" element={<RefactoredVendeurCaseTracking />} />
                  <Route path="anti-fraud" element={<VendeurAntiFraudeRealData />} />
                  <Route path="gps-verification" element={<VendeurGPSRealData />} />
                  <Route path="digital-services" element={<VendeurServicesDigitauxRealData />} />
                  <Route path="add-property" element={<VendeurAddTerrainRealData />} />
                  <Route path="photos" element={<VendeurPhotosRealData />} />
                  <Route path="analytics" element={<VendeurAnalyticsRealData />} />
                  <Route path="ai-assistant" element={<VendeurAIRealData />} />
                  <Route path="blockchain" element={<VendeurBlockchainRealData />} />
                  <Route path="transactions" element={<div />} /> {/* 🆕 SEMAINE 3 - Géré par CompleteSidebarVendeurDashboard */}
                  <Route path="market-analytics" element={<div />} /> {/* 🆕 SEMAINE 3 - Géré par CompleteSidebarVendeurDashboard */}
                  <Route path="messages" element={<VendeurMessagesRealData />} />
                  <Route path="support" element={<VendeurSupport />} />
                  <Route path="settings" element={<VendeurSettingsRealData />} />
                </Route>
                
                {/* Sous-pages de suivi Particulier/Acheteur */}
                <Route path="acheteur/private-interests" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><PrivateInterests /></RoleProtectedRoute>} />
                <Route path="acheteur/municipal-applications" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><MunicipalApplications /></RoleProtectedRoute>} />
                <Route path="acheteur/promoter-reservations" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><PromoterReservations /></RoleProtectedRoute>} />
                <Route path="acheteur/owned-properties" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><OwnedProperties /></RoleProtectedRoute>} />
                <Route path="acheteur/construction-request" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ConstructionRequest /></RoleProtectedRoute>} />
                
                {/* Pages particulier refondues - SUIVI ADMINISTRATIF */}
                <Route path="acheteur/demandes-terrains" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ParticulierDemandesTerrains /></RoleProtectedRoute>} />
                <Route path="acheteur/demandes-communales" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ParticulierDemandesTerrains /></RoleProtectedRoute>} />
                <Route path="acheteur/candidatures-promoteurs" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ParticulierPromoteurs /></RoleProtectedRoute>} />
                <Route path="acheteur/projets-promoteurs" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ParticulierPromoteurs /></RoleProtectedRoute>} />
                <Route path="acheteur/favoris-dossiers" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ParticulierFavoris /></RoleProtectedRoute>} />
                <Route path="acheteur/messages-administratifs" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ParticulierMessages /></RoleProtectedRoute>} />
                <Route path="acheteur/documents-dossiers" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ParticulierDocuments /></RoleProtectedRoute>} />
                <Route path="acheteur/notifications-administratives" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ParticulierNotifications /></RoleProtectedRoute>} />
                <Route path="acheteur/permis-construire" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ParticulierConstructions /></RoleProtectedRoute>} />

                {/* Pages communes pour acheteur (avec layout simple) */}
                <Route path="acheteur/messages" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ParticulierMessages /></RoleProtectedRoute>} />
                <Route path="acheteur/calendar" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><AcheteurCalendarPage /></RoleProtectedRoute>} />
                <Route path="acheteur/documents" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ParticulierDocuments /></RoleProtectedRoute>} />
                <Route path="acheteur/settings" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ParticulierSettings /></RoleProtectedRoute>} />
                <Route path="acheteur/notifications" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ParticulierNotifications /></RoleProtectedRoute>} />
                <Route path="acheteur/favoris" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ParticulierFavoris /></RoleProtectedRoute>} />
                <Route path="acheteur/constructions" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><ParticulierConstructions /></RoleProtectedRoute>} />

                <Route element={<VerifiedRoute><DashboardLayout /></VerifiedRoute>}>
                  {/* Dashboard redirection is handled by top-level routes to avoid auth/profile conflicts */}
                  <Route path="profile" element={<Navigate to="/settings" replace />} />
                  <Route path="my-requests" element={<RoleProtectedRoute permission="MY_REQUESTS"><MyRequestsPageNew /></RoleProtectedRoute>} />
                  <Route path="transactions" element={<TransactionsPage />} />
                  <Route path="payment/:transactionId" element={<PaymentPage />} />
                  <Route path="favorites" element={<RoleProtectedRoute permission="FAVORITES"><MyFavoritesPage /></RoleProtectedRoute>} />
                  <Route path="notifications" element={<NotificationsPageNew />} />
                  <Route path="messages" element={<MessagesPageNew />} />
                  <Route path="documents" element={<DocumentsPageNew />} />
                  <Route path="rendez-vous" element={<CalendarPageNew />} />
                  <Route path="calendar" element={<CalendarPageNew />} />
                  <Route path="saved-searches" element={<SavedSearchesPage />} />
                  <Route path="settings" element={<SettingsPageNew />} />
                  <Route path="mes-terrains" element={<MesTerrainsPageNew />} />
                  <Route path="my-properties" element={<MesTerrainsPageNew />} />
                  <Route path="crm" element={<CRMPageModernNew />} />
                  <Route path="export" element={<ExportPage />} />
                  <Route path="uploads" element={<UploadsPage />} />
                  <Route path="messaging" element={<SecureMessagingPage />} />
                  <Route path="case-tracking/:id" element={<CaseTrackingPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="digital-vault" element={<RoleProtectedRoute permission="DIGITAL_VAULT"><DigitalVaultPage /></RoleProtectedRoute>} />
                  {/* Blockchain Dashboard (Acheteur/Particulier) */}
                  <Route path="blockchain/dashboard" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><BuyerBlockchainDashboard /></RoleProtectedRoute>} />
                  <Route path="request-municipal-land" element={<RoleProtectedRoute permission="REQUEST_MUNICIPAL_LAND"><DashboardMunicipalRequestPage /></RoleProtectedRoute>} />
                  <Route path="vendor-verification" element={<RoleProtectedRoute permission="VENDOR_VERIFICATION"><VendorVerificationPage /></RoleProtectedRoute>} />
                  <Route path="sell-property" element={<RoleProtectedRoute permission="SELL_PROPERTY"><SellPropertyPage /></RoleProtectedRoute>} />
                  <Route path="add-property-advanced" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><AddPropertyAdvanced /></RoleProtectedRoute>} />
                  {/* Route edit-property déplacée sous /vendeur/ (ligne 486) */}
                  <Route path="add-parcel" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><AddParcelPage /></RoleProtectedRoute>} />
                  <Route path="parcelles/:id" element={<ParcelDetailPage />} />
                  <Route path="parcelles/:id/checkout" element={<RoleProtectedRoute allowedRoles={['Acheteur', 'Particulier']}><CheckoutPage /></RoleProtectedRoute>} />
                  <Route path="my-listings" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><MyListingsPage /></RoleProtectedRoute>} />

                  {/* Parcours d'achat déplacés dans /acheteur/buy/* pour utiliser le sidebar CompleteSidebar */}
                  <Route path="buyer/financing" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><BuyerFinancingDashboard /></RoleProtectedRoute>} />
                  <Route path="promoters/purchase-units" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><PurchaseUnitsPage /></RoleProtectedRoute>} />
                  <Route path="promoters/payment-plans" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><PaymentPlansPage /></RoleProtectedRoute>} />
                  
                  {/* Routes Promoteur */}
                  <Route path="promoteur/nouveaux-acheteurs" element={<RoleProtectedRoute permission="PROMOTEUR_DASHBOARD"><PromoterNewBuyersPage /></RoleProtectedRoute>} />
                  <Route path="promoteur/nouveau-devis" element={<RoleProtectedRoute permission="PROMOTEUR_DASHBOARD"><PromoterNewQuotePage /></RoleProtectedRoute>} />
                  
                  {/* Vendeur dashboard déplacé en route indépendante */}
                  <Route path="my-listings" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><MyListingsPage /></RoleProtectedRoute>} />
                  <Route path="add-parcel" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><AddParcelPage /></RoleProtectedRoute>} />
                  <Route path="my-requests" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><MyRequestsPage /></RoleProtectedRoute>} />
                  
                  {/* Route de test pour dashboard moderne direct */}
                  <Route path="vendeur-moderne" element={<ModernVendeurDashboard />} />
                  {/* Route de test temporaire pour debugging */}
                  <Route path="vendeur-test" element={<VendeurDashboard />} />
                  
                  {/* Redirection géomètre supprimée pour éviter les conflits avec /geometre direct */}
                  {/* Agent Foncier route supprimée pour éviter le conflit avec la route directe */}
                </Route>
              </Route>
            </Route>

            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<CompleteSidebarAdminDashboard />}>
                {/* DASHBOARD PRINCIPAL */}
                <Route index element={<ModernAdminOverview />} />
                <Route path="dashboard" element={<ModernAdminOverview />} />
                <Route path="overview" element={<ModernAdminOverview />} />
                
                {/* PHASE 1 - CMS & MARKETING */}
                <Route path="cms/pages" element={<AdminPagesList />} />
                <Route path="cms/pages/new" element={<AdminPageEditor />} />
                <Route path="cms/pages/:pageId/edit" element={<AdminPageEditor />} />
                <Route path="marketing/leads" element={<AdminLeadsList />} />
                
                {/* PAGES MODERNES - AVEC IA ET BLOCKCHAIN */}
                <Route path="users" element={<ModernUsersPage />} />
                <Route path="properties" element={<ModernPropertiesManagementPage />} />
                <Route path="transactions" element={<ModernTransactionsPage />} />
                <Route path="analytics" element={<ModernAnalyticsPage />} />
                <Route path="settings" element={<ModernSettingsPage />} />
                
                {/* PAGES SPÉCIALISÉES */}
                <Route path="validation" element={<AdminPropertyValidation />} />
                <Route path="projects" element={<AdminProjectsPage />} />
                <Route path="pricing" element={<AdminPricingPage />} />
                <Route path="parcels" element={<AdminParcelsPage />} />
                <Route path="user-requests" element={<AdminUserRequestsPage />} />
                <Route path="user-verifications" element={<AdminUserVerificationsPage />} />
                
                {/* ROUTES ADMIN LEGACY - GARDÉES POUR COMPATIBILITÉ */}
                <Route path="revenue" element={<RevenueManagementPage />} />
                <Route path="financial" element={<RevenueManagementPage />} /> {/* Alias pour sidebar */}
                <Route path="property-management" element={<PropertyManagementPage />} />
                <Route path="support" element={<SupportTicketsPage />} />
                <Route path="export" element={<BulkExportPage />} />
                <Route path="user-management" element={<UserManagementPage />} />
                <Route path="subscriptions" element={<SubscriptionManagementPage />} />
                <Route path="notifications" element={<NotificationsPageNew />} /> {/* Page notifications admin */}
                <Route path="system-requests" element={<AdminSystemRequestsPage />} />
                <Route path="contracts" element={<AdminContractsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="blog" element={<AdminBlogPage />} />
                <Route path="blog/new" element={<AdminBlogFormPage />} />
                <Route path="blog/edit/:id" element={<AdminBlogFormPage />} />
                <Route path="audit-log" element={<AdminAuditLogPage />} />
                <Route path="admin-settings" element={<AdminSettingsPage />} />
                {import.meta.env.DEV && <Route path="security-diagnostic" element={<SecurityDiagnosticTool />} />}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>

            <Route path="/agent" element={<RoleProtectedRoute allowedRoles={['Agent Foncier']}><DashboardLayout /></RoleProtectedRoute>}>
              <Route index element={<AgentDashboardPage />} />
              <Route path="clients" element={<AgentClientsPage />} />
              <Route path="parcels" element={<AgentParcelsPage />} />
              <Route path="tasks" element={<AgentTasksPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Routes directes pour les dashboards */}
            <Route path="/mairie" element={<RoleProtectedRoute allowedRoles={['Mairie']}><CompleteSidebarMairieDashboard /></RoleProtectedRoute>} />
            <Route path="/banque" element={<RoleProtectedRoute allowedRoles={['Banque']}><CompleteSidebarBanqueDashboard /></RoleProtectedRoute>} />
            
            {/* Routes Notaire avec système d'outlets */}
            <Route path="/notaire" element={<RoleProtectedRoute allowedRoles={['Notaire']}><CompleteSidebarNotaireDashboard /></RoleProtectedRoute>}>
              <Route index element={<NotaireOverviewModernized />} />
              <Route path="crm" element={<NotaireCRMModernized />} />
              <Route path="communication" element={<NotaireCommunicationModernized />} />
              <Route path="transactions" element={<NotaireTransactionsModernized />} />
              <Route path="authentication" element={<NotaireAuthenticationModernized />} />
              <Route path="cases" element={<NotaireCasesModernized />} />
              <Route path="archives" element={<NotaireArchivesModernized />} />
              <Route path="compliance" element={<NotaireComplianceModernized />} />
              <Route path="analytics" element={<NotaireAnalyticsModernized />} />
              <Route path="ai" element={<NotaireAIModernized />} />
              <Route path="blockchain" element={<NotaireBlockchainModernized />} />
              <Route path="settings" element={<NotaireSettingsModernized />} />
              
              {/* Phase 2 - Pages Prioritaires (Sprint 5) */}
              <Route path="support" element={<NotaireSupportPage />} />
              <Route path="subscriptions" element={<NotaireSubscriptionsPage />} />
              <Route path="help" element={<NotaireHelpPage />} />
              <Route path="notifications" element={<NotaireNotificationsPage />} />
              
              {/* Phase 3 - Features Avancées */}
              <Route path="visio" element={<NotaireVisioPage />} />
              <Route path="elearning" element={<NotaireELearningPage />} />
              <Route path="marketplace" element={<NotaireMarketplacePage />} />
              <Route path="cadastre" element={<NotaireAPICadastrePage />} />
              <Route path="financial" element={<NotaireFinancialDashboardPage />} />
              <Route path="multi-office" element={<NotaireMultiOfficePage />} />
            </Route>
            
            <Route path="/promoteur" element={<RoleProtectedRoute allowedRoles={['Promoteur']}><PromoteurDashboard /></RoleProtectedRoute>} />
            <Route path="/investisseur/*" element={<RoleProtectedRoute allowedRoles={['Investisseur']}><CompleteSidebarInvestisseurDashboard /></RoleProtectedRoute>} />
            <Route path="/geometre/*" element={<RoleProtectedRoute allowedRoles={['Géomètre', 'geometre', 'Geometre']}><CompleteSidebarGeometreDashboard /></RoleProtectedRoute>} />
            
            {/* Alias pour solutions */}
            <Route path="/solutions/mairies/dashboard" element={<RoleProtectedRoute allowedRoles={['Mairie']}><CompleteSidebarMairieDashboard /></RoleProtectedRoute>} />
            <Route path="/solutions/banques/dashboard" element={<RoleProtectedRoute allowedRoles={['Banque']}><CompleteSidebarBanqueDashboard /></RoleProtectedRoute>} />
            
            {/* Solutions Notaires avec système d'outlets */}
            <Route path="/solutions/notaires/dashboard" element={<RoleProtectedRoute allowedRoles={['Notaire']}><CompleteSidebarNotaireDashboard /></RoleProtectedRoute>}>
              <Route index element={<NotaireOverviewModernized />} />
              <Route path="crm" element={<NotaireCRMModernized />} />
              <Route path="communication" element={<NotaireCommunicationModernized />} />
              <Route path="transactions" element={<NotaireTransactionsModernized />} />
              <Route path="authentication" element={<NotaireAuthenticationModernized />} />
              <Route path="cases" element={<NotaireCasesModernized />} />
              <Route path="archives" element={<NotaireArchivesModernized />} />
              <Route path="compliance" element={<NotaireComplianceModernized />} />
              <Route path="analytics" element={<NotaireAnalyticsModernized />} />
              <Route path="ai" element={<NotaireAIModernized />} />
              <Route path="blockchain" element={<NotaireBlockchainModernized />} />
              <Route path="settings" element={<NotaireSettingsModernized />} />
              
              {/* Phase 2 - Pages Prioritaires (Sprint 5) */}
              <Route path="support" element={<NotaireSupportPage />} />
              <Route path="subscriptions" element={<NotaireSubscriptionsPage />} />
              <Route path="help" element={<NotaireHelpPage />} />
              <Route path="notifications" element={<NotaireNotificationsPage />} />
              
              {/* Phase 3 - Features Avancées */}
              <Route path="visio" element={<NotaireVisioPage />} />
              <Route path="elearning" element={<NotaireELearningPage />} />
              <Route path="marketplace" element={<NotaireMarketplacePage />} />
              <Route path="cadastre" element={<NotaireAPICadastrePage />} />
              <Route path="financial" element={<NotaireFinancialDashboardPage />} />
              <Route path="multi-office" element={<NotaireMultiOfficePage />} />
            </Route>
            
            <Route path="/solutions/promoteurs/dashboard" element={<RoleProtectedRoute allowedRoles={['Promoteur']}><PromoteurDashboard /></RoleProtectedRoute>} />
            <Route path="/solutions/investisseurs/dashboard" element={<RoleProtectedRoute allowedRoles={['Investisseur']}><CompleteSidebarInvestisseurDashboard /></RoleProtectedRoute>} />
            <Route path="/solutions/geometres/dashboard" element={<RoleProtectedRoute allowedRoles={['Géomètre', 'geometre', 'Geometre']}><CompleteSidebarGeometreDashboard /></RoleProtectedRoute>} />

            {/* Routes Dashboard avec layout et sous-pages (/dashboard/*) */}
            <Route path="/dashboard" element={<VerifiedRoute><DashboardLayout /></VerifiedRoute>}>
              {/* Accueil: redirection intelligente selon le rôle */}
              <Route index element={<RoleBasedRedirect />} />

              {/* Pages communes du dashboard */}
              <Route path="notifications" element={<NotificationsPageNew />} />
              <Route path="messages" element={<MessagesPageNew />} />
              <Route path="documents" element={<DocumentsPageNew />} />
              <Route path="rendez-vous" element={<CalendarPageNew />} />
              <Route path="calendar" element={<CalendarPageNew />} />
              <Route path="settings" element={<SettingsPageNew />} />
              <Route path="messaging" element={<SecureMessagingPage />} />
              <Route path="case-tracking/:id" element={<CaseTrackingPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="payment/:transactionId" element={<PaymentPage />} />
              <Route path="favorites" element={<RoleProtectedRoute permission="FAVORITES"><MyFavoritesPage /></RoleProtectedRoute>} />

              {/* Parcours d'achat pour Acheteurs/Particuliers/Investisseurs/Promoteurs (alias sous /dashboard) */}
              <Route path="buy/one-time" element={<BuyerOnlyRoute><OneTimePaymentPage /></BuyerOnlyRoute>} />
              <Route path="buy/installments" element={<BuyerOnlyRoute><InstallmentsPaymentPage /></BuyerOnlyRoute>} />
              <Route path="buy/bank-financing" element={<BuyerOnlyRoute><BankFinancingPage /></BuyerOnlyRoute>} />
              <Route path="buyer/financing" element={<BuyerOnlyRoute><BuyerFinancingDashboard /></BuyerOnlyRoute>} />
              <Route path="promoters/purchase-units" element={<BuyerOnlyRoute><PurchaseUnitsPage /></BuyerOnlyRoute>} />
              <Route path="promoters/payment-plans" element={<BuyerOnlyRoute><PaymentPlansPage /></BuyerOnlyRoute>} />

              {/* Vendeur: pages et aliases - Dashboard principal déplacé en route indépendante */}
              <Route path="my-listings" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><MyListingsPage /></RoleProtectedRoute>} />
              <Route path="add-parcel" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><AddParcelPage /></RoleProtectedRoute>} />
              <Route path="my-requests" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><MyRequestsPageNew /></RoleProtectedRoute>} />
              {/* Aliases utilisés par le composant vendeur */}
              <Route path="clients" element={<CRMPageModernNew />} />
              <Route path="activity" element={<AnalyticsPage />} />

              {/* Autres dashboards (pour cohérence sous /dashboard) */}
              <Route path="acheteur/*" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><DashboardParticulierRefonte /></RoleProtectedRoute>} />
              <Route path="banque" element={<RoleProtectedRoute allowedRoles={['Banque']}><CompleteSidebarBanqueDashboard /></RoleProtectedRoute>} />
              <Route path="investisseur" element={<Navigate to="/investisseur" replace />} />
              {/* Redirection géomètre supprimée pour éviter les conflits */}
            </Route>

            {/* Routes pour tous les dashboards */}
            <Route path="/agent-foncier/*" element={<RoleProtectedRoute allowedRoles={['Agent Foncier', 'agent_foncier']}><CompleteSidebarAgentFoncierDashboard /></RoleProtectedRoute>} />
            <Route path="/acheteur/*" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><DashboardParticulierRefonte /></RoleProtectedRoute>} />
            <Route path="/particulier" element={<Navigate to="/acheteur" replace />} />
            <Route path="/lotisseur" element={<ProtectedRoute><PromoteurDashboard /></ProtectedRoute>} />
            <Route path="/municipalite" element={<ProtectedRoute><MunicipaliteDashboard /></ProtectedRoute>} />

            <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </Suspense>
          <Toaster />
          <ToastProvider />
          
          {/* IA CONVERSATIONNELLE PREMIUM */}
          <PremiumAIChatbot />
          
          {/* VERCEL ANALYTICS */}
          <Analytics />
          
                  </AIProvider>
                </NotificationProvider>
              </ComparisonProvider>
            </MaintenanceWrapper>
          </MaintenanceProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
