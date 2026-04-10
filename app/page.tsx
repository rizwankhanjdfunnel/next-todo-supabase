import TodoList from "@/components/todo-list";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LayoutDashboard, Music, Settings, User } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f13] text-foreground flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white/5 border-r border-white/5 hidden md:flex flex-col p-6 backdrop-blur-3xl relative">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 rounded-xl shadow-lg shadow-purple-500/20">
            <Music className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-wider text-white"> Steinway</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-all font-medium">
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          {/* <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white hover:text-foreground transition-all">
            <Music size={20} />
            My Instruments
          </a>
          <a href="#" className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-foreground/60 hover:text-foreground transition-all">
            <Settings size={20} />
            Settings
          </a> */}
        </nav>

        <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-black/20 border border-white/5 mt-auto">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center border-2 border-white/20">
            <User size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Rizwan Khan</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        {/* Background Ambient Glows */}
        <div className="fixed top-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />
        
        {/* Topbar */}
        <header className="w-full flex justify-between items-center p-8 sticky top-0 z-20 bg-[#0f0f13]/80 backdrop-blur-xl border-b border-white/5">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome back! 👋</h2>
            <p className="text-foreground/50 mt-1">Manage your music instruments and inventory.</p>
          </div>
          <div className="flex items-center gap-4">
             <ThemeSwitcher />
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-8 z-10 w-full max-w-7xl mx-auto flex flex-col xl:flex-row gap-8">
          
          {/* Main List Section */}
          <div className="flex-1">
            <TodoList />
          </div>

          {/* Stats / Overview Section */}
          <div className="w-full xl:w-96 flex flex-col gap-6">
            <div className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-lg">
              <h3 className="text-foreground/60 text-sm font-medium mb-4 uppercase tracking-widest">Inventory Status</h3>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-5xl font-black text-white">100%</span>
                <span className="text-green-500 text-sm font-bold pb-2">+12% this week</span>
              </div>
              <p className="text-foreground/40 text-sm leading-relaxed">
                All your instruments are fully synced with the Supabase database. Real-time operations are active.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-purple-500/30 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/30 blur-3xl transform group-hover:scale-150 transition-transform duration-700" />
              <h3 className="text-purple-300 text-sm font-medium mb-3 relative z-10">Pro Tip</h3>
              <p className="text-white font-medium text-lg relative z-10">
                You can add any type of instrument. The UI updates instantly using Optimistic UI principles!
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
