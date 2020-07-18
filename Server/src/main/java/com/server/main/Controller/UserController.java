/*
 * author:Tan Pan
 * create time:2020-07-09
 * update time:2020-07-16
 **/
package com.server.main.Controller;

import com.server.main.Repository.UserRepository;
import com.server.main.Repository.UserStockRepository;
import com.server.main.Wx.UserStock;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
public class UserController {
    UserStockRepository userStockRepository;
    UserRepository userRepository;
    @ResponseBody
    @RequestMapping(value = "UserStock",method = RequestMethod.GET)
    public List<String> getUserStock(@RequestHeader(value = "token")String token){
        String openid=userRepository.queryOpenId(token);
        return userStockRepository.queryAllByOpenid(openid);
    }

    @ResponseBody
    @RequestMapping(value = "Stock/{StockCode}",method = RequestMethod.POST)
    public String addUserStock(@RequestHeader(value = "token")String token,
                               @PathVariable(value = "StockCode")String StockCode){
        try{String openid=userRepository.queryOpenId(token);
        UserStock us=new UserStock();
        us.setOpenid(openid);
        us.setStock(StockCode);
        userStockRepository.save(us);
        return "success";}
        catch (Exception e){

            return "fail";
        }

    }





}
