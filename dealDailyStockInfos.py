# coding: utf8

# author:张圯
# create time:2020-07-08
# update time:2020-07-12

import datetime
import re
import time
import requests
import tushare as ts
from bs4 import BeautifulSoup
from DBOperating import DBOperation


class dealDailyData:
    def __init__(self):
        self.DB=DBOperation()
        self.headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
                                 ' Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.58'}
        self.pro=ts.pro_api('bffa5f7d4d2eef54aac3718f89cf61fc0b03f992eca7fc1e2979052b')

    # 处理数据库中原有的信息
    def dealStock(self):
        try:
            date = str(datetime.datetime.now().date()).replace('-', '')
            print(date)
            todayinfo = self.pro.daily(trade_date=date)
            self.DB.writeTodayInfo(todayinfo)
        except Exception as e:
            print(e.args)
            return


    # 将新上市的股票加入数据库中
    def dealNewStock(self):
        try:
            basicStock = self.pro.query('stock_basic', exchange='', list_status='L', fields='ts_code,name,area,'
                                                                                       'industry,fullname,enname,market,curr_type,list_status,list_date,delist_date,is_hs')
            operation=self.DB
            conn = operation.getCon()
            cursor = conn.cursor()
            operation.createStockInfoTable()

            for row in basicStock.itertuples():
                try:
                    print(row[1])
                    if row[9] == 'L':
                        delistdate = '2100-01-01'
                    else:
                        delistdate = row[11][0:4] + '-' + row[11][4:6] + '-' + row[11][6:]
                    if len(str(row[6])) >= 50:
                        enname = str(row[6][0:50]).replace("'", '')
                    else:
                        enname = str(row[6]).replace("'", '')
                    list_date = row[10][0:4] + '-' + row[10][4:6] + '-' + row[10][6:]
                    insertSql = 'INSERT IGNORE INTO stockinfos '  r" VALUES('" + row[1] + r"','" + row[2] + r"','" + \
                                row[3] + r"','" + row[4] + r"','" + row[5] + r"','" + enname + r"','" + row[7] + r"','" + \
                                row[8] + r"','" + row[9] + r" ',str_to_date(" + list_date + r",'%Y-%m-%d'),str_to_date(" + delistdate + r",'%Y-%m-%d'),'" + \
                                row[12] + r"');"
                    cursor.execute(insertSql)
                    conn.commit()

                except Exception as e:
                    print(e.args)
                    continue

            conn.commit()
            cursor.close()
            conn.close()

            end = str(datetime.datetime.now().date()).replace('-', '')
            offset = datetime.timedelta(days=-1)
            start = str((datetime.datetime.now() + offset).strftime('%Y-%m-%d')).replace('-', '')
            newstocks = self.pro.new_share(start_date=start, end_date=end)
            self.DB.dealNewStocks(newstocks)

        except Exception as e:
            return e.args

    #解析网页
    def parseHtml(self,soup, newsLinks):
        try:
            soup = BeautifulSoup(soup, 'html.parser')
            soup.find_all()
            content = re.findall('<td style="color: #666666;font-size: 12px;">([\s\S]*?)</td>', str(soup))
            # summary=re.findall('font-size: 12px;line-height: 24px;color: #333333;margin-top: 4px;([\s\S]*?)</td>',str(soup))

            length = len(content)
            for i in range(length):
                try:
                    con = str(content[i])
                    title = re.findall('target="_blank">([\s\S]*?)</a>', con)
                    title[0] = str(title[0]).replace('<font color="#FF0000">', '').replace('</font>', '')

                    link = re.findall('href="([\s\S]*?)"', con)

                    time = re.findall('</a>([\s\S]*)', con)
                    time = time[0].replace('\n', '').replace('\r', '').replace('\xa0', '')

                    # sum=str(summary[i]).replace('\n','').replace('<br/>','').replace('<font color="#FF0000">', '').replace('</font>', '').replace('">','').replace('\xa0','')
                    record = {
                        'title': title[0],
                        'link': link[0],
                        'time': time,
                        # 'sumary':sum
                    }
                    newsLinks.append(record)
                except Exception as e:
                    print(e.args)
                    continue
        except Exception as e:
            print(e.args)
            return

    #获取新闻信息
    def getNews(self):
        try:
            result = self.DB.getShortNameAndTSCode()
            for res in result:
                try:
                    code = res[1][0:6]
                    add = str(res[1][7:]).lower()
                    name = res[0]
                    news_s = []
                    url = 'http://search.cs.com.cn/search?searchscope=&timescope=date&timescopecolumn=DOCPUBTIME' \
                          '&orderby=&channelid=215308&andsen=&total=&orsen=&exclude=&searchword=' + name + '&perpage=' \
                                                                                                           '&templet=&token=12.1462412070719.47&timeline='                                                                                     '&timescope=&timescopecolumn=&orderby=&timeline==2020'
                    r = requests.get(url, headers=self.headers)
                    self.parseHtml(r.text, news_s)
                    if len(news_s)==0:
                        continue
                    self.DB.writeSignelStockNews(news_s=news_s, code=code, add=add)
                except Exception as e:
                    print(e.args)
                    continue
        except Exception as e:
            print(e.args)
            return

    #定时执行的主函数
    def main(self):
        try:
            while True:
                now = datetime.datetime.now()
                if now.hour == 15 and now.minute == 30:  # 每天的15：30更新数据库
                    print("update begin")
                    self.dealNewStock()  # 将新股票的信息加入数据库中

                    self.dealStock()  # 更新现有股票信息
                    print('update end')
                if (now.minute == 0) and now.hour > 7 and now.hour < 24:
                    print('get news begin')
                    self.getNews()
                    print('get news end')

                time.sleep(60)  # 每分钟检测一次
        except Exception as e:
            print(e.args)
            return


#定时执行

deal=dealDailyData()
deal.main()


