import {build_html_func} from './build_html.js'

let queue = [null]

export const make_tree_func = (obj) => {
	while (true) {
		let last_in_queue = queue[queue.length - 1]
		let nested_comments = obj.filter(item => item.owner === last_in_queue)
		
		if (nested_comments.length) {
			let current = nested_comments[0]
			build_html_func(current, queue.length, last_in_queue)
			queue.push(current.id)
			//comments.splice(comments.findIndex(item => item.id === current.id), 1)
			obj = obj.filter(item => item.id !== current.id)
			
		} else {
			queue.pop()
		}
		
		if (!obj.length) {
			break
		}
	}
}