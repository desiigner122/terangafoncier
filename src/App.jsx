import React from 'react';
import { Route, Routes, Outlet, Link } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AIProvider } from '@/hooks/useAI.jsx';
import GlobalAIAssistant from '@/components/ai/GlobalAIAssistant';
import UniversalAIChatbot from '@/components/ai/UniversalAIChatbot';
import FonctionnalitesAvanceesPage from '@/pages/FonctionnalitesAvanceesPage';
import ModernHeader from '@/components/layout/ModernHeader';
import BlockchainFooter from '@/components/layout/BlockchainFooter';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HomePage from '@/pages/HomePage';
import ModernHomePage from '@/pages/ModernHomePage';
import LoginPage from '@/pages/LoginPage';
import TempLoginPage from '@/pages/TempLoginPage';
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
import AIFeaturesPage from '@/pages/AIFeaturesPage';
import UserProfilePage from '@/pages/profiles/UserProfilePage';
import ModernAboutPage from '@/pages/ModernAboutPage';
import BlockchainAboutPage from '@/pages/BlockchainAboutPage';
import FoncierBlockchainPage from '@/pages/FoncierBlockchainPage';
import FoncierSenegalPage from '@/pages/FoncierSenegalPage';
import TestAccountsPage from '@/pages/TestAccountsPage';
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
import DashboardRedirect from '@/components/DashboardRedirect';
import PurchaseProcessPage from '@/pages/PurchaseProcessPage';
import TestAuthPage from '@/pages/TestAuthPage';

// Pages IA et Analytics
import TerangaAIPage from '@/pages/TerangaAIPage';
import AIAnalyticsDashboard from '@/components/analytics/AIAnalyticsDashboard';

// Pages communes nouvelles
import MessagesPageNew from '@/pages/common/MessagesPage';
import DocumentsPageNew from '@/pages/common/DocumentsPage';
import NotificationsPageNew from '@/pages/common/NotificationsPage';
import CalendarPageNew from '@/pages/common/CalendarPage';
import SettingsPageNew from '@/pages/common/SettingsPageNew';
import MesTerrainsPageNew from '@/pages/common/MesTerrainsPage';
import PurchaseSuccessPage from '@/pages/PurchaseSuccessPage';
import MessagesPage from '@/pages/MessagesPage';
import DocumentsPage from '@/pages/DocumentsPage';
import CRMPage from '@/pages/CRMPage';
import ExportPage from '@/pages/ExportPage';
import UploadsPage from '@/pages/UploadsPage';
import UserProfileTestPage from '@/pages/UserProfileTestPage';
import CityDetailPage from '@/pages/CityDetailPage';
import CommunalLandsPage from '@/pages/CommunalLandsPage';
import TermsPage from '@/pages/TermsPage';
import DataProtectionPage from '@/pages/DataProtectionPage';
import TerrainProgressPage from '@/pages/TerrainProgressPage';
import { Button } from '@/components/ui/button';
import ProtectedRoute, { AdminRoute, VerifiedRoute, RoleProtectedRoute } from '@/components/layout/ProtectedRoute';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { motion } from 'framer-motion';
import { ComparisonProvider } from '@/context/ComparisonContext';
import './lib/errorManager';
import './lib/securityConfig';
import DashboardMunicipalRequestPage from '@/pages/DashboardMunicipalRequestPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import ModernAdminDashboard from '@/pages/admin/ModernAdminDashboard';
import AdminProjectsPage from '@/pages/admin/AdminProjectsPage';
import AdminPricingPage from '@/pages/admin/AdminPricingPage';
import AdminAnalyticsPage from '@/pages/admin/AdminAnalyticsPage';
import GlobalAdminDashboard from '@/pages/admin/GlobalAdminDashboard';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminParcelsPage from '@/pages/admin/AdminParcelsPage';
import AdminSystemRequestsPage from '@/pages/admin/AdminSystemRequestsPage';
import AdminContractsPage from '@/pages/admin/AdminContractsPage';
import AuthDebugPage from '@/pages/AuthDebugPage';
import AuthTestPage from '@/pages/AuthTestPage';
import DashboardSelectorPage from '@/pages/DashboardSelectorPage';
import QuickAccessPage from '@/pages/QuickAccessPage';
import QuickDashboardTest from '@/pages/QuickDashboardTest';

// Import des dashboards
import ParticularDashboard from '@/pages/dashboards/ParticularDashboard';
import NotaireDashboard from '@/pages/dashboards/NotaireDashboard';
import GeometreDashboard from '@/pages/dashboards/GeometreDashboard';
import BanqueDashboard from '@/pages/dashboards/BanqueDashboard';
import PromoteurDashboard from '@/pages/dashboards/PromoteurDashboard';
import MunicipaliteDashboard from '@/pages/dashboards/MunicipaliteDashboard';
import ModernAgentFoncierDashboard from '@/pages/dashboards/ModernAgentFoncierDashboard';
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
import MairieRequestsPage from '@/pages/dashboards/mairie/MairieRequestsPage';
import LandManagementPage from '@/pages/dashboards/mairie/LandManagementPage';
import CadastrePage from '@/pages/dashboards/mairie/CadastrePage';
import DisputesPage from '@/pages/dashboards/mairie/DisputesPage';
import UrbanPlanPage from '@/pages/dashboards/mairie/UrbanPlanPage';
import MairieReportsPage from '@/pages/dashboards/mairie/MairieReportsPage';
import TerrainOversightPage from '@/pages/solutions/dashboards/mairies/TerrainOversightPage';
import TerrainAnalyticsPage from '@/pages/solutions/dashboards/mairies/TerrainAnalyticsPage';
import CasesPage from '@/pages/dashboards/notaire/CasesPage';
import AuthenticationPage from '@/pages/dashboards/notaire/AuthenticationPage';
import ArchivesPage from '@/pages/dashboards/notaire/ArchivesPage';
import ComplianceCheckPage from '@/pages/dashboards/notaire/ComplianceCheckPage';
import ModernBanqueDashboard from '@/pages/dashboards/ModernBanqueDashboard';
import ModernNotaireDashboard from '@/pages/dashboards/ModernNotaireDashboard';
import ModernPromoteurDashboard from '@/pages/dashboards/ModernPromoteurDashboard';
import ModernAcheteurDashboard from '@/pages/dashboards/ModernAcheteurDashboard';
import ModernVendeurDashboard from '@/pages/dashboards/ModernVendeurDashboard';
import ModernInvestisseurDashboard from '@/pages/dashboards/ModernInvestisseurDashboard';
import { HelmetProvider } from 'react-helmet-async';
import BanquesDashboardPage from '@/pages/solutions/dashboards/BanquesDashboardPage';
import InvestisseursDashboardPage from '@/pages/solutions/dashboards/InvestisseursDashboardPage';
import PromoteursDashboardPage from '@/pages/solutions/dashboards/PromoteursDashboardPage';
import MairiesDashboardPage from '@/pages/solutions/dashboards/MairiesDashboardPage';
import AccountCreationTestPage from '@/pages/AccountCreationTestPage';
import NotairesDashboardPage from '@/pages/solutions/dashboards/NotairesDashboardPage';
import AccessDeniedPage from '@/components/AccessDeniedPage';
import SecurityDiagnosticTool from '@/components/SecurityDiagnosticTool';
import NotFoundPage from '@/pages/NotFoundPage';
import PricingPage from '@/pages/PricingPage';
import GlossaryPage from '@/pages/GlossaryPage';
import TaxGuidePage from '@/pages/TaxGuidePage';
import BannedPage from '@/pages/BannedPage';
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
import ModernGeometreDashboard from '@/pages/dashboards/ModernGeometreDashboard';

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
          <AIProvider>
            <ScrollToTop />
            <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<TempLoginPage />} />
              <Route path="test-auth" element={<TestAuthPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="register" element={<MultiStepRegisterPage />} />
              <Route path="reset-password" element={<ResetPasswordPage />} />
              <Route path="test-account-creation" element={<AccountCreationTestPage />} />
              <Route path="debug-dashboard" element={<DebugDashboard />} />
              <Route path="auth-debug" element={<AuthDebugPage />} />
              <Route path="auth-test" element={<AuthTestPage />} />
              <Route path="dashboards" element={<DashboardSelectorPage />} />
              <Route path="quick-test" element={<QuickDashboardTest />} />
              <Route path="quick-access" element={<QuickAccessPage />} />
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
              <Route path="saved-searches" element={<SavedSearchesPage />} />
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
              <Route path="test-accounts" element={<TestAccountsPage />} />
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
                
                <Route element={<VerifiedRoute><DashboardLayout /></VerifiedRoute>}>
                  <Route path="dashboard" element={<DashboardRedirect />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="my-requests" element={<RoleProtectedRoute permission="MY_REQUESTS"><MyRequestsPage /></RoleProtectedRoute>} />
                  <Route path="transactions" element={<TransactionsPage />} />
                  <Route path="payment/:transactionId" element={<PaymentPage />} />
                  <Route path="favorites" element={<RoleProtectedRoute permission="FAVORITES"><MyFavoritesPage /></RoleProtectedRoute>} />
                  <Route path="notifications" element={<NotificationsPageNew />} />
                  <Route path="messages" element={<MessagesPageNew />} />
                  <Route path="documents" element={<DocumentsPageNew />} />
                  <Route path="rendez-vous" element={<CalendarPageNew />} />
                  <Route path="calendar" element={<CalendarPageNew />} />
                  <Route path="settings" element={<SettingsPageNew />} />
                  <Route path="mes-terrains" element={<MesTerrainsPageNew />} />
                  <Route path="my-properties" element={<MesTerrainsPageNew />} />
                  <Route path="crm" element={<CRMPage />} />
                  <Route path="export" element={<ExportPage />} />
                  <Route path="uploads" element={<UploadsPage />} />
                  <Route path="user-test" element={<UserProfileTestPage />} />
                  <Route path="messaging" element={<SecureMessagingPage />} />
                  <Route path="case-tracking/:id" element={<CaseTrackingPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="digital-vault" element={<RoleProtectedRoute permission="DIGITAL_VAULT"><DigitalVaultPage /></RoleProtectedRoute>} />
                  <Route path="request-municipal-land" element={<RoleProtectedRoute permission="REQUEST_MUNICIPAL_LAND"><DashboardMunicipalRequestPage /></RoleProtectedRoute>} />
                  <Route path="vendor-verification" element={<RoleProtectedRoute permission="VENDOR_VERIFICATION"><VendorVerificationPage /></RoleProtectedRoute>} />
                  <Route path="sell-property" element={<RoleProtectedRoute permission="SELL_PROPERTY"><SellPropertyPage /></RoleProtectedRoute>} />
                  <Route path="add-parcel" element={<RoleProtectedRoute permission="ADD_PARCEL"><AddParcelPage /></RoleProtectedRoute>} />
                  <Route path="my-listings" element={<RoleProtectedRoute permission="MY_LISTINGS"><MyListingsPage /></RoleProtectedRoute>} />
                  
                  {/* Routes Promoteur */}
                  <Route path="promoteur/nouveaux-acheteurs" element={<RoleProtectedRoute permission="PROMOTEUR_DASHBOARD"><PromoterNewBuyersPage /></RoleProtectedRoute>} />
                  <Route path="promoteur/nouveau-devis" element={<RoleProtectedRoute permission="PROMOTEUR_DASHBOARD"><PromoterNewQuotePage /></RoleProtectedRoute>} />
                  
                  {/* Dashboards modernes par rôle */}
                  <Route path="acheteur" element={<RoleProtectedRoute allowedRoles={['Acheteur']}><ModernAcheteurDashboard /></RoleProtectedRoute>} />
                  <Route path="vendeur" element={<RoleProtectedRoute allowedRoles={['Vendeur']}><ModernVendeurDashboard /></RoleProtectedRoute>} />
                  <Route path="promoteur" element={<RoleProtectedRoute allowedRoles={['Promoteur']}><ModernPromoteurDashboard /></RoleProtectedRoute>} />
                  <Route path="banque" element={<RoleProtectedRoute allowedRoles={['Banque']}><ModernBanqueDashboard /></RoleProtectedRoute>} />
                  <Route path="investisseur" element={<RoleProtectedRoute allowedRoles={['Investisseur']}><ModernInvestisseurDashboard /></RoleProtectedRoute>} />
                  <Route path="mairie" element={<RoleProtectedRoute allowedRoles={['Mairie']}><ModernMairieDashboard /></RoleProtectedRoute>} />
                  <Route path="notaire" element={<RoleProtectedRoute allowedRoles={['Notaire']}><ModernNotaireDashboard /></RoleProtectedRoute>} />
                  <Route path="geometre" element={<RoleProtectedRoute allowedRoles={['Géomètre']}><ModernGeometreDashboard /></RoleProtectedRoute>} />
                  
                  {/* Routes solutions vers dashboards */}
                  <Route path="solutions/banques/dashboard" element={<RoleProtectedRoute allowedRoles={['Banque']}><ModernBanqueDashboard /></RoleProtectedRoute>} />
                  <Route path="solutions/notaires/dashboard" element={<RoleProtectedRoute allowedRoles={['Notaire']}><ModernNotaireDashboard /></RoleProtectedRoute>} />
                  <Route path="solutions/promoteurs/dashboard" element={<RoleProtectedRoute allowedRoles={['Promoteur']}><ModernPromoteurDashboard /></RoleProtectedRoute>} />
                  <Route path="solutions/mairies/dashboard" element={<RoleProtectedRoute allowedRoles={['Mairie']}><ModernMairieDashboard /></RoleProtectedRoute>} />
                  <Route path="agent-foncier" element={<RoleProtectedRoute allowedRoles={['Agent Foncier']}><ModernAgentFoncierDashboard /></RoleProtectedRoute>} />
                </Route>
              </Route>
            </Route>

            <Route path="/admin" element={<AdminRoute><DashboardLayout /></AdminRoute>}>
              <Route index element={<ModernAdminDashboard />} />
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

            {/* Routes pour tous les dashboards */}
            <Route path="/particulier" element={<ProtectedRoute><ParticularDashboard /></ProtectedRoute>} />
            <Route path="/agent-foncier" element={<ProtectedRoute><ModernAgentFoncierDashboard /></ProtectedRoute>} />
            <Route path="/notaire" element={<ProtectedRoute><NotaireDashboard /></ProtectedRoute>} />
            <Route path="/geometre" element={<ProtectedRoute><GeometreDashboard /></ProtectedRoute>} />
            <Route path="/banque" element={<ProtectedRoute><BanqueDashboard /></ProtectedRoute>} />
            <Route path="/promoteur" element={<ProtectedRoute><PromoteurDashboard /></ProtectedRoute>} />
            <Route path="/lotisseur" element={<ProtectedRoute><PromoteurDashboard /></ProtectedRoute>} />
            <Route path="/mairie" element={<ProtectedRoute><ModernMairieDashboard /></ProtectedRoute>} />
            <Route path="/municipalite" element={<ProtectedRoute><MunicipaliteDashboard /></ProtectedRoute>} />

            <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
          
          {/* IA CONVERSATIONNELLE UNIVERSELLE */}
          <UniversalAIChatbot isFloating={true} />
          
          </AIProvider>
        </ComparisonProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
