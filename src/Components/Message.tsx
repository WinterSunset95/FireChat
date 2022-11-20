




const Message = ({ username, message, pos}:any) => {
	return (
		<div className={`m-1 rounded-md bg-black w-fit p-1 ${pos == 'left' ? '' : 'self-end'}`}>
			<span className={`text-white text-xs ${pos == 'left' ? '' : 'text-red-400'}`}>{username}</span>
			<div className="m-[0.5px] bg-[rgba(240,240,240,0.8)] rounded-sm p-1">{message}</div>
		</div>
	)
}

export default Message
