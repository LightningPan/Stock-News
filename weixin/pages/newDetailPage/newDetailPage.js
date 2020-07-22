// pages/newDetailPage/newDetailPage.js
 
Page(

  {
  
  /**
   * 页面的初始数据
   */
  data: {
    newsTitles: [],
    inputnewdetailValue:null,
 resul:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
this.setData({
inputnewdetailValue:this.data.inputnewdetailValue
}),
    this.getNewsTitle();
   
  },
  NavtoNewsPage: function(e) {
    wx.navigateTo({
      url: '../newsPage/newsPage?newsaid='+this.data.newsTitles[e.currentTarget.dataset.cur].aid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //得到新闻标签
  getNewsTitle: function() {
    var that = this;

    wx.request({
      url: 'http://api.dagoogle.cn/news/nlist?cid=7'+'&psize=20' + "&page=" + that.data.newspage,
      //仅为示例，并非真实的接口地址

      header: {
        'content-type': 'text/json' // 默认值
      }, 
      success(res) {
        console.log(res.data.data.list);
      /* switch ( this.data.inputnewdetailValue) {
          case (军事):{
            inputnewdetailValue=2
            break;}
          
          case (汽车):{
                inputnewdetailValue=3
                break;}
          case (娱乐):{
                  inputnewdetailValue=1
                  break;}
          case (体育):{
              inputnewdetailValue=6
               break;}
          case (科技):{
              inputnewdetailValue=7
                break;}
          default:   inputnewdetailValue=4
            break;
        }*/
        that.data.newsTitles = that.data.newsTitles.concat(res.data.data.list);
        that.setData({
          newsTitles: that.data.newsTitles,
          inputnewdetailValue:that.data.inputnewdetailValue
        })
      }
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
    console.log(this.data.newspage);
    this.setData({
      newspage: this.data.newspage + 1
    })
    this.getNewsTitle();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})