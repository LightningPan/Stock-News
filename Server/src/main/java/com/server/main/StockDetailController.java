package com.server.main;

import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("StockDetail")
public class StockDetailController {
    @PersistenceContext
    private EntityManager em;

    @RequestMapping(value = "Day",method= RequestMethod.GET)
    public List<Object[]> searchByDate(@RequestParam("Date") String date,
                                       @RequestParam("Location") String location,
                                       @RequestParam("StockCode") String StockCode){
        String sql="select * from "+location+StockCode+" where time='"+date+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }

    @RequestMapping(value = "Month",method = RequestMethod.GET)
    public List<Object[]> searchByMonth(@RequestParam("Date") String date,
                                       @RequestParam("Location") String location,
                                       @RequestParam("StockCode") String StockCode){
        String sql="select * from "+location+StockCode+" where DATE_FORMAT(time,'%Y%m')='"+date+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }
}
