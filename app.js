// <--作者：李广 尚志强-->
//app.js
const Towxml = require('/towxml/main');    //引入towxml库


App({

  onLaunch: function() {
    // 展示本地存储能力

     
    // 获取用户信息
    
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  getNwType:function(){
    var that =this;
    wx.getNetworkType({
      success(res) {
        that.globalData.networkType = res.networkType;
        if (res.networkType == "none" && ! that.globalData.inIndexPage) {
          wx.redirectTo({

            url: '/pages/index/index',

          });
        }
      }
    })
    setTimeout(this.getNwType, 1000);
  },
  towxml: new Towxml(),  

  globalData: {
    currentStock:null,
    userInfo:null,
    token:null,
    mySelect: null,
    networkType:null,
    inIndexPage:true
  }
})