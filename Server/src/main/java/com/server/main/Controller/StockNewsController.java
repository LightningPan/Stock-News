/*
 * author:Tan Pan
 * create time:2020-07-07
 * update time:2020-07-15
 **/
package com.server.main.Controller;

import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "StockNews")
public class StockNewsController {
    @PersistenceContext
    private EntityManager em;
    @ResponseBody
    @RequestMapping(value="Range",method = RequestMethod.GET)
    public List<String> searchRange(@RequestParam("Date") String date,
                                      @RequestParam(value = "Location",defaultValue = "sse") String location,
                                      @RequestParam("StockCode") String StockCode,
                                      @RequestParam(value = "Range" ,defaultValue = "10") Integer range,
                                      @RequestParam(value="Order",defaultValue = "desc") String order){
        try{
            String sql="select link from "+location+" where stockCode='"+StockCode.substring(2,8)+"' and link in " +
                    "(select link from newslinks where releasetime>='"+date+"' order by releasetime "+order+") limit "+range;
            Query nativeQuery=em.createNativeQuery(sql);
            List<String> resultList=nativeQuery.getResultList();
            return resultList;
        }
        catch (Exception e){
            List<String> result=new ArrayList<String>() ;
            return result;
        }
    }
    @ResponseBody
    @RequestMapping(value = "FuzzySearch",method = RequestMethod.GET)
    public List<String> fuzzySearch(@RequestParam(value = "content")String content){
        try{
            String sql="select link from newslinks where title REGEXP '"+content+"'";
            Query nativeQuery=em.createNativeQuery(sql);
            List<String> resultList=nativeQuery.getResultList();
            return resultList;
        }
        catch (Exception e){
            List<String> result=new ArrayList<String>() ;
            result.add("fail");
            return result;
        }

    }

}
