import build_html_method from './build_html.js'

const make_tree_method = (obj) => {
	let queue = [null]
	let comments = JSON.parse(JSON.stringify(obj))
	comments.sort((a, b) => a.time - b.time);
	
	while (true) {
		let last_in_queue = queue[queue.length - 1]
		let nested_comments = comments.filter(item => item.owner === last_in_queue)
		
		if (nested_comments.length) {
			let current = nested_comments[0]
			build_html_method(current, queue.length, last_in_queue)
			queue.push(current.id)
			comments.splice(comments.findIndex(item => item.id === current.id), 1)
			//comments = comments.filter(item => item.id !== current.id) //for testing, because while debug the comments arrayhandled by splice method don't show correctly
			
		} else {
			queue.pop()
		}
		
		if (!comments.length) {
			break
		}
		
		if (!queue.length) {
			throw new Error(`comment with id=${comments[0].id} have broken OWNER field` )
		}
	}
}

export default make_tree_method