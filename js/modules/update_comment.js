import {
	backend_url_base,
	timeout_comment_highlight,
	timeout_status_opacity,
	timeout_status_clear
} from "./_global_params.js";

const update_comment_fun = (e) => {
	e.preventDefault()
	const form_tag = e.currentTarget
	const body_tag = form_tag.querySelector(".comment__body")
	const btn_edit_tag = form_tag.querySelector(".comment__btn-edit")
	const textarea_edit_tag = form_tag.querySelector(".comment__input-edit")
	const btn_update_tag = form_tag.querySelector(".comment__btn-update")
	const root_tag = form_tag.closest(".comment")
	const root_inner_tag = root_tag.querySelector(".comment__inner")
	const status_tag = root_tag.querySelector(".status")
	const edited_status_tag = root_tag.querySelector(".comment__edited-status")
	
	const payload = new FormData(form_tag)
	payload.append("time_updated", new Date().getTime().toString())
	
	//for debug
	/*payload.forEach((item, key) => {
		console.log(`payload key: ${key}`)
		console.log(`payload value: ${item}`)
	})*/
	
	status_tag.style.removeProperty("opacity")
	status_tag.textContent = "...updating..."
	
	const ctrls_tags_list = [btn_edit_tag, textarea_edit_tag, btn_update_tag]
	ctrls_tags_list.forEach(tag => tag.disabled = true)
	
	const send_data = fetch(`${backend_url_base}/update.php`, {
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
	.then(data => {
		if (data.result) {
			status_tag.classList.add("status_upd")
			status_tag.textContent = "comment updated successfully"
			body_tag.textContent = payload.get("comment_value_editing").toString()
			edited_status_tag.textContent = `edited ${new Date(parseInt(payload.get("time_updated"))).toLocaleString()}`
			form_tag.classList.remove("comment__form-edit_editing")
			
			root_inner_tag.classList.add("comment__inner_updated")
			setTimeout(() => {
				root_inner_tag.classList.remove("comment__inner_updated")
			}, timeout_comment_highlight)
			
			setTimeout(() => {
				status_tag.style.opacity = 0
			}, timeout_status_opacity)
			
			setTimeout(() => {
				status_tag.classList.remove("status_upd")
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
		
		root_inner_tag.classList.add("comment__inner_error")
		setTimeout(() => {
			root_inner_tag.classList.remove("comment__inner_error")
		}, timeout_comment_highlight)
		
		setTimeout(() => {
			status_tag.style.opacity = 0
		}, timeout_status_opacity)
		
		setTimeout(() => {
			status_tag.classList.remove("status_err")
			status_tag.textContent = ""
		}, timeout_status_clear)
	})
	.finally(() => {
		ctrls_tags_list.forEach(tag => tag.disabled = false)
	})
}

export default update_comment_fun