'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Brain, 
  Shield, 
  Zap, 
  Layers, 
  Globe,
  Code,
  Workflow,
  Eye,
  Lock
} from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: "Visual Programming",
    description: "Build complex blockchain applications through drag-and-drop interface without writing code",
    badge: "No-Code",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Brain,
    title: "AI Automation",
    description: "Artificial intelligence generates scenarios based on natural language and adapts them to changes",
    badge: "AI-Powered",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Shield,
    title: "Transparent Execution",
    description: "All scenarios are stored and executed on VeChain blockchain with full transparency and immutability",
    badge: "On-Chain",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Zap,
    title: "Modular Architecture",
    description: "Reusable components (blueprints) can be combined like LEGO blocks to create complex workflows",
    badge: "Modular",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Layers,
    title: "Smart Contract System",
    description: "6 interconnected contracts ensure security, scalability, and upgradeability",
    badge: "Enterprise",
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    icon: Globe,
    title: "VeChain Integration",
    description: "Native VTHO support, ToolChain integration, and optimization for supply chain solutions",
    badge: "Native",
    gradient: "from-teal-500 to-green-500"
  }
];

const smartContractFeatures = [
  {
    icon: Code,
    title: "VeFlowRegistry",
    description: "Manages blueprint registration and versioning with metadata",
    address: "0xc03db9560d8be616748b1b158d5fb99094e33f41"
  },
  {
    icon: Workflow,
    title: "VeFlowOrchestrator",
    description: "Main orchestrator coordinating flow execution and event emission",
    address: "0x2ac7e4ea0a23ce7cac2d9681fcc7cb489549387b"
  },
  {
    icon: Shield,
    title: "VeFlowExecutor",
    description: "Secure external call execution and endpoint management",
    address: "0x9ee3fa7ea944f843b395673c88f7423eed05406d"
  },
  {
    icon: Lock,
    title: "VeFlowAccessControl",
    description: "Centralized access control system with role-based model",
    address: "0xed31f42a4a6ffc6a80195b7c56f6cb23dfbacc7e"
  }
];

export function Features() {
  return (
    <section className="section-spacing bg-slate-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-6">
        {/* Main Features */}
        <div className="text-center mb-24 py-6">
          <Badge variant="outline-lg" className="mb-6">
            Features
          </Badge>
          <h2 className="section-title mb-12 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent text-center">
            Revolutionary Features
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-gray-300 text-center leading-relaxed max-w-4xl mx-auto">
            VeFlow introduces a new approach to blockchain application development, 
            combining visual programming with AI automation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm hover:-translate-y-2 p-6 shadow-sm"
              >
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${feature.gradient} text-white`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="feature-title group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-4">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-slate-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Smart Contract Architecture */}
        <div className="text-center mb-20 py-6">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Architecture
          </Badge>
          <h3 className="subsection-title mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            Smart Contract System
          </h3>
          <p className="text-xl text-slate-600 dark:text-gray-300  text-center leading-relaxed">
            6 interconnected contracts ensure security, scalability, and upgradeability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {smartContractFeatures.map((contract, index) => {
            const Icon = contract.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:-translate-y-1"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white mr-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="card-title text-blue-900 dark:text-blue-100">
                        {contract.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {contract.description}
                  </p>
                  <div className="flex items-center text-sm text-slate-500 dark:text-gray-400">
                    <span className="font-mono bg-slate-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                      {contract.address}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
