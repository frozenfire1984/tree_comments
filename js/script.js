import {comments_tag, backend_url_base, max_length_letters_author, max_length_letters_comment, testing} from './modules/_global_params.js'
import make_tree_func from './modules/make_tree.js'
import send_comment_func from './modules/send_comment.js'
import {autocomplete_textarea_func} from './modules/_testing_utils.js'

const form_main_tag = document.querySelector("#form-main")
const input_author_tag = form_main_tag.querySelector(".input_author")
const input_comment_tag = form_main_tag.querySelector(".input_body")
const btn_submit_tag = form_main_tag.querySelector(".submit")

form_main_tag.addEventListener("submit", (e) => {
	send_comment_func(e, {mode: "primary"})
})

input_author_tag.setAttribute("maxlength", max_length_letters_author)
input_comment_tag.setAttribute("maxlength", max_length_letters_comment)

input_author_tag.disabled = true
input_comment_tag.disabled = true
btn_submit_tag.disabled = true

if (testing) {
	//this use for fast complete text inputs for testing
	input_author_tag.setAttribute("list", "testing_datalist")
	
	//this use for fast complete textareas for testing
	input_comment_tag.addEventListener("focus",
		(e) => {
			autocomplete_textarea_func(e)
		}
	)
}

const status_tag = document.createElement("div")
status_tag.classList.add("status")
status_tag.textContent = "...loading..."
comments_tag.append(status_tag)
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
		input_author_tag.disabled = false
		input_comment_tag.disabled = false
		btn_submit_tag.disabled = false
		
		if (data.comments && !data.comments.length) {
			status_tag.textContent = "this article don't have comments!"
			return;
		}
		
		if (data.comments) {
			comments_tag.removeChild(status_tag)
			make_tree_func(data.comments)
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
	})