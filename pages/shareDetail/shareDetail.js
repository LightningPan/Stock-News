// <!--作者：李广 尚志强-->
// pages/mainpage/shareDetail/shareDetail.js
var wxCharts = require("../../utils/wxcharts.js");
var daylineChart = null;
var yuelineChart = null;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadModal:true,
    imageSrc: null,
    dataNum: [],
    saveBtnContent: '+ 自选',
    isSelected: false,
    market: "",
    num: "",
    name: "",
    max: "",
    min: "",
    kaipan: "",
    price: "",
    present: "",
    forecast: "",
    dayData: [],
    daySP: [],
    weekDay: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var mydate = new Date();
    var myddy = mydate.getDay();
var shareName=options.shareName;
    this.setData({
      num: options.num,
      market: options.market,
      isSelected: options.isSelected == 'true' ? true : options.isSelected == 'false' ? false:'',
      weekDay:myddy,
    
    })
    if (this.data.isSelected) {
      this.setData({
        saveBtnContent: "已添加"
      })
    }
    this.getShareInf();

  },
  getShareInf: function() {
    var that = this;
    wx.request({
      url: "http://hq.sinajs.cn/list=" + this.data.market + this.data.num.toLowerCase(),


      header: {
        'content-type': 'text/json' // 默认值l
      },
      success(res) {
        //   console.log(res.data);
        var temp = res.data.split("\"");
        var result = temp[1].split(",");
        // that.data.name = result[0];
        that.data.name = decodeURIComponent(result[0]);
        switch (that.data.market) {
          case "sh":
          case "sz":
            {
              that.data.max = result[4];
              that.data.min = result[5];
              that.data.kaipan = result[1];
              if (that.data.kaipan == 0) {
                that.data.kaipan = result[2];
              }
              that.data.price = result[3];
              if (that.data.price == 0) {
                that.data.price = result[2];
                that.data.present = "-";
              } else {
                var present = (result[3] - result[2]) * 100 / result[2];
                present = present.toFixed(2);
                that.data.present = ""
                if (present > 0) {
                  that.data.present = "+"
                }
                that.data.present = that.data.present + present;
              }
            }
            break;
          case "hk":
            {
              that.data.max = result[4];
              that.data.min = result[5];
              that.data.kaipan = result[2];
              if (that.data.kaipan == 0) {
                that.data.kaipan = result[3];
              }
              that.data.price = result[6];
              if (that.data.price == 0) {
                that.data.price = result[3];
                that.data.present = "-";
              } else {
                var present = (result[6] - result[3]) * 100 / result[3];
                present = present.toFixed(2);
                that.data.present = "";
                if (present > 0) {
                  that.data.present = "+"
                }
                that.data.present = that.data.present + present;

              }
            }
            break;
          case "gb_":
            {
              that.data.max = result[6];
              that.data.min = result[7];
              that.data.kaipan = result[5];
              if (that.data.kaipan == 0) {
                that.data.kaipan = result[26];
              }
              that.data.price = result[1];
              if (that.data.price == 0) {
                that.data.price = result[26];
                that.data.present = "-";
              } else {
                that.data.present = "";
                var present = (result[1] - result[26]) * 100 / result[26];
                present = present.toFixed(2);
                if (present > 0) {
                  that.data.present = "+"
                }
                that.data.present = that.data.present + present;

              }
            }
            break;
        }
        that.setData({
          name: that.data.name,
        
          max: that.data.max,
          min: that.data.min,
          kaipan: that.data.kaipan,
          price: that.data.price,
          present: that.data.present,
          forecast: that.data.forecast,
        })




        console.log(that.data.name);
        var marketTag = that.data.market == 'gb_' ? 'us' : that.data.market == 'hk' ? 'hk' : 'hs'
        var klineUrl;
        if (that.data.market == 'sh') {
          klineUrl = 'http://img1.money.126.net/data/' + marketTag + '/kline/day/history/2019/0' + that.data.num + '.json'
        } else if (that.data.market == 'sz') {
          klineUrl = 'http://img1.money.126.net/data/' + marketTag + '/kline/day/history/2019/1' + that.data.num + '.json'
        } else {
          klineUrl = 'http://img1.money.126.net/data/' + marketTag + '/kline/day/history/2019/' + that.data.num + '.json'
        }
        wx.request({
          url: klineUrl, //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data)
            that.data.name = res.data.name;
            for (var temi = 7; temi > 0; temi--) {
              that.data.dayData = that.data.dayData.concat([res.data.data[res.data.data.length - temi]]);
            }
            that.setData({
              dayData: that.data.dayData,
              name: that.data.name
            })
            console.log(that.data.dayData);

            wx.request({
              url: 'http://leektraining.work/getForecastInfo?sharename=' + that.data.name + '&sharenum=' + that.data.num + '&market=' + that.data.market,
              header: {
                'content-type': 'application/json'
              },
              success(res) {
                console.log(res);
                that.setData({
                  imageSrc: "http://leektraining.work/image/get?imgname=" + that.data.num + "  ",

                })
                if (typeof res.data == 'number') {
                  that.setData({
                    forecast: res.data.toFixed(3),
                    loadModal : false
                  })
                }

                {
                  var windowWidth = 320;
                  try {
                    var res = wx.getSystemInfoSync();
                    windowWidth = res.windowWidth;
                  } catch (e) {
                    console.error('getSystemInfoSync failed!');
                  }

                  for (var j = 0; j < 7; j++) {
                    console.log(that.data.dayData[j])
                    that.data.daySP = that.data.daySP.concat(that.data.dayData[j][2]);
                    that.data.dataNum = that.data.dataNum.concat(that.data.dayData[j][0].substr(that.data.dayData[j][0].length - 3, that.data.dayData[j][0].length))
                  }
                  var nextTime = (that.data.weekDay == 5) || (that.data.weekDay == 6) ? "下周一" : "明天"
                  that.data.dataNum = that.data.dataNum.concat(nextTime);
                  that.data.dataNum = that.data.dataNum.concat("");
                  that.setData({
                    daySP: that.data.daySP,
                    dataNum: that.data.dataNum
                  })
                  
                  yuelineChart = new wxCharts({ //当月用电折线图配置
                    canvasId: 'yueEle',
                    type: 'line',
                    categories: that.data.dataNum, //categories X轴
                    animation: true,

                    // background: '#f5f5f5',

                    series: [{
                      name: '实际',
                      data: that.data.daySP,
                      format: function (val, name) {
                        return val;
                      }
                    },
                    {
                      name: '预测',
                      data: [null, null, null, null, null, null, that.data.daySP[6], that.data.forecast],
                      format: function (val, name) {
                        return val;
                      }
                    }
                    ],
                    xAxis: {
                      disableGrid: true
                    },
                    yAxis: {
                      title: '股票',
                      format: function (val) {
                        return val.toFixed(2);
                      },
                      max: that.data.max * 1.1 > that.data.forecast * 1.1 ? that.data.max * 1.1 : that.data.forecast * 1.1,
                      min: that.data.min * 0.8 < that.data.forecast * 0.8 ? that.data.min * 0.8 : that.data.forecast * 0.8 ,
                    },
                    width: windowWidth*1.1,
                    height: 200,
                    dataPointShape: true,
                    dataLabel: true,
                    legend: false,
                    extra: {
                      lineStyle: 'straight',
                     
                    }
                  });
                }
              },
              fail(res) {
                that.setData({
                  imageSrc: "http://leektraining.work/image/get?imgname=" + that.data.name+ "  "
                })
              }
            })
            
          }
        })


      }
    })

  },

  goBackPage: function() {
    wx.navigateBack({
      delta: -1
    });
  },

  save: function() {
    var that = this;
    if (!this.data.isSelected) {
      wx.request({
        url: 'http://leektraining.work/addSaveShare?username=' + app.globalData.openid + '&sharenum=' + that.data.num,
      })
      this.data.isSelected = true,
        this.data.saveBtnContent = "已添加",
        console.log(this.data.saveBtnContent),
        this.setData({
          saveBtnContent: "已添加"
        })
    } else {
      wx.request({
        url: 'http://leektraining.work/deleteSaveShare?username=' + app.globalData.openid + '&shareNum=' + that.data.num,
      })
      this.data.isSelected = false,
        this.data.saveBtnContent = "+自选"
      this.setData({
        saveBtnContent: "+自选"
      })
    }
  },
  reloadimage: function() {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})