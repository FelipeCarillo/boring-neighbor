from abc import ABC, abstractmethod
import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim
from io import BytesIO
from PIL import Image


class DeviationCalculatorInterface(ABC):
    """
    Interface for deviation calculation algorithms.
    Allows for future implementation of different algorithms.
    """
    
    @abstractmethod
    def calculate(self, bim_image: bytes, progress_image: bytes) -> float:
        """
        Calculate deviation score between BIM reference and progress photo.
        Returns score from 0-100 (100 = identical).
        """
        pass


class SSIMDeviationCalculator(DeviationCalculatorInterface):
    """
    SSIM (Structural Similarity Index) based deviation calculator.
    Compares structural similarity between BIM and progress images.
    """
    
    def calculate(self, bim_image: bytes, progress_image: bytes) -> float:
        """
        Calculate deviation score using SSIM algorithm.
        Includes preprocessing: grayscale, resize, histogram equalization.
        """
        bim_img = self._load_image(bim_image)
        progress_img = self._load_image(progress_image)
        
        bim_processed = self._preprocess_image(bim_img)
        progress_processed = self._preprocess_image(progress_img)
        
        height, width = bim_processed.shape
        progress_resized = cv2.resize(progress_processed, (width, height))
        
        ssim_score = ssim(bim_processed, progress_resized)
        
        deviation_score = max(0.0, min(100.0, ssim_score * 100))
        
        return float(deviation_score)
    
    def _load_image(self, image_bytes: bytes) -> np.ndarray:
        """
        Load image from bytes.
        """
        image = Image.open(BytesIO(image_bytes))
        return np.array(image)
    
    def _preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """
        Preprocess image for comparison.
        """
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        else:
            gray = image
        
        normalized = cv2.equalizeHist(gray)
        
        return normalized


class DeviationService:
    """
    Service for calculating deviation between BIM references and progress photos.
    """
    
    def __init__(self, calculator: DeviationCalculatorInterface = None):
        self.calculator = calculator or SSIMDeviationCalculator()
    
    def calculate_deviation(
        self,
        bim_image: bytes,
        progress_image: bytes,
    ) -> float:
        """
        Calculate deviation score between BIM and progress images.
        """
        return self.calculator.calculate(bim_image, progress_image)
    
    def calculate_best_match(
        self,
        bim_images: list[bytes],
        progress_image: bytes,
    ) -> tuple[float, int]:
        """
        Compare progress image with multiple BIM references.
        Returns best score and index of best matching BIM image.
        """
        if not bim_images:
            return 0.0, -1
        
        best_score = 0.0
        best_index = 0
        
        for i, bim_image in enumerate(bim_images):
            score = self.calculate_deviation(bim_image, progress_image)
            if score > best_score:
                best_score = score
                best_index = i
        
        return best_score, best_index


deviation_service = DeviationService()


