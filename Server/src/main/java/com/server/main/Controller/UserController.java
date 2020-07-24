/*
 * author:Tan Pan
 * create time:2020-07-09
 * update time:2020-07-24
 **/
package com.server.main.Controller;

import com.server.main.Repository.UserRepository;
import com.server.main.Repository.UserStockRepository;
import com.server.main.Wx.UserStock;
import net.bytebuddy.utility.RandomString;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;
@RestController
public class UserController {
    UserStockRepository userStockRepository;
    UserRepository userRepository;

    @PersistenceContext
    private EntityManager em;
    @ResponseBody
    @RequestMapping(value = "UserStock",method = RequestMethod.GET)
    public List<String> getUserStock(@RequestHeader(value = "token")String token){
        String sql="select openid from user where token='"+token+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<String> s=nativeQuery.getResultList();
        String openid=s.get(0);
        sql="select stock from user_stock where openid='"+openid+"'";
        Query a=em.createNativeQuery(sql);
        return a.getResultList();
    }

    @ResponseBody
    @RequestMapping(value = "Stock/{StockCode}",method = RequestMethod.POST)
    @Modifying
    @Transactional
    public String addUserStock(@RequestHeader(value = "token")String token,
                               @PathVariable(value = "StockCode")String StockCode){
        try{

        String sql="select openid from user where token='"+token+"'";
        Query nativeQuery=em.createNativeQuery(sql);
        List<String> s=nativeQuery.getResultList();
        String id=new RandomString(5).nextString();
        sql="insert into user_stock(id,openid,stock) values ('"+id+"','"+s.get(0)+"','"+StockCode+"')";
        Query a=em.createNativeQuery(sql);
        a.executeUpdate();

        return "success";}
        catch (Exception e){

            return "fail";
        }

    }

    @ResponseBody
    @RequestMapping(value = "delStock/{StockCode}",method = RequestMethod.POST)
    @Modifying
    @Transactional
    public String delUserStock(@RequestHeader(value = "token")String token,
                               @PathVariable(value = "StockCode")String StockCode){
        try{

            String sql="select openid from user where token='"+token+"'";
            Query nativeQuery=em.createNativeQuery(sql);
            List<String> s=nativeQuery.getResultList();
            sql="delete from user_stock where stock='"+StockCode+"'";
            Query a=em.createNativeQuery(sql);
            a.executeUpdate();
            return "success";}
        catch (Exception e){

            return "fail";
        }

    }



}
