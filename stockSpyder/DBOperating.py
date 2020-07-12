#coding: utf8

# author:张圯
# create time:2020-07-08
# update time:2020-07-12

import pymysql
import traceback


#数据库相关操作
class DBOperation():

    #获取数据库连接
    def getCon(self):
        try:
            conn = pymysql.connect("localhost", "root", "0002", "stockDB")
            return conn
        except Exception as e:
            print(e.args)
            print(traceback.format_exc())

    #创建存储股票信息的数据库
    def createStockInfoTable(self):
        try:
            create_sql = 'CREATE TABLE IF NOT EXISTS stockinfos (' \
                         'ts_code char(9) primary key,' \
                         'shortName char(16),' \
                         'area char(6),' \
                         'industry char(10),' \
                         'fullname char(50),' \
                         'enname char(50),' \
                         'market char(6),' \
                         'curr_type char(4),' \
                         'list_status char(1),' \
                         'list_date date ,' \
                         'delist_date date ,' \
                         'is_hs char(1));'
            conn = self.getCon()
            cursor = conn.cursor()
            cursor.execute(create_sql)
            conn.commit()
            cursor.close()
            conn.close()
        except Exception as e:
            print(e.args)
            print(traceback.format_exc())
            return

    #创建股票交易表
    def createStockDealTable(self, code, add, conn):
        #交易时间 收盘价 最高价 最低价 开盘价 前收盘价 涨跌额 涨跌幅 换手率 成交量
        try:
            create_table = \
                'CREATE TABLE IF NOT EXISTS ' + add + code + \
                '(time date not null primary key ,' \
                'tclose float,' \
                'high float,' \
                'low float,' \
                'topen float, ' \
                'lclose float,' \
                'chg float, ' \
                'pchg float, ' \
                'volume int)'
            cursor = conn.cursor()
            cursor.execute(create_table)
            conn.commit()
            cursor.close()
        except Exception as e:
            print(traceback.format_exc())
            print(e.args)
            return

    #创建新闻的表
    def createStockNewsTable(self,code,add,conn):
        try:
            create_table = \
                'CREATE TABLE IF NOT EXISTS ' + add + code + 'news' \
                                                             '(path char(90) not null primary key ,' \
                                                             'title char(80),' \
                                                             'source char(20),' \
                                                             'author char(20),' \
                                                             'time date)'
            cursor = conn.cursor()
            cursor.execute(create_table)
            conn.commit()
        except Exception as e:
            print(e.args)

    #写入单只股票的历史交易信息
    def writeSignelStock(self, stockinfos, code, add):
        try:
            conn = self.getCon()
            self.createStockDealTable(code=code, add=add, conn=conn)
            for stockinfo in stockinfos.itertuples():
                try:
                    date = stockinfo[2][0:4] + '-' + stockinfo[2][4:6] + '-' + stockinfo[2][6:]#日期
                    topen = stockinfo[3]  # 当日开盘价
                    high = stockinfo[4]  # 当日最高价
                    low = stockinfo[5]  # 当日最低价
                    tclose = stockinfo[6]  # 当日收盘价
                    lclose = stockinfo[7]  # 前一天收盘价
                    chg = stockinfo[8]  # 涨跌幅
                    pchg = stockinfo[9]  # 涨跌额
                    volum = int(stockinfo[11])  # 成交量

                    insertSql = 'INSERT IGNORE INTO ' + add + code + r" VALUES ( str_to_date('" + date + r"','%Y-%m-%d')," \
                                + str(tclose) + ',' + str(high) + ',' + str(low) + ',' + str(topen) + ',' + str(lclose) + \
                                ',' + str(chg) + ',' + str(pchg) + ',' + str(volum) + ');'

                    cursor = conn.cursor()
                    cursor.execute(insertSql)
                    conn.commit()
                except Exception as e:
                    print(traceback.format_exc())
                    print(e.args)
                    continue

            conn.commit()
            cursor.close()
            conn.close()

        except Exception as e:
            print(traceback.format_exc())
            print(e.args)
            return

    #写入单只股票的新闻
    def writeSignelStockNews(self, news_s, code, add):
        try:
            conn = self.getCon()
            self.createStockNewsTable(code=code, add=add, conn=conn)
            cursor = conn.cursor()
            for news in news_s:
                try:
                    title = news['title']
                    path = news['path']
                    author=news['author']
                    source=news['source']
                    releaseTime = news['time']
                    insertSql = 'INSERT IGNORE INTO ' \
                                + add + code + r"news " \
                                                         r"VALUES('" + path + r"','" + title +r"','"+source+"','"+author+ r"',str_to_date('" + releaseTime + r"','%Y-%m-%d %H:%i'));"
                    cursor.execute(insertSql)
                    print(title)
                except Exception as e:
                    print(traceback.format_exc())
                    print(e.args)
                    continue

            conn.commit()
            cursor.close()
            conn.close()
        except Exception as e:
            print(traceback.format_exc())
            print(e.args)
            return

    #初始化信息总表
    def InitStockInfosTable(self,basicStock):
        self.createStockInfoTable()
        try:
            conn=self.getCon()
            cursor=conn.cursor()
            for row in basicStock.itertuples():
                try:
                    print(row[1])

                    #当股票未退市的时候，将退市日期设定为2100-01-01
                    if row[9] == 'L':
                        delistdate = '2100-01-01'
                    else:
                        delistdate = row[11][0:4] + '-' + row[11][4:6] + '-' + row[11][6:]

                    #将过长的英文名称截取前50个字符
                    if len(str(row[6])) >= 50:
                        enname = str(row[6][0:50]).replace("'", '')
                    else:
                        enname = str(row[6]).replace("'", '')

                    list_date = row[10][0:4] + '-' + row[10][4:6] + '-' + row[10][6:]
                    insertSql = 'INSERT IGNORE INTO stockinfos '  r" VALUES('" + row[1] + r"','" + row[2] + r"','" + \
                                row[3] + r"','" + row[4] + r"','" + row[5] + r"','" + enname + r"','" + row[
                                    7] + r"','" + \
                                row[8] + r"','" + row[
                                    9] + r" ',str_to_date('" + list_date + r"','%Y-%m-%d'),str_to_date('" + delistdate + r"','%Y-%m-%d'),'" + \
                                row[12] + r"');"
                    cursor.execute(insertSql)
                    conn.commit()

                except Exception as e:
                    print(traceback.format_exc())
                    print(e.args)
                    continue
        except:
            print(traceback.format_exc())
            print(e.args)
            return

    #为每一只股票初始化数据表
    def InitStockDealTable(self,stockinfos,ts_code):
        try:
            code = ts_code[0:6]
            add = str(ts_code[7:]).lower()

            self.writeSignelStock(stockinfos=stockinfos, code=code, add=add)
        except Exception as e:
            print(traceback.format_exc())
            print(e.args)
            return

    #将当天的交易信息写入数据库
    def writeTodayInfo(self,todayinfos):
        try:
            conn = self.getCon()
            cursor = conn.cursor()
            for info in todayinfos:
                try:
                    ts_code = info[1]
                    code = ts_code[0:6]
                    add = str(ts_code[7:]).lower()
                    date = info[2][0:4] + '-' + info[2][4:6] + info[2][6:]
                    insert_sql = "INSERT IGNORE " + add + code + "VALUES( str_to_date('" + date + "','%Y-%m-%d')," + \
                                 info[
                                     6] + "," + info[4] \
                                 + "," + info[5] + "," + info[3] + "," + info[7] + "," + info[8] + "," + info[9] + "," + \
                                 info[
                                     11] + ")"
                    cursor.execute(insert_sql)
                    conn.commit()
                except Exception as e:
                    print(traceback.format_exc())
                    print(e.args)
                    continue
            cursor.close()
            conn.commit()
            conn.close()
        except Exception as e:
            print(traceback.format_exc())
            print(e.args)
            return

    #为新上市的公司创建数据表
    def dealNewStocks(self,newStocks):
        try:

            conn = self.getCon()
            for stock in newStocks.itertuples():
                ts_code = stock[1]
                code = ts_code[0:6]
                add = str(ts_code[7:]).lower()
                self.createStockDealTable(code=code, add=add, conn=conn)
            conn.commit()
            conn.close()
        except Exception as e:
            print(traceback.format_exc())
            print(e.args)
            return

    def getShortNameAndTSCode(self):
        try:
            select_sql = 'SELECT shortName,ts_code FROM stockinfos'
            conn = self.getCon()
            cursor = conn.cursor()
            cursor.execute(select_sql)

            return cursor.fetchall()
        except Exception as e:
            print(e.args)
            print(traceback.format_exc())

    def removeTables(self):
        try:
            conn = self.getCon()
            cursor = conn.cursor()

            query_sql = 'show tables'
            cursor.execute(query_sql)

            print(cursor.fetchall())
        except Exception as e:
            print(e.args)
            print(traceback.format_exc())






        


