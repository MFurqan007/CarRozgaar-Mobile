import "../globals.css";
import ProtectedRoute from "@/components/RouteProtection";
import Navbar from "@/components/Navbar";

export default function PortalLayout({ children }) {
  return (
    <div className="w-screen h-screen flex justify-center items-start border-4 border-[yellow]">
      <ProtectedRoute>
        <div className="w-screen flex flex-col gap-4 mt-2">
          <Navbar/>
          {children}
        </div>
      </ProtectedRoute>
    </div>
  );
}
