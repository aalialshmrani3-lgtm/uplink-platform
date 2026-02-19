/**
 * NAQLA2 Smart Matching Engine
 * Automatically matches innovators with investors, sponsors with events, etc.
 * 
 * TODO: Fix schema issues before enabling:
 * - Add userType field to users table
 * - Fix query.ideas and query.matchingRequests
 */

export async function findMatches(requestId: number) {
  throw new Error('Matching engine temporarily disabled - schema fixes required');
}

export async function acceptMatch(matchId: number, userId: number) {
  throw new Error('Matching engine temporarily disabled - schema fixes required');
}

export async function rejectMatch(matchId: number, userId: number, reason?: string) {
  throw new Error('Matching engine temporarily disabled - schema fixes required');
}

export async function getMyMatches(userId: number) {
  return {
    myRequests: [],
    matchedToMe: [],
  };
}
