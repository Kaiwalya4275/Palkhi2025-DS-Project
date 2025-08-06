import pandas as pd
import os
from datetime import datetime

def run():
    input_path = "data/processed/cultural_events.csv"
    output_path = "data/featured/cultural_events.csv"

    df = pd.read_csv(input_path)

    
    df['date'] = pd.to_datetime(df['date'], format='%Y-%m-%d', errors='coerce')
    df['time'] = pd.to_datetime(df['time'], format='%H:%M', errors='coerce').dt.time

    
    df['event_hour'] = pd.to_datetime(df['time'].astype(str), format='%H:%M:%S', errors='coerce').dt.hour

    
    def get_time_of_day(hour):
        if pd.isna(hour):
            return 'unknown'
        if 5 <= hour <= 11:
            return 'Morning'
        elif 12 <= hour <= 16:
            return 'Afternoon'
        elif 17 <= hour <= 20:
            return 'Evening'
        else:
            return 'Night'

    df['time_of_day'] = df['event_hour'].apply(get_time_of_day)

    
    df['is_large_event'] = df['expected_audience'].apply(lambda x: 1 if x > 500 else 0)

    
    df['event_day_name'] = df['date'].dt.day_name()

    
    def simplify_event_type(e):
        e = str(e).lower()
        if 'bhajan' in e:
            return 'bhajan'
        elif 'kirtan' in e:
            return 'kirtan'
        elif 'dance' in e:
            return 'dance'
        elif 'drama' in e:
            return 'drama'
        elif 'aarti' in e:
            return 'aarti'
        else:
            return 'other'

    df['event_category_flag'] = df['event_type'].apply(simplify_event_type)

    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"[] Feature engineered: {output_path}")

if __name__ == "__main__":
    run()
