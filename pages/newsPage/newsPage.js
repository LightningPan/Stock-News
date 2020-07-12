//<!--作者：李广 尚志强-->
// pages/newsPage/newsPage.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aid: "",
    articleStr: "",
    article: {},
    newsdata: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      aid: options.newsaid
    })
    console.log(this.data.aid)
    this.getNewsMes()
  },

  getNewsMes: function () {
    app.to
    var that = this;

    wx.request({
      url: "http://api.dagoogle.cn/news/ndetail?aid=" + this.data.aid,
      //仅为示例，并非真实的接口地址

      header: {
        'content-type': 'text/json' // 默认值
      },
      success(res) {
        console.log(res.data.data);
        that.setData({
          newsdata: res.data.data,
          articleStr: res.data.data.content
        })
        let article = app.towxml.toJson(that.data.articleStr, 'html');
        article.theme = 'dark'; 
        that.setData({
          article: article
        })
      },
    })

  

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})