'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Shield, 
  Layers, 
  Globe,
  Code,
  Database,
  Lock,
  Cpu,
  Network,
  CheckCircle
} from 'lucide-react';

const technicalSpecs = [
  {
    icon: Cpu,
    title: "Performance",
    description: "Optimized architecture for maximum efficiency",
    specs: [
      "Sub-second node execution for simple operations",
      "Batch processing for complex scenarios",
      "Gas optimization through smart contract design",
      "Horizontal scaling through blueprint distribution"
    ],
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Shield,
    title: "Security",
    description: "Enterprise-level security and protection",
    specs: [
      "Role-based access control with OpenZeppelin",
      "Reentrancy protection for external calls",
      "Upgradeable architecture for security patches",
      "Comprehensive testing with 95%+ code coverage"
    ],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Network,
    title: "Integration",
    description: "Extensive integration capabilities with external systems",
    specs: [
      "VeChain Kit for wallet connectivity",
      "REST API for external service integration",
      "Webhook support for real-time notifications",
      "GraphQL for efficient data querying"
    ],
    gradient: "from-purple-500 to-pink-500"
  }
];

const contractAddresses = [
  {
    name: "VeFlowRegistry Proxy",
    address: "0xc03db9560d8be616748b1b158d5fb99094e33f41",
    description: "Manages blueprint registration and versioning"
  },
  {
    name: "VeFlowBilling Proxy", 
    address: "0xd5ec015a300d5c6d42abeb4004ded409c0d7e24d",
    description: "VTHO-based payment system with royalty model"
  },
  {
    name: "VeFlowExecutor Proxy",
    address: "0x9ee3fa7ea944f843b395673c88f7423eed05406d", 
    description: "Secure external call execution"
  },
  {
    name: "VeFlowOrchestrator Proxy",
    address: "0x2ac7e4ea0a23ce7cac2d9681fcc7cb489549387b",
    description: "Main orchestrator for flow execution"
  },
  {
    name: "VeFlowAccessControl",
    address: "0xed31f42a4a6ffc6a80195b7c56f6cb23dfbacc7e",
    description: "Centralized access control system"
  },
  {
    name: "ProxyAdmin",
    address: "0x9bf463e21e6964fe34c499ca0067b1be14e0c5b4",
    description: "Administrator of upgradeable proxy contracts"
  }
];

const roadmap = [
  {
    phase: "Phase 1: Core Platform",
    status: "completed",
    features: [
      "Visual flow builder",
      "Smart contract deployment", 
      "Basic node types",
      "Simulation system"
    ]
  },
  {
    phase: "Phase 2: AI Integration",
    status: "in-progress", 
    features: [
      "LLM-powered scenario generation",
      "Natural language to flow conversion",
      "Intelligent error handling",
      "Predictive optimization"
    ]
  },
  {
    phase: "Phase 3: Ecosystem Expansion",
    status: "planned",
    features: [
      "Blueprint marketplace",
      "Community governance",
      "Advanced analytics",
      "Enterprise integrations"
    ]
  },
  {
    phase: "Phase 4: Advanced Features",
    status: "planned",
    features: [
      "Multi-chain support",
      "Advanced AI models",
      "Custom node development",
      "Enterprise deployment tools"
    ]
  }
];

export function TechnicalSpecs() {
  return (
    <section className="py-24 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Technical Specs Header */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Technical Specifications
          </Badge>
          <h2 className="section-title mb-8 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent text-center">
            Technical Architecture
          </h2>
          <p className="text-xl text-slate-600 dark:text-gray-300  text-center leading-relaxed">
            Enterprise-level performance, security, and scalability
          </p>
        </div>

        {/* Technical Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24 pt-6">
          {technicalSpecs.map((spec, index) => {
            const Icon = spec.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:-translate-y-2"
              >
                <CardHeader className="pb-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${spec.gradient} text-white mb-4 w-fit`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="card-subtitle text-slate-900 dark:text-white">
                    {spec.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-gray-300 text-lg">
                    {spec.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {spec.specs.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contract Addresses */}
        <div className="text-center mb-20 pt-6">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Contracts
          </Badge>
          <h3 className="subsection-title mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            Smart Contract Addresses
          </h3>
          <p className="text-xl text-slate-600 dark:text-gray-300  text-center leading-relaxed">
            Fully deployed system on VeChain testnet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {contractAddresses.map((contract, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <h4 className="font-bold text-lg mb-3 text-blue-900 dark:text-blue-100">
                  {contract.name}
                </h4>
                <p className="text-slate-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                  {contract.description}
                </p>
                <div className="bg-slate-100 dark:bg-gray-800 p-3 rounded-lg">
                  <code className="text-xs font-mono text-slate-800 dark:text-gray-200 break-all">
                    {contract.address}
                  </code>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Roadmap */}
        <div className="text-center mb-20 pt-6">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Roadmap
          </Badge>
          <h3 className="subsection-title mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent text-center">
            Development Roadmap
          </h3>
          <p className="text-xl text-slate-600 dark:text-gray-300  text-center leading-relaxed">
            Phased platform development with focus on innovation
          </p>
        </div>

        <div className="space-y-12">
          {roadmap.map((phase, index) => (
            <Card 
              key={index} 
              className={`roadmap-card group hover:shadow-xl transition-all duration-300 border-2 ${
                phase.status === 'completed' 
                  ? 'roadmap-completed'
                  : phase.status === 'in-progress'
                  ? 'roadmap-in-progress'
                  : 'roadmap-planned'
              }`}
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="card-subtitle text-slate-900 dark:text-white">
                    {phase.phase}
                  </h4>
                  <Badge 
                    variant={phase.status === 'completed' ? 'default' : phase.status === 'in-progress' ? 'secondary' : 'outline'}
                    className={`roadmap-badge ${
                      phase.status === 'completed' 
                        ? 'roadmap-badge-completed' 
                        : phase.status === 'in-progress'
                        ? 'roadmap-badge-in-progress'
                        : 'roadmap-badge-planned'
                    }`}
                  >
                    {phase.status === 'completed' ? 'Completed' : phase.status === 'in-progress' ? 'In Progress' : 'Planned'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className={`w-5 h-5 mr-3 flex-shrink-0 ${
                        phase.status === 'completed' ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      <span className="roadmap-feature-text">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Deployer Info */}
        <div className="mt-16 text-center pt-6">
          <Card className="deployer-card">
            <CardContent className="p-8">
              <h4 className="deployer-title">
                Deployer Address
              </h4>
              <div className="deployer-code-container">
                <code className="deployer-code">
                  0x783DE01F06b4F2a068A7b3Bb6ff3db821A08f8c1
                </code>
              </div>
              <p className="deployer-explorer-text">
                VeChain Explorer: 
                <a 
                  href="https://explore-testnet.vechain.org/transactions/0x2ac7e4ea0a23ce7cac2d9681fcc7cb489549387b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="deployer-explorer-link"
                >
                  View on VeChain Explorer
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
