import {comments_tag, max_depth, timeout_comment_highlight, max_length_letters_author, max_length_letters_comment, testing} from './_global_params.js'
import send_comment_func from './send_comment.js'
import update_comment_func from './update_comment.js'
import open_edit_func from './open_edit.js'
import {autocomplete_textarea_func, update_textarea_func} from "./_testing_utils.js";

const build_html_func = (obj, depth, owner_id, dynamic = false) => {
	const template_tag_content = document.querySelector("#template_comments").content.cloneNode(true)
	
	const tags_list = [
		".comment",
		".comment__inner",
		".comment__id",
		".comment__author",
		".comment__time",
		".comment__details",
		".form",
		".input_author",
		".input_body",
		".comment__form-edit",
		".comment__body",
		".comment__btn-edit",
		".comment__input-edit",
		"[name='comment_id-for-edit']",
		"[name='comment_owner']",
		"[name='comment_owner_depth']",
		".comment__edited-status",
		".comment__slot"
	]
	
	const [
		root_tag,
		root_inner_tag,
		id_tag,
		author_tag,
		time_tag,
		details_tag,
		form_tag,
		input_author_tag,
		textarea_tag,
		form_edit_tag,
		body_tag,
		btn_edit_tag,
		textarea_edit_tag,
		id_for_edit_h_tag,
		owner_h_tag,
		owner_depth_h_tag,
		edited_status_tag,
		slot_tag
	] = tags_list.map(tag => {
		return template_tag_content.querySelector(tag)
	})
	
	//id_tag.textContent = `${obj.id} --- depth: ${depth}` //service for testing
	id_tag.textContent = obj.id
	author_tag.textContent = obj.author
	time_tag.textContent = new Date(parseInt(obj.time)).toLocaleString()
	body_tag.textContent = obj.body
	textarea_edit_tag.textContent = obj.body
	id_for_edit_h_tag.value = obj.id
	owner_h_tag.value = obj.id
	owner_depth_h_tag.value = depth
	root_tag.id = `comment_${obj.id}`
	form_tag.id = `form_id_${obj.id}`
	input_author_tag.setAttribute("maxlength", max_length_letters_author)
	
	textarea_tag.setAttribute("maxlength", max_length_letters_comment)
	textarea_edit_tag.setAttribute("maxlength", max_length_letters_comment)
	
	if (obj.time_updated) {
		edited_status_tag.textContent = `edited ${new Date(parseInt(obj.time_updated)).toLocaleString()}`
	}
	
	slot_tag.id = `slot_id_${obj.id}`
	
	if (testing) {
		input_author_tag.setAttribute("list", "testing_datalist")
		
		//this using for fast update textareas while edit comment for testing
		textarea_edit_tag.addEventListener("focus",
			(e) => {
				update_textarea_func(e)
			}
		)
		
		//this using for fast complete textareas for testing
		textarea_tag.addEventListener("focus",
			(e) => {
				autocomplete_textarea_func(e)
			}
		)
	}
	
	if (depth >= max_depth) {
		details_tag.remove()
	} else {
		form_tag.addEventListener("submit",
			(e) => {
				send_comment_func(e, {mode: "tree"})
			}
		)
	}
	
	if (depth > 1) {
		const owner_slot_tag = document.querySelector(`#slot_id_${owner_id}`)
		owner_slot_tag.appendChild(template_tag_content)
	} else {
		comments_tag.appendChild(template_tag_content)
	}
	
	if (dynamic) {
		root_inner_tag.classList.add("comment__inner_new")
		setTimeout(() => {
			root_inner_tag.classList.remove("comment__inner_new")
		}, timeout_comment_highlight)
	}
	
	btn_edit_tag.addEventListener("click",
		(e) => {
			open_edit_func(e)
		}
	)
	
	form_edit_tag.addEventListener("submit",
		(e) => {
			update_comment_func(e)
		}
	)
}

export default build_html_func