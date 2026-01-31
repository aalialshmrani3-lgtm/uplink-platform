"""
JWT Authentication Middleware for UPLINK 5.0 AI Services
Secures all API endpoints with JWT token validation
"""

from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import jwt
import os
import logging
from datetime import datetime, timedelta

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# JWT Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "uplink-5.0-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Security scheme
security = HTTPBearer()

class JWTAuth:
    """JWT Authentication handler"""
    
    @staticmethod
    def create_token(user_id: int, email: str, role: str = "user") -> str:
        """
        Create JWT token for authenticated user
        
        Args:
            user_id: User ID
            email: User email
            role: User role (admin/user)
            
        Returns:
            JWT token string
        """
        payload = {
            "user_id": user_id,
            "email": email,
            "role": role,
            "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
            "iat": datetime.utcnow()
        }
        
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return token
    
    @staticmethod
    def verify_token(token: str) -> dict:
        """
        Verify and decode JWT token
        
        Args:
            token: JWT token string
            
        Returns:
            Decoded payload dict
            
        Raises:
            HTTPException: If token is invalid or expired
        """
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=401,
                detail="Token has expired"
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )
    
    @staticmethod
    def get_current_user(
        credentials: HTTPAuthorizationCredentials = Security(security)
    ) -> dict:
        """
        Dependency to get current authenticated user
        
        Args:
            credentials: HTTP Authorization credentials
            
        Returns:
            User payload dict
            
        Raises:
            HTTPException: If authentication fails
        """
        token = credentials.credentials
        payload = JWTAuth.verify_token(token)
        return payload
    
    @staticmethod
    def require_admin(
        current_user: dict = Depends(get_current_user)
    ) -> dict:
        """
        Dependency to require admin role
        
        Args:
            current_user: Current user payload
            
        Returns:
            User payload dict
            
        Raises:
            HTTPException: If user is not admin
        """
        if current_user.get("role") != "admin":
            raise HTTPException(
                status_code=403,
                detail="Admin access required"
            )
        return current_user

# Convenience functions
def create_access_token(user_id: int, email: str, role: str = "user") -> str:
    """Create JWT access token"""
    return JWTAuth.create_token(user_id, email, role)

def verify_access_token(token: str) -> dict:
    """Verify JWT access token"""
    return JWTAuth.verify_token(token)

def get_current_user_dependency():
    """Get FastAPI dependency for current user"""
    return Depends(JWTAuth.get_current_user)

def require_admin_dependency():
    """Get FastAPI dependency for admin-only endpoints"""
    return Depends(JWTAuth.require_admin)

# Optional: API Key fallback for service-to-service communication
API_KEY = os.getenv("AI_SERVICE_API_KEY", "")

def verify_api_key(credentials: HTTPAuthorizationCredentials = Security(security)) -> bool:
    """
    Verify API key for service-to-service communication
    
    Args:
        credentials: HTTP Authorization credentials
        
    Returns:
        True if API key is valid
        
    Raises:
        HTTPException: If API key is invalid
    """
    if not API_KEY:
        raise HTTPException(
            status_code=500,
            detail="API key not configured"
        )
    
    if credentials.credentials != API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid API key"
        )
    
    return True

def get_auth_user_or_service(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> dict:
    """
    Flexible authentication: JWT token or API key
    
    Args:
        credentials: HTTP Authorization credentials
        
    Returns:
        User payload dict or service indicator
        
    Raises:
        HTTPException: If authentication fails
    """
    token = credentials.credentials
    
    # Try JWT first
    try:
        payload = JWTAuth.verify_token(token)
        return payload
    except HTTPException:
        pass
    
    # Try API key fallback
    if API_KEY and token == API_KEY:
        return {"user_id": 0, "email": "service", "role": "service"}
    
    raise HTTPException(
        status_code=401,
        detail="Invalid authentication credentials"
    )

if __name__ == "__main__":
    # Test JWT authentication
    print("🧪 Testing JWT Authentication...")
    print()
    
    # Create token
    token = create_access_token(user_id=123, email="test@uplink.sa", role="admin")
    print(f"Generated token: {token[:50]}...")
    print()
    
    # Verify token
    try:
        payload = verify_access_token(token)
        print(f"✅ Token verified successfully!")
        print(f"   User ID: {payload['user_id']}")
        print(f"   Email: {payload['email']}")
        print(f"   Role: {payload['role']}")
        print(f"   Expires: {datetime.fromtimestamp(payload['exp'])}")
    except Exception as e:
        print(f"❌ Token verification failed: {e}")
