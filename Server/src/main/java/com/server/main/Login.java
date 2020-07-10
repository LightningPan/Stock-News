package com.server.main;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import net.bytebuddy.utility.RandomString;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.EntityManager;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("Login")
public class Login {

    private EntityManager em;
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
            //JSONObject json= JSON.parseObject(content);
            map= JSON.parseObject(content,new TypeReference<HashMap<String,String>>(){});
            //map.put("openid",json.getString("openid"));
            //map.put("session_key",json.getString("session_key"));
        }
        catch (Exception e){

        }
        return map;
    }

    @RequestMapping(value = "{code}",method = RequestMethod.POST)
    public String wxLogin(@PathVariable(value = "code") String code){

        try{
            Map map=getWxUserOpenid(code,,);
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
