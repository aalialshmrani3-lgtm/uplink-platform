"""
AraBERT Embeddings Service for UPLINK 5.0
Replaces title_length/description_length with semantic vector embeddings
"""

import numpy as np
from typing import List, Optional
import logging

# Try to import transformers (AraBERT)
try:
    from transformers import AutoTokenizer, AutoModel
    import torch
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    logging.warning("⚠️ transformers not installed. Install with: pip install transformers torch")

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ArabicEmbeddingsService:
    """
    Arabic text embeddings service using AraBERT
    Converts Arabic text to 768-dimensional semantic vectors
    """
    
    def __init__(self, model_name: str = "aubmindlab/bert-base-arabertv2"):
        """
        Initialize AraBERT model
        
        Args:
            model_name: HuggingFace model name (default: AraBERTv2)
        """
        self.model_name = model_name
        self.tokenizer = None
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        if TRANSFORMERS_AVAILABLE:
            self._load_model()
        else:
            logger.warning("⚠️ AraBERT not available - using fallback embeddings")
    
    def _load_model(self):
        """Load AraBERT model and tokenizer"""
        try:
            logger.info(f"📥 Loading AraBERT model: {self.model_name}")
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModel.from_pretrained(self.model_name)
            self.model.to(self.device)
            self.model.eval()
            logger.info(f"✅ AraBERT loaded successfully on {self.device}")
        except Exception as e:
            logger.error(f"❌ Failed to load AraBERT: {e}")
            self.tokenizer = None
            self.model = None
    
    def get_embedding(self, text: str) -> np.ndarray:
        """
        Get semantic embedding for Arabic text
        
        Args:
            text: Arabic text (title or description)
            
        Returns:
            768-dimensional embedding vector
        """
        if not TRANSFORMERS_AVAILABLE or self.model is None:
            # Fallback: return zero vector
            return np.zeros(768)
        
        try:
            # Tokenize
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                max_length=512,
                padding=True
            ).to(self.device)
            
            # Get embeddings
            with torch.no_grad():
                outputs = self.model(**inputs)
                # Use [CLS] token embedding (first token)
                embedding = outputs.last_hidden_state[:, 0, :].cpu().numpy()[0]
            
            return embedding
            
        except Exception as e:
            logger.error(f"❌ Error getting embedding: {e}")
            return np.zeros(768)
    
    def get_reduced_embedding(self, text: str, target_dim: int = 12) -> np.ndarray:
        """
        Get reduced-dimension embedding using PCA
        
        Args:
            text: Arabic text
            target_dim: Target dimension (default: 12 to match original features)
            
        Returns:
            Reduced embedding vector
        """
        full_embedding = self.get_embedding(text)
        
        # Simple dimension reduction: take first N dimensions
        # In production, use PCA trained on your data
        return full_embedding[:target_dim]
    
    def get_combined_embedding(self, title: str, description: str) -> np.ndarray:
        """
        Get combined embedding for title + description
        
        Args:
            title: Idea title
            description: Idea description
            
        Returns:
            Combined embedding (average of title and description embeddings)
        """
        title_emb = self.get_embedding(title)
        desc_emb = self.get_embedding(description)
        
        # Average pooling
        combined = (title_emb + desc_emb) / 2
        
        return combined
    
    def get_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate cosine similarity between two texts
        
        Args:
            text1: First text
            text2: Second text
            
        Returns:
            Cosine similarity score (0-1)
        """
        emb1 = self.get_embedding(text1)
        emb2 = self.get_embedding(text2)
        
        # Cosine similarity
        dot_product = np.dot(emb1, emb2)
        norm1 = np.linalg.norm(emb1)
        norm2 = np.linalg.norm(emb2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        similarity = dot_product / (norm1 * norm2)
        return float(similarity)

# Global instance
_embeddings_service = None

def get_embeddings_service() -> ArabicEmbeddingsService:
    """Get global embeddings service instance"""
    global _embeddings_service
    if _embeddings_service is None:
        _embeddings_service = ArabicEmbeddingsService()
    return _embeddings_service

def get_text_features(title: str, description: str, use_embeddings: bool = True) -> List[float]:
    """
    Extract text features from title and description
    
    Args:
        title: Idea title
        description: Idea description
        use_embeddings: If True, use AraBERT embeddings; otherwise use length
        
    Returns:
        List of 2 features (or 12 if using reduced embeddings)
    """
    if use_embeddings and TRANSFORMERS_AVAILABLE:
        # Use semantic embeddings (reduced to 2 dimensions for compatibility)
        service = get_embeddings_service()
        combined_emb = service.get_combined_embedding(title, description)
        
        # Reduce to 2 dimensions for now (to match original feature count)
        # In production, retrain model with full 768 or reduced dimensions
        return combined_emb[:2].tolist()
    else:
        # Fallback: use length (original behavior)
        return [len(title), len(description)]

if __name__ == "__main__":
    # Test embeddings service
    print("🧪 Testing Arabic Embeddings Service...")
    print()
    
    service = ArabicEmbeddingsService()
    
    # Test texts
    title1 = "منصة تعليمية تفاعلية للطلاب"
    title2 = "نظام إدارة المشاريع الذكي"
    desc1 = "منصة تعليمية حديثة تستخدم الذكاء الاصطناعي لتخصيص المحتوى التعليمي"
    
    print(f"Title 1: {title1}")
    print(f"Title 2: {title2}")
    print()
    
    # Get embeddings
    emb1 = service.get_embedding(title1)
    emb2 = service.get_embedding(title2)
    
    print(f"Embedding 1 shape: {emb1.shape}")
    print(f"Embedding 1 (first 5): {emb1[:5]}")
    print()
    
    # Calculate similarity
    similarity = service.get_similarity(title1, title2)
    print(f"Similarity: {similarity:.4f}")
    print()
    
    # Get reduced embedding
    reduced = service.get_reduced_embedding(title1, target_dim=12)
    print(f"Reduced embedding shape: {reduced.shape}")
    print(f"Reduced embedding: {reduced}")
    print()
    
    # Get text features
    features = get_text_features(title1, desc1, use_embeddings=True)
    print(f"Text features: {features}")
