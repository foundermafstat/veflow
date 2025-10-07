'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Play, 
  Github, 
  MessageCircle,
  Rocket,
  Sparkles
} from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-indigo-700/90" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge 
            variant="glass-lg" 
            className="mb-6"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Ready to Start?
          </Badge>

          {/* Main heading */}
          <h2 className="cta-title mb-8 text-white text-center">
            Build the Future of Blockchain
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Today
            </span>
          </h2>
          
          <p className="cta-description">
            Join the revolution of visual blockchain programming. 
            Build complex applications without writing code.
          </p>

          {/* CTA Buttons */}
          <div className="cta-buttons">
            <Button 
              size="lg" 
              className="cta-primary-button"
            >
              <Rocket className="mr-3 w-6 h-6" />
              Start Building
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="cta-secondary-button"
            >
              <Play className="mr-3 w-6 h-6" />
              Watch Demo
            </Button>
          </div>

          {/* Additional Actions */}
          <div className="cta-additional-actions">
            <Button 
              variant="ghost" 
              size="lg" 
              className="cta-ghost-button"
            >
              <Github className="mr-2 w-5 h-5" />
              GitHub
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg" 
              className="cta-ghost-button"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              Community
            </Button>
          </div>

          {/* Stats */}
          <div className="cta-stats">
            <div className="cta-stat-item">
              <div className="cta-stat-number">6</div>
              <div className="cta-stat-label">Smart Contracts</div>
            </div>
            <div className="cta-stat-item">
              <div className="cta-stat-number">8+</div>
              <div className="cta-stat-label">Node Types</div>
            </div>
            <div className="cta-stat-item">
              <div className="cta-stat-number">∞</div>
              <div className="cta-stat-label">Possibilities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-300" />
      <div className="absolute top-40 right-20 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-700" />
      <div className="absolute bottom-40 left-20 w-8 h-8 bg-white/10 rounded-full animate-bounce delay-1000" />
    </section>
  );
}
