
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 border-b bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-accent" />
              <h1 className="text-2xl font-bold honey-text">HoneyBEE</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="text-sm text-muted-foreground">
                Welcome back, Admin
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
