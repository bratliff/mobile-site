



<!DOCTYPE html>
<html>
<head>
 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" >
 <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" >
 
 <meta name="ROBOTS" content="NOARCHIVE">
 
 <link rel="icon" type="image/vnd.microsoft.icon" href="http://www.gstatic.com/codesite/ph/images/phosting.ico">
 
 
 <script type="text/javascript">
 
 (function(){var a=function(b){this.t={};this.tick=function(b,c,d){c=void 0!=d?d:(new Date).getTime();this.t[b]=c};this.tick("start",null,b)},e=new a;window.jstiming={Timer:a,load:e};try{var f=null;window.chrome&&window.chrome.csi&&(f=Math.floor(window.chrome.csi().pageT));null==f&&window.gtbExternal&&(f=window.gtbExternal.pageT());null==f&&window.external&&(f=window.external.pageT);f&&(window.jstiming.pt=f)}catch(g){};})();

 
 
 
 
 var codesite_token = "dZRygaJXKAdCHzpL6pHifa_HdgE:1348614825757";
 
 
 var CS_env = {"profileUrl":["/u/116222609289500650677/"],"token":"dZRygaJXKAdCHzpL6pHifa_HdgE:1348614825757","assetHostPath":"http://www.gstatic.com/codesite/ph","domainName":null,"assetVersionPath":"http://www.gstatic.com/codesite/ph/16186173366037945081","projectHomeUrl":"/p/google-maps-utility-library-v3","relativeBaseUrl":"","projectName":"google-maps-utility-library-v3","loggedInUserEmail":"hibenratliff@gmail.com"};
 var _gaq = _gaq || [];
 _gaq.push(
 ['siteTracker._setAccount', 'UA-18071-1'],
 ['siteTracker._trackPageview']);
 
 _gaq.push(
 ['projectTracker._setAccount', 'UA-12846745-3'],
 ['projectTracker._trackPageview']);
 
 (function() {
 var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
 ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
 (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
 })();
 
 </script>
 
 
 <title>infobox_packed.js - 
 google-maps-utility-library-v3 -
 
 
 Open source project to be a central repository of utility libraries that can be used with the Google Maps API JavaScript v3. - Google Project Hosting
 </title>
 <link type="text/css" rel="stylesheet" href="http://www.gstatic.com/codesite/ph/16186173366037945081/css/core.css">
 
 <link type="text/css" rel="stylesheet" href="http://www.gstatic.com/codesite/ph/16186173366037945081/css/ph_detail.css" >
 
 
 <link type="text/css" rel="stylesheet" href="http://www.gstatic.com/codesite/ph/16186173366037945081/css/d_sb.css" >
 
 
 
<!--[if IE]>
 <link type="text/css" rel="stylesheet" href="http://www.gstatic.com/codesite/ph/16186173366037945081/css/d_ie.css" >
<![endif]-->
 <style type="text/css">
 .menuIcon.off { background: no-repeat url(http://www.gstatic.com/codesite/ph/images/dropdown_sprite.gif) 0 -42px }
 .menuIcon.on { background: no-repeat url(http://www.gstatic.com/codesite/ph/images/dropdown_sprite.gif) 0 -28px }
 .menuIcon.down { background: no-repeat url(http://www.gstatic.com/codesite/ph/images/dropdown_sprite.gif) 0 0; }
 
 
 
  tr.inline_comment {
 background: #fff;
 vertical-align: top;
 }
 div.draft, div.published {
 padding: .3em;
 border: 1px solid #999; 
 margin-bottom: .1em;
 font-family: arial, sans-serif;
 max-width: 60em;
 }
 div.draft {
 background: #ffa;
 } 
 div.published {
 background: #e5ecf9;
 }
 div.published .body, div.draft .body {
 padding: .5em .1em .1em .1em;
 max-width: 60em;
 white-space: pre-wrap;
 white-space: -moz-pre-wrap;
 white-space: -pre-wrap;
 white-space: -o-pre-wrap;
 word-wrap: break-word;
 font-size: 1em;
 }
 div.draft .actions {
 margin-left: 1em;
 font-size: 90%;
 }
 div.draft form {
 padding: .5em .5em .5em 0;
 }
 div.draft textarea, div.published textarea {
 width: 95%;
 height: 10em;
 font-family: arial, sans-serif;
 margin-bottom: .5em;
 }

 
 .nocursor, .nocursor td, .cursor_hidden, .cursor_hidden td {
 background-color: white;
 height: 2px;
 }
 .cursor, .cursor td {
 background-color: darkblue;
 height: 2px;
 display: '';
 }
 
 
.list {
 border: 1px solid white;
 border-bottom: 0;
}

 
 </style>
</head>
<body class="t4">
<script type="text/javascript">
 window.___gcfg = {lang: 'en'};
 (function() 
 {var po = document.createElement("script");
 po.type = "text/javascript"; po.async = true;po.src = "https://apis.google.com/js/plusone.js";
 var s = document.getElementsByTagName("script")[0];
 s.parentNode.insertBefore(po, s);
 })();
</script>
<div class="headbg">

 <div id="gaia">
 

 <span>
 
 
 
 <b>hibenratliff@gmail.com</b>
 
 
 | <a href="/u/116222609289500650677/" id="projects-dropdown" onclick="return false;"
 ><u>My favorites</u> <small>&#9660;</small></a>
 | <a href="/u/116222609289500650677/" onclick="_CS_click('/gb/ph/profile');"
 title="Profile, Updates, and Settings"
 ><u>Profile</u></a>
 | <a href="https://www.google.com/accounts/Logout?continue=http%3A%2F%2Fcode.google.com%2Fp%2Fgoogle-maps-utility-library-v3%2Fsource%2Fbrowse%2Ftrunk%2Finfobox%2Fsrc%2Finfobox_packed.js%3Fr%3D48" 
 onclick="_CS_click('/gb/ph/signout');"
 ><u>Sign out</u></a>
 
 </span>

 </div>

 <div class="gbh" style="left: 0pt;"></div>
 <div class="gbh" style="right: 0pt;"></div>
 
 
 <div style="height: 1px"></div>
<!--[if lte IE 7]>
<div style="text-align:center;">
Your version of Internet Explorer is not supported. Try a browser that
contributes to open source, such as <a href="http://www.firefox.com">Firefox</a>,
<a href="http://www.google.com/chrome">Google Chrome</a>, or
<a href="http://code.google.com/chrome/chromeframe/">Google Chrome Frame</a>.
</div>
<![endif]-->



 <table style="padding:0px; margin: 0px 0px 10px 0px; width:100%" cellpadding="0" cellspacing="0"
 itemscope itemtype="http://schema.org/CreativeWork">
 <tr style="height: 58px;">
 
 
 
 <td id="plogo">
 <link itemprop="url" href="/p/google-maps-utility-library-v3">
 <a href="/p/google-maps-utility-library-v3/">
 
 <img src="http://www.gstatic.com/codesite/ph/images/defaultlogo.png" alt="Logo" itemprop="image">
 
 </a>
 </td>
 
 <td style="padding-left: 0.5em">
 
 <div id="pname">
 <a href="/p/google-maps-utility-library-v3/"><span itemprop="name">google-maps-utility-library-v3</span></a>
 </div>
 
 <div id="psum">
 <a id="project_summary_link"
 href="/p/google-maps-utility-library-v3/"><span itemprop="description">Open source project to be a central repository of utility libraries that can be used with the Google Maps API JavaScript v3.</span></a>
 
 </div>
 
 
 </td>
 <td style="white-space:nowrap;text-align:right; vertical-align:bottom;">
 
 <form action="/hosting/search">
 <input size="30" name="q" value="" type="text">
 
 <input type="submit" name="projectsearch" value="Search projects" >
 </form>
 
 </tr>
 </table>

</div>

 
<div id="mt" class="gtb"> 
 <a href="/p/google-maps-utility-library-v3/" class="tab ">Project&nbsp;Home</a>
 
 
 
 
 <a href="/p/google-maps-utility-library-v3/downloads/list" class="tab ">Downloads</a>
 
 
 
 
 
 <a href="/p/google-maps-utility-library-v3/w/list" class="tab ">Wiki</a>
 
 
 
 
 
 <a href="/p/google-maps-utility-library-v3/issues/list"
 class="tab ">Issues</a>
 
 
 
 
 
 <a href="/p/google-maps-utility-library-v3/source/checkout"
 class="tab active">Source</a>
 
 
 
 
 
 
 
 <div class=gtbc></div>
</div>
<table cellspacing="0" cellpadding="0" width="100%" align="center" border="0" class="st">
 <tr>
 
 
 
 
 
 
 
 <td class="subt">
 <div class="st2">
 <div class="isf">
 
 


 <span class="inst1"><a href="/p/google-maps-utility-library-v3/source/checkout">Checkout</a></span> &nbsp;
 <span class="inst2"><a href="/p/google-maps-utility-library-v3/source/browse/">Browse</a></span> &nbsp;
 <span class="inst3"><a href="/p/google-maps-utility-library-v3/source/list">Changes</a></span> &nbsp;
 
 &nbsp;
 
 
 <form action="/p/google-maps-utility-library-v3/source/search" method="get" style="display:inline"
 onsubmit="document.getElementById('codesearchq').value = document.getElementById('origq').value">
 <input type="hidden" name="q" id="codesearchq" value="">
 <input type="text" maxlength="2048" size="38" id="origq" name="origq" value="" title="Google Code Search" style="font-size:92%">&nbsp;<input type="submit" value="Search Trunk" name="btnG" style="font-size:92%">
 
 
 
 
 
 
 </form>
 <script type="text/javascript">
 
 function codesearchQuery(form) {
 var query = document.getElementById('q').value;
 if (query) { form.action += '%20' + query; }
 }
 </script>
 </div>
</div>

 </td>
 
 
 
 <td align="right" valign="top" class="bevel-right"></td>
 </tr>
</table>


<script type="text/javascript">
 var cancelBubble = false;
 function _go(url) { document.location = url; }
</script>
<div id="maincol"
 
>

 
<!-- IE -->




<div class="expand">
<div id="colcontrol">
<style type="text/css">
 #file_flipper { white-space: nowrap; padding-right: 2em; }
 #file_flipper.hidden { display: none; }
 #file_flipper .pagelink { color: #0000CC; text-decoration: underline; }
 #file_flipper #visiblefiles { padding-left: 0.5em; padding-right: 0.5em; }
</style>
<table id="nav_and_rev" class="list"
 cellpadding="0" cellspacing="0" width="100%">
 <tr>
 
 <td nowrap="nowrap" class="src_crumbs src_nav" width="33%">
 <strong class="src_nav">Source path:&nbsp;</strong>
 <span id="crumb_root">
 
 <a href="/p/google-maps-utility-library-v3/source/browse/?r=48">svn</a>/&nbsp;</span>
 <span id="crumb_links" class="ifClosed"><a href="/p/google-maps-utility-library-v3/source/browse/trunk/?r=48">trunk</a><span class="sp">/&nbsp;</span><a href="/p/google-maps-utility-library-v3/source/browse/trunk/infobox/?r=48">infobox</a><span class="sp">/&nbsp;</span><a href="/p/google-maps-utility-library-v3/source/browse/trunk/infobox/src/?r=48">src</a><span class="sp">/&nbsp;</span>infobox_packed.js</span>
 
 

 </td>
 
 
 <td nowrap="nowrap" width="33%" align="right">
 <table cellpadding="0" cellspacing="0" style="font-size: 100%"><tr>
 
 
 <td class="flipper"><b>r48</b></td>
 
 <td class="flipper">
 <ul class="rightside">
 
 <li><a href="/p/google-maps-utility-library-v3/source/browse/trunk/infobox/src/infobox_packed.js?r=49" title="Next">r49&rsaquo;</a></li>
 
 </ul>
 </td>
 
 </tr></table>
 </td> 
 </tr>
</table>

<div class="fc">
 
 
 
<style type="text/css">
.undermouse span {
 background-image: url(http://www.gstatic.com/codesite/ph/images/comments.gif); }
</style>
<table class="opened" id="review_comment_area"
><tr>
<td id="nums">
<pre><table width="100%"><tr class="nocursor"><td></td></tr></table></pre>
<pre><table width="100%" id="nums_table_0"><tr id="gr_svn48_1"

><td id="1"><a href="#1">1</a></td></tr
></table></pre>
<pre><table width="100%"><tr class="nocursor"><td></td></tr></table></pre>
</td>
<td id="lines">
<pre><table width="100%"><tr class="cursor_stop cursor_hidden"><td></td></tr></table></pre>
<pre class="prettyprint lang-js"><table id="src_table_0"><tr
id=sl_svn48_1

><td class="source">eval(function(p,a,c,k,e,r){e=function(c){return(c&lt;a?&#39;&#39;:e(parseInt(c/a)))+((c=c%a)&gt;35?String.fromCharCode(c+29):c.toString(36))};if(!&#39;&#39;.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return&#39;\\w+&#39;};c=1};while(c--)if(k[c])p=p.replace(new RegExp(&#39;\\b&#39;+e(c)+&#39;\\b&#39;,&#39;g&#39;),k[c]);return p}(&#39;6 7(a){a=a||{};B.C.1E.1Z(2,2C);2.17=a.1m||&quot;&quot;;2.1j=a.1h||16;2.14=a.1x||0;2.L=a.1q||11 B.C.1I(0,0);2.K=a.W||11 B.C.1H(0,0);2.T=a.U||F;2.1z=a.1y||{};2.1e=a.1g||&quot;2S&quot;;2.R=a.1b||&quot;2F://2B.B.2z/2v/2t/2q/1r.2l&quot;;4(a.1b===&quot;&quot;){2.R=&quot;&quot;}2.1a=a.1k||11 B.C.1I(1,1);2.V=a.1i||16;2.1F=a.25||&quot;23&quot;;2.3=F;2.G=F;2.N=F}7.8=11 B.C.1E();7.8.1C=6(){5 a;4(!2.3){2.3=18.1Y(&quot;1X&quot;);2.1d();2.3.9.W=&quot;1W&quot;;2.3.9.S=\&#39;1w\&#39;;4(2.T!==F){2.3.9.U=2.T}2.3.1v=2.1c()+2.17;2.2O()[2.1F].2H(2.3);2.1u();4(2.3.9.J){2.N=1t}Y{4(2.14!==0&amp;&amp;2.3.13&gt;2.14){2.3.9.J=2.14;2.3.9.2w=&quot;2u&quot;;2.N=1t}Y{a=2.1M();2.3.9.J=(2.3.13-a.X-a.12)+&quot;15&quot;;2.N=16}}2.1o(2.1j);B.C.H.Z(2,&quot;2k&quot;)}};7.8.1c=6(){5 a=&quot;&quot;;4(2.R!==&quot;&quot;){a=&quot;&lt;2j&quot;;a+=&quot; 2i=\&#39;&quot;+2.R+&quot;\&#39;&quot;;a+=&quot; 2g=12&quot;;a+=&quot; 9=\&#39;&quot;;a+=&quot; W: 2f;&quot;;a+=&quot; 2c: 2b;&quot;;a+=&quot; 2a: &quot;+2.1e+&quot;;&quot;;a+=&quot;\&#39;&gt;&quot;}Q a};7.8.1u=6(){5 a;4(2.R!==&quot;&quot;){a=2.3.29;2.G=B.C.H.28(a,\&#39;27\&#39;,2.1G())}Y{2.G=F}};7.8.1G=6(){5 a=2;Q 6(){a.1r();B.C.H.Z(a,&quot;26&quot;)}};7.8.1o=6(A){4(!A){5 d=2.24();5 v=d.22();5 i=d.21();5 g=i.13;5 j=i.1D;5 b=v.20();5 h=b.M();5 r=b.O();5 o=h/g;5 s=r/j;5 t=v.1B().M();5 m=v.1A().M();5 e=v.1A().O();5 y=v.1B().O();5 a=2.K;5 u=2.L.J;5 w=2.L.1f;5 n=2.1a.J;5 p=2.1a.1f;5 z=a.M()+(u-n)*o;5 x=a.M()+(u+2.3.13+n)*o;5 k=a.O()-(w-p)*s;5 q=a.O()-(w+2.3.1D+p)*s;5 l=(z&lt;t?t-z:0)+(x&gt;m?m-x:0);5 f=(k&gt;e?e-k:0)+(q&lt;y?y-q:0);4(!(f===0&amp;&amp;l===0)){5 c=d.2R();d.2P(11 B.C.1H(c.O()-f,c.M()-l))}}};7.8.1d=6(){5 i;5 a=2.1z;2M(i 2K a){4(a.2G(i)){2.3.9[i]=a[i]}}4(E 2.3.9.1l!==&quot;D&quot;){2.3.9.2E=&quot;2D(1l=&quot;+(2.3.9.1l*2A)+&quot;)&quot;}};7.8.1M=6(){5 c;5 a={19:0,1s:0,X:0,12:0};5 b=2.3;4(18.1n&amp;&amp;18.1n.1P){c=b.2y.1n.1P(b,&quot;&quot;);4(c){a.19=I(c.1O,10)||0;a.1s=I(c.1N,10)||0;a.X=I(c.1L,10)||0;a.12=I(c.1Q,10)||0}}Y 4(18.2s.P){4(b.P){a.19=I(b.P.1O,10)||0;a.1s=I(b.P.1N,10)||0;a.X=I(b.P.1L,10)||0;a.12=I(b.P.1Q,10)||0}}Q a};7.8.2r=6(){4(2.3){2.3.2x.2p(2.3);2.3=F}};7.8.1p=6(){2.1C();5 a=2.2o().2n(2.K);2.3.9.X=(a.x+2.L.J)+&quot;15&quot;;2.3.9.19=(a.y+2.L.1f)+&quot;15&quot;;4(2.V){2.3.9.S=\&#39;1w\&#39;}Y{2.3.9.S=&quot;1K&quot;}};7.8.2m=6(a){4(E a.1y!==&quot;D&quot;){2.1z=a.1y;2.1d()}4(E a.1m!==&quot;D&quot;){2.1J(a.1m)}4(E a.1h!==&quot;D&quot;){2.1j=a.1h}4(E a.1x!==&quot;D&quot;){2.14=a.1x}4(E a.1q!==&quot;D&quot;){2.L=a.1q}4(E a.W!==&quot;D&quot;){2.1V(a.W)}4(E a.U!==&quot;D&quot;){2.1U(a.U)}4(E a.1g!==&quot;D&quot;){2.1e=a.1g}4(E a.1b!==&quot;D&quot;){2.R=a.1b}4(E a.1k!==&quot;D&quot;){2.1a=a.1k}4(E a.1i!==&quot;D&quot;){2.V=a.1i}4(2.3){2.1p()}};7.8.1J=6(a){2.17=a;4(2.3){4(2.G){B.C.H.1S(2.G);2.G=F}4(!2.N){2.3.9.J=&quot;&quot;}2.3.1v=2.1c()+a;4(!2.N){2.3.9.J=2.3.13+&quot;15&quot;;2.3.1v=2.1c()+a}2.1u()}B.C.H.Z(2,&quot;2I&quot;)};7.8.1V=6(a){2.K=a;4(2.3){2.1p()}B.C.H.Z(2,&quot;2J&quot;)};7.8.1U=6(a){2.T=a;4(2.3){2.3.9.U=a}B.C.H.Z(2,&quot;2h&quot;)};7.8.2L=6(){Q 2.17};7.8.1R=6(){Q 2.K};7.8.2N=6(){Q 2.T};7.8.2e=6(){2.V=16;2.3.9.S=&quot;1K&quot;};7.8.2d=6(){2.V=1t;2.3.9.S=&quot;1w&quot;};7.8.2Q=6(b,a){4(a){2.K=a.1R()}2.1T(b);4(2.3){2.1o()}};7.8.1r=6(){4(2.G){B.C.H.1S(2.G);2.G=F}2.1T(F)};&#39;,62,179,&#39;||this|div_|if|var|function|InfoBox|prototype|style||||||||||||||||||||||||||||google|maps|undefined|typeof|null|closeListener_|event|parseInt|width|position_|pixelOffset_|lng|fixedWidthSet_|lat|currentStyle|return|closeBoxURL_|visibility|zIndex_|zIndex|isHidden_|position|left|else|trigger||new|right|offsetWidth|maxWidth_|px|false|content_|document|top|infoBoxClearance_|closeBoxURL|getCloseBoxImg_|setBoxStyle_|closeBoxMargin_|height|closeBoxMargin|disableAutoPan|isHidden|disableAutoPan_|infoBoxClearance|opacity|content|defaultView|panBox_|draw|pixelOffset|close|bottom|true|addClickHandler_|innerHTML|hidden|maxWidth|boxStyle|boxStyle_|getNorthEast|getSouthWest|createInfoBoxDiv_|offsetHeight|OverlayView|pane_|getCloseClickHandler_|LatLng|Size|setContent|visible|borderLeftWidth|getBoxWidths_|borderBottomWidth|borderTopWidth|getComputedStyle|borderRightWidth|getPosition|removeListener|setMap|setZIndex|setPosition|absolute|div|createElement|apply|toSpan|getDiv|getBounds|floatPane|getMap|pane|closeclick|click|addDomListener|firstChild|margin|pointer|cursor|hide|show|relative|align|zindex_changed|src|img|domready|gif|setOptions|fromLatLngToDivPixel|getProjection|removeChild|mapfiles|onRemove|documentElement|en_us|auto|intl|overflow|parentNode|ownerDocument|com|100|www|arguments|alpha|filter|http|hasOwnProperty|appendChild|content_changed|position_changed|in|getContent|for|getZIndex|getPanes|setCenter|open|getCenter|2px&#39;.split(&#39;|&#39;),0,{}))<br></td></tr
></table></pre>
<pre><table width="100%"><tr class="cursor_stop cursor_hidden"><td></td></tr></table></pre>
</td>
</tr></table>

 
<script type="text/javascript">
 var lineNumUnderMouse = -1;
 
 function gutterOver(num) {
 gutterOut();
 var newTR = document.getElementById('gr_svn48_' + num);
 if (newTR) {
 newTR.className = 'undermouse';
 }
 lineNumUnderMouse = num;
 }
 function gutterOut() {
 if (lineNumUnderMouse != -1) {
 var oldTR = document.getElementById(
 'gr_svn48_' + lineNumUnderMouse);
 if (oldTR) {
 oldTR.className = '';
 }
 lineNumUnderMouse = -1;
 }
 }
 var numsGenState = {table_base_id: 'nums_table_'};
 var srcGenState = {table_base_id: 'src_table_'};
 var alignerRunning = false;
 var startOver = false;
 function setLineNumberHeights() {
 if (alignerRunning) {
 startOver = true;
 return;
 }
 numsGenState.chunk_id = 0;
 numsGenState.table = document.getElementById('nums_table_0');
 numsGenState.row_num = 0;
 if (!numsGenState.table) {
 return; // Silently exit if no file is present.
 }
 srcGenState.chunk_id = 0;
 srcGenState.table = document.getElementById('src_table_0');
 srcGenState.row_num = 0;
 alignerRunning = true;
 continueToSetLineNumberHeights();
 }
 function rowGenerator(genState) {
 if (genState.row_num < genState.table.rows.length) {
 var currentRow = genState.table.rows[genState.row_num];
 genState.row_num++;
 return currentRow;
 }
 var newTable = document.getElementById(
 genState.table_base_id + (genState.chunk_id + 1));
 if (newTable) {
 genState.chunk_id++;
 genState.row_num = 0;
 genState.table = newTable;
 return genState.table.rows[0];
 }
 return null;
 }
 var MAX_ROWS_PER_PASS = 1000;
 function continueToSetLineNumberHeights() {
 var rowsInThisPass = 0;
 var numRow = 1;
 var srcRow = 1;
 while (numRow && srcRow && rowsInThisPass < MAX_ROWS_PER_PASS) {
 numRow = rowGenerator(numsGenState);
 srcRow = rowGenerator(srcGenState);
 rowsInThisPass++;
 if (numRow && srcRow) {
 if (numRow.offsetHeight != srcRow.offsetHeight) {
 numRow.firstChild.style.height = srcRow.offsetHeight + 'px';
 }
 }
 }
 if (rowsInThisPass >= MAX_ROWS_PER_PASS) {
 setTimeout(continueToSetLineNumberHeights, 10);
 } else {
 alignerRunning = false;
 if (startOver) {
 startOver = false;
 setTimeout(setLineNumberHeights, 500);
 }
 }
 }
 function initLineNumberHeights() {
 // Do 2 complete passes, because there can be races
 // between this code and prettify.
 startOver = true;
 setTimeout(setLineNumberHeights, 250);
 window.onresize = setLineNumberHeights;
 }
 initLineNumberHeights();
</script>

 
 
 <div id="log">
 <div style="text-align:right">
 <a class="ifCollapse" href="#" onclick="_toggleMeta(this); return false">Show details</a>
 <a class="ifExpand" href="#" onclick="_toggleMeta(this); return false">Hide details</a>
 </div>
 <div class="ifExpand">
 
 
 <div class="pmeta_bubble_bg" style="border:1px solid white">
 <div class="round4"></div>
 <div class="round2"></div>
 <div class="round1"></div>
 <div class="box-inner">
 <div id="changelog">
 <p>Change log</p>
 <div>
 <a href="/p/google-maps-utility-library-v3/source/detail?spec=svn48&amp;r=48">r48</a>
 by garylittlerlp
 on Jan 14, 2010
 &nbsp; <a href="/p/google-maps-utility-library-v3/source/diff?spec=svn48&r=48&amp;format=side&amp;path=/trunk/infobox/src/infobox_packed.js&amp;old_path=/trunk/infobox/src/infobox_packed.js&amp;old=">Diff</a>
 </div>
 <pre>Adding InfoBox to the project</pre>
 </div>
 
 
 
 
 
 
 <script type="text/javascript">
 var detail_url = '/p/google-maps-utility-library-v3/source/detail?r=48&spec=svn48';
 var publish_url = '/p/google-maps-utility-library-v3/source/detail?r=48&spec=svn48#publish';
 // describe the paths of this revision in javascript.
 var changed_paths = [];
 var changed_urls = [];
 
 changed_paths.push('/trunk/ExtDraggableObject/docs/examples.html');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/ExtDraggableObject/docs/examples.html?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/ExtDraggableObject/docs/reference.html');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/ExtDraggableObject/docs/reference.html?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/ExtDraggableObject/examples/simple.html');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/ExtDraggableObject/examples/simple.html?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/ExtDraggableObject/examples/zoom_slider.html');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/ExtDraggableObject/examples/zoom_slider.html?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/ExtDraggableObject/src/ExtDraggableObject.js');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/ExtDraggableObject/src/ExtDraggableObject.js?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/ExtDraggableObject/src/ExtDraggableObject_packed.js');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/ExtDraggableObject/src/ExtDraggableObject_packed.js?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/extoverviewmapcontrol/src/extoverviewmapcontrol_packed.js');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/extoverviewmapcontrol/src/extoverviewmapcontrol_packed.js?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/infobox');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/infobox?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/infobox/docs');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/infobox/docs?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/infobox/docs/examples.html');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/infobox/docs/examples.html?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/infobox/docs/reference.html');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/infobox/docs/reference.html?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/infobox/examples');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/infobox/examples?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/infobox/examples/infobox-basic.html');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/infobox/examples/infobox-basic.html?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/infobox/examples/infobox-label.html');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/infobox/examples/infobox-label.html?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/infobox/src');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/infobox/src?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/infobox/src/infobox.js');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/infobox/src/infobox.js?r\x3d48\x26spec\x3dsvn48');
 
 
 changed_paths.push('/trunk/infobox/src/infobox_packed.js');
 changed_urls.push('/p/google-maps-utility-library-v3/source/browse/trunk/infobox/src/infobox_packed.js?r\x3d48\x26spec\x3dsvn48');
 
 var selected_path = '/trunk/infobox/src/infobox_packed.js';
 
 
 function getCurrentPageIndex() {
 for (var i = 0; i < changed_paths.length; i++) {
 if (selected_path == changed_paths[i]) {
 return i;
 }
 }
 }
 function getNextPage() {
 var i = getCurrentPageIndex();
 if (i < changed_paths.length - 1) {
 return changed_urls[i + 1];
 }
 return null;
 }
 function getPreviousPage() {
 var i = getCurrentPageIndex();
 if (i > 0) {
 return changed_urls[i - 1];
 }
 return null;
 }
 function gotoNextPage() {
 var page = getNextPage();
 if (!page) {
 page = detail_url;
 }
 window.location = page;
 }
 function gotoPreviousPage() {
 var page = getPreviousPage();
 if (!page) {
 page = detail_url;
 }
 window.location = page;
 }
 function gotoDetailPage() {
 window.location = detail_url;
 }
 function gotoPublishPage() {
 window.location = publish_url;
 }
</script>

 
 <style type="text/css">
 #review_nav {
 border-top: 3px solid white;
 padding-top: 6px;
 margin-top: 1em;
 }
 #review_nav td {
 vertical-align: middle;
 }
 #review_nav select {
 margin: .5em 0;
 }
 </style>
 <div id="review_nav">
 <table><tr><td>Go to:&nbsp;</td><td>
 <select name="files_in_rev" onchange="window.location=this.value">
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/ExtDraggableObject/docs/examples.html?r=48&amp;spec=svn48"
 
 >...aggableObject/docs/examples.html</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/ExtDraggableObject/docs/reference.html?r=48&amp;spec=svn48"
 
 >...ggableObject/docs/reference.html</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/ExtDraggableObject/examples/simple.html?r=48&amp;spec=svn48"
 
 >...gableObject/examples/simple.html</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/ExtDraggableObject/examples/zoom_slider.html?r=48&amp;spec=svn48"
 
 >...Object/examples/zoom_slider.html</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/ExtDraggableObject/src/ExtDraggableObject.js?r=48&amp;spec=svn48"
 
 >...Object/src/ExtDraggableObject.js</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/ExtDraggableObject/src/ExtDraggableObject_packed.js?r=48&amp;spec=svn48"
 
 >...src/ExtDraggableObject_packed.js</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/extoverviewmapcontrol/src/extoverviewmapcontrol_packed.js?r=48&amp;spec=svn48"
 
 >.../extoverviewmapcontrol_packed.js</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/infobox?r=48&amp;spec=svn48"
 
 >/trunk/infobox</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/infobox/docs?r=48&amp;spec=svn48"
 
 >/trunk/infobox/docs</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/infobox/docs/examples.html?r=48&amp;spec=svn48"
 
 >/trunk/infobox/docs/examples.html</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/infobox/docs/reference.html?r=48&amp;spec=svn48"
 
 >/trunk/infobox/docs/reference.html</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/infobox/examples?r=48&amp;spec=svn48"
 
 >/trunk/infobox/examples</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/infobox/examples/infobox-basic.html?r=48&amp;spec=svn48"
 
 >...obox/examples/infobox-basic.html</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/infobox/examples/infobox-label.html?r=48&amp;spec=svn48"
 
 >...obox/examples/infobox-label.html</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/infobox/src?r=48&amp;spec=svn48"
 
 >/trunk/infobox/src</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/infobox/src/infobox.js?r=48&amp;spec=svn48"
 
 >/trunk/infobox/src/infobox.js</option>
 
 <option value="/p/google-maps-utility-library-v3/source/browse/trunk/infobox/src/infobox_packed.js?r=48&amp;spec=svn48"
 selected="selected"
 >...nk/infobox/src/infobox_packed.js</option>
 
 </select>
 </td></tr></table>
 
 <div id="review_show_hide" class="opened">
 <div class="ifOpened"><a href="#" onclick="return toggleComments()">Hide comments</a></div>
 <div class="ifClosed"><a href="#" onclick="return toggleComments()">Show comments</a></div>
 </div>
 
 
 



 
 </div>
 
 
 </div>
 <div class="round1"></div>
 <div class="round2"></div>
 <div class="round4"></div>
 </div>
 <div class="pmeta_bubble_bg" style="border:1px solid white">
 <div class="round4"></div>
 <div class="round2"></div>
 <div class="round1"></div>
 <div class="box-inner">
 <div id="older_bubble">
 <p>Older revisions</p>
 
 <a href="/p/google-maps-utility-library-v3/source/list?path=/trunk/infobox/src/infobox_packed.js&start=48">All revisions of this file</a>
 </div>
 </div>
 <div class="round1"></div>
 <div class="round2"></div>
 <div class="round4"></div>
 </div>
 
 <div class="pmeta_bubble_bg" style="border:1px solid white">
 <div class="round4"></div>
 <div class="round2"></div>
 <div class="round1"></div>
 <div class="box-inner">
 <div id="fileinfo_bubble">
 <p>File info</p>
 
 <div>Size: 4464 bytes,
 1 line</div>
 
 <div><a href="//google-maps-utility-library-v3.googlecode.com/svn-history/r48/trunk/infobox/src/infobox_packed.js">View raw file</a></div>
 </div>
 
 </div>
 <div class="round1"></div>
 <div class="round2"></div>
 <div class="round4"></div>
 </div>
 </div>
 </div>


</div>

</div>
</div>

<script src="http://www.gstatic.com/codesite/ph/16186173366037945081/js/prettify/prettify.js"></script>
<script type="text/javascript">prettyPrint();</script>


<script src="http://www.gstatic.com/codesite/ph/16186173366037945081/js/source_file_scripts.js"></script>

 <script type="text/javascript" src="http://www.gstatic.com/codesite/ph/16186173366037945081/js/kibbles.js"></script>
 <script type="text/javascript">
 var lastStop = null;
 var initialized = false;
 
 function updateCursor(next, prev) {
 if (prev && prev.element) {
 prev.element.className = 'cursor_stop cursor_hidden';
 }
 if (next && next.element) {
 next.element.className = 'cursor_stop cursor';
 lastStop = next.index;
 }
 }
 
 function pubRevealed(data) {
 updateCursorForCell(data.cellId, 'cursor_stop cursor_hidden');
 if (initialized) {
 reloadCursors();
 }
 }
 
 function draftRevealed(data) {
 updateCursorForCell(data.cellId, 'cursor_stop cursor_hidden');
 if (initialized) {
 reloadCursors();
 }
 }
 
 function draftDestroyed(data) {
 updateCursorForCell(data.cellId, 'nocursor');
 if (initialized) {
 reloadCursors();
 }
 }
 function reloadCursors() {
 kibbles.skipper.reset();
 loadCursors();
 if (lastStop != null) {
 kibbles.skipper.setCurrentStop(lastStop);
 }
 }
 // possibly the simplest way to insert any newly added comments
 // is to update the class of the corresponding cursor row,
 // then refresh the entire list of rows.
 function updateCursorForCell(cellId, className) {
 var cell = document.getElementById(cellId);
 // we have to go two rows back to find the cursor location
 var row = getPreviousElement(cell.parentNode);
 row.className = className;
 }
 // returns the previous element, ignores text nodes.
 function getPreviousElement(e) {
 var element = e.previousSibling;
 if (element.nodeType == 3) {
 element = element.previousSibling;
 }
 if (element && element.tagName) {
 return element;
 }
 }
 function loadCursors() {
 // register our elements with skipper
 var elements = CR_getElements('*', 'cursor_stop');
 var len = elements.length;
 for (var i = 0; i < len; i++) {
 var element = elements[i]; 
 element.className = 'cursor_stop cursor_hidden';
 kibbles.skipper.append(element);
 }
 }
 function toggleComments() {
 CR_toggleCommentDisplay();
 reloadCursors();
 }
 function keysOnLoadHandler() {
 // setup skipper
 kibbles.skipper.addStopListener(
 kibbles.skipper.LISTENER_TYPE.PRE, updateCursor);
 // Set the 'offset' option to return the middle of the client area
 // an option can be a static value, or a callback
 kibbles.skipper.setOption('padding_top', 50);
 // Set the 'offset' option to return the middle of the client area
 // an option can be a static value, or a callback
 kibbles.skipper.setOption('padding_bottom', 100);
 // Register our keys
 kibbles.skipper.addFwdKey("n");
 kibbles.skipper.addRevKey("p");
 kibbles.keys.addKeyPressListener(
 'u', function() { window.location = detail_url; });
 kibbles.keys.addKeyPressListener(
 'r', function() { window.location = detail_url + '#publish'; });
 
 kibbles.keys.addKeyPressListener('j', gotoNextPage);
 kibbles.keys.addKeyPressListener('k', gotoPreviousPage);
 
 
 }
 </script>
<script src="http://www.gstatic.com/codesite/ph/16186173366037945081/js/code_review_scripts.js"></script>
<script type="text/javascript">
 function showPublishInstructions() {
 var element = document.getElementById('review_instr');
 if (element) {
 element.className = 'opened';
 }
 }
 var codereviews;
 function revsOnLoadHandler() {
 // register our source container with the commenting code
 var paths = {'svn48': '/trunk/infobox/src/infobox_packed.js'}
 codereviews = CR_controller.setup(
 {"profileUrl":["/u/116222609289500650677/"],"token":"dZRygaJXKAdCHzpL6pHifa_HdgE:1348614825757","assetHostPath":"http://www.gstatic.com/codesite/ph","domainName":null,"assetVersionPath":"http://www.gstatic.com/codesite/ph/16186173366037945081","projectHomeUrl":"/p/google-maps-utility-library-v3","relativeBaseUrl":"","projectName":"google-maps-utility-library-v3","loggedInUserEmail":"hibenratliff@gmail.com"}, '', 'svn48', paths,
 CR_BrowseIntegrationFactory);
 
 codereviews.registerActivityListener(CR_ActivityType.REVEAL_DRAFT_PLATE, showPublishInstructions);
 
 codereviews.registerActivityListener(CR_ActivityType.REVEAL_PUB_PLATE, pubRevealed);
 codereviews.registerActivityListener(CR_ActivityType.REVEAL_DRAFT_PLATE, draftRevealed);
 codereviews.registerActivityListener(CR_ActivityType.DISCARD_DRAFT_COMMENT, draftDestroyed);
 
 
 
 
 
 
 
 var initialized = true;
 reloadCursors();
 }
 window.onload = function() {keysOnLoadHandler(); revsOnLoadHandler();};

</script>
<script type="text/javascript" src="http://www.gstatic.com/codesite/ph/16186173366037945081/js/dit_scripts.js"></script>

 
 
 
 <script type="text/javascript" src="http://www.gstatic.com/codesite/ph/16186173366037945081/js/ph_core.js"></script>
 
 
 
 
</div> 

<div id="footer" dir="ltr">
 <div class="text">
 <a href="/projecthosting/terms.html">Terms</a> -
 <a href="http://www.google.com/privacy.html">Privacy</a> -
 <a href="/p/support/">Project Hosting Help</a>
 </div>
</div>
 <div class="hostedBy" style="margin-top: -20px;">
 <span style="vertical-align: top;">Powered by <a href="http://code.google.com/projecthosting/">Google Project Hosting</a></span>
 </div>

 
 


 
 
 <script type="text/javascript">_CS_reportToCsi();</script>
 
 </body>
</html>

