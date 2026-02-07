/**
 * UPLINK2: Networking & Connections Platform
 * 
 * This module manages professional networking connections between users.
 * It handles connection requests, acceptances, messaging, and relationship management.
 */

import * as db from "./db";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ConnectionRequest {
  userAId: number;
  userBId: number;
  connectionType: "match" | "challenge" | "hackathon" | "direct" | "referral";
  contextId?: number;
  message?: string;
  notes?: string;
}

export interface ConnectionFilter {
  status?: "pending" | "accepted" | "rejected" | "blocked";
  connectionType?: string;
}

// ============================================
// CONNECTION MANAGEMENT FUNCTIONS
// ============================================

/**
 * Send a connection request
 */
export async function sendConnectionRequest(input: ConnectionRequest) {
  try {
    // Check if connection already exists
    const existing = await db.getConnection(input.userAId, input.userBId);
    
    if (existing) {
      if (existing.status === "accepted") {
        throw new Error("أنت متصل بالفعل مع هذا المستخدم");
      } else if (existing.status === "pending") {
        throw new Error("هناك طلب اتصال معلق بالفعل");
      } else if (existing.status === "blocked") {
        throw new Error("لا يمكن إرسال طلب اتصال");
      }
    }

    // Prevent self-connection
    if (input.userAId === input.userBId) {
      throw new Error("لا يمكنك الاتصال بنفسك");
    }

    const connection = await db.createNetworkingConnection({
      ...input,
      status: "pending",
    });

    // TODO: Send notification to userB

    return {
      success: true,
      connectionId: connection.id,
      message: "تم إرسال طلب الاتصال بنجاح",
    };
  } catch (error) {
    console.error("Error sending connection request:", error);
    throw error;
  }
}

/**
 * Accept a connection request
 */
export async function acceptConnectionRequest(connectionId: number, userId: number) {
  try {
    const connection = await db.getConnectionById(connectionId);
    
    if (!connection) {
      throw new Error("طلب الاتصال غير موجود");
    }

    if (connection.userBId !== userId) {
      throw new Error("غير مصرح لك بقبول هذا الطلب");
    }

    if (connection.status !== "pending") {
      throw new Error("طلب الاتصال تمت معالجته بالفعل");
    }

    await db.updateNetworkingConnection(connectionId, {
      status: "accepted",
      acceptedAt: new Date(),
    });

    // TODO: Send notification to userA

    return {
      success: true,
      message: "تم قبول طلب الاتصال بنجاح",
    };
  } catch (error) {
    console.error("Error accepting connection request:", error);
    throw error;
  }
}

/**
 * Reject a connection request
 */
export async function rejectConnectionRequest(connectionId: number, userId: number) {
  try {
    const connection = await db.getConnectionById(connectionId);
    
    if (!connection) {
      throw new Error("طلب الاتصال غير موجود");
    }

    if (connection.userBId !== userId) {
      throw new Error("غير مصرح لك برفض هذا الطلب");
    }

    if (connection.status !== "pending") {
      throw new Error("طلب الاتصال تمت معالجته بالفعل");
    }

    await db.updateNetworkingConnection(connectionId, {
      status: "rejected",
    });

    return {
      success: true,
      message: "تم رفض طلب الاتصال",
    };
  } catch (error) {
    console.error("Error rejecting connection request:", error);
    throw error;
  }
}

/**
 * Cancel a sent connection request
 */
export async function cancelConnectionRequest(connectionId: number, userId: number) {
  try {
    const connection = await db.getConnectionById(connectionId);
    
    if (!connection) {
      throw new Error("طلب الاتصال غير موجود");
    }

    if (connection.userAId !== userId) {
      throw new Error("غير مصرح لك بإلغاء هذا الطلب");
    }

    if (connection.status !== "pending") {
      throw new Error("لا يمكن إلغاء طلب تمت معالجته");
    }

    await db.deleteNetworkingConnection(connectionId);

    return {
      success: true,
      message: "تم إلغاء طلب الاتصال",
    };
  } catch (error) {
    console.error("Error cancelling connection request:", error);
    throw error;
  }
}

/**
 * Block a user
 */
export async function blockUser(userId: number, blockedUserId: number) {
  try {
    if (userId === blockedUserId) {
      throw new Error("لا يمكنك حظر نفسك");
    }

    // Check if connection exists
    const connection = await db.getConnection(userId, blockedUserId);
    
    if (connection) {
      // Update existing connection to blocked
      await db.updateNetworkingConnection(connection.id, {
        status: "blocked",
      });
    } else {
      // Create new blocked connection
      await db.createNetworkingConnection({
        userAId: userId,
        userBId: blockedUserId,
        connectionType: "direct",
        status: "blocked",
      });
    }

    return {
      success: true,
      message: "تم حظر المستخدم بنجاح",
    };
  } catch (error) {
    console.error("Error blocking user:", error);
    throw new Error("فشل في حظر المستخدم");
  }
}

/**
 * Unblock a user
 */
export async function unblockUser(userId: number, blockedUserId: number) {
  try {
    const connection = await db.getConnection(userId, blockedUserId);
    
    if (!connection || connection.status !== "blocked") {
      throw new Error("المستخدم غير محظور");
    }

    // Delete the blocked connection
    await db.deleteNetworkingConnection(connection.id);

    return {
      success: true,
      message: "تم إلغاء حظر المستخدم",
    };
  } catch (error) {
    console.error("Error unblocking user:", error);
    throw new Error("فشل في إلغاء حظر المستخدم");
  }
}

/**
 * Remove a connection
 */
export async function removeConnection(connectionId: number, userId: number) {
  try {
    const connection = await db.getConnectionById(connectionId);
    
    if (!connection) {
      throw new Error("الاتصال غير موجود");
    }

    if (connection.userAId !== userId && connection.userBId !== userId) {
      throw new Error("غير مصرح لك بإزالة هذا الاتصال");
    }

    if (connection.status !== "accepted") {
      throw new Error("لا يمكن إزالة اتصال غير مقبول");
    }

    await db.deleteNetworkingConnection(connectionId);

    return {
      success: true,
      message: "تم إزالة الاتصال بنجاح",
    };
  } catch (error) {
    console.error("Error removing connection:", error);
    throw error;
  }
}

// ============================================
// CONNECTION RETRIEVAL FUNCTIONS
// ============================================

/**
 * Get user's connections
 */
export async function getUserConnections(userId: number, filters?: ConnectionFilter) {
  try {
    const connections = await db.getUserConnections(userId, filters);
    
    // Enrich with user details
    const enriched = await Promise.all(
      connections.map(async (conn) => {
        const otherUserId = conn.userAId === userId ? conn.userBId : conn.userAId;
        const otherUser = await db.getUserById(otherUserId);
        
        return {
          ...conn,
          otherUser: {
            id: otherUser.id,
            name: otherUser.name,
            email: otherUser.email,
            userType: otherUser.userType,
            profileImage: otherUser.profileImage,
          },
        };
      })
    );

    return enriched;
  } catch (error) {
    console.error("Error fetching user connections:", error);
    throw new Error("فشل في جلب الاتصالات");
  }
}

/**
 * Get pending connection requests (received)
 */
export async function getPendingRequests(userId: number) {
  try {
    const requests = await db.getPendingConnectionRequests(userId);
    
    // Enrich with sender details
    const enriched = await Promise.all(
      requests.map(async (req) => {
        const sender = await db.getUserById(req.userAId);
        
        return {
          ...req,
          sender: {
            id: sender.id,
            name: sender.name,
            email: sender.email,
            userType: sender.userType,
            profileImage: sender.profileImage,
          },
        };
      })
    );

    return enriched;
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    throw new Error("فشل في جلب الطلبات المعلقة");
  }
}

/**
 * Get sent connection requests (pending)
 */
export async function getSentRequests(userId: number) {
  try {
    const requests = await db.getSentConnectionRequests(userId);
    
    // Enrich with recipient details
    const enriched = await Promise.all(
      requests.map(async (req) => {
        const recipient = await db.getUserById(req.userBId);
        
        return {
          ...req,
          recipient: {
            id: recipient.id,
            name: recipient.name,
            email: recipient.email,
            userType: recipient.userType,
            profileImage: recipient.profileImage,
          },
        };
      })
    );

    return enriched;
  } catch (error) {
    console.error("Error fetching sent requests:", error);
    throw new Error("فشل في جلب الطلبات المرسلة");
  }
}

/**
 * Get blocked users
 */
export async function getBlockedUsers(userId: number) {
  try {
    const blocked = await db.getBlockedUsers(userId);
    
    // Enrich with user details
    const enriched = await Promise.all(
      blocked.map(async (conn) => {
        const blockedUser = await db.getUserById(conn.userBId);
        
        return {
          connectionId: conn.id,
          user: {
            id: blockedUser.id,
            name: blockedUser.name,
            email: blockedUser.email,
            userType: blockedUser.userType,
          },
          blockedAt: conn.createdAt,
        };
      })
    );

    return enriched;
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    throw new Error("فشل في جلب المستخدمين المحظورين");
  }
}

/**
 * Check connection status between two users
 */
export async function getConnectionStatus(userAId: number, userBId: number) {
  try {
    const connection = await db.getConnection(userAId, userBId);
    
    if (!connection) {
      return {
        status: "none",
        canConnect: true,
      };
    }

    return {
      status: connection.status,
      connectionId: connection.id,
      canConnect: connection.status === "rejected",
      connectionType: connection.connectionType,
      createdAt: connection.createdAt,
      acceptedAt: connection.acceptedAt,
    };
  } catch (error) {
    console.error("Error checking connection status:", error);
    throw new Error("فشل في فحص حالة الاتصال");
  }
}

// ============================================
// SEARCH & DISCOVERY FUNCTIONS
// ============================================

/**
 * Search for users to connect with
 */
export async function searchUsers(
  currentUserId: number,
  filters: {
    query?: string;
    userType?: string;
    industry?: string;
    location?: string;
    skills?: string[];
  }
) {
  try {
    const users = await db.searchUsers(filters);
    
    // Filter out current user and blocked users
    const filtered = users.filter(u => u.id !== currentUserId);
    
    // Enrich with connection status
    const enriched = await Promise.all(
      filtered.map(async (user) => {
        const connectionStatus = await getConnectionStatus(currentUserId, user.id);
        
        return {
          ...user,
          connectionStatus: connectionStatus.status,
          canConnect: connectionStatus.canConnect,
        };
      })
    );

    return enriched;
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error("فشل في البحث عن المستخدمين");
  }
}

/**
 * Get suggested connections based on user profile
 */
export async function getSuggestedConnections(userId: number, limit: number = 10) {
  try {
    const user = await db.getUserById(userId);
    
    if (!user) {
      throw new Error("المستخدم غير موجود");
    }

    // Get users with similar interests/industry
    const suggestions = await db.getSuggestedConnections(userId, {
      industry: user.industry,
      location: user.location,
      limit,
    });

    // Enrich with connection status
    const enriched = await Promise.all(
      suggestions.map(async (suggestedUser) => {
        const connectionStatus = await getConnectionStatus(userId, suggestedUser.id);
        
        return {
          ...suggestedUser,
          connectionStatus: connectionStatus.status,
          canConnect: connectionStatus.canConnect,
          matchReason: suggestedUser.matchReason,
        };
      })
    );

    return enriched;
  } catch (error) {
    console.error("Error fetching suggested connections:", error);
    throw new Error("فشل في جلب الاتصالات المقترحة");
  }
}

// ============================================
// STATISTICS & ANALYTICS
// ============================================

/**
 * Get networking statistics for a user
 */
export async function getNetworkingStatistics(userId: number) {
  try {
    const stats = await db.getUserNetworkingStats(userId);

    return {
      totalConnections: stats.totalConnections,
      pendingReceived: stats.pendingReceived,
      pendingSent: stats.pendingSent,
      blockedUsers: stats.blockedUsers,
      connectionsByType: stats.connectionsByType,
      recentConnections: stats.recentConnections,
    };
  } catch (error) {
    console.error("Error fetching networking statistics:", error);
    throw new Error("فشل في جلب إحصائيات الشبكة");
  }
}

/**
 * Get mutual connections between two users
 */
export async function getMutualConnections(userAId: number, userBId: number) {
  try {
    const mutualConnections = await db.getMutualConnections(userAId, userBId);
    
    // Enrich with user details
    const enriched = await Promise.all(
      mutualConnections.map(async (userId) => {
        const user = await db.getUserById(userId);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          profileImage: user.profileImage,
        };
      })
    );

    return enriched;
  } catch (error) {
    console.error("Error fetching mutual connections:", error);
    throw new Error("فشل في جلب الاتصالات المشتركة");
  }
}
