import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import * as db from "./db";
import { getDb } from "./db";
import { userChoices, ideaJourneyEvents } from "../drizzle/schema";
import { eq, asc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { analyzeIdea, validateIdeaInput, getClassificationLevel } from "./naqla1-ai-analyzer";
import crypto from "crypto";
import * as hackathonsService from "./naqla2/hackathons";
import * as eventsService from "./naqla2/events";
import { storagePut } from "./storage";
// import { autoTriggerDecision } from "./services/diamondDecisionPoint"; // Removed - file deleted

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    register: publicProcedure
      .input(z.object({
        role: z.enum(["innovator", "investor", "company"]),
        name: z.string(),
        email: z.string().email(),
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
        // TODO: Implement registration logic
        return { success: true, message: "Registration successful" };
      }),
    
    // MFA (Multi-Factor Authentication)
    setupMFA: protectedProcedure.mutation(async ({ ctx }) => {
      const speakeasy = require('speakeasy');
      const QRCode = require('qrcode');
      
      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `NAQLA 5.0 (${ctx.user.email || ctx.user.name})`,
        issuer: 'NAQLA 5.0'
      });
      
      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
      
      return {
        secret: secret.base32,
        qrCode: qrCodeUrl
      };
    }),
    
    enableMFA: protectedProcedure
      .input(z.object({
        secret: z.string(),
        token: z.string()
      }))
      .mutation(async ({ ctx, input }) => {
        const speakeasy = require('speakeasy');
        
        // Verify token
        const verified = speakeasy.totp.verify({
          secret: input.secret,
          encoding: 'base32',
          token: input.token,
          window: 2
        });
        
        if (!verified) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid verification code'
          });
        }
        
        // Enable MFA
        await db.enableUserMFA(ctx.user.id, input.secret);
        
        return { success: true };
      }),
    
    disableMFA: protectedProcedure
      .input(z.object({
        token: z.string()
      }))
      .mutation(async ({ ctx, input }) => {
        const speakeasy = require('speakeasy');
        
        // Get user MFA status
        const mfaStatus = await db.getUserMFAStatus(ctx.user.id);
        
        if (!mfaStatus.mfaEnabled || !mfaStatus.mfaSecret) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'MFA is not enabled'
          });
        }
        
        // Verify token
        const verified = speakeasy.totp.verify({
          secret: mfaStatus.mfaSecret,
          encoding: 'base32',
          token: input.token,
          window: 2
        });
        
        if (!verified) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid verification code'
          });
        }
        
        // Disable MFA
        await db.disableUserMFA(ctx.user.id);
        
        return { success: true };
      }),
    
    verifyMFA: protectedProcedure
      .input(z.object({
        token: z.string()
      }))
      .mutation(async ({ ctx, input }) => {
        const speakeasy = require('speakeasy');
        
        // Get user MFA status
        const mfaStatus = await db.getUserMFAStatus(ctx.user.id);
        
        if (!mfaStatus.mfaEnabled || !mfaStatus.mfaSecret) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'MFA is not enabled'
          });
        }
        
        // Verify token
        const verified = speakeasy.totp.verify({
          secret: mfaStatus.mfaSecret,
          encoding: 'base32',
          token: input.token,
          window: 2
        });
        
        return { verified };
      }),
    
    getMFAStatus: protectedProcedure.query(async ({ ctx }) => {
      const mfaStatus = await db.getUserMFAStatus(ctx.user.id);
      return { mfaEnabled: mfaStatus.mfaEnabled };
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

    // Added for Flowchart Match - Settings endpoint
    updateSettings: protectedProcedure
      .input(z.object({
        language: z.string().optional(),
        notifications: z.object({
          email: z.boolean(),
          push: z.boolean(),
          sms: z.boolean(),
        }).optional(),
        privacy: z.object({
          profileVisible: z.boolean(),
          showEmail: z.boolean(),
          showPhone: z.boolean(),
        }).optional(),
        password: z.object({
          currentPassword: z.string(),
          newPassword: z.string(),
        }).optional(),
      })).mutation(async ({ ctx, input }) => {
        // TODO: Implement settings update logic in db.ts
        return { success: true };
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
      .input(z.object({ engine: z.enum(["naqla1", "naqla2", "naqla3"]) }))
      .query(async ({ input }) => {
        return db.getProjectsByEngine(input.engine);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["draft", "submitted", "evaluating", "approved", "matched", "contracted", "completed", "rejected"]).optional(),
        engine: z.enum(["naqla1", "naqla2", "naqla3"]).optional(),
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
          blockchainTimestamp: new Date().toISOString(),
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
          filingDate: new Date().toISOString(),
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
  // NAQLA1: AI-POWERED IDEA ANALYSIS
  // ============================================
  naqla1: router({
    // Submit a new idea for AI analysis
    submitIdea: protectedProcedure
      .input(z.object({
        title: z.string().min(10, "العنوان يجب أن يكون 10 أحرف على الأقل"),
        description: z.string().min(50, "الوصف يجب أن يكون 50 حرفًا على الأقل"),
        problem: z.string().min(30, "وصف المشكلة يجب أن يكون 30 حرفًا على الأقل"),
        solution: z.string().min(30, "وصف الحل يجب أن يكون 30 حرفًا على الأقل"),
    targetMarket: z.string().optional(),
    uniqueValue: z.string().optional(),
    challengeId: z.number().optional(), // Optional: Link to a challenge in NAQLA2
        category: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Validate input
        const validation = validateIdeaInput(input);
        if (!validation.valid) {
          throw new Error(validation.errors.join(", "));
        }

        // Create idea record
        const ideaId = await db.createIdea({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          problem: input.problem,
          solution: input.solution,
          targetMarket: input.targetMarket,
          uniqueValue: input.uniqueValue,
          category: input.category || "general",
          status: "submitted",
          challengeId: input.challengeId, // Optional: Link to a challenge in NAQLA2
        });

        // Perform AI analysis immediately
        try {
          const analysisResult = await analyzeIdea({
            title: input.title,
            description: input.description,
            problem: input.problem,
            solution: input.solution,
            targetMarket: input.targetMarket,
            uniqueValue: input.uniqueValue,
            category: input.category,
          });

          // Debug: Log analysis result
          console.log('[DEBUG] Analysis Result:', JSON.stringify(analysisResult, null, 2));

          // Save analysis result to database
          // Helper function to safely stringify or return null
          const safeStringify = (value: any) => {
            if (value === undefined || value === null) return null;
            if (typeof value === 'string') return value;
            try {
              return JSON.stringify(value);
            } catch {
              return null;
            }
          };

          // Helper function to safely convert to string or return "0"
          const safeToString = (value: any, defaultValue: string = "0") => {
            if (value === undefined || value === null) return defaultValue;
            return String(value);
          };

          // Convert criterionScores (array or object) to individual scores
          const criterionScores = analysisResult.criterionScores || [];
          const scores: any = Array.isArray(criterionScores)
            ? criterionScores.reduce((acc: any, item: any) => {
                acc[item.criterion] = item;
                return acc;
              }, {})
            : criterionScores;
          
          console.log('[DEBUG] About to create idea analysis');
          console.log('[DEBUG] ideaId:', ideaId);
          console.log('[DEBUG] overallScore:', analysisResult.overallScore);
          
          const analysisId = await db.createIdeaAnalysis({
            ideaId,
            overallScore: safeToString(analysisResult.overallScore),
            classification: analysisResult.classification,
            technicalNoveltyScore: safeToString(scores.technicalNovelty?.score),
            socialImpactScore: safeToString(scores.socialImpact?.score),
            technicalFeasibilityScore: safeToString(scores.technicalFeasibility?.score),
            commercialValueScore: safeToString(scores.commercialValue?.score),
            scalabilityScore: safeToString(scores.scalability?.score),
            sustainabilityScore: safeToString(scores.sustainability?.score),
            technicalRiskScore: safeToString(scores.technicalRisk?.score),
            timeToMarketScore: safeToString(scores.timeToMarket?.score),
            competitiveAdvantageScore: safeToString(scores.competitiveAdvantage?.score),
            organizationalReadinessScore: safeToString(scores.organizationalReadiness?.score),
            trlLevel: null,
            trlDescription: null,
            currentStageGate: null,
            stageGateRecommendation: null,
            aiAnalysis: analysisResult.aiAnalysis || null,
            strengths: safeStringify(analysisResult.strengths),
            weaknesses: safeStringify(analysisResult.weaknesses),
            opportunities: safeStringify(analysisResult.opportunities),
            threats: safeStringify(analysisResult.threats),
            recommendations: safeStringify(analysisResult.recommendations),
            nextSteps: safeStringify(analysisResult.nextSteps),
            similarInnovations: safeStringify(analysisResult.similarInnovations),
            extractedKeywords: safeStringify(analysisResult.extractedKeywords),
            sentimentScore: safeToString(analysisResult.sentimentScore),
            complexityLevel: analysisResult.complexityLevel || "medium",
            marketSize: analysisResult.marketSize || "medium",
            competitionLevel: analysisResult.competitionLevel || "medium",
            marketTrends: safeStringify(analysisResult.marketTrends),
            status: "completed",
            processingTime: safeToString(analysisResult.processingTime),
            analyzedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          // Update idea status based on score
          let ideaStatus: 'analyzed' | 'revision_needed' = 'analyzed';
          if (analysisResult.overallScore < 60) {
            ideaStatus = 'revision_needed';
          }
          await db.updateIdea(ideaId, { status: ideaStatus });

          // Create classification history record
          await db.createClassificationHistory({
            ideaId,
            analysisId,
            classification: analysisResult.classification,
            overallScore: analysisResult.overallScore.toString(),
            reason: "تحليل أولي بواسطة الذكاء الاصطناعي",
          });

          // Save to new ai_evaluations table
          try {
            await db.createAiEvaluation({
              ideaId,
              overallScore: String(analysisResult.overallScore),
              criteriaScores: analysisResult.criterionScores,
              strengths: analysisResult.strengths,
              weaknesses: analysisResult.weaknesses,
              opportunities: analysisResult.opportunities,
              threats: analysisResult.threats,
              recommendations: analysisResult.recommendations,
              evaluatedAt: new Date().toISOString(),
            });
          } catch (err) {
            console.error('[ERROR] Failed to save AI evaluation:', err);
          }

          // Save to new idea_classifications table
          let classificationPath: 'innovation' | 'commercial' | 'guidance' = 'guidance';
          let suggestedPartner = '';
          
          try {
            // Determine path based on score
            if (analysisResult.overallScore >= 70) {
              classificationPath = 'innovation';
              suggestedPartner = 'KAUST - جامعة الملك عبدالله للعلوم والتقنية';
            } else if (analysisResult.overallScore >= 60) {
              classificationPath = 'commercial';
              suggestedPartner = 'Monsha\'at - منشآت';
            } else {
              classificationPath = 'guidance';
              suggestedPartner = 'RDIA - الهيئة الملكية للبيانات والذكاء الاصطناعي';
            }

            await db.createIdeaClassification({
              ideaId,
              evaluationId: 0, // Placeholder - should be actual evaluation ID
              classificationPath,
              score: String(analysisResult.overallScore),
              reason: `تصنيف تلقائي بناءً على الدرجة: ${analysisResult.overallScore}%`,
              classifiedAt: new Date().toISOString(),
            });
          } catch (err) {
            console.error('[ERROR] Failed to save idea classification:', err);
          }

          // Return simplified analysis to avoid serialization issues
          console.log('[DEBUG] Analysis completed successfully');
          console.log('[DEBUG] ideaId:', ideaId);
          console.log('[DEBUG] analysisId:', analysisId);
          console.log('[DEBUG] overallScore:', analysisResult.overallScore);
          
          // Return simplified version matching AIAnalysisResults interface
          const criterionScoresArray = Array.isArray(analysisResult.criterionScores)
            ? analysisResult.criterionScores
            : Object.entries(analysisResult.criterionScores || {}).map(([criterion, data]: [string, any]) => ({
                criterion,
                score: data.score || 0,
                reasoning: data.justification || data.reasoning || ""
              }));

          const getTechnicalNoveltyScore = () => {
            const score = criterionScoresArray.find((c: any) => c.criterion === "technicalNovelty");
            return score ? score.score : 0;
          };

          const getTechnicalFeasibilityScore = () => {
            const score = criterionScoresArray.find((c: any) => c.criterion === "technicalFeasibility");
            return score ? score.score : 0;
          };

          const getCommercialValueScore = () => {
            const score = criterionScoresArray.find((c: any) => c.criterion === "commercialValue");
            return score ? score.score : 0;
          };

          // Auto-promote to NAQLA 2 or 3 based on score
          let projectId: number | undefined;
          let assetId: number | undefined;
          
          if (analysisResult.overallScore >= 70) {
            const { promoteToNaqla2 } = await import('./naqla1-to-naqla2');
            const result = await promoteToNaqla2(ideaId, ctx.user.id);
            projectId = result.projectId;
          }

          const responseData = {
            ideaId,
            analysisId,
            overallScore: analysisResult.overallScore || 0,
            technicalNoveltyScore: getTechnicalNoveltyScore(),
            technicalFeasibilityScore: getTechnicalFeasibilityScore(),
            commercialValueScore: getCommercialValueScore(),
            classification: classificationPath,
            classificationPath,
            suggestedPartner,
            tags: analysisResult.extractedKeywords || [],
            recommendations: analysisResult.recommendations || [],
            nextSteps: analysisResult.nextSteps || "",
            message: "تم تحليل الفكرة بنجاح!",
            projectId,
            assetId
          };
          
          console.log('[DEBUG] About to return response:', JSON.stringify(responseData).substring(0, 200));
          return responseData;
        } catch (error) {
          // Log detailed error
          console.error('[ERROR] Failed to analyze idea:', error);
          console.error('[ERROR] Error details:', JSON.stringify(error, null, 2));
          
          // Update status to revision_needed
          await db.updateIdea(ideaId, { status: "revision_needed" });
          
          // Return user-friendly error
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'فشل تحليل الفكرة. يرجى المحاولة مرة أخرى.',
            cause: error
          });
        }
      }),

    // Analyze an idea using AI
    analyzeIdea: protectedProcedure
      .input(z.object({ ideaId: z.number() }))
      .mutation(async ({ input }) => {
        // Get idea from database
        const idea = await db.getIdeaById(input.ideaId);
        if (!idea) {
          throw new Error("الفكرة غير موجودة");
        }

        if (idea.status !== "submitted") {
          throw new Error("الفكرة تم تحليلها مسبقًا أو في حالة غير صالحة");
        }

        // Update status to analyzing
        await db.updateIdea(input.ideaId, { status: "analyzing" });

        try {
          // Perform AI analysis
          const analysisResult = await analyzeIdea({
            title: idea.title,
            description: idea.description,
            problem: idea.problem as string,
            solution: idea.solution as string,
            targetMarket: idea.targetMarket || undefined,
            uniqueValue: idea.uniqueValue || undefined,
            category: idea.category || undefined,
          });

          // Save analysis result to database
          // Helper function to safely stringify or return null
          const safeStringify = (value: any) => {
            if (value === undefined || value === null) return null;
            if (typeof value === 'string') return value;
            try {
              return JSON.stringify(value);
            } catch {
              return null;
            }
          };

          // Helper function to safely convert to string or return "0"
          const safeToString = (value: any, defaultValue: string = "0") => {
            if (value === undefined || value === null) return defaultValue;
            return String(value);
          };

          console.log('[DEBUG] About to create idea analysis');
          console.log('[DEBUG] ideaId:', input.ideaId);
          console.log('[DEBUG] overallScore:', analysisResult.overallScore);
          
          const analysisId = await db.createIdeaAnalysis({
            ideaId: input.ideaId,
            overallScore: safeToString(analysisResult.overallScore),
            classification: analysisResult.classification,
            technicalNoveltyScore: safeToString(analysisResult.criterionScores.find(c => c.criterion === "technicalNovelty")?.score),
            socialImpactScore: safeToString(analysisResult.criterionScores.find(c => c.criterion === "socialImpact")?.score),
            technicalFeasibilityScore: safeToString(analysisResult.criterionScores.find(c => c.criterion === "technicalFeasibility")?.score),
            commercialValueScore: safeToString(analysisResult.criterionScores.find(c => c.criterion === "commercialValue")?.score),
            scalabilityScore: safeToString(analysisResult.criterionScores.find(c => c.criterion === "scalability")?.score),
            sustainabilityScore: safeToString(analysisResult.criterionScores.find(c => c.criterion === "sustainability")?.score),
            technicalRiskScore: safeToString(analysisResult.criterionScores.find(c => c.criterion === "technicalRisk")?.score),
            timeToMarketScore: safeToString(analysisResult.criterionScores.find(c => c.criterion === "timeToMarket")?.score),
            competitiveAdvantageScore: safeToString(analysisResult.criterionScores.find(c => c.criterion === "competitiveAdvantage")?.score),
            organizationalReadinessScore: safeToString(analysisResult.criterionScores.find(c => c.criterion === "organizationalReadiness")?.score),
            trlLevel: null,
            trlDescription: null,
            currentStageGate: null,
            stageGateRecommendation: null,
            aiAnalysis: analysisResult.aiAnalysis || null,
            strengths: safeStringify(analysisResult.strengths),
            weaknesses: safeStringify(analysisResult.weaknesses),
            opportunities: safeStringify(analysisResult.opportunities),
            threats: safeStringify(analysisResult.threats),
            recommendations: safeStringify(analysisResult.recommendations),
            nextSteps: safeStringify(analysisResult.nextSteps),
            similarInnovations: safeStringify(analysisResult.similarInnovations),
            extractedKeywords: safeStringify(analysisResult.extractedKeywords),
            sentimentScore: safeToString(analysisResult.sentimentScore),
            complexityLevel: analysisResult.complexityLevel || "medium",
            marketSize: analysisResult.marketSize || "medium",
            competitionLevel: analysisResult.competitionLevel || "medium",
            marketTrends: safeStringify(analysisResult.marketTrends),
            status: "completed",
            processingTime: safeToString(analysisResult.processingTime),
            analyzedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          // Update idea status
          await db.updateIdea(input.ideaId, { status: "analyzed" });

          // Create classification history record
          await db.createClassificationHistory({
            ideaId: input.ideaId,
            analysisId,
            classification: analysisResult.classification,
            overallScore: analysisResult.overallScore.toString(),
            reason: "تحليل أولي بواسطة الذكاء الاصطناعي",
          });

          // Auto-transfer to NAQLA2 if innovation or commercial
          let transferredToNaqla2 = false;
          let naqla2Message = "";
          
          if (analysisResult.classification === "innovation" || analysisResult.classification === "commercial") {
            // TODO: Implement actual transfer to NAQLA2 when NAQLA2 is ready
            // For now, just mark the idea as eligible for NAQLA2
            transferredToNaqla2 = true;
            naqla2Message = analysisResult.classification === "innovation" 
              ? "🎉 مبروك! فكرتك ابتكار حقيقي! سيتم نقلها تلقائياً إلى NAQLA2 للمطابقة مع المستثمرين والتحديات."
              : "🚀 رائع! فكرتك حل تجاري واعد! سيتم نقلها تلقائياً إلى NAQLA2 للمطابقة مع الفرص التجارية.";
          } else {
            naqla2Message = "💪 لا تستسلم! طور فكرتك حسب الاقتراحات وأعد التقديم مرة أخرى.";
          }

          return {
            analysisId,
            ...analysisResult,
            transferredToNaqla2,
            naqla2Message,
            message: "تم تحليل الفكرة بنجاح!"
          };
        } catch (error) {
          // Update status to revision_needed
          await db.updateIdea(input.ideaId, { status: "revision_needed" });
          throw error;
        }
      }),

    // Get analysis result
    getAnalysisResult: protectedProcedure
      .input(z.object({ ideaId: z.number() }))
      .query(async ({ input }) => {
        const analysis = await db.getIdeaAnalysisByIdeaId(input.ideaId);
        if (!analysis) {
          return null;
        }

        // Parse JSON fields
        return {
          ...analysis,
          strengths: JSON.parse((analysis.strengths as string) || "[]"),
          weaknesses: JSON.parse((analysis.weaknesses as string) || "[]"),
          opportunities: JSON.parse((analysis.opportunities as string) || "[]"),
          threats: JSON.parse((analysis.threats as string) || "[]"),
          recommendations: JSON.parse((analysis.recommendations as string) || "[]"),
          nextSteps: JSON.parse((analysis.nextSteps as string) || "[]"),
          similarInnovations: JSON.parse((analysis.similarInnovations as string) || "[]"),
          extractedKeywords: JSON.parse((analysis.extractedKeywords as string) || "[]"),
          marketTrends: analysis.marketTrends ? JSON.parse(analysis.marketTrends as string) : []
        };
      }),

    // Get user's idea history
    getIdeaHistory: protectedProcedure
      .query(async ({ ctx }) => {
        return db.getIdeasByUserId(ctx.user.id);
      }),

    // Get idea by ID
    getIdeaById: publicProcedure
      .input(z.object({ ideaId: z.number() }))
      .query(async ({ input }) => {
        return db.getIdeaById(input.ideaId);
      }),

    // Get classification statistics
    getClassificationStats: protectedProcedure
      .query(async () => {
        return db.getClassificationStats();
      }),

    // Get my ideas
    myIdeas: protectedProcedure.query(async ({ ctx }) => {
      const ideas = await db.getUserIdeas(ctx.user.id);
      return ideas;
    }),
    
    // Browse all ideas (with filters)
    ideas: router({
      browse: publicProcedure
        .input(z.object({
          search: z.string().optional(),
          category: z.string().optional(),
          status: z.string().optional(),
          challengeId: z.number().optional(),
          limit: z.number().optional(),
          offset: z.number().optional(),
        }))
        .query(async ({ input }) => {
          // Get all ideas with filters
          const ideas = await db.getAllIdeas({
            search: input.search,
            category: input.category,
            status: input.status,
            challengeId: input.challengeId,
            limit: input.limit || 50,
            offset: input.offset || 0,
          });
          return ideas;
        }),
    }),

    // ========================================
    // الآلية المتكاملة الجديدة - Integrated Innovation System
    // ========================================

    // تقييم فكرة بالذكاء الاصطناعي
    evaluateIdeaWithAI: protectedProcedure
      .input(z.object({ ideaId: z.number() }))
      .mutation(async ({ input }) => {
        const { evaluateIdea } = await import("./services/aiEvaluation");
        const result = await evaluateIdea(input.ideaId);
        return result;
      }),

    // الحصول على تقييم فكرة
    getAiEvaluation: protectedProcedure
      .input(z.object({ ideaId: z.number() }))
      .query(async ({ input }) => {
        const evaluation = await db.getAiEvaluationByIdeaId(input.ideaId);
        return evaluation;
      }),

    // الحصول على تصنيف فكرة
    getClassification: protectedProcedure
      .input(z.object({ ideaId: z.number() }))
      .query(async ({ input }) => {
        const classification = await db.getIdeaClassification(input.ideaId);
        return classification;
      }),

    // الحصول على جميع الأفكار حسب المسار
    getIdeasByPath: publicProcedure
      .input(z.object({
        path: z.enum(['innovation', 'commercial', 'guidance']),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const ideas = await db.getIdeasByClassificationPath(
          input.path,
          input.limit || 50
        );
        return ideas;
      }),

    // تحديث حالة التصنيف
    updateClassificationStatus: protectedProcedure
      .input(z.object({
        classificationId: z.number(),
        status: z.enum(['pending', 'accepted', 'rejected', 'completed']),
      }))
      .mutation(async ({ input }) => {
        await db.updateClassificationStatus(
          input.classificationId,
          input.status
        );
        return { success: true };
      }),

    // حفظ اختيار المستخدم (NAQLA 2 أو NAQLA 3)
    setUserChoice: protectedProcedure
      .input(z.object({
        ideaId: z.number(),
        choice: z.enum(['naqla2', 'naqla3']),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // تحديث الفكرة بالاختيار
        await db.updateIdea(input.ideaId, { userChoice: input.choice });
        
        // حفظ الملاحظات في userChoices table
        const db_conn = await getDb();
        await db_conn!.insert(userChoices).values({
          ideaId: input.ideaId,
          userId: ctx.user.id,
          choice: input.choice,
          notes: input.notes || null,
        });
        
        // حفظ حدث في journey
        await db_conn!.insert(ideaJourneyEvents).values({
          ideaId: input.ideaId,
          eventType: input.choice === 'naqla2' ? 'promoted_naqla2' : 'promoted_naqla3',
          eventData: { notes: input.notes },
        });

        // إذا اختار NAQLA 2
        if (input.choice === 'naqla2') {
          const { promoteToNaqla2 } = await import('./naqla1-to-naqla2');
          const result = await promoteToNaqla2(input.ideaId, ctx.user.id);
          return {
            success: true,
            choice: 'naqla2',
            projectId: result.projectId,
            opportunities: result.opportunities,
          };
        }

        // إذا اختار NAQLA 3
        if (input.choice === 'naqla3') {
          const { promoteToNaqla3 } = await import('./naqla1-to-naqla3');
          const result = await promoteToNaqla3(input.ideaId, ctx.user.id);
          return {
            success: true,
            choice: 'naqla3',
            assetId: result.assetId,
          };
        }

        return { success: true };
      }),

    // Get idea journey (timeline)
    getIdeaJourney: protectedProcedure
      .input(z.object({ ideaId: z.number() }))
      .query(async ({ ctx, input }) => {
        const idea = await db.getIdeaById(input.ideaId);
        if (!idea) throw new Error("الفكرة غير موجودة");
        
        // جلب الأحداث من ideaJourneyEvents
        const db_conn = await getDb();
        const events = await db_conn!
          .select()
          .from(ideaJourneyEvents)
          .where(eq(ideaJourneyEvents.ideaId, input.ideaId))
          .orderBy(asc(ideaJourneyEvents.timestamp));
        
        // إذا لم تكن هناك أحداث، إنشاء حدث التقديم
        if (events.length === 0) {
          await db_conn!.insert(ideaJourneyEvents).values({
            ideaId: input.ideaId,
            eventType: 'submitted',
            eventData: { title: idea.title },
          });
          
          // إذا كان هناك تحليل، إضافة حدث analyzed
          const analysis = await db.getIdeaAnalysisByIdeaId(input.ideaId);
          if (analysis) {
            await db_conn!.insert(ideaJourneyEvents).values({
              ideaId: input.ideaId,
              eventType: 'analyzed',
              eventData: { overallScore: analysis.overallScore },
            });
          }
          
          // إعادة جلب الأحداث
          return await db_conn!
            .select()
            .from(ideaJourneyEvents)
            .where(eq(ideaJourneyEvents.ideaId, input.ideaId))
            .orderBy(asc(ideaJourneyEvents.timestamp));
        }
        
        return events;
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

        const prompt = `You are an expert innovation evaluator for NAQLA, Saudi Arabia's national innovation platform. Analyze the following innovation project and provide a comprehensive evaluation.

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
- ≥70%: "innovation" (True Innovation - Fast track to NAQLA3)
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

        // Correct classification logic:
        // - "innovation" (≥70%) → NAQLA2
        // - "commercial" (50-69%) → NAQLA2
        // - "guidance" (<50%) → stays in NAQLA1
        const newEngine = evalResult.classification === "guidance" ? "naqla1" : "naqla2";
        const newStatus = evalResult.classification === "guidance" ? "rejected" : "approved";
        await db.updateProject(input.projectId, { 
          evaluationId, 
          engine: newEngine,
          status: newStatus 
        });

        // NAQLA1 → NAQLA2 Transition: Create IP Registration
        if (newEngine === "naqla2") {
          const project = await db.getProjectById(input.projectId);
          if (!project) throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' });
          
          // Create IP Registration automatically
          const db_instance = await getDb();
          if (!db_instance) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
          const { ipRegistrations } = await import('../drizzle/schema');
          
          const ipResult = await db_instance.insert(ipRegistrations).values({
            userId: project.userId,
            type: 'patent', // Default to patent, can be changed later
            title: project.title,
            titleEn: project.titleEn,
            description: project.description,
            descriptionEn: project.descriptionEn,
            category: project.category,
            subCategory: project.subCategory,
            status: 'submitted', // Ready for NAQLA2 vetting
            blockchainHash: `temp_${Date.now()}`, // Temporary hash, will be replaced with real blockchain hash
            blockchainTimestamp: new Date().toISOString(),
          });
          
          // Get the inserted IP ID
          const ipId = Number(ipResult[0].insertId);
          
          // Link IP to project
          await db.updateProject(input.projectId, { 
            ipRegistrationId: ipId,
          });
          
          // Transition record (ideaTransitions table not yet created)
          // TODO: Add ideaTransitions table to schema if needed
          
          // Create notification
          await db.createNotification({
            userId: project.userId,
            type: "success",
            title: "تهانينا! مشروعك انتقل إلى NAQLA2",
            message: `مشروعك "${project.title}" حصل على تقييم ${evalResult.overallScore}% وانتقل بنجاح إلى NAQLA2. تم تسجيل ملكيتك الفكرية وإرسالها للخبراء للمراجعة.`,
            link: `/projects/${input.projectId}`,
          });
        }

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
          startDate: input.startDate ? new Date(input.startDate).toISOString() : undefined,
          endDate: input.endDate ? new Date(input.endDate).toISOString() : undefined,
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
          updateData.partyASignedAt = new Date().toISOString();
        } else if (contract.partyB === ctx.user.id) {
          updateData.partyBSignature = input.signature;
          updateData.partyBSignedAt = new Date().toISOString();
        } else {
          throw new Error("Not authorized to sign this contract");
        }

        await db.updateContract(input.id, updateData);

        const updatedContract = await db.getContractById(input.id);
        if (updatedContract?.partyAsignature && updatedContract?.partyBsignature) {
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
          startedAt: new Date().toISOString(),
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
        const courseId = await db.createCourse(input as any);
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
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
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
        const rawKey = `naqla_${nanoid(32)}`;
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
  // CHALLENGES (NAQLA2)
  // ============================================
  challenge: router({
    getAll: publicProcedure
      .input(z.object({ status: z.enum(["open", "closed", "completed"]).optional() }).optional())
      .query(async ({ input }) => {
        return db.getAllChallenges(input?.status);
      }),
    
    // Get active challenges for idea submission
    getActiveChallenges: publicProcedure
      .query(async () => {
        try {
          const challenges = await db.getAllChallenges("open");
          return challenges.map(c => ({
            id: c.id,
            title: c.title,
            category: c.category,
          }));
        } catch (error) {
          console.error('[ERROR] getActiveChallenges failed:', error);
          return []; // Return empty array instead of throwing error
        }
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
          startDate: input.startDate ? new Date(input.startDate).toISOString() : undefined,
          endDate: input.endDate ? new Date(input.endDate).toISOString() : undefined,
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

    markAllAsRead: protectedProcedure
      .mutation(async ({ ctx }) => {
        await db.markAllNotificationsAsRead(ctx.user.id);
        return { success: true };
      }),

    getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
      const unread = await db.getNotificationsByUserId(ctx.user.id, true);
      return { count: unread.length };
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
          startDate: input.startDate ? new Date(input.startDate).toISOString() : undefined,
          endDate: input.endDate ? new Date(input.endDate).toISOString() : undefined,
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
          deadline: input.deadline ? new Date(input.deadline).toISOString() : null,
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
          startDate: input.startDate ? new Date(input.startDate).toISOString() : undefined,
          endDate: input.endDate ? new Date(input.endDate).toISOString() : undefined,
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
          isActive: input.isActive !== undefined ? (input.isActive ? 1 : 0) : undefined,
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
          "cd /home/ubuntu/naqla-platform/ai-services/prediction && python3 model_versioning.py list"
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
            `cd /home/ubuntu/naqla-platform/ai-services/prediction && python3 model_versioning.py activate ${input.versionId}`
          );
          
          // Restart prediction service to use new model
          try {
            await execPromise("pkill -f 'prediction/main.py'");
            await new Promise(resolve => setTimeout(resolve, 1000));
            execPromise(
              "cd /home/ubuntu/naqla-platform/ai-services/prediction && nohup python3 main.py > /tmp/prediction_service_v2.log 2>&1 &"
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
            `cd /home/ubuntu/naqla-platform/ai-services/prediction && python3 model_versioning.py delete ${input.versionId}`
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
            `cd /home/ubuntu/naqla-platform/ai-services/prediction && python3 model_versioning.py compare ${input.versionId1} ${input.versionId2}`
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
    // NAQLA Flow Statistics
    getNaqlaFlowStats: publicProcedure.query(async () => {
      try {
        const ideas = await db.getAllIdeas();
        
        const innovation = ideas.filter((idea: any) => idea.classification === 'innovation').length;
        const commercial = ideas.filter((idea: any) => idea.classification === 'commercial').length;
        const guidance = ideas.filter((idea: any) => idea.classification === 'guidance').length;
        
        return {
          innovation,
          commercial,
          guidance,
          total: ideas.length
        };
      } catch (error: any) {
        console.error('Error fetching NAQLA flow stats:', error);
        return {
          innovation: 0,
          commercial: 0,
          guidance: 0,
          total: 0
        };
      }
    }),

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
        return await createRole({ ...input, isSystem: 0 });
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
          isPublic: input.isPublic ? 1 : 0,
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
        const updateData: Partial<{ name: string; description: string; filters: any; isPublic: number }> = {
          ...(data.name && { name: data.name }),
          ...(data.description && { description: data.description }),
          ...(data.filters && { filters: data.filters }),
          ...(data.isPublic !== undefined && { isPublic: data.isPublic ? 1 : 0 }),
        };
        const success = await updateSavedView(id, ctx.user.id, updateData);
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
  }),

  // ============================================
  // NAQLA2 - IP VETTING & MARKETPLACE
  // ============================================
  naqla2: router({
    // Get project by ID
    getProjectById: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return db.getProjectById(input.projectId);
      }),

    // Vetting System
    vetting: router({
      getPendingIPs: protectedProcedure
        .query(async ({ ctx }) => {
          const db = await getDb();
          if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
          const { ipRegistrations } = await import('../drizzle/schema');
          const { eq } = await import('drizzle-orm');
          
          return await db.select().from(ipRegistrations)
            .where(eq(ipRegistrations.status, 'submitted'));
        }),

      submitReview: protectedProcedure
        .input(z.object({
          ipRegistrationId: z.number(),
          score: z.number().min(0).max(100),
          noveltyScore: z.number().min(0).max(100),
          feasibilityScore: z.number().min(0).max(100),
          marketPotentialScore: z.number().min(0).max(100),
          comments: z.string(),
          recommendation: z.enum(['approve', 'reject', 'needs_revision']),
          revisionSuggestions: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          // TODO: Create vettingReviews table in schema first
          throw new TRPCError({ code: 'NOT_IMPLEMENTED', message: 'Vetting reviews feature not yet implemented' });
          // const db = await getDb();
          // if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
          // const { vettingReviews } = await import('../drizzle/schema');
          
          // Determine expert type based on user role or assign default
          // const expertType = 'technical'; // TODO: determine from user profile
          // await db.insert(vettingReviews).values({...});
          // Auto-trigger Diamond Decision Point (disabled)
          
          return { 
            success: true, 
            decisionMade: false, // decision !== null
            // decision, // removed
          };
        }),

      getReviews: protectedProcedure
        .input(z.object({ ipRegistrationId: z.number() }))
        .query(async ({ input }) => {
          // TODO: Create vettingReviews table in schema first
          throw new TRPCError({ code: 'NOT_IMPLEMENTED', message: 'Vetting reviews feature not yet implemented' });
          // const db = await getDb();
          // if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
          // const { vettingReviews } = await import('../drizzle/schema');
          // const { eq } = await import('drizzle-orm');
          // return await db.select().from(vettingReviews)
          //   .where(eq(vettingReviews.ipRegistrationId, input.ipRegistrationId));
        }),
    }),

    // IP Marketplace
    marketplace: router({
      getApprovedIPs: publicProcedure
        .query(async () => {
          // TODO: Create ipMarketplaceListings table in schema first
          throw new TRPCError({ code: 'NOT_IMPLEMENTED', message: 'IP Marketplace feature not yet implemented' });
          // const db = await getDb();
          // if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
          // const { ipMarketplaceListings, ipRegistrations } = await import('../drizzle/schema');
          // const { eq } = await import('drizzle-orm');
          // return await db.select({...}).from(ipMarketplaceListings)...
        }),

      requestPurchase: protectedProcedure
        .input(z.object({
          listingId: z.number(),
          offerPrice: z.number().optional(),
          message: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
          // TODO: Create purchase request in database
          // For now, just return success
          return { success: true, message: 'Purchase request sent successfully' };
        }),

      getListingById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          // TODO: Create ipMarketplaceListings table in schema first
          throw new TRPCError({ code: 'NOT_IMPLEMENTED', message: 'IP Marketplace feature not yet implemented' });
          // const db = await getDb();
          // if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
          // const { ipMarketplaceListings, ipRegistrations } = await import('../drizzle/schema');
          // const { eq } = await import('drizzle-orm');
          // const result = await db.select({...}).from(ipMarketplaceListings)...
          // return result[0] || null;
        }),
    }),

    // Hackathons
    hackathons: router({
      create: protectedProcedure
        .input(z.object({
          title: z.string().min(3),
          description: z.string().min(10),
          startDate: z.string(),
          endDate: z.string(),
          location: z.string().optional(),
          isVirtual: z.boolean().default(false),
          capacity: z.number().optional(),
          budget: z.string().optional(),
          needSponsors: z.boolean().optional(),
          needInnovators: z.boolean().optional(),
          sponsorshipTiers: z.any().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const hackathon = await hackathonsService.createHackathon({
            userId: ctx.user.id,
            title: input.title,
            description: input.description,
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
            location: input.location,
            isVirtual: input.isVirtual,
            capacity: input.capacity,
            budget: input.budget,
            needSponsors: input.needSponsors,
            needInnovators: input.needInnovators,
            sponsorshipTiers: input.sponsorshipTiers,
          });
          return { success: true, hackathon };
        }),

      getAll: publicProcedure
        .input(z.object({
          status: z.enum(['draft', 'open', 'closed', 'judging', 'completed', 'cancelled']).optional(),
        }).optional())
        .query(async ({ input }) => {
          const db = await getDb();
          if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
          const { challenges } = await import('../drizzle/schema');
          const { eq, and } = await import('drizzle-orm');
          
          const conditions = [eq(challenges.type, 'hackathon')];
          
          if (input?.status) {
            conditions.push(eq(challenges.status, input.status));
          }
          
          return await db.select().from(challenges).where(and(...conditions));
        }),

      getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          const hackathon = await hackathonsService.getHackathonById(input.id);
          return hackathon;
        }),

      register: protectedProcedure
        .input(z.object({
          eventId: z.number(),
          attendeeType: z.enum(['innovator', 'investor', 'sponsor', 'speaker', 'attendee']),
          additionalInfo: z.string().optional(),
          sponsorshipTier: z.string().optional(),
          sponsorshipAmount: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const registration = await hackathonsService.registerForHackathon({
            eventId: input.eventId,
            userId: ctx.user.id,
            attendeeType: input.attendeeType,
            additionalInfo: input.additionalInfo,
            sponsorshipTier: input.sponsorshipTier,
            sponsorshipAmount: input.sponsorshipAmount,
          });
          return { success: true, registration };
        }),

      updateStatus: protectedProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(['draft', 'published', 'ongoing', 'completed', 'cancelled']),
        }))
        .mutation(async ({ ctx, input }) => {
          await hackathonsService.updateHackathonStatus(input.id, input.status);
          return { success: true };
        }),
    }),

    // Events
    events: router({
      create: protectedProcedure
        .input(z.object({
          title: z.string().min(3),
          description: z.string().min(10),
          type: z.enum(['hackathon', 'workshop', 'conference']),
          startDate: z.string(),
          endDate: z.string(),
          location: z.string().optional(),
          isVirtual: z.boolean().default(false),
          capacity: z.number().optional(),
          budget: z.string().optional(),
          needSponsors: z.boolean().optional(),
          needInnovators: z.boolean().optional(),
          sponsorshipTiers: z.any().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const event = await eventsService.createEvent({
            userId: ctx.user.id,
            title: input.title,
            description: input.description,
            type: input.type,
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
            location: input.location,
            isVirtual: input.isVirtual,
            capacity: input.capacity,
            budget: input.budget,
            needSponsors: input.needSponsors,
            needInnovators: input.needInnovators,
            sponsorshipTiers: input.sponsorshipTiers,
          });
          return { success: true, event };
        }),

      getAll: publicProcedure
        .input(z.object({
          type: z.enum(['hackathon', 'workshop', 'conference']).optional(),
          status: z.enum(['draft', 'published', 'ongoing', 'completed', 'cancelled']).optional(),
          isVirtual: z.boolean().optional(),
        }).optional())
        .query(async ({ input }) => {
          const events = await eventsService.getAllEvents(input || {});
          return events;
        }),

      getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          const event = await eventsService.getEventById(input.id);
          return event;
        }),

      register: protectedProcedure
        .input(z.object({
          eventId: z.number(),
          attendeeType: z.enum(['innovator', 'investor', 'sponsor', 'speaker', 'attendee']),
          additionalInfo: z.string().optional(),
          sponsorshipTier: z.string().optional(),
          sponsorshipAmount: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const registration = await eventsService.registerForEvent({
            eventId: input.eventId,
            userId: ctx.user.id,
            attendeeType: input.attendeeType,
            additionalInfo: input.additionalInfo,
            sponsorshipTier: input.sponsorshipTier,
            sponsorshipAmount: input.sponsorshipAmount,
          });
          return { success: true, registration };
        }),

      updateStatus: protectedProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(['draft', 'published', 'ongoing', 'completed', 'cancelled']),
        }))
        .mutation(async ({ ctx, input }) => {
          await eventsService.updateEventStatus(input.id, input.status);
          return { success: true };
        }),

      host: protectedProcedure
        .input(z.object({
          title: z.string(),
          description: z.string(),
          type: z.enum(['hackathon', 'workshop', 'conference']),
          date: z.string(),
          location: z.string(),
          capacity: z.string(),
          budget: z.string(),
          needSponsors: z.boolean(),
          needInnovators: z.boolean(),
        }))
        .mutation(async ({ ctx, input }) => {
          // TODO: Save event to database and create matching requests
          return { success: true, eventId: 1 };
        }),

      complete: protectedProcedure
        .input(z.object({ eventId: z.number() }))
        .mutation(async ({ ctx, input }) => {
          // TODO: Mark event as complete and create contracts in NAQLA3
          return { success: true, contractsCreated: 0 };
        }),
    }),

    // Matching
    matching: router({
      request: protectedProcedure
        .input(z.object({
          seekingType: z.enum(['investor', 'innovator', 'partner', 'mentor']),
          industry: z.string().optional(),
          stage: z.string().optional(),
          budget: z.number().optional(),
          location: z.string().optional(),
          requirements: z.string(),
          preferences: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          // TODO: Import and use matching functions with ValidMatch middleware
          return { success: true, matchesFound: 0, matches: [] };
        }),

      getMyMatches: protectedProcedure
        .query(async ({ ctx }) => {
          // TODO: Import and use matching functions
          return [];
        }),
      
      getMatches: publicProcedure
        .query(async () => {
          // Return mock matching data for now
          return [
            {
              id: 1,
              investorName: 'صندوق الاستثمارات العامة',
              industry: 'التقنية والابتكار',
              score: 92,
              fundingRange: '5-50 مليون ريال',
              focus: 'الذكاء الاصطناعي والتقنيات الناشئة',
            },
            {
              id: 2,
              investorName: 'شركة STC Ventures',
              industry: 'الاتصالات والتقنية',
              score: 88,
              fundingRange: '1-10 مليون ريال',
              focus: 'التطبيقات الذكية وإنترنت الأشياء',
            },
            {
              id: 3,
              investorName: 'صندوق الابتكار الصحي',
              industry: 'الرعاية الصحية',
              score: 85,
              fundingRange: '2-15 مليون ريال',
              focus: 'التقنيات الصحية والذكاء الاصطناعي الطبي',
            },
          ];
        }),

      accept: protectedProcedure
        .input(z.object({ matchId: z.number() }))
        .mutation(async ({ ctx, input }) => {
          // TODO: Import and use matching functions
          return { success: true };
        }),

      reject: protectedProcedure
        .input(z.object({
          matchId: z.number(),
          reason: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          // TODO: Import and use matching functions
          return { success: true };
        }),
    }),

    // Challenges
    challenges: router({
      getAll: publicProcedure
        .query(async () => {
          return db.getAllChallenges();
        }),

      getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          const challenge = await db.getChallengeById(input.id);
          if (!challenge) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Challenge not found' });
          }
          return challenge;
        }),

      submit: protectedProcedure
        .input(z.object({
          title: z.string(),
          description: z.string(),
          category: z.string(),
          requirements: z.string(),
          prize: z.string(),
          deadline: z.string(),
          targetAudience: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
          const id = await db.createChallenge({
            title: input.title,
            description: input.description,
            type: 'challenge',
            category: input.category,
            requirements: { text: input.requirements, targetAudience: input.targetAudience },
            prize: input.prize,
            endDate: new Date(input.deadline).toISOString(),
            organizerId: ctx.user.id,
            status: 'open',
          });
          return { success: true, id };
        }),

      // Registration
      register: protectedProcedure
        .input(z.object({
          challengeId: z.number(),
          teamName: z.string().optional(),
          teamMembers: z.array(z.object({
            name: z.string(),
            email: z.string(),
            role: z.string(),
          })).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const id = await db.registerForChallenge({
            challengeId: input.challengeId,
            userId: ctx.user.id,
            teamName: input.teamName,
            teamMembers: input.teamMembers,
          });
          return { success: true, registrationId: id };
        }),

      getRegistration: protectedProcedure
        .input(z.object({ challengeId: z.number() }))
        .query(async ({ ctx, input }) => {
          return db.getChallengeRegistration(input.challengeId, ctx.user.id);
        }),

      getMyRegistrations: protectedProcedure
        .query(async ({ ctx }) => {
          return db.getUserChallengeRegistrations(ctx.user.id);
        }),

      // Submissions
      submitSolution: protectedProcedure
        .input(z.object({
          challengeId: z.number(),
          title: z.string(),
          description: z.string(),
          solution: z.string(),
          expectedImpact: z.string().optional(),
          teamName: z.string().optional(),
          teamMembers: z.array(z.any()).optional(),
          documents: z.array(z.any()).optional(),
          images: z.array(z.any()).optional(),
          video: z.string().optional(),
          prototype: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const id = await db.createChallengeSubmission({
            challengeId: input.challengeId,
            userId: ctx.user.id,
            title: input.title,
            description: input.description,
            solution: input.solution,
            expectedImpact: input.expectedImpact,
            teamName: input.teamName,
            teamMembers: input.teamMembers,
            documents: input.documents,
            images: input.images,
            video: input.video,
            prototype: input.prototype,
            status: 'submitted',
            submittedAt: new Date().toISOString(),
          });
          return { success: true, submissionId: id };
        }),

      getSubmissions: publicProcedure
        .input(z.object({ challengeId: z.number() }))
        .query(async ({ input }) => {
          return db.getChallengeSubmissions(input.challengeId);
        }),

      getMySubmissions: protectedProcedure
        .query(async ({ ctx }) => {
          return db.getUserChallengeSubmissions(ctx.user.id);
        }),

      getMySubmissionsWithDetails: protectedProcedure
        .query(async ({ ctx }) => {
          return db.getMySubmissionsWithDetails(ctx.user.id);
        }),

      getSubmissionById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          const submission = await db.getChallengeSubmissionById(input.id);
          if (!submission) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Submission not found' });
          }
          return submission;
        }),

      // Voting
      vote: protectedProcedure
        .input(z.object({
          submissionId: z.number(),
          rating: z.number().min(1).max(5).optional(),
          comment: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const id = await db.voteForSubmission({
            submissionId: input.submissionId,
            userId: ctx.user.id,
            voteType: 'public',
            rating: input.rating,
            comment: input.comment,
          });
          return { success: true, voteId: id };
        }),

      getVotes: publicProcedure
        .input(z.object({ submissionId: z.number() }))
        .query(async ({ input }) => {
          return db.getSubmissionVotes(input.submissionId);
        }),

      getUserVote: protectedProcedure
        .input(z.object({ submissionId: z.number() }))
        .query(async ({ ctx, input }) => {
          return db.getUserVote(input.submissionId, ctx.user.id);
        }),

      // Admin/Judge Review
      submitReview: protectedProcedure
        .input(z.object({
          submissionId: z.number(),
          criteriaScores: z.record(z.string(), z.number()),
          overallScore: z.number(),
          strengths: z.string().optional(),
          weaknesses: z.string().optional(),
          recommendations: z.string().optional(),
          decision: z.enum(['shortlist', 'finalist', 'winner', 'reject']).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const id = await db.createChallengeReview({
            submissionId: input.submissionId,
            reviewerId: ctx.user.id,
            criteriaScores: input.criteriaScores,
            overallScore: input.overallScore.toString(),
            strengths: input.strengths,
            weaknesses: input.weaknesses,
            recommendations: input.recommendations,
            decision: input.decision,
          });
          return { success: true, reviewId: id };
        }),

      getReviews: publicProcedure
        .input(z.object({ submissionId: z.number() }))
        .query(async ({ input }) => {
          return db.getSubmissionReviews(input.submissionId);
        }),
    }),

    // ========================================
    // NAQLA 2 → NAQLA 3 (Promotion after successful match)
    // ========================================
    promoteToNaqla3: protectedProcedure
      .input(z.object({
        projectId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { promoteProjectToNaqla3 } = await import('./naqla2-to-naqla3');
        const result = await promoteProjectToNaqla3({
          projectId: input.projectId,
          userId: ctx.user.id,
        });
        return result;
      }),

    // AI Matching System
    calculateMatches: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        limit: z.number().optional().default(10),
      }))
      .mutation(async ({ ctx, input }) => {
        const { calculateMatchScore } = await import('./services/aiMatching');
        
        // جلب المشروع
        const project = await db.getProjectById(input.projectId);
        if (!project) throw new Error("المشروع غير موجود");

        // جلب جميع التحديات النشطة
        const challenges = await db.getAllChallenges();
        
        // حساب match score لكل تحدي
        const matches = await Promise.all(
          challenges.map(async (challenge: any) => {
            try {
              const matchResult = await calculateMatchScore({
                ideaTitle: project.title,
                ideaDescription: project.description || '',
                ideaCategory: project.category || '',
                ideaKeywords: [], // keywords field doesn't exist in projects table
                opportunityTitle: challenge.title,
                opportunityDescription: challenge.description,
                opportunityCategory: challenge.category || '',
                opportunityIndustry: challenge.industry || '',
              });

              return {
                challengeId: challenge.id,
                challenge,
                ...matchResult,
              };
            } catch (error) {
              console.error(`Error calculating match for challenge ${challenge.id}:`, error);
              return null;
            }
          })
        );

        // ترتيب حسب match score وأخذ أفضل N
        const validMatches = matches
          .filter((m: any): m is NonNullable<typeof m> => m !== null)
          .sort((a: any, b: any) => b.matchScore - a.matchScore)
          .slice(0, input.limit);

        // TODO: حفظ المطابقات في suggested_matches table (not implemented yet)
        // for (const match of validMatches) {
        //   await db.createSuggestedMatch({
        //     projectId: input.projectId,
        //     challengeId: match.challengeId,
        //     matchScore: match.matchScore.toString(),
        //     reasoning: match.reasoning,
        //     status: 'pending',
        //   });
        // }

        return {
          projectId: input.projectId,
          totalMatches: validMatches.length,
          matches: validMatches,
        };
      }),

    // ========================================
    // AI Opportunities Matching - المطابقة الذكية الشاملة
    // ========================================
    getProjectOpportunities: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        types: z.array(z.enum(['challenge', 'accelerator', 'incubator', 'partner'])).optional(),
        minMatchScore: z.number().min(0).max(100).default(50),
      }))
      .query(async ({ input }) => {
        const { getAllOpportunitiesForProject } = await import('./services/aiMatchingEngine');
        
        // جلب المشروع
        const project = await db.getProjectById(input.projectId);
        if (!project) throw new TRPCError({ code: 'NOT_FOUND', message: 'المشروع غير موجود' });

        // جلب جميع الفرص
        const challenges = await db.getAllChallenges();
        // TODO: إضافة جلب المسرعات والحاضنات والشركاء
        const accelerators: any[] = []; // await db.getAllAccelerators();
        const incubators: any[] = []; // await db.getAllIncubators();
        const partners: any[] = []; // await db.getAllPartners();

        // تحويل project إلى Project type
        const projectData = {
          ...project,
          fundingRequired: Number(project.fundingReceived) || 0,
          tags: project.tags ? String(project.tags) : null,
        };

        // حساب المطابقات
        const allOpportunities = await getAllOpportunitiesForProject(
          projectData,
          challenges,
          accelerators,
          incubators,
          partners
        );

        // تصفية حسب النوع و match score
        let filteredOpportunities = allOpportunities.filter(
          (opp) => opp.matchScore >= input.minMatchScore
        );

        if (input.types && input.types.length > 0) {
          filteredOpportunities = filteredOpportunities.filter((opp) =>
            input.types!.includes(opp.type)
          );
        }

        return {
          projectId: input.projectId,
          totalOpportunities: filteredOpportunities.length,
          opportunities: filteredOpportunities,
          breakdown: {
            challenges: filteredOpportunities.filter((o) => o.type === 'challenge').length,
            accelerators: filteredOpportunities.filter((o) => o.type === 'accelerator').length,
            incubators: filteredOpportunities.filter((o) => o.type === 'incubator').length,
            partners: filteredOpportunities.filter((o) => o.type === 'partner').length,
          },
        };
      }),
  }),

  // ============================================
  // NAQLA3 - Smart Contracts & Escrow
  // ============================================
  naqla3: router({
    // Get asset by ID
    getAssetById: protectedProcedure
      .input(z.object({ assetId: z.number() }))
      .query(async ({ input }) => {
        return db.getMarketplaceAssetById(input.assetId);
      }),

    // Contracts
    contracts: router({
      create: protectedProcedure
        .input(z.object({
          title: z.string().min(3),
          description: z.string().min(10),
          partyB: z.number(),
          totalAmount: z.string(),
          currency: z.string().default('SAR'),
          milestones: z.array(z.object({
            title: z.string(),
            amount: z.string(),
            dueDate: z.string().optional(),
            status: z.enum(['pending', 'completed', 'cancelled']).default('pending'),
          })).optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          terms: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          // TODO: Import and use contract functions
          return { success: true, id: 1 };
        }),

      sign: protectedProcedure
        .input(z.object({
          contractId: z.number(),
          signature: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
          // TODO: Import and use contract functions
          return { success: true };
        }),

      updateMilestone: protectedProcedure
        .input(z.object({
          contractId: z.number(),
          milestoneIndex: z.number(),
          status: z.enum(['pending', 'completed', 'cancelled']),
        }))
        .mutation(async ({ ctx, input }) => {
          // TODO: Import and use contract functions
          return { success: true };
        }),

      getMyContracts: protectedProcedure
        .query(async ({ ctx }) => {
          // TODO: Import and use contract functions
          return [];
        }),

      getContract: protectedProcedure
        .input(z.object({ contractId: z.number() }))
        .query(async ({ ctx, input }) => {
          // TODO: Import and use contract functions
          return null;
        }),

      cancel: protectedProcedure
        .input(z.object({
          contractId: z.number(),
          reason: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          // TODO: Import and use contract functions
          return { success: true };
        }),
    }),

    // Milestones
    milestones: router({
      getContractMilestones: protectedProcedure
        .input(z.object({
          contractId: z.number(),
          blockchainContractId: z.number(),
        }))
        .query(async ({ ctx, input }) => {
          const { getContractMilestones } = await import('./naqla3-milestones');
          return getContractMilestones(input.contractId, input.blockchainContractId);
        }),

      start: protectedProcedure
        .input(z.object({
          contractId: z.number(),
          blockchainContractId: z.number(),
          milestoneIndex: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
          const { startMilestone } = await import('./naqla3-milestones');
          const testPrivateKey = process.env.BLOCKCHAIN_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
          return startMilestone({
            ...input,
            privateKey: testPrivateKey,
          });
        }),

      complete: protectedProcedure
        .input(z.object({
          contractId: z.number(),
          blockchainContractId: z.number(),
          milestoneIndex: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
          const { completeMilestone } = await import('./naqla3-milestones');
          const testPrivateKey = process.env.BLOCKCHAIN_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
          return completeMilestone({
            ...input,
            privateKey: testPrivateKey,
          });
        }),

      approve: protectedProcedure
        .input(z.object({
          contractId: z.number(),
          blockchainContractId: z.number(),
          milestoneIndex: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
          const { approveMilestone } = await import('./naqla3-milestones');
          const testPrivateKey = process.env.BLOCKCHAIN_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
          return approveMilestone({
            ...input,
            privateKey: testPrivateKey,
          });
        }),

      reject: protectedProcedure
        .input(z.object({
          contractId: z.number(),
          blockchainContractId: z.number(),
          milestoneIndex: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
          const { rejectMilestone } = await import('./naqla3-milestones');
          const testPrivateKey = process.env.BLOCKCHAIN_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
          return rejectMilestone({
            ...input,
            privateKey: testPrivateKey,
          });
        }),
    }),

    // Escrow
    escrow: router({
      deposit: protectedProcedure
        .input(z.object({
          contractId: z.number(),
          amount: z.string(),
          // paymentMethod: z.enum(['bank_transfer', 'credit_card', 'wallet']),
          transactionReference: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          // Get or create escrow account
          let escrow = await db.getEscrowByContractId(input.contractId);
          if (!escrow) {
            const escrowId = await db.createEscrowAccount({
              contractId: input.contractId,
              totalAmount: input.amount,
              // balance: '0',
              status: 'pending_deposit',
            });
            escrow = await db.getEscrowById(escrowId);
          }
          
          if (!escrow) throw new Error('Failed to create escrow account');
          
          // Create transaction
          await db.createEscrowTransaction({
            escrowId: escrow.id,
            type: 'deposit',
            amount: input.amount,
            status: 'completed',
            // paymentMethod: input.paymentMethod,
            // transactionReference: input.transactionReference,
          });
          
          // Update balance
          // const currentBalance = parseFloat(escrow.balance || '0');
          // const newBalance = (currentBalance + parseFloat(input.amount)).toString();
          await db.updateEscrow(escrow.id, { 
            // balance: newBalance,
            status: 'funded'
          });
          
          return { success: true, transactionId: escrow.id };
        }),

      requestRelease: protectedProcedure
        .input(z.object({
          contractId: z.number(),
          milestoneIndex: z.number(),
          amount: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
          // TODO: Import and use escrow functions
          return { success: true, requestId: 1 };
        }),

      approveRelease: protectedProcedure
        .input(z.object({ requestId: z.number() }))
        .mutation(async ({ ctx, input }) => {
          // TODO: Import and use escrow functions
          return { success: true };
        }),

      rejectRelease: protectedProcedure
        .input(z.object({
          requestId: z.number(),
          reason: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
          // TODO: Import and use escrow functions
          return { success: true };
        }),

      getTransactions: protectedProcedure
        .input(z.object({ contractId: z.number() }))
        .query(async ({ ctx, input }) => {
          // TODO: Import and use escrow functions
          return [];
        }),

      getReleaseRequests: protectedProcedure
        .input(z.object({ contractId: z.number() }))
        .query(async ({ ctx, input }) => {
          // TODO: Import and use escrow functions
          return [];
        }),

      getStats: protectedProcedure
        .query(async ({ ctx }) => {
          // TODO: Implement getStats
          return {
            totalHackathons: 0,
            totalParticipants: 0,
            activeHackathons: 0,
            completedHackathons: 0,
            totalEscrow: '0',
            totalReleased: '0',
            activeEscrows: 0,
            completedEscrows: 0,
          };
        }),
    }),

    // Assets (Marketplace)
    assets: router({
      getAll: publicProcedure
        .input(z.object({
          type: z.enum(['license', 'product', 'acquisition', 'partnership', 'service', 'investment', 'nda']).optional(),
          category: z.string().optional(),
          search: z.string().optional(),
          status: z.enum(['draft', 'active', 'sold', 'archived']).optional(),
        }).optional())
        .query(async ({ input }) => {
          return await db.getAllAssets(input || {});
        }),

      getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          const asset = await db.getAssetById(input.id);
          if (!asset) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Asset not found' });
          }
          return asset;
        }),

      like: protectedProcedure
        .input(z.object({ assetId: z.number() }))
        .mutation(async ({ input }) => {
          return await db.likeAsset(input.assetId);
        }),

      contact: protectedProcedure
        .input(z.object({ assetId: z.number() }))
        .mutation(async ({ input }) => {
          return await db.contactAssetOwner(input.assetId);
        }),

      // Stripe Payment
      createCheckout: protectedProcedure
        .input(z.object({ 
          assetId: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
          const asset = await db.getAssetById(input.assetId);
          if (!asset) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Asset not found' });
          }

          // Initialize Stripe (will be configured with user's keys)
          const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
          
          if (!process.env.STRIPE_SECRET_KEY) {
            throw new TRPCError({ 
              code: 'PRECONDITION_FAILED', 
              message: 'Stripe is not configured. Please add your Stripe keys in Settings → Payment.' 
            });
          }

          // Create checkout session
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: asset.currency?.toLowerCase() || 'sar',
                  product_data: {
                    name: asset.title,
                    description: asset.description,
                  },
                  unit_amount: Math.round(parseFloat(asset.price.toString()) * 100),
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: `${ctx.req.headers.origin}/naqla3/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${ctx.req.headers.origin}/naqla3/assets/${asset.id}`,
            client_reference_id: ctx.user.id.toString(),
            metadata: {
              user_id: ctx.user.id.toString(),
              asset_id: asset.id.toString(),
              customer_email: ctx.user.email || '',
              customer_name: ctx.user.name || '',
            },
          });

          return { checkoutUrl: session.url };
        }),

      // رفع التوقيع الإلكتروني
      uploadSignature: protectedProcedure
        .input(z.object({
          contractId: z.number(),
          signatureDataUrl: z.string(), // base64 image
          role: z.enum(['seller', 'buyer']),
        }))
        .mutation(async ({ input, ctx }) => {
          const { contractId, signatureDataUrl, role } = input;

          // التحقق من وجود العقد
          const contract = await db.getContractById(contractId);
          if (!contract) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'العقد غير موجود' });
          }

          // التحقق من صلاحية المستخدم
          const isSeller = contract.partyA === ctx.user.id;
          const isBuyer = contract.partyB === ctx.user.id;
          
          if (role === 'seller' && !isSeller) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحية للتوقيع كبائع' });
          }
          if (role === 'buyer' && !isBuyer) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'ليس لديك صلاحية للتوقيع كمشتري' });
          }

          // تحويل base64 إلى Buffer
          const base64Data = signatureDataUrl.replace(/^data:image\/png;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');

          // رفع التوقيع إلى S3
          const fileName = `contract-${contractId}-${role}-signature-${Date.now()}.png`;
          const { url } = await storagePut(fileName, buffer, 'image/png');

          // تحديث العقد في قاعدة البيانات
          const updateData = role === 'seller'
            ? { sellerSignatureUrl: url, sellerSignedAt: new Date().toISOString() }
            : { buyerSignatureUrl: url, buyerSignedAt: new Date().toISOString() };

          await db.updateContract(contractId, updateData);

          return { success: true, signatureUrl: url };
        }),

      // توليد PDF موقع
      generateSignedPDF: protectedProcedure
        .input(z.object({
          contractId: z.number(),
        }))
        .mutation(async ({ input, ctx }) => {
          const { contractId } = input;

          // التحقق من وجود العقد
          const contract = await db.getContractById(contractId);
          if (!contract) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'العقد غير موجود' });
          }

          // التحقق من اكتمال التوقيعين
          if (!contract.sellerSignatureUrl || !contract.buyerSignatureUrl) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'يجب أن يوقع الطرفان قبل توليد PDF' });
          }

          // توليد PDF وحفظه في S3
          const { generateContractPDF } = await import('./services/contractPdfGenerator');
          const pdfUrl = await generateContractPDF(contract);

          // تحديث العقد بـ PDF URL
          await db.updateContract(contractId, { signedPdfUrl: pdfUrl });

          return { success: true, pdfUrl };
        }),
    }),


  }),

  // ============================================
  // ADMIN - Admin Panel
  // ============================================
  admin: router({
    getStats: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
        }
        // TODO: Implement stats aggregation
        return {
          totalUsers: 0,
          totalProjects: 0,
          activeMatches: 0,
          activeContracts: 0,
          activeUsers: 0,
          recentProjects: 0,
          successfulMatches: 0,
          completedContracts: 0,
        };
      }),

    getUsers: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
        }
        // TODO: Implement user listing
        return [];
      }),

    getProjects: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
        }
        // TODO: Implement project listing
        return [];
      }),

    banUser: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
        }
        // TODO: Implement user ban
        return { success: true };
      }),

    deleteProject: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
        }
        // TODO: Implement project deletion
        return { success: true };
      }),
  }),

  // ============================================
  // SEARCH - Global Search
  // ============================================
  search: router({
    global: publicProcedure
      .input(z.object({ 
        query: z.string(),
        type: z.enum(['all', 'ideas', 'users', 'events', 'contracts']).default('all')
      }))
      .query(async ({ input }) => {
        // TODO: Implement global search
        return {
          ideas: [],
          users: [],
          events: [],
          contracts: []
        };
      }),
  }),

  // ============================================
  // MESSAGES - Messaging System
  // ============================================
  messages: router({
    getConversations: protectedProcedure
      .query(async ({ ctx }) => {
        // TODO: Implement getConversations
        return [];
      }),

    getMessages: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ ctx, input }) => {
        // TODO: Implement getMessages
        return [];
      }),

    send: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
        content: z.string()
      }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Implement send message
        return { success: true };
      }),
  }),

  // ============================================
  // STRATEGIC PARTNERS - الشركاء الاستراتيجيون
  // ============================================
  strategicPartners: router({
    // الحصول على جميع الشركاء
    getAll: publicProcedure
      .input(z.object({ activeOnly: z.boolean().optional() }))
      .query(async ({ input }) => {
        const partners = await db.getAllStrategicPartners(input.activeOnly ?? true);
        return partners;
      }),

    // الحصول على شريك بالـ ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const partner = await db.getStrategicPartnerById(input.id);
        return partner;
      }),

    // إنشاء شريك جديد (admin only)
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        nameAr: z.string().optional(),
        type: z.enum(['university', 'government', 'incubator', 'accelerator', 'investor', 'corporate']),
        logo: z.string().optional(),
        website: z.string().optional(),
        description: z.string().optional(),
        descriptionAr: z.string().optional(),
        focusAreas: z.array(z.string()).optional(),
        supportTypes: z.array(z.string()).optional(),
        eligibilityCriteria: z.array(z.string()).optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
        }
        const partnerId = await db.createStrategicPartner(input);
        return { partnerId };
      }),

    // تحديث شريك
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          nameAr: z.string().optional(),
          type: z.enum(['university', 'government', 'incubator', 'accelerator', 'investor', 'corporate']).optional(),
          logo: z.string().optional(),
          website: z.string().optional(),
          description: z.string().optional(),
          descriptionAr: z.string().optional(),
          focusAreas: z.array(z.string()).optional(),
          supportTypes: z.array(z.string()).optional(),
          eligibilityCriteria: z.array(z.string()).optional(),
          contactEmail: z.string().optional(),
          contactPhone: z.string().optional(),
          status: z.enum(['active', 'inactive', 'pending']).optional(),
        }),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
        }
        await db.updateStrategicPartner(input.id, input.data);
        return { success: true };
      }),

    // الحصول على المشاريع المدعومة
    getProjects: publicProcedure
      .input(z.object({
        partnerId: z.number().optional(),
        ideaId: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const projects = await db.getPartnerProjects(input.partnerId, input.ideaId);
        return projects;
      }),

    // إنشاء مشروع مدعوم
    createProject: protectedProcedure
      .input(z.object({
        partnerId: z.number(),
        ideaId: z.number(),
        projectName: z.string(),
        supportType: z.enum(['funding', 'mentorship', 'infrastructure', 'training', 'networking', 'legal', 'marketing']),
        fundingAmount: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        milestones: z.array(z.any()).optional(),
      }))
      .mutation(async ({ input }) => {
        const projectId = await db.createPartnerProject(input);
        return { projectId };
      }),

    // تحديث مشروع مدعوم
    updateProject: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          status: z.enum(['pending', 'active', 'completed', 'cancelled']).optional(),
          milestones: z.array(z.any()).optional(),
          outcomes: z.array(z.any()).optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updatePartnerProject(input.id, input.data);
        return { success: true };
      }),
  }),

  // ============================================
  // VALUE FOOTPRINTS - قياس الأثر
  // ============================================
  valueFootprints: router({
    // الحصول على جميع القياسات
    getAll: publicProcedure
      .input(z.object({
        periodType: z.enum(['monthly', 'quarterly', 'yearly']).optional(),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const footprints = await db.getValueFootprints(
          input.periodType,
          input.limit || 12
        );
        return footprints;
      }),

    // الحصول على آخر قياس
    getLatest: publicProcedure
      .query(async () => {
        const footprint = await db.getLatestValueFootprint();
        return footprint;
      }),

    // حساب وتحديث القياس (admin only)
    calculate: protectedProcedure
      .input(z.object({
        period: z.string(),
        periodType: z.enum(['monthly', 'quarterly', 'yearly']),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
        }
        const footprintId = await db.calculateValueFootprint(
          input.period,
          input.periodType
        );
        return { footprintId };
       }),
  }),

  // ============================================
  // STRATEGIC PARTNERS
  // ============================================
  partners: router({
    // جلب الأفكار المُوجّهة للشريك الاستراتيجي
    getAssignedIdeas: protectedProcedure
      .query(async ({ ctx }) => {
        // تحديد نوع الشريك حسب المستخدم
        // TODO: إضافة partner_type في users table
        const partnerType = 'kaust'; // مؤقتاً
        
        // جلب الأفكار المُوجّهة لهذا الشريك
        const ideas = await db.getAllIdeas();
        return ideas;
      }),

    // قبول فكرة
    acceptIdea: protectedProcedure
      .input(z.object({ ideaId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.updateIdea(input.ideaId, { partnerStatus: 'accepted' });
        
        // TODO: إرسال إشعار للمبتكر
        
        return { success: true };
      }),

    // رفض فكرة
    rejectIdea: protectedProcedure
      .input(z.object({ 
        ideaId: z.number(),
        feedback: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateIdea(input.ideaId, { 
          partnerStatus: 'rejected',
          partnerFeedback: input.feedback,
        });
        
        // TODO: إرسال إشعار للمبتكر مع feedback
        
        return { success: true };
      }),

    // إرسال feedback
    sendFeedback: protectedProcedure
      .input(z.object({ 
        ideaId: z.number(),
        feedback: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateIdea(input.ideaId, { 
          partnerFeedback: input.feedback,
        });
        
        // TODO: إرسال إشعار للمبتكر
        
        return { success: true };
      }),
  }),

  // ============================================
  // AI CLUSTERING (Innovation 360 Feature)
  // ============================================
  clustering: router({
    // تجميع الأفكار تلقائياً باستخدام AI
    clusterIdeas: protectedProcedure
      .input(z.object({
        targetClusters: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // استيراد clustering engine
        const { clusterIdeas } = await import('./services/aiClusteringEngine');
        
        // جلب جميع الأفكار المحللة
        const ideas = await db.getAllIdeas();
        const analyzedIdeas = ideas.filter(idea => idea.status === 'analyzed' || idea.status === 'approved');
        
        if (analyzedIdeas.length < 3) {
          throw new TRPCError({ 
            code: 'BAD_REQUEST', 
            message: 'يجب أن يكون هناك 3 أفكار محللة على الأقل للتجميع' 
          });
        }

        // تجميع الأفكار
        const clusters = await clusterIdeas(
          analyzedIdeas.map(idea => ({
            id: idea.id,
            title: idea.title,
            description: idea.description,
            category: idea.category || undefined,
            keywords: idea.keywords as string[] || undefined,
          })),
          input.targetClusters
        );

        // حفظ المجموعات في database
        const savedClusters = [];
        for (const cluster of clusters) {
          // إنشاء المجموعة
          const clusterId = await db.createIdeaCluster({
            name: cluster.name,
            nameEn: cluster.nameEn || null,
            description: cluster.description,
            descriptionEn: cluster.descriptionEn || null,
            strength: cluster.strength,
            memberCount: cluster.memberCount,
            createdBy: ctx.user.id,
          });

          // إضافة الأفكار للمجموعة
          for (let i = 0; i < cluster.ideas.length; i++) {
            const idea = cluster.ideas[i];
            const similarity = cluster.similarities[i];
            
            await db.addIdeaToCluster({
              clusterId,
              ideaId: idea.id,
              similarity,
              addedBy: ctx.user.id,
            });

            // تحديث clusterId في ideas table
            await db.updateIdea(idea.id, { clusterId });
          }

          savedClusters.push({ ...cluster, id: clusterId });
        }

        return { clusters: savedClusters };
      }),

    // جلب جميع المجموعات
    getClusters: publicProcedure
      .query(async () => {
        const clusters = await db.getAllClusters();
        return clusters;
      }),

    // جلب تفاصيل مجموعة واحدة مع الأفكار
    getClusterDetails: publicProcedure
      .input(z.object({ clusterId: z.number() }))
      .query(async ({ input }) => {
        const cluster = await db.getClusterById(input.clusterId);
        if (!cluster) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'المجموعة غير موجودة' });
        }

        const members = await db.getClusterMembers(input.clusterId);
        const ideas = await Promise.all(
          members.map(m => db.getIdeaById(m.ideaId))
        );

        return {
          ...cluster,
          ideas: ideas.filter(Boolean),
          similarities: members.map(m => m.similarity),
        };
      }),

    // دمج أفكار في مجموعة موجودة (يدوي)
    mergeIdeasIntoCluster: protectedProcedure
      .input(z.object({
        clusterId: z.number(),
        ideaIds: z.array(z.number()),
      }))
      .mutation(async ({ ctx, input }) => {
        // التحقق من وجود المجموعة
        const cluster = await db.getClusterById(input.clusterId);
        if (!cluster) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'المجموعة غير موجودة' });
        }

        // إضافة الأفكار للمجموعة
        for (const ideaId of input.ideaIds) {
          await db.addIdeaToCluster({
            clusterId: input.clusterId,
            ideaId,
            similarity: 80, // default similarity for manual merge
            addedBy: ctx.user.id,
          });

          // تحديث clusterId في ideas table
          await db.updateIdea(ideaId, { clusterId: input.clusterId });
        }

        // تحديث memberCount
        const members = await db.getClusterMembers(input.clusterId);
        await db.updateCluster(input.clusterId, { 
          memberCount: members.length 
        });

        return { success: true };
      }),

    // إنشاء مجموعة يدوياً
    createManualCluster: protectedProcedure
      .input(z.object({
        name: z.string(),
        nameEn: z.string().optional(),
        description: z.string(),
        descriptionEn: z.string().optional(),
        ideaIds: z.array(z.number()),
      }))
      .mutation(async ({ ctx, input }) => {
        // إنشاء المجموعة
        const clusterId = await db.createIdeaCluster({
          name: input.name,
          nameEn: input.nameEn || null,
          description: input.description,
          descriptionEn: input.descriptionEn || null,
          strength: 50, // default strength for manual cluster
          memberCount: input.ideaIds.length,
          createdBy: ctx.user.id,
        });

        // إضافة الأفكار
        for (const ideaId of input.ideaIds) {
          await db.addIdeaToCluster({
            clusterId,
            ideaId,
            similarity: 80,
            addedBy: ctx.user.id,
          });

          await db.updateIdea(ideaId, { clusterId });
        }

        return { clusterId };
      }),

    // حذف مجموعة
    deleteCluster: protectedProcedure
      .input(z.object({ clusterId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // إزالة clusterId من الأفكار
        const members = await db.getClusterMembers(input.clusterId);
        for (const member of members) {
          await db.updateIdea(member.ideaId, { clusterId: null });
        }

        // حذف المجموعة
        await db.deleteCluster(input.clusterId);

        return { success: true };
      }),
  }),
});
export type AppRouter = typeof appRouter;
