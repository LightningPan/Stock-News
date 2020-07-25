// author:张圯
// createTime:2020-07-19
// updateTime:2020-07-24

import * as echarts from '../../ec-canvas/echarts';
const app = getApp();
var kLineData = {}
var predictData = []
var realData = []
var catagroy = []
// var sellPoint_50 = [] //50天的卖出点
// var sellPoint_250 = [] //250天的卖出点
// var buyPoint_50 = [] //50天的买入点
// var buyPoint_250 = [] //250天的买入点

var upColor = '#ec0000';
var upBorderColor = '#8A0000';
var downColor = '#00da3c';
var downBorderColor = '#008F28';

// var optionkLine = null; //K线图option
// var optionPre_50 = null; //50天预测图option
// var optionPre_250 = null; //250天折线图

Page({
    data: {
        eckLine: {
            lazyLoad: true
        },
        ecPredict_50: {
            // 将 lazyLoad 设为 true 后，需要手动初始化图表
            lazyLoad: true
        },
        ecPredict_250: {
            lazyLoad: true
        },
        optionkLine: null,
        optionPre_50: null,
        optionPre_250: null,
        currentTab: 0,
        currentPreTab: 0,
        stockcode: null,
        isSelected: false,
        saveButton: "+ 自选",
        sdate: null, //上市日期
        edate: null, //退市日期
        open: null, //开盘价
        lastClose: null, //上一交易日收盘价
        price: null, //当前股价
        change: null, //涨跌额
        changeExtent: null, //涨跌幅
        max: null, //最高价
        min: null, //最低价
        volume: null, //成交量
        turnover: null, //成交额
        predictPrice: null //预测股价

    },

    onLoad: function (options) {

        wx.showLoading({
            title: 'Loading',
        })
        var that = this
        if (options.isSelected == 1) {
            this.setData({
                saveButton: "取消自选",
                isSelected: true,
            })
        } else {
            this.setData({
                saveButton: "+自选",
                isSelected: false,
            })
        }
        console.log(that.data.isSelected)
        this.setData({
            stockcode: options.stockcode,
        })
        //加载股票信息数据
        //获取股票信息
        const promise = new Promise(
            function (resolve, reject) {
                console.log("开始获取股票信息")
                wx.request({
                    url: "https://106.54.95.249/StockInfo/StockCode/" + that.data.stockcode,
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function (res) {
                        resolve(res.data)
                        var temp = res.data[0]
                        that.setData({
                            sdate: parseInt((temp[9].slice(0, 4) + temp[9].slice(5, 7) + temp[9].slice(8, 10)))
                        })

                        //console.log("begin" + that.data.sdate)
                        if (temp[8] == 'L') {
                            var now = new Date();
                            var year = String(now.getFullYear())
                            var month, day
                            if (now.getMonth() < 10) {
                                month = "0" + String(now.getMonth() + 1)
                            } else {
                                month = String(now.getMonth())
                            }
                            if (now.getDate() < 10) {
                                day = "0" + now.getDate()
                            } else {
                                day = String(now.getDate())
                            }

                            that.setData({
                                edate: parseInt(year + month + day)
                            })
                        } else {
                            that.setData({
                                edate: parseInt(temp[10].slice(0, 4) + temp[10].slice(5, 7) + temp[10].slice(8, 10))
                            })
                        }
                        //console.log("end" + that.data.edate)
                        console.log(res.data[0][1] + "(" + that.data.stockcode.slice(2, 8) + "." + that.data.stockcode.slice(0, 2) + ")")

                        wx.setNavigationBarTitle({
                            title: res.data[0][1] + "(" + that.data.stockcode.slice(2, 8) + "." + that.data.stockcode.slice(0, 2) + ")",
                        });
                        // wx.setNavigationBarColor({
                        //   backgroundColor: '#333333',
                        //   frontColor: 'white',
                        // })

                        that.setOptionkLine()

                        //获取预测数据
                        that.getNextPredictData()
                        //配置股票信息
                        that.confirm();

                        //获取预测图数据和设置option
                        that.getPreData()

                    },
                    fail: function (err) {
                        console.log(err)
                        reject(err)
                    }
                })
            }
        );
        promise.then(function (res) {
            console.log('加载K线图success');
            setTimeout(() => {
                wx.hideLoading();
            }, 100);
            //wx.hideLoading()
        }).catch(function (error) {
            console.log('fail');
        });

        setTimeout(() => {
            wx.hideLoading();
        }, 100);


    },

    onUnload: function () {
        console.log("释放内存")
        this.setData({
            kLineData: null,
            predictData: null,
            realData: null,
            catagroy: null,
            ecPredict_250: null,
            eckLine: null,
            ecPredict_50: null,
        })
        console.log(realData)
    },

    getNextPredictData: function () {
        var that = this
        wx.request({
            url: 'https://106.54.95.249/Chart/Prediction/one/' + that.data.stockcode,
            header: {
                'content-type': 'text/json' // 默认值l
            },
            success: function (res) {
                console.log("预测值" + res.data)
                that.setData({
                    predictPrice: Number(res.data)
                    // predictPrice: Number(res.data)
                })
                console.log("预测值2" + that.data.predictPrice)
            }
        })
    },

    getPreData: function () {
        var that = this
        const promise = new Promise(
            function (resolve, reject) {
                console.log("开始获取股票预测信息")
                wx.request({
                    url: "https://106.54.95.249/Chart/Prediction/" + that.data.stockcode,
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function (res) {
                        console.log("预测数据：" + res.data)
                        var temp=that.processRowPredictData(res.data)
                        resolve(temp)
                    },
                    fail: function (err) {
                        console.log(err)
                        reject(err)
                    }
                })
            }
        );
        promise.then(function (res) {
            console.log('获取预测数据成功');
            //that.setoptionPre_250()
        }).catch(function (error) {
            console.log(error)
            console.log('fail');
        });

        const promise1 = new Promise(
            function (resolve, reject) {
                console.log("开始获取股票预测信息")
                wx.request({
                    url: 'https://106.54.95.249/Chart/Actuality/' + that.data.stockcode,
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: function (res) {
                        console.log("真实数据：" + res.data)
                        var temp=that.processRowRealData(res.data)
                        resolve(temp)
                    },
                    fail: function (err) {
                        console.log(err)
                        reject(err)
                    }
                })
            }
        );
        promise1.then(function (res) {
            console.log('获取真实数据成功');
            that.setoptionPre_50()
            that.setoptionPre_250()
        }).catch(function (error) {
            console.log(error)
            console.log('fail');
        });

    },

    processRowPredictData: function (rowData) {
        console.log("predictData:"+rowData.length)
        for (var i = 50; i < rowData.length; i++) {
            var temp = rowData[i]
            catagroy.push(i-50)
            predictData.push(temp[1])
        }
        return {
            catagroy,
            predictData
        }
    },

    processRowRealData: function (rowData) {
         console.log("realData:"+rowData.length)
        //处理数据
        for (var i = rowData.length -1; i >= 50; i--) {
            var temp = rowData[i]
            realData.push(temp[1])
        }
        return realData

        // //选取买入卖出点
        // for (var i = rowData.length - 6; i >= 5; i--) {
        //     var temp = rowData[i][1]
        //     if (temp > rowData[i - 1][1] && temp > rowData[i - 2][1] && temp > rowData[i - 3][1] && temp > rowData[i - 4][1] && temp > rowData[i - 5][1] && temp > rowData[i + 1][1] && temp > rowData[i + 2][1] && temp > rowData[i + 3][1] && temp > rowData[i + 4][1] && temp > rowData[i + 5][1]) {
        //         if (i > 200) {
        //             sellPoint_50.push(rowData[i])
        //         }
        //         sellPoint_250.push(rowData[i])
        //     }

        //     if (temp < rowData[i - 1][1] && temp < rowData[i - 2][1] && temp < rowData[i - 3][1] && temp < rowData[i - 4][1] && temp < rowData[i - 5][1] && temp < rowData[i + 1][1] && temp < rowData[i + 2][1] && temp < rowData[i + 3][1] && temp < rowData[i + 4][1] && temp < rowData[i + 5][1]) {
        //         if (i > 200) {
        //             buyPoint_50.push(rowData[i])
        //         }
        //         buyPoint_250.push(rowData[i])
        //     }
        // }

        //console.log(realData)
    },


    confirm: function () {
        var that = this
        wx.request({
            url: 'http://hq.sinajs.cn/list=' + that.data.stockcode,
            header: {
                'content-type': 'text/json' // 默认值l
            },
            success(res) {
                var temp = res.data.split("\"");
                var result = temp[1].split(",");
                var per = (result[3] - result[2]) / result[3] * 100
                that.setData({
                    max: result[4],
                    min: result[5],
                    volume: Number(result[8] / 1000000).toFixed(2),
                    turnover: Number(result[9] / 10000).toFixed(2),
                    open: result[1],
                    price: result[3],
                    lastClose: result[2],
                    change: (result[3] - result[2]).toFixed(2),
                    changeExtent: String(per.toFixed()) + "%"
                })
                //console.log(res.data)
                result: res.data
            },
            fail(res) {
                console.log(res)
            }
        })
    },

    setOptionkLine: function () {
        var that = this
        const promise = new Promise(
            function (resolve, reject) {
                wx.request({
                    url: "https://106.54.95.249/Chart/Actuality/K/Day?",
                    header: {
                        "Content-Type": "application/json"
                    },
                    data: {
                        StockCode: that.data.stockcode,
                        SDate: "20180712",
                        EDate: that.data.edate
                    },
                    success: function (res) {
                        kLineData = that.processRowKLineData(res.data)
                        resolve(kLineData)
                    },
                    fail: function (err) {
                        console.log(err)
                        reject(err)
                    }
                })
            }
        );
        promise.then(function (res) {
            var option = {
                backgroundColor: '', //背景颜色透明
                title: {
                    left: 0
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                legend: {
                    data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30'],
                    textStyle: {
                        color: '#ffffff' //设置字体颜色
                    },
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '15%'
                },
                xAxis: {
                    axisLabel: {
                        textStyle: {
                            color: '#ffffff'
                        }
                    },
                    type: 'category',
                    data: kLineData.categoryData,
                    scale: true,
                    boundaryGap: true,
                    axisLine: {
                        onZero: false
                    },
                    splitLine: {
                        show: false
                    },
                    splitNumber: 20,
                    min: 'dataMin',
                    max: 'dataMax'
                },
                yAxis: {
                    axisLabel: {
                        textStyle: {
                            color: '#ffffff'
                        }
                    },
                    scale: true,
                    // splitArea: {
                    //     show: true
                    // }
                },
                dataZoom: [{
                        type: 'inside',
                        start: 50,
                        end: 100
                    },
                    {
                        show: true,
                        type: 'slider',
                        top: '90%',
                        start: 50,
                        end: 100
                    }
                ],
                series: [{
                        name: '日K',
                        type: 'candlestick',
                        data: kLineData.values,
                        itemStyle: {
                            color: upColor,
                            color0: downColor,
                            borderColor: upBorderColor,
                            borderColor0: downBorderColor
                        },
                    },
                    {
                        name: 'MA5',
                        type: 'line',
                        data: that.calculateMA(5),
                        smooth: true,
                        lineStyle: {
                            opacity: 1
                        }
                    },
                    {
                        name: 'MA10',
                        type: 'line',
                        data: that.calculateMA(10),
                        smooth: true,
                        lineStyle: {
                            opacity: 1
                        }
                    },
                    {
                        name: 'MA20',
                        type: 'line',
                        data: that.calculateMA(20),
                        smooth: true,
                        lineStyle: {
                            opacity: 1
                        }
                    },
                    {
                        name: 'MA30',
                        type: 'line',
                        data: that.calculateMA(30),
                        smooth: true,
                        lineStyle: {
                            opacity: 1
                        }
                    },

                ]
            };
            //optionkLine: option
            that.setData({
            optionkLine:option
            })
            that.currentTabChange1()
        }).catch(function (error) {
            console.log('fail');
        });
    },

    setoptionPre_50: function () {
        // console.log("设置option时:"+catagroy.slice(0, 50))
        // console.log("设置option时:"+realData.slice(0, 50))

        var catagroyTemp = catagroy.slice(150, 200)
        var realDataTemp = realData.slice(150, 200)
        var predictDataTemp = predictData.slice(150, 200)
        var option_50 = {
            title: {
                text: '折线图堆叠'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['真实', '预测'],
                textStyle: {
                    color: '#ffffff' //设置字体颜色
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                scale: true,
                data: catagroyTemp,
                axisLabel: {
                    textStyle: {
                        color: '#ffffff'
                    }
                },

            },
            yAxis: {
                type: 'value',
                //boundaryGap : true,
                scale: true,
                axisLabel: {
                    textStyle: {
                        color: '#ffffff'
                    }
                },
            },
            series: [{
                    name: '真实',
                    type: 'line',
                    //stack: '总量',
                    data: realDataTemp,

                },
                {
                    name: '预测',
                    type: 'line',
                    color: '#3333FF',
                    //stack: '总量',
                    data: predictDataTemp,
                    markPoint: {
                        data: [{
                                type: 'max',
                                name: '最大值',
                                symbol: 'circle',
                                symbolSize: 30
                            },
                            {
                                type: 'min',
                                name: '最小值',
                                symbol: 'rect',
                                symbolSize: 30
                            }, //标记的图形
                        ]
                    }
                },
            ]
        };
        //optionPre_50 = option_50
        this.setData({
            optionPre_50: option_50
        })
    },

    setoptionPre_250: function () {
        var option_250 = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['真实', '预测'],
                textStyle: {
                    color: '#ffffff' //设置字体颜色
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                //boundaryGap: true,
                data: catagroy,
                axisLabel: {
                    textStyle: {
                        color: '#ffffff'
                    }
                },

            },
            yAxis: {
                type: 'value',
                scale: true,
                axisLabel: {
                    textStyle: {
                        color: '#ffffff'
                    }
                },
            },
            series: [{
                    name: '真实',
                    type: 'line',
                    data: realData,
                },
                {
                    name: '预测',
                    type: 'line',
                    color: '#3333FF',
                    data: predictData,
                    markPoint: {
                        data: [{
                                type: 'max',
                                name: '最大值',
                                symbol: 'circle',
                                symbolSize: 30
                            },
                            {
                                type: 'min',
                                name: '最小值',
                                symbol: 'rect',
                                symbolSize: 30
                            }, //标记的图形
                        ]
                    }
                },
            ]
        };
        // optionPre_250 = option_250
        this.setData({
            optionPre_250: option_250
        })
    },

    processRowKLineData: function (rowData) {
        //console.log('处理前' + rowData.length)
        var values = []
        var categoryData = []
        for (var i = 0; i < rowData.length; i++) {
            var temp = rowData[i]
            temp[0] = String(temp[0]).replace('-', '/')
            categoryData.push(temp.splice(0, 1)[0]);
            values.push(temp)

        }
        kLineData = {
            categoryData,
            values
        }
        return {
            categoryData: categoryData,
            values: values
        };
    },


    //计算5日、10日、20日、30日曲线
    calculateMA: function (dayCount) {
        var result = [];
        //console.log("begin calculate:"+data0)
        for (var i = 0, len = kLineData.length; i < len; i++) {
            if (i < dayCount) {
                result.push('-');
                continue;
            }
            var sum = 0;
            for (var j = 0; j < dayCount; j++) {
                sum += kLineData[i - j][1];
            }
            result.push((sum / dayCount).toFixed(2));
        }
        return result;
    },

    //初始化预测图
    initBarPre_50: function () {

        var that = this
        this.ecComponentPre_50.init((canvas, width, height) => {
            // 初始化图表
            const chart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            chart.setOption(that.data.optionPre_50, true);
            wx.hideLoading();
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return chart;
        });
    },

    initBarPre_250: function () {
        var that = this
        this.ecComponentPre_250.init((canvas, width, height) => {
            // 初始化图表
            const chart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            chart.setOption(that.data.optionPre_250, true);

            wx.hideLoading();
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return chart;
        });
    },

    //初始化K线图
    initBarkLine: function () {
        var that = this
        this.ecComponent_kLine.init((canvas, width, height) => {
            // 初始化图表
            const chart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            chart.setOption(that.data.optionkLine, true);
            // 注意这里一定要返回 chart 实例，否则会影响事件处理等
            return chart;
        });
    },

    //切换到K线图
    currentTabChange1: function () {
        console.log("切换到K线图")
        this.setData({
            currentTab: 0
        })
        this.ecComponent_kLine = this.selectComponent('#mychart-dom-bar');
        this.initBarkLine();

    },

    //切换到预测图
    currentTabChange2: function () {
        console.log("切换到预测图")
        this.setData({
            currentTab: 1
        })
        this.currentPreTabChange1()
    },

    //切换到词云图
    currentTabChange3: function () {
        console.log("切换词云图")
        this.setData({
            currentTab: 2
        })
    },

    currentPreTabChange1: function () {
        console.log(this.data.currentPreTab)
        console.log("切换到50天")
        this.setData({
            currentPreTab: 0
        })
        this.ecComponentPre_50 = this.selectComponent('#mychart-dom-line_50');
        this.initBarPre_50();
    },

    currentPreTabChange2: function () {
        console.log(this.data.currentPreTab)
        console.log("切换到250天")
        this.setData({
            currentPreTab: 1
        })
        this.ecComponentPre_250 = this.selectComponent('#mychart-dom-line_250');
        this.initBarPre_250();
    },

    collect: function () {
        var that = this
        console.log(app.globalData.token)
        if (!that.data.isSelected) {
            wx.request({
                url: 'https://106.54.95.249/Stock/' + that.data.stockcode,
                method: "POST",
                header: {
                    'token': app.globalData.token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    that.setData({
                        saveButton: "取消自选"
                    })
                }
            })
        } else {
            wx.request({
                url: 'https://106.54.95.249/delStock/' + that.data.stockcode,
                method: "POST",
                header: {
                    'token': app.globalData.token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                    that.setData({
                        saveButton: "+自选"
                    })
                }
            })

        }
    }
})