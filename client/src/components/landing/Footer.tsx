'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Github, 
  Twitter, 
  MessageCircle, 
  Globe,
  ExternalLink,
  Heart
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="section-title mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              VeFlow
            </h3>
            <p className="text-slate-300 mb-6 max-w-md leading-relaxed">
              Revolutionary scenario builder for the VeChain ecosystem. 
              Build complex blockchain applications without programming.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-300 hover:text-white hover:bg-gray-800"
              >
                <Github className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-300 hover:text-white hover:bg-gray-800"
              >
                <Twitter className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-300 hover:text-white hover:bg-gray-800"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-300 hover:text-white hover:bg-gray-800"
              >
                <Globe className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="feature-title mb-4 text-white">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  Use Cases
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="feature-title mb-4 text-white">Community</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  Telegram
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  News
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contract Addresses */}
        <div className="border-t border-gray-800 pt-12 mb-12">
          <h4 className="card-title mb-6 text-white">Contracts</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-400 mb-2">Registry</h5>
              <code className="text-xs text-slate-300 break-all">
                0xc03db9560d8be616748b1b158d5fb99094e33f41
              </code>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h5 className="font-medium text-purple-400 mb-2">Orchestrator</h5>
              <code className="text-xs text-slate-300 break-all">
                0x2ac7e4ea0a23ce7cac2d9681fcc7cb489549387b
              </code>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h5 className="font-medium text-green-400 mb-2">Executor</h5>
              <code className="text-xs text-slate-300 break-all">
                0x9ee3fa7ea944f843b395673c88f7423eed05406d
              </code>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <a 
              href="https://explore-testnet.vechain.org/transactions/0x2ac7e4ea0a23ce7cac2d9681fcc7cb489549387b"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Посмотреть на VeChain Explorer
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center text-slate-400 mb-4 md:mb-0">
            <span>Built with</span>
            <Heart className="w-4 h-4 mx-2 text-red-500" />
            <span>for the VeChain ecosystem</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <Badge variant="outline" className="border-gray-700 text-slate-300">
              Built on VeChain
            </Badge>
            <p className="text-sm text-slate-400">
              © 2025 VeFlow. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
