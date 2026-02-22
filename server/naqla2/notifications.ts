import { getDb } from "../db";
import { notifications } from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

/**
 * Create a notification
 */
export async function createNotification(data: {
  userId: number;
  type: "info" | "success" | "warning" | "error" | "action";
  title: string;
  message: string;
  link?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [notification] = await db.insert(notifications).values({
    userId: data.userId,
    type: data.type,
    title: data.title,
    message: data.message,
    link: data.link,
    isRead: 0,
  });

  return notification;
}

/**
 * Get all notifications for a user
 */
export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const userNotifications = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));

  return userNotifications;
}

/**
 * Get unread notifications count for a user
 */
export async function getUnreadCount(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const unreadNotifications = await db
    .select()
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, 0)));

  return unreadNotifications.length;
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(notifications)
    .set({ isRead: 1 })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));

  return true;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(notifications)
    .set({ isRead: 1 })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, 0)));

  return true;
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(notifications)
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));

  return true;
}

/**
 * Notify event organizer when someone registers
 */
export async function notifyEventOrganizer(data: {
  organizerId: number;
  eventTitle: string;
  eventId: number;
  participantName: string;
  registrationType: "participant" | "sponsor";
}) {
  const message =
    data.registrationType === "participant"
      ? `تم تسجيل مشارك جديد (${data.participantName}) في فعاليتك "${data.eventTitle}"`
      : `تم تسجيل راعي جديد (${data.participantName}) في فعاليتك "${data.eventTitle}"`;

  return await createNotification({
    userId: data.organizerId,
    type: "success",
    title: "تسجيل جديد في فعاليتك! 🎉",
    message,
    link: `/naqla2/events/${data.eventId}`,
  });
}
