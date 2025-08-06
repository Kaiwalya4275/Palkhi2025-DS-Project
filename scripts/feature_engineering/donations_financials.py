import pandas as pd
import os

def run():
    input_path = "data/processed/donations_financials.csv"
    output_path = "data/featured/donations_financials.csv"

    df = pd.read_csv(input_path)

    
    df['net_balance'] = pd.to_numeric(df['amount_received'], errors='coerce') - pd.to_numeric(df['amount_spent'], errors='coerce')

    
    df['is_high_donation'] = df['amount_received'].apply(
        lambda x: 1 if pd.to_numeric(x, errors='coerce') >= 10000 else 0
    )

    
    df['payment_type'] = df['mode_of_payment'].astype(str).str.strip().str.lower()

    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"[] Feature engineered: {output_path}")

if __name__ == "__main__":
    run()
