import pandas as pd
import os

def run():
    input_path = "data/processed/transport_logistics.csv"
    output_path = "data/featured/transport_logistics.csv"

    df = pd.read_csv(input_path)

    
    df['departure_time'] = pd.to_datetime(df['departure_time'])
    df['arrival_time'] = pd.to_datetime(df['arrival_time'])

    
    df['travel_duration_minutes'] = (df['arrival_time'] - df['departure_time']).dt.total_seconds() / 60

    
    heavy_types = ['truck', 'lorry', 'container', 'bus']
    df['is_heavy_vehicle'] = df['vehicle_type'].str.lower().apply(lambda x: 1 if any(h in x for h in heavy_types) else 0)

    
    sensitive_types = ['medical', 'cash', 'electronics']
    df['is_sensitive_cargo'] = df['cargo_type'].str.lower().apply(lambda x: 1 if any(s in x for s in sensitive_types) else 0)

    
    def classify_route(origin, dest):
        if origin.strip().lower() == dest.strip().lower():
            return 'local'
        else:
            return 'inter_village'

    df['route_type'] = df.apply(lambda row: classify_route(row['origin_village'], row['destination_village']), axis=1)

    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"[] Feature engineered: {output_path}")

if __name__ == "__main__":
    run()
