package com.server.main;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User,String> {
    @Query(value = "select openid from User where User.token=:token")
    public String queryOpenId(@Param("token")String token);
}
