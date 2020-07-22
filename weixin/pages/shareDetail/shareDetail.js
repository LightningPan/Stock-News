// <!--作者：李广 尚志强-->
// pages/mainpage/shareDetail/shareDetail.js
//股票详情界面
var wxCharts = require("../../utils/wxcharts.js");
var daylineChart = null;
var yuelineChart = null;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
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
    weekDay: null,
  
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
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  //确定股票编码
  getbianInput: function(e) {
    this.setData({
      inputdetailValue: e.detail.value
    })
  },
  //
  confirm:function(){
  
    var that=this
    
    wx.request({
      url:'http://hq.sinajs.cn/list='+this.data.jichu,
      header: {
        'content-type': 'text/json' // 默认值l
      },
      success(res){
         //   console.log(res.data);
         
         var temp = res.data.split("\"");
         var result = temp[1].split(",");
         // that.data.name = result[0];
        that.name = decodeURIComponent(result[0]);
        that.data.max = result[4];
              that.data.min = result[5];
              that.data.numShare=result[8];
              that.data.amount=result[9];
              that.data.kaipan = result[1];
              that.data.price=result[3];
     console.log( res.data)
       result:res.data

      }
    })
    this.setData({
 jichu:this.data.inputdetailValue,
imageUrl1: 'http://image.sinajs.cn/newchart/daily/n/'+ this.data.jichu+'.gif',
imageUrl2:'https://106.54.95.249/Chart/Prediction/'+this.data.jichu+'?Range=50',
name: this.data.name,
price:this.data.price,
numShare:this.data.numShare,
amount:this.data.amount,
max: this.data.max,
min: this.data.min,
kaipan: this.data.kaipan,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
   var bean=JSON.parse(options.result)
    var mydate = new Date();
    var myddy = mydate.getDay();
    var currentStock=options.currentStock;
    this.setData({
      currentStock:currentStock,
      result:bean,
      num: options.num,
      market: options.market,
      isSelected: options.isSelected == 'true' ? true : options.isSelected == 'false' ? false:'',
      weekDay:myddy,
      testShare:item,
      leekssharename:this.dataset[1],
      leeksshareame:this.dataset[0],
      currentStock:app.globalData.currentStock
     
    
    })
    console.log(result)
    if (this.data.isSelected) {
      this.setData({
        saveBtnContent: "已添加"
      })
    }
    this.confirm();

  },
  //confirm 动态改变图片url
 
  







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