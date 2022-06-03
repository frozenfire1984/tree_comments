//this script using for fast complete textareas for testing
const autocomplete_textarea_method = (e) => {
	const array_phrases = [
		"Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
		"Delectus deserunt est, illo iste nemo reprehenderit saepe vero voluptates?",
		"Ad aut commodi distinctio, magni numquam omnis quod ratione unde voluptate!",
		"Atque distinctio earum, fugiat in laborum libero quis saepe.",
		"Eaque iure iusto maiores molestiae officia rerum voluptates?",
		"A nulla optio pariatur recusandae soluta temporibus?",
		"At excepturi expedita officia saepe suscipit!",
		"A, aperiam, aspernatur distinctio ducimus esse facilis incidunt, iusto natus neque numquam officia perferendis quaequis reiciendis reprehenderit soluta veritatis.",
		"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus deserunt est, illo iste nemo reprehenderit saepe vero voluptates? Ad aut commodi distinctio, magni numquam omnis quod ratione unde voluptate! Pariatur! Atque distinctio earum, fugiat in laborum libero quis saepe. Eaque iure iusto maiores molestiae officia rerum voluptates? A nulla optio pariatur recusandae soluta temporibus? At excepturi expedita officia saepe suscipit!"
	]
	
	const random = Math.floor(Math.random() * array_phrases.length)
	e.currentTarget.value = array_phrases[random]
}

//this script using for fast update textareas while edit comment for testing
const update_textarea_method = (e) => {
	e.currentTarget.value = `${e.currentTarget.value} updated`
}

export {autocomplete_textarea_method, update_textarea_method}