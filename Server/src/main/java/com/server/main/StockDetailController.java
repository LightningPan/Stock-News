package com.server.main;

import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("StockDetail")
public class StockDetailController {
    @PersistenceContext
    private EntityManager em;

    @RequestMapping(value = "Day",method= RequestMethod.GET)
    public List<Object[]> searchByDate(@RequestParam("Date") String date,
                                       @RequestParam(value = "Location",defaultValue = "sh") String location,
                                       @RequestParam("StockCode") String StockCode){
        try{
        String sql="select * from "+location+StockCode+" where time='"+date+"'";
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

    @RequestMapping(value = "Month",method = RequestMethod.GET)
    public List<Object[]> searchByMonth(@RequestParam("Date") String date,
                                       @RequestParam(value = "Location",defaultValue = "sh") String location,
                                       @RequestParam("StockCode") String StockCode,
                                        @RequestParam(value = "Order" ,defaultValue = "desc")String order){
        try{
        String sql="select * from "+location+StockCode+" where DATE_FORMAT(time,'%Y%m')='"+date+"' order by time "+order;
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

    @RequestMapping(value="Range",method = RequestMethod.GET)
    public List<Object[]> searchRange(@RequestParam("Date") String date,
                                      @RequestParam(value = "Location",defaultValue = "sh") String location,
                                      @RequestParam("StockCode") String StockCode,
                                      @RequestParam(value = "Range" ,defaultValue = "10") Integer range,
                                      @RequestParam(value="Order",defaultValue = "desc") String order){
        try{
        String sql="select * from "+location+StockCode+" where time>='"+date+"' order by time "+order+" limit "+range;
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
