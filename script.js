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
		time: 1653700000000,
		author: "Вася",
	},
	{
		id: 5,
		owner: 2,
		body: "Ответ на первый коммент",
		time: 1653702002000,
		author: "Петя",
	},
	{
		id: 10,
		owner: 2,
		body: "Тоже Ответ на первый коммент",
		time: 1653702010000,
		author: "Димон",
	},
	{
		id: 11,
		owner: 2,
		body: "Тоже Ответ на первый коммент",
		time: 1653702020000,
		author: "Колян",
	},
	{
		id: 6,
		owner: 5,
		body: "Ответ на Ответ на первый коммент",
		time: 1653703000000,
		author: "Вася",
	},
	{
		id: 20,
		owner: 6,
		body: "Ответ на Ответ на Ответ на Ответ на первый коммент",
		time: 1653704000000,
		author: "Люся",
	},
	{
		id: 21,
		owner: 6,
		body: "Тоже Ответ на Ответ на Ответ на Ответ на первый коммент (Время не соответствует порядку комента в базе)",
		time: 1653703000000,
		author: "Люся",
	},
	{
		id: 40,
		owner: 20,
		body: "Ответ на Ответ на Ответ на Ответ на Ответ на первый коммент",
		time: 1653705000000,
		author: "John",
	},
	{
		id: 3,
		owner: 1,
		body: "Второй коммент",
		time: 1653701000000,
		author: "Гоги",
	},
	{
		id: 4,
		owner: 1,
		body: "Третий коммент",
		time: 1653702000000,
		author: "Вова",
	},
	{
		id: 30,
		owner: 3,
		body: "Ответ на второй коммент",
		time: 1653702001000,
		author: "Леня",
	},
	{
		id: 50,
		owner: 1,
		body: "Ответ из другого часового пояса (Время не соответствует порядку комента в базе)",
		time: 1651000000000,
		author: "Вася",
	},
]

comments.sort((a, b) => a.time - b.time);

const comments_tag = document.querySelector("#comments")
const form_main_tag = document.querySelector("#form-main")
const form_main_submit_tag = document.querySelector("#form-main_submit")
let queue = [comments[0].id]
const max_depth = 6

let temp_id = 1000

form_main_tag.addEventListener("submit", (e) => {
	send_comment_func(e, {mode: "primary"})
})

//TODO: send_comment_func
const send_comment_func = (e, mode) => {
	e.preventDefault()
	//console.log(e)
	const form_tag = e.currentTarget
	const details_tag = form_tag.closest(".comment").querySelector(".comment__details")
	const status_tag = form_tag.closest(".comment").querySelector(".comment__status")
	const input_tags = form_tag.querySelectorAll(".comment__input")
	
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
		author: payload_for_output.comment_author ? payload_for_output.comment_author : "anonimus",
		body: payload_for_output.comment_value,
		id: temp_id++,
		owner: mode.mode === "primary" ? 1 : payload_for_output.comment_owner,
		time: new Date().getTime(),
	}
	
	const send_data = new Promise((resolve, reject) => {
		return setTimeout(() => {
			resolve(200)
			//reject(new Error("failed while sending"))
		}, 2000)
	})
	
	send_data
		.then((data) => {
			//console.log(`sending data: ${data}`)
			
			status_tag.classList.add("comment__status_sus")
			status_tag.textContent = "commend send successfully"
			
			if (mode.mode === "primary") {
				build_html_func(data_for_output, 1, 1, mode)
			}
			
			if (mode.mode === "tree") {
				//console.log(payload_for_output.comment_owner_depth)
				build_html_func(data_for_output, parseInt(payload_for_output.comment_owner_depth) + 1, payload_for_output.comment_owner, mode)
			}
			
			input_tags.forEach((tag => {
				tag.value = ""
			}))
			
			setTimeout(() => {
				status_tag.style.opacity = 0
			}, 2000)
			setTimeout(() => {
				details_tag.open = false
				status_tag.classList.remove("comment__status_sus")
				status_tag.textContent = ""
			}, 3000)
		})
		.catch((err) => {
			console.error(err)
			status_tag.classList.add("comment__status_err")
			status_tag.textContent = err
			setTimeout(() => {
				status_tag.style.opacity = 0
			}, 2000)
			setTimeout(() => {
				status_tag.classList.remove("comment__status_err")
				status_tag.textContent = ""
			}, 3000)
		})
}

// TODO: build_html_func
const build_html_func = (obj, depth, owner_id = comments[0].id, mode) => {
	const template_tag_content = document.querySelector("#template_comments").content.cloneNode(true)
	
	console.log(depth)
	
	const tags_list = [
		".comment",
		".comment__id",
		".comment__author",
		".comment__time",
		".comment__details",
		".comment__form",
		".comment__input",
		".comment__submit",
		".comment__body",
		"[name='comment_owner']",
		"[name='comment_owner_depth']",
	]
	
	const [
		template_tag_content_root,
		template_tag_content_id,
		template_tag_content_author,
		template_tag_content_time,
		template_tag_content_details,
		template_tag_content_form,
		template_tag_content_input,
		template_tag_content_submit,
		template_tag_content_body,
		template_tag_content_h_owner,
		template_tag_content_h_owner_depth] = tags_list.map(tag => {
		return template_tag_content.querySelector(tag)
	})
	
	template_tag_content_id.textContent = `${obj.id} --- depth: ${depth}` //service for testing
	//template_tag_content_id.textContent = obj.id
	template_tag_content_author.textContent = obj.author
	template_tag_content_time.setAttribute("data-timestamp", obj.time)
	template_tag_content_time.textContent = new Date(obj.time).toLocaleString()
	template_tag_content_body.textContent = obj.body
	template_tag_content_author.textContent = obj.author
	template_tag_content_h_owner.value = obj.id
	template_tag_content_h_owner_depth.value = depth
	template_tag_content_root.id = `comment_${obj.id}`
	template_tag_content_root.classList.add(`comment_depth_${depth}`)
	template_tag_content_form.id = `form_id_${obj.id}`
	
	if (depth >= max_depth) {
		template_tag_content_details.remove()
	} else {
		template_tag_content_form.addEventListener("submit",
			(e) => {
				send_comment_func(e, {mode: "tree"})
			}
		)
	}
	
	template_tag_content_root.setAttribute("data-owner", owner_id)
	
	if (mode.mode === "page_loading") {
		//console.info("page_loading")
		comments_tag.appendChild(template_tag_content)
	}
	
	if (mode.mode === "primary") {
		//console.info("primary")
		comments_tag.appendChild(template_tag_content)
		template_tag_content_root.classList.add("comment_new")
		
		setTimeout(() => {
			template_tag_content_root.classList.remove("comment_new")
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
		
		template_tag_content_root.classList.add("comment_new")
		
		setTimeout(() => {
			template_tag_content_root.classList.remove("comment_new")
		}, 5000)
	}
}

// TODO: make_tree_func
const make_tree_func = (obj) => {
	while (true) {
		let last_in_queue = queue[queue.length - 1]
		let nested_comments = obj.filter(item => item.owner === last_in_queue)
		
		//console.log(queue.length)
		//console.log(queue.length < max_depth)
		
		if (nested_comments.length) {
			let current = nested_comments[0]
			
			build_html_func(current, queue.length, last_in_queue, {mode: "page_loading"})
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
		comments_tag.classList.add("comment__status_err")
		comments_tag.textContent = err
		console.error(err)
	})
