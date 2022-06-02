import {comments_tag, backend_url_base, timeout_status_opacity, timeout_status_clear} from './_global_params.js'
import build_html_func from './build_html.js'

const send_comment_func = (e, mode) => {
	e.preventDefault()
	
	const form_tag = e.currentTarget
	const input_author_tag = form_tag.querySelector(".input_author")
	const input_comment_tag = form_tag.querySelector(".input_body")
	const btn_submit_tag = form_tag.querySelector(".submit")
	let status_tag
	
	if (mode.mode === "tree") {
		status_tag = form_tag.closest(".comment").querySelector(".status")
	} else {
		status_tag = form_tag.closest(".form-wrapper").querySelector(".status")
	}
	
	const input_tags = form_tag.querySelectorAll(".input")
	
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
	
	//for debug
	/*payload.forEach((item, key) => {
		console.log(`payload key: ${key}`)
		console.log(`payload value: ${item}`)
	})*/
	
	input_author_tag.disabled = true
	input_comment_tag.disabled = true
	btn_submit_tag.disabled = true
	
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
				
				input_author_tag.disabled = false
				input_comment_tag.disabled = false
				btn_submit_tag.disabled = false
				
				const data_for_output = {
					id: data.id,
					author: payload.get("comment_author"),
					body: payload.get("comment_value"),
					owner: payload.get("comment_owner"),
					time: payload.get("time"),
				}
				
				if (mode.mode === "primary") {
					if (comments_tag.querySelector(":scope > .status")) {
						comments_tag.querySelector(":scope > .status").remove()
					}
					build_html_func(data_for_output, 1, null, true)
					form_tag.scrollIntoView({
						behavior: 'smooth'
					});
				}
				
				if (mode.mode === "tree") {
					build_html_func(data_for_output, parseInt(payload.get("comment_owner_depth")) + 1, payload.get("comment_owner"), true)
				}
				
				input_tags.forEach((tag) => {
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
			input_author_tag.disabled = false
			input_comment_tag.disabled = false
			btn_submit_tag.disabled = false
			
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
}

export default send_comment_func