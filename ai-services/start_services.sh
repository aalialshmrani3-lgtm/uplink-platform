#!/bin/bash
# Start all AI microservices

echo "🚀 Starting UPLINK AI Services..."

# Start Sentiment Analysis (Port 8001)
cd /home/ubuntu/uplink-platform/ai-services/sentiment
python3 main.py > /tmp/sentiment_service.log 2>&1 &
SENTIMENT_PID=$!
echo "✅ Sentiment Analysis started (PID: $SENTIMENT_PID, Port: 8001)"

# Start Success Prediction (Port 8002)
cd /home/ubuntu/uplink-platform/ai-services/prediction
python3 main.py > /tmp/prediction_service.log 2>&1 &
PREDICTION_PID=$!
echo "✅ Success Prediction started (PID: $PREDICTION_PID, Port: 8002)"

# Start Idea Suggestion (Port 8003)
cd /home/ubuntu/uplink-platform/ai-services/suggestion
python3 main.py > /tmp/suggestion_service.log 2>&1 &
SUGGESTION_PID=$!
echo "✅ Idea Suggestion started (PID: $SUGGESTION_PID, Port: 8003)"

# Save PIDs
echo "$SENTIMENT_PID" > /tmp/ai_services_pids.txt
echo "$PREDICTION_PID" >> /tmp/ai_services_pids.txt
echo "$SUGGESTION_PID" >> /tmp/ai_services_pids.txt

echo ""
echo "🎉 All AI services started successfully!"
echo "📝 Logs:"
echo "  - Sentiment: /tmp/sentiment_service.log"
echo "  - Prediction: /tmp/prediction_service.log"
echo "  - Suggestion: /tmp/suggestion_service.log"
