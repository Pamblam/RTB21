const fs = require('fs');
const verses = JSON.parse(fs.readFileSync('kjv-parsed.json', 'utf8'));

let start_date = new Date();
let days = 365;

let total_words = verses.reduce((a,c)=>a+c.wordcount, 0);
let words_per_day = total_words / days;

let daily_verses = [];
let verse = 0;
let total_verses = verses.length;

let day = start_date;
for(let i=0; i<days; i++){

	let words_today = 0;
	let verses_today = [];
	while(words_today <= words_per_day && verse <total_verses){
		let next_verse = verses[verse];
		verses_today.push(next_verse);
		words_today += next_verse.wordcount;
		verse++;
	}
	
	daily_verses.push({
		verses_today,
		day: day.toDateString()
	});
	day.setDate(day.getDate()+1);
}

fs.writeFileSync("daily_verses.json", JSON.stringify(daily_verses, null, 2)); 

