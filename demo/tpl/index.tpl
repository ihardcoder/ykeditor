<!DOCTYPE HTML>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Access-Control-Allow-Origin" content="*">
    <title>ueditor demo</title>
    <!-- <link type="text/css" rel="stylesheet" href="http://static.youku.com/v1.0.1065/index/css/youku.css"> -->
    <link type="text/css" rel="stylesheet" href="http://static.youku.com/v1.0.1065/u/css/grid.css">
    <link type="text/css" rel="stylesheet" href="http://static.youku.com/v1.0.1065/u/css/i.css">
    <link type="text/css" rel="stylesheet" href="http://static.youku.com/v1.0.1065/u/css/home.css">
    <link type="text/css" rel="stylesheet" href="http://static.youku.com/v1.0.1065/u/css/subscription.css">
    <link type="text/css" rel="stylesheet" href="/index/css/youku.css" />
    <link href="/index/2013/header/css/header.css" type="text/css" rel="stylesheet" />
    <link type="text/css" rel="stylesheet" href="/u/css/grid.css" />
    <link type="text/css" rel="stylesheet" href="/u/css/i.css" />
    <link type="text/css" rel="stylesheet" href="/u/css/skin/V2/default.css" />
    <link type="text/css" rel="stylesheet" href="/u/css/home.css" />
    <link rel="stylesheet" type="text/css" href="../styles/css/default.css">
    {literal}
    <script src="http://www.youku.com/v1.0.09614/js/prototype.js"></script>
    <script src="/index/js/qwindow.js"></script>
    <script src="http://static.youku.com/v1.0.1064/index/js/common.js"></script>
    <script type="text/javascript" src="../libs/third-party/jquery-1.10.2.min.js"></script>
    <script type="text/javascript">
        jQuery.noConflict();
    </script>
    <style type="text/css">
        .header{
            height: 60px;
        }
        .headerBox{
            height: 60px;
            background: lightblue;
            border-bottom: solid 1px blue;
            position: fixed;
              width: 100%;
              top: 0;
              left: 0;
              z-index: 20000;
        }
    </style>
    {/literal}
</head>

<body>
    <div class="header">
        <div class="headerBox">优酷</div>
    </div>
    <!-- 加载编辑器的容器 -->
    <div id="container" name="content" style="margin-bottom: 300px;">
        <div id='editor' ></div>
    </div>

    {include file='part_wins.tpl'}
    
    {literal}
    <script type="text/javascript" src="http://beta.youku.com/v1.0.09614/u/js/md5.min.js"></script>
    <script type="text/javascript" src='../libs/ueditor.config.js'></script>
    <script type="text/javascript" src='../libs/ueditor.all.js'></script>
    <script type="text/javascript" src="../ykEditor.js"></script>
    
    <!-- 实例化编辑器 -->
    <script type="text/javascript">
        YE.getEditor('editor',{
            // editor:{
            //     serverUrl :"server/controller.php"
            // }
        });
    </script>
    {/literal}
    <!--<script src="http://static.youku.com/v1.0.1064/index/js/qwindow.js"></script>-->

</body>

</html>
