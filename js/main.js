
(async ()=>{
	
	const data = await fetch('./data/kjv.json').then(d=>d.json());
	
	console.log(data);
	
	var active_slide = +(localStorage.getItem('active-slide') || 0);
	
	const container = document.querySelector("#main-container");
	
	var total_words = data.reduce((a, week)=>{
		return a + week.verses.reduce((ac, cu)=> ac + cu.wordcount, 0);
	}, 0);
	
	var words_read = 0;
	const buffer = data.map((week, index)=>{
		var start = week.verses[0];
		var end = week.verses[week.verses.length-1];
		var words = week.verses.reduce((ac, cu)=> ac + cu.wordcount, 0);
		var pct = Math.floor(words_read / total_words * 100);
		words_read += words;
		return `<div class='carousel-item${index === active_slide ? ' active' : ''}'>
			<div class='container-fluid week-overview'>
				<div class='row'>
					<div class='col-md-3'>
						<h4>Week ${week.week_no}</h4>
						<span><b>${week.start_day} ${week.start_date}</b> - <b>${week.end_day} ${week.end_date}</b></span>
						<div class='week-meta'>
							<table class='table table-sm table-borderless'>
								<tr><th>Days</th><td>${week.days_this_week}</td></tr>
								<tr><th>Words</th><td>${words}</td></tr>
								<tr><th>Verses</th><td>${week.verses.length}</td></tr>
								<tr><th>Completed</th><td>${pct}%</td></tr>
							</table>
						</div>
					</div>
					<div class='col-md-9'>
						<div class='week-readings'>
							<h5>From</h5>
								<div><small>${start.testament} Testament</small></div>
								<div><b>${start.title}</b></div>
								<span>Chapter ${start.chapter}, Verse ${start.verse}</span>
							<hr>
							<h5>To</h5>
								<div><small>${end.testament} Testament</small></div>
								<div><b>${end.title}</b></div>
								<span>Chapter ${end.chapter}, Verse ${end.verse}</span>
						</div>
					</div>
				</div>
			</div>
		</div>`;
	});
	
	container.innerHTML = `<div id="carousel-main" class="carousel slide" data-ride="carousel">
		<div class="carousel-inner">
			${buffer.join('')}
		</div>
	</div>
	<center>
		<button class='btn btn-secondary' id='prev_btn'><i class="fas fa-angle-double-left"></i> Last Week</button>
		<button class='btn btn-light' id='open_btn'><i class="fas fa-book-open"></i> Open Reading</button>
		<button class='btn btn-dark' id='next_btn'>Next Week <i class="fas fa-angle-double-right"></i></button>
	</center>`;
	
	$('#carousel-main').carousel({
		interval: false,
		keyboard: false,
		wrap: false
	});
	
	document.getElementById('prev_btn').style.display = active_slide === 0 ? 'none' : null;
	document.getElementById('next_btn').style.display = active_slide === 52 ? 'none' : null;
	
	document.getElementById('prev_btn').addEventListener('click', e=>{
		e.preventDefault();
		active_slide--;
		$('#carousel-main').carousel('prev');
		localStorage.setItem('active-slide', active_slide);
		document.getElementById('prev_btn').style.display = active_slide === 0 ? 'none' : null;
		document.getElementById('next_btn').style.display = active_slide === 52 ? 'none' : null;
		localStorage.setItem('scroll-pos', 0);
	});
	
	document.getElementById('next_btn').addEventListener('click', e=>{
		e.preventDefault();
		active_slide++;
		$('#carousel-main').carousel('next');
		localStorage.setItem('active-slide', active_slide);
		document.getElementById('prev_btn').style.display = active_slide === 0 ? 'none' : null;
		document.getElementById('next_btn').style.display = active_slide === 52 ? 'none' : null;
		localStorage.setItem('scroll-pos', 0);
	});
	
	document.getElementById('open_btn').addEventListener('click', e=>{
		var verses = data[active_slide].verses;
		var cur_book, cur_chapter;
		$("#readings-modal").find('.modal-body').html(verses.map(verse=>{
			var buf = [];
			if(cur_book !== verse.title){
				cur_book = verse.title;
				buf.push(`<small>${verse.testament} Testament</small>`);
				buf.push(`<h3>${verse.title}</h3>`);
			}
			if(cur_chapter !== verse.chapter){
				cur_chapter = verse.chapter;
				buf.push(`<h4>Chapter ${verse.chapter}</h4>`);
			}
			buf.push(`<p><b>${verse.verse}</b> ${verse.text}</p>`);
			return buf.join('');
		}).join(''));
		$("#readings-modal").modal('show');
	});
	
	$("#readings-modal").on('shown.bs.modal', function(){
		var scrolltop = +(localStorage.getItem('scroll-pos') || 0);
		$("#readings-modal").scrollTop(scrolltop);
		console.log(scrolltop);
	});
	
	$("#readings-modal").modal({
		show: false
	});
	
	$("#readings-modal").on('scroll', function() {
		localStorage.setItem('scroll-pos', $(this).scrollTop());
	});
	
})();

