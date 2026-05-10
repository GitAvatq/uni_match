import type { MatchResults, StudentProfile } from "@/lib/types";

const flags: Record<string, string> = { "United States": "🇺🇸", "United Kingdom": "🇬🇧", Canada: "🇨🇦", Australia: "🇦🇺", Germany: "🇩🇪", France: "🇫🇷", Netherlands: "🇳🇱", Sweden: "🇸🇪", Japan: "🇯🇵", "South Korea": "🇰🇷" };

export function buildMockResults(profile: StudentProfile): MatchResults {
  const primary = profile.targetCountries[0] || "United States";
  const second = profile.targetCountries[1] || "United Kingdom";
  const third = profile.targetCountries[2] || "Canada";
  const strongGpa = profile.gpa >= 3.5;
  const research = profile.researchPublications === "Yes";
  const profileScore = Math.min(96, Math.round(profile.gpa * 18 + (profile.englishTest !== "None" ? 10 : 0) + (research ? 9 : 0) + (profile.volunteerWork === "Yes" ? 7 : 0) + (profile.achievements ? 8 : 0)));
  const scholarshipSeed = [
    ["global-excellence", "Global Excellence Scholarship", "University International Office", primary, "Full tuition + living stipend", "December 1, 2026", 91, "competitive", "full"],
    ["daad-study", "DAAD Study Scholarship", "German Academic Exchange Service", profile.targetCountries.includes("Germany") ? "Germany" : second, "Monthly stipend + travel allowance", "October 31, 2026", 86, "competitive", "full"],
    ["future-leaders", "Future Leaders International Award", "Meridian Foundation", second, "$25,000 per year", "January 15, 2027", 82, "moderate", "partial"],
    ["orange-tulip", "Orange Tulip Scholarship", "Nuffic & Partner Universities", profile.targetCountries.includes("Netherlands") ? "Netherlands" : third, "25-100% tuition waiver", "February 1, 2027", 78, "moderate", "partial"],
    ["women-stem", "STEM Impact Scholarship", "Global STEM Fund", primary, "$18,000 tuition award", "Rolling", 74, "moderate", "partial"],
    ["regional-access", "International Regional Access Grant", "Partner University Consortium", third, "$8,000-$15,000", "March 30, 2027", 68, "accessible", "partial"],
    ["merit-entry", "Merit Entrance Scholarship", "Admissions Scholarship Board", primary, "$5,000-$12,000", "Rolling", 63, "accessible", "tuition-only"]
  ] as const;

  return {
    scholarships: scholarshipSeed.map(([id, name, organization, country, amount, deadline, score, difficulty, type], index) => ({
      id,
      name,
      organization,
      country,
      flag: flags[country] || "🌍",
      amount,
      deadline,
      matchScore: Math.max(52, Math.min(96, Number(score) + (strongGpa ? 3 : -4) + (research && index < 2 ? 3 : 0))),
      difficulty: difficulty as MatchResults["scholarships"][number]["difficulty"],
      type: type as MatchResults["scholarships"][number]["type"],
      requirements: [`${profile.degreeLevel} applicant in ${profile.fieldOfStudy}`, "Strong academic record", "Motivation essay and recommendation letters"],
      strengths: [strongGpa ? "Your GPA is above the usual competitive threshold." : "Your GPA can work for access and regional awards.", profile.englishTest !== "None" ? `You already have a ${profile.englishTest} score to report.` : "Several listed awards accept proof later in the process.", research ? "Research publications strengthen faculty-backed funding applications." : "Your achievements narrative can support leadership scholarships."],
      gaps: [profile.englishTest === "None" ? "Add IELTS/TOEFL/Duolingo to unlock more options." : "Confirm the score is less than two years old.", "Prepare two highly specific recommendation letters.", "Tailor your personal statement to the funder's mission."],
      applyUrl: "https://www.internationalstudent.com/scholarships/",
      whyMatch: `This award fits a ${profile.originCountry} student targeting ${country} for ${profile.degreeLevel} studies in ${profile.fieldOfStudy}. Your profile suggests a realistic path if you position achievements around measurable impact.`
    })),
    overallAdvice: `Your best strategy is to split applications across reach, target, and safety awards rather than chasing only famous full rides. Start with scholarships where ${profile.fieldOfStudy} is explicitly named and where international applicants from ${profile.originCountry} are eligible.\n\nPrioritize deadlines in the next 90 days, because scholarship committees reward complete, early files. Build one master evidence folder with transcripts, English proof, passport, CV, recommendation drafts, and a 700-word motivation essay.\n\nTo raise your odds, quantify every achievement. Replace generic claims with outcomes, rankings, budgets, publications, users served, or hours volunteered. This makes your AI shortlist easier to convert into compelling real applications.`,
    profileScore,
    profileFeedback: {
      strengths: ["Clear academic direction with a defined field of study.", strongGpa ? "Competitive GPA for merit-based funding." : "Profile is suitable for accessible and regional scholarships.", profile.financialNeed !== "No" ? "Financial need can unlock need-aware grants." : "Merit positioning is clear without relying on need."],
      improvements: [profile.englishTest === "None" ? "Take an English test within 30 days." : "Verify minimum section scores for each award.", "Create a country-specific scholarship calendar.", "Strengthen proof of leadership with measurable evidence."],
      nextSteps: ["Shortlist 12 scholarships and apply to at least 7.", "Request recommendation letters this week.", "Draft one core essay and adapt it for every funder."]
    }
  };
}
