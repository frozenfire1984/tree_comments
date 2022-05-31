import {comments_tag} from './global_vars.js'
import {send_comment_func} from './send_comment.js'

const max_depth = 6
const new_status_timeout = 5000

export const build_html_func = (obj, depth, owner_id, dynamic = false) => {
	const template_tag_content = document.querySelector("#template_comments").content.cloneNode(true)
	
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
		".comment__slot"
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
		owner_depth_h_tag,
		slot_tag] = tags_list.map(tag => {
		return template_tag_content.querySelector(tag)
	})
	
	//id_tag.textContent = `${obj.id} --- depth: ${depth}` //service for testing
	id_tag.textContent = obj.id
	author_tag.textContent = obj.author
	//time_tag.setAttribute("data-timestamp", obj.time)
	time_tag.textContent = new Date(obj.time).toLocaleString()
	body_tag.textContent = obj.body
	owner_h_tag.value = obj.id
	owner_depth_h_tag.value = depth
	root_tag.id = `comment_${obj.id}`
	//root_tag.classList.add(`comment_depth_${depth}`)
	form_tag.id = `form_id_${obj.id}`
	slot_tag.id = `slot_id_${obj.id}`
	
	if (depth >= max_depth) {
		details_tag.remove()
	} else {
		form_tag.addEventListener("submit",
			(e) => {
				send_comment_func(e, {mode: "tree"})
			}
		)
	}
	
	//root_tag.setAttribute("data-owner", owner_id)
	
	if (dynamic) {
		root_tag.classList.add("comment_new")
		
		setTimeout(() => {
			root_tag.classList.remove("comment_new")
		}, new_status_timeout)
	}
	
	if (depth > 1) {
		const owner_slot_tag = document.querySelector(`#slot_id_${owner_id}`)
		owner_slot_tag.appendChild(template_tag_content)
	} else {
		comments_tag.appendChild(template_tag_content)
	}
}