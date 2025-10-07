'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <Badge 
            variant="gradient-lg" 
            className="mb-8"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            World's First AI-Powered Visual Blockchain Programming Platform
          </Badge>

          {/* Main heading */}
          <h1 className="hero-title mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
            VeFlow
          </h1>
          
          <h2 className="hero-subtitle text-slate-700 dark:text-gray-300 mb-8">
            Revolutionary Scenario Builder for VeChain Ecosystem
          </h2>
          
          <p className="hero-description">
            Build complex blockchain applications without programming. 
            Visual programming, AI automation, and transparent execution on VeChain.
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons">
            <Button 
              size="lg" 
              className="hero-primary-button"
            >
              Start Building
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="hero-secondary-button"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-700 dark:text-blue-400 mb-3">10x</div>
              <div className="text-base text-slate-600 dark:text-gray-400">Faster Development</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-700 dark:text-purple-400 mb-3">90%</div>
              <div className="text-base text-slate-600 dark:text-gray-400">Cost Savings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-700 dark:text-green-400 mb-3">0</div>
              <div className="text-base text-slate-600 dark:text-gray-400">Coding Required</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-bounce delay-300" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-bounce delay-700" />
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-emerald-500/10 rounded-full animate-bounce delay-1000" />
    </section>
  );
}
