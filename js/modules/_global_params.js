const comments_tag = document.querySelector("#comments")
const backend_url_base = "http://localhost/tree_comments/backend"
const max_depth = 10
const max_length_letters_author = 30
const max_length_letters_comment = 300
const timeout_status_opacity = 2000
const timeout_status_clear = 3000
const timeout_comment_highlight = 7000
const testing = false

export {
	comments_tag,
	backend_url_base,
	max_depth,
	max_length_letters_author,
	max_length_letters_comment,
	timeout_status_opacity,
	timeout_status_clear,
	timeout_comment_highlight,
	testing
}