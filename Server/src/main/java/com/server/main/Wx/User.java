/*
 * author:Tan Pan
 * create time:2020-07-09
 * update time:2020-07-10
 * */
package com.server.main.Wx;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class User {
    @Id
    @Column(length = 100)
    private String openid;
    @Column(length = 100)
    private String session_key;
    @Column(length = 100)
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
