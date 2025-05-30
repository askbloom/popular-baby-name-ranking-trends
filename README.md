# Popular Baby Name Ranking Trends

A comprehensive dataset of U.S. baby name rankings from 1880 to 2024, processed from Social Security Administration data into clean, accessible formats.

## Data Source

The raw data comes from the U.S. Social Security Administration's baby names database:
**https://www.ssa.gov/oact/babynames/limits.html**

This dataset includes "National Data on the relative frequency of given names in the population of U.S. births where the individual has a Social Security Number (Tabulated based on Social Security records as of March 2, 2025)."

## Raw Data Format

The original data consists of individual files for each year from 1880 to 2024:

- **File naming**: `yobYYYY.txt` (e.g., `yob2024.txt`)
- **Location**: `raw/year/` directory
- **Format**: Comma-separated values with no header
- **Structure**: `name,gender,count`
  - `name`: 2 to 15 characters
  - `gender`: M (male) or F (female)
  - `count`: Number of occurrences (minimum 5 to protect privacy)

**Sorting**: Files are sorted first by gender (F, then M), then by count in descending order. When counts are tied, names are in alphabetical order.

**Example raw data**:

```
Olivia,F,14718
Emma,F,13485
Amelia,F,12740
...
Liam,M,22164
Noah,M,20337
Oliver,M,15343
```

## Data Processing

The `index.js` script processes all raw files and:

1. **Reads** each year's raw data file
2. **Calculates rankings**:
   - Overall rank: Position by popularity across all genders within the year
   - Gender rank: Position by popularity within each gender
3. **Sorts data** by count (popularity) for accurate overall rankings
4. **Generates multiple output formats** for each year

## Output Files

For each year (1880-2024), the following 12 files are generated:

### Complete Datasets

- `all-names-{year}.csv` / `all-names-{year}.json` - All names for the year
- `girl-names-{year}.csv` / `girl-names-{year}.json` - Female names only
- `boy-names-{year}.csv` / `boy-names-{year}.json` - Male names only

### Top 1000 Datasets

- `top-all-names-{year}.csv` / `top-all-names-{year}.json` - Top 1000 most popular names
- `top-girl-names-{year}.csv` / `top-girl-names-{year}.json` - Top 1000 female names
- `top-boy-names-{year}.csv` / `top-boy-names-{year}.json` - Top 1000 male names

**Total**: 1,740 files (145 years × 12 files per year)

## Output Data Structure

### CSV Format

```csv
name,overallRank,genderRank,count,gender
Liam,1,1,22164,M
Noah,2,2,20337,M
Oliver,3,3,15343,M
Olivia,4,1,14718,F
```

### JSON Format

```json
{
  "year": "2024",
  "items": [
    {
      "name": "Liam",
      "overallRank": 1,
      "genderRank": 1,
      "count": 22164,
      "gender": "M"
    },
    {
      "name": "Noah",
      "overallRank": 2,
      "genderRank": 2,
      "count": 20337,
      "gender": "M"
    }
  ]
}
```

### Field Definitions

- **name**: The baby name
- **overallRank**: Popularity rank within the year (all genders combined)
- **genderRank**: Popularity rank within the year for the specific gender
- **count**: Number of babies given this name
- **gender**: 'M' for male, 'F' for female

## Accessing the Data

### GitHub Raw File Access

You can access any processed file directly via GitHub's raw content URLs:

```
https://raw.githubusercontent.com/askbloom/popular-baby-name-ranking-trends/refs/heads/main/name-rankings/[filename]
```

### Example URLs

**Recent top names (JSON)**:

- Top 1000 names in 2024: `https://raw.githubusercontent.com/askbloom/popular-baby-name-ranking-trends/refs/heads/main/name-rankings/top-all-names-2024.json`
- Top girls names in 2024: `https://raw.githubusercontent.com/askbloom/popular-baby-name-ranking-trends/refs/heads/main/name-rankings/top-girl-names-2024.json`
- Top boys names in 2024: `https://raw.githubusercontent.com/askbloom/popular-baby-name-ranking-trends/refs/heads/main/name-rankings/top-boy-names-2024.json`

**Historical data (CSV)**:

- All names in 1950: `https://raw.githubusercontent.com/askbloom/popular-baby-name-ranking-trends/refs/heads/main/name-rankings/all-names-1950.csv`
- Girls names in 1990: `https://raw.githubusercontent.com/askbloom/popular-baby-name-ranking-trends/refs/heads/main/name-rankings/girl-names-1990.csv`

### Usage Examples

**JavaScript (fetch API)**:

```javascript
// Get top 1000 names for 2024
const response = await fetch(
  'https://raw.githubusercontent.com/askbloom/popular-baby-name-ranking-trends/refs/heads/main/name-rankings/top-all-names-2024.json'
);
const data = await response.json();
console.log(data.items[0]); // Most popular name in 2024
```

**Python (requests)**:

```python
import requests
import pandas as pd

# Load CSV data into pandas
url = 'https://raw.githubusercontent.com/askbloom/popular-baby-name-ranking-trends/refs/heads/main/name-rankings/top-all-names-2024.csv'
df = pd.read_csv(url)
print(df.head())
```

**R**:

```r
# Load JSON data
library(jsonlite)
url <- 'https://raw.githubusercontent.com/askbloom/popular-baby-name-ranking-trends/refs/heads/main/name-rankings/top-all-names-2024.json'
data <- fromJSON(url)
head(data$items)
```

## Running the Processing Script

To regenerate the processed files:

```bash
node index.js
```

The script will:

1. Scan the `raw/year/` directory for `yobYYYY.txt` files
2. Process each year's data
3. Generate all output files in the `name-rankings/` directory

## File Organization

```
├── index.js              # Data processing script
├── package.json          # Node.js dependencies
├── raw/
│   └── year/             # Original SSA data files
│       ├── yob1880.txt
│       ├── yob1881.txt
│       └── ...
├── name-rankings/        # Processed output files
│   ├── all-names-1880.csv
│   ├── all-names-1880.json
│   └── ...
└── README.md            # This file
```

## Data Coverage

- **Years**: 1880 - 2024 (145 years)
- **Names**: Only names with 5+ occurrences per year (privacy protection)
- **Total records**: Varies by year (modern years have 30,000+ names)
- **Update frequency**: Annual (when new SSA data is released)
