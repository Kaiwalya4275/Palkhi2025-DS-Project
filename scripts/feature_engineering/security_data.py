import pandas as pd
import os

def run():
    input_path = "data/processed/security_data.csv"
    output_path = "data/featured/security_data.csv"

    df = pd.read_csv(input_path)

    
    df['has_police_support'] = df['police_assistance'].astype(str).str.strip().str.lower().apply(
        lambda x: 1 if x == 'yes' else 0
    )

    
    df['is_highly_secured'] = df.apply(
        lambda row: 1 if str(row['CCTV_deployed']).strip().lower() == 'yes'
        and pd.to_numeric(row['security_personnel_count'], errors='coerce') >= 10 else 0,
        axis=1
    )

    
    def get_shift_type(slot):
        try:
            start_hour = int(str(slot).split('-')[0].split(':')[0])
            if 5 <= start_hour < 12:
                return 'Morning'
            elif 12 <= start_hour < 18:
                return 'Afternoon'
            else:
                return 'Night'
        except:
            return 'Unknown'

    df['shift_type'] = df['time_slot'].apply(get_shift_type)

    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"[] Feature engineered: {output_path}")

if __name__ == "__main__":
    run()
