"""
Model Versioning System
Manage different versions of trained models
"""

import os
import json
import shutil
from datetime import datetime
from pathlib import Path

# Paths
MODELS_DIR = Path(__file__).parent / "models_history"
CURRENT_MODEL_PATH = Path(__file__).parent / "idea_success_model.pkl"
METADATA_FILE = MODELS_DIR / "versions.json"

# Ensure models_history directory exists
MODELS_DIR.mkdir(exist_ok=True)

def save_model_version(model_path, metadata):
    """
    Save a new model version with metadata
    
    Args:
        model_path: Path to the model file
        metadata: Dict with model info (accuracy, samples, etc.)
    """
    # Generate version ID (timestamp-based)
    version_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Copy model to models_history
    version_model_path = MODELS_DIR / f"model_{version_id}.pkl"
    shutil.copy2(model_path, version_model_path)
    
    # Load existing versions
    versions = load_versions()
    
    # Add new version
    versions.append({
        "version_id": version_id,
        "timestamp": datetime.now().isoformat(),
        "model_path": str(version_model_path),
        "accuracy": metadata.get("accuracy", 0.0),
        "precision": metadata.get("precision", 0.0),
        "recall": metadata.get("recall", 0.0),
        "f1_score": metadata.get("f1_score", 0.0),
        "training_samples": metadata.get("training_samples", 0),
        "features": metadata.get("features", []),
        "model_type": metadata.get("model_type", "XGBoost"),
        "is_active": False,  # New versions are not active by default
    })
    
    # Save versions metadata
    save_versions(versions)
    
    print(f"✅ Model version {version_id} saved successfully")
    return version_id

def load_versions():
    """Load all model versions from metadata file"""
    if not METADATA_FILE.exists():
        return []
    
    with open(METADATA_FILE, 'r') as f:
        return json.load(f)

def save_versions(versions):
    """Save versions metadata to file"""
    with open(METADATA_FILE, 'w') as f:
        json.dump(versions, f, indent=2)

def get_active_version():
    """Get the currently active model version"""
    versions = load_versions()
    active = [v for v in versions if v.get("is_active", False)]
    return active[0] if active else None

def set_active_version(version_id):
    """
    Set a specific version as active (rollback)
    
    Args:
        version_id: Version ID to activate
    """
    versions = load_versions()
    
    # Find the version
    target_version = None
    for v in versions:
        if v["version_id"] == version_id:
            target_version = v
            v["is_active"] = True
        else:
            v["is_active"] = False
    
    if not target_version:
        raise ValueError(f"Version {version_id} not found")
    
    # Copy the version model to current model path
    shutil.copy2(target_version["model_path"], CURRENT_MODEL_PATH)
    
    # Save updated versions
    save_versions(versions)
    
    print(f"✅ Model version {version_id} is now active")
    return target_version

def list_versions():
    """List all model versions"""
    versions = load_versions()
    return sorted(versions, key=lambda x: x["timestamp"], reverse=True)

def delete_version(version_id):
    """Delete a specific model version"""
    versions = load_versions()
    
    # Find and remove the version
    version_to_delete = None
    updated_versions = []
    
    for v in versions:
        if v["version_id"] == version_id:
            version_to_delete = v
        else:
            updated_versions.append(v)
    
    if not version_to_delete:
        raise ValueError(f"Version {version_id} not found")
    
    if version_to_delete.get("is_active", False):
        raise ValueError("Cannot delete active version")
    
    # Delete model file
    model_path = Path(version_to_delete["model_path"])
    if model_path.exists():
        model_path.unlink()
    
    # Save updated versions
    save_versions(updated_versions)
    
    print(f"✅ Model version {version_id} deleted successfully")

def compare_versions(version_id1, version_id2):
    """Compare two model versions"""
    versions = load_versions()
    
    v1 = next((v for v in versions if v["version_id"] == version_id1), None)
    v2 = next((v for v in versions if v["version_id"] == version_id2), None)
    
    if not v1 or not v2:
        raise ValueError("One or both versions not found")
    
    comparison = {
        "version_1": {
            "id": v1["version_id"],
            "timestamp": v1["timestamp"],
            "accuracy": v1["accuracy"],
            "precision": v1["precision"],
            "recall": v1["recall"],
            "f1_score": v1["f1_score"],
            "training_samples": v1["training_samples"],
            "model_type": v1["model_type"],
        },
        "version_2": {
            "id": v2["version_id"],
            "timestamp": v2["timestamp"],
            "accuracy": v2["accuracy"],
            "precision": v2["precision"],
            "recall": v2["recall"],
            "f1_score": v2["f1_score"],
            "training_samples": v2["training_samples"],
            "model_type": v2["model_type"],
        },
        "differences": {
            "accuracy_diff": v2["accuracy"] - v1["accuracy"],
            "precision_diff": v2["precision"] - v1["precision"],
            "recall_diff": v2["recall"] - v1["recall"],
            "f1_score_diff": v2["f1_score"] - v1["f1_score"],
            "samples_diff": v2["training_samples"] - v1["training_samples"],
        }
    }
    
    return comparison

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python model_versioning.py list")
        print("  python model_versioning.py activate <version_id>")
        print("  python model_versioning.py delete <version_id>")
        print("  python model_versioning.py compare <version_id1> <version_id2>")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "list":
        versions = list_versions()
        print(json.dumps(versions, indent=2))
    
    elif command == "activate":
        if len(sys.argv) < 3:
            print("Error: version_id required")
            sys.exit(1)
        version_id = sys.argv[2]
        set_active_version(version_id)
    
    elif command == "delete":
        if len(sys.argv) < 3:
            print("Error: version_id required")
            sys.exit(1)
        version_id = sys.argv[2]
        delete_version(version_id)
    
    elif command == "compare":
        if len(sys.argv) < 4:
            print("Error: two version_ids required")
            sys.exit(1)
        version_id1 = sys.argv[2]
        version_id2 = sys.argv[3]
        comparison = compare_versions(version_id1, version_id2)
        print(json.dumps(comparison, indent=2))
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
