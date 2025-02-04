#!/usr/bin/env python3
from datetime import datetime

# Map month names to numeric format
month_mapping = {
    "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04",
    "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
    "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
}

# Convert "Date" column to YYYY-MM-DD format
def convert_date(date_str):
    parts = date_str.split()
    if len(parts) == 2:  # Expected format: "Jan 6"
        month = month_mapping.get(parts[0], "01")
        day = parts[1].zfill(2)  # Ensure two-digit day
        return f"1970-{month}-{day}"  # Placeholder year

df["Date"] = df["Date"].apply(convert_date)

# Convert to YAML format
yaml_content = "sekki:\n"
for _, row in df.iterrows():
    yaml_content += f"  - name: {row['Sekki']}\n"
    yaml_content += f"    start_date: {row['Date']}\n"
    yaml_content += f"    meaning: {row['Meaning']}\n"
    yaml_content += f"    description: {row['Description']}\n"
    yaml_content += f"    image: {row['Sekki'].lower().replace(' ', '_')}.jpg\n"  # Placeholder image name

# Save YAML file
yaml_path = "./sekki.yaml"
with open(yaml_path, "w") as file:
    file.write(yaml_content)

yaml_path
