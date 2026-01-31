"""
SHAP Explainability Service for UPLINK 5.0
Provides human-readable explanations for AI predictions
"""

import numpy as np
from typing import Dict, List, Tuple, Optional
import logging

# Try to import SHAP
try:
    import shap
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False
    logging.warning("⚠️ SHAP not installed. Install with: pip install shap")

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Feature names (10 traditional + 32 semantic)
FEATURE_NAMES = [
    # Traditional features (10)
    'budget', 'team_size', 'timeline_months', 'market_demand',
    'technical_feasibility', 'competitive_advantage', 'user_engagement',
    'tags_count', 'hypothesis_validation_rate', 'rat_completion_rate',
    # Semantic features (32)
] + [f'semantic_feature_{i+1}' for i in range(32)]

# Arabic feature names for display
FEATURE_NAMES_AR = {
    'budget': 'الميزانية',
    'team_size': 'حجم الفريق',
    'timeline_months': 'المدة الزمنية (أشهر)',
    'market_demand': 'الطلب في السوق',
    'technical_feasibility': 'الجدوى التقنية',
    'competitive_advantage': 'الميزة التنافسية',
    'user_engagement': 'تفاعل المستخدمين',
    'tags_count': 'عدد الوسوم',
    'hypothesis_validation_rate': 'معدل التحقق من الفرضيات',
    'rat_completion_rate': 'معدل إكمال RAT',
}

# Add semantic features to Arabic names
for i in range(32):
    FEATURE_NAMES_AR[f'semantic_feature_{i+1}'] = f'الميزة الدلالية {i+1}'

class SHAPExplainer:
    """
    SHAP-based explainability service for XGBoost predictions
    """
    
    def __init__(self, model, feature_names: Optional[List[str]] = None):
        """
        Initialize SHAP explainer
        
        Args:
            model: Trained XGBoost model
            feature_names: List of feature names (default: FEATURE_NAMES)
        """
        self.model = model
        self.feature_names = feature_names or FEATURE_NAMES
        self.explainer = None
        
        if SHAP_AVAILABLE:
            self._initialize_explainer()
        else:
            logger.warning("⚠️ SHAP not available - explanations will be limited")
    
    def _initialize_explainer(self):
        """Initialize SHAP TreeExplainer for XGBoost"""
        try:
            logger.info("📊 Initializing SHAP TreeExplainer...")
            self.explainer = shap.TreeExplainer(self.model)
            logger.info("✅ SHAP explainer initialized successfully")
        except Exception as e:
            logger.error(f"❌ Failed to initialize SHAP explainer: {e}")
            self.explainer = None
    
    def explain_prediction(
        self, 
        features: np.ndarray,
        language: str = "ar"
    ) -> Dict:
        """
        Generate explanation for a single prediction
        
        Args:
            features: Feature vector (42 dimensions)
            language: Language for explanation ("ar" or "en")
            
        Returns:
            Dictionary containing explanation details
        """
        if not SHAP_AVAILABLE or self.explainer is None:
            return self._fallback_explanation(features, language)
        
        try:
            # Get SHAP values
            shap_values = self.explainer.shap_values(features.reshape(1, -1))
            
            # Get base value (expected value)
            base_value = self.explainer.expected_value
            
            # Get prediction
            prediction = self.model.predict_proba(features.reshape(1, -1))[0][1]
            
            # Get top contributing features
            feature_contributions = []
            for i, (name, value, shap_val) in enumerate(zip(self.feature_names, features, shap_values[0])):
                feature_contributions.append({
                    'name': name,
                    'name_ar': FEATURE_NAMES_AR.get(name, name),
                    'value': float(value),
                    'shap_value': float(shap_val),
                    'impact': 'positive' if shap_val > 0 else 'negative',
                    'abs_impact': abs(float(shap_val))
                })
            
            # Sort by absolute impact
            feature_contributions.sort(key=lambda x: x['abs_impact'], reverse=True)
            
            # Get top 5 positive and negative contributors
            top_positive = [f for f in feature_contributions if f['impact'] == 'positive'][:5]
            top_negative = [f for f in feature_contributions if f['impact'] == 'negative'][:5]
            
            # Generate human-readable explanation
            explanation_text = self._generate_explanation_text(
                prediction, 
                top_positive, 
                top_negative,
                language
            )
            
            return {
                'prediction': float(prediction),
                'base_value': float(base_value),
                'explanation_text': explanation_text,
                'top_positive_factors': top_positive,
                'top_negative_factors': top_negative,
                'all_contributions': feature_contributions,
                'shap_available': True
            }
        
        except Exception as e:
            logger.error(f"❌ Error generating SHAP explanation: {e}")
            return self._fallback_explanation(features, language)
    
    def _generate_explanation_text(
        self,
        prediction: float,
        top_positive: List[Dict],
        top_negative: List[Dict],
        language: str
    ) -> str:
        """
        Generate human-readable explanation text
        
        Args:
            prediction: Prediction probability
            top_positive: Top positive contributing features
            top_negative: Top negative contributing features
            language: Language for explanation
            
        Returns:
            Human-readable explanation text
        """
        if language == "ar":
            return self._generate_arabic_explanation(prediction, top_positive, top_negative)
        else:
            return self._generate_english_explanation(prediction, top_positive, top_negative)
    
    def _generate_arabic_explanation(
        self,
        prediction: float,
        top_positive: List[Dict],
        top_negative: List[Dict]
    ) -> str:
        """Generate Arabic explanation"""
        
        # Prediction interpretation
        if prediction >= 0.7:
            pred_text = f"نموذج AraBERT يتوقع احتمالية نجاح عالية ({prediction:.1%}) لهذه الفكرة."
        elif prediction >= 0.5:
            pred_text = f"نموذج AraBERT يتوقع احتمالية نجاح متوسطة ({prediction:.1%}) لهذه الفكرة."
        else:
            pred_text = f"نموذج AraBERT يتوقع احتمالية نجاح منخفضة ({prediction:.1%}) لهذه الفكرة."
        
        explanation_parts = [pred_text, "\n"]
        
        # Positive factors
        if top_positive:
            explanation_parts.append("\n**العوامل الإيجابية:**")
            for i, factor in enumerate(top_positive[:3], 1):
                name_ar = factor['name_ar']
                value = factor['value']
                impact = factor['abs_impact']
                
                # Interpret the factor
                if 'semantic' in factor['name']:
                    explanation_parts.append(
                        f"{i}. تحليل المحتوى النصي يظهر تشابهاً مع مشاريع ناجحة سابقة (تأثير: +{impact:.2f})"
                    )
                else:
                    explanation_parts.append(
                        f"{i}. {name_ar}: {value:.1f} (تأثير إيجابي: +{impact:.2f})"
                    )
        
        # Negative factors
        if top_negative:
            explanation_parts.append("\n**العوامل السلبية:**")
            for i, factor in enumerate(top_negative[:3], 1):
                name_ar = factor['name_ar']
                value = factor['value']
                impact = factor['abs_impact']
                
                # Interpret the factor
                if 'semantic' in factor['name']:
                    explanation_parts.append(
                        f"{i}. تحليل المحتوى النصي يظهر تشابهاً مع مشاريع فاشلة سابقة (تأثير: -{impact:.2f})"
                    )
                else:
                    explanation_parts.append(
                        f"{i}. {name_ar}: {value:.1f} (تأثير سلبي: -{impact:.2f})"
                    )
        
        # Recommendations
        explanation_parts.append("\n**التوصيات:**")
        if prediction < 0.5:
            explanation_parts.append("- يُنصح بتحسين العوامل السلبية المذكورة أعلاه")
            explanation_parts.append("- مراجعة المحتوى النصي وتحسين وصف الفكرة")
            explanation_parts.append("- التركيز على تعزيز الجدوى التقنية والميزة التنافسية")
        else:
            explanation_parts.append("- الاستمرار في تعزيز العوامل الإيجابية")
            explanation_parts.append("- معالجة العوامل السلبية لزيادة احتمالية النجاح")
        
        return "\n".join(explanation_parts)
    
    def _generate_english_explanation(
        self,
        prediction: float,
        top_positive: List[Dict],
        top_negative: List[Dict]
    ) -> str:
        """Generate English explanation"""
        
        # Prediction interpretation
        if prediction >= 0.7:
            pred_text = f"AraBERT model predicts a high success probability ({prediction:.1%}) for this idea."
        elif prediction >= 0.5:
            pred_text = f"AraBERT model predicts a moderate success probability ({prediction:.1%}) for this idea."
        else:
            pred_text = f"AraBERT model predicts a low success probability ({prediction:.1%}) for this idea."
        
        explanation_parts = [pred_text, "\n"]
        
        # Positive factors
        if top_positive:
            explanation_parts.append("\n**Positive Factors:**")
            for i, factor in enumerate(top_positive[:3], 1):
                name = factor['name']
                value = factor['value']
                impact = factor['abs_impact']
                
                if 'semantic' in factor['name']:
                    explanation_parts.append(
                        f"{i}. Text analysis shows similarity with previously successful projects (impact: +{impact:.2f})"
                    )
                else:
                    explanation_parts.append(
                        f"{i}. {name}: {value:.1f} (positive impact: +{impact:.2f})"
                    )
        
        # Negative factors
        if top_negative:
            explanation_parts.append("\n**Negative Factors:**")
            for i, factor in enumerate(top_negative[:3], 1):
                name = factor['name']
                value = factor['value']
                impact = factor['abs_impact']
                
                if 'semantic' in factor['name']:
                    explanation_parts.append(
                        f"{i}. Text analysis shows similarity with previously failed projects (impact: -{impact:.2f})"
                    )
                else:
                    explanation_parts.append(
                        f"{i}. {name}: {value:.1f} (negative impact: -{impact:.2f})"
                    )
        
        # Recommendations
        explanation_parts.append("\n**Recommendations:**")
        if prediction < 0.5:
            explanation_parts.append("- Improve the negative factors mentioned above")
            explanation_parts.append("- Review and enhance the idea description")
            explanation_parts.append("- Focus on strengthening technical feasibility and competitive advantage")
        else:
            explanation_parts.append("- Continue strengthening positive factors")
            explanation_parts.append("- Address negative factors to increase success probability")
        
        return "\n".join(explanation_parts)
    
    def _fallback_explanation(self, features: np.ndarray, language: str) -> Dict:
        """
        Fallback explanation when SHAP is not available
        
        Args:
            features: Feature vector
            language: Language for explanation
            
        Returns:
            Basic explanation dictionary
        """
        # Get prediction
        prediction = self.model.predict_proba(features.reshape(1, -1))[0][1]
        
        # Simple feature importance from model
        try:
            feature_importance = self.model.feature_importances_
            
            # Get top features
            top_indices = np.argsort(feature_importance)[-5:][::-1]
            top_features = []
            
            for idx in top_indices:
                name = self.feature_names[idx]
                top_features.append({
                    'name': name,
                    'name_ar': FEATURE_NAMES_AR.get(name, name),
                    'value': float(features[idx]),
                    'importance': float(feature_importance[idx])
                })
            
            if language == "ar":
                explanation_text = f"احتمالية النجاح: {prediction:.1%}\n\nأهم العوامل المؤثرة:\n"
                for i, f in enumerate(top_features, 1):
                    explanation_text += f"{i}. {f['name_ar']}: {f['value']:.1f}\n"
            else:
                explanation_text = f"Success probability: {prediction:.1%}\n\nTop influencing factors:\n"
                for i, f in enumerate(top_features, 1):
                    explanation_text += f"{i}. {f['name']}: {f['value']:.1f}\n"
            
            return {
                'prediction': float(prediction),
                'explanation_text': explanation_text,
                'top_features': top_features,
                'shap_available': False
            }
        
        except Exception as e:
            logger.error(f"❌ Error in fallback explanation: {e}")
            
            if language == "ar":
                explanation_text = f"احتمالية النجاح: {prediction:.1%}\n\n(تفاصيل التفسير غير متوفرة)"
            else:
                explanation_text = f"Success probability: {prediction:.1%}\n\n(Detailed explanation not available)"
            
            return {
                'prediction': float(prediction),
                'explanation_text': explanation_text,
                'shap_available': False
            }

# ============================================================================
# Helper Functions
# ============================================================================

def create_explainer(model, feature_names: Optional[List[str]] = None) -> SHAPExplainer:
    """
    Create SHAP explainer instance
    
    Args:
        model: Trained XGBoost model
        feature_names: List of feature names
        
    Returns:
        SHAPExplainer instance
    """
    return SHAPExplainer(model, feature_names)

# ============================================================================
# Example Usage
# ============================================================================

if __name__ == "__main__":
    import pickle
    from pathlib import Path
    
    # Load model
    model_path = Path(__file__).parent / "success_model.pkl"
    
    if model_path.exists():
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        
        # Create explainer
        explainer = create_explainer(model)
        
        # Example features (42 dimensions: 10 traditional + 32 semantic)
        example_features = np.array([
            # Traditional features
            50000,  # budget
            5,      # team_size
            12,     # timeline_months
            8,      # market_demand
            7,      # technical_feasibility
            6,      # competitive_advantage
            8,      # user_engagement
            10,     # tags_count
            0.8,    # hypothesis_validation_rate
            0.9,    # rat_completion_rate
            # Semantic features (32 random values for demo)
        ] + list(np.random.randn(32)))
        
        # Get explanation
        explanation = explainer.explain_prediction(example_features, language="ar")
        
        print("=" * 80)
        print("SHAP Explanation Example")
        print("=" * 80)
        print(f"\nPrediction: {explanation['prediction']:.1%}")
        print(f"\n{explanation['explanation_text']}")
        
        if explanation.get('top_positive_factors'):
            print("\nTop Positive Factors:")
            for f in explanation['top_positive_factors'][:3]:
                print(f"  - {f['name_ar']}: {f['value']:.2f} (impact: +{f['abs_impact']:.3f})")
        
        if explanation.get('top_negative_factors'):
            print("\nTop Negative Factors:")
            for f in explanation['top_negative_factors'][:3]:
                print(f"  - {f['name_ar']}: {f['value']:.2f} (impact: -{f['abs_impact']:.3f})")
    
    else:
        print(f"❌ Model not found at {model_path}")
        print("   Run retrain_model.py first to train a model")
