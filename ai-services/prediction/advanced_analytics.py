"""
Advanced Analytics Module for UPLINK Platform
==============================================

This module provides advanced analytics capabilities:
1. Cohort Analysis: Track groups of projects over time
2. Funnel Visualization: Visualize success/failure stages
3. Trend Predictions: Forecast future success trends

Author: UPLINK Team
Version: 1.0
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import json


class CohortAnalyzer:
    """
    Cohort Analysis: تتبع مجموعات المشاريع عبر الزمن
    
    يحلل:
    - معدلات النجاح حسب الفترة الزمنية
    - أنماط التطور للمشاريع المتشابهة
    - تأثير العوامل المختلفة على النجاح بمرور الوقت
    """
    
    def __init__(self):
        self.cohort_periods = ['weekly', 'monthly', 'quarterly']
    
    def analyze_cohorts(
        self,
        analyses_data: List[Dict[str, Any]],
        period: str = 'monthly',
        segment_by: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        تحليل Cohorts للمشاريع
        
        Args:
            analyses_data: قائمة التحليلات من قاعدة البيانات
            period: الفترة الزمنية (weekly, monthly, quarterly)
            segment_by: تقسيم إضافي (sector, organization, budget_range)
        
        Returns:
            تحليل Cohort شامل مع معدلات النجاح والاتجاهات
        """
        if not analyses_data:
            return {
                'error': 'No data available for cohort analysis',
                'cohorts': [],
                'summary': {}
            }
        
        # تحويل إلى DataFrame
        df = pd.DataFrame(analyses_data)
        
        # التأكد من وجود الأعمدة المطلوبة
        required_cols = ['created_at', 'success_probability', 'ici_score', 'irl_score']
        if not all(col in df.columns for col in required_cols):
            return {
                'error': 'Missing required columns',
                'required': required_cols,
                'available': list(df.columns)
            }
        
        # تحويل created_at إلى datetime
        df['created_at'] = pd.to_datetime(df['created_at'])
        
        # إنشاء Cohort Period
        if period == 'weekly':
            df['cohort'] = df['created_at'].dt.to_period('W').astype(str)
        elif period == 'monthly':
            df['cohort'] = df['created_at'].dt.to_period('M').astype(str)
        elif period == 'quarterly':
            df['cohort'] = df['created_at'].dt.to_period('Q').astype(str)
        else:
            df['cohort'] = df['created_at'].dt.to_period('M').astype(str)
        
        # حساب Success (>= 50% probability)
        df['is_success'] = df['success_probability'] >= 50
        
        # تحليل Cohorts
        cohorts = []
        for cohort_name in sorted(df['cohort'].unique()):
            cohort_df = df[df['cohort'] == cohort_name]
            
            cohort_analysis = {
                'cohort': cohort_name,
                'total_projects': len(cohort_df),
                'success_count': int(cohort_df['is_success'].sum()),
                'success_rate': float(cohort_df['is_success'].mean() * 100),
                'avg_ici_score': float(cohort_df['ici_score'].mean()),
                'avg_irl_score': float(cohort_df['irl_score'].mean()),
                'avg_success_probability': float(cohort_df['success_probability'].mean())
            }
            
            # تحليل إضافي حسب segment_by
            if segment_by and segment_by in cohort_df.columns:
                segments = {}
                for segment_value in cohort_df[segment_by].unique():
                    segment_df = cohort_df[cohort_df[segment_by] == segment_value]
                    segments[str(segment_value)] = {
                        'count': len(segment_df),
                        'success_rate': float(segment_df['is_success'].mean() * 100),
                        'avg_ici': float(segment_df['ici_score'].mean())
                    }
                cohort_analysis['segments'] = segments
            
            cohorts.append(cohort_analysis)
        
        # حساب الاتجاهات
        if len(cohorts) >= 2:
            success_rates = [c['success_rate'] for c in cohorts]
            ici_scores = [c['avg_ici_score'] for c in cohorts]
            
            # حساب معدل التغير
            success_rate_change = success_rates[-1] - success_rates[0]
            ici_change = ici_scores[-1] - ici_scores[0]
            
            # اتجاه عام
            if success_rate_change > 5:
                trend = 'improving'
                trend_ar = 'تحسن مستمر'
            elif success_rate_change < -5:
                trend = 'declining'
                trend_ar = 'تراجع'
            else:
                trend = 'stable'
                trend_ar = 'مستقر'
        else:
            success_rate_change = 0
            ici_change = 0
            trend = 'insufficient_data'
            trend_ar = 'بيانات غير كافية'
        
        # ملخص عام
        summary = {
            'total_cohorts': len(cohorts),
            'total_projects': len(df),
            'overall_success_rate': float(df['is_success'].mean() * 100),
            'avg_ici_score': float(df['ici_score'].mean()),
            'avg_irl_score': float(df['irl_score'].mean()),
            'trend': trend,
            'trend_ar': trend_ar,
            'success_rate_change': round(success_rate_change, 2),
            'ici_change': round(ici_change, 2),
            'period': period
        }
        
        # توصيات
        recommendations = self._generate_cohort_recommendations(cohorts, summary)
        
        return {
            'cohorts': cohorts,
            'summary': summary,
            'recommendations': recommendations,
            'period': period,
            'segment_by': segment_by
        }
    
    def _generate_cohort_recommendations(
        self,
        cohorts: List[Dict],
        summary: Dict
    ) -> List[Dict[str, str]]:
        """توليد توصيات بناءً على تحليل Cohorts"""
        recommendations = []
        
        if summary['trend'] == 'declining':
            recommendations.append({
                'priority': 'high',
                'title_ar': 'تراجع في معدلات النجاح',
                'title_en': 'Declining Success Rates',
                'description_ar': f"لوحظ تراجع بنسبة {abs(summary['success_rate_change']):.1f}% في معدلات النجاح. يُنصح بمراجعة معايير الاختيار والدعم المقدم للمشاريع.",
                'description_en': f"A decline of {abs(summary['success_rate_change']):.1f}% in success rates observed. Review selection criteria and project support mechanisms."
            })
        
        if summary['trend'] == 'improving':
            recommendations.append({
                'priority': 'medium',
                'title_ar': 'تحسن مستمر',
                'title_en': 'Continuous Improvement',
                'description_ar': f"تحسن بنسبة {summary['success_rate_change']:.1f}% في معدلات النجاح. استمر في الممارسات الحالية وشارك أفضل التجارب.",
                'description_en': f"Improvement of {summary['success_rate_change']:.1f}% in success rates. Continue current practices and share best practices."
            })
        
        if summary['avg_ici_score'] < 40:
            recommendations.append({
                'priority': 'high',
                'title_ar': 'مؤشر الثقة بالابتكار منخفض',
                'title_en': 'Low Innovation Confidence Index',
                'description_ar': f"متوسط ICI هو {summary['avg_ici_score']:.1f}/100. ركز على تحسين الأبعاد الخمسة: الاستراتيجية، الموارد، العمليات، الثقافة، والتأثير.",
                'description_en': f"Average ICI is {summary['avg_ici_score']:.1f}/100. Focus on improving the five dimensions: Strategy, Resources, Processes, Culture, and Impact."
            })
        
        if len(cohorts) >= 3:
            # تحليل التقلبات
            success_rates = [c['success_rate'] for c in cohorts[-3:]]
            volatility = np.std(success_rates)
            
            if volatility > 15:
                recommendations.append({
                    'priority': 'medium',
                    'title_ar': 'تقلبات عالية في الأداء',
                    'title_en': 'High Performance Volatility',
                    'description_ar': f"تقلب بنسبة {volatility:.1f}% في معدلات النجاح. يُنصح بتوحيد المعايير وتحسين استقرار العمليات.",
                    'description_en': f"Volatility of {volatility:.1f}% in success rates. Standardize criteria and improve process stability."
                })
        
        return recommendations


class FunnelAnalyzer:
    """
    Funnel Visualization: تصور مراحل نجاح/فشل المشاريع
    
    يحلل:
    - نقاط التسرب الرئيسية
    - معدلات التحويل بين المراحل
    - العوامل المؤثرة في كل مرحلة
    """
    
    def __init__(self):
        # تعريف مراحل Funnel
        self.stages = [
            {'id': 1, 'name': 'Initial Assessment', 'name_ar': 'التقييم الأولي', 'threshold': 0},
            {'id': 2, 'name': 'Validation', 'name_ar': 'التحقق', 'threshold': 30},
            {'id': 3, 'name': 'Development', 'name_ar': 'التطوير', 'threshold': 50},
            {'id': 4, 'name': 'Market Ready', 'name_ar': 'جاهز للسوق', 'threshold': 70},
            {'id': 5, 'name': 'Success', 'name_ar': 'النجاح', 'threshold': 85}
        ]
    
    def analyze_funnel(
        self,
        analyses_data: List[Dict[str, Any]],
        segment_by: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        تحليل Funnel للمشاريع
        
        Args:
            analyses_data: قائمة التحليلات من قاعدة البيانات
            segment_by: تقسيم إضافي (sector, organization)
        
        Returns:
            تحليل Funnel شامل مع معدلات التحويل
        """
        if not analyses_data:
            return {
                'error': 'No data available for funnel analysis',
                'stages': [],
                'conversion_rates': []
            }
        
        df = pd.DataFrame(analyses_data)
        
        # التأكد من وجود success_probability
        if 'success_probability' not in df.columns:
            return {
                'error': 'Missing success_probability column',
                'available': list(df.columns)
            }
        
        # حساب عدد المشاريع في كل مرحلة
        funnel_stages = []
        for i, stage in enumerate(self.stages):
            # عدد المشاريع التي وصلت لهذه المرحلة
            count = len(df[df['success_probability'] >= stage['threshold']])
            
            # النسبة من المجموع الكلي
            percentage = (count / len(df)) * 100 if len(df) > 0 else 0
            
            # معدل التحويل من المرحلة السابقة
            if i > 0:
                prev_count = funnel_stages[i-1]['count']
                conversion_rate = (count / prev_count) * 100 if prev_count > 0 else 0
            else:
                conversion_rate = 100  # المرحلة الأولى دائماً 100%
            
            funnel_stages.append({
                'stage_id': stage['id'],
                'stage_name': stage['name'],
                'stage_name_ar': stage['name_ar'],
                'threshold': stage['threshold'],
                'count': count,
                'percentage': round(percentage, 2),
                'conversion_rate': round(conversion_rate, 2)
            })
        
        # حساب Drop-off rates
        drop_offs = []
        for i in range(len(funnel_stages) - 1):
            current = funnel_stages[i]
            next_stage = funnel_stages[i + 1]
            
            drop_off_count = current['count'] - next_stage['count']
            drop_off_rate = (drop_off_count / current['count']) * 100 if current['count'] > 0 else 0
            
            drop_offs.append({
                'from_stage': current['stage_name_ar'],
                'to_stage': next_stage['stage_name_ar'],
                'drop_off_count': drop_off_count,
                'drop_off_rate': round(drop_off_rate, 2)
            })
        
        # تحليل حسب segment_by
        segments_analysis = {}
        if segment_by and segment_by in df.columns:
            for segment_value in df[segment_by].unique():
                segment_df = df[df[segment_by] == segment_value]
                segment_funnel = []
                
                for stage in self.stages:
                    count = len(segment_df[segment_df['success_probability'] >= stage['threshold']])
                    percentage = (count / len(segment_df)) * 100 if len(segment_df) > 0 else 0
                    
                    segment_funnel.append({
                        'stage_name_ar': stage['name_ar'],
                        'count': count,
                        'percentage': round(percentage, 2)
                    })
                
                segments_analysis[str(segment_value)] = segment_funnel
        
        # تحديد أكبر نقاط التسرب
        if drop_offs:
            max_drop_off = max(drop_offs, key=lambda x: x['drop_off_rate'])
        else:
            max_drop_off = None
        
        # توصيات
        recommendations = self._generate_funnel_recommendations(funnel_stages, drop_offs, max_drop_off)
        
        return {
            'funnel_stages': funnel_stages,
            'drop_offs': drop_offs,
            'max_drop_off': max_drop_off,
            'segments_analysis': segments_analysis,
            'recommendations': recommendations,
            'total_projects': len(df)
        }
    
    def _generate_funnel_recommendations(
        self,
        stages: List[Dict],
        drop_offs: List[Dict],
        max_drop_off: Optional[Dict]
    ) -> List[Dict[str, str]]:
        """توليد توصيات بناءً على تحليل Funnel"""
        recommendations = []
        
        if max_drop_off and max_drop_off['drop_off_rate'] > 50:
            recommendations.append({
                'priority': 'critical',
                'title_ar': f"تسرب كبير من {max_drop_off['from_stage']} إلى {max_drop_off['to_stage']}",
                'title_en': f"Major drop-off from {max_drop_off['from_stage']} to {max_drop_off['to_stage']}",
                'description_ar': f"نسبة التسرب {max_drop_off['drop_off_rate']:.1f}% تتطلب تدخلاً فورياً. راجع معايير الانتقال والدعم المقدم في هذه المرحلة.",
                'description_en': f"Drop-off rate of {max_drop_off['drop_off_rate']:.1f}% requires immediate intervention. Review transition criteria and support at this stage."
            })
        
        # حساب معدل النجاح النهائي
        if stages:
            final_success_rate = stages[-1]['percentage']
            
            if final_success_rate < 10:
                recommendations.append({
                    'priority': 'high',
                    'title_ar': 'معدل نجاح منخفض جداً',
                    'title_en': 'Very Low Success Rate',
                    'description_ar': f"فقط {final_success_rate:.1f}% من المشاريع تصل للنجاح. يُنصح بمراجعة شاملة لمعايير الاختيار والدعم.",
                    'description_en': f"Only {final_success_rate:.1f}% of projects reach success. Comprehensive review of selection and support criteria recommended."
                })
            elif final_success_rate > 30:
                recommendations.append({
                    'priority': 'low',
                    'title_ar': 'معدل نجاح جيد',
                    'title_en': 'Good Success Rate',
                    'description_ar': f"{final_success_rate:.1f}% من المشاريع تصل للنجاح. استمر في الممارسات الحالية.",
                    'description_en': f"{final_success_rate:.1f}% of projects reach success. Continue current practices."
                })
        
        return recommendations


class TrendPredictor:
    """
    Trend Predictions: توقع اتجاهات النجاح المستقبلية
    
    يحلل:
    - الاتجاهات التاريخية
    - التوقعات المستقبلية
    - العوامل المؤثرة
    """
    
    def __init__(self):
        pass
    
    def predict_trends(
        self,
        analyses_data: List[Dict[str, Any]],
        forecast_periods: int = 3
    ) -> Dict[str, Any]:
        """
        توقع الاتجاهات المستقبلية
        
        Args:
            analyses_data: قائمة التحليلات من قاعدة البيانات
            forecast_periods: عدد الفترات المستقبلية للتوقع
        
        Returns:
            توقعات الاتجاهات مع فترات الثقة
        """
        if not analyses_data or len(analyses_data) < 3:
            return {
                'error': 'Insufficient data for trend prediction (minimum 3 data points required)',
                'historical': [],
                'forecast': []
            }
        
        df = pd.DataFrame(analyses_data)
        
        # التأكد من وجود الأعمدة المطلوبة
        if 'created_at' not in df.columns or 'success_probability' not in df.columns:
            return {
                'error': 'Missing required columns',
                'required': ['created_at', 'success_probability']
            }
        
        # تحويل created_at إلى datetime
        df['created_at'] = pd.to_datetime(df['created_at'])
        df = df.sort_values('created_at')
        
        # تجميع حسب الشهر
        df['month'] = df['created_at'].dt.to_period('M')
        monthly_stats = df.groupby('month').agg({
            'success_probability': ['mean', 'std', 'count'],
            'ici_score': 'mean',
            'irl_score': 'mean'
        }).reset_index()
        
        monthly_stats.columns = ['month', 'avg_success', 'std_success', 'count', 'avg_ici', 'avg_irl']
        monthly_stats['month'] = monthly_stats['month'].astype(str)
        
        # البيانات التاريخية
        historical = []
        for _, row in monthly_stats.iterrows():
            historical.append({
                'period': row['month'],
                'avg_success_probability': round(float(row['avg_success']), 2),
                'std_success_probability': round(float(row['std_success']), 2) if pd.notna(row['std_success']) else 0,
                'project_count': int(row['count']),
                'avg_ici_score': round(float(row['avg_ici']), 2),
                'avg_irl_score': round(float(row['avg_irl']), 2)
            })
        
        # حساب الاتجاه باستخدام Linear Regression بسيط
        if len(historical) >= 2:
            x = np.arange(len(historical))
            y = [h['avg_success_probability'] for h in historical]
            
            # حساب معامل الانحدار
            slope = np.polyfit(x, y, 1)[0]
            intercept = np.polyfit(x, y, 1)[1]
            
            # توقع الفترات المستقبلية
            forecast = []
            last_month = pd.Period(historical[-1]['period'], freq='M')
            
            for i in range(1, forecast_periods + 1):
                future_month = last_month + i
                future_x = len(historical) + i - 1
                predicted_value = slope * future_x + intercept
                
                # حساب فترة الثقة (بسيطة)
                std = np.std(y) if len(y) > 1 else 5
                confidence_lower = max(0, predicted_value - 1.96 * std)
                confidence_upper = min(100, predicted_value + 1.96 * std)
                
                forecast.append({
                    'period': str(future_month),
                    'predicted_success_probability': round(float(predicted_value), 2),
                    'confidence_lower': round(float(confidence_lower), 2),
                    'confidence_upper': round(float(confidence_upper), 2)
                })
            
            # تحديد الاتجاه
            if slope > 0.5:
                trend = 'increasing'
                trend_ar = 'تصاعدي'
            elif slope < -0.5:
                trend = 'decreasing'
                trend_ar = 'تنازلي'
            else:
                trend = 'stable'
                trend_ar = 'مستقر'
        else:
            forecast = []
            slope = 0
            trend = 'insufficient_data'
            trend_ar = 'بيانات غير كافية'
        
        # توصيات
        recommendations = self._generate_trend_recommendations(historical, forecast, trend, slope)
        
        return {
            'historical': historical,
            'forecast': forecast,
            'trend': trend,
            'trend_ar': trend_ar,
            'slope': round(float(slope), 4),
            'recommendations': recommendations
        }
    
    def _generate_trend_recommendations(
        self,
        historical: List[Dict],
        forecast: List[Dict],
        trend: str,
        slope: float
    ) -> List[Dict[str, str]]:
        """توليد توصيات بناءً على توقعات الاتجاهات"""
        recommendations = []
        
        if trend == 'decreasing':
            recommendations.append({
                'priority': 'critical',
                'title_ar': 'اتجاه تنازلي متوقع',
                'title_en': 'Decreasing Trend Expected',
                'description_ar': f"التوقعات تشير إلى انخفاض بمعدل {abs(slope):.2f}% شهرياً. يُنصح بتدخل استراتيجي فوري.",
                'description_en': f"Forecasts indicate a decline of {abs(slope):.2f}% per month. Immediate strategic intervention recommended."
            })
        
        if trend == 'increasing':
            recommendations.append({
                'priority': 'low',
                'title_ar': 'اتجاه تصاعدي إيجابي',
                'title_en': 'Positive Increasing Trend',
                'description_ar': f"التوقعات تشير إلى تحسن بمعدل {slope:.2f}% شهرياً. استمر في الممارسات الحالية.",
                'description_en': f"Forecasts indicate improvement of {slope:.2f}% per month. Continue current practices."
            })
        
        if forecast and len(forecast) > 0:
            next_period_prediction = forecast[0]['predicted_success_probability']
            
            if next_period_prediction < 40:
                recommendations.append({
                    'priority': 'high',
                    'title_ar': 'توقع أداء منخفض في الفترة القادمة',
                    'title_en': 'Low Performance Expected Next Period',
                    'description_ar': f"التوقع للفترة القادمة هو {next_period_prediction:.1f}%. يُنصح بمراجعة استراتيجية الدعم.",
                    'description_en': f"Next period forecast is {next_period_prediction:.1f}%. Review support strategy recommended."
                })
        
        return recommendations


# Main analytics orchestrator
class AdvancedAnalytics:
    """
    Advanced Analytics Orchestrator
    يدير جميع أنواع التحليلات المتقدمة
    """
    
    def __init__(self):
        self.cohort_analyzer = CohortAnalyzer()
        self.funnel_analyzer = FunnelAnalyzer()
        self.trend_predictor = TrendPredictor()
    
    def get_all_analytics(
        self,
        analyses_data: List[Dict[str, Any]],
        cohort_period: str = 'monthly',
        segment_by: Optional[str] = None,
        forecast_periods: int = 3
    ) -> Dict[str, Any]:
        """
        الحصول على جميع التحليلات المتقدمة دفعة واحدة
        
        Args:
            analyses_data: قائمة التحليلات من قاعدة البيانات
            cohort_period: فترة Cohort (weekly, monthly, quarterly)
            segment_by: تقسيم إضافي (sector, organization)
            forecast_periods: عدد الفترات للتوقع
        
        Returns:
            جميع التحليلات المتقدمة
        """
        return {
            'cohort_analysis': self.cohort_analyzer.analyze_cohorts(
                analyses_data,
                period=cohort_period,
                segment_by=segment_by
            ),
            'funnel_analysis': self.funnel_analyzer.analyze_funnel(
                analyses_data,
                segment_by=segment_by
            ),
            'trend_predictions': self.trend_predictor.predict_trends(
                analyses_data,
                forecast_periods=forecast_periods
            ),
            'metadata': {
                'total_analyses': len(analyses_data),
                'cohort_period': cohort_period,
                'segment_by': segment_by,
                'forecast_periods': forecast_periods,
                'generated_at': datetime.now().isoformat()
            }
        }


if __name__ == '__main__':
    # اختبار بسيط
    print("Advanced Analytics Module - Test")
    print("=" * 50)
    
    # بيانات تجريبية
    test_data = [
        {
            'created_at': '2024-01-15',
            'success_probability': 75,
            'ici_score': 65,
            'irl_score': 70
        },
        {
            'created_at': '2024-01-20',
            'success_probability': 45,
            'ici_score': 50,
            'irl_score': 48
        },
        {
            'created_at': '2024-02-10',
            'success_probability': 80,
            'ici_score': 72,
            'irl_score': 75
        },
        {
            'created_at': '2024-02-25',
            'success_probability': 55,
            'ici_score': 58,
            'irl_score': 60
        },
        {
            'created_at': '2024-03-05',
            'success_probability': 85,
            'ici_score': 78,
            'irl_score': 80
        }
    ]
    
    analytics = AdvancedAnalytics()
    results = analytics.get_all_analytics(test_data, cohort_period='monthly')
    
    print("\nCohort Analysis:")
    print(json.dumps(results['cohort_analysis']['summary'], indent=2, ensure_ascii=False))
    
    print("\nFunnel Analysis:")
    print(f"Total Projects: {results['funnel_analysis']['total_projects']}")
    print(f"Stages: {len(results['funnel_analysis']['funnel_stages'])}")
    
    print("\nTrend Predictions:")
    print(f"Trend: {results['trend_predictions']['trend_ar']}")
    print(f"Slope: {results['trend_predictions']['slope']}")
    
    print("\n✅ Advanced Analytics Module is ready!")
