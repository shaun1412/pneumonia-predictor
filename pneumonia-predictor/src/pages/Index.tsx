import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import HeroSection from '@/components/HeroSection';
import UploadSection from '@/components/UploadSection';
import ResultsSection from '@/components/ResultsSection';
import PdfGenerator from '@/components/PdfGenerator';
import { analyzePneumonia, PneumoniaResult } from '@/lib/ml-utils';

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PneumoniaResult | null>(null);
  const [analysisDate, setAnalysisDate] = useState<Date>(new Date());

  const handleImageUpload = useCallback(async (file: File, imageUrl: string) => {
    setFile(file);
    setImageUrl(imageUrl);
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const result = await analyzePneumonia(file);
      setResult(result);
      setAnalysisDate(new Date());
      toast.success('Analysis complete', {
        description: result.hasPneumonia ? 'Pneumonia detected' : 'No pneumonia detected',
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Error analyzing image', {
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleDownloadPdf = useCallback(() => {
    // This function is now deprecated since we're using the PdfGenerator component
    // It can be removed if it's not referenced elsewhere
  }, [imageUrl, result, analysisDate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        
        <div className="mt-6 mb-16">
          <UploadSection onImageUpload={handleImageUpload} />
          
          {(isAnalyzing || result) && (
            <div className="mt-12">
              <ResultsSection
                isAnalyzing={isAnalyzing}
                hasResult={!!result}
                hasPneumonia={result?.hasPneumonia ?? null}
                confidence={result?.confidence ?? null}
                pdfGenerator={
                  result && imageUrl ? (
                    <PdfGenerator
                      imageUrl={imageUrl}
                      hasPneumonia={result.hasPneumonia}
                      confidence={result.confidence}
                      date={analysisDate}
                    />
                  ) : null
                }
              />
            </div>
          )}
        </div>
        
        <footer className="text-center text-gray-500 text-sm mt-20">
          <p className="mb-1">© {new Date().getFullYear()} MediScan Pro - AI-powered Pneumonia Detection</p>
          <p>Disclaimer: This tool is for educational purposes only and should not replace professional medical advice.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
