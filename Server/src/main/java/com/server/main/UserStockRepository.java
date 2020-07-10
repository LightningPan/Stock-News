package com.server.main;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserStockRepository extends JpaRepository<UserStock,String> {
    @Query(value = "select stock from UserStock  where UserStock.openid=:openid")
    public List<String> queryAllByOpenid(@Param("openid")String openid);
}
