const toCurrency = price => {
	return new Intl.NumberFormat('ru-RU', {
		currency: 'USD',
		style: 'currency'
	}).format(parseInt(price));
}

document.querySelectorAll('#card .price span, #card .all-price span, .row .price span, .order .price span').forEach( node => {
	node.textContent = toCurrency(node.textContent);
});

const $card = document.querySelector("#card");

if ($card) {
	$card.addEventListener('click', function(e) {
		if(event.target.classList.contains("js-remove")) {
			const id = event.target.dataset.id;
			const csrf = event.target.dataset.csrf;
			
			fetch("/card/remove/" + id, {
				method: "delete",
				headers: {
					"X-XSRF-TOKEN": csrf
				}
			}).then( res => res.json())
				.then(card => {
					if(card.courses.length) {
						const html = card.courses.map( c => {
							return `
							<div class="main">
								<div class="image">
									<img src="${c.image}" alt="${c.title}">
								</div>
								<div class="course-title">
									${c.title}
								</div>
								<div class="price">
									<div class="count">Count: ${c.count}</div>
									<div>
										Price: <span>${toCurrency(c.price)}</span> 
									</div>
								</div>
								<button class="btn btm-primary cart-btn js-remove" data-id="${c.id}" data-csrf="${csrf}">Delete</button>
							</div>
							`
						}).join("");

						document.querySelectorAll(".main").forEach(el => el.remove());

						$card.insertAdjacentHTML('afterbegin', html);
						$card.querySelector(".all-price").innerHTML = toCurrency(card.price);
					} 
					else {
						$card.innerHTML = "<p>Cart is empty!</p>"
					}
				})
		}
	})
}

M.Tabs.init(document.querySelectorAll(".tabs"));
