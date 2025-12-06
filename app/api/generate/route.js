import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Validates a roadmap object structure
 * @param {object} roadmap - The roadmap object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateRoadmap(roadmap) {
    if (!roadmap || typeof roadmap !== "object") {
        return false;
    }

    // Validate goal - required, non-empty string
    if (typeof roadmap.goal !== "string" || roadmap.goal.trim() === "") {
        return false;
    }

    // Validate duration_estimate - required, non-empty string
    if (
        typeof roadmap.duration_estimate !== "string" ||
        roadmap.duration_estimate.trim() === ""
    ) {
        return false;
    }

    // Validate modules - required array with at least 1 element
    if (!Array.isArray(roadmap.modules) || roadmap.modules.length < 1) {
        return false;
    }

    // Validate each module
    for (const mod of roadmap.modules) {
        if (!mod || typeof mod !== "object") {
            return false;
        }
        // name - required, non-empty string
        if (typeof mod.name !== "string" || mod.name.trim() === "") {
            return false;
        }
        // description - required, non-empty string
        if (
            typeof mod.description !== "string" ||
            mod.description.trim() === ""
        ) {
            return false;
        }
        // weeks - required, positive number
        if (typeof mod.weeks !== "number" || mod.weeks <= 0) {
            return false;
        }
        // milestones - required array (can be empty)
        if (!Array.isArray(mod.milestones)) {
            return false;
        }
        // resources - optional array, validate structure if present
        if (mod.resources !== undefined) {
            if (!Array.isArray(mod.resources)) {
                return false;
            }
            for (const resource of mod.resources) {
                if (!resource || typeof resource !== "object") {
                    return false;
                }
                if (typeof resource.title !== "string" || resource.title.trim() === "") {
                    return false;
                }
                if (typeof resource.url !== "string" || resource.url.trim() === "") {
                    return false;
                }
                if (typeof resource.type !== "string" || resource.type.trim() === "") {
                    return false;
                }
            }
        }
    }

    // Validate timeline - required array with at least 1 element
    if (!Array.isArray(roadmap.timeline) || roadmap.timeline.length < 1) {
        return false;
    }

    // Validate each timeline entry
    for (const entry of roadmap.timeline) {
        if (!entry || typeof entry !== "object") {
            return false;
        }
        // week - required, positive number
        if (typeof entry.week !== "number" || entry.week <= 0) {
            return false;
        }
        // tasks - required array (can be empty)
        if (!Array.isArray(entry.tasks)) {
            return false;
        }
    }

    return true;
}

/**
 * Extracts JSON from a text response that may contain markdown code blocks
 * @param {string} text - The text to extract JSON from
 * @returns {object|null} - Parsed JSON object or null if not found
 */
function extractJsonFromResponse(text) {
    // Try to find JSON in markdown code blocks first
    const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonBlockMatch) {
        try {
            return JSON.parse(jsonBlockMatch[1].trim());
        } catch (e) {
            // Continue to try other methods
        }
    }

    // Try to find a JSON object directly in the text
    const jsonMatch = text.match(/\{[\s\S]*"goal"[\s\S]*"modules"[\s\S]*\}/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            // JSON parsing failed
        }
    }

    return null;
}

/**
 * Constructs the prompt for Gemini API
 * @param {string} message - The user's message
 * @param {Array} conversationHistory - Previous conversation messages
 * @returns {string} - The constructed prompt
 */
function constructPrompt(message, conversationHistory = []) {
    let contextPart = "";

    if (conversationHistory && conversationHistory.length > 0) {
        contextPart =
            "Previous conversation:\n" +
            conversationHistory
                .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
                .join("\n") +
            "\n\n";
    }

    return `You are Beam, a friendly and helpful learning roadmap assistant. Your goal is to help students create structured learning plans with curated learning resources.

${contextPart}User's current message: ${message}

Please respond with:
1. A conversational, helpful response to the user
2. If you have enough information about their learning goal, include a structured roadmap in JSON format with learning resources

When you're ready to provide a roadmap, format it as a JSON object with this exact structure:
\`\`\`json
{
  "goal": "The user's learning goal",
  "duration_estimate": "Estimated time to complete (e.g., '8 weeks')",
  "modules": [
    {
      "name": "Module name",
      "description": "What this module covers",
      "weeks": 2,
      "milestones": ["Milestone 1", "Milestone 2"],
      "resources": [
        {
          "title": "Resource title",
          "url": "https://example.com/resource",
          "type": "video"
        }
      ]
    }
  ],
  "timeline": [
    {
      "week": 1,
      "tasks": ["Task 1", "Task 2"]
    }
  ]
}
\`\`\`

IMPORTANT: For each module, include 2-4 high-quality learning resources. Resource types can be:
- "video" - YouTube tutorials, course videos (prefer official channels, popular educators)
- "documentation" - Official docs, MDN, language/framework documentation
- "article" - Blog posts, tutorials, guides
- "course" - Free courses from platforms like freeCodeCamp, Coursera, edX
- "tool" - Interactive tools, playgrounds, practice platforms

Prioritize:
1. Official documentation and guides
2. Popular YouTube channels (Fireship, Traversy Media, The Net Ninja, freeCodeCamp, etc.)
3. Well-known free learning platforms
4. High-quality blog posts and tutorials

Only include the JSON roadmap when you have a clear understanding of what the user wants to learn. Otherwise, ask clarifying questions to better understand their goals.`;
}


/**
 * POST handler for the generate API route
 * Accepts a message and optional conversationHistory, calls Gemini API,
 * and returns both conversational text and structured roadmap JSON
 */
export async function POST(request) {
    // Check for API key - return 500 if missing (Requirements: 7.5)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return Response.json(
            { error: "Server configuration error" },
            { status: 500 }
        );
    }

    // Parse and validate request body - return 400 if invalid (Requirements: 7.1, 7.5)
    let body;
    try {
        body = await request.json();
    } catch (e) {
        return Response.json(
            { error: "Invalid request format" },
            { status: 400 }
        );
    }

    // Validate message field exists and is non-empty
    if (!body.message || typeof body.message !== "string" || body.message.trim() === "") {
        return Response.json(
            { error: "Invalid request format" },
            { status: 400 }
        );
    }

    const { message, conversationHistory } = body;

    try {
        // Initialize Gemini API client (Requirements: 7.2)
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Construct prompt and call Gemini API (Requirements: 3.1)
        const prompt = constructPrompt(message, conversationHistory);
        const result = await model.generateContent(prompt);
        const response = result.response;
        const responseText = response.text();

        // Extract roadmap JSON from response (Requirements: 3.2, 7.3)
        const roadmapJson = extractJsonFromResponse(responseText);

        // Validate roadmap structure if present (Requirements: 3.3, 3.4, 3.5)
        let validatedRoadmap = null;
        if (roadmapJson && validateRoadmap(roadmapJson)) {
            validatedRoadmap = roadmapJson;
        }

        // Clean the text response by removing the JSON block for cleaner display
        let cleanText = responseText;
        const jsonBlockMatch = responseText.match(/```(?:json)?\s*[\s\S]*?```/);
        if (jsonBlockMatch) {
            cleanText = responseText.replace(jsonBlockMatch[0], "").trim();
        }

        // Return formatted response (Requirements: 7.4)
        return Response.json({
            text: cleanText,
            roadmap: validatedRoadmap,
        });
    } catch (error) {
        // Handle Gemini API failures - return 502 (Requirements: 7.5)
        console.error("Gemini API error:", error);
        return Response.json(
            { error: "AI service temporarily unavailable" },
            { status: 502 }
        );
    }
}
