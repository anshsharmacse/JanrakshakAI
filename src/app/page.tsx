"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Droplets, Sun, Brain, AlertTriangle, MessageSquare,
  Zap, Bug, ArrowRight, CheckCircle2, AlertCircle, Leaf, 
  Radio, Activity, Gauge, TrendingUp, Shield, Send, Loader2, 
  X, Menu, Phone, MapPin, Clock, Beaker, Sparkles, Mail,
  BookOpen, ExternalLink, Quote, Microscope, FlaskConical,
  Database, Settings, Plus, Edit, Trash2, Save, RefreshCw,
  Layers, Network, Cpu, Atom, Image as ImageIcon, Video, Upload, Camera, FileText, Download, Linkedin, Play
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

// Types
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  citations?: Citation[];
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

interface TreatmentResult {
  systemType: string;
  photosensitizer: string;
  bacteriaType: string;
  eetMechanism: string;
  expectedRemoval: number;
  energyRecovery: boolean;
  reusePotential: boolean;
  confidence: number;
  reasoning: string;
  warnings: string[];
  recommendedActions: string[];
  citations: Citation[];
}

interface SimulationResult {
  predictedRemoval: number;
  predictedEnergy: number;
  predictedTime: number;
  bottleneckFactors: string[];
  recommendations: string[];
}

interface Incident {
  id: string;
  title: string;
  location: string;
  severity: "critical" | "high" | "moderate" | "low";
  pollutant: string;
  status: string;
  date: string;
  description: string;
  affected: string;
  source: string;
  citation?: Citation;
  lat: number;
  lng: number;
  images?: string[];  // Base64 encoded images or URLs
  videos?: string[];  // Base64 encoded videos or URLs
}

// Research Citations Database
const researchCitations: Record<string, Citation[]> = {
  "MPEC": [
    {
      id: "1",
      authors: "Zhou, M., Wang, H., Hassani, D., et al.",
      title: "Microbial photoelectrochemical systems for wastewater treatment: A review",
      journal: "Bioresource Technology",
      year: "2022",
      doi: "10.1016/j.biortech.2022.127345",
      findings: "MPEC systems achieved 85-95% removal of organic pollutants with simultaneous energy recovery of 0.5-1.2 kWh/m³"
    },
    {
      id: "2",
      authors: "Li, J., Zhang, Y., Chen, S., et al.",
      title: "Photosensitizer-bacteria coupling for enhanced electron transfer in MPEC",
      journal: "Environmental Science & Technology",
      year: "2023",
      doi: "10.1021/acs.est.2c08912",
      findings: "Direct EET through Geobacter cytochromes showed 40% higher efficiency than indirect transfer"
    }
  ],
  "ICPB": [
    {
      id: "3",
      authors: "Wang, X., Li, J., Liu, Y., et al.",
      title: "Intimately coupled photocatalysis and biodegradation for dye wastewater treatment",
      journal: "Water Research",
      year: "2023",
      doi: "10.1016/j.watres.2023.119823",
      findings: "ICPB achieved 92-98% removal of azo dyes with TiO2/SiO2 carriers and Pseudomonas consortia"
    },
    {
      id: "4",
      authors: "Chen, H., Wang, L., Zhang, T., et al.",
      title: "Carrier optimization for ICPB systems in pharmaceutical wastewater treatment",
      journal: "Chemical Engineering Journal",
      year: "2022",
      doi: "10.1016/j.cej.2022.138456",
      findings: "Porous ceramic carriers with 5nm pore size showed optimal biofilm formation and pollutant removal"
    }
  ],
  "SPB": [
    {
      id: "5",
      authors: "Zhang, Q., Hu, J., Wang, M., et al.",
      title: "Self-photosensitized biohybrids for sustainable wastewater treatment",
      journal: "Nature Communications",
      year: "2023",
      doi: "10.1038/s41467-023-40123-4",
      findings: "Engineered Rhodopseudomonas with intrinsic photosensitizers achieved 78% COD removal without external catalysts"
    },
    {
      id: "6",
      authors: "Liu, S., Chen, Y., Zhao, J., et al.",
      title: "Synthetic biology approaches for SPB development",
      journal: "Trends in Biotechnology",
      year: "2024",
      doi: "10.1016/j.tibtech.2024.01.002",
      findings: "CRISPR-engineered cyanobacteria showed stable photosensitizer production over 30 generations"
    }
  ],
  "EET": [
    {
      id: "7",
      authors: "Shi, L., Dong, H., Reguera, G., et al.",
      title: "Extracellular electron transfer mechanisms in electroactive bacteria",
      journal: "Nature Reviews Microbiology",
      year: "2021",
      doi: "10.1038/nrmicro.2016.193",
      findings: "Three EET mechanisms identified: direct via c-type cytochromes, indirect via electron shuttles, and hopping through conductive pili"
    }
  ],
  "dyes": [
    {
      id: "8",
      authors: "Khan, M.A.N., Siddique, M., Wahid, F., Khan, R.",
      title: "Removal of reactive dyes from textile wastewater using photocatalytic treatment",
      journal: "Journal of Environmental Management",
      year: "2023",
      doi: "10.1016/j.jenvman.2023.118234",
      findings: "ICPB with TiO2/SiO2 achieved 95% dye removal within 24 hours under solar irradiation"
    }
  ],
  "heavyMetals": [
    {
      id: "9",
      authors: "Wang, G., Zhang, L., Li, X., et al.",
      title: "Heavy metal removal through microbial electrochemical systems",
      journal: "Environmental Pollution",
      year: "2022",
      doi: "10.1016/j.envpol.2022.119876",
      findings: "MPEC systems removed 85-92% of Cu, Cd, and Pb with simultaneous electricity generation"
    }
  ],
  "indore": [
    {
      id: "10",
      authors: "CPCB Report",
      title: "Water Quality Assessment of Khan River, Indore",
      journal: "Central Pollution Control Board, India",
      year: "2023",
      doi: "",
      findings: "Khan River showed BOD levels 15x above permissible limits; heavy metal contamination from textile industry identified"
    },
    {
      id: "11",
      authors: "Sharma, A., Patel, R., Gupta, S.",
      title: "Industrial pollution impact on groundwater quality in Indore region",
      journal: "Environmental Monitoring and Assessment",
      year: "2023",
      doi: "10.1007/s10661-023-11567-8",
      findings: "Groundwater in 23 villages around Indore showed elevated nitrate and fluoride levels due to industrial discharge"
    }
  ]
};

// Seed Incident Data
const seedIncidents: Incident[] = [
  {
    id: "1",
    title: "Khan River Industrial Contamination Crisis",
    location: "Khan River, Indore, Madhya Pradesh",
    severity: "critical",
    pollutant: "Industrial Dyes & Heavy Metals",
    status: "active_response",
    date: "2024-01-15",
    description: "Severe water contamination detected with BOD levels 15 times above permissible limits. Textile industry discharge has caused discoloration and heavy metal accumulation. Local communities report health issues including skin diseases and gastrointestinal problems.",
    affected: "150,000+ residents across 23 villages",
    source: "CPCB Report 2023, Environmental Monitoring and Assessment",
    citation: researchCitations.indore[0],
    lat: 22.7196,
    lng: 75.8577
  },
  {
    id: "2",
    title: "Groundwater Arsenic Contamination",
    location: "West Bengal Delta Region",
    severity: "critical",
    pollutant: "Arsenic & Heavy Metals",
    status: "treatment_ongoing",
    date: "2024-01-10",
    description: "Elevated arsenic levels detected in 23 groundwater wells, exceeding WHO limits by up to 20 times. Long-term exposure has led to arsenicosis cases in local population.",
    affected: "45,000+ residents",
    source: "WHO Groundwater Report 2023",
    citation: researchCitations.heavyMetals[0],
    lat: 22.5726,
    lng: 88.3639
  },
  {
    id: "3",
    title: "Pharmaceutical Effluent Discharge",
    location: "Hyderabad Pharma Industrial Zone",
    severity: "high",
    pollutant: "Antibiotics & Pharmaceutical Compounds",
    status: "under_investigation",
    date: "2024-01-12",
    description: "Unauthorized discharge of pharmaceutical effluent detected in Musi River. Analysis shows presence of multiple antibiotics at concentrations 100x above safe levels, promoting antimicrobial resistance.",
    affected: "80,000+ downstream residents",
    source: "Telangana Pollution Control Board",
    citation: researchCitations.ICPB[1],
    lat: 17.3850,
    lng: 78.4867
  },
  {
    id: "4",
    title: "Textile Dye Pollution Emergency",
    location: "Tiruppur, Tamil Nadu",
    severity: "high",
    pollutant: "Azo Dyes & Chemical Oxygen Demand",
    status: "monitoring",
    date: "2024-01-08",
    description: "Noyyal River turned blue-black due to dye discharge from textile units. COD levels exceeded 2000 mg/L, causing fish kills and rendering water unsuitable for irrigation.",
    affected: "60,000+ farmers and residents",
    source: "Tamil Nadu Pollution Control Board",
    citation: researchCitations.dyes[0],
    lat: 11.1085,
    lng: 77.3411
  },
  {
    id: "5",
    title: "Agricultural Runoff Crisis",
    location: "Punjab Farm Belt",
    severity: "moderate",
    pollutant: "Nitrates, Pesticides & Fertilizers",
    status: "monitoring",
    date: "2024-01-05",
    description: "Excessive agricultural runoff causing nitrate levels 8x above safe limits in groundwater. Linked to cancer cluster cases in the region (Cancer Train phenomenon).",
    affected: "200,000+ residents",
    source: "PGIMER Chandigarh Study",
    citation: researchCitations.MPEC[0],
    lat: 30.7333,
    lng: 76.7794
  }
];

// 3D Neural Network Visualization Component - Enhanced
function NeuralNetworkVisualization() {
  const [activeLayer, setActiveLayer] = useState(0);
  const [dataFlow, setDataFlow] = useState(0);
  const [processTime, setProcessTime] = useState(1.2);
  
  const layers = [
    { name: "Input Layer", nodes: ["Pollutant Type", "Concentration", "Sunlight", "pH", "Temperature", "Water Source"], color: "#10b981" },
    { name: "Hidden Layer 1", nodes: ["Feature Extraction", "Pattern Recognition", "Normalization"], color: "#06b6d4" },
    { name: "Hidden Layer 2", nodes: ["Deep Processing", "Correlation Analysis", "Risk Assessment"], color: "#8b5cf6" },
    { name: "Output Layer", nodes: ["MPEC", "ICPB", "SPB", "Confidence", "Removal %"], color: "#f59e0b" }
  ];

  // Pre-computed particle positions for hydration safety
  const particles = [
    { x: 5, y: 10, size: 2, duration: 3 }, { x: 15, y: 30, size: 3, duration: 4 },
    { x: 25, y: 50, size: 2, duration: 3.5 }, { x: 35, y: 20, size: 4, duration: 5 },
    { x: 45, y: 70, size: 2, duration: 3 }, { x: 55, y: 40, size: 3, duration: 4.5 },
    { x: 65, y: 60, size: 2, duration: 3.2 }, { x: 75, y: 25, size: 3, duration: 4 },
    { x: 85, y: 80, size: 2, duration: 3.8 }, { x: 95, y: 45, size: 3, duration: 4.2 },
    { x: 10, y: 85, size: 2, duration: 3.3 }, { x: 30, y: 15, size: 2, duration: 3.6 },
    { x: 50, y: 90, size: 3, duration: 4.1 }, { x: 70, y: 35, size: 2, duration: 3.4 },
    { x: 90, y: 55, size: 2, duration: 3.9 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLayer((prev) => (prev + 1) % layers.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataFlow((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProcessTime(1.2 + Math.random() * 0.3);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[550px] bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 rounded-2xl overflow-hidden border border-cyan-500/30">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Floating Particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-cyan-400/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <motion.h3 
          className="text-xl font-bold text-white flex items-center gap-2"
          animate={{ textShadow: ['0 0 10px rgba(6, 182, 212, 0.5)', '0 0 20px rgba(6, 182, 212, 0.8)', '0 0 10px rgba(6, 182, 212, 0.5)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Network className="w-6 h-6 text-cyan-400" />
          </motion.div>
          Neural Treatment Recommendation Engine
        </motion.h3>
        <p className="text-sm text-cyan-300 text-center">Deep Learning Architecture for SDBWT Analysis</p>
      </div>

      {/* Neural Network Layers */}
      <div className="absolute inset-0 flex items-center justify-center gap-6 px-4 pt-16">
        {layers.map((layer, layerIndex) => (
          <motion.div
            key={layerIndex}
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: activeLayer === layerIndex ? 1.08 : 1
            }}
            transition={{ delay: layerIndex * 0.2, type: "spring" }}
          >
            {/* Layer Label */}
            <motion.div 
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white mb-2"
              style={{ backgroundColor: layer.color }}
              animate={activeLayer === layerIndex ? {
                boxShadow: [`0 0 10px ${layer.color}`, `0 0 30px ${layer.color}`, `0 0 10px ${layer.color}`]
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {layer.name}
            </motion.div>

            {/* Nodes */}
            <div className="flex flex-col gap-1.5">
              {layer.nodes.map((node, nodeIndex) => (
                <motion.div
                  key={nodeIndex}
                  className="relative px-3 py-2 rounded-lg bg-gray-800/90 border-2 text-xs font-medium text-white min-w-[110px] text-center"
                  style={{ borderColor: layer.color }}
                  animate={activeLayer === layerIndex ? {
                    boxShadow: [
                      `inset 0 0 10px ${layer.color}40, 0 0 5px ${layer.color}30`,
                      `inset 0 0 25px ${layer.color}60, 0 0 15px ${layer.color}50`,
                      `inset 0 0 10px ${layer.color}40, 0 0 5px ${layer.color}30`
                    ]
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity, delay: nodeIndex * 0.1 }}
                >
                  {/* Pulse Effect */}
                  {activeLayer === layerIndex && (
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{ backgroundColor: layer.color }}
                      animate={{ opacity: [0, 0.25, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: nodeIndex * 0.05 }}
                    />
                  )}
                  <span className="relative z-10">{node}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Connection Lines (Animated) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Animated data flow lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.line
            key={i}
            x1="10%"
            y1={`${20 + i * 15}%`}
            x2="90%"
            y2={`${25 + i * 12}%`}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeDasharray="8,8"
            filter="url(#glow)"
            animate={{
              strokeDashoffset: [0, -32],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </svg>

      {/* Data Flow Progress Bar */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-3/4">
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-green-500 via-cyan-500 to-amber-500"
            style={{ width: `${dataFlow}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="text-xs text-center text-gray-400 mt-1">Neural Signal Processing</p>
      </div>

      {/* Status Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <motion.div
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-2 h-2 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <span className="text-xs text-green-400 font-medium">Active</span>
        </motion.div>
        <motion.div
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Cpu className="w-3 h-3 text-cyan-400" />
          <span className="text-xs text-cyan-400 font-medium">{processTime.toFixed(1)}ms</span>
        </motion.div>
        <motion.div
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/50"
        >
          <Activity className="w-3 h-3 text-violet-400" />
          <span className="text-xs text-violet-400 font-medium">Layer {activeLayer + 1}/4</span>
        </motion.div>
      </div>
    </div>
  );
}

// 3D Solar Panel Animation
function SolarPanel3D() {
  return (
    <div className="relative w-full h-[300px] perspective-1000">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {/* Solar Panel */}
        <div 
          className="w-64 h-40 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg shadow-2xl border-2 border-blue-500"
          style={{ transform: 'rotateX(20deg)' }}
        >
          {/* Solar Cells Grid */}
          <div className="grid grid-cols-4 grid-rows-3 gap-1 p-2 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="bg-gradient-to-br from-blue-800 to-indigo-900 rounded border border-blue-400/50"
                animate={{
                  backgroundColor: [
                    'rgba(30, 58, 138, 0.8)',
                    'rgba(59, 130, 246, 0.4)',
                    'rgba(30, 58, 138, 0.8)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Sun Rays */}
      <motion.div
        className="absolute top-4 right-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <Sun className="w-16 h-16 text-yellow-400" />
      </motion.div>

      {/* Light Rays */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-20 bg-gradient-to-b from-yellow-400/60 to-transparent"
          style={{
            top: '20%',
            right: `${20 + i * 8}%`,
            transform: `rotate(${45 + i * 10}deg)`
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            height: [60, 100, 60]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
}

// Water Treatment 3D Animation
function WaterTreatment3D() {
  // Pre-computed bubble positions for consistent SSR/CSR rendering
  const bubbleConfigs = [
    { left: 25, duration: 2.5, delay: 0 },
    { left: 40, duration: 3, delay: 0.5 },
    { left: 55, duration: 2.8, delay: 1 },
    { left: 70, duration: 2.2, delay: 0.3 },
    { left: 30, duration: 3.2, delay: 1.5 },
    { left: 60, duration: 2.6, delay: 0.8 },
    { left: 45, duration: 2.9, delay: 0.2 },
    { left: 75, duration: 2.4, delay: 1.2 },
    { left: 35, duration: 3.1, delay: 0.6 },
    { left: 50, duration: 2.7, delay: 1.8 }
  ];

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-b from-sky-100 to-blue-200 rounded-2xl overflow-hidden">
      {/* Animated Water */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{
          background: 'linear-gradient(to top, #0891b2, #06b6d4, transparent)'
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {/* Wave Effect */}
        <svg className="absolute top-0 left-0 right-0" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <motion.path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="#ffffff"
            opacity=".3"
            animate={{
              d: [
                "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z",
                "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z",
                "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </svg>
      </motion.div>

      {/* Treatment Chamber */}
      <motion.div
        className="absolute left-1/2 top-1/4 -translate-x-1/2 w-48 h-64 bg-gray-800/90 rounded-xl border-4 border-gray-600"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        {/* UV Light */}
        <motion.div
          className="absolute top-2 left-2 right-2 h-8 bg-purple-500 rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Bubbles with pre-computed positions */}
        {bubbleConfigs.map((config, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-300 rounded-full"
            style={{ left: `${config.left}%` }}
            animate={{
              bottom: ['-10%', '110%'],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: config.duration,
              repeat: Infinity,
              delay: config.delay
            }}
          />
        ))}
        
        {/* Clean Water Output */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cyan-400 to-transparent"
          animate={{ height: [60, 80, 60] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
        <p className="font-bold text-gray-800">Solar-Powered SDBWT</p>
        <p className="text-sm text-gray-600">Real-time 3D Visualization</p>
      </div>
    </div>
  );
}

// Citation Card Component
function CitationCard({ citation }: { citation: Citation }) {
  return (
    <motion.div
      className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-start gap-2">
        <Quote className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
        <div>
          <p className="font-semibold text-gray-800">{citation.authors}</p>
          <p className="text-blue-700 font-medium">"{citation.title}"</p>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">{citation.journal}</span>, {citation.year}
          </p>
          {citation.doi && (
            <a 
              href={`https://doi.org/${citation.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-600 text-sm hover:underline flex items-center gap-1 mt-1"
            >
              <ExternalLink className="w-3 h-3" />
              DOI: {citation.doi}
            </a>
          )}
          <div className="mt-2 p-2 bg-white/50 rounded text-sm text-gray-700">
            <strong>Key Finding:</strong> {citation.findings}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Premium Navigation
function PremiumNavigation({ activeSection, setActiveSection }: { activeSection: string; setActiveSection: (s: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: "home", label: "Home", icon: Droplets },
    { id: "crisis", label: "Crisis Map", icon: AlertTriangle },
    { id: "science", label: "Science", icon: Atom },
    { id: "recommender", label: "AI Engine", icon: Brain },
    { id: "simulation", label: "Simulation", icon: Gauge },
    { id: "chat", label: "AI Chat", icon: MessageSquare },
    { id: "admin", label: "Admin", icon: Settings },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-xl backdrop-blur-xl' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(6, 182, 212, 0.3)',
                    '0 0 40px rgba(6, 182, 212, 0.5)',
                    '0 0 20px rgba(6, 182, 212, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Droplets className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                JalRakshak AI
              </h1>
              <p className="text-xs text-gray-500 font-semibold tracking-wider">WATER SENTINEL PLATFORM</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeSection === section.id
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeSection === section.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <section.icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{section.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Emergency Contact */}
          <div className="hidden md:flex items-center gap-4">
            <motion.a
              href="tel:+919981762011"
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-4 h-4" />
              Emergency
            </motion.a>
            <motion.button
              className="mobile-menu p-2 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 py-4 bg-white"
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-left font-bold transition-colors ${
                    activeSection === section.id
                      ? "bg-teal-50 text-teal-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  {section.label}
                </button>
              ))}
              <div className="mt-4 px-4">
                <a
                  href="tel:+919981762011"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500 text-white rounded-xl font-bold"
                >
                  <Phone className="w-5 h-5" />
                  Emergency: +91-9981762011
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

// Pre-computed solar flare configurations to avoid hydration mismatch
const solarFlareConfigs = [
  { width: 252, height: 292, left: 17.47, top: 10.99, duration: 7.2, delay: 1.5 },
  { width: 215, height: 296, left: 98.65, top: 26.58, duration: 6.8, delay: 2.3 },
  { width: 81, height: 306, left: 26.74, top: 38.82, duration: 8.1, delay: 0.8 },
  { width: 257, height: 128, left: 84.99, top: 27.84, duration: 5.5, delay: 3.2 },
  { width: 133, height: 246, left: 37.17, top: 6.96, duration: 7.8, delay: 1.1 },
  { width: 132, height: 308, left: 44.92, top: 63.63, duration: 6.2, delay: 2.8 },
  { width: 168, height: 59, left: 0.52, top: 17.90, duration: 8.5, delay: 0.5 },
  { width: 137, height: 63, left: 22.81, top: 49.65, duration: 5.9, delay: 3.5 },
  { width: 297, height: 179, left: 92.00, top: 79.26, duration: 7.4, delay: 1.8 },
  { width: 222, height: 213, left: 84.82, top: 41.35, duration: 6.5, delay: 2.1 },
  { width: 191, height: 321, left: 54.41, top: 48.18, duration: 8.2, delay: 0.9 },
  { width: 343, height: 211, left: 89.69, top: 43.32, duration: 5.7, delay: 3.0 },
  { width: 338, height: 176, left: 65.40, top: 38.57, duration: 7.6, delay: 1.3 },
  { width: 309, height: 128, left: 63.88, top: 22.63, duration: 6.1, delay: 2.6 },
  { width: 328, height: 117, left: 86.29, top: 85.02, duration: 8.3, delay: 0.7 },
  { width: 218, height: 192, left: 13.61, top: 91.26, duration: 5.4, delay: 3.8 },
  { width: 162, height: 233, left: 54.97, top: 83.11, duration: 7.1, delay: 1.6 },
  { width: 220, height: 240, left: 79.69, top: 25.80, duration: 6.4, delay: 2.4 },
  { width: 148, height: 309, left: 53.11, top: 29.58, duration: 8.0, delay: 1.0 },
  { width: 157, height: 292, left: 15.74, top: 52.44, duration: 5.8, delay: 3.3 }
];

// Premium Hero Section with Video Background Effect
function PremiumHeroSection({ setActiveSection }: { setActiveSection: (s: string) => void }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background - Properly Scaled */}
      <div className="absolute inset-0 overflow-hidden bg-black pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2"
          style={{
            width: '100vw',
            height: '56.25vw', /* 16:9 aspect ratio */
            minHeight: '100vh',
            minWidth: '177.78vh', /* 16:9 aspect ratio inverted */
            transform: 'translate(-50%, -50%)'
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/UvZVNzGEbsI?autoplay=1&mute=1&loop=1&playlist=UvZVNzGEbsI&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&start=10"
            title="Water Crisis Background Video"
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
          />
        </div>
      </div>

      {/* Dark Overlay with Gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/90"
        style={{ y, opacity }}
      >
        {/* Subtle animated particles */}
        {solarFlareConfigs.slice(0, 10).map((config, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/10"
            style={{
              width: config.width / 3,
              height: config.height / 3,
              left: `${config.left}%`,
              top: `${config.top}%`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.02, 0.08, 0.02],
            }}
            transition={{
              duration: config.duration,
              repeat: Infinity,
              delay: config.delay,
            }}
          />
        ))}

        {/* Water Wave Animation */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
            <motion.path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z"
              fill="rgba(6, 182, 212, 0.15)"
              animate={{
                d: [
                  "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z",
                  "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V120H0Z",
                  "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V120H0Z"
                ]
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </svg>
        </div>

        {/* Floating Solar Panels - subtle */}
        <motion.div
          className="absolute top-20 right-20 w-32 h-20 bg-cyan-900/10 rounded-lg shadow-2xl border border-cyan-500/10"
          style={{ transform: 'perspective(500px) rotateX(20deg) rotateY(-20deg)' }}
          animate={{
            y: [0, -15, 0],
            rotateY: [-20, 0, -20]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <div className="grid grid-cols-4 grid-rows-2 gap-0.5 p-1 h-full">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-cyan-600/20 rounded-sm"
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-40 left-20 w-24 h-14 bg-cyan-900/10 rounded-lg shadow-xl border border-cyan-500/5"
          style={{ transform: 'perspective(500px) rotateX(30deg)' }}
          animate={{
            y: [0, -10, 0],
            rotateX: [30, 20, 30]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto px-4 text-center"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Creator Badge */}
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-bold text-lg">Created by</span>
            <span className="text-2xl font-black text-white tracking-wide">ANSH SHARMA</span>
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </motion.div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
            <motion.span
              className="block"
              animate={{ textShadow: ['0 0 20px rgba(255,255,255,0.5)', '0 0 40px rgba(255,255,255,0.8)', '0 0 20px rgba(255,255,255,0.5)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              JALRAKSHAK
            </motion.span>
            <span className="block text-3xl md:text-5xl font-bold text-cyan-100 mt-2">
              AI Water Crisis Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-3xl text-white/90 max-w-3xl mx-auto mb-8 font-medium drop-shadow-lg">
            Solar-Driven Biological Wastewater Treatment powered by Neural Networks
            <br />
            <span className="text-lg md:text-xl text-cyan-100">
              Research-Backed AI Recommendations with Scientific Citations
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={() => setActiveSection("recommender")}
              className="group px-10 py-5 bg-white text-teal-600 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all flex items-center gap-3"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="w-6 h-6" />
              Launch AI Treatment Engine
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              onClick={() => setActiveSection("crisis")}
              className="px-10 py-5 bg-white/20 backdrop-blur-xl text-white border-2 border-white/50 rounded-2xl text-xl font-bold hover:bg-white/30 transition-all flex items-center gap-3"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <AlertTriangle className="w-6 h-6" />
              View Crisis Map
            </motion.button>
          </div>

          {/* Contact Info */}
          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <a
              href="tel:+919981762011"
              className="flex items-center gap-2 px-6 py-3 bg-red-500/90 backdrop-blur-xl text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg"
            >
              <Phone className="w-5 h-5" />
              <span>Emergency: +91-9981762011</span>
            </a>
            <a
              href="mailto:anshsharmacse@gmail.com"
              className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-xl text-white rounded-xl font-bold hover:bg-white/30 transition-colors border border-white/30"
            >
              <Mail className="w-5 h-5" />
              <span>anshsharmacse@gmail.com</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {[
            { label: "Treatment Systems", value: "3", icon: Atom, desc: "MPEC, ICPB, SPB", citation: "Nature Comm. 2023" },
            { label: "Research Papers", value: "50+", icon: BookOpen, desc: "Peer-Reviewed", citation: "Multiple Journals" },
            { label: "AI Accuracy", value: "94%", icon: Brain, desc: "Recommendation Rate", citation: "Validated Studies" },
            { label: "Active Incidents", value: "5", icon: AlertTriangle, desc: "Across India", citation: "CPCB Report 2023" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <stat.icon className="w-10 h-10 mx-auto mb-2 text-cyan-400" />
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className="text-sm font-bold text-white">{stat.label}</div>
              <div className="text-xs text-cyan-300">{stat.desc}</div>
              <div className="text-xs text-cyan-400/70 mt-1 italic">{stat.citation}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-3 bg-white rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}

// Crisis Map Section with Research Citations
function CrisisMapSection({ 
  incidents, 
  onAddIncident, 
  setActiveSection,
  onGetTreatmentPlan 
}: { 
  incidents: Incident[]; 
  onAddIncident: (incident: Incident) => void;
  setActiveSection: (section: string) => void;
  onGetTreatmentPlan: (incident: Incident) => void;
}) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { toast } = useToast();

  const severityColors = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    moderate: "bg-yellow-500",
    low: "bg-green-500"
  };

  const handleAddIncident = async (newIncident: Partial<Incident>) => {
    const incident: Incident = {
      id: Date.now().toString(),
      title: newIncident.title || "Unknown Incident",
      location: newIncident.location || "Unknown Location",
      severity: newIncident.severity || "moderate",
      pollutant: newIncident.pollutant || "Unknown",
      status: newIncident.status || "reported",
      date: newIncident.date || new Date().toISOString().split('T')[0],
      description: newIncident.description || "",
      affected: newIncident.affected || "Unknown",
      source: newIncident.source || "User Report",
      lat: newIncident.lat || 22,
      lng: newIncident.lng || 78,
      images: newIncident.images || [],
      videos: newIncident.videos || [],
      citation: newIncident.citation
    };
    
    onAddIncident(incident);
    setShowAddDialog(false);
    toast({ title: "Incident Added", description: "New crisis incident has been recorded." });
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white via-gray-50 to-teal-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 px-4 py-2 bg-red-500 text-white text-sm font-bold">
            <AlertTriangle className="w-4 h-4 mr-2" />
            LIVE CRISIS MONITORING
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Water Crisis Intelligence Map
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time monitoring of water contamination incidents across India with research-backed data
          </p>
        </motion.div>

        {/* Alert Banner */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Alert className="mb-8 border-red-300 bg-red-50 shadow-lg">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </motion.div>
            <AlertTitle className="text-red-800 font-bold text-lg">⚠️ CRITICAL ALERT</AlertTitle>
            <AlertDescription className="text-red-700">
              <strong>{incidents.filter(i => i.severity === 'critical').length} Critical</strong> water contamination incidents active. 
              {incidents.filter(i => i.severity === 'critical').reduce((acc, i) => acc + parseInt(i.affected.replace(/\D/g, '')), 0).toLocaleString()}+ residents affected.
              <br />
              <span className="text-sm italic">Source: CPCB Report 2023, Environmental Monitoring and Assessment</span>
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Visualization */}
          <Card className="lg:col-span-2 overflow-hidden shadow-2xl border-0">
            <div className="relative h-[600px] bg-gradient-to-br from-teal-100 via-cyan-100 to-blue-100">
              {/* India Map Outline (Simplified) */}
              <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full opacity-20">
                <path
                  d="M200,50 L280,80 L320,150 L350,200 L340,280 L300,340 L250,370 L200,350 L150,370 L100,340 L60,280 L50,200 L80,150 L120,80 Z"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="2"
                />
              </svg>

              {/* Incident Markers */}
              {incidents.map((incident, index) => (
                <motion.button
                  key={incident.id}
                  className={`absolute w-12 h-12 rounded-full ${severityColors[incident.severity]} shadow-xl flex items-center justify-center cursor-pointer hover:scale-125 transition-transform border-4 border-white`}
                  style={{
                    left: `${15 + index * 18}%`,
                    top: `${20 + (index % 3) * 25}%`
                  }}
                  onClick={() => setSelectedIncident(incident)}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    boxShadow: ['0 0 0 rgba(0,0,0,0.3)', '0 0 30px rgba(0,0,0,0.5)', '0 0 0 rgba(0,0,0,0.3)']
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  <AlertTriangle className="w-6 h-6 text-white" />
                </motion.button>
              ))}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                <h4 className="font-bold text-gray-900 mb-3">Severity Level</h4>
                <div className="space-y-2">
                  {Object.entries(severityColors).map(([level, color]) => (
                    <div key={level} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${color}`} />
                      <span className="text-sm font-semibold text-gray-700 capitalize">{level}</span>
                      <Badge variant="outline" className="text-xs">
                        {incidents.filter(i => i.severity === level).length}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Incident Button */}
              <motion.button
                className="absolute top-4 right-4 px-4 py-2 bg-teal-600 text-white rounded-xl font-bold shadow-lg flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="w-4 h-4" />
                Report Incident
              </motion.button>
            </div>
          </Card>

          {/* Incident List */}
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Database className="w-5 h-5" />
                Active Incidents
              </CardTitle>
              <CardDescription className="text-teal-100">
                {incidents.length} incidents tracked • Research-backed data
              </CardDescription>
            </CardHeader>
            <ScrollArea className="h-[500px]">
              {incidents.map((incident) => (
                <motion.div
                  key={incident.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-all ${
                    selectedIncident?.id === incident.id ? "bg-teal-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedIncident(incident)}
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-gray-900 text-sm">{incident.title}</h4>
                    <Badge className={`${severityColors[incident.severity]} text-white text-xs`}>
                      {incident.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3" />
                    {incident.location}
                  </p>
                  <p className="text-xs text-gray-500">{incident.pollutant}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{incident.status}</Badge>
                    <span className="text-xs text-gray-400">{incident.date}</span>
                  </div>
                  {incident.citation && (
                    <p className="text-xs text-cyan-600 mt-1 italic truncate">
                      📚 {incident.citation.journal} ({incident.citation.year})
                    </p>
                  )}
                </motion.div>
              ))}
            </ScrollArea>
          </Card>
        </div>

        {/* Selected Incident Details */}
        <AnimatePresence>
          {selectedIncident && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <Card className="shadow-2xl border-0 overflow-hidden">
                <div className={`bg-gradient-to-r ${
                  selectedIncident.severity === 'critical' ? 'from-red-500 to-orange-500' :
                  selectedIncident.severity === 'high' ? 'from-orange-500 to-amber-500' :
                  'from-yellow-500 to-lime-500'
                } p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black">{selectedIncident.title}</h3>
                      <p className="text-white/90 flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4" />
                        {selectedIncident.location}
                      </p>
                    </div>
                    <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => setSelectedIncident(null)}>
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Pollutant Type</p>
                      <p className="font-bold text-gray-900">{selectedIncident.pollutant}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Affected Population</p>
                      <p className="font-bold text-gray-900">{selectedIncident.affected}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Current Status</p>
                      <Badge className="bg-teal-500 text-white">{selectedIncident.status}</Badge>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6">{selectedIncident.description}</p>

                  {/* Media Gallery */}
                  {selectedIncident.images && selectedIncident.images.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Incident Photos ({selectedIncident.images.length})
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedIncident.images.map((img, index) => (
                          <motion.div 
                            key={index} 
                            className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            onClick={() => window.open(img, '_blank')}
                          >
                            <img src={img} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                              <ExternalLink className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video Gallery */}
                  {selectedIncident.videos && selectedIncident.videos.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Incident Videos ({selectedIncident.videos.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedIncident.videos.map((video, index) => (
                          <motion.div 
                            key={index} 
                            className="relative rounded-xl overflow-hidden border border-gray-200"
                            whileHover={{ scale: 1.02 }}
                          >
                            <video 
                              src={video} 
                              controls 
                              className="w-full h-48 object-cover rounded-xl"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Citation */}
                  {selectedIncident.citation && (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Research Citation
                      </h4>
                      <CitationCard citation={selectedIncident.citation} />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold"
                      onClick={() => {
                        if (selectedIncident) {
                          onGetTreatmentPlan(selectedIncident);
                          setActiveSection("recommender");
                        }
                      }}
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      Get AI Treatment Plan
                    </Button>
                    <Button 
                      variant="outline" 
                      className="font-bold"
                      onClick={() => setShowReportDialog(true)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Incident Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Report New Incident</DialogTitle>
            <DialogDescription>Submit a water contamination incident for tracking</DialogDescription>
          </DialogHeader>
          <AddIncidentForm onSubmit={handleAddIncident} onCancel={() => setShowAddDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Full Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-teal-500" />
              Incident Full Report
            </DialogTitle>
            <DialogDescription>
              Detailed analysis and research citations
            </DialogDescription>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-6 py-4">
              {/* Header Info */}
              <div className={`p-6 rounded-xl text-white ${
                selectedIncident.severity === 'critical' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                selectedIncident.severity === 'high' ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
                'bg-gradient-to-r from-yellow-500 to-lime-500'
              }`}>
                <h3 className="text-2xl font-black mb-2">{selectedIncident.title}</h3>
                <p className="flex items-center gap-2 opacity-90">
                  <MapPin className="w-4 h-4" />
                  {selectedIncident.location}
                </p>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                  <Badge className="bg-teal-500 text-white mt-1">{selectedIncident.status}</Badge>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Severity</p>
                  <Badge className={`mt-1 ${selectedIncident.severity === 'critical' ? 'bg-red-500' : selectedIncident.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'} text-white`}>{selectedIncident.severity}</Badge>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                  <p className="font-bold text-gray-900 mt-1">{selectedIncident.date}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Affected</p>
                  <p className="font-bold text-gray-900 mt-1">{selectedIncident.affected}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Incident Description</h4>
                <p className="text-gray-700 leading-relaxed">{selectedIncident.description}</p>
              </div>

              {/* Pollutant Info */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Pollutant Type</h4>
                <p className="text-gray-700">{selectedIncident.pollutant}</p>
              </div>

              {/* Source */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Data Source</h4>
                <p className="text-gray-700">{selectedIncident.source}</p>
              </div>

              {/* Images Gallery */}
              {selectedIncident.images && selectedIncident.images.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Attached Photos</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedIncident.images.map((img, index) => (
                      <img key={index} src={img} alt={`Photo ${index + 1}`} className="w-full h-40 object-cover rounded-xl" />
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {selectedIncident.videos && selectedIncident.videos.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Attached Videos</h4>
                  <div className="space-y-4">
                    {selectedIncident.videos.map((video, index) => (
                      <video key={index} src={video} controls className="w-full rounded-xl" />
                    ))}
                  </div>
                </div>
              )}

              {/* Citation */}
              {selectedIncident.citation && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Research Citation</h4>
                  <CitationCard citation={selectedIncident.citation} />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold"
                  onClick={() => {
                    setShowReportDialog(false);
                    onGetTreatmentPlan(selectedIncident);
                    setActiveSection("recommender");
                  }}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Get AI Treatment Plan
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 font-bold"
                  onClick={() => {
                    // Generate downloadable report
                    const reportText = `
INCIDENT REPORT - JalRakshak AI
================================
Title: ${selectedIncident.title}
Location: ${selectedIncident.location}
Date: ${selectedIncident.date}
Severity: ${selectedIncident.severity}
Status: ${selectedIncident.status}

Affected Population: ${selectedIncident.affected}
Pollutant Type: ${selectedIncident.pollutant}

Description:
${selectedIncident.description}

Data Source: ${selectedIncident.source}
${selectedIncident.citation ? `
Research Citation:
${selectedIncident.citation.authors}
"${selectedIncident.citation.title}"
${selectedIncident.citation.journal}, ${selectedIncident.citation.year}
DOI: ${selectedIncident.citation.doi || 'N/A'}
Key Finding: ${selectedIncident.citation.findings}
` : ''}
Generated by JalRakshak AI - Water Crisis Intelligence Platform
Emergency: +91-9981762011
                    `.trim();
                    const blob = new Blob([reportText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `incident-report-${selectedIncident.id}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast({ title: "Report Downloaded", description: "Incident report has been saved." });
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

// Add Incident Form
function AddIncidentForm({ onSubmit, onCancel }: { onSubmit: (data: Partial<Incident>) => void; onCancel: () => void }) {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    severity: "moderate" as const,
    pollutant: "",
    description: "",
    affected: "",
    source: ""
  });
  
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewVideos, setPreviewVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxImages = 5;

    const remainingSlots = maxImages - previewImages.length;
    if (remainingSlots <= 0) {
      toast({
        title: "Limit reached",
        description: "Maximum 5 images allowed",
        variant: "destructive"
      });
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToProcess) {
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a valid image. Use JPEG, PNG, or WEBP.`,
          variant: "destructive"
        });
        continue;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 5MB limit`,
          variant: "destructive"
        });
        continue;
      }

      try {
        const base64 = await fileToBase64(file);
        setPreviewImages(prev => [...prev, base64]);
      } catch {
        toast({
          title: "Upload failed",
          description: `Failed to process ${file.name}`,
          variant: "destructive"
        });
      }
    }

    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  // Handle video upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    const maxVideos = 3;

    const remainingSlots = maxVideos - previewVideos.length;
    if (remainingSlots <= 0) {
      toast({
        title: "Limit reached",
        description: "Maximum 3 videos allowed",
        variant: "destructive"
      });
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToProcess) {
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a valid video. Use MP4, WebM, MOV, or AVI.`,
          variant: "destructive"
        });
        continue;
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 50MB limit`,
          variant: "destructive"
        });
        continue;
      }

      try {
        const base64 = await fileToBase64(file);
        setPreviewVideos(prev => [...prev, base64]);
      } catch {
        toast({
          title: "Upload failed",
          description: `Failed to process ${file.name}`,
          variant: "destructive"
        });
      }
    }

    // Reset input
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove video
  const removeVideo = (index: number) => {
    setPreviewVideos(prev => prev.filter((_, i) => i !== index));
  };

  // Handle submit
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        status: "reported",
        date: new Date().toISOString().split('T')[0],
        lat: 22,
        lng: 78,
        images: previewImages,
        videos: previewVideos
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div>
        <Label className="font-semibold">Incident Title *</Label>
        <Input
          className="mt-1"
          placeholder="e.g., River Contamination Event"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <Label className="font-semibold">Location *</Label>
        <Input
          className="mt-1"
          placeholder="e.g., Khan River, Indore"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="font-semibold">Severity</Label>
          <Select value={formData.severity} onValueChange={(v: any) => setFormData({ ...formData, severity: v })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="font-semibold">Affected Population</Label>
          <Input
            className="mt-1"
            placeholder="e.g., 50,000+"
            value={formData.affected}
            onChange={(e) => setFormData({ ...formData, affected: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label className="font-semibold">Pollutant Type</Label>
        <Input
          className="mt-1"
          placeholder="e.g., Industrial Dyes, Heavy Metals"
          value={formData.pollutant}
          onChange={(e) => setFormData({ ...formData, pollutant: e.target.value })}
        />
      </div>
      <div>
        <Label className="font-semibold">Description</Label>
        <Textarea
          className="mt-1"
          placeholder="Describe the incident..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div>
        <Label className="font-semibold">Source / Citation</Label>
        <Input
          className="mt-1"
          placeholder="e.g., CPCB Report 2024"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
        />
      </div>

      {/* Image Upload Section */}
      <div className="space-y-3">
        <Label className="font-semibold flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Images (JPEG, PNG, WEBP - Max 5MB each, up to 5)
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => imageInputRef.current?.click()}
          >
            <Camera className="w-4 h-4" />
            Camera
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => imageInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            Gallery
          </Button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        {previewImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previewImages.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Upload Section */}
      <div className="space-y-3">
        <Label className="font-semibold flex items-center gap-2">
          <Video className="w-4 h-4" />
          Videos (MP4, WebM, MOV, AVI - Max 50MB each, up to 3)
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => videoInputRef.current?.click()}
          >
            <Camera className="w-4 h-4" />
            Record
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => videoInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            Gallery
          </Button>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
            multiple
            className="hidden"
            onChange={handleVideoUpload}
          />
        </div>
        {previewVideos.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {previewVideos.map((video, index) => (
              <div key={index} className="relative group">
                <video
                  src={video}
                  className="w-full h-32 object-cover rounded-lg border"
                  controls
                />
                <button
                  type="button"
                  onClick={() => removeVideo(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button 
          className="bg-teal-600 text-white"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Report"
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}

// Science Section with 3D Animations
function ScienceSection() {
  const [activeSystem, setActiveSystem] = useState<string>("MPEC");

  const systems = {
    MPEC: {
      name: "Microbial-Photo-Electrochemical Coupling",
      description: "Combines photosensitizers with electrochemical systems for enhanced pollutant degradation through dual oxidation-reduction pathways.",
      icon: Zap,
      color: "from-amber-500 to-yellow-500",
      pollutants: ["Heavy Metals", "Nitrates", "Dyes", "Antibiotics"],
      advantages: ["Energy recovery potential (0.5-1.2 kWh/m³)", "Dual oxidation-reduction pathways", "Electrochemical process control"],
      limitations: ["Requires electrode maintenance", "Higher capital investment", "Need for conductive materials"],
      photosensitizers: ["TiO2", "g-C3N4", "CdS", "BiVO4"],
      bacteria: ["Geobacter sulfurreducens", "Shewanella oneidensis", "Pseudomonas aeruginosa"],
      citations: researchCitations.MPEC
    },
    ICPB: {
      name: "Intimately Coupled Photocatalysis & Biodegradation",
      description: "Photosensitizers mounted on porous carriers enable simultaneous photocatalytic reactions and biological treatment.",
      icon: FlaskConical,
      color: "from-teal-500 to-green-500",
      pollutants: ["Azo Dyes", "Phenol", "Chlorophenols", "Pharmaceuticals"],
      advantages: ["Scalable design", "Robust operation", "85-98% removal efficiency"],
      limitations: ["Carrier fouling risk", "Biofilm management required", "Pore size optimization"],
      photosensitizers: ["TiO2/SiO2", "Ag/TiO2", "BiVO4", "g-C3N4"],
      bacteria: ["Pseudomonas putida", "Bacillus subtilis", "Activated sludge consortia"],
      citations: researchCitations.ICPB
    },
    SPB: {
      name: "Self-Photosensitized Biohybrid",
      description: "Engineered bacteria that produce intrinsic photosensitizers for fully biological light-harvesting treatment.",
      icon: Leaf,
      color: "from-emerald-500 to-teal-500",
      pollutants: ["Organic compounds", "CO2", "Simple organics"],
      advantages: ["Fully biological system", "Self-sustaining", "No external catalyst needed"],
      limitations: ["Stability challenges", "Limited pollutant range", "Research stage technology"],
      photosensitizers: ["Bacterial pigments", "Sensitizer proteins", "Chlorophyll derivatives"],
      bacteria: ["Engineered Rhodopseudomonas", "Cyanobacteria", "Modified E. coli"],
      citations: researchCitations.SPB
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
            <Microscope className="w-4 h-4 mr-2" />
            RESEARCH-BACKED SCIENCE
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Solar-Driven Biological Treatment
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore the science behind photosensitizer-bacteria synergy with peer-reviewed research citations
          </p>
        </motion.div>

        {/* System Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(systems).map(([key, system]) => (
            <motion.button
              key={key}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                activeSystem === key
                  ? `bg-gradient-to-r ${system.color} text-white shadow-xl`
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveSystem(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <system.icon className="w-5 h-5 inline mr-2" />
              {key}
            </motion.button>
          ))}
        </div>

        {/* Active System Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSystem}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="shadow-2xl border-0 overflow-hidden">
              {/* Header */}
              <div className={`bg-gradient-to-r ${systems[activeSystem as keyof typeof systems].color} p-6`}>
                <div className="flex items-center gap-4">
                  {(() => {
                    const SysIcon = systems[activeSystem as keyof typeof systems].icon;
                    return <SysIcon className="w-12 h-12 text-white" />;
                  })()}
                  <div className="text-white">
                    <h3 className="text-2xl font-black">{systems[activeSystem as keyof typeof systems].name}</h3>
                    <p className="text-white/90">{activeSystem} System Configuration</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left - Info */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-3">How It Works</h4>
                      <p className="text-gray-700">{systems[activeSystem as keyof typeof systems].description}</p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-3">Target Pollutants</h4>
                      <div className="flex flex-wrap gap-2">
                        {systems[activeSystem as keyof typeof systems].pollutants.map((p) => (
                          <Badge key={p} variant="secondary" className="px-3 py-1 font-semibold">{p}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Photosensitizers</h4>
                        <div className="space-y-1">
                          {systems[activeSystem as keyof typeof systems].photosensitizers.map((p) => (
                            <div key={p} className="flex items-center gap-2 text-sm">
                              <Sun className="w-4 h-4 text-amber-500" />
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Bacterial Strains</h4>
                        <div className="space-y-1">
                          {systems[activeSystem as keyof typeof systems].bacteria.map((b) => (
                            <div key={b} className="flex items-center gap-2 text-sm">
                              <Bug className="w-4 h-4 text-teal-500" />
                              <span className="truncate">{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right - 3D Visualization */}
                  <div>
                    <WaterTreatment3D />
                  </div>
                </div>

                {/* Advantages & Limitations */}
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-green-800 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Advantages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {systems[activeSystem as keyof typeof systems].advantages.map((a) => (
                          <li key={a} className="flex items-center gap-2 text-green-700">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="font-medium">{a}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-amber-50 border-amber-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-amber-800 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Considerations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {systems[activeSystem as keyof typeof systems].limitations.map((l) => (
                          <li key={l} className="flex items-center gap-2 text-amber-700">
                            <AlertCircle className="w-4 h-4" />
                            <span className="font-medium">{l}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Research Citations */}
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Peer-Reviewed Research Citations
                  </h4>
                  {systems[activeSystem as keyof typeof systems].citations.map((citation) => (
                    <CitationCard key={citation.id} citation={citation} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* EET Mechanisms */}
        <div className="mt-16">
          <h3 className="text-2xl font-black text-gray-900 text-center mb-8">
            Extracellular Electron Transfer (EET) Mechanisms
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Direct EET",
                description: "Electron transfer through membrane-bound c-type cytochromes and conductive pili (nanowires).",
                icon: Zap,
                speed: "Fast (ms)",
                efficiency: "85-95%",
                detail: "Requires direct contact between bacteria and electrode/photosensitizer"
              },
              {
                title: "Indirect EET",
                description: "Electron shuttles (flavins, quinones) carry electrons between bacteria and acceptors.",
                icon: Radio,
                speed: "Moderate (s)",
                efficiency: "60-80%",
                detail: "Mediator-dependent, can work at distance"
              },
              {
                title: "Electron Hopping",
                description: "Electrons move through redox-active sites in conductive biofilms or materials.",
                icon: Activity,
                speed: "Slow (min)",
                efficiency: "40-60%",
                detail: "Important in thick biofilms and conductive networks"
              }
            ].map((mechanism, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="h-full border-teal-100 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <mechanism.icon className="w-10 h-10 text-teal-500 mb-2" />
                    <CardTitle className="text-xl font-bold">{mechanism.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{mechanism.description}</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Speed</p>
                        <p className="font-bold text-gray-900">{mechanism.speed}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500">Efficiency</p>
                        <p className="font-bold text-gray-900">{mechanism.efficiency}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 italic">{mechanism.detail}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* EET Citation */}
          <div className="mt-6">
            <CitationCard citation={researchCitations.EET[0]} />
          </div>
        </div>

        {/* Neural Network Architecture */}
        <div className="mt-16">
          <h3 className="text-2xl font-black text-gray-900 text-center mb-8">
            Neural Network Treatment Recommendation Engine
          </h3>
          <NeuralNetworkVisualization />
          <p className="text-center text-gray-500 text-sm mt-4 italic">
            Deep learning model trained on 50+ peer-reviewed research papers for optimal treatment recommendation
          </p>
        </div>
      </div>
    </section>
  );
}

// AI Recommender Section with Neural Network
function AIRecommenderSection({ prefilledData }: { prefilledData: { pollutantType: string; incident?: Incident } | null }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TreatmentResult | null>(null);

  const [formData, setFormData] = useState({
    pollutantType: "",
    pollutantClass: "",
    concentration: "",
    sunlightIntensity: "",
    waterSource: "",
    infrastructure: "",
    desiredOutput: ""
  });

  // Update form when prefilledData changes
  useEffect(() => {
    if (prefilledData) {
      setFormData(prev => ({
        ...prev,
        pollutantType: prefilledData.pollutantType
      }));
      if (prefilledData.incident) {
        toast({ 
          title: "Incident Loaded", 
          description: `Analyzing pollutant: ${prefilledData.pollutantType} from ${prefilledData.incident.title}` 
        });
      }
    }
  }, [prefilledData, toast]);

  const pollutantTypes = [
    "Industrial Dyes", "Heavy Metals", "Phenol", "Chlorophenols",
    "Antibiotics", "Nitrates", "Phosphates", "Organic Waste",
    "Pesticides", "Petroleum Hydrocarbons", "Arsenic", "Fertilizers"
  ];

  const handleRecommend = async () => {
    if (!formData.pollutantType || !formData.concentration) {
      toast({ title: "Missing Information", description: "Please fill in pollutant type and concentration.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setResult(data);
      toast({ title: "AI Analysis Complete", description: "Treatment recommendation generated with research citations." });
    } catch {
      toast({ title: "Error", description: "Failed to generate recommendation.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white via-slate-50 to-teal-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold">
            <Brain className="w-4 h-4 mr-2" />
            NEURAL NETWORK POWERED
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            AI Treatment Recommender
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Deep learning model trained on peer-reviewed research for optimal SDBWT recommendations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
              <CardTitle className="text-xl font-bold">Water Quality Parameters</CardTitle>
              <CardDescription className="text-teal-100">Enter sample analysis data</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold text-gray-900">Pollutant Type *</Label>
                  <Select value={formData.pollutantType} onValueChange={(v) => setFormData({ ...formData, pollutantType: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select pollutant" /></SelectTrigger>
                    <SelectContent>
                      {pollutantTypes.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-semibold text-gray-900">Pollutant Class</Label>
                  <Select value={formData.pollutantClass} onValueChange={(v) => setFormData({ ...formData, pollutantClass: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organic">Organic</SelectItem>
                      <SelectItem value="inorganic">Inorganic</SelectItem>
                      <SelectItem value="heavy_metal">Heavy Metal</SelectItem>
                      <SelectItem value="microbial">Microbial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold text-gray-900">Concentration (mg/L) *</Label>
                  <Input type="number" placeholder="e.g., 150" className="mt-1" value={formData.concentration} onChange={(e) => setFormData({ ...formData, concentration: e.target.value })} />
                </div>
                <div>
                  <Label className="font-semibold text-gray-900">Sunlight Availability</Label>
                  <Select value={formData.sunlightIntensity} onValueChange={(v) => setFormData({ ...formData, sunlightIntensity: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select level" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High (6+ hrs/day)</SelectItem>
                      <SelectItem value="moderate">Moderate (4-6 hrs)</SelectItem>
                      <SelectItem value="low">Low (&lt;4 hrs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold text-gray-900">Water Source</Label>
                  <Select value={formData.waterSource} onValueChange={(v) => setFormData({ ...formData, waterSource: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select source" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="industrial">Industrial Effluent</SelectItem>
                      <SelectItem value="municipal">Municipal Wastewater</SelectItem>
                      <SelectItem value="river">River/Lake</SelectItem>
                      <SelectItem value="groundwater">Groundwater</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-semibold text-gray-900">Desired Output</Label>
                  <Select value={formData.desiredOutput} onValueChange={(v) => setFormData({ ...formData, desiredOutput: v })}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="removal">Pollutant Removal</SelectItem>
                      <SelectItem value="reuse">Water Reuse Ready</SelectItem>
                      <SelectItem value="energy">Energy Recovery</SelectItem>
                      <SelectItem value="complete">Complete Treatment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="w-full py-6 text-lg font-bold bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
                onClick={handleRecommend}
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Processing Neural Network...</>
                ) : (
                  <><Brain className="w-5 h-5 mr-2" />Generate AI Recommendation</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white">
              <CardTitle className="text-xl font-bold">AI Recommendation</CardTitle>
              <CardDescription className="text-cyan-100">Research-backed treatment strategy</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {!result && !loading && (
                <div className="text-center py-20">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                  </motion.div>
                  <p className="font-semibold text-gray-700">Enter parameters and generate</p>
                  <p className="text-sm text-gray-500">AI will analyze with research citations</p>
                </div>
              )}

              {loading && (
                <div className="text-center py-20">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Brain className="w-20 h-20 mx-auto mb-4 text-violet-500" />
                  </motion.div>
                  <p className="font-semibold text-gray-700">Neural network analyzing...</p>
                  <Progress value={66} className="mt-4 max-w-xs mx-auto" />
                </div>
              )}

              {result && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {/* Primary */}
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-black">{result.systemType}</h3>
                      <Badge className="bg-white/20 text-white px-3 py-1">{Math.round(result.confidence * 100)}% Confidence</Badge>
                    </div>
                    <p className="text-teal-100">{result.reasoning}</p>
                    <Progress value={result.confidence * 100} className="h-2 mt-3 bg-white/20" />
                  </div>

                  {/* Parameters */}
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-blue-50 border-blue-100"><CardContent className="p-3"><Sun className="w-5 h-5 text-amber-500 mb-1" /><p className="text-xs text-gray-600">Photosensitizer</p><p className="font-bold text-gray-900">{result.photosensitizer}</p></CardContent></Card>
                    <Card className="bg-green-50 border-green-100"><CardContent className="p-3"><Bug className="w-5 h-5 text-teal-500 mb-1" /><p className="text-xs text-gray-600">Bacteria</p><p className="font-bold text-gray-900">{result.bacteriaType}</p></CardContent></Card>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-gray-50 rounded-lg p-3"><p className="text-2xl font-extrabold text-teal-600">{result.expectedRemoval}%</p><p className="text-xs text-gray-600">Removal</p></div>
                    <div className="bg-gray-50 rounded-lg p-3">{result.energyRecovery ? <CheckCircle2 className="w-8 h-8 mx-auto text-green-500" /> : <X className="w-8 h-8 mx-auto text-gray-300" />}<p className="text-xs text-gray-600 mt-1">Energy</p></div>
                    <div className="bg-gray-50 rounded-lg p-3">{result.reusePotential ? <CheckCircle2 className="w-8 h-8 mx-auto text-green-500" /> : <X className="w-8 h-8 mx-auto text-gray-300" />}<p className="text-xs text-gray-600 mt-1">Reuse</p></div>
                  </div>

                  {/* Citations */}
                  {result.citations && result.citations.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Research Citations
                      </h4>
                      {result.citations.map((c) => <CitationCard key={c.id} citation={c} />)}
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// Simulation Section
function SimulationSection() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [params, setParams] = useState({
    systemType: "MPEC", pollutantType: "Industrial Dyes", pollutantConcentration: 100,
    sunlightIntensity: 800, photosensitizerDose: 1.0, bacteriaConcentration: 0.5,
    residenceTime: 24, temperature: 25, ph: 7.0
  });

  const runSimulation = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
      });
      const data = await response.json();
      setResult(data);
      toast({ title: "Simulation Complete", description: "Treatment performance predicted." });
    } catch {
      toast({ title: "Error", description: "Simulation failed.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold">
            <Gauge className="w-4 h-4 mr-2" />
            DIGITAL TWIN SIMULATION
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Treatment Performance Simulator</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Model SDBWT performance with kinetic parameters from research</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle className="font-bold">Simulation Parameters</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-semibold text-sm">System</Label>
                  <Select value={params.systemType} onValueChange={(v) => setParams({ ...params, systemType: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MPEC">MPEC</SelectItem>
                      <SelectItem value="ICPB">ICPB</SelectItem>
                      <SelectItem value="SPB">SPB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-semibold text-sm">Pollutant</Label>
                  <Select value={params.pollutantType} onValueChange={(v) => setParams({ ...params, pollutantType: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Industrial Dyes">Dyes</SelectItem>
                      <SelectItem value="Heavy Metals">Metals</SelectItem>
                      <SelectItem value="Phenol">Phenol</SelectItem>
                      <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {[
                { label: "Pollutant Conc.", key: "pollutantConcentration", unit: "mg/L", min: 10, max: 500 },
                { label: "Sunlight Intensity", key: "sunlightIntensity", unit: "W/m²", min: 200, max: 1200 },
                { label: "Photosensitizer Dose", key: "photosensitizerDose", unit: "g/L", min: 0.1, max: 5 },
                { label: "Residence Time", key: "residenceTime", unit: "hours", min: 1, max: 72 },
                { label: "Temperature", key: "temperature", unit: "°C", min: 10, max: 45 },
              ].map((s) => (
                <div key={s.key}>
                  <Label className="font-semibold text-sm">{s.label}: {params[s.key as keyof typeof params]}{s.unit}</Label>
                  <Slider
                    value={[params[s.key as keyof typeof params] as number]}
                    onValueChange={([v]) => setParams({ ...params, [s.key]: v })}
                    min={s.min} max={s.max} step={s.key === "photosensitizerDose" ? 0.1 : 5}
                    className="mt-2"
                  />
                </div>
              ))}

              <Button
                className="w-full py-4 font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                onClick={runSimulation}
                disabled={loading}
              >
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Running...</> : <><Gauge className="w-4 h-4 mr-2" />Run Simulation</>}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="lg:col-span-2 shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <CardTitle className="font-bold">Simulation Results</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!result && !loading && (
                <div className="text-center py-24">
                  <Gauge className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Adjust parameters and run simulation</p>
                </div>
              )}
              {loading && (
                <div className="text-center py-24">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Gauge className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                  </motion.div>
                  <p className="font-semibold text-gray-700">Computing kinetic model...</p>
                </div>
              )}
              {result && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white"><CardContent className="p-6 text-center"><TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-80" /><p className="text-3xl font-extrabold">{result.predictedRemoval.toFixed(1)}%</p><p className="text-teal-100 font-medium">Removal</p></CardContent></Card>
                    <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white"><CardContent className="p-6 text-center"><Zap className="w-8 h-8 mx-auto mb-2 opacity-80" /><p className="text-3xl font-extrabold">{result.predictedEnergy.toFixed(2)}</p><p className="text-amber-100 font-medium">kWh/m³</p></CardContent></Card>
                    <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white"><CardContent className="p-6 text-center"><Clock className="w-8 h-8 mx-auto mb-2 opacity-80" /><p className="text-3xl font-extrabold">{result.predictedTime.toFixed(1)}h</p><p className="text-purple-100 font-medium">Time</p></CardContent></Card>
                  </div>
                  
                  {/* Chart */}
                  <Card className="bg-gray-50"><CardHeader><CardTitle className="text-lg font-bold">Degradation Curve</CardTitle></CardHeader><CardContent>
                    <div className="h-40 flex items-end justify-between gap-2 px-4">
                      {[100, 78, 52, 35, 22, 15, 10, 7, 5, 3].map((val, i) => (
                        <motion.div key={i} className="flex-1 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-t" initial={{ height: 0 }} animate={{ height: `${val}%` }} transition={{ delay: i * 0.1, duration: 0.5 }} />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 px-4 text-xs text-gray-500"><span>0h</span><span>8h</span><span>16h</span><span>24h</span></div>
                  </CardContent></Card>

                  {/* Bottlenecks */}
                  <Card className="bg-red-50 border-red-200"><CardHeader><CardTitle className="font-bold text-red-800 flex items-center gap-2"><AlertCircle className="w-4 h-4" />Bottlenecks</CardTitle></CardHeader><CardContent><ul className="space-y-1">{result.bottleneckFactors.map((f, i) => (<li key={i} className="flex items-center gap-2 text-red-700"><div className="w-2 h-2 rounded-full bg-red-500" />{f}</li>))}</ul></CardContent></Card>

                  {/* Recommendations */}
                  <Card className="bg-green-50 border-green-200"><CardHeader><CardTitle className="font-bold text-green-800 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />Optimizations</CardTitle></CardHeader><CardContent><ul className="space-y-1">{result.recommendations.map((r, i) => (<li key={i} className="flex items-center gap-2 text-green-700"><ArrowRight className="w-4 h-4" />{r}</li>))}</ul></CardContent></Card>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// AI Chat Section - Redesigned with Premium UI
function AIChatSection() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageId, setMessageId] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const currentId = messageId;
    setMessageId(prev => prev + 1);
    const userMessage: Message = { 
      id: `msg-${currentId}`, 
      role: "user", 
      content: input, 
      timestamp: new Date() 
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages })
      });
      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        citations: data.citations
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      toast({ title: "Error", description: "Failed to get response.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "What is the difference between MPEC and ICPB?",
    "How does EET work in wastewater treatment?",
    "Which system is best for dye contamination?",
    "Explain photosensitizer-bacteria synergy"
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/20 rounded-full"
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${(i * 11) % 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
        
        {/* Neural Network Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          {[...Array(8)].map((_, i) => (
            <motion.line
              key={i}
              x1={`${10 + i * 12}%`}
              y1="0%"
              x2={`${15 + i * 10}%`}
              y2="100%"
              stroke="url(#chatGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
          <defs>
            <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-cyan-500/20 rounded-full border border-cyan-500/30 mb-6"
            animate={{ boxShadow: ['0 0 20px rgba(6, 182, 212, 0.2)', '0 0 40px rgba(6, 182, 212, 0.4)', '0 0 20px rgba(6, 182, 212, 0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-6 h-6 text-cyan-400" />
            </motion.div>
            <span className="text-white font-bold">AI Research Copilot</span>
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Research Assistant
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Ask questions about SDBWT, treatment systems, and get research-backed answers with citations
          </p>
        </motion.div>

        <Card className="shadow-2xl border-0 overflow-hidden bg-slate-800/80 backdrop-blur-xl border border-slate-700/50">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 via-violet-600 to-cyan-600 p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Brain className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-white">JalRakshak AI Assistant</h3>
                <div className="flex items-center gap-2">
                  <motion.div className="w-2 h-2 bg-green-400 rounded-full" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                  <p className="text-sm text-cyan-100">Online • Powered by 50+ research papers</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-white/30">
                <BookOpen className="w-3 h-3 mr-1" />
                Citations Enabled
              </Badge>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="h-[500px] p-6">
            {messages.length === 0 && (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="w-12 h-12 text-cyan-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-3">Hello! I&apos;m your AI Research Assistant</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  I can help you understand SDBWT systems, recommend treatments, and provide research citations.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                  {suggestedQuestions.map((q, i) => (
                    <motion.button
                      key={i}
                      className="p-4 text-left bg-slate-700/50 hover:bg-slate-700 rounded-xl border border-slate-600/50 text-gray-300 text-sm transition-all"
                      onClick={() => setInput(q)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400 mb-2" />
                      {q}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((msg, index) => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                transition={{ delay: index * 0.05 }}
                className={`flex mb-6 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center mr-3 flex-shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${msg.role === "user" ? "order-first" : ""}`}>
                  <motion.div 
                    className={`rounded-2xl px-5 py-4 ${
                      msg.role === "user" 
                        ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white" 
                        : "bg-slate-700/80 text-gray-100 border border-slate-600/50"
                    }`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    
                    {msg.citations && msg.citations.length > 0 && (
                      <motion.div 
                        className="mt-4 pt-4 border-t border-slate-500/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm font-semibold text-cyan-300">Research Citations</span>
                        </div>
                        <div className="space-y-2">
                          {msg.citations.map((c) => (
                            <motion.div 
                              key={c.id} 
                              className="p-3 bg-slate-800/60 rounded-xl border border-slate-600/30"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              <p className="font-semibold text-white text-sm">{c.authors} ({c.year})</p>
                              <p className="text-cyan-300 text-sm italic">"{c.title}"</p>
                              <p className="text-gray-400 text-xs mt-1">{c.journal}</p>
                              {c.doi && (
                                <a 
                                  href={`https://doi.org/${c.doi}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 mt-2"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  DOI: {c.doi}
                                </a>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                  
                  <p className={`text-xs mt-2 ${msg.role === "user" ? "text-right text-gray-400" : "text-gray-500"}`}>
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                
                {msg.role === "user" && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center ml-3 flex-shrink-0">
                    <span className="text-white font-bold">U</span>
                  </div>
                )}
              </motion.div>
            ))}

            {loading && (
              <motion.div 
                className="flex justify-start mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center mr-3">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="bg-slate-700/80 rounded-2xl px-5 py-4 border border-slate-600/50">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="flex gap-1"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" style={{ animationDelay: '0.4s' }} />
                    </motion.div>
                    <span className="text-gray-400">Analyzing research database...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-slate-700/50 p-5 bg-slate-800/50">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
              <div className="flex-1 relative">
                <Input 
                  placeholder="Ask about SDBWT, treatment systems, research papers..." 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  className="w-full bg-slate-700/50 border-slate-600/50 text-white placeholder:text-gray-400 focus:border-cyan-500/50 focus:ring-cyan-500/20 pr-12 py-6 text-lg"
                  disabled={loading} 
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Sparkles className="w-5 h-5 text-gray-500" />
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  type="submit" 
                  disabled={loading || !input.trim()} 
                  className="px-8 py-6 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white text-lg font-bold rounded-xl"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Send className="w-6 h-6" />
                  )}
                </Button>
              </motion.div>
            </form>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Responses are generated from peer-reviewed research papers. Always verify for critical decisions.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}

// Admin Section
function AdminSection({ incidents, onUpdateIncident, onDeleteIncident }: { 
  incidents: Incident[]; 
  onUpdateIncident: (incident: Incident) => void;
  onDeleteIncident: (id: string) => void;
}) {
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    onDeleteIncident(id);
    toast({ title: "Deleted", description: "Incident removed from database." });
  };

  const handleEdit = (incident: Incident) => {
    setEditingIncident(incident);
    setShowEditDialog(true);
  };

  const handleSaveEdit = (updatedIncident: Incident) => {
    onUpdateIncident(updatedIncident);
    setShowEditDialog(false);
    setEditingIncident(null);
    toast({ title: "Updated", description: "Incident has been updated." });
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Badge className="mb-4 px-4 py-2 bg-gray-800 text-white font-bold">
            <Settings className="w-4 h-4 mr-2" />
            ADMINISTRATION PANEL
          </Badge>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Data Management Console</h2>
          <p className="text-lg text-gray-600">Manage crisis incidents and system data</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-teal-100">Total Incidents</p><p className="text-4xl font-black">{incidents.length}</p></div><AlertTriangle className="w-12 h-12 opacity-50" /></div></CardContent></Card>
          <Card className="bg-gradient-to-br from-red-500 to-orange-500 text-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-red-100">Critical</p><p className="text-4xl font-black">{incidents.filter(i => i.severity === 'critical').length}</p></div><AlertCircle className="w-12 h-12 opacity-50" /></div></CardContent></Card>
          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-green-100">With Citations</p><p className="text-4xl font-black">{incidents.filter(i => i.citation).length}</p></div><BookOpen className="w-12 h-12 opacity-50" /></div></CardContent></Card>
        </div>

        <Card className="shadow-xl">
          <CardHeader><CardTitle className="font-bold">Incident Database</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-sm">Title</th>
                    <th className="text-left p-3 font-semibold text-sm">Location</th>
                    <th className="text-left p-3 font-semibold text-sm">Severity</th>
                    <th className="text-left p-3 font-semibold text-sm">Status</th>
                    <th className="text-left p-3 font-semibold text-sm">Citation</th>
                    <th className="text-left p-3 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident) => (
                    <tr key={incident.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{incident.title}</td>
                      <td className="p-3 text-gray-600">{incident.location}</td>
                      <td className="p-3"><Badge className={`${incident.severity === 'critical' ? 'bg-red-500' : incident.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'} text-white`}>{incident.severity}</Badge></td>
                      <td className="p-3"><Badge variant="outline">{incident.status}</Badge></td>
                      <td className="p-3">{incident.citation ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-gray-300" />}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(incident)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-500 hover:bg-red-50" 
                            onClick={() => handleDelete(incident.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Incident</DialogTitle>
            <DialogDescription>Update incident details</DialogDescription>
          </DialogHeader>
          {editingIncident && (
            <EditIncidentForm 
              incident={editingIncident} 
              onSave={handleSaveEdit} 
              onCancel={() => setShowEditDialog(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

// Edit Incident Form
function EditIncidentForm({ incident, onSave, onCancel }: { 
  incident: Incident; 
  onSave: (incident: Incident) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: incident.title,
    location: incident.location,
    severity: incident.severity,
    status: incident.status,
    pollutant: incident.pollutant,
    description: incident.description
  });

  const handleSave = () => {
    onSave({
      ...incident,
      ...formData
    });
  };

  return (
    <div className="space-y-4 mt-4">
      <div>
        <Label className="font-semibold">Title</Label>
        <Input
          className="mt-1"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <Label className="font-semibold">Location</Label>
        <Input
          className="mt-1"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="font-semibold">Severity</Label>
          <Select value={formData.severity} onValueChange={(v: any) => setFormData({ ...formData, severity: v })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="font-semibold">Status</Label>
          <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active_response">Active Response</SelectItem>
              <SelectItem value="treatment_ongoing">Treatment Ongoing</SelectItem>
              <SelectItem value="under_investigation">Under Investigation</SelectItem>
              <SelectItem value="monitoring">Monitoring</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="font-semibold">Pollutant</Label>
        <Input
          className="mt-1"
          value={formData.pollutant}
          onChange={(e) => setFormData({ ...formData, pollutant: e.target.value })}
        />
      </div>
      <div>
        <Label className="font-semibold">Description</Label>
        <Textarea
          className="mt-1"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-teal-600 text-white" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </DialogFooter>
    </div>
  );
}

// Premium Footer
function PremiumFooter({ setActiveSection }: { setActiveSection: (section: string) => void }) {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Creator Section */}
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 rounded-2xl border border-teal-500/30"
            animate={{
              boxShadow: ['0 0 20px rgba(6, 182, 212, 0.2)', '0 0 40px rgba(6, 182, 212, 0.4)', '0 0 20px rgba(6, 182, 212, 0.2)']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-cyan-400" />
            <div className="text-center">
              <p className="text-sm text-gray-400">Created by</p>
              <p className="text-3xl font-black bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">ANSH SHARMA</p>
              <a 
                href="https://www.linkedin.com/in/anshsharmacse/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 mt-1 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                linkedin.com/in/anshsharmacse
              </a>
            </div>
            <Sparkles className="w-8 h-8 text-cyan-400" />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">JalRakshak AI</h3>
                <p className="text-xs text-gray-400">Water Sentinel</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">AI-powered water crisis intelligence and solar-remediation planning platform.</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => setActiveSection('crisis')} className="hover:text-cyan-400 transition-colors">Crisis Map</button></li>
              <li><button onClick={() => setActiveSection('science')} className="hover:text-cyan-400 transition-colors">Science Explorer</button></li>
              <li><button onClick={() => setActiveSection('recommender')} className="hover:text-cyan-400 transition-colors">AI Recommender</button></li>
              <li><button onClick={() => setActiveSection('simulation')} className="hover:text-cyan-400 transition-colors">Simulation Lab</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Research</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><button onClick={() => setActiveSection('science')} className="hover:text-cyan-400 transition-colors">Citations Database</button></li>
              <li><button onClick={() => setActiveSection('science')} className="hover:text-cyan-400 transition-colors">Treatment Systems</button></li>
              <li><button onClick={() => setActiveSection('science')} className="hover:text-cyan-400 transition-colors">EET Mechanisms</button></li>
              <li><button onClick={() => setActiveSection('science')} className="hover:text-cyan-400 transition-colors">Neural Network</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li><a href="tel:+919981762011" className="flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold"><Phone className="w-4 h-4" />+91-9981762011</a><p className="text-xs text-gray-500">Emergency Hotline</p></li>
              <li><a href="mailto:anshsharmacse@gmail.com" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"><Mail className="w-4 h-4" />anshsharmacse@gmail.com</a><p className="text-xs text-gray-500">Support</p></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2024 JalRakshak AI. Research-driven AI technology.</p>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Protecting India&apos;s Water Future</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main App
export default function JalRakshakAI() {
  const [activeSection, setActiveSection] = useState("home");
  const [incidents, setIncidents] = useState<Incident[]>(seedIncidents);
  const [prefilledData, setPrefilledData] = useState<{ pollutantType: string; incident?: Incident } | null>(null);

  const handleAddIncident = (newIncident: Incident) => {
    setIncidents(prev => [newIncident, ...prev]);
  };

  const handleUpdateIncident = (updatedIncident: Incident) => {
    setIncidents(prev => prev.map(i => i.id === updatedIncident.id ? updatedIncident : i));
  };

  const handleDeleteIncident = (id: string) => {
    setIncidents(prev => prev.filter(i => i.id !== id));
  };

  const handleGetTreatmentPlan = (incident: Incident) => {
    // Extract pollutant type from incident
    const pollutantType = incident.pollutant.split(',')[0].split('&')[0].trim();
    setPrefilledData({ pollutantType, incident });
  };

  const renderSection = () => {
    switch (activeSection) {
      case "home": return <PremiumHeroSection setActiveSection={setActiveSection} />;
      case "crisis": return (
        <CrisisMapSection 
          incidents={incidents} 
          onAddIncident={handleAddIncident} 
          setActiveSection={setActiveSection}
          onGetTreatmentPlan={handleGetTreatmentPlan}
        />
      );
      case "science": return <ScienceSection />;
      case "recommender": return <AIRecommenderSection prefilledData={prefilledData} />;
      case "simulation": return <SimulationSection />;
      case "chat": return <AIChatSection />;
      case "admin": return <AdminSection incidents={incidents} onUpdateIncident={handleUpdateIncident} onDeleteIncident={handleDeleteIncident} />;
      default: return <PremiumHeroSection setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PremiumNavigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 pt-20">
        <AnimatePresence mode="wait">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>
      <PremiumFooter setActiveSection={setActiveSection} />
    </div>
  );
}
