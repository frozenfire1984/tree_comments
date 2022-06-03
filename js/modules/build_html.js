import {
	max_depth,
	timeout_comment_highlight,
	max_length_letters_author,
	max_length_letters_comment,
	testing
} from './_global_params.js'

import send_comment_method from './send_comment.js'
import update_comment_method from './update_comment.js'
import open_edit_method from './open_edit.js'
import {autocomplete_textarea_method, update_textarea_method} from "./_testing_utils.js";

const build_html_method = (data, depth, owner_id, dynamic = false) => {
	const output_tag = document.querySelector("#comments")
	const tmpl_cont = document.querySelector("#template_comments").content.cloneNode(true)
	const root_tag = tmpl_cont.querySelector(".comment")
	const root_inner_tag = tmpl_cont.querySelector(".comment__inner")
	
	//comment primary
	const id_tag = tmpl_cont.querySelector(".comment__id")
	const author_tag = tmpl_cont.querySelector(".comment__author")
	const time_tag = tmpl_cont.querySelector(".comment__time")
	const body_tag = tmpl_cont.querySelector(".comment__body")
	
	//comment controls
	const details_tag = tmpl_cont.querySelector(".comment__details")
	const form_tag = tmpl_cont.querySelector(".form")
	const input_author_tag = tmpl_cont.querySelector(".input_author")
	const textarea_msg_tag = tmpl_cont.querySelector(".textarea_msg")
	const	id_hidden_tags = tmpl_cont.querySelectorAll("[name='comment_id']")
	const	depth_hidden_tag = tmpl_cont.querySelector("[name='comment_depth']")
	
	//comment update
	const form_edit_tag = tmpl_cont.querySelector(".comment__form-edit")
	const btn_edit_tag = tmpl_cont.querySelector(".comment__btn-edit")
	const textarea_edit_tag = tmpl_cont.querySelector(".comment__input-edit")
	const	edited_status_tag = tmpl_cont.querySelector(".comment__edited-status")
	
	const	slot_tag = tmpl_cont.querySelector(".comment__slot")
	
	root_tag.id = `comment_${data.id}`
	id_tag.textContent = data.id
	author_tag.textContent = data.author
	time_tag.textContent = new Date(parseInt(data.time)).toLocaleString()
	body_tag.textContent = data.body
	input_author_tag.setAttribute("maxlength", max_length_letters_author)
	textarea_msg_tag.setAttribute("maxlength", max_length_letters_comment)
	
	id_hidden_tags.forEach(tag => {
		tag.value = data.id
	})
	
	depth_hidden_tag.value = depth
	textarea_edit_tag.textContent = data.body
	textarea_edit_tag.setAttribute("maxlength", max_length_letters_comment)
	
	if (data.time_updated) {
		edited_status_tag.textContent = `edited ${new Date(parseInt(data.time_updated)).toLocaleString()}`
	}
	
	slot_tag.id = `slot_id_${data.id}`
	
	if (testing) {
		input_author_tag.setAttribute("list", "testing_datalist")
		
		//this using for fast update textareas while edit comment for testing
		textarea_edit_tag.addEventListener("focus",
			(e) => {
				update_textarea_method(e)
			}
		)
		
		//this using for fast complete textareas for testing
		textarea_msg_tag.addEventListener("focus",
			(e) => {
				autocomplete_textarea_method(e)
			}
		)
	}
	
	if (depth >= max_depth) {
		details_tag.remove()
	} else {
		form_tag.addEventListener("submit",
			(e) => {
				send_comment_method(e, {mode: "tree"})
			}
		)
	}
	
	if (depth > 1) {
		const parent_slot_tag = document.querySelector(`#slot_id_${owner_id}`)
		parent_slot_tag.appendChild(tmpl_cont)
	} else {
		output_tag.appendChild(tmpl_cont)
	}
	
	if (dynamic) {
		root_inner_tag.classList.add("comment__inner_new")
		setTimeout(() => {
			root_inner_tag.classList.remove("comment__inner_new")
		}, timeout_comment_highlight)
	}
	
	btn_edit_tag.addEventListener("click",
		(e) => {
			open_edit_method(e)
		}
	)
	
	form_edit_tag.addEventListener("submit",
		(e) => {
			update_comment_method(e)
		}
	)
}

export default build_html_method