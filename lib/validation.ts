import { countries, fields } from "@/lib/data";
import type { StudentProfile } from "@/lib/types";

export function validateProfile(input: unknown): { ok: true; data: StudentProfile } | { ok: false; error: string } {
  if (!input || typeof input !== "object") return { ok: false, error: "Profile payload is required." };
  const value = input as Record<string, unknown>;
  const originCountry = String(value.originCountry || "");
  const targetCountries = Array.isArray(value.targetCountries) ? value.targetCountries.map(String) : [];
  const degreeLevel = String(value.degreeLevel || "") as StudentProfile["degreeLevel"];
  const fieldOfStudy = String(value.fieldOfStudy || "");
  const gpa = Number(value.gpa);
  const englishTest = String(value.englishTest || "None") as StudentProfile["englishTest"];
  const englishScore = value.englishScore === undefined || value.englishScore === "" ? undefined : Number(value.englishScore);
  const otherLanguages = Array.isArray(value.otherLanguages) ? value.otherLanguages.map(String).filter(Boolean).slice(0, 8) : [];
  const financialNeed = String(value.financialNeed || "") as StudentProfile["financialNeed"];
  const workExperience = String(value.workExperience || "") as StudentProfile["workExperience"];
  const researchPublications = String(value.researchPublications || "No") as StudentProfile["researchPublications"];
  const volunteerWork = String(value.volunteerWork || "No") as StudentProfile["volunteerWork"];
  const achievements = String(value.achievements || "").slice(0, 500);

  if (!countries.includes(originCountry)) return { ok: false, error: "Choose a valid country of origin." };
  if (targetCountries.length < 1 || targetCountries.length > 3 || targetCountries.some((c) => !countries.includes(c))) return { ok: false, error: "Choose 1-3 valid target countries." };
  if (!["Bachelor", "Master", "PhD"].includes(degreeLevel)) return { ok: false, error: "Choose a valid degree level." };
  if (!fields.includes(fieldOfStudy)) return { ok: false, error: "Choose a valid field of study." };
  if (!Number.isFinite(gpa) || gpa < 0 || gpa > 4) return { ok: false, error: "GPA must be between 0 and 4.0." };
  if (!["IELTS", "TOEFL", "Duolingo", "None"].includes(englishTest)) return { ok: false, error: "Choose a valid English test." };
  if (englishTest !== "None") {
    const ranges = { IELTS: [0, 9], TOEFL: [0, 120], Duolingo: [10, 160] } as const;
    const [min, max] = ranges[englishTest as keyof typeof ranges];
    if (!Number.isFinite(englishScore) || englishScore! < min || englishScore! > max) return { ok: false, error: `${englishTest} score must be between ${min} and ${max}.` };
  }
  if (!["Yes", "Partial", "No"].includes(financialNeed)) return { ok: false, error: "Choose financial need." };
  if (!["0", "1-2 years", "3-5 years", "5+"].includes(workExperience)) return { ok: false, error: "Choose work experience." };

  return { ok: true, data: { originCountry, targetCountries, degreeLevel, fieldOfStudy, gpa, englishTest, englishScore, otherLanguages, financialNeed, workExperience, researchPublications, volunteerWork, achievements } };
}
