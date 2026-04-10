import TodoList from "@/components/todo-list";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/30 relative overflow-hidden flex flex-col items-center">
      {/* Beautiful Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-[100%] bg-purple-500/20 dark:bg-purple-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-[100%] bg-indigo-500/20 dark:bg-indigo-500/10 blur-[150px] pointer-events-none" />
      
      <nav className="w-full flex justify-end p-6 relative z-10">
        <ThemeSwitcher />
      </nav>

      <div className="flex-1 w-full max-w-5xl px-5 flex flex-col justify-center relative z-10 pb-20">
         <TodoList />
      </div>
    </main>
  );
}
