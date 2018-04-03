// production config
const merge = require('webpack-merge');
const {resolve} = require('path');

const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  entry: './index.tsx',
  output: {
    filename: 'js/bundle.[hash].min.js',
    path: resolve(__dirname, '../../dist'),
    publicPath: '/',
  },
  devtool: 'source-map',
  plugins: [],
});





// import { create } from 'domain';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const portNumber = 3000;
const sourceDir = 'dist';

let reservedArea = [];
let allCords = [];

let shapeL = (x, y, vORh = 0 /*vertical*/, direction = 1 /*plus*/) => {
  let lastCords = [];
  let reservedCords = [];
  let created = true;
  if (vORh == 0) {
    lastCords = [[x, y], [x, y + 1], [x, y + 2], [x + direction, y + 2]];
    //created = !lastCords.some(v => reservedArea.includes(v));
    reservedCords = [
      [x + direction * 2, y + 2], [x + direction * 2, y + 1], [x, y],
      [x, y + 1], [x, y + 2], [x, y - 1],
      [x - 1, y - 1], [x - 1, y], [x - 1, y + 1],
      [x - 1, y + 2], [x + 1, y - 1], [x + 1, y],
      [x + 1, y + 1], [x + 1, y + 2], [x - 1, y + 3],
      [x, y + 3], [x + 1, y + 3]]
  }
  else {
    lastCords = [[x, y], [x + 1, y], [x + 2, y], [x + 2, y + direction]];
    //created = !lastCords.some(v => reservedArea.includes(v));
    reservedCords = [
      [x, y + direction * 2], [x + direction, y + direction * 2], [x, y],
      [x + 1, y], [x + 2, y], [x, y + 1],
      [x + 1, y + 1], [x + 2, y + 1], [x, y - 1],
      [x + 1, y - 1], [x + 2, y - 1], [x + 3, y - 1],
      [x + 3, y], [x + 3, y + 1], [x - 1, y - 1],
      [x - 1, y], [x - 1, y + 1]];
  }
  return (
    {
      shape: lastCords,
      reserved: reservedCords,
      isCreated: created
    }
  )
}
let shapeI = (x, y, vORh = 0 /*vertical*/) => {
  let lastCords = [];
  let reservedCords = [];
  let created = false;
  if (vORh == 0) {
    lastCords = [[x, y], [x, y + 1], [x, y + 2]];
    created = !lastCords.some(v => reservedArea.includes(v));
    reservedCords = [
      [x, y], [x, y + 1], [x, y + 2],
      [x, y - 1], [x - 1, y - 1], [x - 1, y],
      [x - 1, y + 1], [x - 1, y + 2], [x + 1, y - 1],
      [x + 1, y], [x + 1, y + 1], [x + 1, y + 2],
      [x - 1, y + 3], [x, y + 3], [x + 1, y + 3]]

  }
  else {
    lastCords = [[x, y], [x + 1, y], [x + 2, y]];
    created = !lastCords.some(v => reservedArea.includes(v));
    reservedCords = [
      [x, y], [x + 1, y], [x + 2, y],
      [x, y + 1], [x + 1, y + 1], [x + 2, y + 1],
      [x, y - 1], [x + 1, y - 1], [x + 2, y - 1],
      [x + 3, y - 1], [x + 3, y], [x + 3, y + 1],
      [x - 1, y - 1], [x - 1, y], [x - 1, y + 1]];
  }
  return ({
    shape: lastCords,
    reserved: reservedCords,
    isCreated: created
  })
}
let shapeDot = (x, y) => {
  let created = false;
  created = !checkArrayIndexOf(reservedArea, [x, y]);
  let reservedCords = [[x, y], [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1], [x - 1, y - 1], [x + 1, y + 1]];
  return ({
    shape: [[x, y]],
    reserved: reservedCords,
    isCreated: created
  })
}

app.use(bodyParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
let directions = [-1, 1];
app.get('/start', function (req, res) {
  function CreateShapeL() {
    let isVertical = Math.round(Math.random());
    var L = shapeL(Math.floor(Math.random() * (isVertical ? 7 : 9)), Math.floor(Math.random() * (isVertical ? 9 : 7)), isVertical, directions[Math.round(Math.random())])
    if (!L.isCreated) {
      CreateShapeL();
      return;
    }
    reservedArea = L.reserved;
    allCords = L.shape;
    console.log("-------------------------")
    console.log(L.reserved)
    console.log(L.shape)
    CreateShapeI();
    // console.log(L);
    // console.log(reservedArea);
  }
  function CreateShapeI() {
    let isVertical = Math.round(Math.random());
    var L = shapeI(Math.floor(Math.random() * (isVertical ? 7 : 9)), Math.floor(Math.random() * (isVertical ? 9 : 7)), isVertical)
    if (!L.isCreated) {
      CreateShapeI();
      return;
    }
    reservedArea = reservedArea.concat(L.reserved);
    allCords = allCords.concat(L.shape);
    console.log("-------------------------")
    console.log(L.reserved)
    console.log(L.shape)
    CreateShapeDot();
    // console.log(L);
    // console.log(reservedArea);
  }
  let dotCount = 0;
  function CreateShapeDot() {
    let isVertical = Math.round(Math.random());
    var dot = shapeDot(Math.floor(Math.random() * 9), Math.floor(Math.random() * 9))
    if (!dot.isCreated) {
      CreateShapeDot();
      return;
    }
    dotCount++;
    reservedArea = reservedArea.concat(dot.reserved);
    allCords = allCords.concat(dot.shape);
    console.log("-------------------------")
    console.log(dot.reserved)
    console.log(dot.shape)
    if (dotCount < 2) {
      CreateShapeDot();
    }
    // console.log(L);
    // console.log(reservedArea);
  }
  CreateShapeL();
  res.json();
})
app.get('/all', function (req, res) {
  res.json({ r: reservedArea, s: allCords });
})
app.post('/check', function (req, res) {
  //console.log(req.body.coords);
  //console.log(allCords);
  res.json(checkArrayIndexOf(allCords, req.body.coords) > -1);
})

app.use(express.static(sourceDir));
app.listen(portNumber, () => {
  console.log(`Express web server started: http://localhost:${portNumber}`);
});

function checkArrayIndexOf(arr, element) {
  for (var k = 0; k < arr.length; k++) {
    if (arr[k][0] == element[0] && arr[k][1] == element[1]) {
      return k;
    }
  }
  return -1;
}