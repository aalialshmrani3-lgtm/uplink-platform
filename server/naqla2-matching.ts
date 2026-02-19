// Added for Flowchart Match - NAQLA2 Smart Matching Module
import { z } from "zod";
import * as db from "./db";
// TODO: matching functions not available (tables not created)
// import { createMatchingRequest, findMatchingCandidates, saveMatchingResults, updateMatchStatus, createNetworkingConnection } from "./db";
import { createNetworkingConnection } from "./db";
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

    const content = response.choices[0].message.content;
    const scoreText = typeof content === 'string' ? content.trim() : '0';
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
 * Request a match (TODO: matching tables not created)
 */
/*
export async function requestMatch(data: MatchingRequest, userId: number) {
  // Create matching request
  const requestId = await createMatchingRequest({
    userId,
    seekingType: data.seekingType,
    requirements: data.requirements,
    industry: data.industry,
    stage: data.stage,
    budget: data.budget,
    location: data.location,
    preferences: data.preferences,
  });
  
  // Find potential matches
  const candidates = await findMatchingCandidates(requestId);
  const matches = [];
  
  for (const candidate of candidates) {
    const score = await calculateMatchingScore(data, candidate as any);
    
    // Added for Flowchart Match - ValidMatch middleware
    const validation = validateMatch(score);
    
    if (validation.isValid) {
      matches.push({
        candidateId: (candidate as any).id || 0,
        score,
        status: 'suggested',
      });
    }
  }
  
  // Save matches
  if (matches.length > 0) {
    await saveMatchingResults({ requestId, matches });
  }
  
  return {
    id: requestId,
    matchesFound: matches.length,
    matches: matches.sort((a, b) => b.score - a.score).slice(0, 10), // Top 10 matches
    success: true
  };
}
*/

// Get matches for a user (TODO: matching tables not created)
/*
export async function getUserMatches(userId: number) {
  return await db.getUserMatches(userId);
}

export async function acceptMatch(matchId: number, userId: number) {
  const match = await db.getMatchById(matchId);
  
  if (!match) {
    throw new Error('Match not found');
  }
  
  // Check if user is part of the match
  if (match.requestId !== userId && match.matchedUserId !== userId) {
    throw new Error('Unauthorized');
  }
  
  await updateMatchStatus(matchId, 'accepted');
  
  // Create networking connection
  await createNetworkingConnection({
    user1Id: match.requestId,
    user2Id: match.matchedUserId,
    connectionType: 'match',
    status: 'active',
    createdAt: new Date(),
  });
  
  return { success: true };
}

export async function rejectMatch(matchId: number, userId: number, reason?: string) {
  const match = await db.getMatchById(matchId);
  
  if (!match) {
    throw new Error('Match not found');
  }
  
  if (match.requestId !== userId && match.matchedUserId !== userId) {
    throw new Error('Unauthorized');
  }
  
  await updateMatchStatus(matchId, 'rejected');
  
  return { success: true };
}

export async function getMatchingStats(userId: number) {
  const stats = await db.getMatchingStats(userId);
  return stats;
}

*/
