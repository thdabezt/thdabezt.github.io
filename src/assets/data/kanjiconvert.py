import json

# Load the JSON data from the file
with open('test.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Remove entries with empty "kanji"
updated_data = [entry for entry in data if entry['kanji']]

# Write the updated data to a new file named "kanji.json"
with open('kanji.json', 'w', encoding='utf-8') as f:
    json.dump(updated_data, f, ensure_ascii=False, indent=4)

print("Entries with empty 'kanji' field deleted successfully. Updated data saved to 'kanji.json'")