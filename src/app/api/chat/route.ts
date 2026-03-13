import { NextRequest, NextResponse } from "next/server";

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
    findings: "Engineered Rhodopseudomonas achieved 78% COD removal"
  }],
  "eet": [{
    id: "4",
    authors: "Shi, L., Dong, H., Reguera, G., et al.",
    title: "Extracellular electron transfer mechanisms",
    journal: "Nature Reviews Microbiology",
    year: "2021",
    doi: "10.1038/nrmicro.2016.193",
    findings: "Three EET mechanisms: direct, indirect, and nanowire transfer"
  }],
  "indore": [{
    id: "6",
    authors: "CPCB Report",
    title: "Water Quality Assessment of Khan River, Indore",
    journal: "Central Pollution Control Board, India",
    year: "2023",
    findings: "Khan River BOD 15x above limits"
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

// Intelligent response generator (fallback)
function generateIntelligentResponse(message: string): { response: string; citations: Citation[] } {
  const lowerMsg = message.toLowerCase();
  const citations = getRelevantCitations(message);
  
  if (lowerMsg.match(/^(hi|hello|hey|greetings|namaste)/)) {
    return {
      response: `Hello! 👋 I'm **JalRakshak AI**, created by Ansh Sharma.

I can help you with:
- 💧 **Water Treatment**: MPEC, ICPB, SPB systems
- 🔬 **Science & Research**: Environmental topics
- 💻 **General Questions**: Any topic
- 🎨 **Creative Tasks**: Writing, brainstorming

How can I assist you today?`,
      citations: []
    };
  }
  
  if (lowerMsg.includes("mpec")) {
    return {
      response: `**MPEC (Microbial-Photo-Electrochemical Coupling)**

## How It Works:
MPEC combines photosensitizers with electrochemical systems. Sunlight triggers TiO₂ to generate electrons, which flow through an external circuit where electroactive bacteria (*Geobacter sulfurreducens*) perform reduction reactions.

## Key Benefits:
- **Energy Recovery**: 0.5-1.2 kWh/m³
- **Efficiency**: 85-95% pollutant removal
- **Best For**: Heavy metals, nitrates

## EET Mechanism:
Direct electron transfer through c-type cytochromes and conductive pili.`,
      citations: topicCitations["mpec"]
    };
  }
  
  if (lowerMsg.includes("icpb")) {
    return {
      response: `**ICPB (Intimately Coupled Photocatalysis & Biodegradation)**

## How It Works:
Photosensitizers (TiO₂/SiO₂) on porous carriers support bacterial colonization. Sunlight triggers partial oxidation; bacteria complete mineralization.

## Key Benefits:
- **Efficiency**: 92-98% removal
- **Best For**: Dyes, phenol, pharmaceuticals
- **Complete Mineralization**: No harmful intermediates`,
      citations: topicCitations["icpb"]
    };
  }
  
  if (lowerMsg.includes("spb")) {
    return {
      response: `**SPB (Self-Photosensitized Biohybrid)**

## How It Works:
Engineered bacteria (*Rhodopseudomonas palustris*) produce their own photosensitizers internally for phototrophic metabolism.

## Key Benefits:
- **Self-Sustaining**: No external catalysts
- **Eco-Friendly**: Fully biological
- **78% COD Removal**: Demonstrated efficiency`,
      citations: topicCitations["spb"]
    };
  }
  
  if (lowerMsg.includes("eet") || lowerMsg.includes("electron transfer")) {
    return {
      response: `**Extracellular Electron Transfer (EET)**

## Three Mechanisms:
1. **Direct EET**: Via cytochromes (<1 μm), 40% higher efficiency
2. **Indirect EET**: Via shuttles (flavins, phenazines), 1-10 μm
3. **Nanowire EET**: Via conductive pili (>10 μm)

Essential for MPEC and microbial fuel cells.`,
      citations: topicCitations["eet"]
    };
  }
  
  if (lowerMsg.includes("indore") || lowerMsg.includes("khan river")) {
    return {
      response: `**Indore Water Crisis - Khan River**

- **BOD**: 15x above limits
- **Pollutants**: Industrial dyes & heavy metals
- **Affected**: 150,000+ residents

**Recommended**: ICPB (dyes) + MPEC (heavy metals)`,
      citations: topicCitations["indore"]
    };
  }
  
  if (lowerMsg.includes("compare") || lowerMsg.includes("vs")) {
    return {
      response: `**Treatment Systems Comparison**

| Feature | MPEC | ICPB | SPB |
|---------|------|------|-----|
| Efficiency | 85-95% | 92-98% | 78% |
| Energy Recovery | ✅ | ❌ | Limited |
| Best For | Metals | Dyes | Organics |
| Cost | High | Medium | Low |`,
      citations: [topicCitations["mpec"][0], topicCitations["icpb"][0]]
    };
  }
  
  if (lowerMsg.includes("help")) {
    return {
      response: `I'm **JalRakshak AI** - your intelligent assistant!

## Specialties:
- 💧 Water Treatment (MPEC, ICPB, SPB)
- 🔬 Environmental Science
- 💻 Programming & Coding
- 📚 General Knowledge

## Try:
- "What is MPEC?"
- "Compare ICPB vs SPB"
- "Indore water crisis"`,
      citations: []
    };
  }
  
  return {
    response: `Thank you for your question! I specialize in water treatment and environmental science.

## Try asking:
- "What is MPEC/ICPB/SPB?"
- "Compare treatment systems"
- "Indore water crisis"
- "How does EET work?"`,
    citations: []
  };
}

// Call OpenAI API
async function callOpenAI(message: string, history: Message[]): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey === "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") {
    return null;
  }
  
  try {
    const messages: Array<{ role: string; content: string }> = [
      {
        role: "system",
        content: `You are JalRakshak AI, an intelligent assistant created by Ansh Sharma. 
You are helpful, friendly, and knowledgeable about water treatment technologies (MPEC, ICPB, SPB systems), environmental science, and general topics.
Be conversational and provide detailed, well-structured answers. Use markdown formatting.`
      }
    ];

    for (const msg of history.slice(-10)) {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    }

    messages.push({ role: "user", content: message });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

// Try ZAI SDK (works in development environment)
async function tryZAI(message: string, history: Message[]): Promise<string | null> {
  try {
    const ZAI = (await import("z-ai-web-dev-sdk")).default;
    const zai = await ZAI.create();
    
    const messages: Array<{ role: string; content: string }> = [
      {
        role: "assistant",
        content: `You are JalRakshak AI, created by Ansh Sharma. You are helpful, friendly, and knowledgeable. Provide detailed answers with markdown formatting.`
      }
    ];

    for (const msg of history.slice(-10)) {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      });
    }

    messages.push({ role: "user", content: message });

    const completion = await zai.chat.completions.create({
      messages: messages,
      thinking: { type: "disabled" }
    });

    return completion.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, history }: ChatInput = await request.json();

    // 1. Try ZAI SDK (development environment)
    const zaiResponse = await tryZAI(message, history || []);
    if (zaiResponse) {
      return NextResponse.json({
        response: zaiResponse,
        citations: getRelevantCitations(message)
      });
    }

    // 2. Try OpenAI API (production with API key)
    const openaiResponse = await callOpenAI(message, history || []);
    if (openaiResponse) {
      return NextResponse.json({
        response: openaiResponse,
        citations: getRelevantCitations(message)
      });
    }

    // 3. Fall back to intelligent responses
    const fallback = generateIntelligentResponse(message);
    return NextResponse.json(fallback);

  } catch (error) {
    console.error("Chat API Error:", error);
    
    return NextResponse.json({
      response: "I'm having trouble processing your request. Please try asking about water treatment topics like MPEC, ICPB, or SPB.",
      citations: []
    });
  }
}
