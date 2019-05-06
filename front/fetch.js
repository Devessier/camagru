/**
 * This function saves a written comment through a HTTP call made with Fetch API
 * @param {Object} props 
 */
function saveComment (props) {
	const comment = {
		user: {
			id: 0,
			name: 'Baptiste',
			avatar: 'https://api.adorable.io/avatars/40/adwabott@adorable.io.png'
		},
		text: props.newComment,
		createdAt: +new Date
	}

	if (!Array.isArray(props.comments))
		props.comments = [ comment ]
	else
		props.comments.push(comment)
	props.loadComments = true
	props.newComment = ''
}