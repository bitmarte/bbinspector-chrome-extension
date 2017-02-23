window.SerializerUtil = {};

SerializerUtil.buildExpressionForEval = function(toSerializeObj) {
	//TODO inject CircularJSON here by Grunt (dynamically)
	var exp = "var CircularJSON=function(n,r){function t(n,r,t){var e,i=[],c=[n],a=[n],l=[t?s:\"[Circular]\"],u=n,o=1;return function(n,g){return r&&(g=r.call(this,n,g)),\"\"!==n&&(u!==this&&(e=o-y.call(c,this)-1,o-=e,c.splice(o,c.length),i.splice(o-1,i.length),u=this),\"object\"==typeof g&&g?(y.call(c,g)<0&&c.push(u=g),o=c.length,e=y.call(a,g),0>e?(e=a.push(g)-1,t?(i.push((\"\"+n).replace(p,f)),l[e]=s+i.join(s)):l[e]=l[0]):g=l[e]):\"string\"==typeof g&&t&&(g=g.replace(f,h).replace(s,f))),g}}function e(n,r){for(var t=0,e=r.length;e>t;n=n[r[t++].replace(g,s)]);return n}function i(n){return function(r,t){var e=\"string\"==typeof t;return e&&t.charAt(0)===s?new w(t.slice(1)):(\"\"===r&&(t=l(t,t,{})),e&&(t=t.replace(v,\"$1\"+s).replace(h,f)),n?n.call(this,r,t):t)}}function c(n,r,t){for(var e=0,i=r.length;i>e;e++)r[e]=l(n,r[e],t);return r}function a(n,r,t){for(var e in r)r.hasOwnProperty(e)&&(r[e]=l(n,r[e],t));return r}function l(n,r,t){return r instanceof Array?c(n,r,t):r instanceof w?r.length?t.hasOwnProperty(r)?t[r]:t[r]=e(n,r.split(s)):n:r instanceof Object?a(n,r,t):r}function u(r,e,i,c){return n.stringify(r,t(r,e,!c),i)}function o(r,t){return n.parse(r,i(t))}var s=\"~\",f=\"\\\\x\"+(\"0\"+s.charCodeAt(0).toString(16)).slice(-2),h=\"\\\\\"+f,p=new r(f,\"g\"),g=new r(h,\"g\"),v=new r(\"(?:^|([^\\\\\\\\]))\"+h),y=[].indexOf||function(n){for(var r=this.length;r--&&this[r]!==n;);return r},w=String;return{stringify:u,parse:o}}(JSON,RegExp);";
	exp += "CircularJSON.stringify("+toSerializeObj+");";
	return exp;
}

SerializerUtil.toObject = function(serializedObj) {
	return CircularJSON.parse(serializedObj);
}

SerializerUtil.toString = function(toSerializeObj) {
	return CircularJSON.stringify(toSerializeObj);
}