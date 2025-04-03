
import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';

interface ResultsSectionProps {
  isAnalyzing: boolean;
  hasResult: boolean;
  hasPneumonia: boolean | null;
  confidence: number | null;
  pdfGenerator: React.ReactNode; // Changed from onDownloadPdf to pdfGenerator
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  isAnalyzing,
  hasResult,
  hasPneumonia,
  confidence,
  pdfGenerator
}) => {
  if (!hasResult && !isAnalyzing) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto animate-slide-up-fade">
      <div className="mediscan-card overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Diagnostic Results</h3>
          
          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-16 h-16 border-4 border-mediscan-200 border-t-mediscan-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Analyzing your X-ray...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          )}

          {hasResult && hasPneumonia !== null && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${
                  hasPneumonia 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-green-100 text-green-600'
                }`}>
                  {hasPneumonia 
                    ? <AlertTriangle className="w-6 h-6" /> 
                    : <Check className="w-6 h-6" />
                  }
                </div>
                <div>
                  <h4 className="text-lg font-medium">
                    {hasPneumonia 
                      ? 'Pneumonia Detected' 
                      : 'No Pneumonia Detected'
                    }
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {hasPneumonia 
                      ? 'Signs of pneumonia were detected in this X-ray.' 
                      : 'No signs of pneumonia were detected in this X-ray.'
                    }
                  </p>
                </div>
              </div>

              {confidence !== null && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Confidence Score</span>
                    <span className="text-sm font-medium text-gray-700">{Math.round(confidence * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${hasPneumonia ? 'bg-red-500' : 'bg-green-500'}`} 
                      style={{ width: `${Math.round(confidence * 100)}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {hasPneumonia 
                      ? `Our model is ${Math.round(confidence * 100)}% confident in detecting pneumonia.` 
                      : `Our model is ${Math.round(confidence * 100)}% confident that no pneumonia is present.`
                    }
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Disclaimer:</strong> This is an AI-assisted diagnostic tool and should not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.
                </p>
                {pdfGenerator}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
