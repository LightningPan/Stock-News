/*
 * author:Tan Pan
 * create time:2020-07-07
 * update time:2020-07-12
 * */
package com.server.main.Controller;

import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("StockDetail")
public class StockDetailController {
    @PersistenceContext
    private EntityManager em;
    @ResponseBody
    @RequestMapping(value = "Day",method= RequestMethod.GET)
    public List<Object[]> searchByDate(@RequestParam("Date") String date,
                                       @RequestParam("StockCode") String StockCode){
        try{
        String sql="select * from "+StockCode+" where time='"+date+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;}
        catch (Exception e){
            List<Object[]> result=new ArrayList<Object[]>() ;
            Object[] failResult=new Object[1];
            failResult[0]="Fail";
            result.add(failResult);
            return result;
        }
    }
    @ResponseBody
    @RequestMapping(value = "Month",method = RequestMethod.GET)
    public List<Object[]> searchByMonth(@RequestParam("Date") String date,
                                       @RequestParam("StockCode") String StockCode,
                                        @RequestParam(value = "Order" ,defaultValue = "desc")String order){
        try{
        String sql="select * from "+StockCode+" where DATE_FORMAT(time,'%Y%m')='"+date+"' order by time "+order;
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
        }
        catch(Exception e){
            List<Object[]> result=new ArrayList<Object[]>() ;
            Object[] failResult=new Object[1];
            failResult[0]="Fail";
            result.add(failResult);
            return result;
        }
    }
    @ResponseBody
    @RequestMapping(value="Range",method = RequestMethod.GET)
    public List<Object[]> searchRange(@RequestParam("Date") String date,
                                      @RequestParam("StockCode") String StockCode,
                                      @RequestParam(value = "Range" ,defaultValue = "10") Integer range,
                                      @RequestParam(value="Order",defaultValue = "desc") String order){
        try{
        String sql="select * from "+StockCode+" where time>='"+date+"' order by time "+order+" limit "+range;
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
        }
        catch (Exception e){
            List<Object[]> result=new ArrayList<Object[]>() ;
            Object[] failResult=new Object[1];
            failResult[0]="Fail";
            result.add(failResult);
            return result;
        }
    }
}
