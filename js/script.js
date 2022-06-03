import {
	backend_url_base,
	max_length_letters_author,
	max_length_letters_comment,
	testing
} from './modules/_global_params.js'

import make_tree_method from './modules/make_tree.js'
import send_comment_method from './modules/send_comment.js'
import {autocomplete_textarea_method} from './modules/_testing_utils.js'

const output_tag = document.querySelector("#comments")
const form_main_tag = document.querySelector("#form-main")
const input_author_tag = form_main_tag.querySelector(".input_author")
const textarea_msg_tag = form_main_tag.querySelector(".textarea_msg")
const btn_submit_tag = form_main_tag.querySelector(".submit")

const status_tag = document.createElement("div")
status_tag.classList.add("status")
status_tag.textContent = "...loading..."
output_tag.append(status_tag)

form_main_tag.addEventListener("submit", (e) => {
	send_comment_method(e, {mode: "primary"})
})

if (testing) {
	//this use for fast complete text inputs for testing
	input_author_tag.setAttribute("list", "testing_datalist")
	
	//this use for fast complete textareas for testing
	textarea_msg_tag.addEventListener("focus",
		(e) => {
			autocomplete_textarea_method(e)
		}
	)
}

const toggle_disable_submit_method = (e) => {
	btn_submit_tag.disabled = !e.currentTarget.value.length;
}

textarea_msg_tag.addEventListener("input", (e) => {
	toggle_disable_submit_method(e)
})

textarea_msg_tag.addEventListener("focus", (e) => {
	toggle_disable_submit_method(e)
})

input_author_tag.setAttribute("maxlength", max_length_letters_author)
textarea_msg_tag.setAttribute("maxlength", max_length_letters_comment)

const ctrls_tags_list = [input_author_tag, textarea_msg_tag, !btn_submit_tag.disabled ? btn_submit_tag : null]
ctrls_tags_list.forEach(tag => tag ? tag.disabled = true : null)

const get_data = fetch(`${backend_url_base}/get.php`)

get_data
	.then(resp => {
		return new Promise((resolve, reject) => {
			resp.json()
			.then((data) => resolve(data))
			.catch((err) => reject(new Error("error while json parsing!")))
		})
	})
	.then((data) => {
		if (data.comments && !data.comments.length) {
			status_tag.textContent = "this article don't have comments!"
			return;
		}
		
		if (data.comments) {
			output_tag.removeChild(status_tag)
			make_tree_method(data.comments)
			return
		}
		throw new Error(data.error)
	})
	.catch((err) => {
		console.error(err)
		status_tag.classList.add("status_err")
		status_tag.textContent = err
	})
	.finally(() => {
		ctrls_tags_list.forEach(tag => tag ? tag.disabled = false: null)
		
	})