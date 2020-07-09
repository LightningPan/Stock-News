package com.server.main;

import org.springframework.beans.factory.annotation.Autowired;
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


    @RequestMapping(value = "StockCode/{Code}",method=RequestMethod.GET)
    public List<Object[]> searchByCode(@PathVariable("Code") String stockCode){
        String sql="select * from stockInfos where stockCode='"+stockCode+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }

    @RequestMapping(value="StockName/{Name}",method=RequestMethod.GET)
    public List<Object[]> searchByName(@PathVariable("Name") String name){
        String sql="select * from stockInfos where shortName='"+name+"' "+"OR fullName='"+name+"' "+"OR EnglishName='"+name+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }

    @RequestMapping(value = "Industry/{name}",method=RequestMethod.GET)
    public List<Object[]> searchByIndustry(@PathVariable("name") String name){
        String sql="select * from stockInfos where industry1='"+name+"' "+"OR industry2='"+name+"' "+"OR industry3='"+name+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }

    @RequestMapping(value="IndustryCode/{code}",method=RequestMethod.GET)
    public List<Object[]> searchByIndustryCode(@PathVariable("code") String code){
        String sql="select * from stockInfos where industry1Code='"+code+"' "+"OR industry2Code='"+code+"' "+"OR industry3Code='"+code+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }



}
