import React from 'react';
import Image from 'next/image';

export default function DaisyUICover() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="max-w-[1000px] w-full space-y-24">
        {/* Top Section with Logo and Version */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            {/* Logo Symbol */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-[0.5px] border-gray-300">
                <div className="absolute inset-2 bg-teal-400 rounded-full" />
                <div className="absolute right-1 top-1 w-3 h-3 bg-orange-400 rounded-full" />
              </div>
            </div>
            {/* Logo Text */}
            <span className="text-2xl font-semibold text-gray-900">daisyUI</span>
          </div>
          
          {/* Version Badge */}
          <div className="bg-gray-100 px-8 py-2 rounded-full">
            <span className="font-mono text-gray-900 text-lg">4.6.0</span>
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-6">
          <h1 className="text-[96px] font-bold leading-tight">
            The most popular
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              component library
            </span>
            <br />
            for Tailwind CSS
          </h1>
        </div>

        {/* Author Badge */}
        <div className="inline-block">
          <div className="bg-yellow-500 px-12 py-4 rounded-full">
            <span className="font-mono text-yellow-900 text-3xl">By: @bvlad</span>
          </div>
        </div>
      </div>

      {/* Features Preview Image - Right Side */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1/3">
        <Image
          src="/design-preview.png"
          alt="DaisyUI Features"
          width={500}
          height={700}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}