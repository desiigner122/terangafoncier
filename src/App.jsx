import React from 'react';
import { Route, Routes, Outlet, Link, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AIProvider } from '@/hooks/useAI.jsx';
import { NotificationProvider } from '@/contexts/NotificationContext';
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
import './lib/errorManager';
import './lib/securityConfig';
import DashboardMunicipalRequestPage from '@/pages/DashboardMunicipalRequestPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import UltraModernAdminDashboard from '@/pages/admin/UltraModernAdminDashboard';
import CompleteSidebarAdminDashboard from '@/pages/dashboards/admin/CompleteSidebarAdminDashboard';
import AdminProjectsPage from '@/pages/admin/AdminProjectsPage';
import AdminPricingPage from '@/pages/admin/AdminPricingPage';
import AdminAnalyticsPage from '@/pages/admin/AdminAnalyticsPage';
import GlobalAdminDashboard from '@/pages/admin/GlobalAdminDashboard';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminParcelsPage from '@/pages/admin/AdminParcelsPage';
import AdminSystemRequestsPage from '@/pages/admin/AdminSystemRequestsPage';
import AdminContractsPage from '@/pages/admin/AdminContractsPage';
import AuthDebugPage from '@/pages/AuthDebugPage';

// Import des dashboards
import ParticularDashboard from '@/pages/dashboards/particulier/ParticulierDashboardModern';
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
import TerrainOversightPage from '@/pages/solutions/dashboards/mairies/TerrainOversightPage';
import TerrainAnalyticsPage from '@/pages/solutions/dashboards/mairies/TerrainAnalyticsPage';
import CasesPage from '@/pages/dashboards/notaire/CasesPage';
import AuthenticationPage from '@/pages/dashboards/notaire/AuthenticationPage';
import ArchivesPage from '@/pages/dashboards/notaire/ArchivesPage';
import ComplianceCheckPage from '@/pages/dashboards/notaire/ComplianceCheckPage';
// import ModernBanqueDashboard from '@/pages/dashboards/ModernBanqueDashboard';
// import ModernPromoteurDashboard from '@/pages/dashboards/ModernPromoteurDashboard';
import ParticulierDashboard from '@/pages/dashboards/particulier/ParticulierDashboardModern';
import CompleteSidebarParticulierDashboard from '@/pages/dashboards/particulier/CompleteSidebarParticulierDashboard';

// Sous-pages particulier refondues pour suivi administratif
import ParticulierCommunal from '@/pages/dashboards/particulier/ParticulierCommunal';
import ParticulierPromoteurs from '@/pages/dashboards/particulier/ParticulierPromoteurs';
import ParticulierFavoris from '@/pages/dashboards/particulier/ParticulierFavoris';
import ParticulierMessages from '@/pages/dashboards/particulier/ParticulierMessages';
import ParticulierDocuments from '@/pages/dashboards/particulier/ParticulierDocuments';
import ParticulierNotifications from '@/pages/dashboards/particulier/ParticulierNotifications';
import ParticulierConstructions from '@/pages/dashboards/particulier/ParticulierConstructions';

import ModernVendeurDashboard from '@/pages/dashboards/vendeur/ModernVendeurDashboard';
import CompleteSidebarVendeurDashboard from '@/pages/dashboards/vendeur/CompleteSidebarVendeurDashboard';
import VendeurDashboard from '@/pages/dashboards/vendeur/VendeurDashboard';
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
                
                {/* Dashboards modernes par rôle - routes indépendantes (ont leur propre layout) */}
                <Route path="acheteur" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><CompleteSidebarParticulierDashboard /></RoleProtectedRoute>} />
                <Route path="vendeur" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><CompleteSidebarVendeurDashboard /></RoleProtectedRoute>} />
                
                {/* Sous-pages de suivi Particulier/Acheteur */}
                <Route path="acheteur/private-interests" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><PrivateInterests /></RoleProtectedRoute>} />
                <Route path="acheteur/municipal-applications" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><MunicipalApplications /></RoleProtectedRoute>} />
                <Route path="acheteur/promoter-reservations" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><PromoterReservations /></RoleProtectedRoute>} />
                <Route path="acheteur/owned-properties" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><OwnedProperties /></RoleProtectedRoute>} />
                <Route path="acheteur/construction-request" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><ConstructionRequest /></RoleProtectedRoute>} />
                
                {/* Pages particulier refondues - SUIVI ADMINISTRATIF */}
                <Route path="acheteur/demandes-terrains" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><ParticulierCommunal /></RoleProtectedRoute>} />
                <Route path="acheteur/demandes-communales" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><ParticulierCommunal /></RoleProtectedRoute>} />
                <Route path="acheteur/candidatures-promoteurs" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><ParticulierPromoteurs /></RoleProtectedRoute>} />
                <Route path="acheteur/projets-promoteurs" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><ParticulierPromoteurs /></RoleProtectedRoute>} />
                <Route path="acheteur/favoris-dossiers" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><ParticulierFavoris /></RoleProtectedRoute>} />
                <Route path="acheteur/messages-administratifs" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><ParticulierMessages /></RoleProtectedRoute>} />
                <Route path="acheteur/documents-dossiers" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><ParticulierDocuments /></RoleProtectedRoute>} />
                <Route path="acheteur/notifications-administratives" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><ParticulierNotifications /></RoleProtectedRoute>} />
                <Route path="acheteur/permis-construire" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><ParticulierConstructions /></RoleProtectedRoute>} />

                {/* Pages communes pour acheteur (avec layout simple) */}
                <Route path="acheteur/messages" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><ParticulierMessages /></RoleProtectedRoute>} />
                <Route path="acheteur/calendar" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><AcheteurCalendarPage /></RoleProtectedRoute>} />
                <Route path="acheteur/documents" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><ParticulierDocuments /></RoleProtectedRoute>} />
                <Route path="acheteur/settings" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><AcheteurSettingsPage /></RoleProtectedRoute>} />
                <Route path="acheteur/notifications" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><ParticulierNotifications /></RoleProtectedRoute>} />
                <Route path="acheteur/favoris" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><ParticulierFavoris /></RoleProtectedRoute>} />
                <Route path="acheteur/constructions" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier','admin']}><ParticulierConstructions /></RoleProtectedRoute>} />

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
                  <Route path="add-parcel" element={<RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}><AddParcelPage /></RoleProtectedRoute>} />
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
              <Route index element={<CompleteSidebarAdminDashboard />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="pricing" element={<AdminPricingPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="global" element={<GlobalAdminDashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="user-requests" element={<AdminUserRequestsPage />} />
              <Route path="user-verifications" element={<AdminUserVerificationsPage />} />
              <Route path="parcels" element={<AdminParcelsPage />} />
              <Route path="system-requests" element={<AdminSystemRequestsPage />} />
              <Route path="contracts" element={<AdminContractsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="blog" element={<AdminBlogPage />} />
              <Route path="blog/new" element={<AdminBlogFormPage />} />
              <Route path="blog/edit/:slug" element={<AdminBlogFormPage />} />
              <Route path="audit-log" element={<AdminAuditLogPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="security-diagnostic" element={<SecurityDiagnosticTool />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route path="/agent" element={<RoleProtectedRoute allowedRoles={['Agent Foncier']}><DashboardLayout /></RoleProtectedRoute>}>
              <Route index element={<AgentDashboardPage />} />
              <Route path="clients" element={<AgentClientsPage />} />
              <Route path="parcels" element={<AgentParcelsPage />} />
              <Route path="tasks" element={<AgentTasksPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Routes directes pour les dashboards */}
            <Route path="/mairie" element={<RoleProtectedRoute allowedRoles={['Mairie', 'admin']}><CompleteSidebarMairieDashboard /></RoleProtectedRoute>} />
            <Route path="/banque" element={<RoleProtectedRoute allowedRoles={['Banque', 'admin']}><CompleteSidebarBanqueDashboard /></RoleProtectedRoute>} />
            <Route path="/notaire" element={<RoleProtectedRoute allowedRoles={['Notaire', 'admin']}><CompleteSidebarNotaireDashboard /></RoleProtectedRoute>} />
            <Route path="/promoteur" element={<RoleProtectedRoute allowedRoles={['Promoteur', 'admin']}><PromoteurDashboard /></RoleProtectedRoute>} />
            <Route path="/investisseur/*" element={<RoleProtectedRoute allowedRoles={['Investisseur', 'admin']}><CompleteSidebarInvestisseurDashboard /></RoleProtectedRoute>} />
            <Route path="/geometre/*" element={<RoleProtectedRoute allowedRoles={['Géomètre', 'geometre', 'Geometre', 'admin']}><CompleteSidebarGeometreDashboard /></RoleProtectedRoute>} />
            
            {/* Alias pour solutions */}
            <Route path="/solutions/mairies/dashboard" element={<RoleProtectedRoute allowedRoles={['Mairie', 'admin']}><CompleteSidebarMairieDashboard /></RoleProtectedRoute>} />
            <Route path="/solutions/banques/dashboard" element={<RoleProtectedRoute allowedRoles={['Banque', 'admin']}><CompleteSidebarBanqueDashboard /></RoleProtectedRoute>} />
            <Route path="/solutions/notaires/dashboard" element={<RoleProtectedRoute allowedRoles={['Notaire', 'admin']}><CompleteSidebarNotaireDashboard /></RoleProtectedRoute>} />
            <Route path="/solutions/promoteurs/dashboard" element={<RoleProtectedRoute allowedRoles={['Promoteur', 'admin']}><PromoteurDashboard /></RoleProtectedRoute>} />
            <Route path="/solutions/investisseurs/dashboard" element={<RoleProtectedRoute allowedRoles={['Investisseur', 'admin']}><CompleteSidebarInvestisseurDashboard /></RoleProtectedRoute>} />
            <Route path="/solutions/geometres/dashboard" element={<RoleProtectedRoute allowedRoles={['Géomètre', 'geometre', 'Geometre', 'admin']}><CompleteSidebarGeometreDashboard /></RoleProtectedRoute>} />

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
              <Route path="acheteur/*" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}><CompleteSidebarParticulierDashboard /></RoleProtectedRoute>} />
              <Route path="banque" element={<RoleProtectedRoute allowedRoles={['Banque']}><CompleteSidebarBanqueDashboard /></RoleProtectedRoute>} />
              <Route path="investisseur" element={<Navigate to="/investisseur" replace />} />
              {/* Redirection géomètre supprimée pour éviter les conflits */}
            </Route>

            {/* Routes pour tous les dashboards */}
            <Route path="/agent-foncier/*" element={<RoleProtectedRoute allowedRoles={['Agent Foncier', 'agent_foncier', 'admin']}><CompleteSidebarAgentFoncierDashboard /></RoleProtectedRoute>} />
            <Route path="/acheteur/*" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier', 'admin']}><CompleteSidebarParticulierDashboard /></RoleProtectedRoute>} />
            <Route path="/particulier" element={<Navigate to="/acheteur" replace />} />
            <Route path="/lotisseur" element={<ProtectedRoute><PromoteurDashboard /></ProtectedRoute>} />
            <Route path="/municipalite" element={<ProtectedRoute><MunicipaliteDashboard /></ProtectedRoute>} />

            <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
          
          {/* IA CONVERSATIONNELLE UNIVERSELLE */}
          <UniversalAIChatbot isFloating={true} />
          
            </AIProvider>
          </NotificationProvider>
        </ComparisonProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
