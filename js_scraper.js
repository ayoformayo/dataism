// const vo = require('vo');
// const xRay = require('x-ray')
// const _ = require('lodash');
//
const url = 'https://www.whoscored.com/statistics'
//
// var Nightmare = require('nightmare');
// var nightmare = Nightmare({ show: false })
//
//
var selector = 'select#category > optgroup option'
// var subSelector = 'select#subcategory > optgroup option'
//   nightmare
//   .goto(url)
  // .wait("li.in-squad-detailed-view:nth-child(5) > a:nth-child(1)")
  // .click("li.in-squad-detailed-view:nth-child(5) > a:nth-child(1)")
  // .wait('select#category')
  // .click('select#category')
  // .wait(selector)
//
//   result.wait('select#category')
//     .click('#category > optgroup:nth-child(1) > option:nth-child(1)')
//     .wait('#subcategory > option:nth-child(1)')
//     .evaluate(() => {
//       return $('#subcategory > option').map((i, item)=> { return item.value })
//     }).run((err, nightmare)=> {
//     }).end();

'#category > optgroup:nth-child(1) > option:nth-child(1)'
    var Nightmare = require('nightmare');
    var vo = require('vo');

    vo(run)(function(err, result) {
        if (err) throw err;
    });

    function* run() {
        var nightmare = Nightmare({ show: false }),
            MAX_PAGE = 5,
            currentPage = 0,
            nextExists = true,
            links = [];

        var vals = yield nightmare
            .goto(url)
            .wait("li.in-squad-detailed-view:nth-child(5) > a:nth-child(1)")
            .click("li.in-squad-detailed-view:nth-child(5) > a:nth-child(1)")
            .wait('select#category')
            .click('select#category')
            .wait('#category > optgroup:nth-child(1) > option:nth-child(1)').click('#category > optgroup:nth-child(1) > option:nth-child(1)')
            .wait('#subcategory > option:nth-child(1)')
            .evaluate(() => {
              // return $('#category > optgroup').map((i, optgroup)=> {
              return _.map(document.querySelectorAll('#category > optgroup'), (optgroup, i)=> {
                return {
                  type: optgroup.label,
                  categories: _.map(optgroup.querySelectorAll('option'), (option, i)=>{ return option.value }),
                  // name: item.value
                }
              })
            });
        console.log('start loop')
        for (i = 0; i < vals.length; i++) {
          for(t = 0; t < vals[i]["categories"].length; t++) {
            var categoryName = vals[i]["categories"][t];
            var optionSelector = '#category > optgroup:nth-child(' + (i + 1) + ') > option:nth-child(' + (t + 1) + ')';
            // console.log(optionSelector)
            // var subcategories = []
            var options = yield nightmare
            .wait('select#category')
            .select('select#category', categoryName)
            .wait(optionSelector)
            // .select(optionSelector)
            // .mouseup('select#category')
            .wait('#subcategory > option')
            .evaluate(() => {
              return _.map($('#subcategory > option'), (opt)=>{ return opt.value });
            });
            console.log(options)
            // console.log(vals[i]["categories"][t]["subcategories"])
            vals[i]["categories"][t] = {
              subcategories: options,
              name: categoryName
            };
            // vals[i]["categories"][t]["subcategories"].push(options);
          }
        }
        console.log('end loop')
        console.log(vals[0]["categories"].length)

        var fs = require('fs');

        var outputFilename = 'playerSchema.json';

        fs.writeFile(outputFilename, JSON.stringify(vals, null, 2), function(err) {
            if(err) {
              console.log(err);
            } else {
              console.log("JSON saved to " + outputFilename);
            }
        });
          // console.log(i)
        //   var val = vals[i]
        //   var select = i + 1;
        //   var optionSelector = '#category option:nth-child(' + select +')'
        //   // console.log(optionSelector
        // #category > optgroup:nth-child(2) > option:nth-child(1))
          // var options = yield nightmare
          // .wait(optionSelector)
        //   console.log(optionSelector)
          // vals[i]['subcategories'] = yield nightmare
          // .wait('#category > option:nth-child(1)').click(optionSelector)
          // .wait('#subcategory > option:nth-child(1)')
          // .evaluate(() => {
          //   return $('#subcategory > option')
          // })
        // }
        // vals[0]["subcategories"] = ["adasd"]

        while (nextExists && currentPage < MAX_PAGE) {
            links.push(yield nightmare
                .evaluate(function() {
                    var linkArray = [];
                    var links = document.querySelectorAll('h3.r a');
                    return links[0].href;
                }));

            yield nightmare
                .click('#pnnext')
                .wait(2000)

            currentPage++;
            nextExists = yield nightmare.visible('#pnnext');
        }
        yield nightmare.end();
    }
