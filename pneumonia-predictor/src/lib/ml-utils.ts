
// Import TensorFlow.js and model loader
import * as tf from '@tensorflow/tfjs';

export interface PneumoniaResult {
  hasPneumonia: boolean;
  confidence: number;
}

// Variable to store loaded model
let model: tf.LayersModel | null = null;

// Function to load the model
const loadModel = async (): Promise<tf.LayersModel> => {
  if (model) return model;
  
  try {
    // Load model from the public directory
    model = await tf.loadLayersModel('/best_model.keras');
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw new Error('Failed to load pneumonia detection model');
  }
};

// Function to preprocess image for the model
const preprocessImage = async (imageFile: File): Promise<tf.Tensor> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Create a canvas element to resize and normalize the image
        const canvas = document.createElement('canvas');
        canvas.width = 224; // Resize to model input dimensions
        canvas.height = 224;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw and resize image to canvas
        ctx.drawImage(img, 0, 0, 224, 224);
        
        // Get image data as RGBA values
        const imageData = ctx.getImageData(0, 0, 224, 224);
        
        // Convert image data to tensor and normalize
        let tensor = tf.browser.fromPixels(imageData, 3); // RGB channels
        tensor = tensor.expandDims(0); // Add batch dimension
        tensor = tensor.toFloat().div(tf.scalar(255)); // Normalize to 0-1
        
        resolve(tensor);
      } catch (err) {
        reject(err);
      }
    };
    
    img.onerror = (err) => reject(err);
    img.src = URL.createObjectURL(imageFile);
  });
};

// Main function to analyze pneumonia from X-ray image
export const analyzePneumonia = async (imageFile: File): Promise<PneumoniaResult> => {
  try {
    // Load the model if not already loaded
    const loadedModel = await loadModel();
    
    // Preprocess the image for prediction
    const tensor = await preprocessImage(imageFile);
    
    // Run inference
    const predictions = await loadedModel.predict(tensor) as tf.Tensor;
    
    // Get prediction results
    const result = await predictions.data();
    
    // Clean up tensors to avoid memory leaks
    tensor.dispose();
    predictions.dispose();
    
    // Get the confidence score (assuming binary classification with sigmoid activation)
    const confidenceScore = result[0];
    
    // Determine if pneumonia is detected (threshold at 0.5)
    const hasPneumonia = confidenceScore >= 0.5;
    
    return {
      hasPneumonia,
      confidence: hasPneumonia ? confidenceScore : 1 - confidenceScore
    };
  } catch (error) {
    console.error('Error during pneumonia analysis:', error);
    throw new Error('Failed to analyze image for pneumonia detection');
  }
};
