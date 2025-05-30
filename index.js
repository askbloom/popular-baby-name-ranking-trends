const fs = require('fs');
const path = require('path');

// Create output directory if it doesn't exist
const outputDir = './name-rankings';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function processYearFile(year) {
  const inputFile = `./raw/year/yob${year}.txt`;

  if (!fs.existsSync(inputFile)) {
    console.log(`File not found: ${inputFile}`);
    return;
  }

  console.log(`Processing year ${year}...`);

  // Read and parse the file
  const data = fs.readFileSync(inputFile, 'utf8');
  const lines = data.trim().split('\n');

  const allNames = [];
  const girlNames = [];
  const boyNames = [];

  let genderRanks = { F: 1, M: 1 };

  // First pass: process each line and create basic name data
  lines.forEach((line) => {
    const [name, gender, count] = line.split(',');
    const nameData = {
      name,
      overallRank: 0, // Will be calculated after sorting
      genderRank: genderRanks[gender],
      count: parseInt(count),
      gender,
    };

    allNames.push(nameData);

    if (gender === 'F') {
      girlNames.push(nameData);
    } else if (gender === 'M') {
      boyNames.push(nameData);
    }

    genderRanks[gender]++;
  });

  // Sort all names by count (descending) to get correct overall ranking
  allNames.sort((a, b) => b.count - a.count);

  // Assign overall ranks based on sorted order
  allNames.forEach((nameData, index) => {
    nameData.overallRank = index + 1;
  });

  // Helper function to convert data to CSV format
  function toCSV(data) {
    const header = 'name,overallRank,genderRank,count,gender\n';
    const rows = data
      .map(
        (item) => `${item.name},${item.overallRank},${item.genderRank},${item.count},${item.gender}`
      )
      .join('\n');
    return header + rows;
  }

  // Helper function to create JSON format
  function toJSON(data, year) {
    return JSON.stringify(
      {
        year: year.toString(),
        items: data,
      },
      null,
      2
    );
  }

  // Generate all output files
  const outputs = [
    { name: 'all-names', data: allNames },
    { name: 'girl-names', data: girlNames },
    { name: 'boy-names', data: boyNames },
    { name: 'top-all-names', data: allNames.slice(0, 1000) },
    { name: 'top-girl-names', data: girlNames.slice(0, 1000) },
    { name: 'top-boy-names', data: boyNames.slice(0, 1000) },
  ];

  outputs.forEach((output) => {
    // Write CSV file
    const csvFile = path.join(outputDir, `${output.name}-${year}.csv`);
    fs.writeFileSync(csvFile, toCSV(output.data));

    // Write JSON file
    const jsonFile = path.join(outputDir, `${output.name}-${year}.json`);
    fs.writeFileSync(jsonFile, toJSON(output.data, year));
  });

  console.log(`✓ Completed processing year ${year} - generated ${outputs.length * 2} files`);
}

// Get all available years from the raw/year directory
function getAllYears() {
  const yearDir = './raw/year';
  if (!fs.existsSync(yearDir)) {
    console.error('Raw year directory not found:', yearDir);
    return [];
  }

  const files = fs.readdirSync(yearDir);
  const years = [];

  files.forEach((file) => {
    const match = file.match(/^yob(\d{4})\.txt$/);
    if (match) {
      years.push(match[1]);
    }
  });

  return years.sort();
}

// Main execution
function main() {
  console.log('Starting baby name data processing...');

  const years = getAllYears();
  console.log(`Found ${years.length} year files to process`);

  if (years.length === 0) {
    console.error('No year files found in ./raw/year/');
    return;
  }

  years.forEach((year) => {
    try {
      processYearFile(year);
    } catch (error) {
      console.error(`Error processing year ${year}:`, error.message);
    }
  });

  console.log('\n🎉 All files processed successfully!');
  console.log(`Output files written to: ${outputDir}`);
  console.log(`Total files generated: ${years.length * 12} files`);
}

// Run the script
main();
