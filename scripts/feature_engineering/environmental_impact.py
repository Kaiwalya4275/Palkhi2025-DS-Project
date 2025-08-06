import pandas as pd
import os

def run():
    input_path = "data/processed/environmental_impact.csv"
    output_path = "data/featured/environmental_impact.csv"

    df = pd.read_csv(input_path)

    
    df['is_strict_zone'] = df['enforcement_score'].apply(
        lambda x: 1 if pd.to_numeric(x, errors='coerce') >= 8 else 0
    )

    
    df['is_recycling_practiced'] = df['recyclables_separated'].astype(str).str.strip().str.lower().apply(
        lambda x: 1 if x == 'yes' else 0
    )

    
    def categorize_waste(x):
        x = pd.to_numeric(x, errors='coerce')
        if pd.isna(x):
            return 'Unknown'
        elif x >= 100:
            return 'High'
        elif x >= 50:
            return 'Medium'
        else:
            return 'Low'

    df['waste_category'] = df['waste_collected_kg'].apply(categorize_waste)

    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"[] Feature engineered: {output_path}")

if __name__ == "__main__":
    run()
