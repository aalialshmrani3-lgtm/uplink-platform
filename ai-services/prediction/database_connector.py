"""
UPLINK 5.0 - Database Connector for AI Training
Supports PostgreSQL and MongoDB for fetching training data
"""

import os
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class IdeaOutcome:
    """Data class for idea outcome"""
    idea_id: int
    title: str
    description: str
    budget: float
    team_size: int
    timeline_months: int
    market_demand: int
    technical_feasibility: int
    competitive_advantage: int
    user_engagement: int
    keywords: List[str]
    tags_count: int
    hypothesis_validation_rate: float
    rat_completion_rate: float
    success: bool
    success_score: float
    sector: Optional[str] = None
    organization_name: Optional[str] = None

# ============================================================================
# PostgreSQL Connector
# ============================================================================

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    POSTGRES_AVAILABLE = True
except ImportError:
    POSTGRES_AVAILABLE = False
    logger.warning("psycopg2 not installed. PostgreSQL support disabled.")

class PostgreSQLConnector:
    """PostgreSQL database connector for training data"""
    
    def __init__(self, connection_string: Optional[str] = None):
        """
        Initialize PostgreSQL connector
        
        Args:
            connection_string: PostgreSQL connection string
                Format: "postgresql://user:password@host:port/database"
                If None, reads from DATABASE_URL environment variable
        """
        if not POSTGRES_AVAILABLE:
            raise ImportError("psycopg2 not installed. Install with: pip install psycopg2-binary")
        
        self.connection_string = connection_string or os.getenv("DATABASE_URL")
        if not self.connection_string:
            raise ValueError("DATABASE_URL environment variable not set")
        
        self.conn = None
    
    def connect(self):
        """Establish database connection"""
        try:
            self.conn = psycopg2.connect(self.connection_string)
            logger.info("PostgreSQL connection established")
        except Exception as e:
            logger.error(f"Failed to connect to PostgreSQL: {e}")
            raise
    
    def disconnect(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()
            logger.info("PostgreSQL connection closed")
    
    def fetch_training_data(
        self, 
        limit: Optional[int] = None,
        sector: Optional[str] = None,
        min_success_score: Optional[float] = None
    ) -> List[IdeaOutcome]:
        """
        Fetch training data from ideas_outcomes table
        
        Args:
            limit: Maximum number of records to fetch
            sector: Filter by sector (e.g., "تعليم", "صحة")
            min_success_score: Minimum success score (0.0-1.0)
        
        Returns:
            List of IdeaOutcome objects
        """
        if not self.conn:
            self.connect()
        
        # Build query
        query = """
            SELECT 
                idea_id, title, description, budget, team_size, timeline_months,
                market_demand, technical_feasibility, competitive_advantage, user_engagement,
                keywords, tags_count, hypothesis_validation_rate, rat_completion_rate,
                success, success_score, sector, organization_name
            FROM ideas_outcomes
            WHERE classified_at IS NOT NULL
        """
        
        params = []
        
        if sector:
            query += " AND sector = %s"
            params.append(sector)
        
        if min_success_score is not None:
            query += " AND success_score >= %s"
            params.append(min_success_score)
        
        query += " ORDER BY created_at DESC"
        
        if limit:
            query += " LIMIT %s"
            params.append(limit)
        
        try:
            with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, params)
                rows = cur.fetchall()
                
                logger.info(f"Fetched {len(rows)} training records from PostgreSQL")
                
                # Convert to IdeaOutcome objects
                outcomes = []
                for row in rows:
                    outcomes.append(IdeaOutcome(
                        idea_id=row['idea_id'],
                        title=row['title'],
                        description=row['description'],
                        budget=float(row['budget']),
                        team_size=row['team_size'],
                        timeline_months=row['timeline_months'],
                        market_demand=row['market_demand'],
                        technical_feasibility=row['technical_feasibility'],
                        competitive_advantage=row['competitive_advantage'],
                        user_engagement=row['user_engagement'],
                        keywords=row['keywords'] or [],
                        tags_count=row['tags_count'] or 0,
                        hypothesis_validation_rate=float(row['hypothesis_validation_rate']),
                        rat_completion_rate=float(row['rat_completion_rate']),
                        success=row['success'],
                        success_score=float(row['success_score']),
                        sector=row['sector'],
                        organization_name=row['organization_name']
                    ))
                
                return outcomes
        
        except Exception as e:
            logger.error(f"Failed to fetch training data: {e}")
            raise
    
    def get_statistics(self) -> Dict:
        """Get database statistics"""
        if not self.conn:
            self.connect()
        
        try:
            with self.conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Total records
                cur.execute("SELECT COUNT(*) as total FROM ideas_outcomes")
                total = cur.fetchone()['total']
                
                # Success rate
                cur.execute("""
                    SELECT 
                        AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END) as success_rate,
                        AVG(success_score) as avg_success_score
                    FROM ideas_outcomes
                """)
                stats = cur.fetchone()
                
                # By sector
                cur.execute("""
                    SELECT sector, COUNT(*) as count
                    FROM ideas_outcomes
                    WHERE sector IS NOT NULL
                    GROUP BY sector
                    ORDER BY count DESC
                """)
                sectors = cur.fetchall()
                
                return {
                    'total_records': total,
                    'success_rate': float(stats['success_rate']) if stats['success_rate'] else 0.0,
                    'avg_success_score': float(stats['avg_success_score']) if stats['avg_success_score'] else 0.0,
                    'sectors': [{'sector': s['sector'], 'count': s['count']} for s in sectors]
                }
        
        except Exception as e:
            logger.error(f"Failed to get statistics: {e}")
            raise

# ============================================================================
# MongoDB Connector
# ============================================================================

try:
    from pymongo import MongoClient
    from pymongo.errors import ConnectionFailure
    MONGO_AVAILABLE = True
except ImportError:
    MONGO_AVAILABLE = False
    logger.warning("pymongo not installed. MongoDB support disabled.")

class MongoDBConnector:
    """MongoDB database connector for training data"""
    
    def __init__(self, connection_string: Optional[str] = None, database_name: str = "uplink"):
        """
        Initialize MongoDB connector
        
        Args:
            connection_string: MongoDB connection string
                Format: "mongodb://user:password@host:port/"
                If None, reads from MONGODB_URL environment variable
            database_name: Database name (default: "uplink")
        """
        if not MONGO_AVAILABLE:
            raise ImportError("pymongo not installed. Install with: pip install pymongo")
        
        self.connection_string = connection_string or os.getenv("MONGODB_URL", "mongodb://localhost:27017/")
        self.database_name = database_name
        self.client = None
        self.db = None
    
    def connect(self):
        """Establish database connection"""
        try:
            self.client = MongoClient(self.connection_string)
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client[self.database_name]
            logger.info(f"MongoDB connection established to database: {self.database_name}")
        except ConnectionFailure as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    def disconnect(self):
        """Close database connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")
    
    def fetch_training_data(
        self, 
        limit: Optional[int] = None,
        sector: Optional[str] = None,
        min_success_score: Optional[float] = None
    ) -> List[IdeaOutcome]:
        """
        Fetch training data from ideas_outcomes collection
        
        Args:
            limit: Maximum number of records to fetch
            sector: Filter by sector (e.g., "تعليم", "صحة")
            min_success_score: Minimum success score (0.0-1.0)
        
        Returns:
            List of IdeaOutcome objects
        """
        if not self.db:
            self.connect()
        
        collection = self.db['ideas_outcomes']
        
        # Build query filter
        query_filter = {'classified_at': {'$ne': None}}
        
        if sector:
            query_filter['sector'] = sector
        
        if min_success_score is not None:
            query_filter['success_score'] = {'$gte': min_success_score}
        
        try:
            cursor = collection.find(query_filter).sort('created_at', -1)
            
            if limit:
                cursor = cursor.limit(limit)
            
            documents = list(cursor)
            logger.info(f"Fetched {len(documents)} training records from MongoDB")
            
            # Convert to IdeaOutcome objects
            outcomes = []
            for doc in documents:
                outcomes.append(IdeaOutcome(
                    idea_id=doc['idea_id'],
                    title=doc['title'],
                    description=doc['description'],
                    budget=float(doc['budget']),
                    team_size=doc['team_size'],
                    timeline_months=doc['timeline_months'],
                    market_demand=doc['market_demand'],
                    technical_feasibility=doc['technical_feasibility'],
                    competitive_advantage=doc['competitive_advantage'],
                    user_engagement=doc['user_engagement'],
                    keywords=doc.get('keywords', []),
                    tags_count=doc.get('tags_count', 0),
                    hypothesis_validation_rate=float(doc['hypothesis_validation_rate']),
                    rat_completion_rate=float(doc['rat_completion_rate']),
                    success=doc['success'],
                    success_score=float(doc['success_score']),
                    sector=doc.get('sector'),
                    organization_name=doc.get('organization_name')
                ))
            
            return outcomes
        
        except Exception as e:
            logger.error(f"Failed to fetch training data: {e}")
            raise
    
    def get_statistics(self) -> Dict:
        """Get database statistics"""
        if not self.db:
            self.connect()
        
        collection = self.db['ideas_outcomes']
        
        try:
            # Total records
            total = collection.count_documents({})
            
            # Success rate
            pipeline = [
                {
                    '$group': {
                        '_id': None,
                        'success_rate': {'$avg': {'$cond': ['$success', 1.0, 0.0]}},
                        'avg_success_score': {'$avg': '$success_score'}
                    }
                }
            ]
            stats = list(collection.aggregate(pipeline))
            
            # By sector
            sector_pipeline = [
                {'$match': {'sector': {'$ne': None}}},
                {'$group': {'_id': '$sector', 'count': {'$sum': 1}}},
                {'$sort': {'count': -1}}
            ]
            sectors = list(collection.aggregate(sector_pipeline))
            
            return {
                'total_records': total,
                'success_rate': stats[0]['success_rate'] if stats else 0.0,
                'avg_success_score': stats[0]['avg_success_score'] if stats else 0.0,
                'sectors': [{'sector': s['_id'], 'count': s['count']} for s in sectors]
            }
        
        except Exception as e:
            logger.error(f"Failed to get statistics: {e}")
            raise

# ============================================================================
# Unified Database Interface
# ============================================================================

class DatabaseConnector:
    """Unified interface for PostgreSQL and MongoDB"""
    
    def __init__(self, db_type: str = "postgresql", **kwargs):
        """
        Initialize database connector
        
        Args:
            db_type: "postgresql" or "mongodb"
            **kwargs: Connection parameters
        """
        self.db_type = db_type.lower()
        
        if self.db_type == "postgresql":
            self.connector = PostgreSQLConnector(**kwargs)
        elif self.db_type == "mongodb":
            self.connector = MongoDBConnector(**kwargs)
        else:
            raise ValueError(f"Unsupported database type: {db_type}")
    
    def connect(self):
        """Establish database connection"""
        self.connector.connect()
    
    def disconnect(self):
        """Close database connection"""
        self.connector.disconnect()
    
    def fetch_training_data(self, **kwargs) -> List[IdeaOutcome]:
        """Fetch training data"""
        return self.connector.fetch_training_data(**kwargs)
    
    def get_statistics(self) -> Dict:
        """Get database statistics"""
        return self.connector.get_statistics()
    
    def __enter__(self):
        """Context manager entry"""
        self.connect()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.disconnect()

# ============================================================================
# Helper Functions
# ============================================================================

def convert_outcomes_to_dataframe(outcomes: List[IdeaOutcome]):
    """Convert list of IdeaOutcome to pandas DataFrame"""
    try:
        import pandas as pd
    except ImportError:
        raise ImportError("pandas not installed. Install with: pip install pandas")
    
    data = []
    for outcome in outcomes:
        data.append({
            'idea_id': outcome.idea_id,
            'title': outcome.title,
            'description': outcome.description,
            'budget': outcome.budget,
            'team_size': outcome.team_size,
            'timeline_months': outcome.timeline_months,
            'market_demand': outcome.market_demand,
            'technical_feasibility': outcome.technical_feasibility,
            'competitive_advantage': outcome.competitive_advantage,
            'user_engagement': outcome.user_engagement,
            'tags_count': outcome.tags_count,
            'hypothesis_validation_rate': outcome.hypothesis_validation_rate,
            'rat_completion_rate': outcome.rat_completion_rate,
            'success': outcome.success,
            'success_score': outcome.success_score,
            'sector': outcome.sector,
            'organization_name': outcome.organization_name
        })
    
    return pd.DataFrame(data)

# ============================================================================
# Example Usage
# ============================================================================

if __name__ == "__main__":
    # Example 1: PostgreSQL
    print("=" * 80)
    print("Testing PostgreSQL Connector")
    print("=" * 80)
    
    try:
        with DatabaseConnector(db_type="postgresql") as db:
            # Get statistics
            stats = db.get_statistics()
            print(f"\nDatabase Statistics:")
            print(f"  Total Records: {stats['total_records']}")
            print(f"  Success Rate: {stats['success_rate']:.2%}")
            print(f"  Avg Success Score: {stats['avg_success_score']:.2f}")
            print(f"  Sectors: {len(stats['sectors'])}")
            
            # Fetch training data
            outcomes = db.fetch_training_data(limit=10)
            print(f"\nFetched {len(outcomes)} training records")
            
            if outcomes:
                print(f"\nFirst record:")
                print(f"  ID: {outcomes[0].idea_id}")
                print(f"  Title: {outcomes[0].title}")
                print(f"  Success: {outcomes[0].success}")
                print(f"  Success Score: {outcomes[0].success_score:.2f}")
    
    except Exception as e:
        print(f"PostgreSQL test failed: {e}")
    
    # Example 2: MongoDB
    print("\n" + "=" * 80)
    print("Testing MongoDB Connector")
    print("=" * 80)
    
    try:
        with DatabaseConnector(db_type="mongodb") as db:
            # Get statistics
            stats = db.get_statistics()
            print(f"\nDatabase Statistics:")
            print(f"  Total Records: {stats['total_records']}")
            print(f"  Success Rate: {stats['success_rate']:.2%}")
            print(f"  Avg Success Score: {stats['avg_success_score']:.2f}")
            print(f"  Sectors: {len(stats['sectors'])}")
            
            # Fetch training data
            outcomes = db.fetch_training_data(limit=10, sector="تعليم")
            print(f"\nFetched {len(outcomes)} training records (sector: تعليم)")
            
            if outcomes:
                print(f"\nFirst record:")
                print(f"  ID: {outcomes[0].idea_id}")
                print(f"  Title: {outcomes[0].title}")
                print(f"  Success: {outcomes[0].success}")
                print(f"  Success Score: {outcomes[0].success_score:.2f}")
    
    except Exception as e:
        print(f"MongoDB test failed: {e}")
