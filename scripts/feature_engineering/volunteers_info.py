import pandas as pd
import os

def run():
    input_path = "data/processed/volunteers_info.csv"
    output_path = "data/featured/volunteers_info.csv"

    df = pd.read_csv(input_path)

    
    df['start_date'] = pd.to_datetime(df['start_date'])
    df['end_date'] = pd.to_datetime(df['end_date'])

    
    df['service_duration_days'] = (df['end_date'] - df['start_date']).dt.days

    
    df['is_senior_volunteer'] = df['age'].apply(lambda x: 1 if x >= 50 else 0)

    
    def normalize_gender(g):
        g = str(g).strip().lower()
        if g.startswith('m'):
            return 'M'
        elif g.startswith('f'):
            return 'F'
        else:
            return 'Other'

    df['gender_flag'] = df['gender'].apply(normalize_gender)

    
    def check_lead(r):
        r = str(r).lower()
        return 1 if any(keyword in r for keyword in ['lead', 'manager', 'head']) else 0

    df['is_lead_role'] = df['role'].apply(check_lead)

    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"[] Feature engineered: {output_path}")

if __name__ == "__main__":
    run()
