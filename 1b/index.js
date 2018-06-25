const csv = require('csvtojson');
const json2csv = require('json2csv').parse;
var fs = require('fs');

const NUM_OF_TOPS = 8;
const csvFilePaths = ['beef.csv', 'cocoa.csv', 'coffee.csv', 'cotton.csv', 'oil-palm.csv', 'rubber.csv', 'soy.csv', 'sugar.csv'];
csvFilePaths.forEach(csvFilePath => {
  csv({ delimiter: ';' })
    .fromFile(`data/origin/${csvFilePath}`)
    .then((result) => {
      const topTotals = Object.keys(result[result.length - 1]).filter(k => k !== 'year').map(exporter => {
        return {
          exporter,
          value: parseFloat(result[result.length - 1][exporter])
        }
      }).sort((a, b) => b.value - a.value).slice(0, NUM_OF_TOPS);

      const data = result.map(r => {
        let result = {};
        result.year = r.year;
        let others = 0;
        Object.keys(r).filter(k => k !== 'year').forEach(exporter =>  {
          let exists = topTotals.some(topExporter => topExporter.exporter === exporter);
          if (exists) {
            result[exporter] = ~~parseFloat(r[exporter]);
          } else {
            others += parseFloat(r[exporter]);
          }
        });
        result.others = ~~others;

        const ordered = []
        ordered.push(result.year);
        topTotals.forEach(total => {
          ordered.push(result[total.exporter])
        })
        ordered.push(result.others);

        return ordered;
      })

      // const csv = json2csv(data);
      const header = 'year,' + topTotals.map(top => top.exporter).join(',') + ',others\n';
      const body = data.map(el => el.join(',')).join('\n')
      const name = csvFilePath.split('.')[0]
      fs.writeFileSync('data/' + name + '.csv', header + body);
    })
})
