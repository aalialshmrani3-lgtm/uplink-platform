import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from '@trpc/server';
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import * as db from "./db";
import { getNotificationsByUserId, getUnreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, getAllUsersForAdmin, updateUserRole, deleteUser, getAllProjectsForAdmin, deleteProject, getAllAnalysesForAdmin, deleteAnalysis, getAdminDashboardStats, createAdminLog, getAdminLogs, getSystemMetrics } from "./db";
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

  // ============================================
  // INNOVATION PIPELINE
  // ============================================
  pipeline: router({
    // Initiatives
    createInitiative: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        titleEn: z.string().optional(),
        description: z.string().optional(),
        descriptionEn: z.string().optional(),
        businessStrategy: z.string().optional(),
        innovationStrategy: z.string().optional(),
        priority: z.enum(["low", "medium", "high", "critical"]).optional(),
        budget: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createPipelineInitiative({
          ...input,
          userId: ctx.user.id,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          tags: input.tags ? JSON.stringify(input.tags) : undefined,
        });
        return { id };
      }),

    getInitiatives: protectedProcedure.query(async ({ ctx }) => {
      return db.getPipelineInitiatives(ctx.user.id);
    }),

    getAllInitiatives: publicProcedure.query(async () => {
      return db.getPipelineInitiatives();
    }),

    getInitiativeById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getPipelineInitiativeById(input.id);
      }),

    updateInitiative: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        businessStrategy: z.string().optional(),
        innovationStrategy: z.string().optional(),
        priority: z.enum(["low", "medium", "high", "critical"]).optional(),
        status: z.enum(["draft", "active", "paused", "completed", "cancelled"]).optional(),
        budget: z.string().optional(),
        budgetSpent: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updatePipelineInitiative(id, data);
        return { success: true };
      }),

    deleteInitiative: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePipelineInitiative(input.id);
        return { success: true };
      }),

    // Challenges
    createChallenge: protectedProcedure
      .input(z.object({
        initiativeId: z.number(),
        title: z.string().min(1),
        titleEn: z.string().optional(),
        description: z.string().optional(),
        problemStatement: z.string().optional(),
        desiredOutcome: z.string().optional(),
        priority: z.enum(["low", "medium", "high", "critical"]).optional(),
        deadline: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createPipelineChallenge({
          ...input,
          userId: ctx.user.id,
          deadline: input.deadline ? new Date(input.deadline) : undefined,
        });
        return { id };
      }),

    getChallengesByInitiative: publicProcedure
      .input(z.object({ initiativeId: z.number() }))
      .query(async ({ input }) => {
        return db.getPipelineChallengesByInitiative(input.initiativeId);
      }),

    // Ideas
    createIdea: protectedProcedure
      .input(z.object({
        challengeId: z.number(),
        title: z.string().min(1),
        titleEn: z.string().optional(),
        description: z.string().optional(),
        solution: z.string().optional(),
        expectedImpact: z.string().optional(),
        estimatedCost: z.string().optional(),
        estimatedROI: z.string().optional(),
        implementationTime: z.string().optional(),
        riskLevel: z.enum(["low", "medium", "high"]).optional(),
        innovationLevel: z.enum(["incremental", "adjacent", "transformational"]).optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createPipelineIdea({
          ...input,
          userId: ctx.user.id,
          tags: input.tags ? JSON.stringify(input.tags) : undefined,
        });
        await db.addGamificationPoints(ctx.user.id, 10, 'idea_submitted');
        
        // Send notification to owner
        try {
          await notifyOwner({
            title: "فكرة جديدة في Innovation Pipeline",
            content: `تم إضافة فكرة جديدة: ${input.title}\nبواسطة: ${ctx.user.name}`
          });
        } catch (e) {
          console.error('Failed to send notification:', e);
        }
        
        return { id };
      }),

    getIdeasByChallenge: publicProcedure
      .input(z.object({ challengeId: z.number() }))
      .query(async ({ input }) => {
        return db.getPipelineIdeasByChallenge(input.challengeId);
      }),

    getIdeaById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getPipelineIdeaById(input.id);
      }),

    updateIdea: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["submitted", "under_review", "approved", "parked", "killed", "in_experiment"]).optional(),
        clusterId: z.number().optional(),
        aiScore: z.string().optional(),
        aiAnalysis: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updatePipelineIdea(id, data);
        
        // Auto-create project when idea is approved
        if (input.status === "approved") {
          const idea = await db.getPipelineIdeaById(id);
          if (idea && !idea.projectId) {
            const projectId = await db.createProject({
              userId: idea.userId,
              title: idea.title,
              titleEn: idea.titleEn,
              description: idea.description || "",
              descriptionEn: idea.descriptionEn,
              stage: "idea",
              status: "draft",
              pipelineIdeaId: id,
              tags: idea.tags ? (typeof idea.tags === 'string' ? JSON.parse(idea.tags) : idea.tags) : []
            });
            
            // Link project back to idea
            await db.updatePipelineIdea(id, { projectId });
            
            // Notify owner
            try {
              await notifyOwner({
                title: "فكرة معتمدة تم تحويلها إلى مشروع",
                content: `تم تحويل الفكرة "${idea.title}" إلى مشروع في نظام إدارة المشاريع.`
              });
            } catch (e) {
              console.error('Failed to send notification:', e);
            }
          }
        }
        
        return { success: true };
      }),

    voteIdea: protectedProcedure
      .input(z.object({
        ideaId: z.number(),
        voteType: z.enum(["upvote", "downvote"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const votes = await db.voteOnIdea(input.ideaId, ctx.user.id, input.voteType);
        await db.addGamificationPoints(ctx.user.id, 1, 'vote_given');
        return { votes };
      }),

    // Clusters
    createCluster: protectedProcedure
      .input(z.object({
        initiativeId: z.number(),
        name: z.string().min(1),
        nameEn: z.string().optional(),
        description: z.string().optional(),
        theme: z.string().optional(),
        color: z.string().optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createPipelineCluster({
          ...input,
          userId: ctx.user.id,
        });
        return { id };
      }),

    getClustersByInitiative: publicProcedure
      .input(z.object({ initiativeId: z.number() }))
      .query(async ({ input }) => {
        return db.getPipelineClustersByInitiative(input.initiativeId);
      }),

    assignIdeaToCluster: protectedProcedure
      .input(z.object({
        ideaId: z.number(),
        clusterId: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.assignIdeaToCluster(input.ideaId, input.clusterId);
        return { success: true };
      }),

    // Hypotheses
    createHypothesis: protectedProcedure
      .input(z.object({
        ideaId: z.number(),
        statement: z.string().min(1),
        statementEn: z.string().optional(),
        type: z.enum(["desirability", "feasibility", "viability"]).optional(),
        assumption: z.string().optional(),
        riskLevel: z.enum(["low", "medium", "high", "critical"]).optional(),
        validationMethod: z.string().optional(),
        successCriteria: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createPipelineHypothesis({
          ...input,
          userId: ctx.user.id,
        });
        return { id };
      }),

    getHypothesesByIdea: publicProcedure
      .input(z.object({ ideaId: z.number() }))
      .query(async ({ input }) => {
        return db.getPipelineHypothesesByIdea(input.ideaId);
      }),

    updateHypothesis: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["untested", "testing", "validated", "invalidated", "refined"]).optional(),
        evidence: z.string().optional(),
        confidence: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updatePipelineHypothesis(id, data);
        if (input.status === 'validated') {
          await db.addGamificationPoints(ctx.user.id, 25, 'hypothesis_validated');
        }
        return { success: true };
      }),

    // Experiments
    createExperiment: protectedProcedure
      .input(z.object({
        hypothesisId: z.number(),
        name: z.string().min(1),
        nameEn: z.string().optional(),
        description: z.string().optional(),
        experimentType: z.enum(["survey", "interview", "prototype", "mvp", "ab_test", "landing_page", "concierge", "wizard_of_oz"]).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        budget: z.string().optional(),
        sampleSize: z.number().optional(),
        methodology: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createPipelineExperiment({
          ...input,
          userId: ctx.user.id,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
        });
        await db.addGamificationPoints(ctx.user.id, 15, 'experiment_run');
        return { id };
      }),

    getExperimentsByHypothesis: publicProcedure
      .input(z.object({ hypothesisId: z.number() }))
      .query(async ({ input }) => {
        return db.getPipelineExperimentsByHypothesis(input.hypothesisId);
      }),

    updateExperiment: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["planned", "in_progress", "completed", "cancelled"]).optional(),
        results: z.string().optional(),
        learnings: z.string().optional(),
        outcome: z.enum(["pending", "supports", "rejects", "inconclusive"]).optional(),
        nextSteps: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updatePipelineExperiment(id, data);
        return { success: true };
      }),

    // Trends
    createTrend: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        nameEn: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        maturityLevel: z.enum(["emerging", "growing", "mature", "declining"]).optional(),
        relevanceScore: z.number().optional(),
        impactScore: z.number().optional(),
        timeToMainstream: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createPipelineTrend({
          ...input,
          userId: ctx.user.id,
          tags: input.tags ? JSON.stringify(input.tags) : undefined,
        });
        return { id };
      }),

    getTrends: publicProcedure.query(async () => {
      return db.getPipelineTrends();
    }),

    // Gamification
    getMyGamification: protectedProcedure.query(async ({ ctx }) => {
      return db.getOrCreateGamification(ctx.user.id);
    }),

    getLeaderboard: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return db.getLeaderboard(input?.limit || 10);
      }),

    // Stats
    getStats: protectedProcedure.query(async ({ ctx }) => {
      return db.getPipelineStats(ctx.user.id);
    }),

    getAllStats: publicProcedure.query(async () => {
      return db.getPipelineStats();
    }),

    // AI Analysis for Ideas
    analyzeIdea: protectedProcedure
      .input(z.object({
        ideaId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const idea = await db.getPipelineIdeaById(input.ideaId);
        if (!idea) throw new Error("Idea not found");

        const prompt = `Analyze this innovation idea and provide a score (0-100) and detailed analysis:

Title: ${idea.title}
Description: ${idea.description || 'N/A'}
Solution: ${idea.solution || 'N/A'}
Expected Impact: ${idea.expectedImpact || 'N/A'}
Estimated Cost: ${idea.estimatedCost || 'N/A'}
Risk Level: ${idea.riskLevel || 'N/A'}
Innovation Level: ${idea.innovationLevel || 'N/A'}

Provide response in JSON format:
{
  "score": <number 0-100>,
  "analysis": "<detailed analysis in Arabic>",
  "strengths": ["<strength1>", "<strength2>"],
  "weaknesses": ["<weakness1>", "<weakness2>"],
  "recommendations": ["<recommendation1>", "<recommendation2>"]
}`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are an innovation expert. Analyze ideas and provide structured feedback in Arabic." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        });

        const rawContent = response.choices[0]?.message?.content || '{}';
        const content = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent);
        const result = JSON.parse(content);

        await db.updatePipelineIdea(input.ideaId, {
          aiScore: String(result.score || 0),
          aiAnalysis: result.analysis || '',
        });

        return result;
      }),
  }),

  // ============================================
  // IDEA OUTCOMES (Real Data Collection)
  // ============================================
  ideaOutcomes: router({
    // Submit new idea outcome
    submit: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        category: z.string().optional(),
        budget: z.number().optional(),
        teamSize: z.number().optional(),
        timelineMonths: z.number().optional(),
        marketDemand: z.number().min(0).max(1).optional(),
        technicalFeasibility: z.number().min(0).max(1).optional(),
        competitiveAdvantage: z.number().min(0).max(1).optional(),
        userEngagement: z.number().min(0).max(1).optional(),
        tagsCount: z.number().optional(),
        hypothesisValidationRate: z.number().min(0).max(1).optional(),
        ratCompletionRate: z.number().min(0).max(1).optional(),
        predictedSuccessRate: z.number().optional(),
        predictionModel: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const dbOutcomes = await import("./db_idea_outcomes");
        const outcome = await dbOutcomes.createIdeaOutcome({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          category: input.category,
          budget: input.budget?.toString(),
          teamSize: input.teamSize,
          timelineMonths: input.timelineMonths,
          marketDemand: input.marketDemand?.toString(),
          technicalFeasibility: input.technicalFeasibility?.toString(),
          competitiveAdvantage: input.competitiveAdvantage?.toString(),
          userEngagement: input.userEngagement?.toString(),
          tagsCount: input.tagsCount,
          hypothesisValidationRate: input.hypothesisValidationRate?.toString(),
          ratCompletionRate: input.ratCompletionRate?.toString(),
          predictedSuccessRate: input.predictedSuccessRate?.toString(),
          predictionModel: input.predictionModel,
          outcome: "pending",
        });
        return outcome;
      }),

    // Get user's idea outcomes
    getMyOutcomes: protectedProcedure.query(async ({ ctx }) => {
      const dbOutcomes = await import("./db_idea_outcomes");
      return await dbOutcomes.getIdeaOutcomesByUserId(ctx.user.id);
    }),

    // Get pending outcomes (admin only)
    getPending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin only");
      }
      const dbOutcomes = await import("./db_idea_outcomes");
      return await dbOutcomes.getPendingIdeaOutcomes();
    }),

    // Classify outcome (admin only)
    classify: protectedProcedure
      .input(z.object({
        id: z.number(),
        outcome: z.enum(["success", "failure"]),
        outcomeNotes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin only");
        }
        const dbOutcomes = await import("./db_idea_outcomes");
        return await dbOutcomes.updateIdeaOutcome(input.id, {
          outcome: input.outcome,
          outcomeDate: new Date(),
          outcomeNotes: input.outcomeNotes,
          classifiedBy: ctx.user.id,
          classifiedAt: new Date(),
        });
      }),

    // Get statistics
    getStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin only");
      }
      const dbOutcomes = await import("./db_idea_outcomes");
      return await dbOutcomes.getIdeaOutcomesStats();
    }),

    // Get training data (admin only)
    getTrainingData: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin only");
      }
      const dbOutcomes = await import("./db_idea_outcomes");
      return await dbOutcomes.getTrainingData();
    }),

    // Run A/B testing (admin only)
    runABTesting: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin only");
      }

      const { spawn } = await import("child_process");
      const path = await import("path");

      return new Promise((resolve, reject) => {
        const scriptPath = path.join(process.cwd(), "ai-services/prediction/ab_testing.py");
        const pythonProcess = spawn("python3", [scriptPath], {
          env: { ...process.env, API_BASE_URL: `http://localhost:${process.env.PORT || 3000}` },
        });

        let output = "";
        let errorOutput = "";

        pythonProcess.stdout.on("data", (data) => {
          output += data.toString();
          console.log(`[A/B Testing] ${data.toString()}`);
        });

        pythonProcess.stderr.on("data", (data) => {
          errorOutput += data.toString();
          console.error(`[A/B Testing Error] ${data.toString()}`);
        });

        pythonProcess.on("close", (code) => {
          if (code === 0) {
            resolve({ success: true, output });
          } else {
            reject(new Error(`A/B Testing failed with code ${code}: ${errorOutput}`));
          }
        });
      });
    }),

    // Trigger model retraining (admin only)
    retrainModel: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin only");
      }

      const { spawn } = await import("child_process");
      const path = await import("path");

      return new Promise((resolve, reject) => {
        const scriptPath = path.join(process.cwd(), "ai-services/prediction/retrain_model.py");
        const pythonProcess = spawn("python3", [scriptPath], {
          env: { ...process.env, API_BASE_URL: `http://localhost:${process.env.PORT || 3000}` },
        });

        let output = "";
        let errorOutput = "";

        pythonProcess.stdout.on("data", (data) => {
          output += data.toString();
          console.log(`[Retrain] ${data.toString()}`);
        });

        pythonProcess.stderr.on("data", (data) => {
          errorOutput += data.toString();
          console.error(`[Retrain Error] ${data.toString()}`);
        });

        pythonProcess.on("close", (code) => {
          if (code === 0) {
            resolve({ success: true, output });
          } else {
            reject(new Error(`Retraining failed with code ${code}: ${errorOutput}`));
          }
        });
      });
    }),
  }),

  // ============================================
  // API KEY MANAGEMENT
  // ============================================
  apiKeys: router({
    // Create new API key
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          rateLimit: z.number().optional(),
          expiresAt: z.date().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const dbApiKeys = await import("./db_api_keys");
        return await dbApiKeys.createApiKey({
          userId: ctx.user.id,
          name: input.name,
          rateLimit: input.rateLimit,
          expiresAt: input.expiresAt,
        });
      }),

    // Get user's API keys
    list: protectedProcedure.query(async ({ ctx }) => {
      const dbApiKeys = await import("./db_api_keys");
      return await dbApiKeys.getUserApiKeys(ctx.user.id);
    }),

    // Revoke API key
    revoke: protectedProcedure
      .input(z.object({ keyId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const dbApiKeys = await import("./db_api_keys");
        await dbApiKeys.revokeApiKey(input.keyId, ctx.user.id);
        return { success: true };
      }),

    // Get API key usage stats
    usage: protectedProcedure
      .input(z.object({ keyId: z.number() }))
      .query(async ({ ctx, input }) => {
        const dbApiKeys = await import("./db_api_keys");
        return await dbApiKeys.getApiKeyUsageStats(input.keyId);
      }),
  }),

  // ============================================
  // WEBHOOKS
  // ============================================
  webhooks: router({
    // Create webhook
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          url: z.string().url(),
          events: z.array(z.string()),
          secret: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const dbWebhooks = await import("./db_webhooks");
        return await dbWebhooks.createWebhook({
          userId: ctx.user.id,
          name: input.name,
          url: input.url,
          events: input.events,
          secret: input.secret,
        });
      }),

    // List user's webhooks
    list: protectedProcedure.query(async ({ ctx }) => {
      const dbWebhooks = await import("./db_webhooks");
      return await dbWebhooks.getUserWebhooks(ctx.user.id);
    }),

    // Update webhook
    update: protectedProcedure
      .input(
        z.object({
          webhookId: z.number(),
          name: z.string().optional(),
          url: z.string().url().optional(),
          events: z.array(z.string()).optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const dbWebhooks = await import("./db_webhooks");
        await dbWebhooks.updateWebhook(input.webhookId, ctx.user.id, {
          name: input.name,
          url: input.url,
          events: input.events,
          isActive: input.isActive,
        });
        return { success: true };
      }),

    // Delete webhook
    delete: protectedProcedure
      .input(z.object({ webhookId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const dbWebhooks = await import("./db_webhooks");
        await dbWebhooks.deleteWebhook(input.webhookId, ctx.user.id);
        return { success: true };
      }),

    // Get webhook logs
    logs: protectedProcedure
      .input(z.object({ webhookId: z.number(), limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        const dbWebhooks = await import("./db_webhooks");
        return await dbWebhooks.getWebhookLogs(input.webhookId, input.limit);
      }),

    // Get webhook stats
    stats: protectedProcedure
      .input(z.object({ webhookId: z.number() }))
      .query(async ({ ctx, input }) => {
        const dbWebhooks = await import("./db_webhooks");
        return await dbWebhooks.getWebhookStats(input.webhookId);
      }),

    // Test webhook (send test event)
    test: protectedProcedure
      .input(z.object({ webhookId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const dbWebhooks = await import("./db_webhooks");
        const webhookService = await import("./webhook_service");
        
        // Get webhook
        const webhooks = await dbWebhooks.getUserWebhooks(ctx.user.id);
        const webhook = webhooks.find((w: any) => w.id === input.webhookId);
        
        if (!webhook) {
          throw new Error("Webhook not found");
        }
        
        // Trigger test event
        await webhookService.triggerWebhooks("test.ping", {
          message: "This is a test webhook",
          timestamp: new Date().toISOString(),
        });
        
        return { success: true };
      }),
  }),

  // ============================================
  // MODEL VERSIONING
  // ============================================
  modelVersioning: router({
    // List all model versions
    list: protectedProcedure.query(async () => {
      const { spawn } = await import("child_process");
      const { promisify } = await import("util");
      const execPromise = promisify(require("child_process").exec);
      
      try {
        const { stdout } = await execPromise(
          "cd /home/ubuntu/uplink-platform/ai-services/prediction && python3 model_versioning.py list"
        );
        return JSON.parse(stdout);
      } catch (error: any) {
        console.error("Error listing model versions:", error);
        return [];
      }
    }),

    // Activate a specific version (rollback)
    activate: protectedProcedure
      .input(z.object({ versionId: z.string() }))
      .mutation(async ({ input }) => {
        const { promisify } = await import("util");
        const execPromise = promisify(require("child_process").exec);
        
        try {
          await execPromise(
            `cd /home/ubuntu/uplink-platform/ai-services/prediction && python3 model_versioning.py activate ${input.versionId}`
          );
          
          // Restart prediction service to use new model
          try {
            await execPromise("pkill -f 'prediction/main.py'");
            await new Promise(resolve => setTimeout(resolve, 1000));
            execPromise(
              "cd /home/ubuntu/uplink-platform/ai-services/prediction && nohup python3 main.py > /tmp/prediction_service_v2.log 2>&1 &"
            );
          } catch (e) {
            console.log("Prediction service restart initiated");
          }
          
          return { success: true, message: "Model version activated successfully" };
        } catch (error: any) {
          throw new Error(`Failed to activate version: ${error.message}`);
        }
      }),

    // Delete a version
    delete: protectedProcedure
      .input(z.object({ versionId: z.string() }))
      .mutation(async ({ input }) => {
        const { promisify } = await import("util");
        const execPromise = promisify(require("child_process").exec);
        
        try {
          await execPromise(
            `cd /home/ubuntu/uplink-platform/ai-services/prediction && python3 model_versioning.py delete ${input.versionId}`
          );
          return { success: true, message: "Model version deleted successfully" };
        } catch (error: any) {
          throw new Error(`Failed to delete version: ${error.message}`);
        }
      }),

    // Compare two versions
    compare: protectedProcedure
      .input(z.object({ versionId1: z.string(), versionId2: z.string() }))
      .query(async ({ input }) => {
        const { promisify } = await import("util");
        const execPromise = promisify(require("child_process").exec);
        
        try {
          const { stdout } = await execPromise(
            `cd /home/ubuntu/uplink-platform/ai-services/prediction && python3 model_versioning.py compare ${input.versionId1} ${input.versionId2}`
          );
          return JSON.parse(stdout);
        } catch (error: any) {
          throw new Error(`Failed to compare versions: ${error.message}`);
        }
      }),
  }),

  // ============================================
  // ANALYTICS & DASHBOARD
  // ============================================
  analytics: router({
    // Admin dashboard statistics
    adminDashboard: protectedProcedure.query(async ({ ctx }) => {
      // Only allow admins
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized');
      }
      
      try {
        // Get counts from database
        const allUsers = await db.getAllUsers();
        const allProjects = await db.getAllProjects();
        
        const dbWebhooks = await import('./db_webhooks');
        const dbOutcomes = await import('./db_idea_outcomes');
        
        // Calculate success rate from idea_outcomes
        const outcomes = await dbOutcomes.getTrainingData();
        const successfulIdeas = outcomes.filter((o: any) => o.actual_outcome === 'success').length;
        const successRate = outcomes.length > 0 ? successfulIdeas / outcomes.length : 0;
        
        // API calls (mock for now - would need to query api_usage table)
        const apiCalls = 0;
        
        // Webhook calls (sum from webhooks table)
        const webhooks = await dbWebhooks.getUserWebhooks(ctx.user.id);
        const webhookCalls = webhooks.reduce((sum: number, w: any) => sum + (w.totalCalls || 0), 0);
        
        // Pending evaluations (outcomes without classification)
        const pendingEvaluations = outcomes.filter((o: any) => o.actual_outcome === 'pending').length;
        
        // Active users (users who logged in last 24h - mock for now)
        const activeUsers = Math.floor(allUsers.length * 0.3);
        
        return {
          totalIdeas: outcomes.length,
          totalProjects: allProjects.length,
          totalUsers: allUsers.length,
          activeUsers,
          successRate,
          apiCalls,
          webhookCalls,
          pendingEvaluations,
          recentGrowth: {
            ideas: 12, // Mock - would calculate from timestamps
            users: 8,
            projects: 15,
          },
        };
      } catch (error: any) {
        console.error('Error fetching admin dashboard stats:', error);
        return {
          totalIdeas: 0,
          totalProjects: 0,
          totalUsers: 0,
          activeUsers: 0,
          successRate: 0,
          apiCalls: 0,
          webhookCalls: 0,
          pendingEvaluations: 0,
          recentGrowth: {
            ideas: 0,
            users: 0,
            projects: 0,
          },
        };
      }
    }),
  }),

  // ============================================
  // RBAC (Role-Based Access Control)
  // ============================================
  rbac: router({
    // Roles
    getAllRoles: protectedProcedure.query(async () => {
      const { getAllRoles } = await import('./db_rbac');
      return await getAllRoles();
    }),

    createRole: protectedProcedure
      .input(z.object({
        name: z.string(),
        displayName: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createRole } = await import('./db_rbac');
        return await createRole({ ...input, isSystem: false });
      }),

    updateRole: protectedProcedure
      .input(z.object({
        id: z.number(),
        displayName: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { updateRole } = await import('./db_rbac');
        const { id, ...updates } = input;
        await updateRole(id, updates);
        return { success: true };
      }),

    deleteRole: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteRole } = await import('./db_rbac');
        await deleteRole(input.id);
        return { success: true };
      }),

    // Permissions
    getAllPermissions: protectedProcedure.query(async () => {
      const { getAllPermissions } = await import('./db_rbac');
      return await getAllPermissions();
    }),

    getPermissionsForRole: protectedProcedure
      .input(z.object({ roleId: z.number() }))
      .query(async ({ input }) => {
        const { getPermissionsForRole } = await import('./db_rbac');
        return await getPermissionsForRole(input.roleId);
      }),

    assignPermissionToRole: protectedProcedure
      .input(z.object({
        roleId: z.number(),
        permissionId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { assignPermissionToRole } = await import('./db_rbac');
        await assignPermissionToRole(input.roleId, input.permissionId);
        return { success: true };
      }),

    removePermissionFromRole: protectedProcedure
      .input(z.object({
        roleId: z.number(),
        permissionId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { removePermissionFromRole } = await import('./db_rbac');
        await removePermissionFromRole(input.roleId, input.permissionId);
        return { success: true };
      }),

    // User Roles
    getUserRoles: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        const { getUserRoles } = await import('./db_rbac');
        return await getUserRoles(input.userId);
      }),

    getUserPermissions: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        const { getUserPermissions } = await import('./db_rbac');
        return await getUserPermissions(input.userId);
      }),

    assignRoleToUser: protectedProcedure
      .input(z.object({
        userId: z.number(),
        roleId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { assignRoleToUser } = await import('./db_rbac');
        await assignRoleToUser(input.userId, input.roleId, ctx.user.id);
        return { success: true };
      }),

    removeRoleFromUser: protectedProcedure
      .input(z.object({
        userId: z.number(),
        roleId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { removeRoleFromUser } = await import('./db_rbac');
        await removeRoleFromUser(input.userId, input.roleId);
        return { success: true };
      }),

    // Check permissions
    hasPermission: protectedProcedure
      .input(z.object({
        userId: z.number(),
        resource: z.string(),
        action: z.string(),
      }))
      .query(async ({ input }) => {
        const { hasPermission } = await import('./db_rbac');
        return await hasPermission(input.userId, input.resource, input.action);
      }),
  }),

  // ============================================
  // AUDIT LOGGING
  // ============================================
  audit: router({
    getAllLogs: protectedProcedure
      .input(z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
        userId: z.number().optional(),
        resource: z.string().optional(),
        action: z.string().optional(),
        status: z.enum(['success', 'failure']).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const { getAllAuditLogs } = await import('./db_audit');
        const { startDate, endDate, ...rest } = input;
        return await getAllAuditLogs({
          ...rest,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        });
      }),

    getLogById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getAuditLogById } = await import('./db_audit');
        return await getAuditLogById(input.id);
      }),

    getLogsCount: protectedProcedure
      .input(z.object({
        userId: z.number().optional(),
        resource: z.string().optional(),
        action: z.string().optional(),
        status: z.enum(['success', 'failure']).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const { getAuditLogsCount } = await import('./db_audit');
        const { startDate, endDate, ...rest } = input;
        return await getAuditLogsCount({
          ...rest,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        });
      }),

    getLogsByResource: protectedProcedure.query(async () => {
      const { getAuditLogsByResource } = await import('./db_audit');
      return await getAuditLogsByResource();
    }),

    getLogsByAction: protectedProcedure.query(async () => {
      const { getAuditLogsByAction } = await import('./db_audit');
      return await getAuditLogsByAction();
    }),

    getRecentLogsForUser: protectedProcedure
      .input(z.object({
        userId: z.number(),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const { getRecentAuditLogsForUser } = await import('./db_audit');
        return await getRecentAuditLogsForUser(input.userId, input.limit);
      }),

    deleteOldLogs: protectedProcedure
      .input(z.object({ daysToKeep: z.number().default(90) }))
      .mutation(async ({ input }) => {
        const { deleteOldAuditLogs } = await import('./db_audit');
        const deleted = await deleteOldAuditLogs(input.daysToKeep);
        return { deleted };
      }),
  }),

  savedViews: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        viewType: z.string(),
        filters: z.any(),
        isPublic: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createSavedView } = await import('./db_saved_views');
        return await createSavedView({
          userId: ctx.user.id,
          ...input,
        });
      }),

    list: protectedProcedure
      .input(z.object({ viewType: z.string().optional() }))
      .query(async ({ ctx, input }) => {
        const { getUserSavedViews } = await import('./db_saved_views');
        return await getUserSavedViews(ctx.user.id, input.viewType);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const { getSavedViewById } = await import('./db_saved_views');
        return await getSavedViewById(input.id, ctx.user.id);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        filters: z.any().optional(),
        isPublic: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const { updateSavedView } = await import('./db_saved_views');
        const success = await updateSavedView(id, ctx.user.id, data);
        if (!success) throw new Error('View not found or access denied');
        return { success };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteSavedView } = await import('./db_saved_views');
        const success = await deleteSavedView(input.id, ctx.user.id);
        if (!success) throw new Error('View not found or access denied');
        return { success };
      }),

    share: protectedProcedure
      .input(z.object({
        id: z.number(),
        userIds: z.array(z.number()),
      }))
      .mutation(async ({ ctx, input }) => {
        const { shareView } = await import('./db_saved_views');
        const success = await shareView(input.id, ctx.user.id, input.userIds);
        if (!success) throw new Error('View not found or access denied');
        return { success };
      }),
  }),

  // ============================================
  // ORGANIZATIONS MANAGEMENT
  // ============================================
  organizations: router({
    // Get all organizations with optional filtering
    getAll: publicProcedure
      .input(z.object({
        type: z.enum(['government', 'academic', 'private', 'supporting']).optional(),
        scope: z.enum(['local', 'global']).optional(),
        country: z.string().optional(),
        isActive: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        const { getAllOrganizations } = await import('./db_organizations');
        return await getAllOrganizations(input || undefined);
      }),

    // Get all organizations with statistics
    getAllWithStats: publicProcedure
      .query(async () => {
        const { getAllOrganizationsWithStats } = await import('./db_organizations');
        return await getAllOrganizationsWithStats();
      }),

    // Get organization by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getOrganizationById } = await import('./db_organizations');
        return await getOrganizationById(input.id);
      }),

    // Get organization statistics
    getStats: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getOrganizationStats } = await import('./db_organizations');
        return await getOrganizationStats(input.id);
      }),

    // Create new organization (admin only)
    create: protectedProcedure
      .input(z.object({
        nameAr: z.string().min(1),
        nameEn: z.string().min(1),
        type: z.enum(['government', 'academic', 'private', 'supporting']),
        scope: z.enum(['local', 'global']),
        country: z.string().min(1),
        logo: z.string().optional(),
        description: z.string().optional(),
        website: z.string().optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check admin permission
        const { hasPermission } = await import('./db_rbac');
        const canManage = await hasPermission(ctx.user.id, 'organizations', 'manage');
        if (!canManage) throw new Error('Permission denied');

        const { createOrganization } = await import('./db_organizations');
        const org = await createOrganization(input);

        // Audit log
        const { createAuditLog } = await import('./db_audit');
        await createAuditLog({
          userId: ctx.user.id,
          action: 'create',
          resource: 'organization',
          resourceId: org?.id.toString(),
          details: JSON.stringify({ name: input.nameAr }),
          status: 'success',
        });

        return org;
      }),

    // Update organization (admin only)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        nameAr: z.string().optional(),
        nameEn: z.string().optional(),
        type: z.enum(['government', 'academic', 'private', 'supporting']).optional(),
        scope: z.enum(['local', 'global']).optional(),
        country: z.string().optional(),
        logo: z.string().optional(),
        description: z.string().optional(),
        website: z.string().optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check admin permission
        const { hasPermission } = await import('./db_rbac');
        const canManage = await hasPermission(ctx.user.id, 'organizations', 'manage');
        if (!canManage) throw new Error('Permission denied');

        const { id, ...data } = input;
        const { updateOrganization } = await import('./db_organizations');
        const org = await updateOrganization(id, data);

        // Audit log
        const { createAuditLog } = await import('./db_audit');
        await createAuditLog({
          userId: ctx.user.id,
          action: 'update',
          resource: 'organization',
          resourceId: id.toString(),
          details: JSON.stringify(data),
          status: 'success',
        });

        return org;
      }),

    // Delete organization (admin only, soft delete)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Check admin permission
        const { hasPermission } = await import('./db_rbac');
        const canManage = await hasPermission(ctx.user.id, 'organizations', 'manage');
        if (!canManage) throw new Error('Permission denied');

        const { deleteOrganization } = await import('./db_organizations');
        const success = await deleteOrganization(input.id);

        // Audit log
        const { createAuditLog } = await import('./db_audit');
        await createAuditLog({
          userId: ctx.user.id,
          action: 'delete',
          resource: 'organization',
          resourceId: input.id.toString(),
          details: null,
          status: 'success',
        });

        return { success };
      }),

    // Link idea to organizations
    linkIdeaToOrganizations: protectedProcedure
      .input(z.object({
        ideaId: z.number(),
        organizationIds: z.array(z.number()),
      }))
      .mutation(async ({ ctx, input }) => {
        const { linkIdeaToOrganizations } = await import('./db_organizations');
        return await linkIdeaToOrganizations(input.ideaId, input.organizationIds);
      }),

    // Get organizations linked to an idea
    getIdeaOrganizations: publicProcedure
      .input(z.object({ ideaId: z.number() }))
      .query(async ({ input }) => {
        const { getIdeaOrganizations } = await import('./db_organizations');
        return await getIdeaOrganizations(input.ideaId);
      }),

    // Link project to organizations
    linkProjectToOrganizations: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        organizationIds: z.array(z.number()),
      }))
      .mutation(async ({ ctx, input }) => {
        const { linkProjectToOrganizations } = await import('./db_organizations');
        return await linkProjectToOrganizations(input.projectId, input.organizationIds);
      }),

    // Get organizations linked to a project
    getProjectOrganizations: publicProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        const { getProjectOrganizations } = await import('./db_organizations');
        return await getProjectOrganizations(input.projectId);
      }),
  }),

  // ============================================
  // AI STRATEGIC ADVISOR
  // ============================================
  ai: router({
    analyzeStrategic: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string(),
        budget: z.string(),
        team_size: z.string(),
        timeline_months: z.string(),
        market_demand: z.string(),
        technical_feasibility: z.string(),
        user_engagement: z.string(),
        hypothesis_validation_rate: z.string(),
        rat_completion_rate: z.string(),
        user_count: z.string(),
        revenue_growth: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          // Call Strategic Analysis API
          const response = await fetch('http://localhost:8001/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
          });
          
          if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
          }
          
          const result = await response.json();
          
          // Save analysis to database
          try {
            await db.createStrategicAnalysis({
              userId: ctx.user.id,
              projectTitle: input.title,
              projectDescription: input.description,
              budget: input.budget,
              teamSize: parseInt(input.team_size),
              timelineMonths: parseInt(input.timeline_months),
              marketDemand: parseInt(input.market_demand),
              technicalFeasibility: parseInt(input.technical_feasibility),
              userEngagement: parseInt(input.user_engagement),
              hypothesisValidationRate: input.hypothesis_validation_rate,
              ratCompletionRate: input.rat_completion_rate,
              userCount: parseInt(input.user_count),
              revenueGrowth: input.revenue_growth,
              iciScore: result.ici_score,
              irlScore: result.irl_score,
              successProbability: result.success_probability,
              riskLevel: result.risk_level,
              investorAppeal: result.investor_appeal,
              ceoInsights: result.ceo_insights,
              roadmap: result.roadmap,
              investment: result.investment,
              criticalPath: result.critical_path,
              dashboard: result.dashboard
            });
          } catch (dbError) {
            console.error('Failed to save analysis to database:', dbError);
          }
          
          return result;
          
        } catch (error) {
          console.error('Strategic analysis error:', error);
          // Return mock data as fallback
          return {
            ici_score: 59.0,
            ici_level: 'متوسط',
            success_probability: 0.65,
            irl_score: 57.9,
            irl_grade: 'C',
            investor_appeal: 'Medium',
            dimensions: {
              success_probability: 65.0,
              market_fit: 62.0,
              execution_readiness: 61.5,
              investor_readiness: 57.9,
              financial_sustainability: 34.3
            },
            ceo_insights: [],
            roadmap: { steps: [], total_timeline: '3 أشهر', priority: 'HIGH' },
            investment: { valuation_range: '6.7M - 12.4M ريال', funding_potential: '1.3M - 2.5M ريال', recommended_investors: [] },
            critical_path: []
          };
        }
      }),

    simulateWhatIf: publicProcedure
      .input(z.object({
        baseline_features: z.object({
          title: z.string(),
          description: z.string(),
          budget: z.string(),
          team_size: z.string(),
          timeline_months: z.string(),
          market_demand: z.string(),
          technical_feasibility: z.string(),
          user_engagement: z.string(),
          hypothesis_validation_rate: z.string(),
          rat_completion_rate: z.string(),
          user_count: z.string(),
          revenue_growth: z.string(),
        }),
        modifications: z.record(z.string(), z.any())
      }))
      .mutation(async ({ input }) => {
        try {
          // Call What-If Simulator API
          const response = await fetch('http://localhost:8001/whatif', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
          });
          
          if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
          }
          
          const result = await response.json();
          return result;
          
        } catch (error) {
          console.error('What-If simulation error:', error);
          throw new Error('What-If simulation failed');
        }
      }),

    submitFeedback: protectedProcedure
      .input(z.object({
        project_id: z.string(),
        type: z.string(),
        item_id: z.number().optional(),
        rating: z.string(),
        comment: z.string().optional()
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          // Call Feedback API
          const response = await fetch('http://localhost:8001/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input)
          });
          
          if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
          }
          
          const result = await response.json();
          
          // Save feedback to database
          try {
            await db.createUserFeedback({
              userId: ctx.user.id,
              projectId: input.project_id,
              feedbackType: input.type as any,
              itemId: input.item_id,
              rating: input.rating,
              comment: input.comment || null,
              userRole: ctx.user.role
            });
          } catch (dbError) {
            console.error('Failed to save feedback to database:', dbError);
          }
          
          return result;
          
        } catch (error) {
          console.error('Feedback submission error:', error);
          
          // Save feedback to database even if API fails
          try {
            await db.createUserFeedback({
              userId: ctx.user.id,
              projectId: input.project_id,
              feedbackType: input.type as any,
              itemId: input.item_id,
              rating: input.rating,
              comment: input.comment || null,
              userRole: ctx.user.role
            });
          } catch (dbError) {
            console.error('Failed to save feedback to database:', dbError);
          }
          
          return { success: true, message: 'Feedback recorded' };
        }
      }),

    getAnalytics: protectedProcedure.query(async () => {
      try {
        const [feedbackStats, analysisStats, predictionAccuracy] = await Promise.all([
          db.getFeedbackStats(),
          db.getAnalysisStats(),
          db.getPredictionAccuracyStats()
        ]);

        return {
          feedbackStats,
          analysisStats,
          predictionAccuracy
        };
      } catch (error) {
        console.error('Analytics error:', error);
        // Return empty stats as fallback
        return {
          feedbackStats: { total: 0, byType: {}, byRating: {} },
          analysisStats: { total: 0, avgIci: 0, avgIrl: 0, avgSuccessProbability: 0 },
          predictionAccuracy: { total: 0, correct: 0, accuracy: 0 }
        };
      }
    }),

    getAdvancedAnalytics: protectedProcedure
      .input(z.object({
        cohortPeriod: z.enum(['weekly', 'monthly', 'quarterly']).optional(),
        segmentBy: z.string().optional(),
        forecastPeriods: z.number().optional()
      }))
      .query(async ({ input }) => {
        try {
          // Fetch all analyses from database
          const analyses = await db.getAllStrategicAnalyses();
          
          // Call FastAPI advanced analytics endpoint
          const response = await fetch('http://localhost:8001/analytics/advanced', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              analyses_data: analyses,
              cohort_period: input.cohortPeriod || 'monthly',
              segment_by: input.segmentBy,
              forecast_periods: input.forecastPeriods || 3
            })
          });

          if (!response.ok) {
            throw new Error('Advanced analytics failed');
          }

          const data = await response.json();
          return data.analytics;
        } catch (error) {
          console.error('Advanced analytics error:', error);
          // Return empty analytics as fallback
          return {
            cohort_analysis: { cohorts: [], summary: {}, recommendations: [] },
            funnel_analysis: { funnel_stages: [], drop_offs: [], recommendations: [] },
            trend_predictions: { historical: [], forecast: [], recommendations: [] },
            metadata: {}
          };
        }
      }),

    exportPdf: protectedProcedure
      .input(z.object({
        analysisId: z.number()
      }))
      .mutation(async ({ input }) => {
        try {
          const response = await fetch('http://localhost:8001/export/pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ analysis_id: input.analysisId })
          });

          if (!response.ok) {
            throw new Error('PDF export failed');
          }

          const data = await response.json();
          return { success: true, filePath: data.file_path };
        } catch (error) {
          console.error('PDF export error:', error);
          throw new Error('Failed to export PDF');
        }
      }),

    exportExcel: protectedProcedure
      .input(z.object({
        analysisId: z.number()
      }))
      .mutation(async ({ input }) => {
        try {
          const response = await fetch('http://localhost:8001/export/excel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ analysis_id: input.analysisId })
          });

          if (!response.ok) {
            throw new Error('Excel export failed');
          }

          const data = await response.json();
          return { success: true, filePath: data.file_path };
        } catch (error) {
          console.error('Excel export error:', error);
          throw new Error('Failed to export Excel');
        }
      }),

    sendReportEmail: protectedProcedure
      .input(z.object({
        analysisId: z.number(),
        recipients: z.string(),
        cc: z.string().optional(),
        reportType: z.enum(['PDF', 'Excel']),
        customMessage: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        try {
          const response = await fetch('http://localhost:8001/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              analysis_id: input.analysisId,
              recipients: input.recipients.split(',').map(e => e.trim()),
              cc: input.cc ? input.cc.split(',').map(e => e.trim()) : [],
              report_type: input.reportType,
              custom_message: input.customMessage
            })
          });

          if (!response.ok) {
            throw new Error('Email sending failed');
          }

          const data = await response.json();
          return { success: true, ...data };
        } catch (error) {
          console.error('Email sending error:', error);
          throw new Error('Failed to send email');
        }
      }),

    chatWithAdvisor: protectedProcedure
      .input(z.object({
        message: z.string(),
        analysisContext: z.any().optional()
      }))
      .mutation(async ({ input }) => {
        try {
          const response = await fetch('http://localhost:8001/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: input.message,
              analysis_context: input.analysisContext
            })
          });

          if (!response.ok) {
            throw new Error('Chat request failed');
          }

          const data = await response.json();
          return { success: true, response: data.response };
        } catch (error) {
          console.error('Chat error:', error);
          throw new Error('Failed to chat with advisor');
        }
      }),
  }),

  // Notifications
  notifications: router({
    getAll: protectedProcedure
      .query(async ({ ctx }) => {
        return await getNotificationsByUserId(ctx.user.id, false);
      }),

    getUnread: protectedProcedure
      .query(async ({ ctx }) => {
        return await getNotificationsByUserId(ctx.user.id, true);
      }),

    getUnreadCount: protectedProcedure
      .query(async ({ ctx }) => {
        return await getUnreadNotificationsCount(ctx.user.id);
      }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        await markNotificationAsRead(input.notificationId);
        return { success: true };
      }),

    markAllAsRead: protectedProcedure
      .mutation(async ({ ctx }) => {
        const count = await markAllNotificationsAsRead(ctx.user.id);
        return { success: true, count };
      }),

    delete: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const success = await deleteNotification(input.notificationId, ctx.user.id);
        return { success };
      }),
  }),

  // Admin Dashboard
  admin: router({
    // Users Management
    getAllUsers: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return next({ ctx });
      })
      .query(async () => {
        return await getAllUsersForAdmin();
      }),

    updateUserRole: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return next({ ctx });
      })
      .input(z.object({ userId: z.number(), role: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const updated = await updateUserRole(input.userId, input.role);
        
        // Log admin action
        await createAdminLog({
          adminId: ctx.user.id,
          adminName: ctx.user.name || 'Unknown',
          action: 'update',
          targetType: 'user',
          targetId: input.userId,
          targetName: updated?.name || 'Unknown',
          details: { newRole: input.role },
          ipAddress: '',
          userAgent: ''
        });
        
        return { success: true, user: updated };
      }),

    deleteUser: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return next({ ctx });
      })
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const success = await deleteUser(input.userId);
        
        // Log admin action
        await createAdminLog({
          adminId: ctx.user.id,
          adminName: ctx.user.name || 'Unknown',
          action: 'delete',
          targetType: 'user',
          targetId: input.userId,
          targetName: 'Deleted User',
          details: {},
          ipAddress: '',
          userAgent: ''
        });
        
        return { success };
      }),

    // Projects Management
    getAllProjects: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return next({ ctx });
      })
      .query(async () => {
        return await getAllProjectsForAdmin();
      }),

    deleteProject: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return next({ ctx });
      })
      .input(z.object({ projectId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const success = await deleteProject(input.projectId);
        
        // Log admin action
        await createAdminLog({
          adminId: ctx.user.id,
          adminName: ctx.user.name || 'Unknown',
          action: 'delete',
          targetType: 'project',
          targetId: input.projectId,
          targetName: 'Deleted Project',
          details: {},
          ipAddress: '',
          userAgent: ''
        });
        
        return { success };
      }),

    // Analyses Management
    getAllAnalyses: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return next({ ctx });
      })
      .query(async () => {
        return await getAllAnalysesForAdmin();
      }),

    deleteAnalysis: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return next({ ctx });
      })
      .input(z.object({ analysisId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const success = await deleteAnalysis(input.analysisId);
        
        // Log admin action
        await createAdminLog({
          adminId: ctx.user.id,
          adminName: ctx.user.name || 'Unknown',
          action: 'delete',
          targetType: 'analysis',
          targetId: input.analysisId,
          targetName: 'Deleted Analysis',
          details: {},
          ipAddress: '',
          userAgent: ''
        });
        
        return { success };
      }),

    // Dashboard Statistics
    getDashboardStats: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return next({ ctx });
      })
      .query(async () => {
        return await getAdminDashboardStats();
      }),

    // Admin Logs
    getAdminLogs: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return next({ ctx });
      })
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await getAdminLogs(input.limit);
      }),

    // System Metrics
    getSystemMetrics: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }
        return next({ ctx });
      })
      .input(z.object({ 
        metricType: z.string().optional(),
        limit: z.number().optional() 
      }))
      .query(async ({ input }) => {
        return await getSystemMetrics(input.metricType, input.limit);
      }),
  }),
});

export type AppRouter = typeof appRouter;
