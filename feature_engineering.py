import pandas as pd
import os
from sklearn.preprocessing import LabelEncoder

datasets = [
    'dindis_participation',
    'transport_logistics',
    'food_water_distribution',
    'volunteers_info',
    'cultural_events',
    'medical_support',
    'security_data',
    'donations_financials',
    'environmental_impact',
    'route_details'
]

for dataset in datasets:
    print(f" Feature Engineering: {dataset}")
    
    input_path = f"data/processed/{dataset}.csv"
    output_path = f"data/processed/fe_{dataset}.csv"
    log_path = f"data/eda_results/{dataset}/features_added.txt"
    os.makedirs(os.path.dirname(log_path), exist_ok=True)

    try:
        df = pd.read_csv(input_path)
        log = []

        
        for col in df.columns:
            if pd.api.types.is_datetime64_any_dtype(df[col]) or 'date' in col.lower():
                try:
                    df[col] = pd.to_datetime(df[col])
                    df[f"{col}_year"] = df[col].dt.year
                    df[f"{col}_month"] = df[col].dt.month
                    df[f"{col}_day"] = df[col].dt.day
                    log.append(f"Extracted year, month, day from {col}")
                except:
                    pass

        
        if dataset == "food_water_distribution":
            if "food_packets" in df.columns and "water_bottles" in df.columns:
                df["food_to_water_ratio"] = df["food_packets"] / (df["water_bottles"] + 1e-5)
                log.append("Created food_to_water_ratio")

        if dataset == "donation_finance":
            if "donation_amount" in df.columns and "expenses" in df.columns:
                df["net_balance"] = df["donation_amount"] - df["expenses"]
                log.append("Created net_balance feature")

        if dataset == "transport_logistics":
            if "vehicles_count" in df.columns and "distance_km" in df.columns:
                df["vehicles_per_km"] = df["vehicles_count"] / (df["distance_km"] + 1e-5)
                log.append("Created vehicles_per_km")

        
        le = LabelEncoder()
        for col in df.select_dtypes(include='object').columns:
            if df[col].nunique() < 20:
                df[f"{col}_encoded"] = le.fit_transform(df[col])
                log.append(f"Encoded column: {col}")

        
        df.to_csv(output_path, index=False)

        
        with open(log_path, "w", encoding="utf-8") as f:
            f.write("\n".join(log))

    except Exception as e:
        print(f" Error in {dataset}: {e}")

print("\n Step 6 Feature Engineering completed for all datasets.")
