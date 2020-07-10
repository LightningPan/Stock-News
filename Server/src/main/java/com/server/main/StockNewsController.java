package com.server.main;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @RequestMapping(value="Range",method = RequestMethod.GET)
    public List<Object[]> searchRange(@RequestParam("Date") String date,
                                      @RequestParam(value = "Location",defaultValue = "sh") String location,
                                      @RequestParam("StockCode") String StockCode,
                                      @RequestParam(value = "Range" ,defaultValue = "10") Integer range,
                                      @RequestParam(value="Order",defaultValue = "desc") String order){
        try{
            String sql="select * from "+location+StockCode+" where releaseTime>='"+date+"' order by releaseTime "+order+" limit "+range;
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
