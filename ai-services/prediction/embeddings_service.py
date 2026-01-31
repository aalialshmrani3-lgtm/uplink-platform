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
    Then reduces to 32 dimensions using PCA for efficient training
    """
    
    def __init__(self, model_name: str = "aubmindlab/bert-base-arabertv2", embedding_dim: int = 32):
        """
        Initialize AraBERT model
        
        Args:
            model_name: HuggingFace model name (default: AraBERTv2)
            embedding_dim: Target embedding dimension (default: 32)
        """
        self.model_name = model_name
        self.embedding_dim = embedding_dim
        self.tokenizer = None
        self.model = None
        self.pca = None
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
    
    def get_reduced_embedding(self, text: str, target_dim: Optional[int] = None) -> np.ndarray:
        """
        Get reduced-dimension embedding using PCA
        
        Args:
            text: Arabic text
            target_dim: Target dimension (default: self.embedding_dim = 32)
            
        Returns:
            Reduced embedding vector (32 dimensions by default)
        """
        if target_dim is None:
            target_dim = self.embedding_dim
        
        full_embedding = self.get_embedding(text)
        
        if self.pca is not None:
            # Use trained PCA
            return self.pca.transform(full_embedding.reshape(1, -1))[0]
        else:
            # Fallback: take first N dimensions
            # This is a simple projection, not optimal but works
            return full_embedding[:target_dim]
    
    def get_combined_embedding(self, title: str, description: str, reduced: bool = True) -> np.ndarray:
        """
        Get combined embedding for title + description
        
        Args:
            title: Idea title
            description: Idea description
            reduced: Whether to return reduced dimensions (default: True)
            
        Returns:
            Combined embedding (32 dimensions if reduced=True, 768 if False)
        """
        if reduced:
            # Get reduced embeddings directly
            title_emb = self.get_reduced_embedding(title)
            desc_emb = self.get_reduced_embedding(description)
        else:
            # Get full embeddings
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
    
    def train_pca(self, embeddings: np.ndarray):
        """
        Train PCA for dimension reduction
        
        Args:
            embeddings: Array of shape (n_samples, 768)
        """
        try:
            from sklearn.decomposition import PCA
            
            logger.info(f"Training PCA for dimension reduction: 768 → {self.embedding_dim}")
            self.pca = PCA(n_components=self.embedding_dim)
            self.pca.fit(embeddings)
            
            explained_variance = sum(self.pca.explained_variance_ratio_)
            logger.info(f"✅ PCA trained. Explained variance: {explained_variance:.2%}")
            
        except ImportError:
            logger.warning("⚠️ scikit-learn not installed. PCA not available.")
        except Exception as e:
            logger.error(f"❌ Failed to train PCA: {e}")

# Global instance
_embeddings_service = None

def get_embeddings_service(embedding_dim: int = 32) -> ArabicEmbeddingsService:
    """Get or create global embeddings service instance"""
    global _embeddings_service
    if _embeddings_service is None:
        _embeddings_service = ArabicEmbeddingsService(embedding_dim=embedding_dim)
    return _embeddings_service

def get_text_features(title: str, description: str, use_embeddings: bool = True, embedding_dim: int = 32) -> List[float]:
    """
    Get text features for ML model
    
    Args:
        title: Idea title
        description: Idea description
        use_embeddings: Use AraBERT embeddings if True, else use text length
        embedding_dim: Embedding dimension (default: 32)
        
    Returns:
        32-dimensional feature vector (or 2 if fallback)
    """
    if use_embeddings and TRANSFORMERS_AVAILABLE:
        # Use AraBERT semantic embeddings (32 dimensions)
        service = get_embeddings_service(embedding_dim=embedding_dim)
        combined_emb = service.get_combined_embedding(title, description, reduced=True)
        
        # Return all 32 dimensions
        return combined_emb.tolist()
    else:
        # Fallback: use text length (original behavior)
        # Pad with zeros to match embedding_dim
        features = [float(len(title)), float(len(description))]
        features.extend([0.0] * (embedding_dim - 2))  # Pad with zeros
        return features

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
