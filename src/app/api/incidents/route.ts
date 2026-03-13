import { NextRequest, NextResponse } from "next/server";

// Seed incidents data with research citations
const seedIncidents = [
  {
    id: "1",
    title: "Khan River Industrial Contamination Crisis",
    location: "Khan River, Indore, Madhya Pradesh",
    severity: "critical",
    pollutantType: "Industrial Dyes & Heavy Metals",
    status: "active_response",
    description: "Severe water contamination detected with BOD levels 15 times above permissible limits. Textile industry discharge has caused discoloration and heavy metal accumulation.",
    reportedBy: "CPCB Report 2023",
    affected: "150,000+ residents",
    citation: {
      authors: "CPCB Report",
      title: "Water Quality Assessment of Khan River, Indore",
      journal: "Central Pollution Control Board, India",
      year: "2023"
    },
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    title: "Groundwater Arsenic Contamination",
    location: "West Bengal Delta Region",
    severity: "critical",
    pollutantType: "Arsenic & Heavy Metals",
    status: "treatment_ongoing",
    description: "Elevated arsenic levels detected in 23 groundwater wells, exceeding WHO limits by up to 20 times.",
    reportedBy: "WHO Groundwater Report 2023",
    affected: "45,000+ residents",
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    title: "Pharmaceutical Effluent Discharge",
    location: "Hyderabad Pharma Industrial Zone",
    severity: "high",
    pollutantType: "Antibiotics & Pharmaceutical Compounds",
    status: "under_investigation",
    description: "Unauthorized discharge of pharmaceutical effluent detected in Musi River.",
    reportedBy: "Telangana Pollution Control Board",
    affected: "80,000+ residents",
    createdAt: "2024-01-12"
  }
];

// In-memory storage (would be database in production)
let incidents = [...seedIncidents];

// GET - Fetch all incidents
export async function GET() {
  return NextResponse.json(incidents);
}

// POST - Create new incident
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const newIncident = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      location: data.location,
      severity: data.severity || "moderate",
      status: data.status || "reported",
      pollutantType: data.pollutant,
      affected: data.affected || "Unknown",
      reportedBy: data.source || "User Report",
      createdAt: new Date().toISOString(),
    };

    incidents.unshift(newIncident);
    
    return NextResponse.json(newIncident, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create incident" },
      { status: 500 }
    );
  }
}

// DELETE - Remove incident
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Incident ID required" }, { status: 400 });
    }

    incidents = incidents.filter(i => i.id !== id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete incident" }, { status: 500 });
  }
}
