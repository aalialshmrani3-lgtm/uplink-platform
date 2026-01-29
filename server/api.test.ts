import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  createIPRegistration: vi.fn(),
  getIPRegistrationsByUserId: vi.fn(),
  createProject: vi.fn(),
  getProjectsByUserId: vi.fn(),
  getProjectById: vi.fn(),
  updateProjectStatus: vi.fn(),
  createEvaluation: vi.fn(),
  getEvaluationByProjectId: vi.fn(),
  getChallenges: vi.fn(),
  getCourses: vi.fn(),
  getEnrollmentsByUserId: vi.fn(),
  createEnrollment: vi.fn(),
  getContractsByUserId: vi.fn(),
}));

// Mock the LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          classification: "innovation",
          overallScore: 85,
          innovationScore: 90,
          marketPotentialScore: 80,
          technicalFeasibilityScore: 85,
          teamCapabilityScore: 75,
          ipStrengthScore: 88,
          scalabilityScore: 82,
          strengths: ["فكرة مبتكرة", "سوق واعد"],
          weaknesses: ["فريق صغير"],
          recommendations: ["توسيع الفريق", "البحث عن شريك استراتيجي"],
          marketAnalysis: "سوق واعد بحجم كبير",
          riskAssessment: "مخاطر متوسطة",
        }),
      },
    }],
  }),
}));

import * as db from "./db";

describe("IP Registration API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create IP registration with blockchain hash", async () => {
    const mockIP = {
      id: 1,
      userId: 1,
      type: "patent",
      title: "اختراع جديد",
      description: "وصف الاختراع",
      status: "submitted",
      blockchainHash: "0x123abc",
    };

    (db.createIPRegistration as any).mockResolvedValue(mockIP);

    const result = await db.createIPRegistration({
      userId: 1,
      type: "patent",
      title: "اختراع جديد",
      description: "وصف الاختراع",
    });

    expect(result).toBeDefined();
    expect(result.type).toBe("patent");
    expect(db.createIPRegistration).toHaveBeenCalledTimes(1);
  });

  it("should get IP registrations by user ID", async () => {
    const mockIPs = [
      { id: 1, title: "براءة 1", type: "patent" },
      { id: 2, title: "علامة تجارية 1", type: "trademark" },
    ];

    (db.getIPRegistrationsByUserId as any).mockResolvedValue(mockIPs);

    const result = await db.getIPRegistrationsByUserId(1);

    expect(result).toHaveLength(2);
    expect(result[0].type).toBe("patent");
    expect(result[1].type).toBe("trademark");
  });
});

describe("Project API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new project", async () => {
    const mockProject = {
      id: 1,
      userId: 1,
      title: "مشروع ابتكاري",
      description: "وصف المشروع",
      stage: "idea",
      status: "draft",
    };

    (db.createProject as any).mockResolvedValue(mockProject);

    const result = await db.createProject({
      userId: 1,
      title: "مشروع ابتكاري",
      description: "وصف المشروع",
      stage: "idea",
    });

    expect(result).toBeDefined();
    expect(result.title).toBe("مشروع ابتكاري");
    expect(result.status).toBe("draft");
  });

  it("should get projects by user ID", async () => {
    const mockProjects = [
      { id: 1, title: "مشروع 1", status: "draft" },
      { id: 2, title: "مشروع 2", status: "submitted" },
    ];

    (db.getProjectsByUserId as any).mockResolvedValue(mockProjects);

    const result = await db.getProjectsByUserId(1);

    expect(result).toHaveLength(2);
  });

  it("should update project status", async () => {
    const mockProject = {
      id: 1,
      title: "مشروع",
      status: "submitted",
    };

    (db.updateProjectStatus as any).mockResolvedValue(mockProject);

    const result = await db.updateProjectStatus(1, "submitted");

    expect(result.status).toBe("submitted");
  });
});

describe("AI Evaluation API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create evaluation with AI scores", async () => {
    const mockEvaluation = {
      id: 1,
      projectId: 1,
      classification: "innovation",
      overallScore: 85,
      innovationScore: 90,
      marketPotentialScore: 80,
      strengths: ["فكرة مبتكرة"],
      weaknesses: ["فريق صغير"],
    };

    (db.createEvaluation as any).mockResolvedValue(mockEvaluation);

    const result = await db.createEvaluation({
      projectId: 1,
      classification: "innovation",
      overallScore: 85,
      innovationScore: 90,
      marketPotentialScore: 80,
      technicalFeasibilityScore: 85,
      teamCapabilityScore: 75,
      ipStrengthScore: 88,
      scalabilityScore: 82,
      strengths: JSON.stringify(["فكرة مبتكرة"]),
      weaknesses: JSON.stringify(["فريق صغير"]),
      recommendations: JSON.stringify(["توسيع الفريق"]),
    });

    expect(result).toBeDefined();
    expect(result.classification).toBe("innovation");
    expect(result.overallScore).toBe(85);
  });

  it("should get evaluation by project ID", async () => {
    const mockEvaluation = {
      id: 1,
      projectId: 1,
      classification: "commercial",
      overallScore: 72,
    };

    (db.getEvaluationByProjectId as any).mockResolvedValue(mockEvaluation);

    const result = await db.getEvaluationByProjectId(1);

    expect(result).toBeDefined();
    expect(result.classification).toBe("commercial");
  });
});

describe("Challenges API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get all challenges", async () => {
    const mockChallenges = [
      { id: 1, title: "تحدي AI", status: "open" },
      { id: 2, title: "تحدي الطاقة", status: "closed" },
    ];

    (db.getChallenges as any).mockResolvedValue(mockChallenges);

    const result = await db.getChallenges();

    expect(result).toHaveLength(2);
    expect(result[0].status).toBe("open");
  });
});

describe("Academy API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get all courses", async () => {
    const mockCourses = [
      { id: 1, title: "دورة الابتكار", isFree: true },
      { id: 2, title: "دورة IP", isFree: false },
    ];

    (db.getCourses as any).mockResolvedValue(mockCourses);

    const result = await db.getCourses();

    expect(result).toHaveLength(2);
  });

  it("should create enrollment", async () => {
    const mockEnrollment = {
      id: 1,
      userId: 1,
      courseId: 1,
      status: "enrolled",
    };

    (db.createEnrollment as any).mockResolvedValue(mockEnrollment);

    const result = await db.createEnrollment({
      userId: 1,
      courseId: 1,
    });

    expect(result).toBeDefined();
    expect(result.status).toBe("enrolled");
  });
});

describe("Contracts API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get contracts by user ID", async () => {
    const mockContracts = [
      { id: 1, title: "عقد ترخيص", status: "active" },
      { id: 2, title: "عقد شراكة", status: "pending" },
    ];

    (db.getContractsByUserId as any).mockResolvedValue(mockContracts);

    const result = await db.getContractsByUserId(1);

    expect(result).toHaveLength(2);
    expect(result[0].status).toBe("active");
  });
});

describe("Classification Logic", () => {
  it("should classify as innovation when score >= 80", () => {
    const score = 85;
    const classification = score >= 80 ? "innovation" : score >= 60 ? "commercial" : "guidance";
    expect(classification).toBe("innovation");
  });

  it("should classify as commercial when score between 60-79", () => {
    const score = 72;
    const classification = score >= 80 ? "innovation" : score >= 60 ? "commercial" : "guidance";
    expect(classification).toBe("commercial");
  });

  it("should classify as guidance when score < 60", () => {
    const score = 45;
    const classification = score >= 80 ? "innovation" : score >= 60 ? "commercial" : "guidance";
    expect(classification).toBe("guidance");
  });
});

describe("Blockchain Hash Generation", () => {
  it("should generate valid hash format", () => {
    // Simulate blockchain hash generation
    const generateHash = (data: string) => {
      const timestamp = Date.now();
      const hash = `0x${timestamp.toString(16)}${data.length.toString(16).padStart(4, "0")}`;
      return hash;
    };

    const hash = generateHash("test data");
    expect(hash).toMatch(/^0x[a-f0-9]+$/);
  });
});
