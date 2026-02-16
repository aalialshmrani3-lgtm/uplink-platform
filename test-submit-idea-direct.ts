/**
 * Direct test of submitIdea logic on server
 */

import { analyzeIdea } from './server/uplink1-ai-analyzer';
import * as db from './server/db';

async function testSubmitIdea() {
  try {
    console.log('🧪 Testing submitIdea logic directly on server...');
    
    const testInput = {
      title: "نظام ذكي لإدارة النفايات باستخدام IoT",
      description: "نظام متكامل يستخدم أجهزة استشعار IoT وتحليلات الذكاء الاصطناعي لتحسين عملية جمع ومعالجة النفايات",
      problem: "المدن تواجه تحديات كبيرة في إدارة النفايات وحاويات ممتلئة",
      solution: "نستخدم أجهزة استشعار ذكية في الحاويات لقياس مستوى الامتلاء",
      targetMarket: "البلديات والمدن الذكية",
      uniqueValue: "نظامنا يجمع بين IoT و AI",
      category: "general"
    };
    
    console.log('📝 Test input:', JSON.stringify(testInput, null, 2));
    
    // Step 1: Create idea
    console.log('\n📊 Step 1: Creating idea...');
    const ideaId = await db.createIdea({
      userId: 1, // Test user ID
      title: testInput.title,
      description: testInput.description,
      problem: testInput.problem,
      solution: testInput.solution,
      targetMarket: testInput.targetMarket,
      uniqueValue: testInput.uniqueValue,
      category: testInput.category || "general",
      status: "submitted",
    });
    console.log('✅ Idea created with ID:', ideaId);
    
    // Step 2: Analyze idea
    console.log('\n📊 Step 2: Analyzing idea...');
    const analysisResult = await analyzeIdea(testInput);
    console.log('✅ Analysis completed!');
    console.log('📊 Overall score:', analysisResult.overallScore);
    console.log('📊 Classification:', analysisResult.classification);
    
    // Step 3: Save analysis
    console.log('\n📊 Step 3: Saving analysis...');
    const safeStringify = (value: any) => {
      if (value === undefined || value === null) return null;
      if (typeof value === 'string') return value;
      try {
        return JSON.stringify(value);
      } catch {
        return null;
      }
    };
    
    const safeToString = (value: any, defaultValue: string = "0") => {
      if (value === undefined || value === null) return defaultValue;
      return String(value);
    };
    
    const criterionScores = analysisResult.criterionScores || [];
    const scores: any = Array.isArray(criterionScores)
      ? criterionScores.reduce((acc: any, item: any) => {
          acc[item.criterion] = item;
          return acc;
        }, {})
      : criterionScores;
    
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
    
    console.log('✅ Analysis saved with ID:', analysisId);
    console.log('\n🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('💥 Test failed:', error);
    console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack');
    process.exit(1);
  }
}

testSubmitIdea();
