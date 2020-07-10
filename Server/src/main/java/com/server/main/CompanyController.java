package com.server.main;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.support.NullValue;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("StockInfo")
public class CompanyController {

    @PersistenceContext
    private EntityManager em;


    @RequestMapping(value = "StockCode/{Location}/{Code}",method=RequestMethod.GET)
    public List<Object[]> searchByCode(@PathVariable("Code") String stockCode,
                                       @PathVariable("Location")String location){
        String sql="select * from stockinfos where stockCode='"+stockCode+"."+location+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }

    @RequestMapping(value="StockName/{Name}",method=RequestMethod.GET)
    public List<Object[]> searchByName(@PathVariable("Name") String name){
        String sql="select * from stockinfos where shortname='"+name+"' "+"OR fullname='"+name+"' "+"OR enname='"+name+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }

    @RequestMapping(value = "Industry/{name}",method=RequestMethod.GET)
    public List<Object[]> searchByIndustry(@PathVariable("name") String name){
        String sql="select * from stockinfos where industry='"+name+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }


    @RequestMapping(value = "FuzzySearch",method = RequestMethod.GET)
    public List<Object[]> fuzzySearch(@RequestParam(value = "currtype",defaultValue ="CNY" ) String currtype,
                                      @RequestParam(value = "area",defaultValue ="深圳" )String area,
                                      @RequestParam(value = "market",defaultValue = "主板")String market,
                                      @RequestParam(value = "ishs",defaultValue = "S")String ishs){
        String sql="select * from stcokinfos where currtype='"+currtype+"' OR"
                                                    +"area='"+area+"' OR"
                                                    +"market='"+market+"' OR"
                                                    +"ishs='"+ishs+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }

    @RequestMapping(value = "ListDate/{date}")
    public List<Object[]> searchByListDate(@PathVariable(value = "date")String date){
        String sql="select * from stockinfos where listdate='"+date+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }

    @RequestMapping(value = "DeListDate/{date}")
    public List<Object[]> searchByDeListDate(@PathVariable(value = "date")String date){
        String sql="select * from stockinfos where delistdate='"+date+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }



}
