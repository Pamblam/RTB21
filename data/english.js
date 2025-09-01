const fs = require('fs');
const verses = JSON.parse(fs.readFileSync('daily_verses.json', 'utf8'));

for(let i=0; i<verses.length; i++){
	let {day, verses_today} = verses[i];
	if(!verses_today.length) break;
	console.log(`\n\n${day}\n`);
	let start = verses_today[0];
	let end = verses_today[verses_today.length-1];
	let reading = `${start.title} ${start.chapter}:${start.verse} - `;
	if(end.title !== start.title) reading += `${end.title} `;
	if(end.title !== start.title || start.chapter !== end.chapter) reading += `${end.chapter}:`;
	reading += `${end.verse}\n`;
	console.log(reading);
	console.log(`${verses_today.length} verses - ${verses_today.reduce((a,c)=>a+c.wordcount,0)} words\n`);
}