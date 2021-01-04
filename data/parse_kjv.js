const fs = require('fs');

const data = fs.readFileSync('kjv.txt', 'utf8');

const books = data.split(/\n\n\n\n\n/g);

var total_words = 0;
var verses = [];

var testament = 'Old';
books.forEach(book=>{
	book = book.trim();
	
	var title = book.split(/\n/g)[0].trim();
	
	if(title === 'The Old Testament of the King James Version of the Bible') return;
	if(title === 'The New Testament of the King James Bible'){
		testament = 'New';
		return;
	}
	
	book = book.substr(book.indexOf("1:1"));
	
	var matches = [...book.matchAll(/(\d+:\d+)/g)];
	
	for(let i=0; i<matches.length; i++){
		var index = matches[i][0];
		var text_start = matches[i].index + index.length;
		var text_end = i === (matches.length - 1) ? book.length : matches[i+1].index;
		
		var text = book.substring(text_start, text_end).trim();
		
		var [chapter, verse] = index.split(":").map(n=>+n);
		
		var wordcount = text.split(/\s+/g).length;
		total_words += wordcount;
		
		verses.push({
			testament, title, chapter, verse, text, wordcount
		});
	}
});

var final_data = [];

var verse_index = 0;
var words_per_day = total_words / 365;
var words_read = 0, total_days = 0;

var d = new Date(2021, 0, 1), week = 1;
var days = ['Sun', 'Mon', 'Tues', 'Wedn', 'Thurs', 'Fri', 'Sat'];
while(true){
	var start_mo = d.getMonth() + 1;
	var start_date = d.getDate();
	var start_day = d.getDay();
	var days_in_week;

	if(start_mo === 12 && start_date+7 > 31){
		days_in_week = 31 - start_date;
	}else{
		days_in_week = 7 - start_day;
	}

	d.setDate(d.getDate()+days_in_week);
	var end_mo = d.getMonth() + 1;
	var end_date = d.getDate();
	var end_day = d.getDay();
	days_in_week++;
	
	///////////
	total_days += days_in_week;
	var target_word_count = total_days * words_per_day;
	
	var start_verse = verses[verse_index];
	var end_verse = verses[verse_index];
	words_read += verses[verse_index].wordcount;
	var verses_this_week = [start_verse];
	
	while(words_read < target_word_count){
		verse_index++;
		end_verse = verses[verse_index];
		words_read += end_verse.wordcount;
		verses_this_week.push(end_verse);
	}
	
	final_data.push({
		week_no: week,
		start_day: days[start_day],
		start_date: `${start_mo}/${start_date}`,
		end_day: days[end_day],
		end_date: `${end_mo}/${end_date}`,
		days_this_week: days_in_week,
		verses: verses_this_week 
	});
	
	verse_index++;
	///////////
	
	d.setDate(d.getDate()+1);
	week++;

	if(start_mo === 12 && start_date+7 >= 31){
		break;
	}

}

fs.writeFileSync("kjv.json", JSON.stringify(final_data, null, 2)); 

console.log('done');