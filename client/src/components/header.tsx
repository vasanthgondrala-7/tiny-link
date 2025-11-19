import { Link } from "wouter";
import { Link2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface HealthStatus {
  ok: boolean;
}

export default function Header() {
  const { data: health } = useQuery<HealthStatus>({
    queryKey: ["/healthz"],
    refetchInterval: 60000, // Check every minute
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 hover-elevate px-3 py-2 rounded-md -ml-3" 
            data-testid="link-home"
          >
            <Link2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TinyLink</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-health" asChild>
              <Link href="/healthz">
                <Activity className="h-4 w-4" />
                <Badge
                  variant={health?.ok ? "default" : "destructive"}
                  className="text-xs px-2"
                >
                  {health?.ok ? "Healthy" : "Down"}
                </Badge>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
