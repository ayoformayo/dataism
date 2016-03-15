const vo = require('vo');
const xRay = require('x-ray')
const _ = require('lodash');

const url = 'https://www.whoscored.com/statistics'

var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false })


var selector = 'select#category > optgroup option'
var subSelector = 'select#subcategory > optgroup option'
var result = nightmare
  .goto(url)
  .wait("li.in-squad-detailed-view:nth-child(5) > a:nth-child(1)")
  .click("li.in-squad-detailed-view:nth-child(5) > a:nth-child(1)")
  .wait('select#category')
  .click('select#category')
  .wait(selector)

  result.wait('select#category')
    .click('#category > optgroup:nth-child(1) > option:nth-child(1)')
    .wait('#subcategory > option:nth-child(1)')
    .evaluate(function () {
      return $('#subcategory > option').map((i, item)=> { return item.value })
    }).end()
    .then(function (results) {
      console.log(results)
      return results;
    })
console.log(result)
  // result.evaluate(function (selector) {
  //   return $(selector).map((i, item)=> { return item.value })
  // }, selector)
  // .end()
  // .then(function (results) {
  //   console.log(results)
  //   return results;
  // })
  // ["tackles", "interception", "fouls", "cards", "offsides", "clearances", "blocks", "saves", "shots", "goals", "dribbles", "possession-loss", "aerial", "passes", "key-passes", "assists"]
