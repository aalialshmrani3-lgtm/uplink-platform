"""
PDF Export Service for Strategic Analysis Reports
Generates professional PDF reports from strategic analysis data
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Image, KeepTogether
)
from reportlab.lib.enums import TA_RIGHT, TA_CENTER, TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime
import json
from typing import Dict, Any, List

class StrategicAnalysisPDFExporter:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_arabic_support()
        self._setup_custom_styles()
    
    def _setup_arabic_support(self):
        """Setup Arabic font support (using default fonts for now)"""
        # Note: For full Arabic support, you would need to register Arabic fonts
        # For now, we'll use default fonts and rely on Unicode support
        pass
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=30,
            alignment=TA_CENTER
        ))
        
        # Heading style (RTL for Arabic)
        self.styles.add(ParagraphStyle(
            name='ArabicHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=12,
            alignment=TA_RIGHT
        ))
        
        # Body style (RTL for Arabic)
        self.styles.add(ParagraphStyle(
            name='ArabicBody',
            parent=self.styles['BodyText'],
            fontSize=11,
            alignment=TA_RIGHT,
            spaceAfter=6
        ))
    
    def generate_report(self, analysis_data: Dict[str, Any], output_path: str) -> str:
        """
        Generate PDF report from strategic analysis data
        
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
        
        summary = data.get('executive_summary', 'No summary available.')
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
        ici_level = data.get('ici_level', 'N/A')
        
        elements.append(Paragraph(
            f"<b>ICI Score:</b> {ici_score}/100 ({ici_level})",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph(
            "The Innovation Confidence Index (ICI) measures the overall potential and readiness of the innovation across five key dimensions.",
            self.styles['BodyText']
        ))
        
        return elements
    
    def _create_ceo_insights_section(self, data: Dict[str, Any]) -> List:
        """Create CEO Insights section"""
        elements = []
        
        elements.append(Paragraph("CEO Insights", self.styles['Heading1']))
        elements.append(Spacer(1, 0.2*inch))
        
        insights = data.get('ceo_insights', [])
        
        if not insights:
            elements.append(Paragraph("No insights available.", self.styles['BodyText']))
        else:
            for i, insight in enumerate(insights[:10], 1):  # Limit to top 10
                insight_text = insight.get('insight', '')
                impact = insight.get('impact', '')
                priority = insight.get('priority', 'MEDIUM')
                
                elements.append(Paragraph(
                    f"<b>{i}. {insight_text}</b>",
                    self.styles['BodyText']
                ))
                elements.append(Paragraph(
                    f"Impact: {impact}",
                    self.styles['BodyText']
                ))
                elements.append(Paragraph(
                    f"Priority: {priority}",
                    self.styles['BodyText']
                ))
                elements.append(Spacer(1, 0.1*inch))
        
        return elements
    
    def _create_roadmap_section(self, data: Dict[str, Any]) -> List:
        """Create Actionable Roadmap section"""
        elements = []
        
        elements.append(Paragraph("Actionable Roadmap", self.styles['Heading1']))
        elements.append(Spacer(1, 0.2*inch))
        
        roadmap = data.get('roadmap', {})
        steps = roadmap.get('steps', [])
        
        if not steps:
            elements.append(Paragraph("No roadmap steps available.", self.styles['BodyText']))
        else:
            for i, step in enumerate(steps, 1):
                title = step.get('title', 'Untitled Step')
                description = step.get('description', '')
                timeline = step.get('timeline', 'N/A')
                
                elements.append(Paragraph(
                    f"<b>Step {i}: {title}</b>",
                    self.styles['Heading3']
                ))
                elements.append(Paragraph(description, self.styles['BodyText']))
                elements.append(Paragraph(
                    f"Timeline: {timeline}",
                    self.styles['BodyText']
                ))
                elements.append(Spacer(1, 0.15*inch))
        
        return elements
    
    def _create_investment_section(self, data: Dict[str, Any]) -> List:
        """Create Investment Analysis section"""
        elements = []
        
        elements.append(Paragraph("Investment Analysis", self.styles['Heading1']))
        elements.append(Spacer(1, 0.2*inch))
        
        investment = data.get('investment', {})
        
        elements.append(Paragraph(
            f"<b>Valuation Range:</b> {investment.get('valuation_range', 'N/A')}",
            self.styles['BodyText']
        ))
        elements.append(Paragraph(
            f"<b>Funding Potential:</b> {investment.get('funding_potential', 'N/A')}",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.2*inch))
        
        recommended_investors = investment.get('recommended_investors', [])
        if recommended_investors:
            elements.append(Paragraph(
                "<b>Recommended Investors:</b>",
                self.styles['Heading3']
            ))
            
            for investor in recommended_investors[:5]:  # Limit to top 5
                name = investor.get('name', 'Unknown')
                probability = investor.get('probability', 0)
                amount = investor.get('amount', 'N/A')
                
                elements.append(Paragraph(
                    f"• {name} (Probability: {probability*100:.0f}%, Amount: {amount})",
                    self.styles['BodyText']
                ))
        
        return elements
    
    def _create_critical_path_section(self, data: Dict[str, Any]) -> List:
        """Create Critical Path section"""
        elements = []
        
        elements.append(Paragraph("Critical Path to Success", self.styles['Heading1']))
        elements.append(Spacer(1, 0.2*inch))
        
        critical_path = data.get('critical_path', [])
        
        if not critical_path:
            elements.append(Paragraph("No critical path data available.", self.styles['BodyText']))
        else:
            for i, milestone in enumerate(critical_path, 1):
                title = milestone.get('title', 'Untitled Milestone')
                description = milestone.get('description', '')
                duration = milestone.get('duration', 'N/A')
                
                elements.append(Paragraph(
                    f"<b>Milestone {i}: {title}</b>",
                    self.styles['Heading3']
                ))
                elements.append(Paragraph(description, self.styles['BodyText']))
                elements.append(Paragraph(
                    f"Duration: {duration}",
                    self.styles['BodyText']
                ))
                elements.append(Spacer(1, 0.15*inch))
        
        return elements


def export_to_pdf(analysis_data: Dict[str, Any], output_path: str) -> str:
    """
    Main function to export strategic analysis to PDF
    
    Args:
        analysis_data: Strategic analysis data dictionary
        output_path: Path where PDF should be saved
        
    Returns:
        Path to generated PDF file
    """
    exporter = StrategicAnalysisPDFExporter()
    return exporter.generate_report(analysis_data, output_path)


if __name__ == "__main__":
    # Test with sample data
    sample_data = {
        'project_title': 'Test Innovation Project',
        'ici_score': 65.5,
        'irl_score': 58.2,
        'success_probability': 0.72,
        'risk_level': 'MEDIUM',
        'investor_appeal': 'HIGH',
        'executive_summary': 'This project shows promising potential with strong market fit and execution readiness.',
        'dimensions': {
            'success_probability': 72.0,
            'market_fit': 68.5,
            'execution_readiness': 65.0,
            'investor_readiness': 58.2,
            'financial_sustainability': 52.0
        },
        'ceo_insights': [
            {
                'insight': 'Strong market demand validates product-market fit',
                'impact': 'High positive impact on success probability',
                'priority': 'HIGH'
            }
        ],
        'roadmap': {
            'steps': [
                {
                    'title': 'Secure Seed Funding',
                    'description': 'Approach angel investors and accelerator programs',
                    'timeline': '2-3 months'
                }
            ]
        },
        'investment': {
            'valuation_range': '5M - 10M SAR',
            'funding_potential': '1M - 2M SAR',
            'recommended_investors': [
                {
                    'name': 'Angel Investors',
                    'probability': 0.35,
                    'amount': '500K SAR'
                }
            ]
        },
        'critical_path': [
            {
                'title': 'Product Development',
                'description': 'Complete MVP and initial testing',
                'duration': '3-4 months'
            }
        ]
    }
    
    output = export_to_pdf(sample_data, '/tmp/test_report.pdf')
    print(f"PDF generated: {output}")
