import { useQuery } from "@tanstack/react-query";
import { useParams, Link as RouterLink } from "wouter";
import { ArrowLeft, ExternalLink, Copy, Calendar, MousePointerClick, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Link as LinkData } from "@shared/schema";

export default function Stats() {
  const { code } = useParams<{ code: string }>();
  const { toast } = useToast();

  const { data: link, isLoading, error } = useQuery<LinkData>({
    queryKey: [`/api/links/${code}`],
    enabled: !!code,
  });

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-20 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <RouterLink href="/">
            <Button variant="ghost" className="mb-8" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </RouterLink>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-xl font-semibold mb-2" data-testid="text-not-found">
                Short link not found
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                The short code you're looking for doesn't exist or has been deleted.
              </p>
              <RouterLink href="/">
                <Button data-testid="button-return-dashboard">Return to Dashboard</Button>
              </RouterLink>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const shortUrl = `${window.location.origin}/${link.code}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <RouterLink href="/">
          <Button variant="ghost" className="mb-8" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </RouterLink>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-mono font-bold" data-testid="text-short-code">
              {link.code}
            </h1>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => copyToClipboard(shortUrl, "Short link")}
              data-testid="button-copy-short-url"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-muted-foreground" data-testid="text-target-url">
              {link.targetUrl}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => copyToClipboard(link.targetUrl, "Target URL")}
              data-testid="button-copy-target-url"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <a
              href={link.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                data-testid="button-visit-target"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-clicks">
                {link.clicks}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All-time redirects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Created</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold" data-testid="text-created-date">
                {new Date(link.createdAt).toLocaleDateString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(link.createdAt).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Clicked</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-semibold" data-testid="text-last-clicked">
                {link.lastClicked
                  ? new Date(link.lastClicked).toLocaleDateString()
                  : "Never"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {link.lastClicked
                  ? new Date(link.lastClicked).toLocaleTimeString()
                  : "No clicks yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Link Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Short URL</label>
              <div className="mt-1 flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded-md font-mono text-sm" data-testid="code-short-url">
                  {shortUrl}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(shortUrl, "Short URL")}
                  data-testid="button-copy-short-url-details"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Target URL</label>
              <div className="mt-1 flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded-md font-mono text-sm break-all" data-testid="code-target-url">
                  {link.targetUrl}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(link.targetUrl, "Target URL")}
                  data-testid="button-copy-target-url-details"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
