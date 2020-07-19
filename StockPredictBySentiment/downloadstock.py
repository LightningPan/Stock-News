# author:LuYufei
# createtime:2020-07-09
# update: time:2020-07-11
import tushare as ts
import os
def getstockdata():
    stocklist = [str(i) for i in range(600599, 602000)]
    if not os.path.exists('stocks'):
        os.mkdir("stocks")
    for stock in stocklist:
        df = ts.get_hist_data(stock)
        if df is not None:
            print(df.__len__())
            # if  df.__len__() == 607:
            df.to_csv('./stocks/'+stock + '.csv', columns=['open', 'high', 'low', 'close', 'volume'])
