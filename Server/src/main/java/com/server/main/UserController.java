package com.server.main;


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
