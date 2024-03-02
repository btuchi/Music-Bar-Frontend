//设置cookie,增加到vue实例方便全局调用
//vue全局调用的理由是，有些组件所用到的接口可能需要session验证，session从cookie获取
//当然，如果session保存到vuex的话除外
//全局引入vue
var cookie = {
    setCookie(name, value, expireHours) {
        var cookieString = name + "=" + escape(value) + "; path=/";
        //判断是否设置过期时间
        if (expireHours > 0) {
            var date = new Date();
            date.setTime(date.getTime() + expireHours * 3600 * 1000);
            cookieString = cookieString + ";expires=" + date.toGMTString(); //expires指定了cookie的生存期，默认情况下cookie是暂时存在的，他们存储的值只在浏览器会话期间存在，当用户推出浏览器后这些值也会丢失，如果想让cookie存在一段时间，就要为expires属性设置为未来的一个过期日期。
        }
        document.cookie = cookieString;
    },
    getCookie(name) {
        var strcookie = document.cookie; //你可以用console.log()打印在控制台中查看
        var arrcookie = strcookie.split("; ");
        for (var i = 0; i < arrcookie.length; i++) {
            var arr = arrcookie[i].split("=");
            if (arr[0] == name) return unescape(arr[1]);
        }
        return null;
    },
    delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null)
            document.cookie =
            name + "=" + cval + "; path=/;expires=" + exp.toGMTString();
    },
};

export default cookie;