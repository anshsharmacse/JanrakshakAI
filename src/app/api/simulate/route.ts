import { NextRequest, NextResponse } from "next/server";

interface SimulationInput {
  systemType: string;
  pollutantType: string;
  pollutantConcentration: number;
  sunlightIntensity: number;
  photosensitizerDose: number;
  bacteriaConcentration: number;
  residenceTime: number;
  temperature: number;
  ph: number;
}

interface SimulationResult {
  predictedRemoval: number;
  predictedEnergy: number;
  predictedTime: number;
  bottleneckFactors: string[];
  recommendations: string[];
}

// Kinetic parameters for different pollutants (research-based)
const kineticParams: Record<string, { k: number; n: number; activationEnergy: number }> = {
  "Industrial Dyes": { k: 0.15, n: 1.2, activationEnergy: 35 },
  "Heavy Metals": { k: 0.08, n: 0.9, activationEnergy: 42 },
  "Phenol": { k: 0.18, n: 1.0, activationEnergy: 30 },
  "Antibiotics": { k: 0.12, n: 1.1, activationEnergy: 38 },
  "Nitrates": { k: 0.10, n: 0.85, activationEnergy: 40 }
};

// System efficiency factors
const systemFactors: Record<string, { lightEfficiency: number; eetEfficiency: number; baseEnergy: number }> = {
  "MPEC": { lightEfficiency: 0.75, eetEfficiency: 0.85, baseEnergy: 0.8 },
  "ICPB": { lightEfficiency: 0.85, eetEfficiency: 0.70, baseEnergy: 0.3 },
  "SPB": { lightEfficiency: 0.60, eetEfficiency: 0.75, baseEnergy: 0.5 }
};

export async function POST(request: NextRequest) {
  try {
    const input: SimulationInput = await request.json();
    
    const {
      systemType,
      pollutantType,
      pollutantConcentration,
      sunlightIntensity,
      photosensitizerDose,
      bacteriaConcentration,
      residenceTime,
      temperature,
      ph
    } = input;

    // Get parameters
    const kinetic = kineticParams[pollutantType] || { k: 0.12, n: 1.0, activationEnergy: 35 };
    const system = systemFactors[systemType] || { lightEfficiency: 0.75, eetEfficiency: 0.70, baseEnergy: 0.5 };

    // Calculate light intensity factor (normalized to 800 W/m²)
    const lightFactor = Math.min(1, sunlightIntensity / 800) * system.lightEfficiency;

    // Calculate temperature factor (Arrhenius equation simplified)
    const tempFactor = Math.exp(-kinetic.activationEnergy * (1 / (temperature + 273) - 1 / 298) / 8.314);
    const normalizedTempFactor = Math.min(1.5, Math.max(0.5, tempFactor));

    // Calculate photosensitizer dose factor
    const doseFactor = Math.min(1, photosensitizerDose / 2) * 0.9 + 0.1;

    // Calculate bacteria factor
    const bacteriaFactor = Math.min(1, (bacteriaConcentration || 0.5) * 2);

    // Calculate pH factor (optimal around 7)
    const phFactor = 1 - Math.abs(ph - 7) * 0.05;

    // Calculate degradation rate
    const effectiveK = kinetic.k * lightFactor * normalizedTempFactor * doseFactor * bacteriaFactor * phFactor * system.eetEfficiency;

    // Calculate removal (first-order kinetics approximation)
    let removal: number;
    if (kinetic.n >= 1) {
      removal = (1 - Math.exp(-effectiveK * residenceTime)) * 100;
    } else {
      removal = (1 - Math.pow(1 + (kinetic.n - 1) * effectiveK * residenceTime * Math.pow(pollutantConcentration, kinetic.n - 1), 1 / (1 - kinetic.n))) * 100;
    }
    removal = Math.min(99, Math.max(20, removal));

    // Calculate energy
    let energy = 0;
    if (systemType === "MPEC") {
      // MPEC can generate energy
      const lightEnergy = (sunlightIntensity / 1000) * lightFactor * residenceTime;
      const bioelectricity = bacteriaFactor * 0.3;
      energy = system.baseEnergy + lightEnergy * 0.15 + bioelectricity;
    } else if (systemType === "SPB") {
      // SPB moderate energy
      energy = system.baseEnergy * lightFactor * bacteriaFactor;
    } else {
      // ICPB consumes energy for mixing
      energy = -system.baseEnergy * residenceTime / 24;
    }

    // Calculate actual treatment time
    const targetRemoval = 90;
    const predictedTime = residenceTime * (Math.log(1 - targetRemoval / 100) / Math.log(1 - removal / 100));

    // Identify bottlenecks
    const bottleneckFactors: string[] = [];
    
    if (lightFactor < 0.6) {
      bottleneckFactors.push("Insufficient light intensity limiting photosensitizer activation");
    }
    if (normalizedTempFactor < 0.8) {
      bottleneckFactors.push(`Temperature (${temperature}°C) below optimal range (25-35°C)`);
    }
    if (photosensitizerDose < 0.5) {
      bottleneckFactors.push("Low photosensitizer dose may limit electron generation");
    }
    if (bacteriaConcentration < 0.3) {
      bottleneckFactors.push("Bacterial concentration below optimal for efficient EET");
    }
    if (Math.abs(ph - 7) > 1) {
      bottleneckFactors.push(`pH (${ph}) outside optimal range (6.5-7.5)`);
    }
    if (pollutantConcentration > 200) {
      bottleneckFactors.push("High pollutant load may require extended treatment");
    }
    if (system.eetEfficiency < 0.75 && systemType === "MPEC") {
      bottleneckFactors.push("EET pathway efficiency could limit overall performance");
    }

    if (bottleneckFactors.length === 0) {
      bottleneckFactors.push("All parameters within optimal range");
    }

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (lightFactor < 0.8) {
      recommendations.push("Increase sunlight exposure or add UV supplementation");
    }
    if (photosensitizerDose < 1.5) {
      recommendations.push(`Increase photosensitizer dose to 1.5-2.0 g/L for optimal performance`);
    }
    if (temperature < 25 || temperature > 35) {
      recommendations.push("Implement temperature control to maintain 25-35°C range");
    }
    if (bacteriaConcentration < 0.5) {
      recommendations.push("Increase bacterial inoculation for enhanced biodegradation");
    }
    if (Math.abs(ph - 7) > 0.5) {
      recommendations.push("Adjust pH to neutral range (6.5-7.5) for optimal bacterial activity");
    }
    if (residenceTime < 12 && removal < 85) {
      recommendations.push("Extend residence time for higher removal efficiency");
    }
    if (systemType === "MPEC" && energy < 0.5) {
      recommendations.push("Optimize electrode configuration for better energy recovery");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Current configuration is optimal - continue monitoring");
      recommendations.push("Document performance for future reference");
    }

    const result: SimulationResult = {
      predictedRemoval: Math.round(removal * 10) / 10,
      predictedEnergy: Math.round(energy * 100) / 100,
      predictedTime: Math.round(Math.abs(predictedTime) * 10) / 10,
      bottleneckFactors,
      recommendations
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error("Simulation error:", error);
    
    return NextResponse.json({
      predictedRemoval: 75.0,
      predictedEnergy: 0.5,
      predictedTime: 18.0,
      bottleneckFactors: ["Simulation parameters incomplete - using default values"],
      recommendations: ["Review and adjust simulation parameters", "Ensure all required fields are filled"]
    });
  }
}
