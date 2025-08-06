import pandas as pd
import os

def run():
    input_path = "data/processed/medical_support.csv"
    output_path = "data/featured/medical_support.csv"

    df = pd.read_csv(input_path)

    
    df['is_fully_equipped'] = df.apply(
        lambda row: 1 if str(row['ambulance_available']).strip().lower() == 'yes'
        and pd.to_numeric(row['medicine_stock_level'], errors='coerce') >= 70 else 0,
        axis=1
    )

    
    def parse_hours(hours_str):
        try:
            start, end = hours_str.split('-')
            start_hour = int(start.split(':')[0])
            end_hour = int(end.split(':')[0])
            
            duration = (end_hour - start_hour) % 24
            return start_hour, duration
        except:
            return None, None

    df[['open_hour_start', 'shift_duration']] = df['open_hours'].apply(
        lambda x: pd.Series(parse_hours(str(x)))
    )

    
    df['is_high_demand_center'] = pd.to_numeric(df['avg_patients_per_day'], errors='coerce').apply(
        lambda x: 1 if x > 100 else 0
    )

    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"[] Feature engineered: {output_path}")

if __name__ == "__main__":
    run()
