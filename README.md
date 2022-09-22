# About

railway免费版提供了每月500小时的运行时间，显然不满足每天24小时都运行，于是笔者写下此自动化脚本，用于每天0点-1点随机抽取一个时间点将railway部署的最后一个项目休眠(取消部署，这样才不会占用500个小时的额度)，然后每天9点-10点随机抽取一个时间点自动重新部署(rollback)，这样可以实现每天伪在线，保证项目每天白天时间可用。

# Usage
本项目使用puppeteer实现模拟浏览器的操作，故需要安装 <b>nodejs</b> 环境，安装过程过于简单，此处略。

1. 获取本项目代码
```bash
cd && git clone https://github.com/hugo-on/railway.git && cd railway && mkdir -p chromeData
```

2. 修改railway.js
```bash
vim railway.js
```

railway.js 中需要设置三处地方，分别是<b>github的用户名和密码</b>，还有<b>railway中服务的url地址</b>，该地址是<b>当railway处于如下界面</b>时的url地址：

![image](https://user-images.githubusercontent.com/101410426/191672239-3dc1086b-205b-4ce6-9e77-094909c6c42b.png)

3. 根据需求执行

- 立即部署项目：
```
chmod +x railway.sh && ./railway.sh up
```
- 取消部署项目：
```
chmod +x railway.sh && ./railway.sh down
```

执行上述命令后将自动创建cron任务，每天定时执行部署和取消部署，保证项目在需要的时候可用。

> 如果github登录失败，可能是触发了登录验证，需要手动输入邮箱验证码即可。

> 本项目仅用于学习交流，请勿滥用本项目，笔者其他任何公共仓库亦是如此。

