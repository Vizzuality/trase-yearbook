const csv=require('csvtojson');
const json2csv = require('json2csv').parse;
var fs = require('fs');

const csvFilePath='origin.csv';
csv()
  .fromFile(csvFilePath)
  .then((result) => {
    const topTotals = Object.keys(result[result.length -1]).filter(k => k !== 'year').map(exporter => {
      return {
        exporter,
        value: parseFloat(result[result.length -1][exporter])
      }
    }).sort((a, b) => b.value - a.value).slice(0, 8);

    const data = result.map(r => {
      let result = {};
      result.year = r.year;
      let others = 0;
      Object.keys(r).filter(k => k !== 'year').forEach(exporter => {
        let exists = topTotals.some(topExporter => topExporter.exporter ===exporter);
        if (exists) {
          result[exporter] = ~~parseFloat(r[exporter]);
        } else {
          others += parseFloat(r[exporter]);
        }
      });
      result.others = ~~others;
      return result;
    })

    const csv = json2csv(data);
    fs.writeFileSync('data.csv', csv);
  })
