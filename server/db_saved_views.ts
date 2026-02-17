import { eq, and, or, inArray } from 'drizzle-orm';
import { getDb } from './db';
import { savedViews, type SavedView, type InsertSavedView } from '../drizzle/schema';

export async function createSavedView(data: InsertSavedView): Promise<SavedView> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const [result] = await db.insert(savedViews).values(data);
  const [view] = await db.select().from(savedViews).where(eq(savedViews.id, Number(result.insertId)));
  return view;
}

export async function getUserSavedViews(userId: number, viewType?: string): Promise<SavedView[]> {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [
    or(
      eq(savedViews.userId, userId),
      eq(savedViews.isPublic, 1)
    )
  ];
  
  if (viewType) {
    conditions.push(eq(savedViews.viewType, viewType));
  }
  
  return db.select().from(savedViews).where(and(...conditions));
}

export async function getSavedViewById(id: number, userId: number): Promise<SavedView | null> {
  const db = await getDb();
  if (!db) return null;
  
  const [view] = await db.select().from(savedViews).where(
    and(
      eq(savedViews.id, id),
      or(
        eq(savedViews.userId, userId),
        eq(savedViews.isPublic, 1)
      )
    )
  );
  
  return view || null;
}

export async function updateSavedView(id: number, userId: number, data: Partial<InsertSavedView>): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.update(savedViews)
    .set(data)
    .where(
      and(
        eq(savedViews.id, id),
        eq(savedViews.userId, userId)
      )
    );
  
  return result[0].affectedRows > 0;
}

export async function deleteSavedView(id: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.delete(savedViews).where(
    and(
      eq(savedViews.id, id),
      eq(savedViews.userId, userId)
    )
  );
  
  return result[0].affectedRows > 0;
}

export async function shareView(id: number, userId: number, targetUserIds: number[]): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  const [view] = await db.select().from(savedViews).where(
    and(
      eq(savedViews.id, id),
      eq(savedViews.userId, userId)
    )
  );
  
  if (!view) return false;
  
  const currentShared = (view.sharedWith as number[]) || [];
  const newShared = Array.from(new Set([...currentShared, ...targetUserIds]));
  
  const result = await db.update(savedViews)
    .set({ sharedWith: newShared })
    .where(eq(savedViews.id, id));
  
  return result[0].affectedRows > 0;
}
