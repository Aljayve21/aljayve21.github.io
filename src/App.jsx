
import { Crown, Heart, Loader2, RefreshCw } from "lucide-react";
import { Routes, Route, useNavigate } from "react-router-dom";

import FloatingHearts from "./components/FloatingHearts";
import InvitationHero from "./components/InvitationHero";
import PrincessEnvelope from "./components/PrincessEnvelope";
import ChristeningDetails from "./components/ChristeningDetails";
import BabyGallery from "./components/BabyGallery";
import RSVPSection from "./components/RSVPSection";

import AdminPage from "./pages/AdminPage";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";

import {
  InvitationProvider,
  useInvitation,
} from "./contexts/InvitationContext";

function InvitationLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-[#fff7fa] via-[#ffe5ef] to-[#fbd1e2] px-4 text-center">
      <Crown
        size={48}
        className="mb-5 text-gold"
        strokeWidth={1.4}
      />

      <Loader2
        size={32}
        className="animate-spin text-pink-500"
      />

      <h1
        className="mt-6 text-5xl text-[#d46b9c]"
        style={{
          fontFamily: "'Great Vibes', cursive",
        }}
      >
        Aezrael Cate
      </h1>

      <p role="status" className="mt-3 text-sm text-[#a86c80]">
        Preparing your special invitation...
      </p>
    </main>
  );
}

function InvitationError({ message, onRetry }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#fff7fa] via-[#ffe5ef] to-[#fbd1e2] px-4 py-12">
      <div className="w-full max-w-md rounded-4xl border border-white bg-white/85 p-8 text-center shadow-xl shadow-pink-200/40">
        <Crown
          size={48}
          strokeWidth={1.4}
          className="mx-auto text-gold"
        />

        <Heart
          size={25}
          className="mx-auto mt-5 text-pink-400"
        />

        <h1
          className="mt-5 text-5xl text-[#d46b9c]"
          style={{
            fontFamily: "'Great Vibes', cursive",
          }}
        >
          Aezrael Cate
        </h1>

        <h2 className="mt-5 text-lg font-semibold text-[#a86c80]">
          Invitation Unavailable
        </h2>

        <p
          role="alert"
          className="mt-3 text-sm leading-7 text-gray-500"
        >
          {message}
        </p>

        <p className="mt-3 text-xs leading-6 text-gray-400">
          Please check your invitation link or request
          a new personalized link from Aezrael Cate's parents.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mx-auto mt-7 flex items-center justify-center gap-2 rounded-full bg-pink-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-pink-200"
        >
          <RefreshCw size={17} />
          Try Again
        </button>
      </div>
    </main>
  );
}

function PublicInvitation() {
  const {
    guest,
    loading,
    error,
    retry,
  } = useInvitation();

  if (loading) {
    return <InvitationLoading />;
  }

  if (error || !guest) {
    return (
      <InvitationError
        message={error || "Invitation could not be verified."}
        onRetry={retry}
      />
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#fff7fa] via-[#ffe5ef] to-[#fbd1e2]">
      <FloatingHearts />

      <InvitationHero />
      <PrincessEnvelope />
      <ChristeningDetails />
      <BabyGallery />
      <RSVPSection />

      <footer className="relative z-10 border-t border-white/60 bg-white/30 px-4 py-10 text-center">
        <p
          className="text-4xl text-[#d46b9c]"
          style={{
            fontFamily: "'Great Vibes', cursive",
          }}
        >
          Aezrael Cate
        </p>

        <p className="mt-3 text-xs tracking-widest text-[#a86c80]">
          MADE WITH LOVE · DECEMBER 2026
        </p>
      </footer>
    </main>
  );
}

function InvitationPage() {
  return (
    <InvitationProvider>
      <PublicInvitation />
    </InvitationProvider>
  );
}

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <InvitationError
      message="The page you requested could not be found."
      onRetry={() => navigate("/")}
    />
  );
}

export default function App() {
  return (
    <Routes>
      {/* Protected admin dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminPage />
          </ProtectedAdminRoute>
        }
      />

      {/* Public personalized invitation */}
      <Route
        path="/"
        element={<InvitationPage />}
      />

      {/* Unknown routes */}
      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
}
