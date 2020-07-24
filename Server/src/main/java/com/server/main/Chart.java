/*
 * author:Tan Pan
 * create time:2020-07-10
 * update time:2020-07-23
 * */
package com.server.main;

import cn.edu.hfut.dmic.contentextractor.ContentExtractor;
import cn.edu.hfut.dmic.contentextractor.News;
import com.kennycason.kumo.CollisionMode;
import com.kennycason.kumo.WordCloud;
import com.kennycason.kumo.WordFrequency;
import com.kennycason.kumo.bg.CircleBackground;
import com.kennycason.kumo.font.KumoFont;
import com.kennycason.kumo.font.scale.SqrtFontScalar;
import com.kennycason.kumo.nlp.FrequencyAnalyzer;
import com.kennycason.kumo.nlp.tokenizers.ChineseWordTokenizer;
import com.kennycason.kumo.palette.LinearGradientColorPalette;
import net.bytebuddy.utility.RandomString;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.awt.*;
import java.io.*;
import java.util.List;

@RestController
@RequestMapping(value = "Chart")
public class Chart {
    @PersistenceContext
    EntityManager em;

        @ResponseBody
        @RequestMapping(value="Actuality",method= RequestMethod.GET)
        public List<Object[]> getActuality(@RequestParam(value="StockCode")String stockCode,
                                           @RequestParam(value="Date") String time,
                                           @RequestParam(value = "Range")String range){
        String sql="select time,tclose from "+stockCode+" where time>='"+time+"' order by time desc"+" limit "+range;
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
        }
    @ResponseBody
    @RequestMapping(value="Actuality/{StockCode}",method= RequestMethod.GET)
    public List<Object[]> getActuality250(@PathVariable(value="StockCode")String stockCode){
        String sql="select time,tclose from "+stockCode+" order by time desc"+" limit 250";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }




    @ResponseBody
    @RequestMapping(value="Actuality/K/Day",method= RequestMethod.GET)
    public List<Object[]> getActualityKDay(@RequestParam(value="StockCode")String stockCode,
                                       @RequestParam(value="SDate") String time,
                                       @RequestParam(value = "EDate")String etime){
        String sql="select time,topen,tclose,high,low from "+stockCode+" where time>='"+time+"' and time<='"+etime+"' order by time asc";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }

    @ResponseBody
    @RequestMapping(value="Actuality/K/Month",method= RequestMethod.GET)
    public List<Object[]> getActualityKMonth(@RequestParam(value="StockCode")String stockCode,
                                        @RequestParam(value="Date") String time){
        String sql="select DATE_FORMAT(time,'%Y%m'),MAX(high),MIN(low) from "+stockCode+" where DATE_FORMAT(time,'%Y%m')>='"+time+"' group by DATE_FORMAT(time,'%Y%m') order by DATE_FORMAT(time,'%Y%m') asc";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }

    @ResponseBody
    @RequestMapping(value="Actuality/K/Month/open",method= RequestMethod.GET)
    public List<Float> getActualityKMonthOpen(@RequestParam(value="StockCode")String stockCode,
                                             @RequestParam(value="Date") String time){
        String sql="select topen from "+stockCode+" where DATE_FORMAT(time,'%Y%m')>='"+time+"' order by time asc"+" limit 1";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Float> resultList=nativeQuery.getResultList();
        return resultList;
    }

    @ResponseBody
    @RequestMapping(value="Actuality/K/Month/close",method= RequestMethod.GET)
    public List<Float> getActualityKMonthClose(@RequestParam(value="StockCode")String stockCode,
                                                 @RequestParam(value="Date") String time){
        String sql="select tclose from "+stockCode+" where DATE_FORMAT(time,'%Y%m')>='"+time+"' order by time desc"+" limit 1";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Float> resultList=nativeQuery.getResultList();
        return resultList;
    }

    @ResponseBody
    @RequestMapping(value = "Prediction/{StockCode}",method= RequestMethod.GET)
    public List<Object[]> getPrediction(@PathVariable(value="StockCode")String stockCode){

        try{
        String sql="select * from "+stockCode+"predict";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;}
        catch (Exception e){
            String sql="select * from sz300020predict";
            Query nativeQuery=em.createNativeQuery(sql);
            List<Object[]> resultList=nativeQuery.getResultList();
            return resultList;
        }
    }
    @ResponseBody
    @RequestMapping(value = "Prediction/one/{StockCode}",method= RequestMethod.GET)
    public Float getPredictionOne(@PathVariable(value="StockCode")String stockCode){

        try{
            String sql="select predictClose from "+stockCode+"predict order by time desc limit 1";
            Query nativeQuery=em.createNativeQuery(sql);
            List<Float> resultList=nativeQuery.getResultList();
            return resultList.get(0);}
        catch (Exception e){
            return null;
        }
    }

    @ResponseBody
    @GetMapping(value = "WordCloud",produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getWordCloud(@RequestParam (value = "url")String url){
        String filePath=generateWordsCloud(url);
        if(filePath=="fail") return null;
        File file=new File(filePath);
        FileInputStream inputStream=null;
        try{
            inputStream=new FileInputStream(file);
            byte[] bytes=new byte[inputStream.available()];
            inputStream.read(bytes,0,inputStream.available());
            inputStream.close();
            file.delete();
            return bytes;
        }
        catch (Exception e){

        }
        return null;
    }



    public String generateWordsCloud(String url){
        FrequencyAnalyzer frequencyAnalyzer=new FrequencyAnalyzer();
        frequencyAnalyzer.setWordFrequenciesToReturn(50);
        frequencyAnalyzer.setMinWordLength(2);
        frequencyAnalyzer.setWordTokenizer(new ChineseWordTokenizer());
        try {
            String textname=getNewsContent(url);
            if(textname=="fail")return "fail";
            final List<WordFrequency> wordFrequencyList=frequencyAnalyzer.load(textname);
            Dimension dimension = new Dimension(400,400);
            WordCloud wordCloud=new WordCloud(dimension, CollisionMode.PIXEL_PERFECT);
            wordCloud.setPadding(2);
            Font font=new Font("华文宋体",2,20);
            wordCloud.setColorPalette(new LinearGradientColorPalette(Color.RED, Color.YELLOW, Color.WHITE, 30, 30));
            wordCloud.setKumoFont(new KumoFont(font));
            new Color(255,255,255,1);
            wordCloud.setBackgroundColor(new Color(0,0,0,0));
            wordCloud.setBackground(new CircleBackground(255));
            wordCloud.setFontScalar(new SqrtFontScalar(12, 45));
            wordCloud.build(wordFrequencyList);
            RandomString rt=new RandomString(10);
            String fileName=rt.nextString()+".png";
            wordCloud.writeToFile(fileName);
            File file =new File(textname);
            file.delete();
            return fileName;
        } catch (IOException e) {
            return "fail";
        }

    }

    public String getNewsContent(String url){
        try{
            News news = ContentExtractor.getNewsByUrl(url);
            String title=news.getTitle();
            title.replace(".","");
            String content=news.getContent();
            System.out.println(content);
            RandomString rs=new RandomString(5);
            String filename=rs.nextString()+".txt";
            File writename = new File(filename); // 相对路径
            writename.createNewFile(); // 创建新文件
            BufferedWriter out = new BufferedWriter(new FileWriter(writename));
            out.write(content); // \r\n即为换行
            out.flush(); // 把缓存区内容压入文件
            out.close(); // 最后记得关闭文件
            return filename;

        }catch (IOException exception){
            System.out.println("IO Wrong!");
        }catch (Exception exception){
            System.out.println("News Get Wrong!");
        }
        return "fail";
    }

    /*@Modifying
    @Transactional
    @RequestMapping(value = "change")
    public void change(){
        String sql="select ts_code from stockinfos";
        Query nativeQuery=em.createNativeQuery(sql);
        List<String> resultList=nativeQuery.getResultList();
        for (String stockcode:resultList) {
            String sql1="select pchg from "+stockcode+" order by time desc limit 5";
            Query nativeQuery1=em.createNativeQuery(sql1);
            List<Float> a=nativeQuery1.getResultList();
            if(a.size()==0) {
                String sql2="insert into Recommend (StockCode) values ('"+stockcode+"')";
                Query nativeQuery2=em.createNativeQuery(sql2);
                nativeQuery2.executeUpdate();
            }
            else{
                int num=a.size();
                Float avg= Float.valueOf(0);
                for(Float w:a){
                    avg=avg+w;
                }
                avg=avg/num;
                String sql2="insert into Recommend (StockCode,recommend) values ('"+stockcode+"',"+avg+")";
                Query nativeQuery2=em.createNativeQuery(sql2);
                nativeQuery2.executeUpdate();
            }

        }

    }*/

    @ResponseBody
    @RequestMapping(value = "Prediction/{StockCode}",method=RequestMethod.GET,produces=MediaType.IMAGE_PNG_VALUE)
    public byte[] getPrediction(@PathVariable(value = "StockCode")String StockCode,
                                @RequestParam(value = "Range")String range){
        try{
            String filePath="image/"+StockCode+"-"+range+".png";
            File file=new File(filePath);
            FileInputStream inputStream=null;
            inputStream=new FileInputStream(file);
            byte[] bytes=new byte[inputStream.available()];
            inputStream.read(bytes,0,inputStream.available());
            inputStream.close();
            return bytes;
        }
        catch (Exception e){
            try{
            String filePath="image/000001-50.png";
            File file=new File(filePath);
            FileInputStream inputStream=null;
            inputStream=new FileInputStream(file);
            byte[] bytes=new byte[inputStream.available()];
            inputStream.read(bytes,0,inputStream.available());
            inputStream.close();
            return bytes;}
            catch (Exception f){}
        }
        return null;

    }
    @ResponseBody
    @GetMapping(value = "NewsWordCloud",produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getNewsWordCloud(@RequestParam (value = "StockCode")String StockCode){
        String location;
        if(StockCode.contains("h")){
            location="sse";
        }
        else{
            location="szse";
        }

        String sql="select link from "+location+" where stockCode='"+StockCode.substring(2,8)+"' limit 1";
        Query nativeQuery=em.createNativeQuery(sql);
        List<String> rl=nativeQuery.getResultList();
        String filePath=generateWordsCloud(rl.get(0));
        if(filePath=="fail") return null;
        File file=new File(filePath);
        FileInputStream inputStream=null;
        try{
            inputStream=new FileInputStream(file);
            byte[] bytes=new byte[inputStream.available()];
            inputStream.read(bytes,0,inputStream.available());
            inputStream.close();
            file.delete();
            return bytes;
        }
        catch (Exception e){

        }
        return null;
    }

}
