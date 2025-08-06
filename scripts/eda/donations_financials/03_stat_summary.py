
import pandas as pd


df = pd.read_csv('data/processed/donations_financials.csv')


output_file = 'data/eda_results/donations_financials/summary.txt'


info = df.info()


desc = df.describe(include='all')


value_counts = {}
for col in df.select_dtypes(include='object').columns:
    value_counts[col] = df[col].value_counts()


with open(output_file, 'w', encoding='utf-8') as f:
    f.write("--- INFO ---\n")
    df.info(buf=f)

    f.write("\n\n--- DESCRIPTIVE STATISTICS ---\n")
    f.write(str(desc))

    f.write("\n\n--- VALUE COUNTS ---\n")
    for col, counts in value_counts.items():
        f.write(f"\nColumn: {col}\n")
        f.write(str(counts))
        f.write("\n")

print("Statistical summary written to:", output_file)
