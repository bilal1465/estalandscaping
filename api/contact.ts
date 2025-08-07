// api/contact.ts
import { randomUUID } from 'crypto';
import { insertContactRequestSchema } from '../shared/schema';
import { z } from 'zod';

// In-memory store
const contactRequests = new Map<string, any>();

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
      const validatedData = insertContactRequestSchema.parse(req.body);
      const id = randomUUID();
      const request = {
        ...validatedData,
        id,
        createdAt: new Date().toISOString(),
      };
      contactRequests.set(id, request);
      return res.status(200).json({ success: true, id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  if (req.method === 'GET') {
    const allRequests = Array.from(contactRequests.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return res.status(200).json(allRequests);
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
