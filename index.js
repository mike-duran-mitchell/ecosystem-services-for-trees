const fs = require('fs');
const treeDir = fs.readdirSync('./tree-data/raw-data', 'utf8');
const speciesListUnparsed = fs.readFileSync(
  './tree-data/species-list/SpeciesList.json',
  'utf8'
);
const speciesList = JSON.parse(speciesListUnparsed);

const jsonFiles = treeDir.filter(
  fileName =>
    fileName.substring(fileName.length - 4, fileName.length) === 'json'
);

// build an array based on species
const newSpeciesArr = [];
speciesList.forEach(species => {
  const speciesId = species.SpeciesID;

  jsonFiles.forEach(fileName => {
    const unparsedFileContents = fs.readFileSync(
      `./tree-data/raw-data/${fileName}`,
      'utf8'
    );
    const fileContents = JSON.parse(unparsedFileContents);
    const NameWithoutDots =
      fileName.substr(fileName.length - 10, 10).toLowerCase() === 'table.json'
        ? fileName.substring(0, fileName.length - 10)
        : fileName.substring(0, fileName.length - 5);

    fileContents.map(record => {
      if (record.SpeciesID) {
        const recordSpecies = record.SpeciesID;
        if (recordSpecies === speciesId) {
          species[NameWithoutDots] = record;
        }
      }
    });
  });
  newSpeciesArr.push(species);
  console.log(speciesId);
});

console.log(newSpeciesArr);
fs.writeFile(
  './tree-data/masterList.json',
  JSON.stringify(newSpeciesArr),
  (err, success) => {
    if (err) {
      console.log('error writing file!', err);
    } else {
      console.log('success');
    }
  }
);
