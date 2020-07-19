# author:LuYufei
# createtime:2020-07-09
# update: time:2020-07-11
# coding: utf-8
import os
import numpy as np
import quandl
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import pandas as pd
import datetime
from keras import Sequential
from keras.engine.saving import load_model
from keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler

#import tushare as ts   #我们是使用 tushare 来下载股票数据
#ts.set_token('a758f138044bab1c6d64751143b9640b7860cec201d5f34957e5e096')   #需要在 tushare 官网申请一个账号，然后得到 token 后才能通过数据接口获取数据
#pro = ts.pro_api()


def getstock(year,month,day,quandlstockcode):
#1.加载数据
###################
    quandl.ApiConfig.api_key="Q4CtHY5gs72nXJ7Sz5Px"
    start = datetime.date(year,month,day)
    end = datetime.date.today()
    stockdata = pd.DataFrame(quandl.get(quandlstockcode, start_date=start, end_date=end))
    print(stockdata.shape)
    stockdata.tail()
    stockdata.head()
    print(type(stockdata))
    print(stockdata)
    stockdata.to_csv('test.csv')
    return stockdata


def readdata(dataname):
    csv = 'stocks/'+dataname+'.csv'
    stockdata = pd.read_csv(csv)
    print(stockdata)
    print(type(stockdata))
    return stockdata



#google_stock=readdata('600000.csv')
#2.绘制stock历史收盘价trend图
##########33
def drawtrend(stockdata):
    plt.figure(figsize=(16, 8))
    plt.plot(stockdata['Close'])
    plt.show()
#drawtrend(google_stock)




#3.构造训练集与验证集
############
# 时间点长度
def devide_trainx(stockdata,timeinterval):
    time_stamp = 50
# 划分训练集与验证集
    stockdata = stockdata[['Open', 'High', 'Low', 'Close', 'Amount', 'Sentiment']]  #  'Volume'
    train = stockdata[  timeinterval+time_stamp:]
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(train)
    x_train=[]
    for i in range(len(train),time_stamp,-1):
        x_train.append(scaled_data[i - time_stamp:i])
    x_train = np.array(x_train)
    return x_train

def devide_trainy(stockdata,timeinterval):
    time_stamp = 50
    stockdata = stockdata[['Open', 'High', 'Low', 'Close', 'Amount', 'Sentiment']]  # 'Volume'
    train = stockdata[  timeinterval+time_stamp:]
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(train)
    y_train = []
    for i in range(len(train),time_stamp,-1):
        y_train.append(scaled_data[i-1, 3])
    y_train = np.array(y_train)
    return y_train

def devide_validx(stockdata,timeinterval):
    time_stamp = 50
    stockdata = stockdata[['Open', 'High', 'Low', 'Close', 'Amount', 'Sentiment']]  # 'Volume'
    valid = stockdata[:time_stamp+timeinterval]
# 归一化
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(valid)
    x_valid = []
    for i in range(len(valid),time_stamp,-1):
        x_valid.append(scaled_data[i - time_stamp:i])
    x_valid = np.array(x_valid)
    return x_valid
def devide_validy(stockdata,timeinterval):
    time_stamp = 50
    stockdata = stockdata[['Open', 'High', 'Low', 'Close', 'Amount', 'Sentiment']]  # 'Volume'
    valid = stockdata[:time_stamp+timeinterval]
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(valid)
    y_valid = []
    for i in range(len(valid),time_stamp,-1):
        y_valid.append(scaled_data[i-1, 3])
    y_valid = np.array(y_valid)
    return y_valid

#x_train=devide_trainx(google_stock)
#y_train=devide_trainy(google_stock)
#print(x_train.shape[-1])
#print(x_train.shape[1])





'''
# 训练集
    print(scaled_data.shape)
    print(scaled_data[1, 3])
    for i in range(time_stamp, len(train)):
        x_train.append(scaled_data[i - time_stamp:i])
        y_train.append(scaled_data[i, 3])
    x_train, y_train = np.array(x_train), np.array(y_train)
    print(x_train.shape)
    print(y_train.shape)
# 验证集
    scaled_data = scaler.fit_transform(valid)
    x_valid, y_valid = [], []
    for i in range(time_stamp, len(valid)):
        x_valid.append(scaled_data[i - time_stamp:i])
        y_valid.append(scaled_data[i, 3])
    x_valid, y_valid = np.array(x_valid), np.array(y_valid)
#print(x_train)
#print(x_train.shape)
    print(x_valid)
    print(x_valid.shape)
    train.head()
    return x_valid
'''
#x_valid=devide_validx(google_stock)
#y_valid=devide_validy(google_stock)
#4.创建并训练LSTM模型
def trainmodel(x_train,y_train,dataname):

###############
# 超参数
    epochs = 5
    batch_size = 16
# LSTM 参数: return_sequences=True LSTM输出为一个序列。默认为False，输出一个值。
# input_dim：输入单个样本特征值的维度
# input_length：输入的时间点长度
    model = Sequential()
    model.add(LSTM(units=100, return_sequences=True, input_dim=x_train.shape[-1], input_length=x_train.shape[1]))
    model.add(LSTM(units=50))
    model.add(Dense(1))
    model.compile(loss='mean_squared_error', optimizer='adam')
    model.fit(x_train, y_train, batch_size=batch_size, epochs=epochs, verbose=1)
    modelname=dataname+'.h5'
    model.save(modelname)
    return modelname

#trainmodel(x_train,y_train)
#5.预测stock价格
##############
def predictx_valid(x_valid,y_valid,stockname,modelname):
    scaler = MinMaxScaler(feature_range=(0, 1))
    time_stamp = 50
    valid = stockname[:time_stamp+250]
    model=load_model(modelname)
    closing_price = model.predict(x_valid)
    scaler.fit_transform(pd.DataFrame(valid['Close'].values))
# 反归一化
    closing_price = scaler.inverse_transform(closing_price)
    y_valid = scaler.inverse_transform([y_valid])
# print(y_valid)
# print(closing_price)
    rms = np.sqrt(np.mean(np.power((y_valid - closing_price), 2)))
    print(rms)
    print(closing_price.shape)
    print(y_valid.shape)
    return closing_price,y_valid
#closing_price,y_valid=predictx_valid(x_valid,y_valid)


def matchstock(closing_price,y_valid,stockname,dataname,timeinterval):
#6.拟合stock trend
##############3
    time_stamp = 50
    plt.rcParams['font.sans-serif'] = ['KaiTi']
    plt.figure(figsize=(16, 8))
    dict_data = {
        'Predictions': closing_price.reshape(1,-1)[0],
        'Close': y_valid[0]
    }
    valid = stockname[:timeinterval]
    data_pd = pd.DataFrame(dict_data)

    data=closing_price
    length = len(data)
    ans = []
    for i in range(3, length - 3):
        if data[i] > data[i - 1] and data[i] > data[i - 2] and data[i]>data[i-3] and data[i] > data[i + 1] and data[i] > data[i + 2]and data[i] > data[i + 3]:
            ans.append(i)


    cns = []
    for i in range(3, length - 3):
        if data[i] < data[i - 1] and data[i] < data[i - 2] and data[i] < data[i - 3] and data[i] < data[i + 1] and data[i] < data[i + 2] and data[i] < data[i + 3]:
            cns.append(i)
    print(ans)
    print(y_valid)


    #plt.style.use('fast')
    plt.plot(data_pd[['Close']],label="actual")
    plt.plot(data_pd[['Predictions']],label="predictions")

    plt.xlabel('Date',fontsize=18)
    plt.ylabel('Closing prise',fontsize=18)
    if timeinterval==250:
        plt.xticks(range(len(valid)-1,-1,-25),valid['Date'].loc[::25],rotation=45)
    else:
        plt.xticks(range(len(valid) - 1, -1, -5), valid['Date'].loc[::5], rotation=45)
    plt.title("股票代码:"+dataname+" K线图")
    plt.plot(ans,closing_price[ans],'rv',label="卖出")
    plt.plot(cns,closing_price[cns],'gv',label="买入")
    """
    for i in range(0, len(ans)):
        print(closing_price[ans[i]])
        plt.plot(ans[i],closing_price[ans[i]],'rv',label="卖出")
    for i in range(0, len(cns)):
        print(closing_price[cns[i]])
        plt.plot(cns[i],closing_price[cns[i]],'gv',label="买入")
    """
    plt.legend()
    #plt.legend(['actual', 'predictions','卖  出','买入'])
    # ax = plt.gca()

    # 设置ax区域背景颜色
    #ax.patch.set_facecolor("black")

# 设置ax区域背景颜色透明度
    #ax.patch.set_alpha(0.8)
    plt.savefig('resultimage/'+dataname+'-'+str(timeinterval)+'epochs5'+'.png',transparent=True)
    plt.show()


#matchstock(closing_price,y_valid)


def predictstock(dataname):
    stockname=readdata(dataname)
    timeinterval=250
    x_train = devide_trainx(stockname,timeinterval)
    y_train = devide_trainy(stockname,timeinterval)
    x_valid=devide_validx(stockname,timeinterval)
    y_valid=devide_validy(stockname,timeinterval)
    modelname=trainmodel(x_train,y_train,dataname)
    closing_price,y_valid=predictx_valid(x_valid,y_valid,stockname,modelname)
    matchstock(closing_price,y_valid,stockname,dataname,timeinterval)
    np.savetxt(dataname+'-predictclosingprice.txt',closing_price,fmt='%f',delimiter=',')


if __name__ == '__main__':

    predictstock('600519')