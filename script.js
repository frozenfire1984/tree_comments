/*demo data*/
let comments = [
	{
		id: 1,
		owner: null,
		body: "root",
		time: 0,
		author: "root",
	},
	{
		id: 2,
		owner: 1,
		body: "Первый коммент",
		time: 100,
		author: "Вася",
	},
	{
		id: 5,
		owner: 2,
		body: "Ответ на первый коммент",
		time: 110,
		author: "Петя",
	},
	{
		id: 10,
		owner: 2,
		body: "Тоже Ответ на первый коммент",
		time: 115,
		author: "Димон",
	},
	{
		id: 11,
		owner: 2,
		body: "Тоже Ответ на первый коммент",
		time: 120,
		author: "Колян",
	},
	{
		id: 6,
		owner: 5,
		body: "Ответ на Ответ на первый коммент",
		time: 111,
		author: "Вася",
	},
	{
		id: 20,
		owner: 6,
		body: "Ответ на Ответ на Ответ на Ответ на первый коммент",
		time: 200,
		author: "Люся",
	},
	{
		id: 40,
		owner: 20,
		body: "Ответ на Ответ на Ответ на Ответ на Ответ на первый коммент",
		time: 220,
		author: "John",
	},
	{
		id: 3,
		owner: 1,
		body: "Второй коммент",
		time: 101,
		author: "Гоги",
	},
	{
		id: 4,
		owner: 1,
		body: "Третий коммент",
		time: 102,
		author: "Вова",
	},
	{
		id: 30,
		owner: 3,
		body: "Ответ на второй коммент",
		time: 300,
		author: "Леня",
	},
]

const comments_tag = document.querySelector("#comments")
const form_main_tag = document.querySelector("#form-main")
const form_main_submit_tag = document.querySelector("#form-main_submit")
let queue = [comments[0].id]
const max_deep = 4

const send_comment_func = (e) => {
	e.preventDefault()
	const payload = new FormData(e.currentTarget)
	payload.forEach((item, key) => {
		console.log(key)
		console.log(item)
	})
}

form_main_tag.addEventListener("submit", send_comment_func)

const build_html_func = (obj, deep, enable_send_status, owner_id = comments[0].id) => {
	const template_tag_content = document.querySelector("#template_comments").content.cloneNode(true)
	const template_tag_content_root =  template_tag_content.querySelector(".comment")
	const template_tag_content_id =  template_tag_content.querySelector(".comment__id")
	const template_tag_content_author =  template_tag_content.querySelector(".comment__author")
	const template_tag_content_time =  template_tag_content.querySelector(".comment__time")
	const template_tag_content_form =  template_tag_content.querySelector(".comment__form")
	const template_tag_content_input =  template_tag_content.querySelector(".comment__input")
	const template_tag_content_submit =  template_tag_content.querySelector(".comment__submit")
	const template_tag_content_body =  template_tag_content.querySelector(".comment__body")
	const template_tag_content_owner =  template_tag_content.querySelector(".comment__owner")
	
	template_tag_content_id.textContent = obj.id
	template_tag_content_author.textContent = obj.author
	template_tag_content_time.textContent = obj.time
	template_tag_content_body.textContent = obj.body
	template_tag_content_author.textContent = obj.author
	template_tag_content_owner.value = obj.id
	template_tag_content_root.classList.add(`comment_deep_${deep}`)
	
	template_tag_content_form.id = `form_id_${obj.id}`
	
	if (enable_send_status) {
		template_tag_content_form.addEventListener("submit", send_comment_func)
	}
	
	if (!enable_send_status) {
		template_tag_content_input.disabled = true
		template_tag_content_submit.disabled = true
	}
	template_tag_content_root.setAttribute("data-owner", owner_id)
	comments_tag.appendChild(template_tag_content)
}

const make_tree_func = (obj) => {
	while (true) {
		let last_in_queue = queue[queue.length - 1]
		let nested_comments = obj.filter(item => item.owner === last_in_queue)
		
		if (nested_comments.length) {
			let current = nested_comments[0]
			build_html_func(current, queue.length, queue.length - 1 < max_deep, last_in_queue)
			queue.push(current.id)
			//comments.splice(comments.findIndex(item => item.id === current.id), 1)
			obj = obj.filter(item => item.id !== current.id)
			
		} else {
			queue.pop()
		}
		
		if (obj.length === 1) {
			break
		}
	}
}

/*simulate fetch from server api*/
comments_tag.textContent = "...loading..."
let get_data = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(comments)
		//reject(new Error("fetch error"))
	},2000)
})

get_data
	.then((data) => {
		//console.log(data)
		comments_tag.textContent = ""
		make_tree_func(data)
	})
	.catch((err) => {
		comments_tag.style.color = "red"
		comments_tag.textContent = err
		console.log(err)
	})
