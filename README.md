# VMM-APP 

> 基于 `Vue+Quasar+Cordova` 架构开发的用于车辆维修记录管理和查询的android应用

* Vue：进行页面及组件开发
* Quasar：提供一些常用组件库以及项目开发管理
* Cordova：将应用打包成Android应用

## 安装使用

### 下载依赖

```bash
yarn
```

### 启动应用

```bash
yarn run dev:cordova
```

### 构建应用

```bash
yarn run build:cordova
```

### 修改应用图标

```bash
修改`app-icon.png`与`app-splashscreen.png`两个文件即可
```

### 配置 百度AI 接口

修改`baidu.config.js.template`中的对应内容，并保存为`baidu.config.js`

```bash
APP_ID: "xxx",
API_KEY: "xxx",
SECRET_KEY: "xxx",
```

### 对应用进行数字签名

#### 生成数字签名

```bash
keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000 

参数详解:
-keystore : 指定生成数字签名证书的文件名和路径。
-alias：指定证书的别名。
-keyalg：指定生成证书所需要的算法。
-keysize：指定证书大小。
-validity：指定证书的有效期，单位为天。
```

#### 进行数字签名

修改`signAPK.bat.template`中的对应内容，并保存为`signAPK.bat`

```bash
copy .\dist\cordova\android\apk\release\app-release-unsigned.apk .\dist\cordova\android\apk\release\app-release-signed.apk

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ${xxx.keystore} ./dist/cordova/android/apk/release/app-release-signed.apk ${xxx.keystore} -storepass ${storepass}

${xxx.keystore}: 修改为生成的keystore名称
${storepass}: 修改为生成的keystore的密码
```

### 效果图
#### 查询界面
![图1](https://raw.githubusercontent.com/kongfu-cat/MDGallery/master/images/47117dfcb8174cb2a3b9d9262fcc0003.jpg)
#### 进行OCR车牌识别【百度AI接口】
![图2](https://raw.githubusercontent.com/kongfu-cat/MDGallery/master/images/4676c2e995334c8988e08789dad103f6.jpg)
#### 备份界面
![图3](https://raw.githubusercontent.com/kongfu-cat/MDGallery/master/images/984c5907b76e4b54af7ce0e298916392.jpg)
#### 侧边栏
![图4](https://raw.githubusercontent.com/kongfu-cat/MDGallery/master/images/42c2aed2526941268c49622ce60f1fd6.jpg)