/*
 * author:Tan Pan
 * create time:2020-07-09
 * update time:2020-07-10
 * */
package com.server.main.Wx;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.server.main.Repository.UserRepository;
import net.bytebuddy.utility.RandomString;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("Login")
public class Login {

    private EntityManager em;
    @Autowired
    private UserRepository userRepository;

    public Map<String,String> getWxUserOpenid(String code,String APPID,String APPSecret){
        String url="https://api.weixin.qq.com/sns/jscode2session?appid="+APPID+"&secret="+APPSecret+"&js_code="+code+"&grant_type=authorization_code";
        Map<String,String> map=new HashMap<String,String>();
        try{
            HttpClient client= HttpClientBuilder.create().build();
            HttpGet get=new HttpGet(url);
            HttpResponse response=client.execute(get);
            HttpEntity result=response.getEntity();
            String content= EntityUtils.toString(result);
            map= JSON.parseObject(content,new TypeReference<HashMap<String,String>>(){});
        }
        catch (Exception e){

        }
        return map;
    }

    @RequestMapping(method = RequestMethod.POST)
    public String wxLogin(@RequestParam(value = "code") String code){
        System.out.println(code);
        if(code==null){
            return "fail";
        }
        try{
            Map map=getWxUserOpenid(code,"wx6da9db3558e80c44","14a14aef47e5215df9d59c161f799a57");
            if(map.get("openid")==null){
                return "fail";
            }
            User user=new User();
            user.setOpenid((String) map.get("openid"));
            user.setSession_key((String) map.get("session_key"));
            String tmp=RandomString.make(10);
            user.setToken(tmp);
            userRepository.save(user);
            return tmp;
        }
        catch (Exception e){
            return "fail";
        }
    }


}
