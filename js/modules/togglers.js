const toggle_reply_method = (e) => {
	e.preventDefault()
	const parent_tag = e.currentTarget.closest(".comment__inner")
	const btn_edit_tag = parent_tag.querySelector(".comment__btn-edit")
	
	if (parent_tag.classList.contains("comment__inner_expanded")) {
		parent_tag.classList.remove("comment__inner_expanded")
		btn_edit_tag.disabled = false
	} else {
		parent_tag.classList.add("comment__inner_expanded")
		btn_edit_tag.disabled = true
	}
}

const toggle_update_method = (e) => {
	e.preventDefault()
	const btn_tag = e.currentTarget
	const form_tag = btn_tag.closest(".comment__form-edit")
	const btn_reply_tag = form_tag.closest(".comment__inner").querySelector(".comment__btn-reply")
	
	if (form_tag.classList.contains("comment__form-edit_editing")) {
		form_tag.classList.remove("comment__form-edit_editing")
		btn_reply_tag ? btn_reply_tag.disabled = false : null
	} else {
		form_tag.classList.add("comment__form-edit_editing")
		btn_reply_tag ? btn_reply_tag.disabled = true : null
	}
}

export {toggle_reply_method, toggle_update_method}