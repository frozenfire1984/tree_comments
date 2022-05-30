import {comments} from './modules/demo_data.js'
import {comments_tag} from './modules/global_vars.js'
import {make_tree_func} from './modules/make_tree.js'
import {send_comment_func} from './modules/send_comment.js'

comments.sort((a, b) => a.time - b.time);

const form_main_tag = document.querySelector("#form-main")

form_main_tag.addEventListener("submit", (e) => {
	send_comment_func(e, {mode: "primary"})
})

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
