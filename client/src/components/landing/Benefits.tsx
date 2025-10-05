'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Target, 
  Rocket,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: "Infrastructure Level",
    subtitle: "Transforms VeChain into a scenario-driven platform",
    description: "Enables complex multi-contract interactions without custom development",
    features: [
      "Creates reusable workflow components",
      "Accelerates prototyping of DAO, DeFi, NFT applications",
      "Increases network activity and VTHO consumption",
      "Facilitates rapid prototyping"
    ],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Developer Experience",
    subtitle: "From No-Code to Full-Code spectrum",
    description: "Visual programming for non-technical users with AI assistance",
    features: [
      "Visual programming for all skill levels",
      "Composable smart contract architecture",
      "AI-assisted development workflow",
      "Comprehensive testing and simulation tools"
    ],
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: DollarSign,
    title: "Business Value",
    subtitle: "Reduces development barriers",
    description: "90% faster time-to-market for blockchain applications with transparent processes",
    features: [
      "90% faster time-to-market",
      "Cost reduction through reusable components",
      "Transparent and auditable business processes",
      "Seamless integration with VeChain ToolChain"
    ],
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Target,
    title: "Ecosystem Growth",
    subtitle: "Network effect amplification",
    description: "Each blueprint becomes a building block for future scenarios",
    features: [
      "Exponential growth in functionality",
      "Developer community around marketplace",
      "Synergy with VeChain's supply chain focus",
      "Each blueprint multiplies possibilities"
    ],
    gradient: "from-orange-500 to-red-500"
  }
];

const competitiveAdvantages = [
  {
    category: "vs. Traditional Smart Contract Development",
    advantages: [
      "10x faster development through visual programming",
      "90% cost reduction through reusable components",
      "Zero coding knowledge required for basic scenarios",
      "Built-in testing and simulation capabilities"
    ],
    icon: Rocket
  },
  {
    category: "vs. Centralized Automation Platforms",
    advantages: [
      "Decentralized execution with blockchain transparency",
      "Immutable audit trail for compliance",
      "No single point of failure",
      "Community-driven development and governance"
    ],
    icon: CheckCircle
  },
  {
    category: "vs. Other Blockchain Platforms",
    advantages: [
      "VeChain-specific optimizations for supply chain use cases",
      "VTHO-based economics aligned with network incentives",
      "ToolChain integration for enterprise adoption",
      "AI-first approach to scenario development"
    ],
    icon: Clock
  }
];

export function Benefits() {
  return (
    <section className="py-24 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Main Benefits */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Benefits
          </Badge>
          <h2 className="section-title mb-8 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent text-center">
            Competitive Advantages
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300  text-center leading-relaxed">
            VeFlow offers unique advantages at every level: from infrastructure to user experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  <div className="flex items-start mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${benefit.gradient} text-white mr-6 flex-shrink-0`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="card-subtitle mb-3 text-gray-900 dark:text-white">
                        {benefit.title}
                      </h3>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
                        {benefit.subtitle}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {benefit.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Competitive Advantages */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Comparison
          </Badge>
          <h3 className="subsection-title mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            Advantages Over Competitors
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300  text-center leading-relaxed">
            VeFlow outperforms existing solutions at all levels
          </p>
        </div>

        <div className="space-y-12">
          {competitiveAdvantages.map((comparison, index) => {
            const Icon = comparison.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
              >
                <CardContent className="p-8">
                  <div className="flex items-start mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white mr-4 flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="card-title text-gray-900 dark:text-white">
                      {comparison.category}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {comparison.advantages.map((advantage, advIndex) => (
                      <div key={advIndex} className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{advantage}</span>
                      </div>
                    ))}
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
