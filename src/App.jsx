import React from 'react';
import { Route, Routes, Outlet, Link, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider } from '@/components/ui/NotificationToast';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Analytics } from '@vercel/analytics/react';
import { AIProvider } from '@/hooks/useAI.jsx';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { MaintenanceProvider } from '@/contexts/MaintenanceContext';
import MaintenanceWrapper from '@/components/MaintenanceWrapper';
import GlobalAIAssistant from '@/components/ai/GlobalAIAssistant';
import UniversalAIChatbot from '@/components/ai/UniversalAIChatbot';
import FonctionnalitesAvanceesPage from '@/pages/FonctionnalitesAvanceesPage';
import ModernHeader from '@/components/layout/ModernHeader';
import BlockchainFooter from '@/components/layout/BlockchainFooter';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HomePage from '@/pages/HomePage';
import ModernHomePage from '@/pages/ModernHomePage';
import LoginPage from '@/pages/LoginPage';
import ModernLoginPage from '@/pages/ModernLoginPage';
import BlockchainLoginPage from '@/pages/BlockchainLoginPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import RegisterPage from '@/pages/RegisterPage';
import ModernRegisterPage from '@/pages/ModernRegisterPage';
import BlockchainRegisterPage from '@/pages/BlockchainRegisterPage';
import MultiStepRegisterPage from '@/pages/MultiStepRegisterPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import DebugDashboard from '@/pages/DebugDashboard';
import PromoterProjectsPage from '@/pages/PromoterProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import PromoterConstructionRequestsPage from '@/pages/PromoterConstructionRequestsPageNew';
import ConstructionRequestDetailPage from '@/pages/ConstructionRequestDetailPage';
import ProfilePage from '@/pages/ProfilePage';
import ContactPage from '@/pages/ContactPage';
import BlockchainContactPage from '@/pages/BlockchainContactPage';
import AboutPage from '@/pages/AboutPage';

// Imports des sous-pages de suivi Particulier
import { 
  PrivateInterests, 
  MunicipalApplications, 
  PromoterReservations, 
  OwnedProperties 
} from '@/pages/dashboards/particulier/tracking';
import ConstructionRequest from '@/pages/dashboards/particulier/tracking/ConstructionRequest';
import AcheteurMessagesPage from '@/pages/dashboards/particulier/AcheteurMessagesPage';
import AcheteurCalendarPage from '@/pages/dashboards/particulier/AcheteurCalendarPage';
import AcheteurDocumentsPage from '@/pages/dashboards/particulier/AcheteurDocumentsPage';
import AcheteurSettingsPage from '@/pages/dashboards/particulier/AcheteurSettingsPage';
import AcheteurNotificationsPage from '@/pages/dashboards/particulier/AcheteurNotificationsPage';
import AIFeaturesPage from '@/pages/AIFeaturesPage';
import UserProfilePage from '@/pages/profiles/UserProfilePage';
import ModernAboutPage from '@/pages/ModernAboutPage';
import BlockchainAboutPage from '@/pages/BlockchainAboutPage';
import FoncierBlockchainPage from '@/pages/FoncierBlockchainPage';
import TestAuthPage from '@/pages/TestAuthPage';
import FoncierSenegalPage from '@/pages/FoncierSenegalPage';
import MapPage from '@/pages/MapPage';
import MyRequestsPage from '@/pages/MyRequestsPage';
import SettingsPage from '@/pages/SettingsPage';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage';
import LegalPage from '@/pages/LegalPage';
import PrivacyPage from '@/pages/PrivacyPage';
import CookiePolicyPage from '@/pages/CookiePolicyPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import FaqPage from '@/pages/FaqPage';
import PartnersPage from '@/pages/PartnersPage';
import SuccessPage from '@/pages/SuccessPage';
import ParcellesVendeursPage from '@/pages/ParcellesVendeursPage';
import TerrainsVendeursPage from '@/pages/TerrainsVendeursPage';
import ParcellesCommunalesPage from '@/pages/ParcellesCommunalesPage';
import ParcelleDetailPage from '@/pages/ParcelleDetailPage';
import ZoneCommunaleDetailPage from '@/pages/ZoneCommunaleDetailPage';
import MunicipalRequestsPage from '@/pages/MunicipalRequestsPage';
import GuideAttributionPage from '@/pages/GuideAttributionPage';
import SellPropertyPage from '@/pages/SellPropertyPage';
import AddPropertyAdvanced from '@/pages/AddPropertyAdvanced';
import EditPropertySimple from '@/pages/EditPropertySimple';
import EditPropertyComplete from '@/pages/EditPropertyComplete';
import DiasporaGuidePage from '@/pages/DiasporaGuidePage';
import DocumentsFonciersPage from '@/pages/DocumentsFonciersPage';
import LoisFoncieresPage from '@/pages/LoisFoncieresPage';
import GuidesTutorielsPage from '@/pages/GuidesTutorielsPage';
import ProjectsGuidePage from '@/pages/ProjectsGuidePage';
import RequestsGuidePage from '@/pages/RequestsGuidePage';
import ConstructionDistancePage from '@/pages/solutions/ConstructionDistancePage';
import ConstructionRequestFormPage from '@/pages/ConstructionRequestFormPage';
import CommunalZonesPage from '@/pages/CommunalZonesPage';
import DiasporaInvestmentPage from '@/pages/solutions/DiasporaInvestmentPage';
import ProjectMonitoringPage from '@/pages/solutions/ProjectMonitoringPage';
import BlockchainSolutionsPage from '@/pages/BlockchainSolutionsPage';
import NFTPropertiesPage from '@/pages/NFTPropertiesPage';
import SmartContractsPage from '@/pages/SmartContractsPage';
import EscrowPage from '@/pages/EscrowPage';
import AgentsFonciersPage from '@/pages/solutions/AgentsFonciersPage';
import GeometresPage from '@/pages/solutions/GeometresPage';
import PriceCalculatorPage from '@/pages/tools/PriceCalculatorPage';
import InteractiveMapPage from '@/pages/tools/InteractiveMapPage';
import ToolsMarketAnalysisPage from '@/pages/tools/MarketAnalysisPage';
import PropertyVerificationPage from '@/pages/tools/PropertyVerificationPage';
import CartePage from '@/pages/CartePage';
import MyListingsPage from '@/pages/MyListingsPage';
import MyFavoritesPage from '@/pages/MyFavoritesPage';
import NotificationsPage from '@/pages/NotificationsPage';
import SavedSearchesPage from '@/pages/SavedSearchesPage';
import ComparisonPage from '@/pages/ComparisonPage';
import SuccessStoriesPage from '@/pages/SuccessStoriesPage';
import PromoterNewBuyersPage from '@/pages/promoteur/PromoterNewBuyersPage';
import PromoterNewQuotePage from '@/pages/promoteur/PromoterNewQuotePage';
import SecureMessagingPage from '@/pages/SecureMessagingPage';
import SimpleDashboard from '@/pages/SimpleDashboard';
import PurchaseProcessPage from '@/pages/PurchaseProcessPage';

// Pages IA et Analytics
import TerangaAIPage from '@/pages/TerangaAIPage';
import AIAnalyticsDashboard from '@/components/analytics/AIAnalyticsDashboard';

// Pages communes nouvelles
import MessagesPageNew from '@/pages/common/MessagesPage';
import DocumentsPageNew from '@/pages/common/DocumentsPage';
import NotificationsPageNew from '@/pages/common/NotificationsPage';
import MyRequestsPageNew from '@/pages/common/MyRequestsPage';
import CalendarPageNew from '@/pages/common/CalendarPage';
import SettingsPageNew from '@/pages/common/SettingsPageNew';
import MesTerrainsPageNew from '@/pages/common/MesTerrainsPage';
import PurchaseSuccessPage from '@/pages/PurchaseSuccessPage';
import MessagesPage from '@/pages/MessagesPage';
import DocumentsPage from '@/pages/DocumentsPage';
import CRMPage from '@/pages/CRMPage';
import ExportPage from '@/pages/ExportPage';
import UploadsPage from '@/pages/UploadsPage';
import CityDetailPage from '@/pages/CityDetailPage';
import CommunalLandsPage from '@/pages/CommunalLandsPage';
import TermsPage from '@/pages/TermsPage';
import DataProtectionPage from '@/pages/DataProtectionPage';
import TerrainProgressPage from '@/pages/TerrainProgressPage';
import { Button } from '@/components/ui/button';
import ProtectedRoute, { AdminRoute, VerifiedRoute, RoleProtectedRoute } from '@/components/layout/ProtectedRoute';
import RoleBasedRedirect from '@/components/layout/RoleBasedRedirect';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { motion } from 'framer-motion';
import { ComparisonProvider } from '@/context/ComparisonContext';
import { AuthProvider } from '@/contexts/UnifiedAuthContext';
import './lib/errorManager';
import './lib/securityConfig';
import DashboardMunicipalRequestPage from '@/pages/DashboardMunicipalRequestPage';
// DASHBOARDS ADMIN - NETTOYÉ (1 dashboard principal uniquement)
import CompleteSidebarAdminDashboard from '@/pages/dashboards/admin/CompleteSidebarAdminDashboard';
import AdminPropertyValidation from '@/pages/dashboards/admin/AdminPropertyValidation';
import ModernAdminOverview from '@/components/admin/ModernAdminOverview';

// PAGES ADMIN MODERNISÉES AVEC DONNÉES RÉELLES
import ModernUsersPage from '@/pages/dashboards/admin/ModernUsersPage';
import ModernTransactionsPage from '@/pages/dashboards/admin/ModernTransactionsPage';
import ModernPropertiesManagementPage from '@/pages/dashboards/admin/ModernPropertiesManagementPage';
import ModernAnalyticsPage from '@/pages/dashboards/admin/ModernAnalyticsPage';
import ModernSettingsPage from '@/pages/dashboards/admin/ModernSettingsPage';
import AdminProjectsPage from '@/pages/admin/AdminProjectsPage';
import AdminPricingPage from '@/pages/admin/AdminPricingPage';
import AdminParcelsPage from '@/pages/admin/AdminParcelsPage';

// NOUVELLES PAGES ADMIN - PRIORITÉ 1
import RevenueManagementPage from '@/pages/admin/RevenueManagementPage';
import PropertyManagementPage from '@/pages/admin/PropertyManagementPage';
import SupportTicketsPage from '@/pages/admin/SupportTicketsPage';
import BulkExportPage from '@/pages/admin/BulkExportPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import AdminSystemRequestsPage from '@/pages/admin/AdminSystemRequestsPage';
import AdminContractsPage from '@/pages/admin/AdminContractsPage';
import SubscriptionManagementPage from '@/pages/admin/SubscriptionManagementPage';

// PHASE 1 - PAGES CMS & MARKETING
import AdminPagesList from '@/pages/admin/AdminPagesList';
import AdminPageEditor from '@/pages/admin/AdminPageEditor';
import AdminLeadsList from '@/pages/admin/AdminLeadsList';
import AuthDebugPage from '@/pages/AuthDebugPage';

// Import des dashboards
import ParticularDashboard from '@/pages/dashboards/particulier/CompleteSidebarParticulierDashboard';
import CompleteSidebarGeometreDashboard from '@/pages/dashboards/geometre/CompleteSidebarGeometreDashboard';
import PromoteurDashboard from '@/pages/dashboards/promoteur/PromoteurDashboard';
import MunicipaliteDashboard from '@/pages/dashboards/MunicipaliteDashboard';
import CompleteSidebarAgentFoncierDashboard from '@/pages/dashboards/agent-foncier/CompleteSidebarAgentFoncierDashboard';
import ModernMairieDashboard from '@/pages/dashboards/ModernMairieDashboard';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminBlogPage from '@/pages/admin/AdminBlogPage';
import AdminBlogFormPage from '@/pages/admin/AdminBlogFormPage';
import AdminAuditLogPage from '@/pages/admin/AdminAuditLogPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import AdminUserRequestsPage from '@/pages/admin/AdminUserRequestsPage';
import AdminUserVerificationsPage from '@/pages/admin/AdminUserVerificationsPage';
import AgentDashboardPage from '@/pages/agent/AgentDashboardPage';
import AgentClientsPage from '@/pages/agent/AgentClientsPage';
import AgentParcelsPage from '@/pages/agent/AgentParcelsPage';
import AgentTasksPage from '@/pages/agent/AgentTasksPage';
import SolutionsBanquesPage from '@/pages/solutions/SolutionsBanquesPage';
import SolutionsNotairesPage from '@/pages/solutions/SolutionsNotairesPage';
import SolutionsPromoteursPage from '@/pages/solutions/SolutionsPromoteursPage';
import SolutionsInvestisseursPage from '@/pages/solutions/SolutionsInvestisseursPage';
import SolutionsVendeursPage from '@/pages/solutions/SolutionsVendeursPage';
import InvestmentsPage from '@/pages/dashboards/investisseur/InvestmentsPage';
import DashboardMarketAnalysisPage from '@/pages/dashboards/investisseur/MarketAnalysisPage';
import OpportunitiesPage from '@/pages/dashboards/investisseur/OpportunitiesPage';
import RoiCalculatorPage from '@/pages/dashboards/investisseur/RoiCalculatorPage';
import DueDiligencePage from '@/pages/dashboards/investisseur/DueDiligencePage';
import ProjectsPage from '@/pages/dashboards/promoteur/ProjectsPage';
import ConstructionTrackingPage from '@/pages/dashboards/promoteur/ConstructionTrackingPage';
import SalesPage from '@/pages/dashboards/promoteur/SalesPage';
import FundingRequestsPage from '@/pages/dashboards/banque/FundingRequestsPage';
import GuaranteesPage from '@/pages/dashboards/banque/GuaranteesPage';
import VendorVerificationPage from '@/pages/VendorVerificationPage';
import LandValuationPage from '@/pages/dashboards/banque/LandValuationPage';
import CompliancePage from '@/pages/dashboards/banque/CompliancePage';
import CompleteSidebarMairieDashboard from '@/pages/dashboards/mairie/CompleteSidebarMairieDashboard';
import CompleteSidebarBanqueDashboard from '@/pages/dashboards/banque/CompleteSidebarBanqueDashboard';
import CompleteSidebarNotaireDashboard from '@/pages/dashboards/notaire/CompleteSidebarNotaireDashboard';
// Modules Notaire modernisés avec données réelles Supabase
import NotaireOverviewModernized from '@/pages/dashboards/notaire/NotaireOverviewModernized';
import NotaireCRMModernized from '@/pages/dashboards/notaire/NotaireCRMModernized';
import NotaireCommunicationModernized from '@/pages/dashboards/notaire/NotaireCommunicationModernized';
import NotaireTransactionsModernized from '@/pages/dashboards/notaire/NotaireTransactionsModernized';
import NotaireAuthenticationModernized from '@/pages/dashboards/notaire/NotaireAuthenticationModernized';
import NotaireCasesModernized from '@/pages/dashboards/notaire/NotaireCasesModernized';
import NotaireArchivesModernized from '@/pages/dashboards/notaire/NotaireArchivesModernized';
import NotaireComplianceModernized from '@/pages/dashboards/notaire/NotaireComplianceModernized';
import NotaireAnalyticsModernized from '@/pages/dashboards/notaire/NotaireAnalyticsModernized';
import NotaireAIModernized from '@/pages/dashboards/notaire/NotaireAIModernized';
import NotaireBlockchainModernized from '@/pages/dashboards/notaire/NotaireBlockchainModernized';
import NotaireSettingsModernized from '@/pages/dashboards/notaire/NotaireSettingsModernized';

// Phase 2 - Pages Prioritaires (Sprint 5)
import NotaireSupportPage from '@/pages/dashboards/notaire/NotaireSupportPage.jsx';
import NotaireSubscriptionsPage from '@/pages/dashboards/notaire/NotaireSubscriptionsPage.jsx';
import NotaireHelpPage from '@/pages/dashboards/notaire/NotaireHelpPage.jsx';
import NotaireNotificationsPage from '@/pages/dashboards/notaire/NotaireNotificationsPage.jsx';

// Phase 3 - Features Avancées
import NotaireVisioPage from '@/pages/dashboards/notaire/NotaireVisioPage.jsx';
import NotaireELearningPage from '@/pages/dashboards/notaire/NotaireELearningPage.jsx';
import NotaireMarketplacePage from '@/pages/dashboards/notaire/NotaireMarketplacePage.jsx';
import NotaireAPICadastrePage from '@/pages/dashboards/notaire/NotaireAPICadastrePage.jsx';
import NotaireFinancialDashboardPage from '@/pages/dashboards/notaire/NotaireFinancialDashboardPage.jsx';
import NotaireMultiOfficePage from '@/pages/dashboards/notaire/NotaireMultiOfficePage.jsx';

import TerrainOversightPage from '@/pages/solutions/dashboards/mairies/TerrainOversightPage';
import TerrainAnalyticsPage from '@/pages/solutions/dashboards/mairies/TerrainAnalyticsPage';
import CasesPage from '@/pages/dashboards/notaire/CasesPage';
import AuthenticationPage from '@/pages/dashboards/notaire/AuthenticationPage';
import ArchivesPage from '@/pages/dashboards/notaire/ArchivesPage';
import ComplianceCheckPage from '@/pages/dashboards/notaire/ComplianceCheckPage';
// import ModernBanqueDashboard from '@/pages/dashboards/ModernBanqueDashboard';
// import ModernPromoteurDashboard from '@/pages/dashboards/ModernPromoteurDashboard';
import CompleteSidebarParticulierDashboard from '@/pages/dashboards/particulier/CompleteSidebarParticulierDashboard';

// Nouvelles pages dashboard particulier refonte avec sidebar moderne
import DashboardParticulierRefonte from '@/pages/dashboards/particulier/DashboardParticulierRefonte';
import DashboardParticulierHome from '@/pages/dashboards/particulier/DashboardParticulierHome';
import ParticulierTicketsSupport from '@/pages/dashboards/particulier/ParticulierTicketsSupport';
import ParticulierAnalytics from '@/pages/dashboards/particulier/ParticulierAnalytics';

// Sous-pages particulier refondues pour suivi administratif
import ParticulierOverview from '@/pages/dashboards/particulier/ParticulierOverview_FIXED_ERRORS';
import ParticulierRechercheTerrain from '@/pages/dashboards/particulier/ParticulierRechercheTerrain';
import ParticulierMesOffres from '@/pages/dashboards/particulier/ParticulierMesOffres';
import ParticulierVisites from '@/pages/dashboards/particulier/ParticulierVisites';
import ParticulierFinancement from '@/pages/dashboards/particulier/ParticulierFinancement';
import ParticulierZonesCommunales from '@/pages/dashboards/particulier/ParticulierZonesCommunales_FUNCTIONAL_FIXED';
import ParticulierDemandesTerrains from '@/pages/dashboards/particulier/ParticulierDemandesTerrains';
import ParticulierTerrainsPrive from '@/pages/dashboards/particulier/ParticulierTerrainsPrive';
import ParticulierPromoteurs from '@/pages/dashboards/particulier/ParticulierPromoteurs';
import ParticulierFavoris from '@/pages/dashboards/particulier/ParticulierFavoris';
import ParticulierMessages from '@/pages/dashboards/particulier/ParticulierMessages';
import ParticulierDocuments from '@/pages/dashboards/particulier/ParticulierDocuments_FUNCTIONAL';
import ParticulierNotifications from '@/pages/dashboards/particulier/ParticulierNotifications_FUNCTIONAL';
import ParticulierConstructions from '@/pages/dashboards/particulier/ParticulierConstructions';
import ParticulierCalendar from '@/pages/dashboards/particulier/ParticulierCalendar';
import ParticulierTickets from '@/pages/dashboards/particulier/ParticulierTickets';
import ParticulierAI from '@/pages/dashboards/particulier/ParticulierAI';
import ParticulierBlockchain from '@/pages/dashboards/particulier/ParticulierBlockchain';
import ParticulierSettings from '@/pages/dashboards/particulier/ParticulierSettings_FUNCTIONAL';

import ModernVendeurDashboard from '@/pages/dashboards/vendeur/ModernVendeurDashboard';
import CompleteSidebarVendeurDashboard from '@/pages/dashboards/vendeur/CompleteSidebarVendeurDashboard';
import VendeurDashboard from '@/pages/dashboards/vendeur/VendeurDashboard';

// Imports pages vendeur RealData
import VendeurOverviewRealData from '@/pages/dashboards/vendeur/VendeurOverviewRealData';
import VendeurCRMRealData from '@/pages/dashboards/vendeur/VendeurCRMRealData';
import VendeurPropertiesRealData from '@/pages/dashboards/vendeur/VendeurPropertiesRealData';
import VendeurPurchaseRequests from '@/pages/dashboards/vendeur/VendeurPurchaseRequests';
import VendeurAntiFraudeRealData from '@/pages/dashboards/vendeur/VendeurAntiFraudeRealData';
import VendeurGPSRealData from '@/pages/dashboards/vendeur/VendeurGPSRealData';
import VendeurServicesDigitauxRealData from '@/pages/dashboards/vendeur/VendeurServicesDigitauxRealData';
import VendeurAddTerrainRealData from '@/pages/dashboards/vendeur/VendeurAddTerrainRealData';
import VendeurPhotosRealData from '@/pages/dashboards/vendeur/VendeurPhotosRealData';
import VendeurAnalyticsRealData from '@/pages/dashboards/vendeur/VendeurAnalyticsRealData';
import VendeurAIRealData from '@/pages/dashboards/vendeur/VendeurAIRealData';
import VendeurBlockchainRealData from '@/pages/dashboards/vendeur/VendeurBlockchainRealData';
import VendeurMessagesRealData from '@/pages/dashboards/vendeur/VendeurMessagesRealData';
import VendeurSettingsRealData from '@/pages/dashboards/vendeur/VendeurSettingsRealData';
import VendeurSupport from '@/pages/dashboards/vendeur/VendeurSupport';
import CompleteSidebarInvestisseurDashboard from '@/pages/dashboards/investisseur/CompleteSidebarInvestisseurDashboard';
import { HelmetProvider } from 'react-helmet-async';
import BanquesDashboardPage from '@/pages/solutions/dashboards/BanquesDashboardPage';
import InvestisseursDashboardPage from '@/pages/solutions/dashboards/InvestisseursDashboardPage';
import PromoteursDashboardPage from '@/pages/solutions/dashboards/PromoteursDashboardPage';
import MairiesDashboardPage from '@/pages/solutions/dashboards/MairiesDashboardPage';
import NotairesDashboardPage from '@/pages/solutions/dashboards/NotairesDashboardPage';
import AccessDeniedPage from '@/components/AccessDeniedPage';
import SecurityDiagnosticTool from '@/components/SecurityDiagnosticTool';
import NotFoundPage from '@/pages/NotFoundPage';
import PricingPage from '@/pages/PricingPage';
import GlossaryPage from '@/pages/GlossaryPage';
import TaxGuidePage from '@/pages/TaxGuidePage';
import BannedPage from '@/pages/BannedPage';
import DebugRole from '@/pages/DebugRole';
import UserStatusWrapper from '@/components/layout/UserStatusWrapper';
import CaseTrackingPage from '@/pages/CaseTrackingPage';
import DigitalVaultPage from '@/pages/DigitalVaultPage';
import TransactionsPage from '@/pages/TransactionsPage';
import VendeurDashboardPage from '@/pages/solutions/dashboards/VendeurDashboardPage';
import PaymentPage from '@/pages/PaymentPage';
import VerificationPage from '@/pages/VerificationPage';

// ===== PAGES IA AUTONOME =====
import AIAssistedTerrainConfigPage from '@/pages/AIAssistedTerrainConfigPage';
import AutonomousAIDashboard from '@/pages/AutonomousAIDashboard';
import PendingVerificationPage from '@/pages/PendingVerificationPage';
import MunicipalLandInfoPage from '@/pages/MunicipalLandInfoPage';
import AddParcelPage from '@/pages/AddParcelPage';
import ParcelDetailPage from '@/pages/ParcelDetailPage';
import EditParcelPage from '@/pages/EditParcelPage';
import CheckoutPage from '@/pages/CheckoutPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import MairiePage from '@/pages/MairiePage';
import RegionInvestmentPage from '@/pages/RegionInvestmentPage';
import SolutionsAgriculteursPage from '@/pages/solutions/SolutionsAgriculteursPage';
import BecomeSellerPage from '@/pages/BecomeSellerPage';
import DiasporaPage from '@/pages/DiasporaPage';
import BanquesPage from '@/pages/BanquesPage';
import NotairesPage from '@/pages/NotairesPage';
import VendeursPage from '@/pages/VendeursPage';
import PromoteursPage from '@/pages/PromoteursPage';
import RejoignezNousPage from '@/pages/RejoignezNousPage';
import SolutionsPage from '@/pages/SolutionsPage';
import SolutionsParticuliersPage from '@/pages/solutions/SolutionsParticuliersPage';

import OneTimePaymentPage from '@/pages/buy/OneTimePaymentPage';
import InstallmentsPaymentPage from '@/pages/buy/InstallmentsPaymentPage';
import BankFinancingPage from '@/pages/buy/BankFinancingPage';
import BuyerBlockchainDashboard from '@/pages/dashboards/blockchain/BuyerBlockchainDashboard';
import BuyerFinancingDashboard from '@/pages/buyer/BuyerFinancingDashboard';
import PurchaseUnitsPage from '@/pages/promoters/PurchaseUnitsPage';
import PaymentPlansPage from '@/pages/promoters/PaymentPlansPage';

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
            <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<BlockchainLoginPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="register" element={<MultiStepRegisterPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="debug-dashboard" element={<DebugDashboard />} />
              <Route path="auth-debug" element={<AuthDebugPage />} />
              <Route path="debug-role" element={<DebugRole />} />
              <Route path="test-auth" element={<TestAuthPage />} />
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
              <Route path="ai-chat" element={<UniversalAIChatbot fullScreen={true} />} />
              
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
                </Route>
                
                {/* Dashboard Vendeur avec routes imbriquées pour chaque page */}
                <Route path="vendeur" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><CompleteSidebarVendeurDashboard /></RoleProtectedRoute>}>
                  <Route index element={<Navigate to="/vendeur/overview" replace />} />
                  <Route path="overview" element={<VendeurOverviewRealData />} />
                  <Route path="crm" element={<VendeurCRMRealData />} />
                  <Route path="properties" element={<VendeurPropertiesRealData />} />
                  <Route path="edit-property/:id" element={<EditPropertyComplete />} />
                  <Route path="purchase-requests" element={<VendeurPurchaseRequests />} />
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
                  <Route path="crm" element={<CRMPage />} />
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
                  <Route path="parcelles/:id/edit" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><EditParcelPage /></RoleProtectedRoute>} />
                  <Route path="parcelles/:id/checkout" element={<RoleProtectedRoute allowedRoles={['Acheteur', 'Particulier']}><CheckoutPage /></RoleProtectedRoute>} />
                  <Route path="my-listings" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><MyListingsPage /></RoleProtectedRoute>} />

                  {/* Parcours d'achat pour Acheteurs/Particuliers */}
                  <Route path="buy/one-time" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><OneTimePaymentPage /></RoleProtectedRoute>} />
                  <Route path="buy/installments" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><InstallmentsPaymentPage /></RoleProtectedRoute>} />
                  <Route path="buy/bank-financing" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><BankFinancingPage /></RoleProtectedRoute>} />
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
                <Route path="property-management" element={<PropertyManagementPage />} />
                <Route path="support" element={<SupportTicketsPage />} />
                <Route path="export" element={<BulkExportPage />} />
                <Route path="user-management" element={<UserManagementPage />} />
                <Route path="subscriptions" element={<SubscriptionManagementPage />} />
                <Route path="system-requests" element={<AdminSystemRequestsPage />} />
                <Route path="contracts" element={<AdminContractsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="blog" element={<AdminBlogPage />} />
                <Route path="blog/new" element={<AdminBlogFormPage />} />
                <Route path="blog/edit/:slug" element={<AdminBlogFormPage />} />
                <Route path="audit-log" element={<AdminAuditLogPage />} />
                <Route path="admin-settings" element={<AdminSettingsPage />} />
                <Route path="security-diagnostic" element={<SecurityDiagnosticTool />} />
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

              {/* Parcours d'achat pour Acheteurs/Particuliers (alias sous /dashboard) */}
              <Route path="buy/one-time" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><OneTimePaymentPage /></RoleProtectedRoute>} />
              <Route path="buy/installments" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><InstallmentsPaymentPage /></RoleProtectedRoute>} />
              <Route path="buy/bank-financing" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><BankFinancingPage /></RoleProtectedRoute>} />
              <Route path="buyer/financing" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><BuyerFinancingDashboard /></RoleProtectedRoute>} />
              <Route path="promoters/purchase-units" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><PurchaseUnitsPage /></RoleProtectedRoute>} />
              <Route path="promoters/payment-plans" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><PaymentPlansPage /></RoleProtectedRoute>} />

              {/* Vendeur: pages et aliases - Dashboard principal déplacé en route indépendante */}
              <Route path="my-listings" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><MyListingsPage /></RoleProtectedRoute>} />
              <Route path="add-parcel" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><AddParcelPage /></RoleProtectedRoute>} />
              <Route path="my-requests" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><MyRequestsPageNew /></RoleProtectedRoute>} />
              {/* Aliases utilisés par le composant vendeur */}
              <Route path="clients" element={<CRMPage />} />
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
          <Toaster />
          <ToastProvider />
          
          {/* IA CONVERSATIONNELLE UNIVERSELLE */}
          <UniversalAIChatbot isFloating={true} />
          
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
