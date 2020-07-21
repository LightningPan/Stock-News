/*
 * author:Tan Pan
 * create time:2020-07-09
 * update time:2020-07-10
 **/
package com.server.main.Repository;

import com.server.main.Wx.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User,String> {

    @Query(value = "select openid from User u where u.token=:token", nativeQuery=true)
    String queryOpenId(@Param("token") String token);
}
