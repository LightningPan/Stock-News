package com.server.main;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class User {
    @Id
    private String openid;
    private String session_key;
    private String token;

    public User() {
    }

    public String getOpenid() {
        return openid;
    }

    public void setOpenid(String openid) {
        this.openid = openid;
    }

    public String getSession_key() {
        return session_key;
    }

    public void setSession_key(String session_key) {
        this.session_key = session_key;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String thirdSessionKey) {
        this.token = thirdSessionKey;
    }
}
