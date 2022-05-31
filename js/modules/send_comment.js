import {backend_url_base} from './global_vars.js'
import {build_html_func} from './build_html.js'

//let temp_id = 1000 //for demo data testing

export const send_comment_func = (e, mode) => {
	e.preventDefault()
	
	const form_tag = e.currentTarget
	
	let status_tag = null
	
	if (mode.mode === "tree") {
		status_tag = form_tag.closest(".comment").querySelector(".comment__status")
	} else {
		status_tag = form_tag.closest(".primary-form").querySelector(".comment__status")
	}
	
	const input_tags = form_tag.querySelectorAll(".comment__input")
	
	status_tag.style.removeProperty("opacity")
	status_tag.textContent = "...sending..."
	
	const payload = new FormData(form_tag)
	payload.append("time", new Date().getTime().toString())
	if (!payload.get("comment_author").trim().length) {
		payload.set("comment_author", "anonimus")
	}
	
	if (!payload.has("comment_owner")) {
		payload.set("comment_owner", "")
	}
	
	payload.forEach((item, key) => {
		console.log(`payload key: ${key}`)
		console.log(`payload value: ${item}`)
	})
	
	const send_data = fetch(`${backend_url_base}/insert.php`, {
			method: "POST",
			body: payload
	})
	
	send_data
		.then(resp => {
			return new Promise((resolve, reject) => {
				resp.json()
				.then((data) => resolve(data))
				.catch((err) => reject(new Error("error while json parsing!")))
			})
		})
		.then((data) => {
			if (data.id) {
				status_tag.classList.add("comment__status_sus")
				status_tag.textContent = "commend send successfully"
				
				const data_for_output = {
					id: data.id,
					author: payload.get("comment_author"),
					body: payload.get("comment_value"),
					owner: payload.get("comment_owner"),
					time: payload.get("time"),
				}
				
				if (mode.mode === "primary") {
					build_html_func(data_for_output, 1, null, true)
				}
				
				if (mode.mode === "tree") {
					build_html_func(data_for_output, parseInt(payload.get("comment_owner_depth")) + 1, payload.get("comment_owner"), true)
				}
				
				input_tags.forEach((tag) => {
					tag.value = ""
				})
				
				setTimeout(() => {
					status_tag.style.opacity = 0
				}, 2000)
				setTimeout(() => {
					
					status_tag.classList.remove("comment__status_sus")
					status_tag.textContent = ""
				}, 3000)
				return
			}
			
			throw new Error(data.error)
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
	
	/*simulate fetch from server api*/
	/*const send_data = new Promise((resolve, reject) => {
		return setTimeout(() => {
			resolve(temp_id++)
			//reject(new Error("failed while sending"))
		}, 2000)
	})
	
	send_data
	.then((data) => {
		//console.log(`sending data: ${data}`)
		
		status_tag.classList.add("comment__status_sus")
		status_tag.textContent = "commend send successfully"
		
		const data_for_output = {
			id: data,
			author: payload.get("comment_author"),
			body: payload.get("comment_value"),
			owner: payload.get("comment_owner"),
			time: payload.get("time"),
		}
		
		console.log(data_for_output)
		
		if (mode.mode === "primary") {
			build_html_func(data_for_output, 1, null, true)
		}
		
		if (mode.mode === "tree") {
			build_html_func(data_for_output, parseInt(payload.get("comment_owner_depth")) + 1, payload.get("comment_owner"), true)
		}
		
		input_tags.forEach((tag => {
			tag.value = ""
		}))
		
		setTimeout(() => {
			status_tag.style.opacity = 0
		}, 2000)
		setTimeout(() => {
			/!*if (mode.mode === "tree") {
				const details_tag = form_tag.closest(".comment").querySelector(".comment__details")
				details_tag.open = false
			}*!/
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
	})*/
}