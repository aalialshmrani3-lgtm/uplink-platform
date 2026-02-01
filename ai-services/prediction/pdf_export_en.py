"""
PDF Export Service for Strategic Analysis Reports - ENGLISH VERSION
Generates professional PDF reports from strategic analysis data in English
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from datetime import datetime
from typing import Dict, Any, List


class StrategicAnalysisPDFExporterEN:
    """English PDF Exporter for Strategic Analysis Reports"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles for English"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=30,
            alignment=TA_CENTER
        ))
        
        # Heading style
        self.styles.add(ParagraphStyle(
            name='EnglishHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=12,
            alignment=TA_LEFT
        ))
        
        # Body style
        self.styles.add(ParagraphStyle(
            name='EnglishBody',
            parent=self.styles['BodyText'],
            fontSize=11,
            alignment=TA_LEFT,
            spaceAfter=6
        ))
    
    def generate_report(self, analysis_data: Dict[str, Any], output_path: str) -> str:
        """
        Generate English PDF report from strategic analysis data
        
        Args:
            analysis_data: Dictionary containing strategic analysis results
            output_path: Path where PDF should be saved
            
        Returns:
            Path to generated PDF file
        """
        doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        story = []
        
        # Title Page
        story.extend(self._create_title_page(analysis_data))
        story.append(PageBreak())
        
        # Executive Summary
        story.extend(self._create_executive_summary(analysis_data))
        story.append(PageBreak())
        
        # Innovation Confidence Index
        story.extend(self._create_ici_section(analysis_data))
        story.append(PageBreak())
        
        # CEO Insights
        story.extend(self._create_ceo_insights_section(analysis_data))
        story.append(PageBreak())
        
        # Actionable Roadmap
        story.extend(self._create_roadmap_section(analysis_data))
        story.append(PageBreak())
        
        # Investment Analysis
        story.extend(self._create_investment_section(analysis_data))
        story.append(PageBreak())
        
        # Critical Path
        story.extend(self._create_critical_path_section(analysis_data))
        
        # Build PDF
        doc.build(story)
        return output_path
    
    def _create_title_page(self, data: Dict[str, Any]) -> List:
        """Create title page"""
        elements = []
        
        # Title
        title = Paragraph(
            "UPLINK 5.0 - Strategic Analysis Report",
            self.styles['CustomTitle']
        )
        elements.append(title)
        elements.append(Spacer(1, 0.5*inch))
        
        # Project Title
        project_title = data.get('project_title', 'Untitled Project')
        elements.append(Paragraph(
            f"<b>{project_title}</b>",
            self.styles['Heading2']
        ))
        elements.append(Spacer(1, 0.3*inch))
        
        # Metadata Table
        metadata = [
            ['Report Date:', datetime.now().strftime('%Y-%m-%d %H:%M')],
            ['ICI Score:', f"{data.get('ici_score', 0)}/100"],
            ['IRL Score:', f"{data.get('irl_score', 0)}/100"],
            ['Success Probability:', f"{data.get('success_probability', 0)*100:.1f}%"],
            ['Risk Level:', data.get('risk_level', 'N/A')],
            ['Investor Appeal:', data.get('investor_appeal', 'N/A')]
        ]
        
        t = Table(metadata, colWidths=[2*inch, 3*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey)
        ]))
        
        elements.append(t)
        elements.append(Spacer(1, 0.5*inch))
        
        # Footer
        elements.append(Paragraph(
            "<i>Generated by UPLINK 5.0 - National Innovation Platform</i>",
            self.styles['Normal']
        ))
        
        return elements
    
    def _create_executive_summary(self, data: Dict[str, Any]) -> List:
        """Create executive summary section"""
        elements = []
        
        elements.append(Paragraph("Executive Summary", self.styles['Heading1']))
        elements.append(Spacer(1, 0.2*inch))
        
        summary = data.get('executive_summary', 'This strategic analysis provides comprehensive insights into the innovation potential, market readiness, and investment viability of the project.')
        elements.append(Paragraph(summary, self.styles['BodyText']))
        elements.append(Spacer(1, 0.3*inch))
        
        # Key Metrics Table
        dimensions = data.get('dimensions', {})
        metrics_data = [
            ['Metric', 'Score'],
            ['Success Probability', f"{dimensions.get('success_probability', 0):.1f}/100"],
            ['Market Fit', f"{dimensions.get('market_fit', 0):.1f}/100"],
            ['Execution Readiness', f"{dimensions.get('execution_readiness', 0):.1f}/100"],
            ['Investor Readiness', f"{dimensions.get('investor_readiness', 0):.1f}/100"],
            ['Financial Sustainability', f"{dimensions.get('financial_sustainability', 0):.1f}/100"]
        ]
        
        t = Table(metrics_data, colWidths=[3*inch, 2*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(t)
        
        return elements
    
    def _create_ici_section(self, data: Dict[str, Any]) -> List:
        """Create Innovation Confidence Index section"""
        elements = []
        
        elements.append(Paragraph(
            "Innovation Confidence Index (ICI)",
            self.styles['Heading1']
        ))
        elements.append(Spacer(1, 0.2*inch))
        
        ici_score = data.get('ici_score', 0)
        
        elements.append(Paragraph(
            f"<b>ICI Score:</b> {ici_score}/100",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph(
            "The Innovation Confidence Index (ICI) measures the overall potential and readiness of the innovation across five key dimensions:",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.1*inch))
        
        # Five Dimensions
        dimensions_text = [
            "<b>1. Innovation Strategy:</b> Alignment with organizational goals and market needs",
            "<b>2. Resources & Capabilities:</b> Availability of necessary resources and competencies",
            "<b>3. Innovation Processes:</b> Effectiveness of innovation management processes",
            "<b>4. Innovation Culture:</b> Organizational culture supporting innovation",
            "<b>5. Innovation Impact:</b> Expected impact on market and stakeholders"
        ]
        
        for dim in dimensions_text:
            elements.append(Paragraph(dim, self.styles['BodyText']))
            elements.append(Spacer(1, 0.05*inch))
        
        return elements
    
    def _create_ceo_insights_section(self, data: Dict[str, Any]) -> List:
        """Create CEO Insights section"""
        elements = []
        
        elements.append(Paragraph("CEO Insights", self.styles['Heading1']))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph(
            "Strategic insights translated from AI analysis into executive-level recommendations:",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.2*inch))
        
        insights = data.get('ceo_insights', [])
        
        if not insights:
            elements.append(Paragraph("No insights available.", self.styles['BodyText']))
        else:
            for i, insight in enumerate(insights[:10], 1):  # Limit to top 10
                insight_text = insight.get('insight_en', insight.get('insight', ''))
                impact = insight.get('impact_en', insight.get('impact', ''))
                priority = insight.get('priority', 'MEDIUM')
                
                elements.append(Paragraph(
                    f"<b>{i}. {insight_text}</b>",
                    self.styles['BodyText']
                ))
                elements.append(Paragraph(
                    f"<i>Impact:</i> {impact}",
                    self.styles['BodyText']
                ))
                elements.append(Paragraph(
                    f"<i>Priority:</i> {priority}",
                    self.styles['BodyText']
                ))
                elements.append(Spacer(1, 0.15*inch))
        
        return elements
    
    def _create_roadmap_section(self, data: Dict[str, Any]) -> List:
        """Create Actionable Roadmap section"""
        elements = []
        
        elements.append(Paragraph("Actionable Roadmap", self.styles['Heading1']))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph(
            "Step-by-step implementation plan based on ISO 56002 Innovation Management standards:",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.2*inch))
        
        roadmap = data.get('roadmap', {})
        steps = roadmap.get('steps', [])
        
        if not steps:
            elements.append(Paragraph("No roadmap steps available.", self.styles['BodyText']))
        else:
            for i, step in enumerate(steps, 1):
                title = step.get('title_en', step.get('title', 'Untitled Step'))
                description = step.get('description_en', step.get('description', ''))
                timeline = step.get('timeline', 'N/A')
                
                elements.append(Paragraph(
                    f"<b>Step {i}: {title}</b>",
                    self.styles['Heading3']
                ))
                elements.append(Paragraph(description, self.styles['BodyText']))
                elements.append(Paragraph(
                    f"<i>Timeline:</i> {timeline}",
                    self.styles['BodyText']
                ))
                elements.append(Spacer(1, 0.15*inch))
        
        return elements
    
    def _create_investment_section(self, data: Dict[str, Any]) -> List:
        """Create Investment Analysis section"""
        elements = []
        
        elements.append(Paragraph("Investment Analysis", self.styles['Heading1']))
        elements.append(Spacer(1, 0.2*inch))
        
        irl_score = data.get('irl_score', 0)
        elements.append(Paragraph(
            f"<b>Investor Readiness Level (IRL):</b> {irl_score}/100",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph(
            "The Investor Readiness Level (IRL) assesses the project's preparedness for investment based on six criteria aligned with Saudi VC standards:",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.1*inch))
        
        # Six IRL Criteria
        criteria_text = [
            "<b>1. Market Validation:</b> Evidence of market demand and customer validation",
            "<b>2. Team Strength:</b> Competence and completeness of the founding team",
            "<b>3. Financial Model:</b> Clarity and viability of the business model",
            "<b>4. Traction Metrics:</b> Growth indicators and key performance metrics",
            "<b>5. Competitive Advantage:</b> Unique value proposition and differentiation",
            "<b>6. Scalability Potential:</b> Ability to scale operations and revenue"
        ]
        
        for criterion in criteria_text:
            elements.append(Paragraph(criterion, self.styles['BodyText']))
            elements.append(Spacer(1, 0.05*inch))
        
        elements.append(Spacer(1, 0.2*inch))
        
        # Recommended Investors
        investment = data.get('investment', {})
        recommended_investors = investment.get('recommended_investors', [])
        
        if recommended_investors:
            elements.append(Paragraph(
                "<b>Recommended Investor Types:</b>",
                self.styles['Heading3']
            ))
            elements.append(Spacer(1, 0.1*inch))
            
            for investor in recommended_investors[:5]:
                investor_name = investor.get('name_en', investor.get('name', ''))
                rationale = investor.get('rationale_en', investor.get('rationale', ''))
                
                elements.append(Paragraph(
                    f"<b>• {investor_name}</b>",
                    self.styles['BodyText']
                ))
                elements.append(Paragraph(
                    f"  {rationale}",
                    self.styles['BodyText']
                ))
                elements.append(Spacer(1, 0.1*inch))
        
        return elements
    
    def _create_critical_path_section(self, data: Dict[str, Any]) -> List:
        """Create Critical Path section"""
        elements = []
        
        elements.append(Paragraph("Critical Success Factors", self.styles['Heading1']))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph(
            "Key factors that will determine the success or failure of this innovation:",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.2*inch))
        
        critical_path = data.get('critical_path', [])
        
        if not critical_path:
            elements.append(Paragraph("No critical factors identified.", self.styles['BodyText']))
        else:
            for i, factor in enumerate(critical_path, 1):
                factor_text = factor.get('factor_en', factor.get('factor', ''))
                importance = factor.get('importance_en', factor.get('importance', ''))
                
                elements.append(Paragraph(
                    f"<b>{i}. {factor_text}</b>",
                    self.styles['BodyText']
                ))
                elements.append(Paragraph(
                    f"<i>Importance:</i> {importance}",
                    self.styles['BodyText']
                ))
                elements.append(Spacer(1, 0.15*inch))
        
        return elements


def export_to_pdf_en(analysis_data: Dict[str, Any], output_path: str) -> str:
    """
    Convenience function to export strategic analysis to English PDF
    
    Args:
        analysis_data: Strategic analysis data dictionary
        output_path: Path where PDF should be saved
        
    Returns:
        Path to generated PDF file
    """
    exporter = StrategicAnalysisPDFExporterEN()
    return exporter.generate_report(analysis_data, output_path)


if __name__ == '__main__':
    # Test with sample data
    sample_data = {
        'project_title': 'AI-Powered Healthcare Platform',
        'ici_score': 72.5,
        'irl_score': 68.3,
        'success_probability': 0.75,
        'risk_level': 'MEDIUM',
        'investor_appeal': 'HIGH',
        'executive_summary': 'This innovative healthcare platform leverages AI to improve patient outcomes.',
        'dimensions': {
            'success_probability': 75.0,
            'market_fit': 70.0,
            'execution_readiness': 68.0,
            'investor_readiness': 68.3,
            'financial_sustainability': 65.0
        },
        'ceo_insights': [
            {
                'insight_en': 'Strong market demand for AI healthcare solutions',
                'impact_en': 'High potential for rapid user acquisition',
                'priority': 'HIGH'
            }
        ],
        'roadmap': {
            'steps': [
                {
                    'title_en': 'Market Validation',
                    'description_en': 'Conduct pilot studies with healthcare providers',
                    'timeline': '3 months'
                }
            ]
        },
        'investment': {
            'recommended_investors': [
                {
                    'name_en': 'Healthcare-focused VCs',
                    'rationale_en': 'Specialized expertise in healthcare technology'
                }
            ]
        },
        'critical_path': [
            {
                'factor_en': 'Regulatory compliance',
                'importance_en': 'Critical for market entry'
            }
        ]
    }
    
    output_file = '/tmp/test_strategic_analysis_en.pdf'
    result = export_to_pdf_en(sample_data, output_file)
    print(f"✅ English PDF generated: {result}")
