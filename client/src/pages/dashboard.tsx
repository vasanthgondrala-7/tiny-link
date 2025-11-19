import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Plus, Copy, Trash2, ExternalLink, Link2, TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertLinkSchema, type InsertLink, type Link as LinkData } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: links, isLoading } = useQuery<LinkData[]>({
    queryKey: ["/api/links"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertLink) => {
      return apiRequest("POST", "/api/links", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      setIsDialogOpen(false);
      toast({
        title: "Link created successfully",
        description: "Your short link is ready to use.",
      });
    },
    onError: (error: any) => {
      const message = error.message || "Failed to create link";
      toast({
        title: "Error",
        description: message.includes("409") 
          ? "This short code is already taken. Please choose a different one."
          : message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (code: string) => {
      return apiRequest("DELETE", `/api/links/${code}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({
        title: "Link deleted",
        description: "The short link has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      });
    },
  });

  const form = useForm<InsertLink>({
    resolver: zodResolver(insertLinkSchema),
    defaultValues: {
      targetUrl: "",
      code: "",
    },
  });

  const onSubmit = (data: InsertLink) => {
    const submitData = {
      targetUrl: data.targetUrl,
      ...(data.code && { code: data.code }),
    };
    createMutation.mutate(submitData);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const filteredLinks = links?.filter(
    (link) =>
      link.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.targetUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalClicks = links?.reduce((sum, link) => sum + link.clicks, 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your shortened links and track analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Links</CardTitle>
              <Link2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-links">
                {isLoading ? <Skeleton className="h-9 w-16" /> : links?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active short links
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-total-clicks">
                {isLoading ? <Skeleton className="h-9 w-16" /> : totalClicks}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all links
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by code or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-link">
                <Plus className="h-4 w-4 mr-2" />
                Create Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Short Link</DialogTitle>
                <DialogDescription>
                  Enter a long URL and optionally customize the short code.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="targetUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/very-long-url"
                            {...field}
                            data-testid="input-target-url"
                          />
                        </FormControl>
                        <FormDescription>
                          The long URL you want to shorten
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Short Code (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="mylink"
                            {...field}
                            data-testid="input-custom-code"
                          />
                        </FormControl>
                        <FormDescription>
                          6-8 alphanumeric characters. Leave blank for auto-generated code.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      data-testid="button-submit"
                    >
                      {createMutation.isPending ? "Creating..." : "Create Link"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Links Table */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : !filteredLinks || filteredLinks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Link2 className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2" data-testid="text-empty-state">
                {searchQuery ? "No links found" : "No links yet"}
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first short link to get started"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsDialogOpen(true)} data-testid="button-create-first-link">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Link
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm font-medium uppercase tracking-wide">
                      Short Code
                    </TableHead>
                    <TableHead className="text-sm font-medium uppercase tracking-wide">
                      Target URL
                    </TableHead>
                    <TableHead className="text-sm font-medium uppercase tracking-wide text-right">
                      Clicks
                    </TableHead>
                    <TableHead className="text-sm font-medium uppercase tracking-wide">
                      Last Clicked
                    </TableHead>
                    <TableHead className="text-sm font-medium uppercase tracking-wide text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map((link) => (
                    <TableRow key={link.id} className="hover-elevate" data-testid={`row-link-${link.code}`}>
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Link href={`/code/${link.code}`} className="hover:text-primary" data-testid={`link-stats-${link.code}`}>
                            {link.code}
                          </Link>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() =>
                              copyToClipboard(
                                `${window.location.origin}/${link.code}`,
                                "Short link"
                              )
                            }
                            data-testid={`button-copy-code-${link.code}`}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 max-w-md">
                          <span className="truncate font-mono text-sm" title={link.targetUrl} data-testid={`text-target-url-${link.code}`}>
                            {link.targetUrl}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={() => copyToClipboard(link.targetUrl, "URL")}
                            data-testid={`button-copy-url-${link.code}`}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <a
                            href={link.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0"
                          >
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              data-testid={`button-visit-${link.code}`}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium" data-testid={`text-clicks-${link.code}`}>
                        {link.clicks}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground" data-testid={`text-last-clicked-${link.code}`}>
                        {link.lastClicked
                          ? new Date(link.lastClicked).toLocaleString()
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate(link.code)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-${link.code}`}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
