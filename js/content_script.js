$(document).ready(function() {
	var AutoExtractor = function() {
		this._curIndex = localStorage.getItem("_curIndex") || 0;
		this._curURL = "";
		this._content = "";
		this._data = {};
		this._urls = null;
	}

	AutoExtractor.prototype = {
		init: function() {
			this._urls = global_Urls;
			this._curIndex = localStorage.getItem("_curIndex") || 0;
			this._curURL = this._urls[this._curIndex];
			var curDomain = this._curURL;
			var subDomain = curDomain.substr(curDomain.indexOf(".") + 1);
			if (window.location.href.indexOf(this._curURL) == -1) {
				if (this._curURL == "classconnection.s3.amazonaws.com" ||
					this._curURL == "music.msn.com" ||
					this._curURL == "music.baidu.com" ||
					this._curURL == "mp3.zing.vn" ||
					window.location.href == "https://whois.domaintools.com/" + subDomain)
					this.extractData();
				else
					window.location.href = "https://whois.domaintools.com/" + this._curURL;
			} else 
				this.extractData();
		},

		extractData: function() {
			if ($('.raw.well.well-sm').length > 0) {
				var _content = $('.raw.well.well-sm')[0].innerText;
				if(!_content) {
					alert("slkdjfsldkfjsdlkf", function() {
						return;
					});
					return;
				}
				while(_content.indexOf(" ") > -1) {
					_content = _content.replace(" ", " ");
				}
				var lines = _content.split("\n");
				var nameIndex = 0, emailIndex = 0;

				for(var i = 0; i < lines.length; i++) {
					var line = lines[i];
					var segs = line.split(":");

					if(segs[0].indexOf("Name") == segs[0].length - 4 ) {
						window.AutoExtractor._data["name" + nameIndex] = (segs[1] == null) ? "" : segs[1].trim();
						nameIndex ++;
					} else if (segs[0].indexOf("Email") == segs[0].length - 5) {
						window.AutoExtractor._data["email" + emailIndex] = (segs[1] == null) ? "" : segs[1].trim();
						emailIndex++;
					}
				}
				window.AutoExtractor.renderPopup();
			} else {
				console.log(this._curURL + "was skipped...");
				window.AutoExtractor.renderPopup();
			}
		},

		renderPopup: function() {
			var $body = $('body'),
				// $inputFile = $('<input/>', {type: 'file'})
				$aePopup = $('<div/>', {id: 'autoExtractorPopup'});

			$aePopup.append(
				$("<input/>", {type:'text', id: "name0", placeholder: "Name 1."}).val(this._data.name0),
				$("<input/>", {type:'text', id: "email0", placeholder: "Email 1."}).val(this._data.email0),
				$("<input/>", {type:'text', id: "name1", placeholder: "Name 2."}).val(this._data.name1),
				$("<input/>", {type:'text', id: "email1", placeholder: "Email 1."}).val(this._data.email1),
				$("<input/>", {type:'text', id: "name2", placeholder: "Name 3."}).val(this._data.name2),
				$("<input/>", {type:'text', id: "email2", placeholder: "Email 1."}).val(this._data.email2),
				$("<input/>", {type:'text', id: "name3", placeholder: "Name 4."}).val(this._data.name3),
				$("<input/>", {type:'text', id: "email3", placeholder: "Email 1."}).val(this._data.email3),
				$("<input/>", {type:'button', id: "aeSaveToDB"}).val("Save to Database")
				);

			$body.append($aePopup);
			$aePopup.css(
				{
					'position': 'absolute', 
					'right': '0', 
					'top': '0', 
					'width': '200px', 
					'background': 'black',
					'padding': '50px 20px 10px'
				});

			$('#aeSaveToDB').click(function() {
				$.ajax({
					url:'http://localhost/emailHarvest/save.php',
					type: 'post',
					data: {
						domain: window.AutoExtractor._curURL,
						name0: window.AutoExtractor._data.name0,
						email0: window.AutoExtractor._data.email0,
						name1: window.AutoExtractor._data.name1,
						email1: window.AutoExtractor._data.email1,
						name2: window.AutoExtractor._data.name2,
						email2: window.AutoExtractor._data.email2,
						name3: window.AutoExtractor._data.name3,
						email3: window.AutoExtractor._data.email3
					},
					success: function(data) {
						console.log(window.AutoExtractor._curURL + " was added into database...");
						var curIndex = parseInt(window.AutoExtractor._curIndex) + 1;
						localStorage.setItem("_curIndex", curIndex);
						$('#nav-whois-input').val(global_Urls[curIndex]);
						window.location.href = "https://whois.domaintools.com/" + global_Urls[curIndex];
					},
					error: function(data) {
						alert("Failed.");
						localStorage.setItem("failedIndex", localStorage.getItem("failedIndex") + ", " + window.AutoExtractor._curIndex);
						return;
					}
				});
			});

			$('#aeSaveToDB').click();
		}
	}

	window.AutoExtractor = new AutoExtractor();
	window.AutoExtractor.init();
})