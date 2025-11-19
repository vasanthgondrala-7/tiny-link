import { type Link, type InsertLink } from "@shared/schema";
import { customAlphabet } from "nanoid";

// Generate short codes using alphanumeric characters (A-Za-z0-9)
const generateCode = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  7
);

export interface IStorage {
  createLink(link: InsertLink): Promise<Link>;
  getLinks(): Promise<Link[]>;
  getLinkByCode(code: string): Promise<Link | undefined>;
  deleteLink(code: string): Promise<boolean>;
  incrementClicks(code: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private links: Map<string, Link>;

  constructor() {
    this.links = new Map();
  }

  async createLink(insertLink: InsertLink): Promise<Link> {
    // Generate code if not provided
    const code = insertLink.code || generateCode();

    // Check if code already exists
    if (this.links.has(code)) {
      throw new Error("Code already exists");
    }

    const link: Link = {
      id: crypto.randomUUID(),
      code,
      targetUrl: insertLink.targetUrl,
      clicks: 0,
      lastClicked: null,
      createdAt: new Date(),
    };

    this.links.set(code, link);
    return link;
  }

  async getLinks(): Promise<Link[]> {
    return Array.from(this.links.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getLinkByCode(code: string): Promise<Link | undefined> {
    return this.links.get(code);
  }

  async deleteLink(code: string): Promise<boolean> {
    return this.links.delete(code);
  }

  async incrementClicks(code: string): Promise<void> {
    const link = this.links.get(code);
    if (link) {
      link.clicks += 1;
      link.lastClicked = new Date();
      this.links.set(code, link);
    }
  }
}

export const storage = new MemStorage();
