import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os


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
    print(f"Processing: {dataset}")
    
    csv_path = f"data/processed/{dataset}.csv"
    output_folder = f"data/eda_results/{dataset}"
    os.makedirs(output_folder, exist_ok=True)

    try:
        df = pd.read_csv(csv_path)

        
        num_cols = df.select_dtypes(include='number')
        if num_cols.shape[1] >= 2:
            corr = num_cols.corr()
            plt.figure(figsize=(10, 6))
            sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
            plt.title(f'Correlation Heatmap - {dataset}')
            plt.tight_layout()
            plt.savefig(f"{output_folder}/correlation.png")
            plt.close()

        
        aggregation_text = ""

        for col in df.select_dtypes(include='object'):
            value_counts = df[col].value_counts()
            aggregation_text += f"\n--- Group by {col} (Top 5) ---\n"
            aggregation_text += str(value_counts.head(5)) + "\n"

        for col in df.select_dtypes(include='object'):
            for num_col in df.select_dtypes(include='number'):
                group_mean = df.groupby(col)[num_col].mean().sort_values(ascending=False)
                aggregation_text += f"\n--- Mean of {num_col} by {col} (Top 5) ---\n"
                aggregation_text += str(group_mean.head(5)) + "\n"

        with open(f"{output_folder}/aggregation.txt", "w", encoding="utf-8") as f:
            f.write(aggregation_text)

    except Exception as e:
        print(f" Error processing {dataset}: {e}")

print("\n Step 5 complete for all datasets.")
