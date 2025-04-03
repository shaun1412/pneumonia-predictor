
import React from 'react';
import { Stethoscope } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="inline-block rounded-full bg-mediscan-100 p-3 animate-fade-in">
            <Stethoscope className="h-10 w-10 text-mediscan-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="text-mediscan-600">MediScan</span>{" "}
            <span className="text-black">Pro</span>
          </h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl">
            Advanced pneumonia detection through machine learning. Upload your chest X-ray and get instant results.
          </p>
          <div className="w-full max-w-sm space-y-2">
            <div className="flex justify-center">
              <span className="inline-flex h-6 items-center rounded-full bg-mediscan-100 px-3 text-xs font-medium text-mediscan-800">
                HIPAA compliant
              </span>
              <span className="mx-2 inline-flex h-6 items-center rounded-full bg-mediscan-100 px-3 text-xs font-medium text-mediscan-800">
                AI-powered
              </span>
              <span className="inline-flex h-6 items-center rounded-full bg-mediscan-100 px-3 text-xs font-medium text-mediscan-800">
                Instant results
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
