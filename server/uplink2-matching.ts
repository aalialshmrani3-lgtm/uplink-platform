// Added for Flowchart Match - UPLINK2 Smart Matching Module
import { z } from "zod";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";

export const matchingRequestSchema = z.object({
  seekingType: z.enum(['investor', 'innovator', 'partner', 'mentor']),
  industry: z.string().optional(),
  stage: z.string().optional(),
  budget: z.number().optional(),
  location: z.string().optional(),
  requirements: z.string(),
  preferences: z.string().optional(),
});

export type MatchingRequest = z.infer<typeof matchingRequestSchema>;

/**
 * Calculate matching score between two entities using AI
 */
export async function calculateMatchingScore(
  requester: any,
  candidate: any
): Promise<number> {
  try {
    const prompt = `
تحليل التوافق بين:

المُطالب:
- النوع: ${requester.seekingType}
- الصناعة: ${requester.industry || 'غير محدد'}
- المرحلة: ${requester.stage || 'غير محدد'}
- الميزانية: ${requester.budget || 'غير محدد'}
- المتطلبات: ${requester.requirements}

المرشح:
- النوع: ${candidate.type}
- الصناعة: ${candidate.industry || 'غير محدد'}
- الخبرة: ${candidate.experience || 'غير محدد'}
- الميزانية المتاحة: ${candidate.availableBudget || 'غير محدد'}
- المهارات: ${candidate.skills || 'غير محدد'}

قيّم التوافق من 0 إلى 100 بناءً على:
1. توافق الصناعة (25%)
2. توافق المرحلة/الخبرة (25%)
3. توافق الميزانية (20%)
4. توافق المتطلبات (20%)
5. التوافق الجغرافي (10%)

أعطِ فقط الرقم النهائي بدون أي نص إضافي.
`;

    const response = await invokeLLM({
      messages: [
        { role: 'system', content: 'أنت خبير في تقييم التوافق بين المبتكرين والمستثمرين.' },
        { role: 'user', content: prompt }
      ],
    });

    const scoreText = response.choices[0].message.content.trim();
    const score = parseInt(scoreText);
    
    return isNaN(score) ? 0 : Math.min(100, Math.max(0, score));
  } catch (error) {
    console.error('Error calculating matching score:', error);
    return 0;
  }
}

/**
 * ValidMatch Middleware - Added for Flowchart Match
 * Validates if a match meets the minimum threshold
 */
export function validateMatch(score: number): { isValid: boolean; reason?: string } {
  // Added for Flowchart Match - if (score >= 50) { proceed } else { reject }
  if (score >= 50) {
    return { isValid: true };
  } else {
    return {
      isValid: false,
      reason: 'نسبة التوافق أقل من 50%. يُنصح بتحسين المتطلبات أو البحث عن مرشحين آخرين.'
    };
  }
}

/**
 * Request a match
 */
export async function requestMatch(data: MatchingRequest, userId: number) {
  const requestId = await db.createMatchingRequest({
    ...data,
    userId,
    status: 'pending',
    createdAt: new Date(),
  });
  
  // Find potential matches
  const candidates = await db.findMatchingCandidates(data);
  const matches = [];
  
  for (const candidate of candidates) {
    const score = await calculateMatchingScore(data, candidate);
    
    // Added for Flowchart Match - ValidMatch middleware
    const validation = validateMatch(score);
    
    if (validation.isValid) {
      matches.push({
        candidateId: candidate.id,
        score,
        status: 'suggested',
      });
    }
  }
  
  // Save matches
  if (matches.length > 0) {
    await db.saveMatchingResults(requestId, matches);
  }
  
  return {
    id: requestId,
    matchesFound: matches.length,
    matches: matches.sort((a, b) => b.score - a.score).slice(0, 10), // Top 10 matches
    success: true
  };
}

/**
 * Get matches for a user
 */
export async function getUserMatches(userId: number) {
  return await db.getUserMatches(userId);
}

/**
 * Accept a match
 */
export async function acceptMatch(matchId: number, userId: number) {
  const match = await db.getMatchById(matchId);
  
  if (!match) {
    throw new Error('Match not found');
  }
  
  // Check if user is part of the match
  if (match.requesterId !== userId && match.candidateId !== userId) {
    throw new Error('Unauthorized');
  }
  
  await db.updateMatchStatus(matchId, 'accepted');
  
  // Create networking connection
  await db.createNetworkingConnection({
    user1Id: match.requesterId,
    user2Id: match.candidateId,
    connectionType: 'match',
    status: 'active',
    createdAt: new Date(),
  });
  
  return { success: true };
}

/**
 * Reject a match
 */
export async function rejectMatch(matchId: number, userId: number, reason?: string) {
  const match = await db.getMatchById(matchId);
  
  if (!match) {
    throw new Error('Match not found');
  }
  
  if (match.requesterId !== userId && match.candidateId !== userId) {
    throw new Error('Unauthorized');
  }
  
  await db.updateMatchStatus(matchId, 'rejected', reason);
  
  return { success: true };
}

/**
 * Get matching statistics
 */
export async function getMatchingStats(userId: number) {
  const stats = await db.getMatchingStats(userId);
  return stats;
}
