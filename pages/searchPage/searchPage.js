// <!--作者：李广 尚志强-->
// pages/searchPage/searchPage.js\
const app = getApp();
Page({

  data: {
    inputValue: null,
    shareItems: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  getInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  onReady: function() {

  },
  NavtoShare: function(e) {
    wx.navigateTo({
      url: '../shareDetail/shareDetail?market=' + e.currentTarget.dataset.cur[0] + "&num=" + e.currentTarget.dataset.cur[1] + "&isSelected=" + e.currentTarget.dataset.cur[2],
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  searchShare: function() {
    if(this.data.inputValue!=null){
      var that = this;
      var url = "http://106.15.182.82:8080/getSharesByShareName?sharename=" + this.data.inputValue;
      wx.request({
        url: url,
        //仅为示例，并非真实的接口地址

        header: {
          'content-type': 'text/json' // 默认值
        },
        success(res) {
          console.log(res.data);
          that.data.shareItems = res.data;

          for (var i = 0; i < that.data.shareItems.length; i++) {
            that.data.shareItems[i].isSelected = false;
            that.data.shareItems[i].index = i;
            for (var j = 0; j < app.globalData.mySelect.length; j++) {
              if (that.data.shareItems[i].shareNum == app.globalData.mySelect[j].shareNum) {
                that.data.shareItems[i].isSelected = true;
              }
            }
          }
          that.setData({
            shareItems: that.data.shareItems
          })
        },
      })
    }

  },

  addOrDelShare: function(e) {
    var that = this;
    var isSelected = e.currentTarget.dataset.cur[0];
    var num = e.currentTarget.dataset.cur[1];
    var index = e.currentTarget.dataset.cur[2];
    if (!isSelected) {
      wx.request({
        url: 'http://106.15.182.82:8080/addSaveShare?username=' + app.globalData.openid + '&sharenum=' + num,
      })
      this.data.shareItems[index].isSelected = true;
      this.setData({
        shareItems: this.data.shareItems
      })
    } else {
      wx.request({
        url: 'http://106.15.182.82:8080/deleteSaveShare?username=' + app.globalData.openid + '&shareNum=' + num,
      })
      this.data.shareItems[index].isSelected = false;
      this.setData({
        shareItems: this.data.shareItems
      })
    }
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
    var that = this;

    if(this.data.shareItems!=null){
      wx.request({
        url: 'http://106.15.182.82:8080/searchSaveShareByUserName?username=' + app.globalData.openid,
        success(res) {
          console.log(res.data);
          app.globalData.mySelect = res.data;
          for (var i = 0; i < that.data.shareItems.length; i++) {
            that.data.shareItems[i].isSelected = false;
            that.data.shareItems[i].index = i;
            for (var j = 0; j < app.globalData.mySelect.length; j++) {
              if (that.data.shareItems[i].shareNum == app.globalData.mySelect[j].shareNum) {
                that.data.shareItems[i].isSelected = true;
              }
            }
          }
          that.setData({
            shareItems: that.data.shareItems
          })
        }
      })

    }
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