import {comments_tag, backend_url_base} from './modules/global_vars.js'
import make_tree_func from './modules/make_tree.js'
import send_comment_func from './modules/send_comment.js'

const form_main_tag = document.querySelector("#form-main")

form_main_tag.addEventListener("submit", (e) => {
	send_comment_func(e, {mode: "primary"})
})

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
		if (data.comments) {
			comments_tag.removeChild(status_tag)
			make_tree_func(data.comments)
			return
		}
		throw new Error(data.error)
	})
	.catch((err) => {
		console.error(err)
		status_tag.classList.add("status_err")
		status_tag.textContent = err
	})