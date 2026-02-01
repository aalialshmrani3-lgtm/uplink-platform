"""
AI Chatbot Service for Strategic Advisor
Provides conversational interface to explain strategic analysis results
"""

import os
from typing import Dict, Any, List
from datetime import datetime


class StrategicAdvisorChatbot:
    """
    AI Chatbot that helps users understand their strategic analysis results
    through natural conversation
    """
    
    def __init__(self):
        self.conversation_history = []
        self.current_analysis = None
        
    def set_analysis_context(self, analysis_data: Dict[str, Any]):
        """
        Set the current analysis context for the chatbot
        
        Args:
            analysis_data: Strategic analysis results to use as context
        """
        self.current_analysis = analysis_data
        
    def chat(self, user_message: str, analysis_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Process user message and generate intelligent response
        
        Args:
            user_message: User's question or message
            analysis_context: Optional analysis data for context
            
        Returns:
            Dictionary containing bot response and metadata
        """
        # Update context if provided
        if analysis_context:
            self.current_analysis = analysis_context
            
        # Add user message to history
        self.conversation_history.append({
            'role': 'user',
            'content': user_message,
            'timestamp': datetime.now().isoformat()
        })
        
        # Generate response based on message intent
        response = self._generate_response(user_message)
        
        # Add bot response to history
        self.conversation_history.append({
            'role': 'assistant',
            'content': response['message'],
            'timestamp': datetime.now().isoformat()
        })
        
        return response
    
    def _generate_response(self, user_message: str) -> Dict[str, Any]:
        """
        Generate intelligent response based on user message and analysis context
        
        Args:
            user_message: User's question
            
        Returns:
            Response dictionary with message and suggestions
        """
        message_lower = user_message.lower()
        
        # Intent detection
        if any(keyword in message_lower for keyword in ['ici', 'مؤشر الثقة', 'innovation confidence']):
            return self._explain_ici()
        
        elif any(keyword in message_lower for keyword in ['irl', 'جاهزية المستثمر', 'investor readiness']):
            return self._explain_irl()
        
        elif any(keyword in message_lower for keyword in ['نجاح', 'success', 'probability', 'احتمال']):
            return self._explain_success_probability()
        
        elif any(keyword in message_lower for keyword in ['مخاطر', 'risk', 'خطر']):
            return self._explain_risks()
        
        elif any(keyword in message_lower for keyword in ['توصية', 'recommendation', 'نصيحة', 'اقتراح']):
            return self._provide_recommendations()
        
        elif any(keyword in message_lower for keyword in ['خارطة', 'roadmap', 'خطة', 'plan']):
            return self._explain_roadmap()
        
        elif any(keyword in message_lower for keyword in ['استثمار', 'investment', 'تمويل', 'funding']):
            return self._explain_investment()
        
        elif any(keyword in message_lower for keyword in ['تحسين', 'improve', 'enhance', 'طور']):
            return self._suggest_improvements()
        
        elif any(keyword in message_lower for keyword in ['مقارنة', 'compare', 'comparison']):
            return self._provide_comparison()
        
        else:
            return self._provide_general_help()
    
    def _explain_ici(self) -> Dict[str, Any]:
        """Explain Innovation Confidence Index"""
        if not self.current_analysis:
            return {
                'message': 'مؤشر الثقة في الابتكار (ICI) يقيس إمكانات الابتكار وجاهزيته عبر خمسة أبعاد رئيسية: استراتيجية الابتكار، الموارد والقدرات، عمليات الابتكار، ثقافة الابتكار، وتأثير الابتكار. يتراوح المؤشر من 0 إلى 100، حيث تشير القيم الأعلى إلى ثقة أكبر في نجاح الابتكار.',
                'suggestions': [
                    'كيف يمكنني تحسين درجة ICI؟',
                    'ما هي الأبعاد الخمسة للـ ICI؟',
                    'ما الفرق بين ICI و IRL؟'
                ]
            }
        
        ici_score = self.current_analysis.get('ici_score', 0)
        
        if ici_score >= 80:
            level = 'ممتاز'
            interpretation = 'مشروعك يتمتع بثقة عالية جداً في الابتكار! هذا يعني أن لديك استراتيجية واضحة، موارد كافية، وثقافة داعمة للابتكار.'
        elif ici_score >= 60:
            level = 'جيد'
            interpretation = 'مشروعك يتمتع بثقة جيدة في الابتكار، لكن هناك مجال للتحسين في بعض الأبعاد.'
        elif ici_score >= 40:
            level = 'متوسط'
            interpretation = 'مشروعك يحتاج إلى تعزيز في عدة أبعاد لزيادة الثقة في نجاح الابتكار.'
        else:
            level = 'ضعيف'
            interpretation = 'يحتاج مشروعك إلى عمل كبير لتحسين جاهزية الابتكار والثقة في النجاح.'
        
        return {
            'message': f'درجة ICI الخاصة بك هي **{ici_score}/100** ({level}). {interpretation}\n\nالأبعاد الخمسة للـ ICI هي:\n1. **استراتيجية الابتكار**: مدى توافق الابتكار مع أهداف المنظمة واحتياجات السوق\n2. **الموارد والقدرات**: توفر الموارد والكفاءات اللازمة\n3. **عمليات الابتكار**: فعالية عمليات إدارة الابتكار\n4. **ثقافة الابتكار**: الثقافة التنظيمية الداعمة للابتكار\n5. **تأثير الابتكار**: التأثير المتوقع على السوق وأصحاب المصلحة',
            'suggestions': [
                'كيف يمكنني تحسين درجة ICI؟',
                'ما هي نقاط القوة في مشروعي؟',
                'ما هي التوصيات لتحسين الابتكار؟'
            ]
        }
    
    def _explain_irl(self) -> Dict[str, Any]:
        """Explain Investor Readiness Level"""
        if not self.current_analysis:
            return {
                'message': 'مستوى جاهزية المستثمر (IRL) يقيم مدى استعداد المشروع للاستثمار بناءً على ستة معايير: التحقق من السوق، قوة الفريق، النموذج المالي، مقاييس الجذب، الميزة التنافسية، وإمكانية التوسع. يتراوح المؤشر من 0 إلى 100.',
                'suggestions': [
                    'كيف يمكنني تحسين جاهزية المستثمر؟',
                    'ما هي المعايير الستة للـ IRL؟',
                    'ما نوع المستثمرين المناسب لمشروعي؟'
                ]
            }
        
        irl_score = self.current_analysis.get('irl_score', 0)
        investor_appeal = self.current_analysis.get('investor_appeal', 'MEDIUM')
        
        appeal_map = {
            'VERY_HIGH': 'عالي جداً - جاذب للغاية للمستثمرين',
            'HIGH': 'عالي - جذاب للمستثمرين',
            'MEDIUM': 'متوسط - يحتاج لبعض التحسينات',
            'LOW': 'منخفض - يحتاج لعمل كبير',
            'VERY_LOW': 'منخفض جداً - غير جاهز للاستثمار حالياً'
        }
        
        appeal_text = appeal_map.get(investor_appeal, 'متوسط')
        
        return {
            'message': f'درجة IRL الخاصة بك هي **{irl_score}/100**\nمستوى الجاذبية للمستثمرين: **{appeal_text}**\n\nالمعايير الستة للـ IRL:\n1. **التحقق من السوق**: دليل على الطلب في السوق والتحقق من العملاء\n2. **قوة الفريق**: كفاءة واكتمال الفريق المؤسس\n3. **النموذج المالي**: وضوح وجدوى نموذج العمل\n4. **مقاييس الجذب**: مؤشرات النمو ومقاييس الأداء الرئيسية\n5. **الميزة التنافسية**: عرض القيمة الفريد والتمايز\n6. **إمكانية التوسع**: القدرة على توسيع العمليات والإيرادات',
            'suggestions': [
                'ما نوع المستثمرين المناسب لمشروعي؟',
                'كيف أحسن جاذبية مشروعي للمستثمرين؟',
                'ما هي نقاط الضعف في جاهزية الاستثمار؟'
            ]
        }
    
    def _explain_success_probability(self) -> Dict[str, Any]:
        """Explain success probability"""
        if not self.current_analysis:
            return {
                'message': 'احتمالية النجاح تقيس فرص نجاح المشروع بناءً على تحليل شامل لجميع العوامل المؤثرة.',
                'suggestions': [
                    'ما العوامل المؤثرة في احتمالية النجاح؟',
                    'كيف يمكنني زيادة فرص النجاح؟'
                ]
            }
        
        success_prob = self.current_analysis.get('success_probability', 0) * 100
        
        if success_prob >= 75:
            interpretation = 'ممتاز! مشروعك لديه فرص نجاح عالية جداً. استمر في التركيز على نقاط القوة وتنفيذ الخطة بدقة.'
        elif success_prob >= 50:
            interpretation = 'جيد! مشروعك لديه فرص نجاح معقولة، لكن هناك مجالات تحتاج للتحسين لزيادة الفرص.'
        elif success_prob >= 30:
            interpretation = 'متوسط. مشروعك يواجه تحديات كبيرة تحتاج إلى معالجة لتحسين فرص النجاح.'
        else:
            interpretation = 'منخفض. مشروعك يحتاج إلى إعادة تقييم شاملة وتحسينات جوهرية.'
        
        return {
            'message': f'احتمالية نجاح مشروعك: **{success_prob:.1f}%**\n\n{interpretation}\n\nالعوامل الرئيسية المؤثرة:\n• ملاءمة السوق والطلب\n• جاهزية التنفيذ والموارد\n• قوة الفريق والخبرات\n• الميزة التنافسية\n• الاستدامة المالية',
            'suggestions': [
                'ما هي أكبر المخاطر التي تواجه مشروعي؟',
                'كيف يمكنني زيادة احتمالية النجاح؟',
                'ما هي التوصيات الأكثر أهمية؟'
            ]
        }
    
    def _explain_risks(self) -> Dict[str, Any]:
        """Explain project risks"""
        if not self.current_analysis:
            return {
                'message': 'المخاطر هي العوامل التي قد تؤثر سلباً على نجاح المشروع. يتم تصنيفها إلى: حرجة، عالية، متوسطة، ومنخفضة.',
                'suggestions': [
                    'كيف أتعامل مع المخاطر؟',
                    'ما هي خطة تخفيف المخاطر؟'
                ]
            }
        
        risk_level = self.current_analysis.get('risk_level', 'MEDIUM')
        
        risk_map = {
            'CRITICAL': ('حرج', 'يتطلب اهتماماً فورياً وإجراءات تصحيحية عاجلة'),
            'HIGH': ('عالي', 'يحتاج إلى خطة تخفيف واضحة ومراقبة مستمرة'),
            'MEDIUM': ('متوسط', 'يجب مراقبته واتخاذ إجراءات وقائية'),
            'LOW': ('منخفض', 'مخاطر محدودة يمكن إدارتها بسهولة')
        }
        
        risk_text, risk_action = risk_map.get(risk_level, ('متوسط', 'يجب مراقبته'))
        
        return {
            'message': f'مستوى المخاطر في مشروعك: **{risk_text}**\n\n{risk_action}\n\nأنواع المخاطر الرئيسية:\n1. **مخاطر السوق**: تغيرات في الطلب أو المنافسة\n2. **مخاطر التنفيذ**: صعوبات في التطوير أو التسليم\n3. **مخاطر الفريق**: نقص الخبرات أو المهارات\n4. **مخاطر مالية**: نقص التمويل أو سوء إدارة الموارد\n5. **مخاطر تنظيمية**: تغيرات في القوانين أو اللوائح',
            'suggestions': [
                'كيف أخفف من المخاطر؟',
                'ما هي خطة الطوارئ؟',
                'ما هي أكبر المخاطر التي يجب التركيز عليها؟'
            ]
        }
    
    def _provide_recommendations(self) -> Dict[str, Any]:
        """Provide strategic recommendations"""
        if not self.current_analysis:
            return {
                'message': 'التوصيات الاستراتيجية تساعدك على تحسين فرص نجاح مشروعك من خلال إجراءات محددة وقابلة للتنفيذ.',
                'suggestions': [
                    'ما هي أهم التوصيات؟',
                    'من أين أبدأ؟'
                ]
            }
        
        ceo_insights = self.current_analysis.get('ceo_insights', [])
        
        if not ceo_insights:
            return {
                'message': 'لا توجد توصيات محددة متاحة حالياً. يرجى إجراء تحليل استراتيجي أولاً.',
                'suggestions': [
                    'كيف أحسن مشروعي بشكل عام؟',
                    'ما هي أفضل الممارسات؟'
                ]
            }
        
        # Get top 5 insights
        top_insights = ceo_insights[:5]
        insights_text = '\n\n'.join([
            f"**{i+1}. {insight.get('insight', '')}**\n   التأثير: {insight.get('impact', '')}\n   الأولوية: {insight.get('priority', 'MEDIUM')}"
            for i, insight in enumerate(top_insights)
        ])
        
        return {
            'message': f'أهم التوصيات الاستراتيجية لمشروعك:\n\n{insights_text}',
            'suggestions': [
                'كيف أنفذ هذه التوصيات؟',
                'ما هي خارطة الطريق؟',
                'ما هي الخطوات التالية؟'
            ]
        }
    
    def _explain_roadmap(self) -> Dict[str, Any]:
        """Explain actionable roadmap"""
        if not self.current_analysis:
            return {
                'message': 'خارطة الطريق القابلة للتنفيذ توفر خطة خطوة بخطوة لتحقيق أهداف مشروعك بناءً على معايير ISO 56002 لإدارة الابتكار.',
                'suggestions': [
                    'ما هي الخطوات الأولى؟',
                    'كم من الوقت يستغرق التنفيذ؟'
                ]
            }
        
        roadmap = self.current_analysis.get('roadmap', {})
        steps = roadmap.get('steps', [])
        
        if not steps:
            return {
                'message': 'لا توجد خارطة طريق محددة متاحة حالياً.',
                'suggestions': [
                    'ما هي الخطوات العامة للنجاح؟'
                ]
            }
        
        # Get first 3 steps
        first_steps = steps[:3]
        steps_text = '\n\n'.join([
            f"**الخطوة {i+1}: {step.get('title', '')}**\n   {step.get('description', '')}\n   المدة الزمنية: {step.get('timeline', 'غير محدد')}"
            for i, step in enumerate(first_steps)
        ])
        
        return {
            'message': f'خارطة الطريق لمشروعك تتضمن {len(steps)} خطوة رئيسية. إليك الخطوات الأولى:\n\n{steps_text}',
            'suggestions': [
                'ما هي الموارد المطلوبة؟',
                'كيف أبدأ التنفيذ؟',
                'ما هي الخطوات التالية؟'
            ]
        }
    
    def _explain_investment(self) -> Dict[str, Any]:
        """Explain investment analysis"""
        if not self.current_analysis:
            return {
                'message': 'تحليل الاستثمار يقيم جاذبية مشروعك للمستثمرين ويحدد أنواع المستثمرين المناسبين.',
                'suggestions': [
                    'ما نوع المستثمرين المناسب؟',
                    'كيف أجذب المستثمرين؟'
                ]
            }
        
        investment = self.current_analysis.get('investment', {})
        recommended_investors = investment.get('recommended_investors', [])
        
        if not recommended_investors:
            return {
                'message': 'لا توجد توصيات استثمارية محددة متاحة حالياً.',
                'suggestions': [
                    'كيف أحسن جاهزية الاستثمار؟'
                ]
            }
        
        # Get top 3 investor types
        top_investors = recommended_investors[:3]
        investors_text = '\n\n'.join([
            f"**{i+1}. {inv.get('name', '')}**\n   السبب: {inv.get('rationale', '')}"
            for i, inv in enumerate(top_investors)
        ])
        
        return {
            'message': f'أنواع المستثمرين الموصى بهم لمشروعك:\n\n{investors_text}',
            'suggestions': [
                'كيف أتواصل مع المستثمرين؟',
                'ما المستندات المطلوبة؟',
                'كيف أقدم عرضي للمستثمرين؟'
            ]
        }
    
    def _suggest_improvements(self) -> Dict[str, Any]:
        """Suggest improvements"""
        return {
            'message': 'لتحسين مشروعك، ركز على:\n\n1. **تعزيز ملاءمة السوق**: تحقق من احتياجات العملاء وتأكد من أن منتجك يحل مشكلة حقيقية\n2. **تقوية الفريق**: اجذب المواهب المناسبة واملأ الفجوات في المهارات\n3. **تحسين النموذج المالي**: طور خطة مالية واضحة ومستدامة\n4. **بناء الجذب**: ركز على اكتساب المستخدمين وإظهار النمو\n5. **تطوير الميزة التنافسية**: حدد ما يميزك عن المنافسين',
            'suggestions': [
                'ما هي أولويات التحسين؟',
                'كيف أبدأ؟',
                'ما هي التوصيات المحددة لمشروعي؟'
            ]
        }
    
    def _provide_comparison(self) -> Dict[str, Any]:
        """Provide comparison insights"""
        if not self.current_analysis:
            return {
                'message': 'المقارنات تساعدك على فهم موقع مشروعك مقارنة بالمعايير الصناعية والمشاريع المماثلة.',
                'suggestions': [
                    'كيف يقارن مشروعي بالمنافسين؟'
                ]
            }
        
        ici_score = self.current_analysis.get('ici_score', 0)
        irl_score = self.current_analysis.get('irl_score', 0)
        success_prob = self.current_analysis.get('success_probability', 0) * 100
        
        return {
            'message': f'مقارنة مشروعك بالمعايير الصناعية:\n\n**مؤشر الثقة في الابتكار (ICI): {ici_score}/100**\n• المتوسط الصناعي: 60-70\n• المشاريع الناجحة: 75+\n\n**مستوى جاهزية المستثمر (IRL): {irl_score}/100**\n• المتوسط الصناعي: 55-65\n• المشاريع الجاذبة: 70+\n\n**احتمالية النجاح: {success_prob:.1f}%**\n• المتوسط الصناعي: 40-60%\n• المشاريع عالية الإمكانات: 70%+',
            'suggestions': [
                'كيف أصل إلى مستوى المشاريع الناجحة؟',
                'ما هي نقاط القوة مقارنة بالمنافسين؟'
            ]
        }
    
    def _provide_general_help(self) -> Dict[str, Any]:
        """Provide general help"""
        return {
            'message': 'مرحباً! أنا مساعدك الاستراتيجي الذكي. يمكنني مساعدتك في فهم:\n\n• **مؤشر الثقة في الابتكار (ICI)**: قياس إمكانات الابتكار\n• **مستوى جاهزية المستثمر (IRL)**: تقييم جاذبية الاستثمار\n• **احتمالية النجاح**: تحليل فرص النجاح\n• **المخاطر**: تحديد وإدارة المخاطر\n• **التوصيات**: إجراءات محددة للتحسين\n• **خارطة الطريق**: خطة التنفيذ خطوة بخطوة\n• **تحليل الاستثمار**: جذب المستثمرين المناسبين\n\nما الذي تريد معرفته؟',
            'suggestions': [
                'اشرح لي مؤشر ICI',
                'ما هي احتمالية نجاح مشروعي؟',
                'ما هي أهم التوصيات؟'
            ]
        }
    
    def get_conversation_history(self) -> List[Dict[str, Any]]:
        """Get full conversation history"""
        return self.conversation_history
    
    def clear_history(self):
        """Clear conversation history"""
        self.conversation_history = []


# Singleton instance
_chatbot_instance = None

def get_chatbot() -> StrategicAdvisorChatbot:
    """Get or create chatbot singleton instance"""
    global _chatbot_instance
    if _chatbot_instance is None:
        _chatbot_instance = StrategicAdvisorChatbot()
    return _chatbot_instance


if __name__ == '__main__':
    # Test chatbot
    chatbot = StrategicAdvisorChatbot()
    
    # Set sample analysis context
    sample_analysis = {
        'ici_score': 72.5,
        'irl_score': 68.3,
        'success_probability': 0.75,
        'risk_level': 'MEDIUM',
        'investor_appeal': 'HIGH',
        'ceo_insights': [
            {
                'insight': 'قوة الطلب في السوق تدعم ملاءمة المنتج',
                'impact': 'إمكانية عالية لاكتساب المستخدمين بسرعة',
                'priority': 'HIGH'
            }
        ],
        'roadmap': {
            'steps': [
                {
                    'title': 'التحقق من السوق',
                    'description': 'إجراء دراسات تجريبية مع مقدمي الخدمات',
                    'timeline': '3 أشهر'
                }
            ]
        },
        'investment': {
            'recommended_investors': [
                {
                    'name': 'رأس المال الجريء المتخصص',
                    'rationale': 'خبرة متخصصة في القطاع'
                }
            ]
        }
    }
    
    chatbot.set_analysis_context(sample_analysis)
    
    # Test queries
    test_queries = [
        'ما هو مؤشر ICI؟',
        'كم احتمالية نجاح مشروعي؟',
        'ما هي أهم التوصيات؟'
    ]
    
    print('=== Testing Strategic Advisor Chatbot ===\n')
    
    for query in test_queries:
        print(f'User: {query}')
        response = chatbot.chat(query)
        print(f'Bot: {response["message"]}\n')
        print(f'Suggestions: {response["suggestions"]}\n')
        print('-' * 80 + '\n')
    
    print('✅ Chatbot test completed successfully!')
