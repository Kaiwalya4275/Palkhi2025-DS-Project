import pandas as pd
import os

def run():
    input_path = "data/processed/food_water_distribution.csv"
    output_path = "data/featured/food_water_distribution.csv"

    df = pd.read_csv(input_path)

    
    df['start_time'] = pd.to_datetime(df['start_time'])
    df['end_time'] = pd.to_datetime(df['end_time'])

    
    df['duration_minutes'] = (df['end_time'] - df['start_time']).dt.total_seconds() / 60

    
    df['is_bulk_distribution'] = df['quantity'].apply(lambda x: 1 if x > 500 else 0)

    
    def categorize_dist_type(dtype):
        dtype = str(dtype).lower()
        if 'food' in dtype:
            return 'food'
        elif 'water' in dtype:
            return 'water'
        else:
            return 'other'

    df['distribution_category'] = df['distribution_type'].apply(categorize_dist_type)

    
    def convert_quantity(row):
        unit = str(row['unit']).lower()
        qty = row['quantity']
        if 'ml' in unit:
            return qty / 1000
        elif 'litre' in unit:
            return qty
        else:
            return None  

    df['standardized_quantity_liters'] = df.apply(convert_quantity, axis=1)

    
    def food_risk(row):
        if row['distribution_category'] == 'food' and row['quantity'] < 300:
            return 1
        return 0

    df['is_food_shortage_risk'] = df.apply(food_risk, axis=1)

    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"[] Feature engineered: {output_path}")

if __name__ == "__main__":
    run()
