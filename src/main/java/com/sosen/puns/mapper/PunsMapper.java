package com.sosen.puns.mapper;

import com.sosen.puns.model.Message;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PunsMapper {

    void insertMessage(@Param("message") Message message);

}
