import {
	backend_url_base, 
	timeout_status_opacity, 
	timeout_status_clear
} from './_global_params.js'

import build_html_method from './build_html.js'

const send_comment_method = (e, mode) => {
	e.preventDefault()
	const form_tag = e.currentTarget
	const root_tag = form_tag.closest(".scope-block")
	const input_author_tag = root_tag.querySelector(".input_author")
	const textarea_msg_tag = root_tag.querySelector(".textarea_msg")
	const btn_submit_tag = root_tag.querySelector(".submit")
	const btn_edit_tag = root_tag.querySelector(".comment__btn-edit")
	const btn_reply_tag = root_tag.querySelector(".comment__btn-reply")
	const status_holder_tag = root_tag.querySelector(".status-holder")
	
	status_holder_tag.innerHTML = ""
	const status_tag = document.createElement("span")
	status_tag.classList.add("status")
	status_tag.textContent = "...sending..."
	status_holder_tag.append(status_tag)
	
	const payload = new FormData(form_tag)
	payload.append("time", new Date().getTime().toString())
	if (!payload.get("comment_author").trim().length) {
		payload.set("comment_author", "anonimus")
	}
	
	if (!payload.has("comment_id")) {
		payload.set("comment_id", "")
	}
	
	//for debug
	/*payload.forEach((item, key) => {
		console.log(`payload key: ${key}`)
		console.log(`payload value: ${item}`)
	})*/
	
	btn_submit_tag.disabled = true
	
	const ctrls_tags_list = [
		input_author_tag,
		textarea_msg_tag,
		btn_reply_tag ? btn_reply_tag : null,
		btn_edit_tag ? btn_edit_tag : null
	]
	ctrls_tags_list.forEach(tag => tag ? tag.disabled = true : null)
	
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
				status_tag.classList.add("status_sus")
				status_tag.textContent = "comment sent successfully"
				
				const output_data = {
					id: data.id,
					author: payload.get("comment_author"),
					body: payload.get("comment_value"),
					owner: payload.get("comment_id"),
					time: payload.get("time"),
				}
				
				if (mode.mode === "primary") {
					build_html_method(output_data, 1, null, true)
					form_tag.scrollIntoView({
						behavior: 'smooth'
					});
				}
				
				if (mode.mode === "tree") {
					build_html_method(output_data, parseInt(payload.get("comment_depth")) + 1, payload.get("comment_id"), true)
					root_tag.classList.remove("comment__inner_expanded")
				}
				
				[input_author_tag, textarea_msg_tag].forEach((tag) => {
					tag.value = ""
				})
				
				setTimeout(() => {
					status_tag.style.opacity = 0
				}, timeout_status_opacity)
				
				setTimeout(() => {
					status_tag.classList.remove("status_sus")
					status_tag.textContent = ""
				}, timeout_status_clear)
				
				return
			}
			
			throw new Error(data.error)
		})
		.catch((err) => {
			console.error(err)
			status_tag.classList.add("status_err")
			status_tag.textContent = err
			
			setTimeout(() => {
				status_tag.style.opacity = 0
			}, timeout_status_opacity)
			
			setTimeout(() => {
				status_tag.classList.remove("status_err")
				status_tag.textContent = ""
			}, timeout_status_clear)
		})
		.finally(() => {
			ctrls_tags_list.forEach(tag => tag ? tag.disabled = false : null)
		})
}

export default send_comment_method