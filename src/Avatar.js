import React from 'react'

const Avatar = ({username, userId, online}) => {
    const colors = ['bg-blue-200', 'bg-yellow-200', 'bg-purple-200', 'bg-green-200', 'bg-pink-200', 'bg-teal-200', 'bg-red-200']
    const borders = ['border-blue-500', 'border-yellow-500', 'border-purple-500', 'border-green-500', 'border-pink-500', 'border-teal-500', 'border-red-500']
    const userIdbase10 = parseInt(userId,16);
    const colorIndex = userIdbase10 % colors.length;
    const borderIndex = userIdbase10 % colors.length;
    const color = colors[colorIndex];
    const border = borders[borderIndex];
  return (
    <div className={`w-8 h-8 ${color} rounded-full flex items-center relative border-2 ${border}`}>
        <div className='text-center w-full text-black'>{username[0].toUpperCase()}</div>
        {online && (
          <div className='absolute w-3 h-3 bg-green-600 bottom-0 right-0 rounded-full border border-white'></div>
        )}
        {!online && (
          <div className='absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white'></div>
        )}
    </div>
  )
}

export default Avatar
