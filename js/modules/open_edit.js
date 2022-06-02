const open_edit_fun = (e) => {
	e.preventDefault()
	const btn_tag = e.target
	const form_tag = btn_tag.closest(".comment__form-edit")
	
	if (form_tag.classList.contains("comment__form-edit_editing")) {
		form_tag.classList.remove("comment__form-edit_editing")
	} else {
		form_tag.classList.add("comment__form-edit_editing")
	}
}

export default open_edit_fun