import {build_html_func} from './build_html.js'

let temp_id = 1000

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
	/*payload.forEach((item, key) => {
		console.log(`payload key: ${key}`)
		console.log(`payload value: ${item}`)
	})*/
	
	const payload_for_output = {}
	for (let pair of payload.entries()) {
		payload_for_output[pair[0]] = pair[1]
	}
	
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
			
			if (mode.mode === "tree") {
				const details_tag = form_tag.closest(".comment").querySelector(".comment__details")
				details_tag.open = false
			}
			
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