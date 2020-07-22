// <!--作者：李广 尚志强-->
// pages/searchPage/searchPage.js\
//搜索框及搜索界面
const app = getApp();
Page({

  data: {
    indexItems: [],
    inputValue: null,
    shareItems: null,
    items:[],
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
     this.setData({
       inputValue : options.inputvalue
     })
     this.refreshItem()
     
  },
  getInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  onReady: function() {

  },
  //测试跳转到对应股票界面
  NavtoShareItem:function(e){
    //传递股票代码和名称
    //通过提供的JSON.stingify方法,将对象转换成字符串后传递
    var result=JSON.stringify(e.currentTarget.dataset.item);
   wx.navigateTo({
      url: '../shareDetail/shareDetail',
  })},
  NavtoShare: function(e) {
    wx.navigateTo({
      url: '../shareDetail/shareDetail?StockCode='+e.currentTarget.dataset.cur[0]+"&isSelected="+e.currentTarget.dataset.cur[1],
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  refreshItem: function() {
    var that = this
    that.data.indexItems=[];
    wx.request({
      url:  "https://106.54.95.249/StockInfo/StockName/" + this.data.inputValue,
      method:"GET",
      header:{
        'content-type': 'text/json'
      },
    success(res){

      for(var i=0;i<res.data.length;i++){
        let index=i
          wx.request({
            url: 'https://hq.sinajs.cn/list='+res.data[index][0],
            header: {
              'content-type': 'text/json' // 默认值
            },
            success(res1){
              var temp=res1.data.split(",")
              that.setData({
                tempindex:[
                  {
                    shareNum:res.data[index][0],
                    present:((temp[3]/temp[2]-1)*100).toFixed(2),
                    shareName:temp[0].split("\"")[1],
                    forecast:temp[3],
                     price:temp[3],
                     isSelected:true
                  }
                ]
              })
              var j=0
              for(;j<that.data.indexItems.length;j++){
                if(that.data.indexItems[j].shareNum==that.data.tempindex[0].shareNum){
                  that.data.indexItems[j]=that.data.tempindex[0]
                  break
                }
              }
              if(j==that.data.indexItems.length){
                that.data.indexItems=that.data.indexItems.concat(that.data.tempindex);
              }
              that.setData({
                indexItems:that.data.indexItems

              })
            }
          })
      }
    }
    })
    console.log(that.data.indexItems)
  },




  searchShare: function() {
    if(this.data.inputValue!=null){
      var that = this;
      var url = "https://106.54.95.249/StockInfo/StockName/" + this.data.inputValue;
      wx.request({
        url: url,
        //仅为示例，并非真实的接口地址

        header: {
          'content-type': 'text/json' // 默认值
        },
        
        success(res) {
          console.log(res.data)
          that.setData({
           items:res.data,
          
          })
        },
        fail(log){
          console.log('--------fail----------')
        },
        complete: function(res) {},
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