/*
 * author:Tan Pan
 * create time:2020-07-09
 * update time:2020-07-10
 **/
package com.server.main.Repository;

import com.server.main.Wx.UserStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserStockRepository extends JpaRepository<UserStock,String> {
    @Query(value = "select stock from UserStock  where UserStock.openid=:openid",nativeQuery=true)
    public List<String> queryAllByOpenid(@Param("openid")String openid);
}
