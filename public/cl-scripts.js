document.querySelectorAll('.price span').forEach( node => {
	console.log(node.textContent)
	node.textContent = new Intl.NumberFormat('ru-RU', {
		currency: 'USD',
		style: 'currency'
	}).format(parseInt(node.textContent));
});