"""
What-If Simulator for UPLINK 5.0
Allows users to simulate different scenarios and see their impact on ICI and IRL
"""

import copy
from typing import Dict, List, Any
from strategic_bridge_protocol import StrategicBridgeProtocol

class WhatIfSimulator:
    """
    Simulates "what-if" scenarios by modifying project features
    and analyzing the impact on ICI, IRL, and other metrics
    """
    
    def __init__(self):
        self.strategic_bridge = StrategicBridgeProtocol()
        
    def simulate_scenario(
        self,
        baseline_features: Dict[str, Any],
        modifications: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Simulate a what-if scenario
        
        Args:
            baseline_features: Original project features
            modifications: Changes to apply (e.g., {'budget': '+50000', 'team_size': '+2'})
            
        Returns:
            Comparison between baseline and modified scenario
        """
        # Analyze baseline
        baseline_result = self.strategic_bridge.analyze_project(baseline_features)
        baseline_analysis = baseline_result.to_dict() if hasattr(baseline_result, 'to_dict') else baseline_result
        
        # Apply modifications
        modified_features = self._apply_modifications(baseline_features, modifications)
        
        # Analyze modified scenario
        modified_result = self.strategic_bridge.analyze_project(modified_features)
        modified_analysis = modified_result.to_dict() if hasattr(modified_result, 'to_dict') else modified_result
        
        # Calculate impact
        impact = self._calculate_impact(baseline_analysis, modified_analysis)
        
        return {
            'baseline': {
                'ici_score': baseline_analysis['ici_score'],
                'irl_score': baseline_analysis['irl_score'],
                'success_probability': baseline_analysis['success_probability']
            },
            'modified': {
                'ici_score': modified_analysis['ici_score'],
                'irl_score': modified_analysis['irl_score'],
                'success_probability': modified_analysis['success_probability']
            },
            'impact': impact,
            'modifications': modifications,
            'modified_features': modified_features,
            'full_analysis': modified_analysis
        }
    
    def simulate_multiple_scenarios(
        self,
        baseline_features: Dict[str, Any],
        scenarios: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Simulate multiple what-if scenarios
        
        Args:
            baseline_features: Original project features
            scenarios: List of modification dictionaries
            
        Returns:
            List of scenario results
        """
        results = []
        
        for i, modifications in enumerate(scenarios):
            scenario_name = modifications.get('name', f'Scenario {i+1}')
            result = self.simulate_scenario(baseline_features, modifications)
            result['scenario_name'] = scenario_name
            results.append(result)
        
        # Rank scenarios by improvement
        results.sort(key=lambda x: x['impact']['ici_improvement'], reverse=True)
        
        return results
    
    def _apply_modifications(
        self,
        features: Dict[str, Any],
        modifications: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Apply modifications to features
        
        Supports:
        - Absolute values: {'budget': 500000}
        - Relative changes: {'budget': '+100000', 'team_size': '+2'}
        - Percentage changes: {'budget': '+20%', 'market_demand': '+15%'}
        """
        modified = copy.deepcopy(features)
        
        for key, value in modifications.items():
            if key == 'name':  # Skip scenario name
                continue
                
            if key not in modified:
                continue
            
            original_value = self._to_float(modified[key])
            
            if isinstance(value, str):
                if value.startswith('+') or value.startswith('-'):
                    # Relative change
                    if '%' in value:
                        # Percentage change
                        percentage = float(value.replace('%', '')) / 100
                        new_value = original_value * (1 + percentage)
                    else:
                        # Absolute change
                        change = float(value)
                        new_value = original_value + change
                else:
                    # Absolute value
                    new_value = float(value)
            else:
                # Direct value
                new_value = float(value)
            
            # Ensure non-negative
            new_value = max(0, new_value)
            
            # Convert back to appropriate type
            if isinstance(modified[key], int):
                modified[key] = int(new_value)
            elif isinstance(modified[key], str):
                if '.' in str(new_value):
                    modified[key] = str(new_value)
                else:
                    modified[key] = str(int(new_value))
            else:
                modified[key] = new_value
        
        return modified
    
    def _calculate_impact(
        self,
        baseline: Dict[str, Any],
        modified: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculate the impact of modifications
        """
        ici_improvement = modified['ici_score'] - baseline['ici_score']
        irl_improvement = modified['irl_score'] - baseline['irl_score']
        success_improvement = modified['success_probability'] - baseline['success_probability']
        
        # Calculate dimension changes
        dimension_changes = {}
        for dim_key in baseline['dimensions']:
            baseline_val = baseline['dimensions'][dim_key]
            modified_val = modified['dimensions'][dim_key]
            dimension_changes[dim_key] = {
                'baseline': baseline_val,
                'modified': modified_val,
                'change': modified_val - baseline_val,
                'change_pct': ((modified_val - baseline_val) / baseline_val * 100) if baseline_val > 0 else 0
            }
        
        # Determine overall impact level
        if ici_improvement >= 10:
            impact_level = 'MAJOR_POSITIVE'
        elif ici_improvement >= 5:
            impact_level = 'MODERATE_POSITIVE'
        elif ici_improvement >= 1:
            impact_level = 'MINOR_POSITIVE'
        elif ici_improvement <= -10:
            impact_level = 'MAJOR_NEGATIVE'
        elif ici_improvement <= -5:
            impact_level = 'MODERATE_NEGATIVE'
        elif ici_improvement <= -1:
            impact_level = 'MINOR_NEGATIVE'
        else:
            impact_level = 'NEGLIGIBLE'
        
        return {
            'ici_improvement': round(ici_improvement, 2),
            'irl_improvement': round(irl_improvement, 2),
            'success_improvement': round(success_improvement, 4),
            'dimension_changes': dimension_changes,
            'impact_level': impact_level,
            'recommendation': self._generate_recommendation(impact_level, ici_improvement)
        }
    
    def _generate_recommendation(self, impact_level: str, ici_improvement: float) -> str:
        """Generate recommendation based on impact"""
        recommendations = {
            'MAJOR_POSITIVE': f'تحسن كبير (+{ici_improvement:.1f}) - يُنصح بشدة بتنفيذ هذه التعديلات',
            'MODERATE_POSITIVE': f'تحسن ملحوظ (+{ici_improvement:.1f}) - يُنصح بتنفيذ هذه التعديلات',
            'MINOR_POSITIVE': f'تحسن طفيف (+{ici_improvement:.1f}) - يمكن النظر في هذه التعديلات',
            'NEGLIGIBLE': 'تأثير ضئيل - لا توجد فائدة كبيرة من هذه التعديلات',
            'MINOR_NEGATIVE': f'تأثير سلبي طفيف ({ici_improvement:.1f}) - يُنصح بتجنب هذه التعديلات',
            'MODERATE_NEGATIVE': f'تأثير سلبي ملحوظ ({ici_improvement:.1f}) - يجب تجنب هذه التعديلات',
            'MAJOR_NEGATIVE': f'تأثير سلبي كبير ({ici_improvement:.1f}) - يجب تجنب هذه التعديلات بشدة'
        }
        return recommendations.get(impact_level, 'غير محدد')
    
    def _to_float(self, value: Any) -> float:
        """Convert value to float, handling strings with % or other formats"""
        if isinstance(value, (int, float)):
            return float(value)
        if isinstance(value, str):
            # Remove % if present
            value = value.replace('%', '')
            # Remove commas
            value = value.replace(',', '')
            try:
                return float(value)
            except ValueError:
                return 0.0
        return 0.0

# Example usage
if __name__ == "__main__":
    simulator = WhatIfSimulator()
    
    # Baseline project
    baseline = {
        'title': 'مشروع تجريبي',
        'description': 'وصف المشروع',
        'budget': '150000',
        'team_size': '3',
        'timeline_months': '6',
        'market_demand': '35',
        'technical_feasibility': '75',
        'user_engagement': '40',
        'hypothesis_validation_rate': '0.2',
        'rat_completion_rate': '0.3',
        'user_count': '0',
        'revenue_growth': '0'
    }
    
    # Define scenarios
    scenarios = [
        {
            'name': 'زيادة الميزانية 50%',
            'budget': '+75000'
        },
        {
            'name': 'توظيف 2 أعضاء جدد',
            'team_size': '+2'
        },
        {
            'name': 'تحسين التحقق من الفرضيات',
            'hypothesis_validation_rate': '+0.3'
        },
        {
            'name': 'سيناريو شامل',
            'budget': '+100000',
            'team_size': '+2',
            'hypothesis_validation_rate': '+0.4',
            'rat_completion_rate': '+0.4'
        }
    ]
    
    # Run simulations
    results = simulator.simulate_multiple_scenarios(baseline, scenarios)
    
    print("\n=== What-If Simulation Results ===\n")
    for result in results:
        print(f"Scenario: {result['scenario_name']}")
        print(f"  ICI: {result['baseline']['ici_score']:.1f} → {result['modified']['ici_score']:.1f} ({result['impact']['ici_improvement']:+.1f})")
        print(f"  IRL: {result['baseline']['irl_score']:.1f} → {result['modified']['irl_score']:.1f} ({result['impact']['irl_improvement']:+.1f})")
        print(f"  Impact: {result['impact']['impact_level']}")
        print(f"  Recommendation: {result['impact']['recommendation']}")
        print()
