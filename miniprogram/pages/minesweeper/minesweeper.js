// miniprogram/pages/minesweeper/minesweeper.js
var rowNum = 9;
var colNum = 9;
var mineNum = 10;
var globalGrids = null;
var globalState = null;
var visit = null;
var end = false;
var useFlag = false;

function extendZeros(grids, state, row, col) {
  globalGrids = grids;
  globalState = state;
  visit = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  visit[row][col] = true;
  recursion(row, col);
  return globalState;
}

function recursion(row, col) {
  for (var i = Math.max(0, row - 1); i <= Math.min(row + 1, rowNum - 1); i++) {
    for (var j = Math.max(0, col - 1); j <= Math.min(col + 1, colNum - 1); j++) {
      globalState[i][j] = true;
      visit[row][col] = true;
      if (globalGrids[i][j] == 0 && !visit[i][j]) {
        recursion(i, j);
      }
    }
  }
}
Page({
  data: {
    grids: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    state: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    flags: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    time: "00:00",
    minute: 0,
    second: 0,
    mines: [],
    bugNum: mineNum
  },
  onClick: function(e) {
    if (end) {
      return;
    }
    const that = this;
    var mines = that.data.mines;
    var grids = that.data.grids;
    var state = that.data.state;
    const dataset = e.currentTarget.dataset;
    if (mines.length) {
      if (useFlag) {
        var flags = that.data.flags;
        var bugNum = that.data.bugNum;
        if (bugNum > 0) {
          bugNum--;
          flags[dataset.row][dataset.col] = true;
          useFlag = false;
          that.setData({
            flags: flags,
            bugNum: bugNum
          })
        }
      } else {
        var tar = grids[dataset.row][dataset.col]
        if (tar == 0) {
          state = extendZeros(grids, state, dataset.row, dataset.col);
        } else if (tar == -1) {
          that.stopTimer();
          end = true;
        }
        state[dataset.row][dataset.col] = true;
        that.setData({
          state: state
        })
      }
    } else {
      // set mines
      while (mines.length < mineNum) {
        var r = [Math.floor(Math.random() * rowNum), Math.floor(Math.random() * colNum)];
        if (!(r[0] == dataset.row && r[1] == dataset.col) && mines.indexOf(r) == -1) {
          mines.push(r);
        }
      }
      // set numbers
      for (var mine of mines) {
        var row = mine[0];
        var col = mine[1];
        for (var i = Math.max(0, row - 1); i <= Math.min(row + 1, rowNum - 1); i++) {
          for (var j = Math.max(0, col - 1); j <= Math.min(col + 1, colNum - 1); j++) {
            grids[i][j]++;
          }
        }
      }
      // set mines in grids
      for (var mine of mines) {
        grids[mine[0]][mine[1]] = -1;
      }
      // check for zero extension
      if (grids[dataset.row][dataset.col] == 0) {
        state = extendZeros(grids, state, dataset.row, dataset.col);
      }
      that.setData({
        mines: mines,
        grids: grids
      })
      // start timer
      that.startTimer();
      // set state
      state[dataset.row][dataset.col] = true;
      that.setData({
        state: state
      })
    }
  },
  startTimer: function() {
    const that = this;
    this.data.timer = setInterval(function() {
      const sec = that.data.second;
      const min = that.data.minute;
      var newSec, newMin;
      if (sec < 59) {
        newSec = sec + 1;
        newMin = min;
      } else {
        newSec = 0;
        if (min < 59) {
          newMin = min + 1;
        } else {
          newMin = 0;
        }
      }
      var s = ""
      if (newSec < 10) {
        s = "0" + newSec.toString();
      } else {
        s = newSec.toString();
      }
      var m = ""
      if (newMin < 10) {
        m = "0" + newMin.toString();
      } else {
        m = newMin.toString();
      }
      that.setData({
        second: newSec,
        minute: newMin,
        time: m + ":" + s
      })
    }, 1000)
  },
  stopTimer: function() {
    clearInterval(this.data.timer);
  },
  restart: function() {
    end = false;
    this.stopTimer();
    this.setData({
      mines: [],
      grids: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      state: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      flags: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      minute: 0,
      second: 0,
      time: "00:00",
      timer: null,
      bugNum: mineNum
    })
  },
  onFlag: function() {
    useFlag = true;
  },
  removeFlag: function(e){
    const dataset = e.currentTarget.dataset;
    var flags = this.data.flags;
    flags[dataset.row][dataset.col] = 0;
    var bugNum = this.data.bugNum + 1;
    this.setData({
      flags: flags,
      bugNum: bugNum
    })
  }
})