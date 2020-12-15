# 完美校园打卡机

![Time Helper](https://github.com/System233/time-helper/workflows/Time%20Helper/badge.svg)

MM再也不用担心自己上光荣榜了

## 目录

+ [食用方法](#食用方法)
  + [登录或注册Github](#1登录或注册github)
  + [Fork本仓库到自己的账号下](#2fork本仓库到自己账号)
  + [设置Secret](#3设置secret)
    + [使用密码登录](#使用密码登录)
    + [使用短信登录](#使用短信登录)
    + [令牌(Token)登录](#令牌token登录)
    + [配置微信通知](#配置微信通知)
  + [启用Action](#4启用action)
+ [命令行工具](#命令行工具)
  + [配置向导](#配置向导)
  + [启动打卡](#启动打卡)
+ [Secret配置](#secret配置)

## 食用方法

### 1.登录或注册Github

本程序依赖Github Action运行，因此需要注册Github账号，如果没有请注册一个。

### 2.Fork本仓库到自己账号

你改不了别人的项目，所以需要Fork复制本仓库以调整参数。

### 3.设置Secret

本项目使用Secret存储账号登录配置，支持密码、短信、令牌登录。
>账号密码等敏感信息不能直接写在代码中，很危险，切记！

#### 使用密码登录

```shell
TYPE = password
USERNAME = <用户名/手机号>
PASSWORD = <你的密码>
```

#### 使用短信登录

这个登录方式在服务器上没有意义，因为要输验证码，本地运行配置向导时最终会转换为token登录。

```shell
TYPE=sms
USERNAME = <用户名/手机号>
```

#### 令牌(Token)登录

如果你会抓包并且拿到了token，或者是通过账号密码、短信登录拿到的token，那么你可以选择token登录。

```shell
TYPE = token
TOKEN = <令牌字符串>
```

注意：目前尚不清楚令牌的有效时长，若短时间内频繁失效请换用账号密码登录。
UP：经测试，token绑定机器IP，建议使用密码登录。

#### 配置微信通知

目前程序做了server酱的适配，可以利用server酱给手机发送通知。
配置之前需要注册server酱并获取`SCKEY`，然后将其添加到Secret中
[点击注册](https://sc.ftqq.com/3.version)

```shell
SCKEY = <你的SCKEY>
```

### 4.启用Action

Action默认是关闭的，需要手动启用，启用之后即可定时运行代码。

## 命令行工具

本程序提供两个命令用于使用，分别是启动打卡和配置向导。
运行命令前先克隆仓库到本地，并安装node.js 14.x版本（测试平台）
然后运行`npm install`命令安装项目依赖

### 配置向导

配置向导可以引导你配置关键参数，并输出配置结果

```sh
npm run setup
```

### 启动打卡

运行之后开始打卡

```sh
npm run main
```

## Secret配置

这里包含了所有支持在Secret中配置的字段。
建议设置`SEED`或`DEVICE_ID`字段来固定设备ID。

```ts
{
    /* 登录UA */
    USER_AGENT: string,

    /* 打卡UA */
    USER_AGENT2:string,
    
    /* 登录类型 */
    TYPE:'sms'|'password'|'token',

    /* 登录态令牌（登录类型为token时使用） */
    TOKEN:string,
    
    /* 用户名/手机号 */
    USERNAME:string,
    
    /* 密码（登录类型为password时使用） */
    PASSWORD:string,
    
    /* 打卡项目 */
    APP_ID:string,

    /* 设备型号 */
    MODEL:string,

    /* 设备代号 */
    MODEL_CODE:string,

    /* 系统版本 */
    SYSTEM_VERSION:string,

    /* 系统类型 */
    SYSTEM_TYPE:'android',
    
    /* Server酱SCKEY,注册：http://sc.ftqq.com/3.version */
    SCKEY:string,

    /* 设备ID */
    DEVICE_ID:string,
    
    /* 设备ID随机种子，未设置`DEVICE_ID`时使用 */
    SEED:number,

    /* 代理主机 */
    PROXY_HOST:string,

    /* 代理端口 */
    PROXY_PORT:number,
    
    /* 完美校园版本，默认10525101*/
    APP_VERSION:number

    /* 成功提示信息 */
    TEXT_OK:string
}
```
