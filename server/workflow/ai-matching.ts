/**
 * AI-Powered Matching System for UPLINK 2
 * 
 * This system automatically matches ideas with relevant organizations:
 * - Government entities
 * - Companies
 * - Associations
 * - Authorities
 * - Universities
 * - Investors
 * - NGOs
 */

import { invokeLLM } from "../_core/llm";
import { getDb } from "../db";
import { ideas, ideaAnalysis, organizations, matches } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

interface MatchingCriteria {
  ideaId: number;
  category?: string;
  sector?: string;
  budget?: number;
  location?: string;
}

interface MatchResult {
  organizationId: number;
  score: number; // 0-100
  reasons: string[];
  matchType: "innovation" | "commercial" | "investment" | "partnership";
}

/**
 * AI-powered matching between ideas and organizations
 */
export async function matchIdeaWithOrganizations(criteria: MatchingCriteria): Promise<MatchResult[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    // 1. Get idea and its analysis
    const [idea] = await db.select().from(ideas).where(eq(ideas.id, criteria.ideaId)).limit(1);
    if (!idea) {
      throw new Error("Idea not found");
    }
    
    const [analysis] = await db.select().from(ideaAnalysis).where(eq(ideaAnalysis.ideaId, criteria.ideaId)).limit(1);
    if (!analysis) {
      throw new Error("Analysis not found");
    }
    
    // 2. Get all active organizations
    const allOrganizations = await db.select().from(organizations).where(eq(organizations.isActive, true));
    
    if (allOrganizations.length === 0) {
      return [];
    }
    
    // 3. Use AI to match idea with organizations
    const matchingPrompt = `
You are an AI matching system for UPLINK Platform. Your task is to match an innovative idea with relevant organizations.

**Idea Details:**
- Title: ${idea.title}
- Description: ${idea.description}
- Problem: ${idea.problem || "N/A"}
- Solution: ${idea.solution || "N/A"}
- Target Market: ${idea.targetMarket || "N/A"}
- Category: ${idea.category || "N/A"}
- Innovation Score: ${analysis.overallScore}/100
- Classification: ${analysis.classification}

**Available Organizations:**
${allOrganizations.map((org, idx) => `
${idx + 1}. ${org.name} (${org.nameEn || ""})
   - Type: ${org.type}
   - Sector: ${org.sector || "N/A"}
   - Industry: ${org.industry || "N/A"}
   - Description: ${org.description || "N/A"}
   - Interests: ${org.interests ? JSON.stringify(org.interests) : "N/A"}
   - Budget: ${org.budget ? `$${org.budget}` : "N/A"}
`).join("\n")}

**Your Task:**
For each organization, determine:
1. Match Score (0-100): How well does this organization match with the idea?
2. Match Type: innovation | commercial | investment | partnership
3. Reasons: Why is this a good match? (list 2-3 specific reasons)

**Output Format (JSON):**
{
  "matches": [
    {
      "organizationId": <organization_id>,
      "score": <0-100>,
      "matchType": "<innovation|commercial|investment|partnership>",
      "reasons": ["reason1", "reason2", "reason3"]
    }
  ]
}

**Rules:**
- Only include matches with score ≥ 50
- Be specific and data-driven in your reasoning
- Consider sector alignment, budget compatibility, and strategic fit
- Prioritize organizations with verified status
`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are an expert AI matching system for innovation platforms." },
        { role: "user", content: matchingPrompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "matching_results",
          strict: true,
          schema: {
            type: "object",
            properties: {
              matches: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    organizationId: { type: "number" },
                    score: { type: "number" },
                    matchType: { type: "string", enum: ["innovation", "commercial", "investment", "partnership"] },
                    reasons: { type: "array", items: { type: "string" } }
                  },
                  required: ["organizationId", "score", "matchType", "reasons"],
                  additionalProperties: false
                }
              }
            },
            required: ["matches"],
            additionalProperties: false
          }
        }
      }
    });
    
    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // 4. Save matches to database
    const matchResults: MatchResult[] = result.matches || [];
    
    for (const match of matchResults) {
      await db.insert(matches).values({
        requestId: criteria.ideaId, // Using ideaId as requestId for now
        matchedUserId: match.organizationId, // Using organizationId as matchedUserId
        score: match.score.toString(),
        reasons: match.reasons,
        status: "pending"
      });
    }
    
    return matchResults;
    
  } catch (error) {
    console.error("[AI Matching] Failed:", error);
    throw error;
  }
}

/**
 * Auto-match all transferred ideas in UPLINK 2
 */
export async function autoMatchAllIdeas() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    // Get all ideas that have been transferred to UPLINK 2
    const transferredIdeas = await db
      .select()
      .from(ideas)
      .where(eq(ideas.status, "transferred_to_uplink2"));
    
    const results = [];
    
    for (const idea of transferredIdeas) {
      try {
        const matches = await matchIdeaWithOrganizations({ ideaId: idea.id });
        results.push({
          ideaId: idea.id,
          matchesFound: matches.length,
          matches
        });
      } catch (error) {
        console.error(`[AI Matching] Failed to match idea ${idea.id}:`, error);
      }
    }
    
    return {
      success: true,
      totalIdeas: transferredIdeas.length,
      results
    };
    
  } catch (error) {
    console.error("[AI Matching] Auto-match failed:", error);
    throw error;
  }
}
