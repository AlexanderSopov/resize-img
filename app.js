"use strict";
const gm = require("gm"), fs = require("fs"),
getDirName = require('path').dirname, mkdirp = require('mkdirp'),
outputDir="./new/",
models = require("./models");

var targetDir, auroraCount =1, luxuriaCount=1, classicCount=1;



function findImg(path){
	var files = fs.readdirSync(path);
	//console.log(files);
	for (let i in files){
		let file = files[i];
		let stat = fs.statSync(path+file);
		if (stat.isDirectory())
			findImg(path + file +"/");
		else if (/\S+\.png$/.test(file))
			convert(path,file);
	}
}

function convert(path, filename){
	let fabric, folder;
	if (/\S+(4k)|(8k)/.test(filename)){
		console.log("ignore large files");
		return null;
	}

	for (let i in models){
		let model = models[i];
		if(model.regex.test(filename)){
			folder = model.folder;
			for (let i in fabrics){
				var f = fabrics[i];
				if(f.regex.test(filename)){
					fabric = f.name;
					break;
				}
			}
		}
	}

	if(!folder || !fabric)
		return console.log("ignoring: " + filename);

	outPut(path+filename, outputDir, folder, fabric);
}

function outPut(filePath, target,folder, fabric){
	console.log("saving file: " + (target+folder+fabric+"-xxx.png"));
	mkdirp(target+folder, function(err){
		if (err)
			return console.log("error at making dir" + err);
		gm(filePath).crop(2000, 1400, 0, 0).resize(200)
			.quality(80).write(target+folder+fabric + "-min.png", callback);
		gm(filePath).crop(2000, 1400, 0, 0).resize(1620)
			.quality(90).write(target+folder+fabric + "-md.png", callback);
	})
}


function callback(err, data){
	if (err)
		return (console.log(err));
}

function getFabrics(){
	let fabrics = fs.readdirSync("tyg/");
	for (let i in fabrics){
		let f = fabrics[i];
		if (f == ".DS_Store"){
			fabrics.splice(i,1);
			f = fabrics[i];
		}
		f = f.substring(0,f.length-4);
		
		fabrics[i] = {
			name: f,
			regex: new RegExp("\\S\+"+f,"i")
		}
		console.log(fabrics[i].regex);
	}
	return fabrics;
}

var fabrics = getFabrics();
// for (let i in fabrics)
// 	console.log(fabrics[i].name);
findImg("img/");



