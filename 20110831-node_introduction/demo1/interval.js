var i = 1;
setInterval(function() {
	if (i === 5) clearInterval(this);
	console.log(i + '!');
	i++;
}, 1000);

console.log('Lets count to 5');
