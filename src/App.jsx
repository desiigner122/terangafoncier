
import React from 'react';
    import { Route, Routes, Outlet, Link } from 'react-router-dom';
    import { Toaster } from '@/components/ui/toaster';
    import ErrorBoundary from '@/components/ErrorBoundary';
    import Header from '@/components/layout/Header';
    import Footer from '@/components/layout/Footer';
    import DashboardLayout from '@/components/layout/DashboardLayout';
    import HomePage from '@/pages/HomePage';
    import LoginPage from '@/pages/LoginPage';
    import RegisterPage from '@/pages/RegisterPage';
    import DashboardPage from '@/pages/DashboardPage';
    import ParcelsListPage from '@/pages/ParcelsListPage';
    import ParcelDetailPage from '@/pages/ParcelDetailPage';
    import ProfilePage from '@/pages/ProfilePage';
    import ContactPage from '@/pages/ContactPage';
    import AboutPage from '@/pages/AboutPage';
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
    import MyListingsPage from '@/pages/MyListingsPage';
    import MyFavoritesPage from '@/pages/MyFavoritesPage';
    import NotificationsPage from '@/pages/NotificationsPage';
    import SavedSearchesPage from '@/pages/SavedSearchesPage';
    import ComparisonPage from '@/pages/ComparisonPage';
    import SecureMessagingPage from '@/pages/SecureMessagingPage';
    import { Button } from '@/components/ui/button';
    import ProtectedRoute, { AdminRoute, VerifiedRoute, RoleProtectedRoute } from '@/components/layout/ProtectedRoute';
    import ScrollToTop from '@/components/layout/ScrollToTop';
    import { motion } from 'framer-motion';
    import { ComparisonProvider } from '@/context/ComparisonContext';
    import './lib/errorManager'; // Import du gestionnaire d'erreurs global
    import './lib/securityConfig'; // Import de la configuration de sécurité
    import FloatingWhatsAppButton from '@/components/layout/FloatingWhatsAppButton';
    import DashboardMunicipalRequestPage from '@/pages/DashboardMunicipalRequestPage';
    import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
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
    import MyLandsPage from '@/pages/dashboards/agriculteur/MyLandsPage';
    import LogbookPage from '@/pages/dashboards/agriculteur/LogbookPage';
    import SoilAnalysisPage from '@/pages/dashboards/agriculteur/SoilAnalysisPage';
    import WeatherPage from '@/pages/dashboards/agriculteur/WeatherPage';
    import EquipmentPage from '@/pages/dashboards/agriculteur/EquipmentPage';
    import FundingRequestsPage from '@/pages/dashboards/banque/FundingRequestsPage';
    import GuaranteesPage from '@/pages/dashboards/banque/GuaranteesPage';
    import LandValuationPage from '@/pages/dashboards/banque/LandValuationPage';
    import CompliancePage from '@/pages/dashboards/banque/CompliancePage';
    import MairieRequestsPage from '@/pages/dashboards/mairie/MairieRequestsPage';
    import LandManagementPage from '@/pages/dashboards/mairie/LandManagementPage';
    import CadastrePage from '@/pages/dashboards/mairie/CadastrePage';
    import DisputesPage from '@/pages/dashboards/mairie/DisputesPage';
    import UrbanPlanPage from '@/pages/dashboards/mairie/UrbanPlanPage';
    import MairieReportsPage from '@/pages/dashboards/mairie/MairieReportsPage';
    import CasesPage from '@/pages/dashboards/notaire/CasesPage';
    import AuthenticationPage from '@/pages/dashboards/notaire/AuthenticationPage';
    import ArchivesPage from '@/pages/dashboards/notaire/ArchivesPage';
    import ComplianceCheckPage from '@/pages/dashboards/notaire/ComplianceCheckPage';
    import { HelmetProvider } from 'react-helmet-async';
    import AgriculteursDashboardPage from '@/pages/solutions/dashboards/AgriculteursDashboardPage';
    import BanquesDashboardPage from '@/pages/solutions/dashboards/BanquesDashboardPage';
    import InvestisseursDashboardPage from '@/pages/solutions/dashboards/InvestisseursDashboardPage';
    import PromoteursDashboardPage from '@/pages/solutions/dashboards/PromoteursDashboardPage';
    import MairiesDashboardPage from '@/pages/solutions/dashboards/MairiesDashboardPage';
    import NotairesDashboardPage from '@/pages/solutions/dashboards/NotairesDashboardPage';
    import PricingPage from '@/pages/PricingPage';
    import GlossaryPage from '@/pages/GlossaryPage';
    import TaxGuidePage from '@/pages/TaxGuidePage';
    import CaseTrackingPage from '@/pages/CaseTrackingPage';
    import DigitalVaultPage from '@/pages/DigitalVaultPage';
    import TransactionsPage from '@/pages/TransactionsPage';
    import VendeurDashboardPage from '@/pages/solutions/dashboards/VendeurDashboardPage';
    import PaymentPage from '@/pages/PaymentPage';
    import VerificationPage from '@/pages/VerificationPage';
    import PendingVerificationPage from '@/pages/PendingVerificationPage';
    import MunicipalLandInfoPage from '@/pages/MunicipalLandInfoPage';
    import AdminUserVerificationsPage from '@/pages/admin/AdminUserVerificationsPage';
    import AddParcelPage from '@/pages/AddParcelPage';
    import AnalyticsPage from '@/pages/AnalyticsPage';
    import MairiePage from '@/pages/MairiePage';
    import RegionInvestmentPage from '@/pages/RegionInvestmentPage';
    import SolutionsAgriculteursPage from '@/pages/solutions/SolutionsAgriculteursPage';


    const PublicLayout = () => (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-20">
          <Outlet />
        </main>
        <Footer />
      </div>
    );

    const NotFoundPage = () => (
       <div className="container mx-auto text-center py-20 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 100 }}>
              <h1 className="text-6xl font-bold text-primary">404</h1>
              <h2 className="text-2xl font-semibold mb-4">Page Non Trouvée</h2>
              <p className="text-muted-foreground mb-8 max-w-md">Désolé, la page que vous recherchez semble s'être égarée dans le cadastre numérique.</p>
              <Button asChild size="lg" className="bg-gradient-to-r from-green-500 to-primary hover:opacity-90 text-white">
                 <Link to="/">Retourner à l'Accueil</Link>
              </Button>
          </motion.div>
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
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="parcelles" element={<ParcelsListPage />} />
                  <Route path="parcelles/:id" element={<ParcelDetailPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="how-it-works" element={<HowItWorksPage />} />
                  <Route path="faq" element={<FaqPage />} />
                  <Route path="partners" element={<PartnersPage />} />
                  <Route path="map" element={<MapPage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="blog/:slug" element={<BlogPostPage />} />
                  <Route path="legal" element={<LegalPage />} />
                  <Route path="privacy" element={<PrivacyPage />} />
                  <Route path="cookie-policy" element={<CookiePolicyPage />} />
                  <Route path="saved-searches" element={<SavedSearchesPage />} />
                  <Route path="compare" element={<ComparisonPage />} />
                  <Route path="solutions/banques" element={<SolutionsBanquesPage />} />
                  <Route path="solutions/promoteurs" element={<SolutionsPromoteursPage />} />
                  <Route path="solutions/investisseurs" element={<SolutionsInvestisseursPage />} />
                  <Route path="solutions/vendeurs" element={<SolutionsVendeursPage />} />
                  <Route path="solutions/agriculteurs" element={<SolutionsAgriculteursPage />} />
                  <Route path="solutions/mairies/apercu" element={<MairiesDashboardPage />} />
                  <Route path="solutions/vendeurs/apercu" element={<VendeurDashboardPage />} />
                  <Route path="solutions/banques/apercu" element={<BanquesDashboardPage />} />
                  <Route path="solutions/investisseurs/apercu" element={<InvestisseursDashboardPage />} />
                  <Route path="solutions/promoteurs/apercu" element={<PromoteursDashboardPage />} />
                  <Route path="solutions/notaires/apercu" element={<NotairesDashboardPage />} />
                  <Route path="solutions/agriculteurs/apercu" element={<AgriculteursDashboardPage />} />
                  <Route path="pricing" element={<PricingPage />} />
                  <Route path="glossary" element={<GlossaryPage />} />
                  <Route path="tax-guide" element={<TaxGuidePage />} />
                  <Route path="demande-terrain-communal" element={<MunicipalLandInfoPage />} />
                  <Route path="mairie/:mairieSlug" element={<MairiePage />} />
                  <Route path="region/:regionSlug" element={<RegionInvestmentPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="verify" element={<VerificationPage />} />
                    <Route path="pending-verification" element={<PendingVerificationPage />} />
                    
                    <Route element={<VerifiedRoute><DashboardLayout /></VerifiedRoute>}>
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="my-requests" element={<MyRequestsPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="transactions" element={<TransactionsPage />} />
                        <Route path="payment/:transactionId" element={<PaymentPage />} />
                        <Route path="favorites" element={<MyFavoritesPage />} />
                        <Route path="notifications" element={<NotificationsPage />} />
                        <Route path="messaging" element={<SecureMessagingPage />} />
                        <Route path="case-tracking/:id" element={<CaseTrackingPage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                        <Route path="digital-vault" element={<RoleProtectedRoute allowedRoles={['Particulier']}><DigitalVaultPage /></RoleProtectedRoute>} />

                        {/* Particulier */}
                        <Route path="request-municipal-land" element={<DashboardMunicipalRequestPage />} />
                        
                        {/* Vendeurs */}
                        <Route path="sell-property" element={<RoleProtectedRoute allowedRoles={['Vendeur Particulier', 'Vendeur Pro', 'Mairie']}><SellPropertyPage /></RoleProtectedRoute>} />
                        <Route path="add-parcel" element={<AddParcelPage />} />
                        <Route path="my-listings" element={<RoleProtectedRoute allowedRoles={['Vendeur Particulier', 'Vendeur Pro']}><MyListingsPage /></RoleProtectedRoute>} />
                        <Route path="solutions/vendeur/dashboard" element={<RoleProtectedRoute allowedRoles={['Vendeur Particulier', 'Vendeur Pro']}><VendeurDashboardPage /></RoleProtectedRoute>} />

                        {/* Investisseur */}
                        <Route path="dashboard/investments" element={<RoleProtectedRoute allowedRoles={['Investisseur']}><InvestmentsPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/market-analysis" element={<RoleProtectedRoute allowedRoles={['Investisseur']}><MarketAnalysisPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/opportunities" element={<RoleProtectedRoute allowedRoles={['Investisseur']}><OpportunitiesPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/roi-calculator" element={<RoleProtectedRoute allowedRoles={['Investisseur']}><RoiCalculatorPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/due-diligence" element={<RoleProtectedRoute allowedRoles={['Investisseur']}><DueDiligencePage /></RoleProtectedRoute>} />
                        <Route path="solutions/investisseurs/dashboard" element={<RoleProtectedRoute allowedRoles={['Investisseur']}><InvestisseursDashboardPage /></RoleProtectedRoute>} />
                        
                        {/* Promoteur */}
                        <Route path="dashboard/projects" element={<RoleProtectedRoute allowedRoles={['Promoteur']}><ProjectsPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/construction-tracking" element={<RoleProtectedRoute allowedRoles={['Promoteur']}><ConstructionTrackingPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/sales" element={<RoleProtectedRoute allowedRoles={['Promoteur']}><SalesPage /></RoleProtectedRoute>} />
                        <Route path="solutions/promoteurs/dashboard" element={<RoleProtectedRoute allowedRoles={['Promoteur']}><PromoteursDashboardPage /></RoleProtectedRoute>} />

                        {/* Agriculteur */}
                        <Route path="dashboard/my-lands" element={<RoleProtectedRoute allowedRoles={['Agriculteur']}><MyLandsPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/logbook" element={<RoleProtectedRoute allowedRoles={['Agriculteur']}><LogbookPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/soil-analysis" element={<RoleProtectedRoute allowedRoles={['Agriculteur']}><SoilAnalysisPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/weather" element={<RoleProtectedRoute allowedRoles={['Agriculteur']}><WeatherPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/equipment" element={<RoleProtectedRoute allowedRoles={['Agriculteur']}><EquipmentPage /></RoleProtectedRoute>} />
                        <Route path="solutions/agriculteurs/dashboard" element={<RoleProtectedRoute allowedRoles={['Agriculteur']}><AgriculteursDashboardPage /></RoleProtectedRoute>} />

                        {/* Banque */}
                        <Route path="dashboard/funding-requests" element={<RoleProtectedRoute allowedRoles={['Banque']}><FundingRequestsPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/guarantees" element={<RoleProtectedRoute allowedRoles={['Banque']}><GuaranteesPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/land-valuation" element={<RoleProtectedRoute allowedRoles={['Banque']}><LandValuationPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/compliance" element={<RoleProtectedRoute allowedRoles={['Banque']}><CompliancePage /></RoleProtectedRoute>} />
                        <Route path="solutions/banques/dashboard" element={<RoleProtectedRoute allowedRoles={['Banque']}><BanquesDashboardPage /></RoleProtectedRoute>} />

                        {/* Mairie */}
                        <Route path="dashboard/mairie-requests" element={<RoleProtectedRoute allowedRoles={['Mairie']}><MairieRequestsPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/land-management" element={<RoleProtectedRoute allowedRoles={['Mairie']}><LandManagementPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/cadastre" element={<RoleProtectedRoute allowedRoles={['Mairie']}><CadastrePage /></RoleProtectedRoute>} />
                        <Route path="dashboard/disputes" element={<RoleProtectedRoute allowedRoles={['Mairie']}><DisputesPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/urban-plan" element={<RoleProtectedRoute allowedRoles={['Mairie']}><UrbanPlanPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/mairie-reports" element={<RoleProtectedRoute allowedRoles={['Mairie']}><MairieReportsPage /></RoleProtectedRoute>} />
                        <Route path="solutions/mairies/dashboard" element={<RoleProtectedRoute allowedRoles={['Mairie']}><MairiesDashboardPage /></RoleProtectedRoute>} />

                        {/* Notaire */}
                        <Route path="dashboard/cases" element={<RoleProtectedRoute allowedRoles={['Notaire']}><CasesPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/authentication" element={<RoleProtectedRoute allowedRoles={['Notaire']}><AuthenticationPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/archives" element={<RoleProtectedRoute allowedRoles={['Notaire']}><ArchivesPage /></RoleProtectedRoute>} />
                        <Route path="dashboard/compliance-check" element={<RoleProtectedRoute allowedRoles={['Notaire']}><ComplianceCheckPage /></RoleProtectedRoute>} />
                        <Route path="solutions/notaires/dashboard" element={<RoleProtectedRoute allowedRoles={['Notaire']}><NotairesDashboardPage /></RoleProtectedRoute>} />
                    </Route>
                </Route>

                <Route path="/admin" element={<AdminRoute><DashboardLayout /></AdminRoute>}>
                     <Route index element={<AdminDashboardPage />} />
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
                     <Route path="*" element={<NotFoundPage />} />
                </Route>

                <Route path="/agent" element={<RoleProtectedRoute allowedRoles={['Agent Foncier']}><DashboardLayout /></RoleProtectedRoute>}>
                     <Route index element={<AgentDashboardPage />} />
                     <Route path="clients" element={<AgentClientsPage />} />
                     <Route path="parcels" element={<AgentParcelsPage />} />
                     <Route path="tasks" element={<AgentTasksPage />} />
                     <Route path="*" element={<NotFoundPage />} />
                </Route>

                 <Route path="*" element={<NotFoundPage />} />

              </Routes>
              <Toaster />
              <FloatingWhatsAppButton />
            </ComparisonProvider>
        </HelmetProvider>
        </ErrorBoundary>
      );
    }

    export default App;
