/*
 * author:Tan Pan
 * create time:2020-07-07
 * update time:2020-07-10
 * */
package com.server.main;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

@Entity
public class UserStock implements Serializable {

    @Id
    @Column(length = 100)
    private String Id;
    @Column(length = 100)
    private String openid;
    @Column(length = 100)
    private String stock;

    public UserStock() {
    }

    public String getOpenid() {
        return openid;
    }

    public void setOpenid(String openid) {
        this.openid = openid;
    }

    public String getStock() {
        return stock;
    }

    public void setStock(String stock) {
        this.stock = stock;
    }
    public String getId() {
        return Id;
    }

    public void setId(String id) {
        Id = id;
    }
}
