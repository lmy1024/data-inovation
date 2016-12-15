/**
 * json字符串显示格式化
 */
function JsonShowFormat(jsonStr,fillStringUnit){
	this.FILL_STRING_UNIT_TAB = "	";

	this._jsonStr = jsonStr;
	this._fillStringUnit = (fillStringUnit == null) ? this.FILL_STRING_UNIT_TAB : fillStringUnit;
}

JsonShowFormat.prototype = {
	formatJson:function(){
		var that = this;

		if(that._jsonStr == null && $.trim(that._jsonStr).length == 0){
			return that._jsonStr;
		}

		if(that._fillStringUnit == null){
			that._fillStringUnit = that.FILL_STRING_UNIT_TAB;
		}

		var tokenList = [];

		var jsonTemp = that._jsonStr;
		//预读取
		while (jsonTemp.length > 0) {
			var token = that.getToken(jsonTemp);

			jsonTemp = jsonTemp.substr(token.length);
			token = $.trim(token);

			tokenList.push(token);
		}

		//取得固定的长度
		var fixedLenth = 0;
		for (var i = 0,len=tokenList.length; i < len; i++) {
			var token = tokenList[i];
			var length = token.length;
			if (length > fixedLenth && (i < len - 1) && tokenList[i + 1]==":") {
				fixedLenth = length;
			}
		}

		var buf = "";
		var count = 0;
		var fillStringUnit = that._fillStringUnit;
		for (var j = 0,len2=tokenList.length; j < len2; j++) {
			var token = tokenList[j];

			if(token == ","){
				buf += token;
				buf = that.doFill(buf, count, fillStringUnit);
			}else if(token == ":"){
				buf += " "+token+" ";
			}else if(token == "{"){
				var nextToken = tokenList[j + 1];
				if (nextToken && nextToken == "}") {
					i++;
					buf += "{}";
				} else {
					count++;
					buf += token;
					buf = that.doFill(buf, count, fillStringUnit);
				}
			}else if(token == "}"){
				count--;
				buf = that.doFill(buf, count, fillStringUnit);
				buf += token;
			}else if(token == "["){
				var nextToken = tokenList[j + 1];
				if (nextToken && nextToken == "}") {
					i++;
					buf += "[]";
				} else {
					count++;
					buf += token;
					buf = that.doFill(buf, count, fillStringUnit);
				}
			}else if(token == "]"){
				count--;
				buf = that.doFill(buf, count, fillStringUnit);
				buf += token;
			}else{
				buf += token;

				//左对齐
				if (j < tokenList.length - 1 && tokenList[j + 1]== ":") {
					var fillLength = fixedLenth - token.length;
					if (fillLength > 0) {
						for(var k = 0; k < fillLength;k++) {
							buf += " ";
						}
					}
				}//end if
			}//end if else
		}

		return buf;
	},
	getToken:function(json){
		var buf = "";

		var isInYinHao = false;

		while (json.length > 0) {
			var token = json.substr(0, 1);
			json = json.substr(1);

			if (!isInYinHao && (token == ":"
				|| token == "{" || token == "}"
				|| token == "[" || token == "]"
				|| token == ",")) {

				if ($.trim(buf).length == 0) {
					buf += token;
				}
				break;
			}

			if (token == "\\") {
				buf += token + json.substr(0, 1);
				json = json.substr(1);
				continue;
			}

			if (token == "\"") {
				buf += token;
				if (isInYinHao) {
					break;
				} else {
					isInYinHao = true;
					continue;
				}
			}
			buf += token;
		}

		return buf;
	},
	doFill:function(buf,count,fillStringUnit){
		buf += "\n";
		for (var i = 0; i < count; i++) {
			buf += fillStringUnit;
		}
		return buf;
	}
};