import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import tushare as ts   #我们是使用 tushare 来下载股票数据
ts.set_token('a758f138044bab1c6d64751143b9640b7860cec201d5f34957e5e096')   #需要在 tushare 官网申请一个账号，然后得到 token 后才能通过数据接口获取数据
pro = ts.pro_api()

#这里是用 000001 平安银行为例，下载从 2015-1-1 到最近某一天的股价数据
df = pro.daily(ts_code='000001.SZ', start_date='2015-01-01', end_date='2020-02-25')


df.head()   #用 df.head() 可以查看一下下载下来的股票价格数据，显示数据如下：
df = df.iloc[::-1]
print(df)
df.reset_index(inplace=True)

#只用数据里面的收盘价字段的数据，也可以测试用更多价格字段作为预测输入数据
training_set = df.loc[:, ['close']]

#只取价格数据，不要表头等内容
training_set = training_set.values

#对数据做规则化处理，都按比例转成 0 到 1 之间的数据，这是为了避免真实数据过大或过小影响模型判断
from sklearn.preprocessing import MinMaxScaler
sc = MinMaxScaler(feature_range = (0, 1))
training_set_scaled = sc.fit_transform(training_set)

#准备 X 和 y 数据，就类似前面解释的，先用最近一个交易日的收盘价作为第一个 y，然后这个交易日以前的 60 个交易日的收盘价作为 X。
#这样依次往前推，例如最近第二个收盘价是第二个 y，而最新第二个收盘价以前的 60 个交易日收盘价作为第二个 X，依次往前准备出大量的 X 和 y，用于后面的训练。
X_train = []
y_train = []
for i in range(60, len(training_set_scaled)):
    X_train.append(training_set_scaled[i-60:i])
    y_train.append(training_set_scaled[i, training_set_scaled.shape[1] - 1])
X_train, y_train = np.array(X_train), np.array(y_train)

# 这里是使用 Keras，Keras 大大简化了模型创建工作，背后的真正算法实现是用 TensorFlow 或其他。

from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from keras.layers import Dropout
import tensorflow
regressor = Sequential()

regressor.add(LSTM(units=50, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])))
regressor.add(Dropout(0.2))

regressor.add(LSTM(units=50, return_sequences=True))
regressor.add(Dropout(0.2))

regressor.add(LSTM(units=50, return_sequences=True))
regressor.add(Dropout(0.2))

regressor.add(LSTM(units=50))
regressor.add(Dropout(0.2))

regressor.add(Dense(units=1))

regressor.compile(optimizer='adam', loss='mean_squared_error')

regressor.fit(X_train, y_train, epochs=100, batch_size=32)


