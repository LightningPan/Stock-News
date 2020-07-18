/*
* author:Tan Pan
* create time:2020-07-07
* update time:2020-07-17
**/
package com.server.main.Controller;
import org.springframework.web.bind.annotation.*;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

@RestController
@RequestMapping("StockInfo")
public class CompanyController {

    @PersistenceContext
    private EntityManager em;

    @ResponseBody
    @RequestMapping(value = "StockCode/{StockCode}",method=RequestMethod.GET)
    public List<Object[]> searchByCode(@PathVariable("StockCode") String stockCode){
        String sql="select * from stockinfos where ts_Code='"+stockCode+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }
    @ResponseBody
    @RequestMapping(value="StockName/{Name}",method=RequestMethod.GET)
    public List<Object[]> searchByName(@PathVariable("Name") String name){
        String sql="select * from stockinfos where shortName like '%"+name+"%' "+"OR fullname like '%"+name+"%' "+"OR enname like '%"+name+"%'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }
    @ResponseBody
    @RequestMapping(value = "Industry/{name}",method=RequestMethod.GET)
    public List<Object[]> searchByIndustry(@PathVariable("name") String name){
        String sql="select ts_Code,shortName from stockinfos where industry='"+name+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }

    @ResponseBody
    @RequestMapping(value = "FuzzySearch",method = RequestMethod.GET)
    public List<Object[]> fuzzySearch(@RequestParam(value = "currtype",defaultValue ="CNY" ) String currtype,
                                      @RequestParam(value = "area",defaultValue ="深圳" )String area,
                                      @RequestParam(value = "market",defaultValue = "主板")String market,
                                      @RequestParam(value = "ishs",defaultValue = "S")String ishs){
        String sql="select * from stockinfos where curr_type='"+currtype+"' OR"
                                                    +" area='"+area+"' OR"
                                                    +" market='"+market+"' OR"
                                                    +" is_hs='"+ishs+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }
    @ResponseBody
    @RequestMapping(value = "ListDate/{date}",method=RequestMethod.GET)
    public List<Object[]> searchByListDate(@PathVariable(value = "date")String date){
        String sql="select ts_Code,shortName from stockinfos where list_date='"+date+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }
    @ResponseBody
    @RequestMapping(value = "DeListDate/{date}",method=RequestMethod.GET)
    public List<Object[]> searchByDeListDate(@PathVariable(value = "date")String date){
        String sql="select ts_Code,shortName from stockinfos where delist_date='"+date+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<Object[]> resultList=nativeQuery.getResultList();
        return resultList;
    }
    @ResponseBody
    @RequestMapping(value = "Recommend/{Range}",method = RequestMethod.GET)
    public List<String> getRecommendation(@PathVariable(value = "Range")String range){
        String sql="select StockCode from Recommend order by recommend desc limit "+range;
        Query nativeQuery=em.createNativeQuery(sql);
        List<String> resultList=nativeQuery.getResultList();
        return resultList;
    }



}
