import {comments} from './demo_data.js'
import {build_html_func} from './build_html.js'

let queue = [comments[0].id]

export const make_tree_func = (obj) => {
	while (true) {
		let last_in_queue = queue[queue.length - 1]
		let nested_comments = obj.filter(item => item.owner === last_in_queue)
		
		//console.log(queue.length)
		//console.log(queue.length < max_depth)
		
		if (nested_comments.length) {
			let current = nested_comments[0]
			
			build_html_func(current, queue.length, last_in_queue, {mode: "page_loading"})
			queue.push(current.id)
			//comments.splice(comments.findIndex(item => item.id === current.id), 1)
			obj = obj.filter(item => item.id !== current.id)
			
		} else {
			queue.pop()
		}
		
		if (obj.length === 1) {
			break
		}
	}
}