import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";
import { nanoid } from "nanoid";
import crypto from "crypto";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============================================
  // USER MANAGEMENT
  // ============================================
  user: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return ctx.user;
    }),
    
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        organizationName: z.string().optional(),
        organizationType: z.string().optional(),
        country: z.string().optional(),
        city: z.string().optional(),
        bio: z.string().optional(),
        website: z.string().optional(),
        linkedIn: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),

    getAllUsers: protectedProcedure.query(async () => {
      return db.getAllUsers();
    }),
  }),

  // ============================================
  // PROJECT MANAGEMENT
  // ============================================
  project: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        titleEn: z.string().optional(),
        description: z.string().min(1),
        descriptionEn: z.string().optional(),
        category: z.string().optional(),
        subCategory: z.string().optional(),
        stage: z.enum(["idea", "prototype", "mvp", "growth", "scale"]).optional(),
        teamSize: z.number().optional(),
        fundingNeeded: z.string().optional(),
        targetMarket: z.string().optional(),
        competitiveAdvantage: z.string().optional(),
        businessModel: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const projectId = await db.createProject({
          ...input,
          userId: ctx.user.id,
          fundingNeeded: input.fundingNeeded || undefined,
          tags: input.tags ? JSON.stringify(input.tags) : undefined,
        });
        return { id: projectId };
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getProjectById(input.id);
      }),

    getMyProjects: protectedProcedure.query(async ({ ctx }) => {
      return db.getProjectsByUserId(ctx.user.id);
    }),

    getAll: publicProcedure.query(async () => {
      return db.getAllProjects();
    }),

    getByEngine: publicProcedure
      .input(z.object({ engine: z.enum(["uplink1", "uplink2", "uplink3"]) }))
      .query(async ({ input }) => {
        return db.getProjectsByEngine(input.engine);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["draft", "submitted", "evaluating", "approved", "matched", "contracted", "completed", "rejected"]).optional(),
        engine: z.enum(["uplink1", "uplink2", "uplink3"]).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateProject(id, data);
        return { success: true };
      }),

    submit: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.updateProject(input.id, { status: "submitted" });
        return { success: true };
      }),
  }),

  // ============================================
  // IP REGISTRATION
  // ============================================
  ip: router({
    create: protectedProcedure
      .input(z.object({
        type: z.enum(["patent", "trademark", "copyright", "trade_secret", "industrial_design"]),
        title: z.string().min(1),
        titleEn: z.string().optional(),
        description: z.string().min(1),
        descriptionEn: z.string().optional(),
        category: z.string().optional(),
        subCategory: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        inventors: z.array(z.object({
          name: z.string(),
          email: z.string().optional(),
          contribution: z.string().optional(),
        })).optional(),
        applicantType: z.enum(["individual", "company", "university", "government"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const blockchainHash = crypto.createHash('sha256')
          .update(JSON.stringify({ ...input, userId: ctx.user.id, timestamp: Date.now() }))
          .digest('hex');
        
        const ipId = await db.createIPRegistration({
          ...input,
          userId: ctx.user.id,
          keywords: input.keywords ? JSON.stringify(input.keywords) : undefined,
          inventors: input.inventors ? JSON.stringify(input.inventors) : undefined,
          blockchainHash,
          blockchainTimestamp: new Date(),
          status: "draft",
        });
        return { id: ipId, blockchainHash };
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getIPRegistrationById(input.id);
      }),

    getMyRegistrations: protectedProcedure.query(async ({ ctx }) => {
      return db.getIPRegistrationsByUserId(ctx.user.id);
    }),

    submit: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const saipNumber = `SAIP-${new Date().getFullYear()}-${nanoid(8).toUpperCase()}`;
        await db.updateIPRegistration(input.id, { 
          status: "submitted",
          saipApplicationNumber: saipNumber,
          filingDate: new Date(),
        });
        return { success: true, saipNumber };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["draft", "submitted", "under_review", "approved", "rejected", "registered", "expired"]).optional(),
        wipoApplicationNumber: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateIPRegistration(id, data);
        return { success: true };
      }),
  }),

  // ============================================
  // AI EVALUATION
  // ============================================
  evaluation: router({
    evaluate: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .mutation(async ({ input }) => {
        const project = await db.getProjectById(input.projectId);
        if (!project) throw new Error("Project not found");

        await db.updateProject(input.projectId, { status: "evaluating" });

        const prompt = `You are an expert innovation evaluator for UPLINK, Saudi Arabia's national innovation platform. Analyze the following innovation project and provide a comprehensive evaluation.

Project Title: ${project.title}
Description: ${project.description}
Category: ${project.category || "Not specified"}
Stage: ${project.stage || "idea"}
Target Market: ${project.targetMarket || "Not specified"}
Competitive Advantage: ${project.competitiveAdvantage || "Not specified"}
Business Model: ${project.businessModel || "Not specified"}

Evaluate this project on the following criteria (score each from 0-100):
1. Innovation Score - How novel and unique is this idea?
2. Market Potential - What is the market size and growth potential?
3. Technical Feasibility - How technically achievable is this?
4. Team Capability - Based on the project stage and description
5. IP Strength - Potential for intellectual property protection
6. Scalability - Can this scale nationally/globally?

Based on the overall score:
- ≥70%: "innovation" (True Innovation - Fast track to UPLINK3)
- 50-70%: "commercial" (Business Solution - Business incubation support)
- <50%: "guidance" (Needs Development - Mentorship and exploration)

Respond in JSON format:
{
  "overallScore": number,
  "classification": "innovation" | "commercial" | "guidance",
  "innovationScore": number,
  "marketPotentialScore": number,
  "technicalFeasibilityScore": number,
  "teamCapabilityScore": number,
  "ipStrengthScore": number,
  "scalabilityScore": number,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "nextSteps": ["step1", "step2", "step3"],
  "marketAnalysis": "Brief market analysis",
  "competitorAnalysis": "Brief competitor analysis",
  "riskAssessment": "Key risks identified"
}`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are an expert innovation evaluator. Always respond with valid JSON." },
            { role: "user", content: prompt }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "evaluation_result",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  overallScore: { type: "number" },
                  classification: { type: "string", enum: ["innovation", "commercial", "guidance"] },
                  innovationScore: { type: "number" },
                  marketPotentialScore: { type: "number" },
                  technicalFeasibilityScore: { type: "number" },
                  teamCapabilityScore: { type: "number" },
                  ipStrengthScore: { type: "number" },
                  scalabilityScore: { type: "number" },
                  strengths: { type: "array", items: { type: "string" } },
                  weaknesses: { type: "array", items: { type: "string" } },
                  recommendations: { type: "array", items: { type: "string" } },
                  nextSteps: { type: "array", items: { type: "string" } },
                  marketAnalysis: { type: "string" },
                  competitorAnalysis: { type: "string" },
                  riskAssessment: { type: "string" }
                },
                required: ["overallScore", "classification", "innovationScore", "marketPotentialScore", "technicalFeasibilityScore", "teamCapabilityScore", "ipStrengthScore", "scalabilityScore", "strengths", "weaknesses", "recommendations", "nextSteps", "marketAnalysis", "competitorAnalysis", "riskAssessment"],
                additionalProperties: false
              }
            }
          }
        });

        const content = response.choices[0].message.content;
        const evalResult = JSON.parse(typeof content === 'string' ? content : JSON.stringify(content) || "{}");
        
        const evaluationId = await db.createEvaluation({
          projectId: input.projectId,
          overallScore: evalResult.overallScore.toString(),
          classification: evalResult.classification,
          innovationScore: evalResult.innovationScore.toString(),
          marketPotentialScore: evalResult.marketPotentialScore.toString(),
          technicalFeasibilityScore: evalResult.technicalFeasibilityScore.toString(),
          teamCapabilityScore: evalResult.teamCapabilityScore.toString(),
          ipStrengthScore: evalResult.ipStrengthScore.toString(),
          scalabilityScore: evalResult.scalabilityScore.toString(),
          strengths: JSON.stringify(evalResult.strengths),
          weaknesses: JSON.stringify(evalResult.weaknesses),
          recommendations: JSON.stringify(evalResult.recommendations),
          nextSteps: JSON.stringify(evalResult.nextSteps),
          marketAnalysis: evalResult.marketAnalysis,
          competitorAnalysis: evalResult.competitorAnalysis,
          riskAssessment: evalResult.riskAssessment,
          status: "completed",
        });

        const newEngine = evalResult.classification === "guidance" ? "uplink1" : "uplink3";
        const newStatus = evalResult.classification === "guidance" ? "rejected" : "approved";
        await db.updateProject(input.projectId, { 
          evaluationId, 
          engine: newEngine,
          status: newStatus 
        });

        return { id: evaluationId, ...evalResult };
      }),

    getByProjectId: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return db.getEvaluationByProjectId(input.projectId);
      }),
  }),

  // ============================================
  // CONTRACTS & ESCROW
  // ============================================
  contract: router({
    create: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        type: z.enum(["license", "acquisition", "partnership", "investment", "service", "nda"]),
        title: z.string().min(1),
        description: z.string().optional(),
        partyB: z.number(),
        totalValue: z.string(),
        currency: z.string().optional(),
        terms: z.string().optional(),
        milestones: z.array(z.object({
          id: z.string(),
          title: z.string(),
          amount: z.string(),
          dueDate: z.string().optional(),
          status: z.enum(["pending", "completed", "cancelled"]),
        })).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const contractId = await db.createContract({
          ...input,
          partyA: ctx.user.id,
          milestones: input.milestones ? JSON.stringify(input.milestones) : undefined,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          status: "draft",
        });

        await db.createEscrowAccount({
          contractId,
          totalAmount: input.totalValue,
          pendingAmount: input.totalValue,
          currency: input.currency || "SAR",
          status: "pending_deposit",
        });

        return { id: contractId };
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getContractById(input.id);
      }),

    getMyContracts: protectedProcedure.query(async ({ ctx }) => {
      return db.getContractsByUserId(ctx.user.id);
    }),

    sign: protectedProcedure
      .input(z.object({ 
        id: z.number(),
        signature: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const contract = await db.getContractById(input.id);
        if (!contract) throw new Error("Contract not found");

        const updateData: any = {};
        if (contract.partyA === ctx.user.id) {
          updateData.partyASignature = input.signature;
          updateData.partyASignedAt = new Date();
        } else if (contract.partyB === ctx.user.id) {
          updateData.partyBSignature = input.signature;
          updateData.partyBSignedAt = new Date();
        } else {
          throw new Error("Not authorized to sign this contract");
        }

        await db.updateContract(input.id, updateData);

        const updatedContract = await db.getContractById(input.id);
        if (updatedContract?.partyASignature && updatedContract?.partyBSignature) {
          const blockchainHash = crypto.createHash('sha256')
            .update(JSON.stringify(updatedContract))
            .digest('hex');
          await db.updateContract(input.id, { status: "active", blockchainHash });
        }

        return { success: true };
      }),

    getEscrow: protectedProcedure
      .input(z.object({ contractId: z.number() }))
      .query(async ({ input }) => {
        return db.getEscrowByContractId(input.contractId);
      }),
  }),

  // ============================================
  // ACADEMY & COURSES
  // ============================================
  academy: router({
    getCourses: publicProcedure.query(async () => {
      return db.getAllCourses();
    }),

    getCourseById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getCourseById(input.id);
      }),

    enroll: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.enrollInCourse({
          userId: ctx.user.id,
          courseId: input.courseId,
          status: "enrolled",
          startedAt: new Date(),
        });
        return { success: true };
      }),

    getMyEnrollments: protectedProcedure.query(async ({ ctx }) => {
      return db.getEnrollmentsByUserId(ctx.user.id);
    }),

    createCourse: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        titleEn: z.string().optional(),
        description: z.string().optional(),
        descriptionEn: z.string().optional(),
        category: z.enum(["innovation", "entrepreneurship", "ip", "investment", "technology", "leadership"]),
        level: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
        duration: z.number().optional(),
        instructor: z.string().optional(),
        partner: z.string().optional(),
        price: z.string().optional(),
        isFree: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const courseId = await db.createCourse(input);
        return { id: courseId };
      }),
  }),

  // ============================================
  // ELITE CLUB
  // ============================================
  elite: router({
    getMembership: protectedProcedure.query(async ({ ctx }) => {
      return db.getEliteMembershipByUserId(ctx.user.id);
    }),

    subscribe: protectedProcedure
      .input(z.object({
        tier: z.enum(["gold", "platinum", "diamond"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const prices = { gold: "5000", platinum: "15000", diamond: "50000" };
        const membershipId = await db.createEliteMembership({
          userId: ctx.user.id,
          tier: input.tier,
          status: "pending",
          price: prices[input.tier],
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        });
        return { id: membershipId };
      }),
  }),

  // ============================================
  // API KEYS
  // ============================================
  apiKey: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        permissions: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const rawKey = `uplink_${nanoid(32)}`;
        const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
        const keyPrefix = rawKey.substring(0, 12);

        const keyId = await db.createApiKey({
          userId: ctx.user.id,
          name: input.name,
          keyHash,
          keyPrefix,
          permissions: input.permissions ? JSON.stringify(input.permissions) : undefined,
          status: "active",
        });

        return { id: keyId, key: rawKey };
      }),

    getMyKeys: protectedProcedure.query(async ({ ctx }) => {
      return db.getApiKeysByUserId(ctx.user.id);
    }),

    revoke: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.revokeApiKey(input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // CHALLENGES (UPLINK2)
  // ============================================
  challenge: router({
    getAll: publicProcedure
      .input(z.object({ status: z.enum(["open", "closed", "completed"]).optional() }).optional())
      .query(async ({ input }) => {
        return db.getAllChallenges(input?.status);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getChallengeById(input.id);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        titleEn: z.string().optional(),
        description: z.string().min(1),
        descriptionEn: z.string().optional(),
        type: z.enum(["challenge", "hackathon", "competition", "open_problem", "conference"]),
        category: z.string().optional(),
        prize: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const challengeId = await db.createChallenge({
          ...input,
          organizerId: ctx.user.id,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          status: "draft",
        });
        return { id: challengeId };
      }),
  }),

  // ============================================
  // GLOBAL NETWORK
  // ============================================
  network: router({
    getAmbassadors: publicProcedure.query(async () => {
      return db.getAllAmbassadors();
    }),

    getHubs: publicProcedure.query(async () => {
      return db.getAllInnovationHubs();
    }),

    applyAmbassador: protectedProcedure
      .input(z.object({
        country: z.string().min(1),
        city: z.string().optional(),
        title: z.string().optional(),
        organization: z.string().optional(),
        bio: z.string().optional(),
        expertise: z.array(z.string()).optional(),
        languages: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const ambassadorId = await db.createAmbassador({
          ...input,
          userId: ctx.user.id,
          expertise: input.expertise ? JSON.stringify(input.expertise) : undefined,
          languages: input.languages ? JSON.stringify(input.languages) : undefined,
          status: "pending",
        });
        return { id: ambassadorId };
      }),
  }),

  // ============================================
  // NOTIFICATIONS
  // ============================================
  notification: router({
    getAll: protectedProcedure.query(async ({ ctx }) => {
      return db.getNotificationsByUserId(ctx.user.id);
    }),

    getUnread: protectedProcedure.query(async ({ ctx }) => {
      return db.getNotificationsByUserId(ctx.user.id, true);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.id);
        return { success: true };
      }),
  }),

  // ============================================
  // DASHBOARD & ANALYTICS
  // ============================================
  dashboard: router({
    getStats: publicProcedure.query(async () => {
      return db.getDashboardStats();
    }),
  }),
});

export type AppRouter = typeof appRouter;
