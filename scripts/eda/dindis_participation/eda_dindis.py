import pandas as pd
import os


df = pd.read_csv("data/processed/dindis_participation.csv")


output_path = "data/eda_results/dindis_participation"
os.makedirs(output_path, exist_ok=True)


with open(f"{output_path}/basic_info.txt", "w") as f:
    f.write("Column Info:\n")
    df.info(buf=f)


df.describe().to_csv(f"{output_path}/describe.csv")


categorical_cols = ['age_group', 'gender_ratio', 'musical_instruments', 'origin_village']
for col in categorical_cols:
    vc = df[col].value_counts()
    vc.to_csv(f"{output_path}/{col}_value_counts.csv")

print("EDA summary files generated successfully.")
