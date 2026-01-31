#!/usr/bin/env python3
"""
UPLINK 5.0 - Testing Dashboard
Interactive Streamlit dashboard for testing AI prediction system with SHAP explanations
"""

import streamlit as st
import requests
import json
import matplotlib.pyplot as plt
import pandas as pd
from typing import Dict, Any, Optional
import os

# ============================================================================
# CONFIGURATION
# ============================================================================

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")
JWT_TOKEN = os.getenv("JWT_TOKEN", "")  # Set via environment or manual input

# Arabic font configuration for matplotlib
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['axes.unicode_minus'] = False

# ============================================================================
# API FUNCTIONS
# ============================================================================

def get_headers() -> Dict[str, str]:
    """Get API request headers with JWT token"""
    return {
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }


def predict_idea(idea_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Call /predict endpoint"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/predict",
            headers=get_headers(),
            json=idea_data,
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        st.error(f"❌ Prediction Error: {e}")
        return None


def explain_prediction(idea_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Call /explain endpoint"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/explain",
            headers=get_headers(),
            json=idea_data,
            timeout=60  # SHAP can take longer
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        st.error(f"❌ Explanation Error: {e}")
        return None


# ============================================================================
# VISUALIZATION FUNCTIONS
# ============================================================================

def plot_shap_waterfall(shap_values: Dict[str, float], base_value: float, prediction: float):
    """Plot SHAP waterfall chart"""
    # Sort by absolute value
    sorted_features = sorted(shap_values.items(), key=lambda x: abs(x[1]), reverse=True)
    
    features = [f[0] for f in sorted_features[:10]]  # Top 10
    values = [f[1] for f in sorted_features[:10]]
    
    # Create waterfall chart
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Calculate cumulative values
    cumulative = [base_value]
    for v in values:
        cumulative.append(cumulative[-1] + v)
    
    # Plot bars
    colors = ['green' if v > 0 else 'red' for v in values]
    y_pos = range(len(features))
    
    for i, (feature, value, color) in enumerate(zip(features, values, colors)):
        ax.barh(i, value, left=cumulative[i], color=color, alpha=0.7)
        ax.text(cumulative[i] + value/2, i, f'{value:+.2f}', 
                ha='center', va='center', fontsize=9, fontweight='bold')
    
    # Add base value and prediction lines
    ax.axvline(base_value, color='blue', linestyle='--', linewidth=2, label=f'Base: {base_value:.2f}')
    ax.axvline(prediction, color='purple', linestyle='--', linewidth=2, label=f'Prediction: {prediction:.2f}')
    
    ax.set_yticks(y_pos)
    ax.set_yticklabels(features)
    ax.set_xlabel('SHAP Value Contribution', fontsize=12, fontweight='bold')
    ax.set_title('SHAP Waterfall Chart - Feature Contributions', fontsize=14, fontweight='bold')
    ax.legend()
    ax.grid(axis='x', alpha=0.3)
    
    plt.tight_layout()
    return fig


def plot_shap_bar(shap_values: Dict[str, float]):
    """Plot SHAP bar chart"""
    # Sort by absolute value
    sorted_features = sorted(shap_values.items(), key=lambda x: abs(x[1]), reverse=True)
    
    features = [f[0] for f in sorted_features[:15]]  # Top 15
    values = [f[1] for f in sorted_features[:15]]
    
    fig, ax = plt.subplots(figsize=(10, 8))
    
    colors = ['green' if v > 0 else 'red' for v in values]
    y_pos = range(len(features))
    
    ax.barh(y_pos, values, color=colors, alpha=0.7)
    ax.set_yticks(y_pos)
    ax.set_yticklabels(features)
    ax.set_xlabel('SHAP Value', fontsize=12, fontweight='bold')
    ax.set_title('SHAP Feature Importance', fontsize=14, fontweight='bold')
    ax.axvline(0, color='black', linestyle='-', linewidth=0.8)
    ax.grid(axis='x', alpha=0.3)
    
    plt.tight_layout()
    return fig


def plot_prediction_gauge(success_probability: float):
    """Plot success probability gauge"""
    fig, ax = plt.subplots(figsize=(8, 4), subplot_kw={'projection': 'polar'})
    
    # Gauge parameters
    theta = success_probability * 180  # 0-180 degrees
    
    # Background arc (0-180 degrees)
    theta_bg = [i * (180/100) for i in range(101)]
    r_bg = [1] * 101
    
    # Color gradient
    colors_bg = plt.cm.RdYlGn([i/100 for i in range(101)])
    
    for i in range(100):
        ax.bar([theta_bg[i] * 3.14159/180], [1], 
               width=1.8*3.14159/180, bottom=0, 
               color=colors_bg[i], alpha=0.7)
    
    # Needle
    ax.plot([0, theta * 3.14159/180], [0, 0.9], 
            color='black', linewidth=3)
    ax.plot([theta * 3.14159/180], [0.9], 
            marker='o', markersize=10, color='black')
    
    # Labels
    ax.set_theta_zero_location('W')
    ax.set_theta_direction(1)
    ax.set_ylim(0, 1)
    ax.set_yticks([])
    ax.set_xticks([0, 3.14159/4, 3.14159/2, 3*3.14159/4, 3.14159])
    ax.set_xticklabels(['0%', '25%', '50%', '75%', '100%'])
    ax.set_title(f'Success Probability: {success_probability*100:.1f}%', 
                 fontsize=16, fontweight='bold', pad=20)
    
    plt.tight_layout()
    return fig


# ============================================================================
# STREAMLIT APP
# ============================================================================

def main():
    st.set_page_config(
        page_title="UPLINK 5.0 - AI Testing Dashboard",
        page_icon="🚀",
        layout="wide"
    )
    
    # Header
    st.title("🚀 UPLINK 5.0 - AI Prediction Testing Dashboard")
    st.markdown("---")
    
    # Sidebar - Configuration
    with st.sidebar:
        st.header("⚙️ Configuration")
        
        api_url = st.text_input("API Base URL", value=API_BASE_URL)
        jwt_token = st.text_input("JWT Token", value=JWT_TOKEN, type="password")
        
        if jwt_token:
            global JWT_TOKEN
            JWT_TOKEN = jwt_token
        
        st.markdown("---")
        st.header("📊 Quick Stats")
        st.metric("Model Version", "v2.0")
        st.metric("Feature Dimensions", "42D")
        st.metric("Semantic Embeddings", "32D (AraBERT)")
        
        st.markdown("---")
        st.header("📚 Resources")
        st.markdown("[STATUS_REPORT_V2.md](STATUS_REPORT_V2.md)")
        st.markdown("[README.md](README.md)")
    
    # Main content
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.header("📝 Project Input")
        
        # Input form
        with st.form("idea_form"):
            title = st.text_input(
                "Project Title (Arabic/English)",
                value="منصة تعليم إلكتروني للذكاء الاصطناعي",
                help="Enter the project title in Arabic or English"
            )
            
            description = st.text_area(
                "Project Description",
                value="منصة تعليمية تفاعلية متخصصة في تعليم الذكاء الاصطناعي والتعلم الآلي للطلاب والمهنيين مع مشاريع عملية ومسارات تعليمية مخصصة",
                height=150,
                help="Detailed description of the project"
            )
            
            st.subheader("Project Features")
            
            col_a, col_b = st.columns(2)
            
            with col_a:
                budget = st.number_input(
                    "Budget ($)",
                    min_value=1000,
                    max_value=10000000,
                    value=250000,
                    step=10000
                )
                
                team_size = st.number_input(
                    "Team Size",
                    min_value=1,
                    max_value=100,
                    value=8
                )
                
                timeline_months = st.number_input(
                    "Timeline (months)",
                    min_value=1,
                    max_value=60,
                    value=12
                )
                
                market_demand = st.slider(
                    "Market Demand",
                    min_value=0,
                    max_value=100,
                    value=75
                )
                
                technical_feasibility = st.slider(
                    "Technical Feasibility",
                    min_value=0,
                    max_value=100,
                    value=80
                )
            
            with col_b:
                competitive_advantage = st.slider(
                    "Competitive Advantage",
                    min_value=0,
                    max_value=100,
                    value=65
                )
                
                user_engagement = st.slider(
                    "User Engagement",
                    min_value=0,
                    max_value=100,
                    value=70
                )
                
                tags_count = st.number_input(
                    "Tags Count",
                    min_value=0,
                    max_value=20,
                    value=8
                )
                
                hypothesis_validation_rate = st.slider(
                    "Hypothesis Validation Rate",
                    min_value=0.0,
                    max_value=1.0,
                    value=0.7,
                    step=0.05
                )
                
                rat_completion_rate = st.slider(
                    "RAT Completion Rate",
                    min_value=0.0,
                    max_value=1.0,
                    value=0.65,
                    step=0.05
                )
            
            submitted = st.form_submit_button("🚀 Predict Success", use_container_width=True)
    
    with col2:
        st.header("📊 Prediction Results")
        
        if submitted:
            # Prepare idea data
            idea_data = {
                "title": title,
                "description": description,
                "budget": budget,
                "team_size": team_size,
                "timeline_months": timeline_months,
                "market_demand": market_demand,
                "technical_feasibility": technical_feasibility,
                "competitive_advantage": competitive_advantage,
                "user_engagement": user_engagement,
                "tags_count": tags_count,
                "hypothesis_validation_rate": hypothesis_validation_rate,
                "rat_completion_rate": rat_completion_rate,
            }
            
            with st.spinner("🔮 Predicting success probability..."):
                prediction_result = predict_idea(idea_data)
            
            if prediction_result:
                success_prob = prediction_result.get("success_probability", 0)
                
                # Display gauge
                st.pyplot(plot_prediction_gauge(success_prob))
                
                # Display metrics
                col_m1, col_m2, col_m3 = st.columns(3)
                
                with col_m1:
                    st.metric(
                        "Success Probability",
                        f"{success_prob*100:.1f}%",
                        delta=f"{(success_prob-0.5)*100:+.1f}% vs baseline"
                    )
                
                with col_m2:
                    confidence = prediction_result.get("confidence", 0)
                    st.metric("Confidence", f"{confidence*100:.1f}%")
                
                with col_m3:
                    recommendation = "✅ Proceed" if success_prob > 0.6 else "⚠️ Review" if success_prob > 0.4 else "❌ High Risk"
                    st.metric("Recommendation", recommendation)
                
                st.markdown("---")
                
                # Get SHAP explanation
                with st.spinner("🔍 Generating SHAP explanation..."):
                    explanation_result = explain_prediction(idea_data)
                
                if explanation_result:
                    st.subheader("🧠 SHAP Explainability")
                    
                    # Display explanation text
                    explanation_text = explanation_result.get("explanation", {})
                    
                    if "arabic" in explanation_text:
                        with st.expander("📖 Arabic Explanation", expanded=True):
                            st.markdown(explanation_text["arabic"])
                    
                    if "english" in explanation_text:
                        with st.expander("📖 English Explanation", expanded=False):
                            st.markdown(explanation_text["english"])
                    
                    # Display SHAP visualizations
                    shap_values = explanation_result.get("shap_values", {})
                    base_value = explanation_result.get("base_value", 0.5)
                    
                    if shap_values:
                        st.markdown("---")
                        st.subheader("📊 SHAP Visualizations")
                        
                        # Waterfall chart
                        st.pyplot(plot_shap_waterfall(shap_values, base_value, success_prob))
                        
                        # Bar chart
                        st.pyplot(plot_shap_bar(shap_values))
                        
                        # Feature contributions table
                        st.markdown("---")
                        st.subheader("📋 Feature Contributions")
                        
                        df = pd.DataFrame([
                            {"Feature": k, "SHAP Value": v, "Impact": "Positive ✅" if v > 0 else "Negative ❌"}
                            for k, v in sorted(shap_values.items(), key=lambda x: abs(x[1]), reverse=True)
                        ])
                        
                        st.dataframe(df, use_container_width=True)
    
    # Footer
    st.markdown("---")
    st.markdown(
        """
        <div style='text-align: center; color: gray;'>
        <p>UPLINK 5.0 - National Innovation Platform | AI Services v2.0</p>
        <p>Powered by AraBERT (32D Semantic Embeddings) + SHAP Explainability</p>
        </div>
        """,
        unsafe_allow_html=True
    )


if __name__ == "__main__":
    main()
