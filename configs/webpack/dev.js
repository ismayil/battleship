// development config
const merge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./common');

module.exports = merge(commonConfig, {
  entry: [
    'react-hot-loader/patch', // activate HMR for React
    'webpack-dev-server/client?http://localhost:8080',// bundle the client for webpack-dev-server and connect to the provided endpoint
    'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
    './index.tsx' // the entry point of our app
  ],
  devServer: {
    hot: true, // enable HMR on the server
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally
    new webpack.NamedModulesPlugin(), // prints more readable module names in the browser console on HMR updates
  ],
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
  created = !(checkArrayIndexOf(reservedArea, [x, y]) > -1);
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
let reqCoords = []
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
    if (dotCount < 2) {
      CreateShapeDot();
    }
    reqCoords = allCords;
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
  let check = checkArrayIndexOf(allCords, req.body.coords) > -1;
  if (check) {
    reqCoords.splice(checkArrayIndexOf(reqCoords, req.body.coords), 1)
  }
  if (reqCoords.length < 1) {
    res.json({ end: true })
  }
  res.json(check);
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