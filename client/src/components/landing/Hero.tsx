'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge 
            variant="secondary" 
            className="mb-6 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 border-blue-200 dark:border-blue-800"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            World's First AI-Powered Visual Blockchain Programming Platform
          </Badge>

          {/* Main heading */}
          <h1 className="hero-title mb-8 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
            VeFlow
          </h1>
          
          <h2 className="hero-subtitle text-gray-600 dark:text-gray-300 mb-8">
            Revolutionary Scenario Builder for VeChain Ecosystem
          </h2>
          
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-16 mx-auto leading-relaxed">
            Build complex blockchain applications without programming. 
            Visual programming, AI automation, and transparent execution on VeChain.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Building
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10x</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Faster Development</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">90%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Cost Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">0</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Coding Required</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/10 rounded-full animate-bounce delay-300" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-400/10 rounded-full animate-bounce delay-700" />
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-400/10 rounded-full animate-bounce delay-1000" />
    </section>
  );
}
