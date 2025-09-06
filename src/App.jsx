import React from 'react';
import { Route, Routes, Outlet, Link } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DashboardLayout from '@/components/layout/DashboardLayout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import ModernLoginPage from '@/pages/ModernLoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ModernRegisterPage from '@/pages/ModernRegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import ParcelsListPage from '@/pages/ParcelsListPage';
import ParcelDetailPage from '@/pages/ParcelDetailPage';
import IntelligentParcelPage from '@/pages/IntelligentParcelPage';
import ProfilePage from '@/pages/ProfilePage';
import ContactPage from '@/pages/ContactPage';
import AboutPage from '@/pages/AboutPage';
import ModernAboutPage from '@/pages/ModernAboutPage';
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
import SellPropertyPage from '@/pages/SellPropertyPage';
import DiasporaGuidePage from '@/pages/DiasporaGuidePage';
import ConstructionDistancePage from '@/pages/solutions/ConstructionDistancePage';
import DiasporaInvestmentPage from '@/pages/solutions/DiasporaInvestmentPage';
import ProjectMonitoringPage from '@/pages/solutions/ProjectMonitoringPage';
import MyListingsPage from '@/pages/MyListingsPage';
import MyFavoritesPage from '@/pages/MyFavoritesPage';
import NotificationsPage from '@/pages/NotificationsPage';
import SavedSearchesPage from '@/pages/SavedSearchesPage';
import ComparisonPage from '@/pages/ComparisonPage';
import SecureMessagingPage from '@/pages/SecureMessagingPage';
import SimpleDashboard from '@/pages/SimpleDashboard';
import CityDetailPage from '@/pages/CityDetailPage';
import { Button } from '@/components/ui/button';
import ProtectedRoute, { AdminRoute, VerifiedRoute, RoleProtectedRoute } from '@/components/layout/ProtectedRoute';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { motion } from 'framer-motion';
import { ComparisonProvider } from '@/context/ComparisonContext';
import './lib/errorManager';
import './lib/securityConfig';
import DashboardMunicipalRequestPage from '@/pages/DashboardMunicipalRequestPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminProjectsPage from '@/pages/admin/AdminProjectsPage';
import AdminPricingPage from '@/pages/admin/AdminPricingPage';
import AdminAnalyticsPage from '@/pages/admin/AdminAnalyticsPage';
import GlobalAdminDashboard from '@/pages/admin/GlobalAdminDashboard';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminParcelsPage from '@/pages/admin/AdminParcelsPage';
import AdminSystemRequestsPage from '@/pages/admin/AdminSystemRequestsPage';
import AdminContractsPage from '@/pages/admin/AdminContractsPage';
import AdminReportsPage from '@/pages/admin/AdminReportsPage';
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
import SolutionsPromoteursPage from '@/pages/solutions/SolutionsPromoteursPage';
import SolutionsInvestisseursPage from '@/pages/solutions/SolutionsInvestisseursPage';
import SolutionsVendeursPage from '@/pages/solutions/SolutionsVendeursPage';
import InvestmentsPage from '@/pages/dashboards/investisseur/InvestmentsPage';
import MarketAnalysisPage from '@/pages/dashboards/investisseur/MarketAnalysisPage';
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
import GeometresPage from '@/pages/GeometresPage';
import AgentsFonciersPage from '@/pages/AgentsFonciersPage';
import VendeursPage from '@/pages/VendeursPage';
import PromoteursPage from '@/pages/PromoteursPage';
import RejoignezNousPage from '@/pages/RejoignezNousPage';
import SolutionsPage from '@/pages/SolutionsPage';
import TerrangaFoncierChatbot from '@/components/ai/TerrangaFoncierChatbot';

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1 pt-20">
      <Outlet />
    </main>
    <Footer />
    <TerrangaFoncierChatbot />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ComparisonProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<ModernLoginPage />} />
              <Route path="register" element={<ModernRegisterPage />} />
              <Route path="test-account-creation" element={<AccountCreationTestPage />} />
              <Route path="banned" element={<BannedPage />} />
              <Route path="parcelles" element={<ParcelsListPage />} />
              <Route path="parcelles/:id" element={<ParcelDetailPage />} />
              <Route path="terrain-intelligent/:id" element={<IntelligentParcelPage />} />
              <Route path="villes/:cityId" element={<CityDetailPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="about" element={<ModernAboutPage />} />
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
              <Route path="guide-diaspora" element={<DiasporaGuidePage />} />
              <Route path="map" element={<MapPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogPostPage />} />
              <Route path="legal" element={<LegalPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="cookie-policy" element={<CookiePolicyPage />} />
              <Route path="saved-searches" element={<SavedSearchesPage />} />
              <Route path="compare" element={<ComparisonPage />} />
              <Route path="solutions" element={<SolutionsPage />} />
              <Route path="solutions/banques" element={<SolutionsBanquesPage />} />
              <Route path="solutions/promoteurs" element={<SolutionsPromoteursPage />} />
              <Route path="solutions/investisseurs" element={<SolutionsInvestisseursPage />} />
              <Route path="solutions/vendeurs" element={<SolutionsVendeursPage />} />
              <Route path="solutions/agriculteurs" element={<SolutionsAgriculteursPage />} />
              <Route path="solutions/construction-distance" element={<ConstructionDistancePage />} />
              <Route path="solutions/diaspora-investment" element={<DiasporaInvestmentPage />} />
              <Route path="solutions/project-monitoring" element={<ProjectMonitoringPage />} />
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
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="my-requests" element={<RoleProtectedRoute permission="MY_REQUESTS"><MyRequestsPage /></RoleProtectedRoute>} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="transactions" element={<TransactionsPage />} />
                  <Route path="payment/:transactionId" element={<PaymentPage />} />
                  <Route path="favorites" element={<RoleProtectedRoute permission="FAVORITES"><MyFavoritesPage /></RoleProtectedRoute>} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="messaging" element={<SecureMessagingPage />} />
                  <Route path="case-tracking/:id" element={<CaseTrackingPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="digital-vault" element={<RoleProtectedRoute permission="DIGITAL_VAULT"><DigitalVaultPage /></RoleProtectedRoute>} />
                  <Route path="request-municipal-land" element={<RoleProtectedRoute permission="REQUEST_MUNICIPAL_LAND"><DashboardMunicipalRequestPage /></RoleProtectedRoute>} />
                  <Route path="vendor-verification" element={<RoleProtectedRoute permission="VENDOR_VERIFICATION"><VendorVerificationPage /></RoleProtectedRoute>} />
                  <Route path="sell-property" element={<RoleProtectedRoute permission="SELL_PROPERTY"><SellPropertyPage /></RoleProtectedRoute>} />
                  <Route path="add-parcel" element={<RoleProtectedRoute permission="ADD_PARCEL"><AddParcelPage /></RoleProtectedRoute>} />
                  <Route path="my-listings" element={<RoleProtectedRoute permission="MY_LISTINGS"><MyListingsPage /></RoleProtectedRoute>} />
                </Route>
              </Route>
            </Route>

            <Route path="/admin" element={<AdminRoute><DashboardLayout /></AdminRoute>}>
              <Route index element={<AdminDashboardPage />} />
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

            <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </ComparisonProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
