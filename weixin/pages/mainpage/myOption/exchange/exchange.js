
// author:张圯
// createTime:2020-07-23
// updateTime:2020-07-24


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("调用组件")
  },

  sell:function(){
  console.log("卖出")
    this.setData({
   showModal:true
  })
  },
   ok:function(){
  console.log(this.data.textV)
  this.setData({
   showModal:false
  })},

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