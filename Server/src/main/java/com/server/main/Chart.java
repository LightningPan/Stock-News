/*
 * author:Tan Pan
 * create time:2020-07-10
 * update time:2020-07-15
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
import org.springframework.http.MediaType;
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
        public List<Object[]> getActuality(@RequestParam(value = "Location")String location,
                                           @RequestParam(value="StockCode")String stockCode,
                                           @RequestParam(value="Date") String time,
                                           @RequestParam(value = "Range")String range){
        String sql="select time,tclose from "+location+stockCode+" where time>='"+time+"' order by time asc"+" limit "+range;
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
        }

    /*@RequestMapping(value = "Prediction/{Location}/{StockCode}",method= RequestMethod.GET)
    public List<Object[]> getPrediction(@PathVariable(value = "Location")String location,
                                        @PathVariable(value="StockCode")String stockCode,
                                        @RequestParam(value="Date") String time,
                                        @RequestParam(value = "Range")String range,
                                        @RequestHeader(value = "token")String token){


        String sql="select time,prediction from "+location+stockCode+" where time>='"+time+"' order by time asc"+" limit "+range;
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }*/
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
            wordCloud.setColorPalette(new LinearGradientColorPalette(Color.RED, Color.BLUE, Color.GREEN, 30, 30));
            wordCloud.setKumoFont(new KumoFont(font));
            wordCloud.setBackgroundColor(new Color(255,255,255));
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


}
