import pandas as pd
import os

def run():
    input_path = "data/processed/route_details.csv"
    output_path = "data/featured/route_details.csv"

    df = pd.read_csv(input_path)

    
    def support_check(row):
        return int(
            str(row['medical_camp']).strip().lower() == 'yes' and
            str(row['water_points']).strip().lower() == 'yes' and
            str(row['police_presence']).strip().lower() == 'yes'
        )
    df['is_well_supported'] = df.apply(support_check, axis=1)

    
    terrain_map = {'plain': 1, 'mixed': 2, 'hilly': 3}
    df['difficulty_score'] = df['terrain_type'].astype(str).str.strip().str.lower().map(terrain_map).fillna(0).astype(int)

    
    df['estimated_speed_kmph'] = df.apply(
        lambda row: round(
            pd.to_numeric(row['distance_km'], errors='coerce') /
            pd.to_numeric(row['estimated_palkhi_time'], errors='coerce'),
            2
        ) if pd.to_numeric(row['estimated_palkhi_time'], errors='coerce') not in [0, None, float('nan')] else None,
        axis=1
    )

    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"[] Feature engineered: {output_path}")

if __name__ == "__main__":
    run()
