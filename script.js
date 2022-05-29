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

let temp_id = 1000

form_main_tag.addEventListener("submit", (e) => {
	send_comment_func(e, {mode: "primary"})
})

//TODO: send_comment_func
const send_comment_func = (e, mode) => {
	e.preventDefault()
	//console.log(e)
	const form_tag = e.currentTarget
	const status_tag = form_tag.querySelector(".comment__status")
	const input_tag = form_tag.querySelector(".comment__input")
	status_tag.style.removeProperty("opacity")
	status_tag.textContent = "...sending..."
	
	const payload = new FormData(form_tag)
	/*payload.forEach((item, key) => {
		console.log(`payload key: ${key}`)
		console.log(`payload value: ${item}`)
	})*/
	
	const payload_for_output = {}
	for (let pair of payload.entries()) {
		payload_for_output[pair[0]] = pair[1]
	}
	//console.log(payload_for_output)
	
	const data_for_output = {
		author: "Test user",
		body: payload_for_output.comment_value,
		id: temp_id++,
		owner: mode.mode === "primary" ? 1 : payload_for_output.comment_owner,
		time: new Date(),
	}
	
	const send_data = new Promise((resolve, reject) => {
		return setTimeout(() => {
			resolve(200)
			//reject(new Error("failed while sending"))
		}, 2000)
	})
	
	send_data
		.then((data) => {
			console.log(`sending data: ${data}`)
			status_tag.style.color = "green"
			status_tag.textContent = "commend send successfully"
			
			if (mode.mode === "primary") {
				build_html_func(data_for_output, 1, true, 1, mode)
			}
			
			if (mode.mode === "tree") {
				build_html_func(data_for_output, parseInt(payload_for_output.comment_owner_deep) + 1, parseInt(payload_for_output.comment_owner_deep) < max_deep, payload_for_output.comment_owner, mode)
			}
			
			input_tag.value = null
			
			setTimeout(() => {
				status_tag.style.opacity = 0
			}, 2000)
			setTimeout(() => {
				status_tag.style.color = null
				status_tag.textContent = ""
			}, 3000)
		})
		.catch((err) => {
			console.error(err)
			status_tag.style.color = "#f00"
			status_tag.textContent = err
			setTimeout(() => {
				status_tag.style.opacity = 0
			}, 2000)
			setTimeout(() => {
				status_tag.style.color = null
				status_tag.textContent = ""
			}, 3000)
		})
	
}

// TODO: build_html_func
const build_html_func = (obj, deep, send_permission, owner_id = comments[0].id, mode) => {
	const template_tag_content = document.querySelector("#template_comments").content.cloneNode(true)
	
	const tags_list = [
		".comment",
		".comment__id",
		".comment__author",
		".comment__time",
		".comment__form",
		".comment__input",
		".comment__submit",
		".comment__body",
		"[name='comment_owner']",
		"[name='comment_owner_deep']",
	]
	
	const [
		template_tag_content_root,
		template_tag_content_id,
		template_tag_content_author,
		template_tag_content_time,
		template_tag_content_form,
		template_tag_content_input,
		template_tag_content_submit,
		template_tag_content_body,
		template_tag_content_h_owner,
		template_tag_content_h_owner_deep] = tags_list.map(tag => {
		return template_tag_content.querySelector(tag)
	})
	
	template_tag_content_id.textContent = obj.id
	template_tag_content_author.textContent = obj.author
	template_tag_content_time.textContent = obj.time
	template_tag_content_body.textContent = obj.body
	template_tag_content_author.textContent = obj.author
	template_tag_content_h_owner.value = obj.id
	template_tag_content_h_owner_deep.value = deep
	template_tag_content_root.id = `comment_${obj.id}`
	template_tag_content_root.classList.add(`comment_deep_${deep}`)
	template_tag_content_form.id = `form_id_${obj.id}`
	
	if (send_permission) {
		template_tag_content_form.addEventListener("submit",
			(e) => {
				send_comment_func(e, {mode: "tree"})
			}
		)
	}
	
	if (!send_permission) {
		template_tag_content_input.disabled = true
		template_tag_content_submit.disabled = true
	}
	template_tag_content_root.setAttribute("data-owner", owner_id)
	
	if (mode.mode === "page_loading") {
		//console.info("page_loading")
		comments_tag.appendChild(template_tag_content)
	}
	
	if (mode.mode === "primary") {
		//console.info("primary")
		comments_tag.appendChild(template_tag_content)
		
		const color = "#04a400"
		template_tag_content_root.style.borderColor = color
		template_tag_content_root.style.boxShadow = `inset ${color} 0 0 3px 3px`
		
		setTimeout(() => {
			template_tag_content_root.style.borderColor = ''
			template_tag_content_root.style.boxShadow = ''
		}, 5000)
	}
	
	if (mode.mode === "tree") {
		const nested_tags = document.querySelectorAll(`[data-owner='${owner_id}']`)
		if (nested_tags.length) {
			const last_nested_tags = nested_tags[nested_tags.length - 1]
			last_nested_tags.after(template_tag_content)
		} else {
			const owner_tag = document.querySelector(`#comment_${owner_id}`)
			owner_tag.after(template_tag_content)
		}
		
		const color = "#04a400"
		template_tag_content_root.style.borderColor = color
		template_tag_content_root.style.boxShadow = `inset ${color} 0 0 3px 3px`
		
		setTimeout(() => {
			template_tag_content_root.style.borderColor = ''
			template_tag_content_root.style.boxShadow = ''
		}, 5000)
	}
}

// TODO: make_tree_func
const make_tree_func = (obj) => {
	while (true) {
		let last_in_queue = queue[queue.length - 1]
		let nested_comments = obj.filter(item => item.owner === last_in_queue)
		
		if (nested_comments.length) {
			let current = nested_comments[0]
			const send_permission = queue.length - 1 < max_deep
			//console.log(current)
			build_html_func(current, queue.length, send_permission, last_in_queue, {mode: "page_loading"})
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
const get_data = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve(comments)
		//reject(new Error("fetch error"))
	},500)
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
		console.error(err)
	})
