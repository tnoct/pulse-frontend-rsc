import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import { TopNav } from "./components/layout/TopNav";
import { Dashboard } from "./pages/Dashboard";
import type { ViewMode } from "./components/ui/ViewToggle";

function DashboardLayout() {
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <TopNav viewMode={viewMode} onViewChange={setViewMode} />
                <Dashboard viewMode={viewMode} />
            </div>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DashboardLayout />} />
            </Routes>
        </BrowserRouter>
    );
}
