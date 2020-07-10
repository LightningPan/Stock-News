package com.server.main;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class UserStock {
    @Id
    private String openid;
    @Id
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
}
