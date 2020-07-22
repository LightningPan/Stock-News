 // <--作者：李广 尚志强-->
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    modalName:null,
  },
  //事件处理函数
  btn_login: function() {

    var that = this;
    
    wx.login({
      success(res){
        if(res.code){
            wx.request({
              url: 'https://106.54.95.249/Login',
              method:"POST",
              data:{
                code:res.code
              },
              header:{
                'Content-Type':'application/x-www-form-urlencoded'
              },
              success:function(res){
                app.globalData.token=res.data
                console.log(app.globalData.token)
              }
            })
        }
      }
    })
    app.globalData.inIndexPage = false;

    wx.navigateTo({
      url: '../mainpage/mainpage'
    })

  },

  onLoad: function() {
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    setTimeout(this.checkNetWork, 1000);
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  checkNetWork:function(){
    if (app.globalData.networkType=="none"){
        this.setData({
          modalName:'notNwModal'
        })
    } else if (app.globalData.networkType != null && this.data.modalName =="notNwModal"){
      this.setData({
        modalName: null,
      })
      wx.navigateBack({
        
      })
    }

    setTimeout(this.checkNetWork, 1000);
  },
  onShow:function(){
    app.globalData.inIndexPage = true;
  }
})