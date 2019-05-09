# depence front

依赖可视化的前端部分

## 效果图

![效果图](https://chenweilin.xin/blogImg/1557393528730Xa1HAeS捕获.PNG)

## 预计功能

1. 代码页面：主要用来展示某节点代码->高亮表示其依赖的语句
2. 右侧可视化添加鼠标交互
    1. 单击某节点后重点显示其依赖链（如 其他节点灰化、该节点依赖链亮化或者变大）：为了更好分析特定节点。
    2. 双击某节点后路由跳转到代码页面
3. 左侧依赖列表添加鼠标交互
4. 依赖分类：redux(关键字store)相关 router(关键字router)相关 css相关 媒体文件(图片、音视频、字体等)相关，可选择是否显示某分类