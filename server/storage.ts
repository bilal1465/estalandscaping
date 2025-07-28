import { type ContactRequest, type InsertContactRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  getContactRequests(): Promise<ContactRequest[]>;
}

export class MemStorage implements IStorage {
  private contactRequests: Map<string, ContactRequest>;

  constructor() {
    this.contactRequests = new Map();
  }

  async createContactRequest(insertRequest: InsertContactRequest): Promise<ContactRequest> {
    const id = randomUUID();
    const request: ContactRequest = {
      ...insertRequest,
      id,
      createdAt: new Date(),
    };
    this.contactRequests.set(id, request);
    return request;
  }

  async getContactRequests(): Promise<ContactRequest[]> {
    return Array.from(this.contactRequests.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

export const storage = new MemStorage();
