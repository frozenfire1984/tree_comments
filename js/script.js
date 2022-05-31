import {comments_tag, backend_url_base} from './modules/global_vars.js'
import {make_tree_func} from './modules/make_tree.js'
import {send_comment_func} from './modules/send_comment.js'

const form_main_tag = document.querySelector("#form-main")

form_main_tag.addEventListener("submit", (e) => {
	send_comment_func(e, {mode: "primary"})
})

/*simulate fetch from server api*/
/*
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
	})*/

comments_tag.textContent = "...loading..."
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
			//console.log(data.comments)
			comments_tag.textContent = ""
			make_tree_func(data.comments)
			return
		}
		throw new Error(data.error)
	})
	.catch((err) => {
		comments_tag.classList.add("comment__status_err")
		comments_tag.textContent = err
		console.error(err)
	})