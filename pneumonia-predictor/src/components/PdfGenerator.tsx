
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PatientInfoForm from './PatientInfoForm';
import { format } from 'date-fns';

interface PdfGeneratorProps {
  imageUrl: string | null;
  hasPneumonia: boolean | null;
  confidence: number | null;
  date: Date;
}

interface PatientInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  additionalNotes?: string;
  physicianName: string;
}

const PdfGenerator: React.FC<PdfGeneratorProps> = ({ 
  imageUrl, 
  hasPneumonia, 
  confidence,
  date 
}) => {
  const [showForm, setShowForm] = useState(false);

  // Function to generate and print PDF
  const generatePdf = (patientData: PatientInfo) => {
    // Open a new window with our custom HTML content
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Format dates
    const formattedServiceDate = format(date, 'MM/dd/yyyy');
    const formattedDOB = format(patientData.dateOfBirth, 'MM/dd/yyyy');

    // Determine diagnosis text based on AI result
    const diagnosisText = hasPneumonia 
      ? 'Pneumonia detected with high probability. Further clinical correlation recommended.'
      : 'No pneumonia detected. Normal lung findings on x-ray analysis.';

    // Create the HTML content for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Doctor Diagnosis Form</title>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            text-align: center;
            color: #333;
            font-size: 28px;
            margin-bottom: 30px;
            font-weight: normal;
          }
          .form-row {
            display: flex;
            margin-bottom: 20px;
          }
          .form-group {
            margin-bottom: 20px;
          }
          .form-group label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .form-control {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f0f7ff;
          }
          .form-control-textarea {
            min-height: 100px;
          }
          .col-50 {
            flex: 0 0 48%;
          }
          .space-between {
            justify-content: space-between;
          }
          .signature-box {
            border: 1px solid #ccc;
            padding: 20px;
            margin-top: 10px;
            min-height: 60px;
            border-radius: 4px;
            background-color: #f0f7ff;
            text-align: center;
            position: relative;
          }
          .signature-line {
            position: absolute;
            bottom: 10px;
            left: 10px;
            right: 10px;
            border-bottom: 1px solid #999;
          }
          .signature-text {
            position: absolute;
            bottom: 15px;
            left: 0;
            right: 0;
            text-align: center;
            font-style: italic;
          }
          .x-ray-image {
            max-width: 100%;
            max-height: 300px;
            display: block;
            margin: 20px auto;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          .confidence-bar {
            height: 20px;
            background-color: ${hasPneumonia ? '#DC2626' : '#16A34A'};
            border-radius: 4px;
            width: ${confidence ? Math.round(confidence * 100) : 0}%;
            margin-top: 5px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>Doctor Diagnosis Form</h1>
        
        <div class="form-row space-between">
          <div class="form-group col-50">
            <label>Patient's Name</label>
            <div class="form-control">${patientData.firstName} ${patientData.lastName}</div>
          </div>
          <div class="form-group col-50">
            <label>Gender</label>
            <div class="form-control">${patientData.gender}</div>
          </div>
        </div>
        
        <div class="form-row space-between">
          <div class="form-group col-50">
            <label>Patient's Date of Birth</label>
            <div class="form-control">${formattedDOB}</div>
          </div>
          <div class="form-group col-50">
            <label>Date of Service</label>
            <div class="form-control">${formattedServiceDate}</div>
          </div>
        </div>
        
        <div class="form-group">
          <label>Diagnosis</label>
          <div class="form-control">${diagnosisText}</div>
        </div>
        
        <div class="form-group">
          <label>X-Ray Analysis</label>
          ${imageUrl ? `<img src="${imageUrl}" alt="Chest X-ray" class="x-ray-image" />` : ''}
          <div>
            <strong>AI Detection Result:</strong> ${hasPneumonia ? 'Pneumonia detected' : 'No pneumonia detected'}
          </div>
          <div>
            <strong>Confidence:</strong> ${confidence ? Math.round(confidence * 100) : 0}%
          </div>
          <div class="confidence-bar"></div>
        </div>
        
        <div class="form-group">
          <label>Additional Notes</label>
          <div class="form-control form-control-textarea">${patientData.additionalNotes || ''}</div>
        </div>
        
        <div class="form-group">
          <label>Performing Physician Signature</label>
          <div class="signature-box">
            <div class="signature-text">${patientData.physicianName}</div>
            <div class="signature-line"></div>
          </div>
        </div>
        
        <div class="footer">
          <p>This is an AI-assisted diagnostic report. Please consult with a healthcare professional for final diagnosis.</p>
          <p>MediScan Pro &copy; ${new Date().getFullYear()}</p>
        </div>
      </body>
      </html>
    `;

    // Write the HTML to the new window
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for images to load before printing
    printWindow.onload = function() {
      printWindow.focus(); // Focus on the new window
      printWindow.print(); // Open the print dialog
    };
  };

  const handleFormSubmit = (data: PatientInfo) => {
    setShowForm(false);
    generatePdf(data);
  };

  return (
    <>
      <Button 
        onClick={() => setShowForm(true)}
        className="inline-flex items-center justify-center gap-2"
      >
        <FileText className="h-4 w-4" />
        <span>Generate Diagnostic PDF</span>
      </Button>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg pointer-events-auto">
          <DialogHeader>
            <DialogTitle>Patient Information</DialogTitle>
            <DialogDescription>
              Enter the patient information to generate a diagnostic report.
            </DialogDescription>
          </DialogHeader>
          <PatientInfoForm onSubmit={handleFormSubmit} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PdfGenerator;
