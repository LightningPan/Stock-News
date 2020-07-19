#!/usr/bin/env python3
# coding: utf-8
# File: sentence_parser.py
# author:LuYufei
# createtime:2020-07-09
# update: time:2020-07-11

from DocSentimentAnalysis import *


def test():
    content1 = """
    央视新闻客户端3月9日消息，当地时间3月8日凌晨1时许，中国水电15局位于马里中部距离首都巴马科700公里处的项目工地现场及营地遭遇大约25至30名不明身份武装人员袭击。吊车、皮卡车、发电机等施工设备和物资均被烧毁；中方人员安全无伤亡，但随身手机、电脑等物品全部被抢。该项目组正在封闭工地并开始撤离。中国驻马里大使馆通报各驻马里中资企业定期排查隐患，采取安保措施，制定应急预案，切实加强防范，必要时考虑暂时撤离危险地区。
    """
    content2 = """
    华盛顿时间2018年3月1日，美国总统特朗普宣布，由于进口钢铁和铝产品严重损害了美国内产业，威胁到美国家安全，为重振美国钢铁和铝产业，决定将对所有来源的进口钢铁和铝产品全面征税，税率分别为25%和10%。商务部贸易救济局局长王贺军就此发表谈话。
    王贺军表示，美国进口的钢铁和铝产品大多是民用的中低端产品，并未损害美国国家安全。美国以国家安全为由限制钢铁和铝产品的国际贸易，是对以世贸组织为代表的多边贸易体制的严重破坏，必将对正常的国际贸易秩序造成重大冲击。美方可能出台的措施已经受到欧盟、加拿大、巴西、韩国等国家和地区的反对，美国内多个行业协会也对此表达了不满。
    """
    content3 = """
    最近几天，网上流传着一段高铁吃泡面的视频：一名男子在高铁上吃泡面，被一名女子怒怼。视频中的女子怒吼“整个高铁都知道不能吃泡面”，情绪激动，且言辞激烈。这段视频引起了网友的讨论，有人认为这位女子素质太差，也有人认为高铁上吃泡面，味道确实让人反感。
　　扬子晚报紫牛新闻记者辗转联系上视频中发飙的女子，她称因孩子对泡面过敏，曾跟这名男子沟通过，但对方执意不听，她这才发泄不满。记者无法联系上被怼的吃泡面男子
    """
    content4 = '''
    北京昌平警方5月9日晚通报称，雷洋“因涉嫌嫖娼”被警车带往派出所的途中突发心脏病身亡。
雷洋家属向财新记者证实雷洋去世的消息，但对警方所称死亡原因、死者手机里位置信息被删以及警方在死者身亡两小时后才通知家属、拒绝家属对遗体拍照留存等做法表示质疑。目前北京市昌平区检察院已介入调查。
5月9日21时24分，北京市公安局昌平分局官方微博@平安昌平通报此事，称“5月7日20时许，昌平警方接群众举报称：位于昌平区霍营街道某小区一家足疗店内存在卖淫嫖娼问题。接警后，警方依法迅速开展查处工作。当晚，在该足疗店查获涉嫌卖淫嫖娼人员六名。期间，民警将涉嫌嫖娼的男子雷某（29岁，本市人）带回审查时，该人抗拒执法并企图逃跑，警方依法对该人采取了强制约束措施。在将该人带回公安机关审查过程中，该人突然身体不适，警方立即将其送往医院，后经医院抢救无效死亡”。
北京昌平警方称，昌平公安分局已将此情况通报检察机关，昌平区检察院已介入并开展侦查监督工作。目前，此次抓获的其他五人因涉嫌协助组织卖淫罪被昌平警方依法采取刑事强制措施。警方仍在进一步工作中。
得知这一通报后，雷洋之兄雷鹏向财新记者表示，雷洋家属对通报中的内容不认可，期待检察院的进一步调查结果。
雷鹏告诉财新记者，他于事发当晚得知这一消息。他介绍，在不久前的4月24日，弟弟雷洋喜得一女，尚未满月。雷洋的同学得知消息后，拟写了一份《关于人民大学雷洋同学意外身亡的情况说明》，雷鹏称这份情况说明是同学根据雷洋妻子口述完成的，“内容属实”。
这份情况说明显示，2016年5月7日，由于雷洋夫妇刚得一女，其亲属欲来京探望，航班预计当晚到达时间23点30分到达。当晚21时左右，雷洋从家里出门去首都机场迎接亲属，之后雷洋便失去联系。
根据这份情况说明，据雷洋妻子回忆，从5月7日23时30分至5月8日凌晨1点，她和亲属不间断打给雷洋电话，但手机一直处于无人接听状态。直到5月8日凌晨1点，电话有人接听，接听人自称来自昌平区东小口镇派出所，并告知亲属需要去派出所，亲属于1时30分左右到达派出所。
这份情况说明披露：“派出所告知的大意是：雷洋因涉嫌嫖娼，在警车带往派出所的途中因心脏病突发死亡。根据昌平区中西医结合医院给出信息，雷洋达到医院时间为2016年5月7日晚22点09分，到达时已经死亡。”
该情况说明还显示：5月8日凌晨4时30分左右，雷洋亲属随警察来到医院，见到雷洋手臂和头部都有明显淤血。警察给出的答复为路途中雷洋反抗强烈，跳车头部着地所致。亲属要求对遗体拍照留存被禁止。
针对警方较早时期的说法，雷洋家属及同学在该情况说明中提出四点质疑：其一、雷洋几乎每周都会踢足球，全年无休，其亲属也没有心脏病史，为何会突发心脏病？其二、雷洋手臂和头部的淤血，若为跳车所致，应有明显外伤。可据家属观察其无明显外伤，按照东小口镇派出所所述，执法后已被制服并招供，为何还会尝试并成功做到跳车？其三、医院给出的雷洋死亡时间为22点9分（达到医院时间），可是在之后长达近两个小时的时间，派出所为何不联系亲属，并且亲属一直打电话也无人接听？其四、亲属交涉后发现，雷洋手机中死亡前几日的通话记录，微信朋友圈里面关于孩子和家庭的信息，手机里面的位置记录都被部分删除，这是何人所为？
据这份情况说明披露，雷洋是湖南澧县人，系中国人民大学2005级环境学院的本科及硕士研究生，目前任职于中国循环经济协会。2012年毕业后，雷洋任职于中国循环经济协会，曾参与多个工业园规划，生态文明规划，污染物处理规划和循环经济规划的编制工作，在知名环境保护期刊《环境保护》《环境科学》《环境工程》上面都发表过论文，是中国环境保护事业中不可多得的青年才俊。
北京昌平警方通报中提到的“强制约束措施”，引起律师界人士的关注。接受财新记者采访时，上海市薛荣民律师事务所薛荣民律师介绍，所谓强制约束措施，一般是约束带或警绳，通俗讲就是把人绑了，防止失控；但是一般称保护性约束：“几人把你按住也能叫约束，多用于醉酒、吸毒及精神病人。”
浙江汉鼎律师事务所严华丰律师向财新记者介绍，强制约束措施，其实就是强行抓捕手段。这一警方自创的概念是相对保护性约束而言的，《治安管理处罚法》第十五条第二款规定，醉酒的人在醉酒状态中，对本人有危险或者对他人的人身、财产或者公共安全有威胁的，应当对其采取保护性措施约束至酒醒。“约束性保护”只能针对有危害性的无行为能力人或限制行为能力人，并且两个条件必须同时满足
    '''
    content5 = '提要：26岁产妇在陕西省榆林市第一医院绥德院区待产室生产期间坠楼身亡'
    content6 = '''
    今天是个特别的日子京津城际铁路实施新的列车运行图复兴号动车组在京津城际铁路按时速350公里运行
5时30分数十名专门前来体验的火车迷齐聚北京南站候车大厅来自天津的老徐就是其中一员他昨天晚上从天津赶来为的就是乘坐首班车见证这一激动人心的时刻发车前，他们拿出自己珍藏的复兴号模型与“金凤凰”合影留念
6时02分随着C2581次列车驶出北京南站很多旅客的目光都聚焦在车厢内的显示屏上345、347、348……有人开始读数字在350闪现的瞬间整个车厢沸腾了一位车迷对身旁的小伙伴说“我突然有点想哭，太激动了”
复兴号在京津城际铁路按时速350公里运行，一是列车运行线路满足条件。今年以来，京津城际铁路的技术装备和基础设施得到全面强化，设备运行维护水平持续提升，外部环境整治成效明显。二是列车开行方案更加优化。针对京津城际铁路不同时期客流特点，中国铁路北京局集团有限公司科学合理调整列车开行方案，安排了高峰日、周一、周二至周四、周五、周六、周日等6张运行图，努力实现运力投放与客流需求精准匹配，满足日常、周末、小长假、春暑运等不同时期的旅客出行需求。
6时32分列车稳稳停靠在天津站来自天津机务段的首发车司机曹文普刚刚走出驾驶室马上就被旅客和火车迷包围大家争相和他合影留念并请他在这趟车的车票上签名
来自西南交通大学的耿昊然在微博上写道“今天你跑出了傲人的速度曾经的等待都不再是等待曾经的遥远也不再是遥远”10年前，9岁的耿昊然跟随父母来体验刚开通的京津城际铁路。如今，他已经成为一名电气工程专业的大学生，与高铁一同成长的他希望学成后能为中国高铁事业贡献自己的力量。文字：孙晓远 高李鹏图片：刘家豪编辑：孙晓远
    '''

    handler = Sentimentor()
    doc_sentiment_score = handler.doc_sentiment_score("港湖指数今日涨2000点")
    print(doc_sentiment_score)
test()
