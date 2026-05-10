export type DegreeLevel = "Bachelor" | "Master" | "PhD";
export type Difficulty = "competitive" | "moderate" | "accessible";
export type ScholarshipType = "full" | "partial" | "tuition-only";

export type StudentProfile = {
  originCountry: string;
  targetCountries: string[];
  degreeLevel: DegreeLevel;
  fieldOfStudy: string;
  gpa: number;
  englishTest: "IELTS" | "TOEFL" | "Duolingo" | "None";
  englishScore?: number;
  otherLanguages: string[];
  financialNeed: "Yes" | "Partial" | "No";
  workExperience: "0" | "1-2 years" | "3-5 years" | "5+";
  researchPublications: "Yes" | "No";
  volunteerWork: "Yes" | "No";
  achievements: string;
};

export type Scholarship = {
  id: string;
  name: string;
  organization: string;
  country: string;
  flag: string;
  amount: string;
  deadline: string;
  matchScore: number;
  difficulty: Difficulty;
  type: ScholarshipType;
  requirements: string[];
  strengths: string[];
  gaps: string[];
  applyUrl: string;
  whyMatch: string;
};

export type MatchResults = {
  scholarships: Scholarship[];
  overallAdvice: string;
  profileScore: number;
  profileFeedback: {
    strengths: string[];
    improvements: string[];
    nextSteps: string[];
  };
};
