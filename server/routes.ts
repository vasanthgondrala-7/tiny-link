import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLinkSchema } from "@shared/schema";
import validator from "validator";

const startTime = Date.now();

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/healthz", (_req, res) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    res.status(200).json({
      ok: true,
      version: "1.0",
      uptime,
      timestamp: new Date().toISOString(),
    });
  });

  // Create new short link
  app.post("/api/links", async (req, res) => {
    try {
      // Validate request body
      const result = insertLinkSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: result.error.errors,
        });
      }

      const { targetUrl, code } = result.data;

      // Additional URL validation
      if (!validator.isURL(targetUrl, { require_protocol: true })) {
        return res.status(400).json({
          error: "Invalid URL format",
        });
      }

      // Create link
      const link = await storage.createLink({ targetUrl, code });

      res.status(201).json(link);
    } catch (error: any) {
      if (error.message === "Code already exists") {
        return res.status(409).json({
          error: "This short code is already taken",
        });
      }
      res.status(500).json({
        error: "Failed to create link",
      });
    }
  });

  // Get all links
  app.get("/api/links", async (_req, res) => {
    try {
      const links = await storage.getLinks();
      res.json(links);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch links",
      });
    }
  });

  // Get single link by code
  app.get("/api/links/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const link = await storage.getLinkByCode(code);

      if (!link) {
        return res.status(404).json({
          error: "Link not found",
        });
      }

      res.json(link);
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch link",
      });
    }
  });

  // Delete link
  app.delete("/api/links/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const deleted = await storage.deleteLink(code);

      if (!deleted) {
        return res.status(404).json({
          error: "Link not found",
        });
      }

      res.status(200).json({
        message: "Link deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to delete link",
      });
    }
  });

  // Redirect route - handles short code redirects
  // Must be registered last to avoid catching other routes
  app.get("/:code([A-Za-z0-9]{6,8})", async (req, res, next) => {
    try {
      const { code } = req.params;

      const link = await storage.getLinkByCode(code);

      if (!link) {
        // Return 404 for non-existent short codes
        return res.status(404).send("Short link not found");
      }

      // Increment click count
      await storage.incrementClicks(code);

      // Perform 302 redirect
      res.redirect(302, link.targetUrl);
    } catch (error) {
      // Pass to error handler or return 500
      res.status(500).send("Internal server error");
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
