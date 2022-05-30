import {comments_tag} from './global_vars.js'
import {comments} from './demo_data.js'
import {send_comment_func} from './send_comment.js'

const max_depth = 6
const new_status_timeout = 5000

export const build_html_func = (obj, depth, owner_id = comments[0].id, mode) => {
	const template_tag_content = document.querySelector("#template_comments").content.cloneNode(true)
	
	//console.log(depth)
	const tags_list = [
		".comment",
		".comment__id",
		".comment__author",
		".comment__time",
		".comment__details",
		".comment__form",
		".comment__body",
		"[name='comment_owner']",
		"[name='comment_owner_depth']",
	]
	
	const [
		root_tag,
		id_tag,
		author_tag,
		time_tag,
		details_tag,
		form_tag,
		body_tag,
		owner_h_tag,
		owner_depth_h_tag] = tags_list.map(tag => {
		return template_tag_content.querySelector(tag)
	})
	
	id_tag.textContent = `${obj.id} --- depth: ${depth}` //service for testing
	//id_tag.textContent = obj.id
	author_tag.textContent = obj.author
	time_tag.setAttribute("data-timestamp", obj.time)
	time_tag.textContent = new Date(obj.time).toLocaleString()
	body_tag.textContent = obj.body
	owner_h_tag.value = obj.id
	owner_depth_h_tag.value = depth
	root_tag.id = `comment_${obj.id}`
	root_tag.classList.add(`comment_depth_${depth}`)
	form_tag.id = `form_id_${obj.id}`
	
	if (depth >= max_depth) {
		details_tag.remove()
	} else {
		form_tag.addEventListener("submit",
			(e) => {
				send_comment_func(e, {mode: "tree"})
			}
		)
	}
	
	root_tag.setAttribute("data-owner", owner_id)
	
	if (mode.mode === "page_loading") {
		//console.info("page_loading")
		comments_tag.appendChild(template_tag_content)
		
		if (depth > 1) {
		
		}
	}
	
	if (mode.mode === "primary") {
		//console.info("primary")
		comments_tag.appendChild(template_tag_content)
		root_tag.classList.add("comment_new")
		setTimeout(() => {
			root_tag.classList.remove("comment_new")
		}, new_status_timeout)
	}
	
	if (mode.mode === "tree") {
		const nested_tags = document.querySelectorAll(`[data-owner='${owner_id}']`)
		if (nested_tags.length) {
			const last_nested_tags = nested_tags[nested_tags.length - 1]
			last_nested_tags.after(template_tag_content)
		} else {
			const owner_tag = document.querySelector(`#comment_${owner_id}`)
			owner_tag.after(template_tag_content)
		}
		
		root_tag.classList.add("comment_new")
		setTimeout(() => {
			root_tag.classList.remove("comment_new")
		}, new_status_timeout)
	}
}