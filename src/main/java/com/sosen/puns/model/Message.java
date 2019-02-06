package com.sosen.puns.model;

public class Message {

    private String date;
    private String userName;
    private String content;

    public Message() {
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "Message{" +
                "date='" + date + '\'' +
                ", userName='" + userName + '\'' +
                ", content='" + content + '\'' +
                '}';
    }
}
