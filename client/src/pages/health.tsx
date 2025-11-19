import { useQuery } from "@tanstack/react-query";
import { CheckCircle, XCircle, Activity, Link as RouterLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface HealthStatus {
  ok: boolean;
  version?: string;
  uptime?: number;
  timestamp?: string;
}

export default function Health() {
  const { data: health, isLoading } = useQuery<HealthStatus>({
    queryKey: ["/healthz"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">System Health</h1>
          <p className="text-sm text-muted-foreground">
            Monitor the status of TinyLink services
          </p>
        </div>

        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Status
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Current operational status and system information
                  </CardDescription>
                </div>
                <Badge
                  variant={health?.ok ? "default" : "destructive"}
                  className="text-sm"
                  data-testid="badge-health-status"
                >
                  {health?.ok ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Healthy
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Unhealthy
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="flex items-center gap-2">
                    {health?.ok ? (
                      <CheckCircle className="h-5 w-5 text-status-online" />
                    ) : (
                      <XCircle className="h-5 w-5 text-status-busy" />
                    )}
                    <span className="font-medium" data-testid="text-status">
                      {health?.ok ? "Operational" : "Down"}
                    </span>
                  </div>
                </div>

                {health?.version && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">
                      Version
                    </label>
                    <div className="font-mono text-sm" data-testid="text-version">
                      {health.version}
                    </div>
                  </div>
                )}

                {health?.uptime !== undefined && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">
                      Uptime
                    </label>
                    <div className="font-medium" data-testid="text-uptime">
                      {formatUptime(health.uptime)}
                    </div>
                  </div>
                )}

                {health?.timestamp && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Check
                    </label>
                    <div className="text-sm" data-testid="text-timestamp">
                      {new Date(health.timestamp).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    All systems operational
                  </span>
                  <a href="/">
                    <Button variant="outline" size="sm" data-testid="button-dashboard">
                      Go to Dashboard
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}
