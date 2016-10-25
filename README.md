# README #

### 如何运行项目? ###

* git clone https://jerryqueue@bitbucket.org/jerryqueue/ttt-complete.git
* 使用 intellij idea 打开项目
* Run->Edit Configurations…
* 选择 Deployment 页签，在 Deploy at the server startup 一栏的底部点击+，选择 External Source...
* 在打开的Select files or directories to deploy 对话框中选择项目路径下的 web/resources目录，点击OK，回到 Run/Debug Configurations 对话框
* 选择Server页签，On ‘Update’ action 选择 Redeploy。
* 点击OK

* 进入项目路径下的web目录，执行 npm install
* 在 web 目录下执行 npm run build，然后点击 intellij idea 右上角的绿色三角启动服务器
* 在 web 目录下执行 npm start 可以运行前端的 webpack-dev-server，运行在 localhost:9090，/api/*的请求 proxy 到 localhost:8080