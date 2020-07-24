//<!--作者：李广 尚志强-->
// pages/mainpage/mainpage.js
//主页面 包含tabbar的主界面
import * as echarts from "../../ec-canvas/echarts"
const app = getApp();

Page({
  data: {
    money:200000,
    integral: 0,//判断最大值
    currentTab: 0,
    result1:0,//股票当前价格
    topprice:0,//股票涨停价格
    lowprice:0,//股票跌停价格
    profitloss:0,//浮动盈亏
    sharenums:0,//最大购买股票数量
    shareinput:100,//输入购买股票数量
    sharename:null,//股票名称
    marketvalue:0,//股票总市值
    StockInput:null,
    inputnewdetailValue:null,
    messagesData: null,
    fbInput: null,
    modalName: null,
    inputValue: null,
    userInfo: null,
    newspage: 1,
    marketName: ["沪深", "港股", "美股"],
    TabCur: 0,
    indexItems: [],
    showGoTop: false,
    NewsscrollTop:0,
    tempindex:null,

    ggstockIndexs: [{
      name: "恒生指数",
      num: "hkHSI",
      price: "-",
      present: "-",
      changePrice: "-"
    }, {
      name: "国企指数",
      num: "hkHSCEI",
      price: "-",
      present: "-",
      changePrice: "-"
    }, {
      name: "红筹指数",
      num: "hkHSCCI",
      price: "-",
      present: "-",
      changePrice: "-"
    }],

    hsstockIndexs: [{
      name: "上证指数",
      num: "sh000001",
      price: "-",
      present: "-",
      changePrice: "-"
    }, {
      name: "深圳成指",
      num: "sz399001",
      price: "-",
      present: "-",
      changePrice: "-"
    }, {
      name: "创业板指",
      num: "sz399006",
      price: "-",
      present: "-",
      changePrice: "-"
    }],
    mgstockIndexs: [{
      name: "道琼斯",
      num: "gb_dji",
      price: "-",
      present: "-",
      changePrice: "-"
    }, {
      name: "纳斯达克",
      num: "gb_ixic",
      price: "",
      present: "-",
      changePrice: "-"
    }, {
      name: "标普500",
      num: "gb_inx",
      price: "-",
      present: "-",
      changePrice: "-"
    }],

    PageCur: 'myOption',
    newsTitles: [],
    ecReturnRate: {
      lazyLoad: true
    },
    optionReturnRate: null,
    message: [{
      code: 'sz000001',
      name: '平安银行',
      price: 13.50,
      holdNum: 100,
      returnRate: -3.64,
      change: -0.51
    }, {
      code: 'sh600519',
      name: '贵州茅台',
      price: 1595.30,
      holdNum: 100,
      returnRate: -3.11,
      change: -80.7
    }],
  },

 //跳转到搜索界面
 navToNewdetail:function(){
  wx.navigateTo({
    url: '../newDetailPage/newDetailPage?inputnewdetailValue='+this.data.inputnewdetailValue,
  })
  if(this.data.inputnewdetailValue!=null){
    wx.request({
   
      url: 'https://106.54.95.249/StockNews/FuzzySearch?content='+this.data.inputnewdetailValue,
      header: {
        'content-type': 'text/json' // 默认值
      },
      success(rec){
//console.log(rec.data)
that.setData({
  resul:rec.data,
 })
      }
    })
  }
},
//滑动切换
swiperTab: function (e) {
  var that = this;
  that.setData({
    currentTab: e.detail.current
  });
},
//点击切换
clickTab: function (e) {
  var that = this;
  if (e.target.dataset.current == 3) {
    this.ecComponentReturn = this.selectComponent('#mychart-dom-line');
    that.initBarReturn();
  }
  if (this.data.currentTab === e.target.dataset.current) {
    return false;
  } else {
    that.setData({
      currentTab: e.target.dataset.current
    })
  }
},

initBarReturn: function () {
  console.log("初始化图表")
  var that = this
  this.ecComponentReturn.init((canvas, width, height) => {
    // 初始化图表
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    chart.setOption(that.data.optionReturnRate);
    //wx.hideLoading();
    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return chart;
  });
},

setReturnRateOption: function () {
  console.log("加载option")
  var option = {
    xAxis: {
      type: 'category',
      data: ['2020/7/17', '2020/7/18', '2020/7/19', '2020/7/20', '2020/7/21', '2020/7/22', '2020/7/23', '2020/7/24', '2020/7/25', ],
      axisLabel: {
        textStyle: {
          color: '#ffffff'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} %',
        textStyle: {
          color: '#ffffff'
        }
      }
    },
    series: [{
      data: [0, 0, 0, -0.67, 1.23, 1.83, 1.71, -3.11],
      type: 'line'
    }]
  }
  this.setData({
    optionReturnRate: option
  })
},
  //模拟交易界面中的搜索函数
  searchdetailShare1: function () {
    console.log(this.data.inputValue)
    if (this.data.inputValue != null) {
      var that = this;
      var money = this.data.money;

      var url = "https://hq.sinajs.cn/list=" + this.data.inputValue;
      wx.request({
        url: url,
        header: {
          'content-type': 'text/json;charset=utf-8' // 默认值

        },
        success(res1) {
          console.log(res1.data)
          var result2 = res1.data.split(",")[3] //当前价格
          var openprice = res1.data.split(",")[1] //开盘价
          var lowprice = (openprice * 0.9).toFixed(3) //最低价
          var topprice = (openprice * 1.1).toFixed(3) //最高价
          var name = res1.data.split(",")[0] //股票名称
          var pricename = name.split("\"")[1] //
          console.log(name)
          console.log(pricename)
          console.log("test:"+((money-that.data.marketvalue)/result2))
          that.setData({
            result1: res1.data.split(",")[3], //设置股票当前价格
            sharenums: parseInt((money-that.data.marketvalue) / result2), //最大购买数量
            sharename: pricename, //股票名称
            lowprice: lowprice,
            topprice: topprice,
          })
          console.log("this is ")
          console.log(that.data)

        },
        fail(log) {
          console.log('--------fail----------')
        }
      })
    }

  },





  //模拟交易界面中的购买股票函数
  purchaseshares: function () {
    var that = this
    if (this.data.shareinput != null) {
      var sharenum = this.data.sharenums;
      var priceid = this.data.inputValue;
      var price = this.data.result1;
      var pricename = this.data.sharename;
      var shareinput = this.data.shareinput === 100 ? this.data.sharenums : this.data.shareinput
      if (priceid != null) {
        wx.showModal({
          title: '股票买入确认',
          content: "账户：模拟股票用户\r\n股票代码：" + priceid + "\r\n数量：" + shareinput + "  价格：" + price + "\r\n您是否确认以上买入信息",
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              var temp = that.data.marketvalue
              var messageTemp = that.data.message
              var t = {
                code: sharenum,
                name: pricename,
                price: price,
                holdNum: shareinput,
                returnRate: 0,
                change: 0
              }
              messageTemp.push(t)
              that.setData({
                marketvalue: temp + price * shareinput,
                message:messageTemp
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      } else {
        wx.showModal({
          title: '提示信息',
          content: "请输入股票代码",
          success(res) {}
        })
      }

    }

  },

 //模拟卖出股票
 sell: function () {
  var that = this
  wx.showModal({
    title: '股票卖出',
    content: "账户：模拟股票用户\r\n您是否确认以上买出信息",
    success(res) {
      if (res.confirm) {
        var temp = that.data.marketvalue
        console.log('用户点击确定')
        that.setData({
          message: [{
            code: 'sh600519',
            name: '贵州茅台',
            price: 1595.30,
            holdNum: 100,
            returnRate: -3.11,
            change: -80.7
          }],
          marketvalue: temp - 13.50 * 100
        })


      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
},





getIntegral: function (e) {
  var integral = e.detail.value;
  if (integral <= this.data.sharenums) { // 判断value值是否小于等于100, 如果大于100限制输入100
    if (integral == '') { // 判断value值是否等于空,为空integral默认0,
      this.setData({
        integral: 0
      })
    } else {
      this.setData({
        integral: integral,
        shareinput: e.detail.value,
      })
    }

  } else {
    wx.showToast({
      title: '最多可买' + this.data.sharenums + '股, 请重新输入',
      icon: 'none',
    })
    this.setData({
      integral: this.data.sharenums,
      shareinput: this.data.sharenums,
    })
  }
},


//获取新闻输入
getdetailinput:function(e){
this.setData({
  inputnewdetailValue: e.detail.value
})
},
 
  NavChange(e) {
    var that = this;
    this.setData({
      PageCur: e.currentTarget.dataset.cur,
      modalName: null,
    })
  },
  /**
   * 页面的初始数据
   */

  /**
   * 生命周期函数--监听页面加载
   */
  //message 获取输入
  getdetailInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //message 获取duankou
  searchdetailShare: function() {
    if(this.data.inputValue!=null){
      var that = this;
      var url = "https://106.54.95.249/StockDetail/" + this.data.inputValue;
      wx.request({
        url: url,
        header: {
          'content-type': 'text/json' // 默认值
        },
        success(res) {
          //console.log(res.data)
          that.setData({
           result:res.data,
          })
        },
        fail(log){
          //console.log('--------fail----------')
        }
      })
    }

  },

  onLoad: function() {
    this.getMessages();
    this.data.userInfo = app.globalData.userInfo;
    this.setData({
      userInfo: this.data.userInfo,
    })
    this.refreshIndex();
    this.refreshItem();
    this.getNewsTitle();
    this.setReturnRateOption()
  },

  getNewsTitle: function() {
    var that = this;
    var newsUrl = "http://api.dagoogle.cn/news/nlist?cid=4&psize=10";
    wx.request({
      url: newsUrl + "&page=" + that.data.newspage,
      //仅为示例，并非真实的接口地址

      header: {
        'content-type': 'text/json' // 默认值
      },
      success(res) {
        //console.log(res.data.data.list);
        that.data.newsTitles = that.data.newsTitles.concat(res.data.data.list);
        that.setData({
          newsTitles: that.data.newsTitles
        })
      }
    })
  },
  //九大指数
  refreshIndex: function() {
    var that = this
    var hsurl = 'https://hq.sinajs.cn/list='
    var ggurl = 'https://hq.sinajs.cn/list='
    var mgurl = 'https://hq.sinajs.cn/list='
    //沪深
    {
      for (var i = 0; i < that.data.hsstockIndexs.length; i++) {
        // console.log(app.globalData.hsstockIndexs[i].num),
        hsurl = hsurl + that.data.hsstockIndexs[i].num + ',';
      }
      var hsindex = 0;
      wx.request({
        url: hsurl,
        //仅为示例，并非真实的接口地址

        header: {
          'content-type': 'text/json' // 默认值
        },
        success(res) {
          var line = res.data.split(";");
          for (var j = 0; j < that.data.hsstockIndexs.length; j++) {
            var x = line[j].split("\"");
            var result = x[1].split(",");
            //console.log(result[3]);
            that.data.hsstockIndexs[hsindex].price = result[3];
            if (that.data.hsstockIndexs[hsindex].price == 0) {
              that.data.hsstockIndexs[hsindex].price = result[2];
              that.data.hsstockIndexs[hsindex].present = "-";
            } else {
              var changePrice = (result[3] - result[2]);
              var present = (result[3] - result[2]) * 100 / result[2];
              present = present.toFixed(2);
              that.data.hsstockIndexs[hsindex].present = ""
              that.data.hsstockIndexs[hsindex].changePrice  = ""
              if (present > 0) {
                that.data.hsstockIndexs[hsindex].present = "+";
                that.data.hsstockIndexs[hsindex].changePrice = "+"
              }
              that.data.hsstockIndexs[hsindex].present = that.data.hsstockIndexs[hsindex].present + present;
              that.data.hsstockIndexs[hsindex].changePrice = that.data.hsstockIndexs[hsindex].changePrice + changePrice.toFixed(2);
            }

            that.setData({
              hsstockIndexs: that.data.hsstockIndexs
            })
            hsindex++;
            // that.stockIndexs[i].price = result[4];
          }
        },

      })
    }
    //港股
    {
      for (var i = 0; i < that.data.ggstockIndexs.length; i++) {
        // console.log(app.globalData.hsstockIndexs[i].num),
        ggurl = ggurl + that.data.ggstockIndexs[i].num + ',';
      }
      var ggindex = 0;
      wx.request({
        url: ggurl,
        //仅为示例，并非真实的接口地址

        header: {
          'content-type': 'text/json' // 默认值
        },
        success(res) {
          var line = res.data.split(";");
          for (var j = 0; j < that.data.ggstockIndexs.length; j++) {
            var x = line[j].split("\"");
            var result = x[1].split(",");
            //console.log(result[6]);
            that.data.ggstockIndexs[ggindex].price = result[6];
            if (that.data.ggstockIndexs[ggindex].price == 0) {
              that.data.ggstockIndexs[ggindex].price = result[3];
              that.data.ggstockIndexs[ggindex].present = "-";
            } else {
              var changePrice = (result[6] - result[3]);
              var present = (result[6] - result[3]) * 100 / result[3];
              present = present.toFixed(2);
              that.data.ggstockIndexs[ggindex].present = "";
              that.data.ggstockIndexs[ggindex].changePrice = "";
              if (present > 0) {
                that.data.ggstockIndexs[ggindex].present = "+";
                that.data.ggstockIndexs[ggindex].changePrice = "+";
              }
              that.data.ggstockIndexs[ggindex].present = that.data.ggstockIndexs[ggindex].present + present;
              that.data.ggstockIndexs[ggindex].changePrice = that.data.ggstockIndexs[ggindex].changePrice + changePrice.toFixed(2);

            }

            that.setData({
              ggstockIndexs: that.data.ggstockIndexs
            })
            ggindex++;
            // that.stockIndexs[i].price = result[4];
          }
        },

      })
    }
    //美股
    {
      for (var i = 0; i < that.data.mgstockIndexs.length; i++) {
        // console.log(app.globalData.hsstockIndexs[i].num),
        mgurl = mgurl + that.data.mgstockIndexs[i].num + ',';
      }
      var mgindex = 0;
      wx.request({
        url: mgurl,
        //仅为示例，并非真实的接口地址

        header: {
          'content-type': 'text/json' // 默认值
        },
        success(res) {
          var line = res.data.split(";");
          for (var j = 0; j < that.data.mgstockIndexs.length; j++) {
            var x = line[j].split("\"");
            var result = x[1].split(",");
            //console.log(result[1]);
            that.data.mgstockIndexs[mgindex].price = result[1];
            if (that.data.mgstockIndexs[mgindex].price == 0) {
              that.data.mgstockIndexs[mgindex].price = result[26];
              that.data.mgstockIndexs[mgindex].present = "-";
            } else {
              that.data.mgstockIndexs[mgindex].changePrice = "";
              that.data.mgstockIndexs[mgindex].present = "";
              var changePrice = (result[1] - result[26]);
              var present = (result[1] - result[26]) * 100 / result[26];
              present = present.toFixed(2);
              if (present > 0) {
                that.data.mgstockIndexs[mgindex].present = "+";
                that.data.mgstockIndexs[mgindex].changePrice = "+"
              }
              that.data.mgstockIndexs[mgindex].present = that.data.mgstockIndexs[mgindex].present + present;
              that.data.mgstockIndexs[mgindex].changePrice = that.data.mgstockIndexs[mgindex].changePrice + changePrice.toFixed(2);
            }

            that.setData({
              mgstockIndexs: that.data.mgstockIndexs
            })
            mgindex++;
            // that.stockIndexs[i].price = result[4];
          }
        },

      })
    }
    setTimeout(this.refreshIndex, 3000)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  /* 
  * author:Tan Pan
  * create time:2020-07-21
  * update time:2020-07-22
  */
  refreshItem: function() {
    var that = this
    var tindex=[]
    that.data.tempindex=null
    wx.request({
      url: 'https://106.54.95.249/UserStock',
      method:"GET",
      header:{
        'token' : app.globalData.token
      },
      
    success(res){
      for(var i=0;i<res.data.length;i++){
        let index=i
          wx.request({
            url: 'https://hq.sinajs.cn/list='+res.data[index],
            header: {
              'content-type': 'text/json' // 默认值
            },
            success(res1){
              var temp=res1.data.split(",")
              //console.log(temp)
              //console.log(temp[0].split("\"")[1])
              wx.request({
                url: 'https://106.54.95.249/Chart/Prediction/one/'+res.data[index],
                method:"GET",
                header: {
                  'content-type': 'text/json' // 默认值
                },success(res2){
                  that.setData({
                    tempindex:[
                      {
                        shareNum:res.data[index],
                        present:((temp[3]/temp[2]-1)*100).toFixed(2),
                        shareName:temp[0].split("\"")[1],
                        forecast:res2.data.toFixed(2),
                         price:(temp[3]/1).toFixed(2),
                         isSelected:true
                      }
                    ]
                  })
                  //console.log(that.data.tempindex)
                  var j=0
                  for(;j<tindex.length;j++){
                    if(tindex[j].shareNum==that.data.tempindex[0].shareNum){
                      tindex[j]=that.data.tempindex[0]
                      break
                    }
                  }
                  if(j==tindex.length){
                    tindex=tindex.concat(that.data.tempindex);
                  }
                  if(tindex==[]){
                    that.setData({
                      indexItems:[]
                    })

                  }
                  that.setData({
                    indexItems:tindex
    
                  })
                }
              })
              
            }
          })
      }
    }
    })
    if (this.data.PageCur =="myOption"){
      setTimeout(this.refreshItem, 3000)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  marketSelect: function(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })

  },

  NavtoNewsPage: function(e) {
    wx.navigateTo({
      url: '../newsPage/newsPage?newsaid=' + this.data.newsTitles[e.currentTarget.dataset.cur].aid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  NavtoShare: function(e) {
    //console.log(e);
    var that=this
    wx.navigateTo({
      url: '../stockDetail/stockDetail?stockcode='+e.currentTarget.dataset.cur[0]+"&isSelected=1",
      success: function(res) {that.data.PageCur="detail"},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  getInput: function(e) {
    this.setData({
      StockInput: e.detail.value
    })
  },
  getFbIput: function(e) {
    this.setData({
      fbInput: e.detail.value
    })
  },


  showModal: function(e) {
    console.log(e)
    if (this.data.modalName != null) {
      this.setData({
        modalName: null
      })
    } else {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    }
  },
  hideModal: function(e) {
    var that = this;
    switch (this.data.modalName) {
      case 'feedbackModal':
        if (this.data.fbInput != null && this.data.fbInput != "") {

         /* wx.request({
            url: 'http://106.15.182.82:8080/sendSuggestion?username=' + app.globalData.openid + '&content=' + that.data.fbInput,
          })*/
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '请填写内容，再发送',
            icon: 'none',
            duration: 2000
          })
        }
        this.setData({
          fbInput: null
        })
        break;
      case "selectModal":
        this.onShow();
        break;

    }
    this.setData({
      modalName: null
    })
  },
  onReady: function() {

  },
  navToSp: function() {
    var that=this
    wx.navigateTo({
      url: '../searchPage/searchPage?inputvalue='+that.data.StockInput+'&stockcode='+that.data.StockInput,
      success: function(res) {that.data.PageCur="search"},
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  addOrDelShare: function(e) {
    var that = this;
    var isSelected = e.currentTarget.dataset.cur[0];
    var num = e.currentTarget.dataset.cur[1];
    var index = e.currentTarget.dataset.cur[2];
    if (!isSelected) {
     /* wx.request({
        url: 'http://106.15.182.82:8080/addSaveShare?username=' + app.globalData.openid + '&sharenum=' + num,
      })*/
      this.data.indexItems[index].isSelected = true;
     /* this.setData({
        indexItems: this.data.indexItems
      })*/
    } else {
      /*wx.request({
        url: 'http://106.15.182.82:8080/deleteSaveShare?username=' + app.globalData.openid + '&shareNum=' + num,
      })*/
      /*this.data.indexItems[index].isSelected = false;
      this.setData({
        indexItems: this.data.indexItems
      })*/

    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.data.PageCur="myOption"
    //console.log(that.data.PageCur)
    that.refreshItem()
  
  },
  onPageScroll: function (e) {
    //console.log(e.detail.scrollTop)
    if (e.detail.scrollTop > 1500) {
      this.setData({
        showGoTop: true
      })
    } else {
      this.setData({
        showGoTop: false
      })
    }
  },
  // 回到顶部
  goTop: function (e) {
   this.setData({
     NewsscrollTop:0
   })
  },

  getMessages: function() {
    var that = this;
    let map = {}; // 处理过后的数据对象
    let temps = []; // 临时变量
   /* wx.request({
      url: 'http://106.15.182.82:8080/getMessageByUserName?username=' + app.globalData.openid,
      success(res) {
        console.log(res.data);
        var num = 0;
        that.data.unreadNum = 0;
        for (let key in res.data) {
          num++;
          let ekey = res.data[key].date;
          if (res.data[key].isread == 0) {
            that.data.unreadNum++;
          }
          temps = map[ekey] || [];
          temps.push({
            date: res.data[key].date,
            contents: res.data[key],
          });
          map[ekey] = temps;
        }
        map.num = num;
        that.data.messagesData = map;
        that.setData({
          messagesData: that.data.messagesData,
         
        })
        if (that.data.PageCur== "messagesPage") {
          wx.request({
            url: 'http://106.15.182.82:8080/changeIsReadByUserName?username=' + app.globalData.openid,
            success(res) {
              console.log(res.data);
            }
          })
          that.setData({
            unreadNum: 0
          })
        }else{
         that.setData({
           unreadNum: that.data.unreadNum
         })
        }

      }
    })*/
    setTimeout(this.getMessages, 30000);
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
    //console.log(this.data.newspage);
    this.setData({
      newspage: this.data.newspage + 1
    })
    this.getNewsTitle();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})