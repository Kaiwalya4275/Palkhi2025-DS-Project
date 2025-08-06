import os
import re

PROJECT_DIR = r'C:\Users\kaiwalya\OneDrive\Desktop\Palkhi2025-DS-Project'

def remove_special_symbols_from_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove non-ASCII characters (i.e., special symbols, emojis, bullets, etc.)
        cleaned = re.sub(r'[^\x00-\x7F]+', '', content)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(cleaned)

        print(f"Cleaned: {file_path}")

    except Exception as e:
        print(f"Failed on {file_path}  {e}")

def clean_project_of_special_symbols(root_dir):
    for root, _, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.py', '.js', '.html', '.css', '.csv')):
                file_path = os.path.join(root, file)
                remove_special_symbols_from_file(file_path)

if __name__ == "__main__":
    clean_project_of_special_symbols(PROJECT_DIR)
