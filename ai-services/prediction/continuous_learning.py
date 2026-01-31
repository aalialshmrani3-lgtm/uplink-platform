"""
Continuous Learning Loop for UPLINK 5.0
Learns from recommendation outcomes to improve model accuracy
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import pickle

@dataclass
class FeedbackRecord:
    """سجل ملاحظات المستخدم"""
    project_id: str
    recommendation_id: str
    recommendation_type: str  # 'ceo_insight', 'roadmap_step', 'investment_strategy'
    recommendation_text: str
    
    # الإجراء المتخذ
    action_taken: str  # 'implemented', 'partially_implemented', 'rejected', 'deferred'
    implementation_date: Optional[str]
    
    # النتيجة
    outcome: str  # 'success', 'failure', 'mixed', 'pending'
    outcome_details: str
    impact_score: float  # -1.0 to 1.0
    
    # البيانات الأصلية
    original_features: Dict[str, Any]
    original_prediction: Dict[str, Any]
    
    # البيانات بعد التنفيذ
    actual_features: Optional[Dict[str, Any]]
    actual_outcome: Optional[str]
    
    # معلومات إضافية
    created_at: str
    updated_at: str
    notes: str

class ContinuousLearningLoop:
    """
    نظام التعلم المستمر
    
    يتعلم من:
    1. نتائج التوصيات (هل نجحت أم فشلت؟)
    2. دقة التنبؤات (مقارنة التنبؤ بالنتيجة الفعلية)
    3. فعالية الاستراتيجيات المختلفة
    """
    
    def __init__(self, storage_dir: str = "./learning_data"):
        self.storage_dir = storage_dir
        os.makedirs(storage_dir, exist_ok=True)
        
        self.feedback_file = os.path.join(storage_dir, "feedback_records.json")
        self.metrics_file = os.path.join(storage_dir, "learning_metrics.json")
        self.model_updates_file = os.path.join(storage_dir, "model_updates.json")
        
        self.feedback_records: List[FeedbackRecord] = []
        self.learning_metrics: Dict[str, Any] = {}
        
        self._load_data()
    
    def record_feedback(
        self,
        project_id: str,
        recommendation_id: str,
        recommendation_type: str,
        recommendation_text: str,
        action_taken: str,
        outcome: str,
        outcome_details: str,
        impact_score: float,
        original_features: Dict[str, Any],
        original_prediction: Dict[str, Any],
        actual_features: Optional[Dict[str, Any]] = None,
        actual_outcome: Optional[str] = None,
        notes: str = ""
    ) -> FeedbackRecord:
        """
        تسجيل ملاحظات المستخدم على توصية معينة
        """
        now = datetime.now().isoformat()
        
        record = FeedbackRecord(
            project_id=project_id,
            recommendation_id=recommendation_id,
            recommendation_type=recommendation_type,
            recommendation_text=recommendation_text,
            action_taken=action_taken,
            implementation_date=now if action_taken == 'implemented' else None,
            outcome=outcome,
            outcome_details=outcome_details,
            impact_score=impact_score,
            original_features=original_features,
            original_prediction=original_prediction,
            actual_features=actual_features,
            actual_outcome=actual_outcome,
            created_at=now,
            updated_at=now,
            notes=notes
        )
        
        self.feedback_records.append(record)
        self._save_feedback()
        self._update_metrics()
        
        return record
    
    def analyze_recommendation_effectiveness(
        self,
        recommendation_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        تحليل فعالية التوصيات
        """
        records = self.feedback_records
        
        if recommendation_type:
            records = [r for r in records if r.recommendation_type == recommendation_type]
        
        if not records:
            return {
                'total_recommendations': 0,
                'message': 'لا توجد بيانات كافية'
            }
        
        # حساب معدلات التنفيذ
        implementation_rates = {
            'implemented': len([r for r in records if r.action_taken == 'implemented']),
            'partially_implemented': len([r for r in records if r.action_taken == 'partially_implemented']),
            'rejected': len([r for r in records if r.action_taken == 'rejected']),
            'deferred': len([r for r in records if r.action_taken == 'deferred'])
        }
        
        # حساب معدلات النجاح
        implemented_records = [r for r in records if r.action_taken in ['implemented', 'partially_implemented']]
        success_rates = {
            'success': len([r for r in implemented_records if r.outcome == 'success']),
            'failure': len([r for r in implemented_records if r.outcome == 'failure']),
            'mixed': len([r for r in implemented_records if r.outcome == 'mixed']),
            'pending': len([r for r in implemented_records if r.outcome == 'pending'])
        }
        
        # متوسط التأثير
        avg_impact = sum(r.impact_score for r in implemented_records) / len(implemented_records) if implemented_records else 0
        
        return {
            'total_recommendations': len(records),
            'implementation_rates': implementation_rates,
            'implementation_percentage': (implementation_rates['implemented'] + implementation_rates['partially_implemented']) / len(records) * 100,
            'success_rates': success_rates,
            'success_percentage': success_rates['success'] / len(implemented_records) * 100 if implemented_records else 0,
            'average_impact_score': round(avg_impact, 3),
            'recommendation_type': recommendation_type or 'all'
        }
    
    def analyze_prediction_accuracy(self) -> Dict[str, Any]:
        """
        تحليل دقة التنبؤات
        """
        records_with_actual = [r for r in self.feedback_records if r.actual_outcome is not None]
        
        if not records_with_actual:
            return {
                'total_predictions': 0,
                'message': 'لا توجد نتائج فعلية لمقارنتها'
            }
        
        correct_predictions = 0
        total_error = 0
        
        for record in records_with_actual:
            predicted = record.original_prediction.get('success_probability', 0)
            actual = 1.0 if record.actual_outcome == 'success' else 0.0
            
            # حساب الدقة
            if (predicted >= 0.5 and actual == 1.0) or (predicted < 0.5 and actual == 0.0):
                correct_predictions += 1
            
            # حساب الخطأ
            total_error += abs(predicted - actual)
        
        accuracy = correct_predictions / len(records_with_actual) * 100
        mae = total_error / len(records_with_actual)
        
        return {
            'total_predictions': len(records_with_actual),
            'correct_predictions': correct_predictions,
            'accuracy_percentage': round(accuracy, 2),
            'mean_absolute_error': round(mae, 3),
            'model_performance': 'ممتاز' if accuracy >= 90 else 'جيد' if accuracy >= 80 else 'متوسط' if accuracy >= 70 else 'يحتاج تحسين'
        }
    
    def identify_improvement_opportunities(self) -> List[Dict[str, Any]]:
        """
        تحديد فرص التحسين
        """
        opportunities = []
        
        # 1. التوصيات ذات معدل الرفض العالي
        rejected_recommendations = {}
        for record in self.feedback_records:
            if record.action_taken == 'rejected':
                key = record.recommendation_type
                if key not in rejected_recommendations:
                    rejected_recommendations[key] = []
                rejected_recommendations[key].append(record)
        
        for rec_type, records in rejected_recommendations.items():
            if len(records) >= 5:  # عتبة معينة
                opportunities.append({
                    'type': 'high_rejection_rate',
                    'recommendation_type': rec_type,
                    'rejection_count': len(records),
                    'suggestion': f'مراجعة معايير توليد توصيات {rec_type} - معدل الرفض مرتفع'
                })
        
        # 2. التوصيات ذات التأثير السلبي
        negative_impact_recommendations = [r for r in self.feedback_records if r.impact_score < -0.3]
        if len(negative_impact_recommendations) >= 3:
            opportunities.append({
                'type': 'negative_impact',
                'count': len(negative_impact_recommendations),
                'suggestion': 'مراجعة التوصيات التي أدت إلى نتائج سلبية وتحديث النماذج'
            })
        
        # 3. فجوات في دقة التنبؤ
        accuracy_analysis = self.analyze_prediction_accuracy()
        if accuracy_analysis.get('accuracy_percentage', 100) < 80:
            opportunities.append({
                'type': 'low_prediction_accuracy',
                'accuracy': accuracy_analysis.get('accuracy_percentage'),
                'suggestion': 'إعادة تدريب النموذج مع البيانات الجديدة لتحسين الدقة'
            })
        
        return opportunities
    
    def generate_retraining_dataset(self) -> List[Dict[str, Any]]:
        """
        توليد مجموعة بيانات لإعادة التدريب
        """
        dataset = []
        
        for record in self.feedback_records:
            if record.actual_outcome is not None:
                dataset.append({
                    'features': record.actual_features or record.original_features,
                    'outcome': record.actual_outcome,
                    'weight': abs(record.impact_score)  # وزن أعلى للحالات ذات التأثير الكبير
                })
        
        return dataset
    
    def export_learning_report(self) -> Dict[str, Any]:
        """
        تصدير تقرير شامل عن التعلم
        """
        return {
            'generated_at': datetime.now().isoformat(),
            'total_feedback_records': len(self.feedback_records),
            'recommendation_effectiveness': {
                'ceo_insights': self.analyze_recommendation_effectiveness('ceo_insight'),
                'roadmap_steps': self.analyze_recommendation_effectiveness('roadmap_step'),
                'investment_strategies': self.analyze_recommendation_effectiveness('investment_strategy'),
                'overall': self.analyze_recommendation_effectiveness()
            },
            'prediction_accuracy': self.analyze_prediction_accuracy(),
            'improvement_opportunities': self.identify_improvement_opportunities(),
            'retraining_dataset_size': len(self.generate_retraining_dataset())
        }
    
    def _load_data(self):
        """تحميل البيانات المحفوظة"""
        if os.path.exists(self.feedback_file):
            try:
                with open(self.feedback_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.feedback_records = [FeedbackRecord(**record) for record in data]
            except Exception as e:
                print(f"خطأ في تحميل البيانات: {e}")
        
        if os.path.exists(self.metrics_file):
            try:
                with open(self.metrics_file, 'r', encoding='utf-8') as f:
                    self.learning_metrics = json.load(f)
            except Exception as e:
                print(f"خطأ في تحميل المقاييس: {e}")
    
    def _save_feedback(self):
        """حفظ سجلات الملاحظات"""
        try:
            with open(self.feedback_file, 'w', encoding='utf-8') as f:
                json.dump([asdict(record) for record in self.feedback_records], f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"خطأ في حفظ الملاحظات: {e}")
    
    def _update_metrics(self):
        """تحديث المقاييس"""
        self.learning_metrics = {
            'last_updated': datetime.now().isoformat(),
            'total_records': len(self.feedback_records),
            'recommendation_effectiveness': self.analyze_recommendation_effectiveness(),
            'prediction_accuracy': self.analyze_prediction_accuracy()
        }
        
        try:
            with open(self.metrics_file, 'w', encoding='utf-8') as f:
                json.dump(self.learning_metrics, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"خطأ في حفظ المقاييس: {e}")

# Example usage
if __name__ == "__main__":
    learning_loop = ContinuousLearningLoop()
    
    # مثال: تسجيل ملاحظات
    learning_loop.record_feedback(
        project_id="proj_001",
        recommendation_id="rec_001",
        recommendation_type="ceo_insight",
        recommendation_text="تأمين تمويل إضافي فوري",
        action_taken="implemented",
        outcome="success",
        outcome_details="تم تأمين 500K من مستثمر ملاك",
        impact_score=0.8,
        original_features={'budget': '150000', 'team_size': '3'},
        original_prediction={'success_probability': 0.35},
        actual_features={'budget': '650000', 'team_size': '3'},
        actual_outcome="success",
        notes="التمويل ساعد في تسريع التطوير"
    )
    
    # تحليل الفعالية
    report = learning_loop.export_learning_report()
    print(json.dumps(report, ensure_ascii=False, indent=2))
