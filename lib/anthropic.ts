import { buildMockResults } from "@/lib/mock-results";
import type { MatchResults, StudentProfile } from "@/lib/types";

const SYSTEM_PROMPT = `You are an expert international scholarship advisor with comprehensive knowledge of scholarships worldwide.

Given a student profile, return a JSON object matching this exact schema:
{
  "scholarships": [
    {
      "id": "unique-id",
      "name": "Full Official Scholarship Name",
      "organization": "University or Foundation",
      "country": "Host Country",
      "flag": "🇺🇸",
      "amount": "Specific amount (e.g., Full tuition + $2,000/month)",
      "deadline": "Month DD, YYYY or 'Rolling'",
      "matchScore": 87,
      "difficulty": "competitive" | "moderate" | "accessible",
      "type": "full" | "partial" | "tuition-only",
      "requirements": ["Requirement 1", "Requirement 2", "Requirement 3"],
      "strengths": ["Why this student is strong for this"],
      "gaps": ["What they might be missing"],
      "applyUrl": "https://real-url.com",
      "whyMatch": "2-3 sentence personalized explanation"
    }
  ],
  "overallAdvice": "3-4 paragraph personalized strategic advice",
  "profileScore": 78,
  "profileFeedback": {
    "strengths": ["3 specific strengths"],
    "improvements": ["3 actionable improvements"],
    "nextSteps": ["3 immediate action items"]
  }
}

Return ONLY valid JSON. No markdown. No explanation outside JSON.
Prioritize scholarships the student has realistic chances of winning.
Include mix: 2 reach, 3 target, 2 safety scholarships.
Use only real, currently-active scholarships.`;

function extractJson(text: string) {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI returned no JSON.");
  return JSON.parse(trimmed.slice(start, end + 1)) as MatchResults;
}

export async function matchScholarships(profile: StudentProfile): Promise<MatchResults> {
  if (process.env.ANTHROPIC_API_KEY) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 5000,
        temperature: 0.2,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: `Student profile: ${JSON.stringify(profile)}` }]
      })
    });
    if (!response.ok) throw new Error(`Anthropic request failed: ${response.status}`);
    const json = await response.json();
    const text = json.content?.map((part: { text?: string }) => part.text || "").join("") || "";
    return extractJson(text);
  }

  if (process.env.GROQ_API_KEY) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Student profile: ${JSON.stringify(profile)}` }
        ]
      })
    });
    if (!response.ok) throw new Error(`Groq request failed: ${response.status}`);
    const json = await response.json();
    return extractJson(json.choices?.[0]?.message?.content || "");
  }

  return buildMockResults(profile);
}
