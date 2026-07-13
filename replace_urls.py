import os
import re

frontend_dir = "apps/frontend/src"

def replace_urls_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replace 'http://localhost:4000/api/v1...' with `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}...`
    # We must match both single quotes and double quotes for the URL string.
    pattern_4000 = r"['\"]http://localhost:4000/api/v1([^'\"]*)['\"]"
    replacement_4000 = r"`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}\1`"
    new_content = re.sub(pattern_4000, replacement_4000, content)

    # Replace 'http://localhost:8000/api/v1...' similarly
    pattern_8000 = r"['\"]http://localhost:8000/api/v1([^'\"]*)['\"]"
    replacement_8000 = r"`${process.env.NEXT_PUBLIC_ML_URL || 'http://localhost:8000/api/v1'}\1`"
    new_content = re.sub(pattern_8000, replacement_8000, new_content)

    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(frontend_dir):
    for file in files:
        if file.endswith(".ts") or file.endswith(".tsx"):
            replace_urls_in_file(os.path.join(root, file))
