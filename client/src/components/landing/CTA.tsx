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

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge 
            variant="secondary" 
            className="mb-6 px-6 py-3 text-base font-medium bg-white/20 backdrop-blur-sm border-white/30 text-white"
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
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed text-center mx:auto">
            Join the revolution of visual blockchain programming. 
            Build complex applications without writing code.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="px-10 py-5 text-xl font-bold bg-white text-blue-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 border-0"
            >
              <Rocket className="mr-3 w-6 h-6" />
              Start Building
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="px-10 py-5 text-xl font-bold border-2 border-white/50 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm transition-all duration-300"
            >
              <Play className="mr-3 w-6 h-6" />
              Watch Demo
            </Button>
          </div>

          {/* Additional Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-white/80">
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-white hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <Github className="mr-2 w-5 h-5" />
              GitHub
            </Button>
            
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-white hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              Сообщество
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">6</div>
              <div className="text-sm text-blue-200">Smart Contracts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">8+</div>
              <div className="text-sm text-blue-200">Node Types</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">∞</div>
              <div className="text-sm text-blue-200">Possibilities</div>
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
