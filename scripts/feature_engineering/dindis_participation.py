import pandas as pd
import os

def run():
    input_path = "data/processed/dindis_participation.csv"
    output_path = "data/featured/dindis_participation.csv"

    df = pd.read_csv(input_path)

    
    df['participants_per_year'] = df['total_participants'] / df['years_participated']

    
    df['is_large_dindi'] = df['total_participants'].apply(lambda x: 1 if x > 100 else 0)

    
    def categorize_age(age_group):
        age_group = str(age_group).lower()
        if '18' in age_group or '20' in age_group:
            return 'young'
        elif '30' in age_group or '40' in age_group or '50' in age_group:
            return 'middle'
        elif '60' in age_group or '+' in age_group:
            return 'senior'
        else:
            return 'unknown'

    df['age_group_type'] = df['age_group'].apply(categorize_age)

    
    def bias(ratio):
        try:
            r = float(ratio)
            if r > 1.1:
                return 'male_dominated'
            elif r < 0.9:
                return 'female_dominated'
            else:
                return 'balanced'
        except:
            return 'unknown'

    df['gender_bias'] = df['gender_ratio'].apply(bias)

    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"[] Feature engineered: {output_path}")

if __name__ == "__main__":
    run()
