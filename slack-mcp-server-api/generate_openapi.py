"""Save this FastAPI app's OpenAPI specification to JSON and YAML"""

import json
import yaml
from pathlib import Path

# Add the app directory to the path so we can import main
import sys
sys.path.insert(0, str(Path(__file__).parent / "app"))

from main import app


def save_openapi_to_json():
    """Save OpenAPI spec to JSON"""
    
    with open("openapi.json", "w", encoding="utf-8") as json_file:
        json.dump(
            app.openapi(),
            json_file,
            indent=2,
        )
    print("✅ Generated openapi.json")


def save_openapi_to_yaml():
    """Save OpenAPI spec to YAML"""
    
    with open("openapi.yaml", "w", encoding="utf-8") as yaml_file:
        yaml.dump(
            app.openapi(),
            yaml_file,
            default_flow_style=False,
            sort_keys=False,
            indent=2,
        )
    print("✅ Generated openapi.yaml")


def show_x_gram_summary():
    """Show summary of x-gram extensions"""
    openapi_spec = app.openapi()
    
    print("\n🔍 X-Gram Extensions Summary:")
    
    # Check for x-gram-info
    if "x-gram-info" in openapi_spec:
        print(f"📋 Global x-gram-info: {openapi_spec['x-gram-info']['name']}")
    
    # Check for x-gram extensions in paths
    x_gram_endpoints = []
    for path, path_item in openapi_spec.get("paths", {}).items():
        for method, operation in path_item.items():
            if method.lower() in ["get", "post", "put", "delete", "patch"]:
                if "x-gram" in operation:
                    x_gram_endpoints.append(f"  {method.upper()} {path}: {operation['x-gram']['name']}")
    
    if x_gram_endpoints:
        print("🛠️  Endpoints with x-gram extensions:")
        for endpoint in x_gram_endpoints:
            print(endpoint)
    else:
        print("❌ No x-gram extensions found")


if __name__ == "__main__":
    print("🚀 Generating OpenAPI specification files...")
    
    save_openapi_to_json()
    save_openapi_to_yaml()
    show_x_gram_summary()
    
    print(f"\n✨ OpenAPI files generated successfully!")
    print("📁 Files created:")
    print("  - openapi.json")
    print("  - openapi.yaml") 