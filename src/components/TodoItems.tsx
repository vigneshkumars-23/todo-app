import React from 'react'
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa'
import { RiDeleteBinLine } from 'react-icons/ri'

interface TodoObject {
    key: number,
    id: number,
    text: string|undefined,
    isComplete: boolean,
    deleteTodo: (id: number) => void
    toggleChecked: (id: number) => void
};

const TodoItems: React.FC<TodoObject> = ({id, text, isComplete, deleteTodo, toggleChecked}) => {
  return (
    <div className='flex items-center my-3 gap-2'>
        <div className='flex flex-1 items-center cursor-pointer justify-between'>
           {/* <FaRegCircle />  */}
           <div className='flex items-center' onClick={() => toggleChecked(id)}>
                {isComplete ? (<FaCheckCircle className='w-8 h-6' color='#9333E9'/>)
                    : (<FaRegCircle className='w-8 h-6' color='#9333E9' />)
                }
                <p className={`text-slate-700 ml-4 text-[17px] ${isComplete? "line-through" : ""}`}>{text}</p>
           </div>
            <RiDeleteBinLine className='w-8 h-5 cursor-pointer' onClick={() => deleteTodo(id)}/>
        </div>
    </div>
  )
}

export default TodoItems