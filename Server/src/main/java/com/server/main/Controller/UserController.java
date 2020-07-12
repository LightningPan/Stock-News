/*
 * author:Tan Pan
 * create time:2020-07-09
 * update time:2020-07-10
 * */
package com.server.main.Controller;

import com.server.main.Repository.UserRepository;
import com.server.main.Repository.UserStockRepository;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

public class UserController {
    UserStockRepository userStockRepository;
    UserRepository userRepository;

    @RequestMapping(value = "UserStock",method = RequestMethod.GET)
    public List<String> getUserStock(@RequestHeader(value = "token")String token){
        String openid=userRepository.queryOpenId(token);
        return userStockRepository.queryAllByOpenid(openid);
    }





}
