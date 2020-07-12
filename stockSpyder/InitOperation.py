# coding: utf8
# author:张圯
# create time:2020-07-08
# update time:2020-07-12

import re
import time
import requests
import traceback
import tushare as ts
import datetime
from bs4 import BeautifulSoup
import os
from DBOperating import DBOperation

#初始化建库
class InitOperation:
    def __init__(self):
        self.pro = ts.pro_api('bffa5f7d4d2eef54aac3718f89cf61fc0b03f992eca7fc1e2979052b')
        self.headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
                                 ' Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.58'}
        self.DB=DBOperation()

    #初始化股票信息表
    def InitStockTableInfo(self):
        try:
            basicStock = self.pro.query('stock_basic', exchange='', list_status='L', fields='ts_code,name,area,'
                                                                                       'industry,fullname,enname,market,curr_type,list_status,list_date,delist_date,is_hs')
            self.DB.InitStockInfosTable(basicStock)
        except Exception as e:
            return e.args

    #获取文章的内容
    def getText(self,link,add,code):
        try:
            returnValue = []

            r = requests.get(url=link, headers=self.headers)
            r.encoding=r.apparent_encoding

            textPattern = re.compile('<!--文字-->([\s\S]*?)<!-- 附件列表 -->')
            text = re.findall(textPattern, r.text)
            if len(text)==0:
                print(' find nothing')
                return
            text = re.findall('<p>([\s\S]*)</p>', text[0])
            if len(text)==0:
                print("didn't find text")
                return None

            tempPattern = re.compile('<p>作者(.*?)/em></p>')
            temp = re.findall(tempPattern, r.text)

            author = re.findall('：(.*?)</p><p>', temp[0])[0]
            # releasetime = re.findall('<em>(.*?)</em>', temp[0])
            sourceANDtime = re.findall('<em>(.*?)<', temp[0])
            if len(sourceANDtime)==0:
                print('nothing')
                return
            releasetime=sourceANDtime[0]
            if len(sourceANDtime)==2:
                source=sourceANDtime[1]
            else:
                source=''

            link = link.replace('/', '').replace('.', '').replace(':', '')
            path = 'news/' + add + code
            if not os.path.exists(path):
                os.makedirs(path)
            path = path + '/' + link + '.txt'

            with open(path, 'w', encoding='utf-8') as f:
                f.write(text[0])

            time.sleep(2)

            returnValue.append(path)
            returnValue.append(releasetime)
            returnValue.append(author)
            returnValue.append(source)
            return returnValue

        except Exception as e:
            print(traceback.format_exc())
            print(e.args)
            return returnValue

    #解析网页
    def parseHtml(self,soup, add,code,newsLinks):
        try:
            soup = BeautifulSoup(soup, 'html.parser')
            content = re.findall('<td style="color: #666666;font-size: 12px;">([\s\S]*?)</td>', str(soup))
            # summary=re.findall('font-size: 12px;line-height: 24px;color: #333333;margin-top: 4px;([\s\S]*?)</td>',str(soup))

            length = len(content)
            print(length)

            for i in range(length):
                try:
                    con = str(content[i])
                    title = re.findall('target="_blank">([\s\S]*?)</a>', con)
                    title[0] = str(title[0]).replace('<font color="#FF0000">', '').replace('</font>', '')

                    link = re.findall('href="([\s\S]*?)"', con)
                    print(link)
                    returnValue = self.getText(link[0], add, code)
                    if returnValue==None or len(returnValue)==0:
                        print("didn't find cs.cn data")
                        continue

                    # time = re.findall('</a>([\s\S]*)', con)
                    # time = time[0].replace('\n', '').replace('\r', '').replace('\xa0', '')

                    # sum=str(summary[i]).replace('\n','').replace('<br/>','').replace('<font color="#FF0000">', '').replace('</font>', '').replace('">','').replace('\xa0','')
                    record = {
                        'title': title[0],
                        'path': returnValue[0],
                        'time': returnValue[1],
                        'author': returnValue[2],
                        'source': returnValue[3]
                        # 'sumary':sum
                    }
                    newsLinks.append(record)
                except Exception as e:
                    print(traceback.format_exc())
                    print(e.args)
                    continue
        except Exception as e:
            print(traceback.format_exc())
            print(e.args)
            return

    #初始化股票新闻表
    def InitStockNewsTable(self):
        try:
            message = []
            stocks = self.pro.query('stock_basic', exchange='', list_status='L', fields='ts_code,name')
            i=0
            for row in stocks.itertuples():
                i=i+1
                if i==10:
                    print("OK?")
                    return
                code = row[1][0:6]
                add = str(row[1][7:]).lower()
                name = row[2]
                print(row[1])
                try:
                    news_s = []
                    url = 'http://search.cs.com.cn/search?searchscope=&timescope=month&timescopecolumn=DOCPUBTIME' \
                          '&orderby=&channelid=215308&andsen=&total=&orsen=&exclude=&searchword='+name+'&perpage=' \
                    '&templet=&token=12.1462412070719.47&timeline='                                                                                   '&timescope=&timescopecolumn=&orderby='
                    r = requests.get(url, headers=self.headers)
                    r.encoding=r.apparent_encoding

                    self.parseHtml(r.text,add,code, news_s)
                    # lengthPattern = re.compile('找到相关结果约(.*?)条')
                    # length = re.findall(lengthPattern, r.text)
                    # length = int(int(length[0]) / 100) + 1
                    # for i in range(2, length + 1):
                    #     url = 'http://search.cs.com.cn/search?page=' + str(
                    #         i) + '&channelid=215308&searchword=' + name + '&keyword=' + name + '' \
                    #                                                                            '&token=12.1462412070719.47&perpage=100&outlinepage=5&&andsen=&total=&orsen=&exclude=&searchscope=' \
                    #                                                                            '&timescope=&timescopecolumn=&orderby=&timeline'
                    #     r = requests.get(url, headers=self.headers)
                    #     self.parseHtml(r.text, add,code,news_s)
                    #     time.sleep(3)

                    write = self.DB
                    write.writeSignelStockNews(news_s=news_s, code=code, add=add)
                except Exception as e:
                    message.append(e.args)
                    continue
        except Exception as e:
            message.append(e.args)
            return message

    #初始化股票交易信息表
    def InitStockDealTable(self):
        try:
            #获取股市的全部股票数据
            stocks = self.pro.query('stock_basic', exchange='', list_status='L', fields='ts_code,name,list_status,list_date,delist_date')
            operation =self.DB
            conn=operation.getCon()
            i=0
            for row in stocks.itertuples():
                # i=i+1
                # if i==10:
                #     print('OK')
                #     break
                ts_code=row[1]
                num=int(row[1][0:6])
                if(num<=600287):
                    print(ts_code+'has done')
                    continue
                start=row[4]
                if str(row[3])=='D':
                    end=row[5]
                else:
                    end=str(datetime.datetime.now().date()).replace('-','')

                stockinfos=self.pro.daily(ts_code=ts_code, start_date=start, end_date=end)

                print(len(stockinfos))
                #将获取的股票交易数据写入数据库中

                self.DB.InitStockDealTable(stockinfos,ts_code)
                print(ts_code)

        except Exception as e:
            print(traceback.format_exc())
            print(e.args)
            return e.args

    def init(self):
        self.InitStockTableInfo()#初始化信息表
        print("OK")
        self.InitStockDealTable()#初始化每只股票的交易信息
        self.InitStockNewsTable()#初始化每只股票的新闻信息

    # def test(self):
    #     stockinfos = self.pro.daily(ts_code='688600.sh', start_date='20200703', end_date='20200709')
    #     print('begin')
    #     print(stockinfos)
    #     stockinfos=stockinfos.reindex(index=stockinfos.index[::-1])
    #     stockinfos.to_csv('test1.csv',sep=',',index=False,header=True)
    #     print(stockinfos)
    #
    #
    #     # print(len(stockinfos))
    #     # 将获取的股票交易数据写入数据库中
    #
    #     # self.DB.InitStockDealTable(stockinfos, ts_code)
    #



Init=InitOperation()
Init.init()
# Init.getText('http://www.cs.com.cn/jg/03/202007/t20200708_6074298.html','sz','000001')
# Init.init()


