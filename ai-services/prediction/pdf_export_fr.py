"""
PDF Export Service for Strategic Analysis Reports - FRENCH VERSION
Generates professional PDF reports from strategic analysis data in French
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


class StrategicAnalysisPDFExporterFR:
    """French PDF Exporter for Strategic Analysis Reports"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup custom paragraph styles for French"""
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
            name='FrenchHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=12,
            alignment=TA_LEFT
        ))
        
        # Body style
        self.styles.add(ParagraphStyle(
            name='FrenchBody',
            parent=self.styles['BodyText'],
            fontSize=11,
            alignment=TA_LEFT,
            spaceAfter=6
        ))
    
    def generate_report(self, analysis_data: Dict[str, Any], output_path: str) -> str:
        """
        Generate French PDF report from strategic analysis data
        
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
            "UPLINK 5.0 - Rapport d'Analyse Stratégique",
            self.styles['CustomTitle']
        )
        elements.append(title)
        elements.append(Spacer(1, 0.5*inch))
        
        # Project Title
        project_title = data.get('project_title', 'Projet Sans Titre')
        elements.append(Paragraph(
            f"<b>{project_title}</b>",
            self.styles['Heading2']
        ))
        elements.append(Spacer(1, 0.3*inch))
        
        # Metadata Table
        metadata = [
            ['Date du Rapport:', datetime.now().strftime('%Y-%m-%d %H:%M')],
            ['Score ICI:', f"{data.get('ici_score', 0)}/100"],
            ['Score IRL:', f"{data.get('irl_score', 0)}/100"],
            ['Probabilité de Succès:', f"{data.get('success_probability', 0)*100:.1f}%"],
            ['Niveau de Risque:', data.get('risk_level', 'N/A')],
            ['Attrait pour les Investisseurs:', data.get('investor_appeal', 'N/A')]
        ]
        
        t = Table(metadata, colWidths=[2.5*inch, 2.5*inch])
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
            "<i>Généré par UPLINK 5.0 - Plateforme Nationale d'Innovation</i>",
            self.styles['Normal']
        ))
        
        return elements
    
    def _create_executive_summary(self, data: Dict[str, Any]) -> List:
        """Create executive summary section"""
        elements = []
        
        elements.append(Paragraph("Résumé Exécutif", self.styles['Heading1']))
        elements.append(Spacer(1, 0.2*inch))
        
        summary = data.get('executive_summary_fr', 
                          data.get('executive_summary', 
                                  "Cette analyse stratégique fournit des informations complètes sur le potentiel d'innovation, la préparation au marché et la viabilité d'investissement du projet."))
        elements.append(Paragraph(summary, self.styles['BodyText']))
        elements.append(Spacer(1, 0.3*inch))
        
        # Key Metrics Table
        dimensions = data.get('dimensions', {})
        metrics_data = [
            ['Métrique', 'Score'],
            ['Probabilité de Succès', f"{dimensions.get('success_probability', 0):.1f}/100"],
            ['Adéquation au Marché', f"{dimensions.get('market_fit', 0):.1f}/100"],
            ['Préparation à l\'Exécution', f"{dimensions.get('execution_readiness', 0):.1f}/100"],
            ['Préparation aux Investisseurs', f"{dimensions.get('investor_readiness', 0):.1f}/100"],
            ['Durabilité Financière', f"{dimensions.get('financial_sustainability', 0):.1f}/100"]
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
            "Indice de Confiance en l'Innovation (ICI)",
            self.styles['Heading1']
        ))
        elements.append(Spacer(1, 0.2*inch))
        
        ici_score = data.get('ici_score', 0)
        
        elements.append(Paragraph(
            f"<b>Score ICI:</b> {ici_score}/100",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph(
            "L'Indice de Confiance en l'Innovation (ICI) mesure le potentiel global et la préparation de l'innovation à travers cinq dimensions clés:",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.1*inch))
        
        # Five Dimensions
        dimensions_text = [
            "<b>1. Stratégie d'Innovation:</b> Alignement avec les objectifs organisationnels et les besoins du marché",
            "<b>2. Ressources et Capacités:</b> Disponibilité des ressources et compétences nécessaires",
            "<b>3. Processus d'Innovation:</b> Efficacité des processus de gestion de l'innovation",
            "<b>4. Culture d'Innovation:</b> Culture organisationnelle soutenant l'innovation",
            "<b>5. Impact de l'Innovation:</b> Impact attendu sur le marché et les parties prenantes"
        ]
        
        for dim in dimensions_text:
            elements.append(Paragraph(dim, self.styles['BodyText']))
            elements.append(Spacer(1, 0.05*inch))
        
        return elements
    
    def _create_ceo_insights_section(self, data: Dict[str, Any]) -> List:
        """Create CEO Insights section"""
        elements = []
        
        elements.append(Paragraph("Perspectives pour les Dirigeants", self.styles['Heading1']))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph(
            "Informations stratégiques traduites de l'analyse IA en recommandations de niveau exécutif:",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.2*inch))
        
        insights = data.get('ceo_insights', [])
        
        if not insights:
            elements.append(Paragraph("Aucune perspective disponible.", self.styles['BodyText']))
        else:
            for i, insight in enumerate(insights[:10], 1):  # Limit to top 10
                insight_text = insight.get('insight_fr', insight.get('insight_en', insight.get('insight', '')))
                impact = insight.get('impact_fr', insight.get('impact_en', insight.get('impact', '')))
                priority = insight.get('priority', 'MOYEN')
                
                # Translate priority
                priority_fr = {'HIGH': 'ÉLEVÉE', 'MEDIUM': 'MOYENNE', 'LOW': 'BASSE'}.get(priority, priority)
                
                elements.append(Paragraph(
                    f"<b>{i}. {insight_text}</b>",
                    self.styles['BodyText']
                ))
                elements.append(Paragraph(
                    f"<i>Impact:</i> {impact}",
                    self.styles['BodyText']
                ))
                elements.append(Paragraph(
                    f"<i>Priorité:</i> {priority_fr}",
                    self.styles['BodyText']
                ))
                elements.append(Spacer(1, 0.15*inch))
        
        return elements
    
    def _create_roadmap_section(self, data: Dict[str, Any]) -> List:
        """Create Actionable Roadmap section"""
        elements = []
        
        elements.append(Paragraph("Feuille de Route Actionnable", self.styles['Heading1']))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph(
            "Plan de mise en œuvre étape par étape basé sur les normes ISO 56002 de Gestion de l'Innovation:",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.2*inch))
        
        roadmap = data.get('roadmap', {})
        steps = roadmap.get('steps', [])
        
        if not steps:
            elements.append(Paragraph("Aucune étape de feuille de route disponible.", self.styles['BodyText']))
        else:
            for i, step in enumerate(steps, 1):
                title = step.get('title_fr', step.get('title_en', step.get('title', 'Étape Sans Titre')))
                description = step.get('description_fr', step.get('description_en', step.get('description', '')))
                timeline = step.get('timeline', 'N/A')
                
                elements.append(Paragraph(
                    f"<b>Étape {i}: {title}</b>",
                    self.styles['Heading3']
                ))
                elements.append(Paragraph(description, self.styles['BodyText']))
                elements.append(Paragraph(
                    f"<i>Calendrier:</i> {timeline}",
                    self.styles['BodyText']
                ))
                elements.append(Spacer(1, 0.15*inch))
        
        return elements
    
    def _create_investment_section(self, data: Dict[str, Any]) -> List:
        """Create Investment Analysis section"""
        elements = []
        
        elements.append(Paragraph("Analyse d'Investissement", self.styles['Heading1']))
        elements.append(Spacer(1, 0.2*inch))
        
        irl_score = data.get('irl_score', 0)
        elements.append(Paragraph(
            f"<b>Niveau de Préparation aux Investisseurs (IRL):</b> {irl_score}/100",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph(
            "Le Niveau de Préparation aux Investisseurs (IRL) évalue la préparation du projet pour l'investissement sur la base de six critères alignés sur les normes des capital-risqueurs saoudiens:",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.1*inch))
        
        # Six IRL Criteria
        criteria_text = [
            "<b>1. Validation du Marché:</b> Preuve de la demande du marché et validation client",
            "<b>2. Force de l'Équipe:</b> Compétence et complétude de l'équipe fondatrice",
            "<b>3. Modèle Financier:</b> Clarté et viabilité du modèle d'affaires",
            "<b>4. Métriques de Traction:</b> Indicateurs de croissance et métriques de performance clés",
            "<b>5. Avantage Concurrentiel:</b> Proposition de valeur unique et différenciation",
            "<b>6. Potentiel d'Évolutivité:</b> Capacité à faire évoluer les opérations et les revenus"
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
                "<b>Types d'Investisseurs Recommandés:</b>",
                self.styles['Heading3']
            ))
            elements.append(Spacer(1, 0.1*inch))
            
            for investor in recommended_investors[:5]:
                investor_name = investor.get('name_fr', investor.get('name_en', investor.get('name', '')))
                rationale = investor.get('rationale_fr', investor.get('rationale_en', investor.get('rationale', '')))
                
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
        
        elements.append(Paragraph("Facteurs Critiques de Succès", self.styles['Heading1']))
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(Paragraph(
            "Facteurs clés qui détermineront le succès ou l'échec de cette innovation:",
            self.styles['BodyText']
        ))
        elements.append(Spacer(1, 0.2*inch))
        
        critical_path = data.get('critical_path', [])
        
        if not critical_path:
            elements.append(Paragraph("Aucun facteur critique identifié.", self.styles['BodyText']))
        else:
            for i, factor in enumerate(critical_path, 1):
                factor_text = factor.get('factor_fr', factor.get('factor_en', factor.get('factor', '')))
                importance = factor.get('importance_fr', factor.get('importance_en', factor.get('importance', '')))
                
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


def export_to_pdf_fr(analysis_data: Dict[str, Any], output_path: str) -> str:
    """
    Convenience function to export strategic analysis to French PDF
    
    Args:
        analysis_data: Strategic analysis data dictionary
        output_path: Path where PDF should be saved
        
    Returns:
        Path to generated PDF file
    """
    exporter = StrategicAnalysisPDFExporterFR()
    return exporter.generate_report(analysis_data, output_path)


if __name__ == '__main__':
    # Test with sample data
    sample_data = {
        'project_title': 'Plateforme de Santé Alimentée par l\'IA',
        'ici_score': 72.5,
        'irl_score': 68.3,
        'success_probability': 0.75,
        'risk_level': 'MOYEN',
        'investor_appeal': 'ÉLEVÉ',
        'executive_summary_fr': 'Cette plateforme de santé innovante exploite l\'IA pour améliorer les résultats des patients.',
        'dimensions': {
            'success_probability': 75.0,
            'market_fit': 70.0,
            'execution_readiness': 68.0,
            'investor_readiness': 68.3,
            'financial_sustainability': 65.0
        },
        'ceo_insights': [
            {
                'insight_fr': 'Forte demande du marché pour les solutions de santé IA',
                'impact_fr': 'Potentiel élevé pour une acquisition rapide d\'utilisateurs',
                'priority': 'HIGH'
            }
        ],
        'roadmap': {
            'steps': [
                {
                    'title_fr': 'Validation du Marché',
                    'description_fr': 'Mener des études pilotes avec les prestataires de soins de santé',
                    'timeline': '3 mois'
                }
            ]
        },
        'investment': {
            'recommended_investors': [
                {
                    'name_fr': 'Capital-risqueurs axés sur la santé',
                    'rationale_fr': 'Expertise spécialisée en technologie de la santé'
                }
            ]
        },
        'critical_path': [
            {
                'factor_fr': 'Conformité réglementaire',
                'importance_fr': 'Critique pour l\'entrée sur le marché'
            }
        ]
    }
    
    output_file = '/tmp/test_strategic_analysis_fr.pdf'
    result = export_to_pdf_fr(sample_data, output_file)
    print(f"✅ French PDF generated: {result}")
