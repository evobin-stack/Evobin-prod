// import { useState, useEffect } from "react";
// import { Navbar } from "./components/Navbar";
// import { Footer } from "./components/Footer";
// import { Breadcrumb } from "./components/Breadcrumb";
// import { OnboardingWizard } from "./components/OnboardingWizard";
// import { LandingPage } from "./components/pages/LandingPage";
// import { LoginPage } from "./components/pages/LoginPage";
// import { DashboardPage } from "./components/pages/DashboardPage";
// import { UploadPage } from "./components/pages/UploadPage";
// import { MapPage } from "./components/pages/MapPage";
// import { LeaderboardPage } from "./components/pages/LeaderboardPage";
// import { AdminPage } from "./components/pages/AdminPage";
// import { ProfilePage } from "./components/pages/ProfilePage";
// import { EducationPage } from "./components/pages/EducationPage";
// import { CommunityPage } from "./components/pages/CommunityPage";
// import { AnalyticsPage } from "./components/pages/AnalyticsPage";
// import { RewardsPage } from "./components/pages/RewardsPage";
// import { EventsPage } from "./components/pages/EventsPage";
// import { NotificationsPage } from "./components/pages/NotificationsPage";
// import { AuthProvider, useAuth } from "./contexts/AuthContext";
// import { LanguageProvider } from "./contexts/LanguageContext";
// import { RealtimeProvider } from "./contexts/RealtimeContext";
// import { ProtectedRoute } from "./components/ProtectedRoute";
// import { Toaster } from "./components/ui/sonner";
// import { RealtimeUpdatesListener } from "./components/RealtimeUpdatesListener";
// import { pageMetadata } from "./config/navigation";

// function AppContent() {
//   const [currentPage, setCurrentPage] = useState<string>("landing");
//   const [showOnboarding, setShowOnboarding] = useState(false);
//   const { user, isAuthenticated } = useAuth();

//   // Check if user is new and should see onboarding
//   useEffect(() => {
//     if (isAuthenticated && user) {
//       const hasSeenOnboarding = localStorage.getItem(`onboarding_${user.id}`);
//       if (!hasSeenOnboarding && currentPage === 'dashboard') {
//         setShowOnboarding(true);
//       }
//     }
//   }, [isAuthenticated, user, currentPage]);

//   const handleCloseOnboarding = () => {
//     setShowOnboarding(false);
//     if (user) {
//       localStorage.setItem(`onboarding_${user.id}`, 'true');
//     }
//   };

//   // Update page title based on current page
//   useEffect(() => {
//     const metadata = pageMetadata[currentPage];
//     if (metadata) {
//       document.title = metadata.title;
//     }
//   }, [currentPage]);

//   const handleNavigate = (page: string) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const renderPage = () => {
//     switch (currentPage) {
//       case "landing":
//         return <LandingPage onNavigate={handleNavigate} />;
//       case "login":
//         return <LoginPage onNavigate={handleNavigate} />;
//       case "dashboard":
//         return (
//           <ProtectedRoute>
//             <DashboardPage />
//           </ProtectedRoute>
//         );
//       case "upload":
//         return (
//           <ProtectedRoute>
//             <UploadPage />
//           </ProtectedRoute>
//         );
//       case "map":
//         return (
//           <ProtectedRoute>
//             <MapPage />
//           </ProtectedRoute>
//         );
//       case "leaderboard":
//         return (
//           <ProtectedRoute>
//             <LeaderboardPage />
//           </ProtectedRoute>
//         );
//       case "admin":
//         return (
//           <ProtectedRoute allowedRoles={['admin']}>
//             <AdminPage />
//           </ProtectedRoute>
//         );
//       case "profile":
//         return (
//           <ProtectedRoute>
//             <ProfilePage />
//           </ProtectedRoute>
//         );
//       case "education":
//         return (
//           <ProtectedRoute>
//             <EducationPage />
//           </ProtectedRoute>
//         );
//       case "community":
//         return (
//           <ProtectedRoute>
//             <CommunityPage />
//           </ProtectedRoute>
//         );
//       case "analytics":
//         return (
//           <ProtectedRoute>
//             <AnalyticsPage />
//           </ProtectedRoute>
//         );
//       case "rewards":
//         return (
//           <ProtectedRoute>
//             <RewardsPage />
//           </ProtectedRoute>
//         );
//       case "events":
//         return <EventsPage />;
//       case "notifications":
//         return (
//           <ProtectedRoute>
//             <NotificationsPage />
//           </ProtectedRoute>
//         );
//       default:
//         return <LandingPage onNavigate={handleNavigate} />;
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
//       <main className="flex-1">
//         {/* Breadcrumb Navigation */}
//         {currentPage !== 'landing' && currentPage !== 'login' && (
//           <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
//             <Breadcrumb currentPage={currentPage} onNavigate={handleNavigate} />
//           </div>
//         )}
//         {renderPage()}
//       </main>
//       <Footer />
//       <Toaster />
      
//       {/* Real-time Updates Listener */}
//       {isAuthenticated && <RealtimeUpdatesListener />}
      
//       {/* Onboarding Wizard */}
//       <OnboardingWizard 
//         open={showOnboarding}
//         onClose={handleCloseOnboarding}
//         onNavigate={handleNavigate}
//       />
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <LanguageProvider>
//       <AuthProvider>
//         <RealtimeProvider>
//           <AppContent />
//         </RealtimeProvider>
//       </AuthProvider>
//     </LanguageProvider>
//   );
// }
import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Breadcrumb } from "./components/Breadcrumb";
import { OnboardingWizard } from "./components/OnboardingWizard";
import { LandingPage } from "./components/pages/LandingPage";
import { LoginPage } from "./components/pages/LoginPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { UploadPage } from "./components/pages/UploadPage";
import { MapPage } from "./components/pages/MapPage";
import { LeaderboardPage } from "./components/pages/LeaderboardPage";
import { AdminPage } from "./components/pages/AdminPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { EducationPage } from "./components/pages/EducationPage";
import { CommunityPage } from "./components/pages/CommunityPage";
import { AnalyticsPage } from "./components/pages/AnalyticsPage";
import { RewardsPage } from "./components/pages/RewardsPage";
import { EventsPage } from "./components/pages/EventsPage";
import { NotificationsPage } from "./components/pages/NotificationsPage";
import { AboutPage } from "./components/pages/AboutPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { RealtimeProvider } from "./contexts/RealtimeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";
import { RealtimeUpdatesListener } from "./components/RealtimeUpdatesListener";
import { pageMetadata } from "./config/navigation";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const hasSeenOnboarding = localStorage.getItem(`onboarding_${user.id}`);
      if (!hasSeenOnboarding && currentPage === 'dashboard') {
        setShowOnboarding(true);
      }
    }
  }, [isAuthenticated, user, currentPage]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    if (user) {
      localStorage.setItem(`onboarding_${user.id}`, 'true');
    }
  };

  useEffect(() => {
    const metadata = pageMetadata[currentPage];
    if (metadata) {
      document.title = metadata.title;
    }
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing": return <LandingPage onNavigate={handleNavigate} />;
      case "login": return <LoginPage onNavigate={handleNavigate} />;
      case "dashboard": return <ProtectedRoute><DashboardPage /></ProtectedRoute>;
      case "upload": return <ProtectedRoute><UploadPage /></ProtectedRoute>;
      case "map": return <ProtectedRoute><MapPage /></ProtectedRoute>;
      case "leaderboard": return <ProtectedRoute><LeaderboardPage /></ProtectedRoute>;
      case "admin": return <ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>;
      case "profile": return <ProtectedRoute><ProfilePage /></ProtectedRoute>;
      case "education": return <ProtectedRoute><EducationPage /></ProtectedRoute>;
      case "community": return <ProtectedRoute><CommunityPage /></ProtectedRoute>;
      case "analytics": return <ProtectedRoute><AnalyticsPage /></ProtectedRoute>;
      case "rewards": return <ProtectedRoute><RewardsPage /></ProtectedRoute>;
      case "events": return <EventsPage />;
      case "notifications": return <ProtectedRoute><NotificationsPage /></ProtectedRoute>;
      case "about": return <AboutPage onNavigate={handleNavigate} />;
      default: return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      <main className="flex-1">
        {currentPage !== 'landing' && currentPage !== 'login' && (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <Breadcrumb currentPage={currentPage} onNavigate={handleNavigate} />
          </div>
        )}
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
      <Toaster />
      {isAuthenticated && <RealtimeUpdatesListener />}
      <OnboardingWizard 
        open={showOnboarding}
        onClose={handleCloseOnboarding}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RealtimeProvider>
          <AppContent />
        </RealtimeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
