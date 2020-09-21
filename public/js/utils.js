const showResults = debounce(function (arg) {
	var value = arg.trim();
	if (value === "" || value.length <= 0) {
		$("#search-results").fadeOut();
		return;
	} else {
		$("#search-results").fadeIn();
	}
	var jqxhr = $.get("/search/?q=" + value, function (data) {
		$("#search-results").html("");
	})
		.done(function (data) {
			if (data.length === 0) {
				$("#search-results").append(
					'<p class="lead text-center mt2">No results found</p>'
				);
			} else {
				$("#search-results").append(
					' <p class="f6 bg-near-white br--top black-60 mv0 pv2 ph3">Search Results</p><article class=" pa2 link dt w-100 bb b--black-10 pb2 mt2 dim blue"><div class="dtc w3"><img src="/artisan/' +
						data[0]._id +
						'/avatar" class=" db w-100"/></div> <div class="dtc v-top pl2"><h1 class="f6 f5-ns fw6 lh-title black mv0">' +
						data[0].name +
						'</h1><h2 class="f6 fw4 mt2 mb0 black-60">' +
						data[0].category +
						'</h1><h2 class="f6 fw4 mt2 mb0 black-60">' +
						data[0].lga +
						'</h2></article>  <a class="f6 pa2 link dim green center"style="display: flex;justify-content: center;" href="/artisans/search?q=' +
						value +
						' "> See all Results (' +
						data.length +
						" Results)</a> "
				);
				// data.forEach((x) => {
				// 	$("#search-results").append(
				// 		' <p class="f6 bg-near-white br--top black-60 mv0 pv2 ph3">Search Results</p><article class=" pa2 link dt w-100 bb b--black-10 pb2 mt2 dim blue"><div class="dtc w3"><img src="/artisan/' +
				// 			x._id +
				// 			'/avatar" class=" db w-100"/></div> <div class="dtc v-top pl2"><h1 class="f6 f5-ns fw6 lh-title black mv0">' +
				// 			x.name +
				// 			'</h1><h2 class="f6 fw4 mt2 mb0 black-60">' +
				// 			x.category +
				// 			'</h1><h2 class="f6 fw4 mt2 mb0 black-60">' +
				// 			x.lga +
				// 			'</h2></article>  <a class="f6 pa2 link dim green center"style="display: flex;justify-content: center;" href="/artisans/search?q=' +
				// 			value +
				// 			' "> See all Results</a> '
				// 	);
				// });
			}
		})
		.fail(function (err) {
			console.log(err);
		});
}, 300);

function debounce(func, wait, immediate) {
	var timeout;
	return function () {
		var context = this,
			args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}
// var countries = new Bloodhound({
// 	datumTokenizer: Bloodhound.tokenizers.whitespace,
// 	queryTokenizer: Bloodhound.tokenizers.whitespace,
// 	// url points to a json file that contains an array of country names, see
// 	// https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
// 	// "https://raw.githubusercontent.com/twitter/typeahead.js/gh-pages/data/countries.json",

// 	prefetch: "/artisansList",
// });
// console.log();

// // passing in `null` for the `options` arguments will result in the default
// // options being used
// $("#prefetch .typeahead").typeahead(null, {
// 	name: "countries",
// 	source: countries,
// });
