# About
railway免费版提供了每月500小时的运行时间，显然不满足每天24小时都运行，于是笔者写下此自动化脚本，用于每天0点-1点随机抽取一个时间点将railway部署的最后一个项目休眠(取消部署，这样才不会占用500个小时的额度)，然后每天9点-10点随机抽取一个时间点自动重新部署(rollback)，这样可以实现每天伪在线，保证项目每天白天时间可用。

# Usage
本项目采用puppeteer，故需要安装<span style='color:"red"'>nodejs</span>环境，安装过程过于简单，此处略。

railway.js 中需要设置三处地方，分别是<b>github的用户名和密码</b>，还有<b>railway中服务的url地址</b>，该地址是当railway处于如下界面时的url地址：
![image](https://user-images.githubusercontent.com/101410426/191672239-3dc1086b-205b-4ce6-9e77-094909c6c42b.png)
