'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  TrendingUp, 
  Image, 
  Users, 
  ArrowRight,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

const useCases = [
  {
    icon: Truck,
    title: "Supply Chain Automation",
    description: "Real-time monitoring and automation of supply chain processes with instant response",
    workflow: [
      "Domain Expiration → Status Check → Report Generation → Stakeholder Notification → Compensation Initiation"
    ],
    features: [
      "Real-time monitoring",
      "Automatic notifications",
      "IoT device integration",
      "Compliance reporting"
    ],
    gradient: "from-blue-500 to-cyan-500",
    badge: "Supply Chain"
  },
  {
    icon: TrendingUp,
    title: "DeFi Yield Farming",
    description: "Automatic yield optimization and risk management in DeFi protocols",
    workflow: [
      "Price Check → APY Calculation → Risk Assessment → Auto-compounding → Portfolio Rebalancing"
    ],
    features: [
      "Automatic yield optimization",
      "Risk management",
      "Multi-protocol support",
      "Gas-efficient transactions"
    ],
    gradient: "from-green-500 to-emerald-500",
    badge: "DeFi"
  },
  {
    icon: Image,
    title: "NFT Marketplace",
    description: "Automation of trading operations and NFT metadata management",
    workflow: [
      "Listing Creation → Price Validation → Royalty Calculation → Escrow Setup → Transfer Execution"
    ],
    features: [
      "Automatic pricing",
      "Royalty management",
      "Escrow system",
      "Metadata management"
    ],
    gradient: "from-purple-500 to-pink-500",
    badge: "NFT"
  },
  {
    icon: Users,
    title: "DAO Governance",
    description: "Automation of governance processes and decision-making in DAOs",
    workflow: [
      "Proposal Submission → Member Notification → Voting Period → Results Tally → Decision Execution"
    ],
    features: [
      "Automatic voting management",
      "Member notifications",
      "Transparent counting",
      "Automatic execution"
    ],
    gradient: "from-orange-500 to-red-500",
    badge: "DAO"
  }
];

const nodeTypes = [
  {
    name: "Start Node",
    description: "Flow initiation with welcome messages",
    icon: Zap
  },
  {
    name: "Message Node",
    description: "User communication and notifications",
    icon: Globe
  },
  {
    name: "Condition Node",
    description: "Logical branching and decision making",
    icon: Shield
  },
  {
    name: "Action Node",
    description: "External API calls and blockchain interactions",
    icon: TrendingUp
  }
];

export function UseCases() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        {/* Use Cases Header */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Use Cases
          </Badge>
          <h2 className="section-title mb-8 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent text-center">
            Real-World Use Cases
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center leading-relaxed">
            From supply chain automation to DeFi strategies - VeFlow opens new possibilities for every sector
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:-translate-y-2"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${useCase.gradient} text-white`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {useCase.badge}
                    </Badge>
                  </div>
                  <CardTitle className="card-subtitle mb-4 text-gray-900 dark:text-white">
                    {useCase.title}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Workflow */}
                  <div>
                    <h4 className="text-xl font-black text-gray-900 dark:text-white mb-3 text-center">Workflow:</h4>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      <code className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                        {useCase.workflow[0]}
                      </code>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="text-xl font-black text-gray-900 dark:text-white mb-3 text-center">Features:</h4>
                    <ul className="space-y-2">
                      {useCase.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-700 dark:text-gray-300">
                          <ArrowRight className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-all duration-300"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Node Types */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Components
          </Badge>
          <h3 className="subsection-title mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            Node Types
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300  text-center leading-relaxed">
            Rich set of pre-built nodes for creating any scenarios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {nodeTypes.map((node, index) => {
            const Icon = node.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:-translate-y-1"
              >
                <CardContent className="p-6 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white mx-auto mb-4 w-fit">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black mb-2 text-gray-900 dark:text-white">
                    {node.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {node.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Node Types */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            And 4+ more node types: Timer, Notification, Text Input, Domain Trigger
          </p>
          <Button 
            variant="outline" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700"
          >
            View All Nodes
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
