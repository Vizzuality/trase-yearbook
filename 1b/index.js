const csv=require('csvtojson');
const Papa=require('papaparse');
const groupBy = require("lodash/groupBy");
const flatten = require("lodash/flatten");
var fs = require('fs');

const csvFilePath='data.csv';
csv()
  .fromFile(csvFilePath)
  .then((data) => {
    const yearGrouped = groupBy(data.filter(d => d.year), 'year');
    console.log(Object.keys(yearGrouped));
    const parsed = flatten(Object.keys(yearGrouped).map(year => {
      const exportGrouped = groupBy(yearGrouped[year].filter(d => d.exporter), 'exporter');
      const exportParsed = Object.keys(exportGrouped).map(exporter => {
        const exporterByYearValue = exportGrouped[exporter].reduce((acc, next) => acc + parseFloat(next.tons), 0)
        return {
          year,
          exporter,
          value: exporterByYearValue
        }
      })
      return exportParsed;
    }))
    const quick = parsed
      .reduce((acc, next) => {
        const accYear = acc[next.year] || {};
        return {
          ...acc,
          [next.year]: { ...accYear, year: next.year, [next.exporter]: next.value }
        };
      }, {});
    console.log(Object.values(quick));
    fs.writeFile('myjsonfile.json', JSON.stringify(quick), 'utf8');


    // const oneStep = Object.values(data
    //   .reduce((acc, next) => {
    //     const accYear = acc[next.year] || {};
    //     const accExporter = (accYear[next.exporter] || 0) + next.tons;
    //     const item = accExporter > 0
    //       ? { ...accYear, year: next.year, [next.exporter]: accExporter }
    //       : { ...accYear, year: next.year }
    //     return {
    //       ...acc,
    //       [next.year]: item
    //     };
    //   }, {})
    // );
    // console.log(oneStep);
  })

// var dataForge = require('data-forge');

// var dataFrame = dataForge
// 	.readFileSync('data.csv')
//   .parseCSV()
//   .groupBy(function (row) {
// 		return row.year;
// 	})
//   .groupBy(function (row) {
// 		return row.exporter;
//   })
//   .select(group => ({
//       year: group.first().year,
//       exporter: group.first().exporter,
//       value: group.select(row => row.tons).sum()
//   }))
//   .inflate();

// dataFrame.asCSV().writeFileSync('data-parsed.csv');

// console.log(dataFrame)
