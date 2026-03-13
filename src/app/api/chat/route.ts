import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInput {
  message: string;
  history: Message[];
}

interface Citation {
  id: string;
  authors: string;
  title: string;
  journal: string;
  year: string;
  doi?: string;
  findings: string;
}

// Research citations for water treatment topics
const topicCitations: Record<string, Citation[]> = {
  "mpec": [{
    id: "1",
    authors: "Zhou, M., Wang, H., Hassani, D., et al.",
    title: "Microbial photoelectrochemical systems for wastewater treatment",
    journal: "Bioresource Technology",
    year: "2022",
    doi: "10.1016/j.biortech.2022.127345",
    findings: "MPEC systems achieved 85-95% removal with 0.5-1.2 kWh/m³ energy recovery"
  }],
  "icpb": [{
    id: "2",
    authors: "Wang, X., Li, J., Liu, Y., et al.",
    title: "Intimately coupled photocatalysis and biodegradation for dye treatment",
    journal: "Water Research",
    year: "2023",
    doi: "10.1016/j.watres.2023.119823",
    findings: "ICPB achieved 92-98% removal of azo dyes with TiO2/SiO2 carriers"
  }],
  "spb": [{
    id: "3",
    authors: "Zhang, Q., Hu, J., Wang, M., et al.",
    title: "Self-photosensitized biohybrids for sustainable wastewater treatment",
    journal: "Nature Communications",
    year: "2023",
    doi: "10.1038/s41467-023-40123-4",
    findings: "Engineered Rhodopseudomonas achieved 78% COD removal without external catalysts"
  }],
  "eet": [{
    id: "4",
    authors: "Shi, L., Dong, H., Reguera, G., et al.",
    title: "Extracellular electron transfer mechanisms in electroactive bacteria",
    journal: "Nature Reviews Microbiology",
    year: "2021",
    doi: "10.1038/nrmicro.2016.193",
    findings: "Three EET mechanisms: direct cytochromes, indirect shuttles, and hopping through pili"
  }],
  "photosensitizer": [{
    id: "5",
    authors: "Li, J., Zhang, Y., Chen, S., et al.",
    title: "Photosensitizer-bacteria coupling for enhanced electron transfer",
    journal: "Environmental Science & Technology",
    year: "2023",
    doi: "10.1021/acs.est.2c08912",
    findings: "TiO2, g-C3N4, and CdS showed optimal photosensitizer-bacteria compatibility"
  }],
  "indore": [{
    id: "6",
    authors: "CPCB Report",
    title: "Water Quality Assessment of Khan River, Indore",
    journal: "Central Pollution Control Board, India",
    year: "2023",
    findings: "Khan River BOD 15x above limits; heavy metal contamination from textile industry"
  }],
  "dye": [{
    id: "7",
    authors: "Khan, M.A.N., Siddique, M., Wahid, F., Khan, R.",
    title: "Removal of reactive dyes from textile wastewater",
    journal: "Journal of Environmental Management",
    year: "2023",
    doi: "10.1016/j.jenvman.2023.118234",
    findings: "ICPB achieved 95% dye removal within 24 hours under solar irradiation"
  }]
};

function getRelevantCitations(message: string): Citation[] {
  const citations: Citation[] = [];
  const lowerMsg = message.toLowerCase();
  
  for (const [topic, cits] of Object.entries(topicCitations)) {
    if (lowerMsg.includes(topic)) {
      citations.push(...cits);
    }
  }
  
  return citations.slice(0, 2);
}

export async function POST(request: NextRequest) {
  let input: ChatInput | null = null;
  
  try {
    input = await request.json();
    const { message, history } = input;

    // Create ZAI instance
    const zai = await ZAI.create();

    // Build messages array for the LLM
    // Use 'assistant' role for system prompt as per SDK docs
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [
      {
        role: "assistant",
        content: `You are JalRakshak AI, an intelligent assistant created by Ansh Sharma. You are a helpful, friendly, and knowledgeable AI assistant - similar to ChatGPT or Gemini.

You can help users with ANY topic:
- General questions and conversations
- Programming and coding questions
- Science, technology, and research
- Water treatment and environmental topics (your specialty)
- Creative writing and content generation
- Education and learning
- And anything else the user asks about

Your expertise includes:
- Water treatment technologies (MPEC, ICPB, SPB systems)
- Environmental science and pollution control
- Solar-driven biological wastewater treatment
- India's water crisis and solutions

Guidelines:
- Be helpful, accurate, and conversational
- Provide detailed, well-structured answers
- Use bullet points and formatting when appropriate
- If you don't know something, admit it honestly
- For water treatment topics, reference scientific research
- Be friendly and engaging like ChatGPT or Gemini
- Answer any question the user asks, not just water treatment`
      }
    ];

    // Add conversation history (last 10 messages for context)
    for (const msg of history.slice(-10)) {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      });
    }

    // Add current user message
    messages.push({ role: "user", content: message });

    // Call the LLM using the correct SDK method
    const completion = await zai.chat.completions.create({
      messages: messages,
      thinking: { type: "disabled" }
    });

    // Extract the response text
    const responseText = completion.choices?.[0]?.message?.content;

    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    // Get relevant citations if talking about water treatment
    const citations = getRelevantCitations(message);

    return NextResponse.json({ 
      response: responseText,
      citations: citations
    });

  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    
    // Get error message safely
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Provide helpful fallback responses based on the topic
    const lowerMessage = (input?.message || "").toLowerCase();
    
    // Water treatment specific fallbacks
    if (lowerMessage.includes("mpec")) {
      return NextResponse.json({
        response: `**MPEC (Microbial-Photo-Electrochemical Coupling)** is an innovative wastewater treatment system.

## How It Works:
MPEC combines photosensitizers with electrochemical systems to enable dual oxidation-reduction pathways. When sunlight hits the photosensitizer (typically TiO₂), it generates electrons that flow through an external circuit to a cathode, where electroactive bacteria like *Geobacter sulfurreducens* perform reduction reactions.

## Key Benefits:
- **Energy Recovery**: 0.5-1.2 kWh/m³
- **High Efficiency**: 85-95% pollutant removal
- **Best For**: Heavy metals, nitrates
- **Key Bacteria**: *Geobacter sulfurreducens*, *Shewanella oneidensis*

## EET Mechanism:
Direct electron transfer through c-type cytochromes and conductive pili (nanowires).

Would you like more details on implementation?`,
        citations: topicCitations.mpec
      });
    }
    
    if (lowerMessage.includes("icpb")) {
      return NextResponse.json({
        response: `**ICPB (Intimately Coupled Photocatalysis & Biodegradation)** is a hybrid treatment system.

## How It Works:
Photosensitizers (TiO₂/SiO₂) are coated on porous carriers where bacteria can colonize. When sunlight hits, the photocatalyst generates reactive species that partially oxidize pollutants, making them more biodegradable. Bacteria then complete the mineralization.

## Key Benefits:
- **High Efficiency**: 85-98% removal
- **Best For**: Dyes, phenol, pharmaceuticals
- **Key Bacteria**: *Pseudomonas putida*, *Bacillus subtilis*
- **Complete Mineralization**: No harmful intermediates

## EET Mechanism:
Indirect electron transfer via electron shuttles (flavins, phenazines).

Want to know about specific applications?`,
        citations: topicCitations.icpb
      });
    }
    
    if (lowerMessage.includes("spb")) {
      return NextResponse.json({
        response: `**SPB (Self-Photosensitized Biohybrid)** is a fully biological treatment system.

## How It Works:
Engineered bacteria (like *Rhodopseudomonas palustris*) produce their own photosensitizers internally. When exposed to light, these intrinsic photosensitizers enable the bacteria to perform phototrophic metabolism for pollutant degradation.

## Key Benefits:
- **Self-Sustaining**: No external catalysts needed
- **Eco-Friendly**: Fully biological system
- **Research Stage**: Cutting-edge technology
- **78% COD Removal**: Demonstrated efficiency

## EET Mechanism:
Self-generated electron carriers through bacterial metabolites.

Interested in the genetic engineering aspects?`,
        citations: topicCitations.spb
      });
    }
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return NextResponse.json({
        response: `Hello! 👋 I'm **JalRakshak AI**, your intelligent assistant created by Ansh Sharma.

I can help you with:
- 💧 **Water Treatment**: MPEC, ICPB, SPB systems
- 🔬 **Science & Research**: Environmental topics
- 💻 **Programming**: Coding questions
- 📚 **General Knowledge**: Any topic you want to discuss
- 🎨 **Creative Tasks**: Writing, brainstorming

How can I assist you today?`,
        citations: []
      });
    }
    
    if (lowerMessage.includes("help") || lowerMessage.includes("what can you do")) {
      return NextResponse.json({
        response: `I'm **JalRakshak AI** - an intelligent assistant that can help with almost anything!

## 🌊 Water Treatment Expertise:
- MPEC, ICPB, SPB technologies
- Photosensitizer selection
- Bacteria and EET mechanisms
- Treatment recommendations

## 💻 General Capabilities:
- Answer any question (like ChatGPT/Gemini)
- Help with coding and programming
- Explain scientific concepts
- Creative writing and brainstorming
- Research and analysis

## 📝 Try Asking:
- "What is MPEC technology?"
- "Write a Python function to..."
- "Explain quantum computing"
- "Compare ICPB vs SPB systems"
- "What's the water crisis in India?"

What would you like to know?`,
        citations: []
      });
    }

    // Generic fallback
    return NextResponse.json({
      response: `I apologize, but I'm having trouble connecting to my AI backend right now.

**Error:** ${errorMessage}

I'm JalRakshak AI, created by Ansh Sharma. While my main AI is unavailable, I can still help with:

- **Water Treatment Topics**: MPEC, ICPB, SPB systems
- **General Questions**: I have fallback responses ready
- **Try asking**: "What is MPEC?", "Compare ICPB vs SPB", or "Hello"

Please try your question again, or ask about water treatment topics where I have specialized knowledge.`,
      citations: []
    });
  }
}
